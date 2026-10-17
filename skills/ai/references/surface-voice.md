# Surface: Voice (additive)

Purpose: **Additive overlay** for systems that listen and answer in audio. It stacks on
[chat-assistant](surface-chat-assistant.md) for live voice assistants and on
[autonomous-agent](surface-autonomous-agent.md) for call agents. A spoken turn is timed in
milliseconds and heard once, and that bends every job. **Turn-taking, not model choice, is the
craft.** Media transport is `backend`'s, call operations are `operate`'s, and disclosure and consent
law belongs to `success` and `marketing`.

Read when: the product takes or places calls or answers in speech (phone agents, voice
assistants, speech-to-speech (STS) builds), or the work is cascade-vs-STS, latency, end-of-turn
detection, or barge-in.

Skip when: the work is the audio transport (WebRTC, WebSocket, SIP, media streams), which is
`backend`'s; offline transcription with no live turn, which is
[surface-batch-and-pipeline](surface-batch-and-pipeline.md); or support-line policy or call-consent
law, which is `success`'s or `marketing`'s (this overlay builds the mechanics their rules require).

Inputs: the base surface; the languages spoken; whether calls are inbound or outbound; whether the
transcript is the system of record; how many tools there are and how strict their arguments are;
a p50/p95 latency target at the caller's ear; and the expected call minutes per month.

Produces: a per-node architecture call (§1), a turn-taking design (§2), a component pick and a
per-minute cost line (§3), a voice eval plan (§5), and the component-coverage line (Validation).

## Contents
- Architecture: cascade, native speech-to-speech, or hybrid
- Turn-taking: latency budget and interruption
- Speech components: language, finalization, billing unit
- Job impact table
- Voice evals at the caller's ear
- Guardrails on a call
- Licence flags in the voice stack

## Procedure

### 1. Architecture: cascade, native speech-to-speech, or hybrid
**Default to a streaming cascade** (speech-to-text → LLM → text-to-speech). It keeps the text layer,
which is where tool calling, model and voice choice, auditable transcripts, and per-language
quality live. **Choose a cascade** when the product needs any of these: a specific or cloned voice,
strict tool arguments, transcripts as the record, a lower-resource language, or a swappable LLM.
**Choose native STS** only when prosody and sub-second turns drive the product, tools are few, the
language is covered, and the vendor's voice catalog is acceptable. **Hybrid:** a duplex voice front
end hands reasoning and tools to a text model. OpenAI's GPT-Live guide (read 2026-10-17) says
"backend work can continue when the caller interrupts the assistant", and the application decides whether to
finish or cancel it. Make the call per node: STS for open conversation, a cascade or delegated text
model for tool-heavy or compliance-sensitive steps.

Budget for STS failure modes before you build:
- **Session caps.** Build reconnect and resumption from day one. Dated examples, read 2026-10-17
  (re-verify): OpenAI Realtime sessions end at 60 minutes, and the voice "cannot be modified" once
  the model has spoken. Gemini Live audio-only sessions end at 15 minutes without compression,
  and connections last about 10 minutes (ai.google.dev/gemini-api/docs/live-session).
- **Audio and transcript can diverge.** If the transcript is your audit record, run an independent
  STT tap on the agent's audio.
- **Interruption semantics differ by vendor**, so decide finish-or-cancel per tool.
- **Token-billed STS re-reads the conversation on every response.** Untruncated, total input grows
  roughly with the square of call length. That is derived from the billing model, not documented
  by any vendor. Truncate or compress the history, price cached input, or use per-minute billing.

### 2. Turn-taking: latency budget and interruption
**Latency is measured at the caller's ear**: the time from the end of user speech to the first
agent audio byte, at p50 and p95. Never sum stage medians, because the stages overlap. LiveKit's
docs say the stage segments "don't add up to the p50 or p95". The budget is endpointing + STT
finalization + LLM first token + TTS first byte + network, and **endpointing and LLM first token
dominate**. Every millisecond on a silence timer adds directly to response time. Lab targets are
best-case: one vendor's production aggregate, with its sampling method unstated, reports p50
1.4–1.7 s and p95 4.3–5.4 s (hamming.ai, read 2026-10-17). Report your own percentiles.

- **End-of-turn detectors come in three types.** Audio-native classifiers read prosody. Text
  detectors miss pauses and depend on the STT's language ID. STT-native detectors build the decision
  into the recognizer. Each type exposes a threshold that trades false turn-ends against latency,
  and the type decides language coverage and portability (§3, §7).
- **Eager end-of-turn turns latency into spend.** It comes "at the cost of 50-70% more LLM calls"
  (developers.deepgram.com/docs/flux/voice-agent-eager-eot, read 2026-10-17), so multiply the LLM
  line by about 1.5–1.7.
- **STT finalization decides which percentile you pay on every turn.** A service that finalizes
  explicitly responds at about its median. Without finalization the pipeline waits about the p95
  on every turn (daily.co/blog/benchmarking-stt-for-voice-agents, read 2026-10-17). Check this
  before tuning VAD.
- **History holds only what the caller heard.** On barge-in, truncate the unplayed reply. The
  playback primitives belong to `backend` (`surface-realtime.md`
  "Voice media transport — the substrate under a voice agent"). Measure barge-in as **two
  opposing error rates**. A *false yield* is stopping for a backchannel or noise. A *swallowed interruption* is talking over a real barge-in. In one
  production baseline, 89% of rule-based barge-ins were false, caused by no intent to interrupt,
  noise, echo, or misplaced turns (arxiv.org/pdf/2205.15060). Fix echo cancellation first, then
  label a sample by cause, then tune thresholds.

### 3. Speech components: language, finalization, billing unit
Judge components on these criteria, not on leaderboard rank.
- **STT:** true streaming partials, explicit finalization, built-in turn detection, language
  coverage *per mode*, the billing unit (audio-seconds, session-open time including idle, or
  per-request minimums), and the concurrency ceiling.
- **TTS:** first-byte latency, language, voice ownership and consent, and vendor survival. TTS
  "might" mispronounce phone numbers, zip codes and emails (ElevenLabs normalization guide), so
  normalize them in your own code before TTS. Keep the consented source recordings, and put the
  vendor behind an abstraction.

**Worked case: Hungarian (read 2026-10-17, re-verify).** Deepgram lists `hu` for Nova-3, but its
multilingual Flux model covers ten languages without it. Gemini Live's language list includes `hu`.
**The binding constraint is the turn detector.** LiveKit's audio detector lists 14 languages and
Smart Turn lists 23, and neither includes Hungarian. Validate an audio-native detector on your own
audio, or fall back to a tuned silence timer and accept the latency. No public Hungarian WER or MOS
evidence was found. Build a test set from real 8 kHz call audio covering numbers, names,
addresses, IBAN-style IDs, and "igen"/"nem". Re-run it on every vendor model change.

**Speech-layer cost (derived):** STT rate × full call minutes + agent talk share × ~750–800
characters per minute of audio (cartesia.ai/pricing, read 2026-10-17) × TTS rate per character.
Then add the LLM (×1.5–1.7 with eager end-of-turn), telephony, hosting, and any platform fee, all
at list prices dated at the vendor's page.

### 4. Job impact table
| Job | How this overlay bends it |
|---|---|
| [model-selection-and-routing](model-selection-and-routing.md) | Cascade, STS, or hybrid per node (§1). LLM first-token latency is the metric; keep effort low on the spoken path. |
| [prompt-and-context-engineering](prompt-and-context-engineering.md) | Context holds what was heard (§2). Ask one short question at a time and make the speaking rate configurable. On STS, truncate the history. |
| [structured-outputs](structured-outputs.md) | Critical data is normalized and spelled back before a tool consumes it (§6). |
| [tool-and-mcp-integration](tool-and-mcp-integration.md) | Slow tools run async while the agent keeps talking. Each tool states finish-or-cancel on barge-in. |
| [agent-construction](agent-construction.md) | Flows are nodes with per-node architecture. Keep prompts, tools, and memory outside the voice framework so a switch rewrites only the pipeline. Pin framework versions. |
| [retrieval-and-rag](retrieval-and-rag.md) | Retrieval runs inside the latency budget; a slow lookup runs async like a slow tool. |
| [memory](memory.md) | A transcript is not memory. Facts enter only through the governed write path (§2b). |
| [evaluation](evaluation.md) | Evals run on audio, at the ear, in noise, scored on tasks (§5). |
| [guardrails-and-safety](guardrails-and-safety.md) | Disclosure, opt-out, and handoff are deterministic checks outside the model (§6). |
| [observability-and-cost](observability-and-cost.md) | Turn spans cover STT, LLM, and TTS. Keep framework attributes: LiveKit's turn metrics use its own `lk.agents.*` names, so a `gen_ai.*`-only filter drops them. LLM spans can carry serialized input/output (Pipecat OTel docs), so the trace store is a PII store. PII lands in four places: recordings, transcripts, span payloads, and summaries. Redacting the transcript leaves the audio untouched. Hosted defaults vary: LiveKit Cloud keeps 30 days with redaction off (read 2026-10-17). |

### 5. Voice evals at the caller's ear
- **Latency** at the ear, p50/p95, over enough turns that outliers do not set the p95.
- **Turn-taking** as the false-yield and swallowed-interruption pair, from labeled calls.
- **Recognition** as WER on your own call audio, counting the errors that change the agent's action.
- **Task completion** against verifiable state, in noise and with accents. τ-Voice
  (proceedings.mlr.press/v306/ray26a.html) found voice agents at 31–51% on clean audio and 26–38%
  in realistic noise and accents, against 85% in text: 30–45% of text capability. A text pass does
  not predict a voice pass.
- **Layer by cost** (LiveKit testing docs, read 2026-10-17). Deterministic text-mode tests cover
  tools and handoffs in CI, simulated callers cover flows, and audio runs cover turn-taking and
  ASR/TTS regressions. Provider defaults change underneath you, so run the audio suite on a schedule.
- **Calibrate the judge on audio** against a human-labeled sample of your own calls before you trust
  a simulation tool's score ([evaluation](evaluation.md) §2). The independent gate is `quality`'s
  (`surface-ai-system.md` "Voice: evidence at the caller's ear").

### 6. Guardrails on a call
- **Disclose AI at the first interaction**, using a pre-rendered or cached greeting, never one
  generated after answer. Never claim to be human. The legal rules belong to `success`
  (`ai-support-policy.md` "AI voice support lines: disclose first, keep a person reachable") for support lines and to
  `marketing` (`lifecycle-and-email.md` "Outbound AI-voice calls are automated calls") for outbound consent.
- **Opt-out keywords and DTMF** are detected deterministically outside the LLM.
- **Spell back critical data.** Normalize it in code, read it back in grouped chunks, and require an
  explicit yes. Offer DTMF entry when ASR confidence is low or the line is noisy.
- **Human handoff.** An explicit request for a person transfers immediately. The handoff carries a
  summary, the intent, the data collected, and the reason (`success` `ai-support-policy.md`
  "AI voice support lines: disclose first, keep a person reachable").
- **Runaway-call guards are configuration:** a maximum duration, an idle timeout, and voicemail
  detection on outbound calls.

### 7. Licence flags in the voice stack
Lock-in sits in model licences and hosted features more than in framework code (LICENSE files read
2026-10-17):

| Component | Licence | Flag |
|---|---|---|
| Pipecat (framework) | BSD-2-Clause | Clean |
| Smart Turn (turn detector, code + weights) | BSD-2-Clause | Clean; portable across frameworks |
| LiveKit Agents (framework) | Apache-2.0 | Clean |
| LiveKit turn-detector weights | LiveKit MODEL_LICENSE | **"Only together with the LiveKit Agents framework"**, so the weights are not portable |
| TEN Framework | Apache-2.0 + Agora conditions | **No end-user-device deployment and no deployment competing with Agora**, so it is ruled out for on-device agents and for platforms that others deploy on |

Self-audit: 5 rows, 5 LICENSE files read. Name hosted-only features (default interruption modes,
per-turn evals, observability) in the decision record as lock-in too.

## Validation
- The base surface is named, each node's architecture call (§1) has a reason, and on STS the
  reconnect, truncation, and transcript tap are each built or marked N/A.
- Latency is reported at the ear (p50/p95), barge-in as the error pair, and costs at dated list
  prices; language is checked per mode; voice evals ran on noisy audio with a calibrated judge.
- **Component coverage**: every base-surface component (context management, retrieval, memory,
  tools/MCP, durable-execution owner, sandbox, approvals and action ledger, streaming/event
  contract, evals, guardrails, observability/cost) and every voice component (voice transport
  owner, turn detection, speech-to-text, text-to-speech, telephony) has a decision or "N/A because
  …". Telephony is N/A only for app-only voice.

## Failure modes and handoff
- **STS on a tool-heavy, audited flow.** Move those nodes to a cascade or a delegated text model (§1).
- **VAD tuned before finalization was checked**, or **one interruption rate tuned blind.** Check
  finalization and echo first, then label by cause (§2).
- **"90+ languages" trusted.** Coverage is per model and per mode, and that includes the turn
  detector (§3).
- **Handoffs.** Transport, codecs, and reconnect plumbing go to `backend` (`surface-realtime.md`
  "Voice media transport — the substrate under a voice agent").
  To `operate`: the latency SLI (`surface-ai-system.md` "Time-to-first-token is a distinct
  SLI from total duration"), per-minute cost and concurrency (`capacity-and-cost.md` "The
  2020s-specific version: agent and LLM spend scales with activity, not users"), and recording
  retention and redaction (`observability.md` "AI-system observability — same discipline, one
  new signal").
  Build-vs-buy of a voice platform goes to `architecture` (`surface-agentic.md` "Runtime
  ownership — build vs buy, thin clients, separate lifecycles"). Disclosure and consent go to
  `success` and `marketing`.
