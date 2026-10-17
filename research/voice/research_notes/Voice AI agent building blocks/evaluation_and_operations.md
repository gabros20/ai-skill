# Voice AI Agents: Evaluation, Testing, Observability and Operations (as of October 2026)

Research date: 2026-10-17. Evidence labels used throughout:
- **[MEASURED]**: published methodology plus numbers (paper, open benchmark, or engineering blog that describes how it measured).
- **[VENDOR]**: written by a company that sells the tool or service it describes. Treat as a claim.
- **[ANECDOTAL]**: practitioner posts (DEV, Medium, Substack, agency blogs) with no stated methodology.
- **[DOCS]**: official framework or product documentation. Accurate about features, not about performance.

Search caveat: searches for Reddit and Hacker News threads returned no indexed threads from either site, so the practitioner signal below comes from DEV Community, Substack, agency blogs and vendor runbooks.

---

## 1. Metrics: what to measure and how it is defined

### Takeaway
No neutral, standard voice-to-voice latency benchmark exists. The working definition is "user stops speaking → first agent audio byte heard," tracked at p50/p95/p99. Production medians in the largest vendor dataset (1.4–1.7 s) sit far above the commonly quoted "<800 ms" target. Per-stage medians are a poor guide because stages overlap, so watch the tails (p95/p99). Turn-taking quality is best expressed as two opposing error rates: false yields and swallowed interruptions. Task completion in voice lags text badly; τ-Voice measured voice agents keeping only 30–45% of text-agent capability.

### Cited Findings

**Voice-to-voice latency: definition and measurement**
- Hamming defines end-to-end latency as "the total time from when a user finishes speaking until they hear the agent's response," computed as `firstAudioByte − userSpeechEnd`. Its target is "under 800ms," and it treats <500 ms as a long-term design goal. It recommends alerting on p95 degradation. [VENDOR, Jan 12 2026] — [Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it)
- Hamming's published production distribution, "drawing on 10M+ mins … across 10K+ voice agents," is P50 1.4–1.7 s, P90 3.3–3.8 s, P95 4.3–5.4 s, P99 8.4–15.3 s. The article does not say where measurement starts or how it sampled. [VENDOR, aggregate claim] — [Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it). A third-party piece cites the same 1.4–1.7 s P50 as coming from "4M+ production calls." The sample description conflicts with Hamming's own "10M+ mins." — [SoftwareSeni](https://www.softwareseni.com/voice-agent-latency-solved-enough-for-production-benchmarks-and-architecture-tradeoffs)
- Hamming's per-stage "latency stack," typical vs optimized: STT 200–400/100–200 ms; LLM 300–1000/200–400 ms; TTS 150–500/100–250 ms; network 100–300/50–150 ms; processing 50–200/20–50 ms; turn detection 200–800/200–400 ms; total 1000–3200/670–1450 ms. These ranges are not tied to the production dataset. [VENDOR] — [Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it)
- Coval recommends measuring from user speech end to agent speech start, under production conditions, and suggests a p95 below 1.5 s for real-time conversational AI. [VENDOR] — [Coval](https://www.coval.ai/blog/how-to-measure-voice-ai-latency-the-complete-guide/)
- Cekura warns that p95 only means something with enough turns, since a few slow outliers can dominate it. [VENDOR] — [Cekura](https://www.cekura.ai/blogs/voice-ai-latency-guide)
- Monobot proposes p95 <800 ms with explicit per-stage budgets for endpointing, STT finalization, LLM first token and TTS first byte. [VENDOR] — [Monobot](https://monobot.ai/library/blog/voice-latency-optimization/)
- LiveKit Cloud's agent dashboards show "Agent turn latency" with p50/p95. Pipeline stages overlap in time, so the stage segments "don't sum to the p50 or p95 values." The docs say to use the bars to compare agents and the percentiles for absolute latency. [DOCS] — [LiveKit observability](https://docs.livekit.io/agents/observability/)
- Platform-level p95 figures quoted in a 2026 roundup: Retell 920 ms and Bland 1,180 ms, each across 500 production calls (attributed to Tested Media). Vapi publishes a p95 <800 ms *target*, not a measurement. I could not open the underlying study, so this is secondary. — [Telnyx comparison / search summary](https://telnyx.com/resources/voice-ai-agents-compared-latency)

**Stage-level latency (STT, TTFT, TTFA)**
- Daily (Pipecat maintainers), Feb 13 2026: 10 STT services on 1,000 real-speech English samples (smart-turn-data-v3.1), played at real-time pace through a Pipecat pipeline in 20 ms chunks, with Silero VAD at a fixed 200 ms stop. "TTFS" is measured from the user's stop-speaking event to the last transcript segment. Median TTFS / WER: Deepgram Nova 3 247 ms / 1.62%; Soniox 249 ms / 1.29%; Speechmatics 495 ms / 1.07%. These three form the latency–accuracy Pareto frontier. Tests ran from one US location during US business hours. [MEASURED, open benchmark, authored by a framework vendor] — [Daily](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/)
- Daily's key operational point: STT services that support explicit *finalization* respond at about median latency. Services without it force the pipeline to wait about p95 on **every** turn. Pipecat 0.0.102 added `ttfs_p99_latency` on STT services to tune how long the aggregator waits. [MEASURED + DOCS] — [Daily](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/)
- The open-source `vox-bench` CLI reports p50/p95/p99/max per stage and combined. Its authors report, on their own healthcare corpus: Deepgram Nova-3 p95 245 ms, Claude Haiku TTFT p95 340 ms, ElevenLabs TTS p95 220 ms. They found TTS shows the most variance and that it depends on time of day. [MEASURED by one team, self-reported] — [DEV / vox-bench](https://dev.to/autor_tech/were-open-sourcing-our-voice-ai-latency-benchmarking-tool-3oa8)
- A 2026 TTS time-to-first-audio benchmark comparing Gradium, ElevenLabs, Cartesia and Deepgram exists, published by Gradium. [VENDOR] — [Gradium](https://gradium.ai/content/tts-latency-benchmark-2026)

**WER on the agent's own calls**
- Daily's "Semantic WER" uses an LLM judge (claude-sonnet-4-5) that asks of each transcription difference: "Would an LLM agent respond differently to these two versions?" Only "yes" counts as an error. Even the worst service had pooled Semantic WER under 4.4%, and every service succeeded on 99%+ of samples. The author admits the method is subjective. [MEASURED] — [Daily](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/)

**Interruption / barge-in / false-endpointing**
- Baseline from a production paper (Alibaba, Duplex Conversation, arXiv 2205.15060). A rule-based barge-in policy (streaming ASR partials above a confidence threshold = interruption) produced **89% false interruptions and 11% real barge-ins** on historical traffic. The authors list four causes of false barge-ins: no intent to interrupt (backchannels), noise, the agent hearing its own echo, and misplaced turns. [MEASURED] — [arXiv 2205.15060](https://arxiv.org/pdf/2205.15060)
- Practical metric pair: **false yields** (agent stops for a backchannel or noise) and **swallowed interruptions** (agent talks over a real barge-in). Tuning sensitivity trades one against the other. [VENDOR guidance] — [Decagon glossary](https://decagon.ai/glossary/what-is-backchanneling); [Deepgram](https://deepgram.com/learn/backchannels-vs-interruptions-voice-agents)
- Deepgram claims Flux cuts false interruptions by about 30% vs Nova-3, as relayed by Twilio. No methodology is published. [VENDOR] — [Twilio](https://www.twilio.com/en-us/blog/insights/ai-voice-agent-interruption-handling)
- PolyAI deployment data reportedly shows interruptions in about 1 in 5 calls, with 15–20% of callers talking over the agent at some point. This is secondhand and I could not trace it to a PolyAI primary source. — [search summary; Hamming runbook](https://hamming.ai/blog/voice-agent-interruption-handling-runbook)
- LiveKit's adaptive interruption handling runs a model over streaming audio during overlapping speech to decide whether a segment is a true interruption, so the agent can ignore brief acknowledgments. No detection rate is published. [DOCS] — [LiveKit adaptive interruption](https://docs.livekit.io/agents/logic/turns/adaptive-interruption-handling.md)
- Pipecat turn spans carry `turn.was_interrupted`, which gives an interruption rate per conversation directly from traces. [DOCS] — [Pipecat OpenTelemetry](https://docs.pipecat.ai/server/utilities/opentelemetry)

**Task completion, tool-call accuracy**
- **τ-Voice** (Ray, Dhandhania, Barres, Narasimhan; Sierra/Princeton; ICML 2026, PMLR v306) extends τ²-bench to full-duplex voice with 278 tasks. GPT-5 (reasoning) in text reaches 85% pass@1. Voice agents reach 31–51% on clean audio and 26–38% under realistic noise and accents, retaining "only 30–45% of text capability." The authors attribute 79–90% of failures to agent behavior. [MEASURED, peer-reviewed] — [PMLR](https://proceedings.mlr.press/v306/ray26a.html). *Conflict:* a search-engine summary claimed the ICML version revised these figures to 80% / 29–42% / 19–30%. The PMLR page I fetched shows 85% / 31–51% / 26–38%. Cite the PMLR figures. — [ICML poster](https://icml.cc/virtual/2026/poster/66590)
- Sierra folds τ-Voice into its newer τ³-Bench release. [VENDOR-authored benchmark] — [Sierra](https://sierra.ai/uk/blog/bench-advancing-agent-benchmarking-to-knowledge-and-voice)
- EVA-Bench scores complete tool-using voice agents on stateful enterprise scenarios and checks task completion with a database hash, separately from its judge metrics. VAmoS Bench (arXiv 2607.27453) uses live SQL-backed tool dispatch rather than mock tools. Both are known only from related-work citations; I did not verify their details. — [VAmoS Bench](https://arxiv.org/pdf/2607.27453)
- Full-Duplex-Bench family (Lin et al.): v1 (arXiv 2503.04721) covers pause handling, backchanneling, turn-taking and interruption. v1.5 covers overlap scenarios. v2 (arXiv 2510.07838) covers multi-turn with an automated examiner scoring correction handling and entity tracking. v3 (April 2026) covers tool use under real-world disfluency. [MEASURED, academic] — [GitHub](https://github.com/DanielLin94144/Full-Duplex-Bench); [v1](https://arxiv.org/html/2503.04721v1); [v2](https://arxiv.org/pdf/2510.07838)
- EchoChain (arXiv 2604.16456) targets state-update reasoning after an interruption. Its authors note that earlier benchmarks test timing but not whether the post-interruption answer is correct. — [arXiv 2604.16456](https://arxiv.org/pdf/2604.16456)
- Other 2026 turn-taking evaluation papers: TurnNat (2607.01345, automatic turn-taking naturalness), Instruct-FD (2607.20460, following turn-taking instructions), "Continue, Adapt, or Yield" (2609.13117, adapting to overlap within a turn), and Talking Turns (2503.01174, a supervised judge for when to speak, backchannel or yield). — [TurnNat](https://arxiv.org/pdf/2607.01345); [Instruct-FD](https://arxiv.org/html/2607.20460v1); [CAY](https://arxiv.org/pdf/2609.13117)

**Cost per minute**
- Cerebrium measured a self-hosted serverless-GPU stack at $0.02932/min for STT+LLM+TTS, roughly 3¢/min. [VENDOR, with breakdown] — [Cerebrium](https://cerebrium.ai/resources/voice-ai-agent-cost-per-minute)
- Industry roundup: managed stacks cost $0.12–$0.30/min end to end including telephony; self-hosted costs $0.03–$0.08/min once infrastructure is amortized. [ANECDOTAL/VENDOR] — [Smallest.ai](https://smallest.ai/blog/what-are-the-true-costs-associated-with-operating-a-voice-agent-at-scale); [TNW](https://thenextweb.com/news/the-economics-of-a-voice-agent-what-a-minute-of-conversation-actually-costs)
- Third-party (unofficial) figures: Retell bundled $0.07–$0.31/min; Vapi platform fee $0.05/min for orchestration only, with STT/LLM/TTS/carrier billed separately. Not verified against vendor pricing pages. — [Techsy (IT)](https://techsy.io/it/blog/prezzi-agenti-vocali-ia-2026)
- Pipecat LLM spans carry `gen_ai.usage.input_tokens/output_tokens` (plus cache and audio token breakdowns), and TTS spans carry `metrics.character_count`. LiveKit emits `lk.agents.usage.tts_characters`. Per-call cost can therefore be computed from traces. [DOCS] — [Pipecat](https://docs.pipecat.ai/server/utilities/opentelemetry); [LiveKit](https://docs.livekit.io/agents/observability/)

### Inferences
- The gap between "<800 ms" marketing targets and a 1.4–1.7 s production p50 (Hamming) suggests most published latency numbers are best-case lab measurements. A skill should tell users to report their own p50/p95/p99 voice-to-voice latency, measured at the user's ear (`firstAudioByte − userSpeechEnd`), and never to sum per-stage medians.
- STT finalization support changes whether you pay median or p95 on every turn (Daily), which makes it an important but under-discussed selection criterion.
- The 89% false-barge-in baseline shows why "interruption rate" alone means nothing. It has to be split into true barge-ins, backchannels, noise and echo using labeled calls.
- Containment/transfer rate and user sentiment have no neutral published baselines. They are platform analytics features, and the values are deployment-specific.

### Gaps
- No neutral, cross-vendor voice-to-voice p95 benchmark with published methodology was found. Telnyx's six-platform comparison figures could not be confirmed.
- No published, standard definition or benchmark for **false-endpointing rate** (cutting the user off mid-utterance). Practitioners tune it by feel; see §4.
- No reliable public baselines for containment rate, transfer rate, hallucination rate in voice, or sentiment accuracy.
- LiveKit's per-metric field definitions (EOU delay, transcription delay, TTFB) were not on the pages I fetched. The data-hooks/metrics page needs a direct read.

---

## 2. Testing: simulated callers, regression, load. Which tools are mature?

### Takeaway
Simulated-caller testing is now a crowded commercial category (Hamming, Coval, Cekura, Bluejay, Roark, Evalion, Cyara and others). Most players were founded in 2024–2025, are YC-backed, and publish little pricing. The only "independent" comparison was co-authored by a competitor. Platforms now ship native simulation: Vapi has Simulations, and LiveKit has text-mode unit tests plus Agent Simulations. Open-source options exist but are young and small. τ-Voice / τ²-bench is the most rigorous open benchmark harness.

### Cited Findings

**Commercial platforms (Speechmatics roundup, May 26 2026, pricing cutoff May 18 2026; Speechmatics is an STT vendor, and most rows restate vendor claims)** — [Speechmatics](https://www.speechmatics.com/company/articles-and-news/de-risk-your-voice-agent-11-best-voice-agent-testing-platforms)
- **Hamming**: voice-native QA covering latency, WER, barge-in, noise, telephony and red-teaming. Founded 2024, YC. Customers named: Podium, Grove AI, Mia Labs. Claims "4M+ calls tested." Tiers are visible but numeric pricing is not published. Integrates with LiveKit, Pipecat and Retell.
- **Coval**: simulation-first QA, CI regression, and OTel-native traces. Founded 2024, $3.3M seed (MaC, General Catalyst, YC). Pricing: Starter $100/mo, Growth $500/mo, Enterprise from $4,500/mo.
- **Cekura** (formerly Vocera): simulation, monitoring, CI and governance, including telephony metrics. YC. Developer plan $30/user/mo for 750 credits, plus a 7-day trial. Separately, Cekura quotes voice testing at $0.25/min with no monthly floor. — [Cekura](https://www.cekura.ai/blogs/coval-alternative)
- **Bluejay**: simulation, monitoring and replay. Founded 2025 (YC, Floodgate, Peak XV). Claims Google, DoorDash and Netflix as customers. Sales-led pricing.
- **Roark**: production observability that turns failed calls into test cases. Founded 2025 (YC, F-Prime). Claims Podium, Aircall and 10M minutes. Consumption pricing with a minimum spend.
- **Evalion**: simulation plus human review. Backed by 500 Global and ANIMO. Pricing not disclosed.
- **Cyara**: enterprise CX assurance (functional, regression, load). Founded 2006, $350M+ raised. The incumbent for contact-center load and regression testing.
- **Braintrust**: general LLM eval platform extended to voice audio tracing. Free tier, Pro $249/mo.
- Others named: SuperBryn, Tuner, TestZeus (Salesforce-only).
- Positioning consensus across roundups: Hamming is the audio-native, production-monitoring option; Cekura is the low-cost, fast-start option; Coval is the CI/CD-pipeline option. Every roundup is vendor- or competitor-authored. [VENDOR] — [Coval: Hamming vs Cekura](https://www.coval.ai/blog/hamming-vs-cekura); [Future AGI](https://futureagi.com/blog/voice-ai-simulation-cekura-hamming-bluejay-coval-2025/); [Maxim](https://www.getmaxim.ai/articles/best-voice-agent-evaluation-tools-in-2026/); [Bluejay listicle](https://resources.getbluejay.ai/blog/listicle/top-voice-ai-testing-platforms-2026-7d4577)

**"Testing the testers": the one human-judged comparison**
- arXiv 2511.04133 (Andres et al., v1 Nov 6 2025, v2 Jan 14 2026). 21,600 human pairwise judgments across 45 simulations, with Elo ratings, bootstrap CIs and permutation tests, plus 60-conversation ground-truth validation. Evaluation-quality F1 was 0.92 for Evalion vs a 0.73 average for the other two commercial platforms. Simulation quality was 0.61 vs 0.43. [MEASURED, conflicted] — [arXiv](https://arxiv.org/abs/2511.04133)
- *Conflict of interest:* Speechmatics lists Evalion's maturity signal as "academic co-authorship (arXiv:2511.04133)," so the winning platform's people co-wrote the paper. A roundup reports per-platform figures of 86.7% (Evalion) vs 75.7% (Cekura) vs 62.7% (Coval), with Hamming not assessed. I could not confirm those numbers on the arXiv abstract page. — [Speechmatics](https://www.speechmatics.com/company/articles-and-news/de-risk-your-voice-agent-11-best-voice-agent-testing-platforms); [search summary of roundup](https://futureagi.com/blog/voice-ai-simulation-cekura-hamming-bluejay-coval-2025/)

**Platform-native testing**
- **Vapi Simulations**: simulated testers with a personality and a scenario. One simulation = one scenario × one personality, and a suite groups simulations. Each run returns pass/fail, a transcript and a recording. No pricing found. [VENDOR/DOCS] — [Vapi](https://vapi.ai/blog/vapi-simulations)
- **Retell**: testing is part of the platform, and test minutes are billed like calls at the published per-minute rate. Retell also integrates with Future AGI simulation. [VENDOR] — [Retell](https://www.retellai.com/blog/voice-agent-testing-pricing)
- **LiveKit Agents**: unit tests (pytest/Vitest) "assert on messages, tool calls, and handoffs turn by turn," run locally or in CI, in **text mode**, which the docs call "a cost-efficient and deterministic way to test agent behavior." Multi-turn behavior (flow, memory, misuse resistance) goes to **Agent Simulations** with a simulated user. Simulations default to text and can run over audio for the full STT-LLM-TTS path. LiveKit recommends audio runs only for turn-taking and speech-specific issues. [DOCS] — [LiveKit testing](https://docs.livekit.io/agents/build/testing/)
- **Pipecat**: Daily's open STT benchmark harness runs audio through a real Pipecat pipeline in real time, which shows a pattern for audio-level regression tests. [MEASURED/DOCS] — [Daily](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/)

**Open-source options** (not verified against GitHub; check maintenance before adopting) — [search summary](https://langwatch.ai/voice-ai-agent-testing)
- **LangWatch Scenario**: an LLM user simulator plus a judge agent scoring against plain-language criteria. Runs in pytest/Jest/Vitest in CI. — [LangWatch](https://langwatch.ai/voice-ai-agent-testing)
- **voicetest**: imports agents from Retell, Vapi, Bland and LiveKit, runs simulations, and judges transcripts. Apache-2.0, about 8 stars. — [ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fvoicetestdev%2Fvoicetest)
- **fixa** (agents phone your agent; GitHub Actions/API), **NotHotDog** (MIT), **simulate-sdk** (Apache-2.0, about 59 stars), and **Egma** (markdown-defined tests). — [fixa](https://hunted.space/product/fixa-3); [NotHotDog](https://github.com/vedhsaka/nothotdog); [simulate-sdk](https://enterprisedna.co/directories/open-source/simulate-sdk)
- **tau2-bench** (Sierra Research): supports full-duplex voice via realtime providers. It is a benchmark harness rather than a CI tool. — [tau2-bench](https://docsearch.algolia.com/mcp/docs/repo/sierra-research/tau2-bench)
- Speechmatics lists Promptfoo, DeepEval, Langfuse, Helicone and Sipfront as open-source adjacent options. Sipfront is SIP/telephony test automation. — [Speechmatics](https://www.speechmatics.com/company/articles-and-news/de-risk-your-voice-agent-11-best-voice-agent-testing-platforms)

**Noise, accents, interruptions in simulation**
- τ-Voice shows that realistic noise and accents cut voice-agent pass@1 from 31–51% to 26–38%. Simulations on clean audio overstate quality. [MEASURED] — [PMLR](https://proceedings.mlr.press/v306/ray26a.html)
- Practitioner advice: test with coffee-shop, traffic and HVAC noise. One post claims studio audio "miss[es] 80% of production failures." The figure is unsourced. [ANECDOTAL] — [DEV](https://dev.to/callstacktech/how-to-prioritize-naturalness-in-voice-ai-implement-vad-ibo)

**Load / concurrency**
- Hamming claims "thousands of concurrent calls" with AI voice characters (self-reported). Cyara is the established enterprise load-testing incumbent. [VENDOR] — [Speechmatics](https://www.speechmatics.com/company/articles-and-news/de-risk-your-voice-agent-11-best-voice-agent-testing-platforms); [HackerNoon](https://hackernoon.com/7-of-the-best-voice-agent-testing-platforms-in-2026)

### Inferences
- Maturity ranking from the available signals: Cyara is mature but legacy-CX oriented. Hamming and Coval (2024) are the most-referenced voice-native tools. Cekura is the cheapest entry. Bluejay and Roark (2025) are newer. Open-source tools are early-stage.
- A layered test strategy follows from LiveKit's own split. Use deterministic text-mode unit tests for tool calls and handoffs in CI. Use simulated-caller multi-turn runs for flows. Keep audio-path runs, with noise, accents and barge-in, for turn-taking and ASR/TTS regressions, because they cost per minute.
- Judge quality is the hidden variable. The only human-validated comparison found judges disagreeing with humans at materially different rates across platforms, so any adopted tool's judge should be calibrated against a human-labeled sample.

### Gaps
- No independent, non-conflicted comparison of Hamming/Coval/Cekura/Bluejay/Roark exists. Hamming was excluded from the only human-judged study.
- Hamming, Bluejay, Roark and Vapi Simulations have no public numeric pricing. Prices above are dated May 2026 and may have changed by October 2026.
- No measured data on load-test methodology, such as how provider rate limits behave at N concurrent calls.

---

## 3. Observability: tracing STT→LLM→TTS, recording retention, OpenTelemetry, PII redaction

### Takeaway
Both major open frameworks emit OpenTelemetry. Pipecat produces a clean conversation → turn → stt/llm/tts span tree with TTFB, tokens and characters. LiveKit has OTel/OTLP export plus a hosted Agent Observability timeline with 30-day default retention and PII redaction that is off by default. Attribute names are framework-specific (`lk.*` vs `metrics.*` / `gen_ai.*`), so generic GenAI-span filters can drop the voice-specific spans. Redacting transcripts does not redact the audio. Audio redaction is a separate, language-limited step.

### Cited Findings

**Pipecat** [DOCS] — [Pipecat OpenTelemetry](https://docs.pipecat.ai/server/utilities/opentelemetry)
- Enable with `pipecat-ai[tracing]`, `setup_tracing()` with an OTLP exporter, `enable_tracing=True` and `enable_turn_tracking=True` on the worker, and `enable_metrics=True` in `PipelineParams`. Optional `conversation_id` and `additional_span_attributes`.
- Hierarchy: conversation span → turn spans → `stt`, `llm`, `tts` spans. Realtime speech-to-speech services use `llm_setup`, `llm_response` and `llm_tool_call`/`llm_tool_result` instead.
- Attributes: `metrics.ttfb` (seconds) on STT/LLM/TTS; `metrics.character_count` on TTS; `gen_ai.usage.input_tokens`/`output_tokens` plus cache and audio breakdowns on LLM; `turn.number`, `turn.duration_seconds`, `turn.was_interrupted`; `conversation.id`. STT spans carry `transcript` and `is_final`. LLM spans carry the serialized `input`/`output`, which matters for PII.
- Third-party guides show export to SigNoz, Langfuse and Jaeger. — [SigNoz Pipecat](https://signoz.io/docs/pipecat-monitoring/)

**LiveKit** [DOCS] — [LiveKit observability](https://docs.livekit.io/agents/observability/)
- SDK metrics include `lk.agents.turn.llm_ttft` and `lk.agents.usage.tts_characters`. Cloud dashboards show agent turn latency, latency distribution (p50/p95), interruptions, speech usage and tokens.
- Agent Observability requires Python SDK ≥1.3.0 or Node ≥1.0.18. The session timeline combines transcripts, traces, logs, audio and per-event metrics. Only project admins can read it.
- Recording: audio is recorded in the agent process with user and agent on separate channels. If noise cancellation is on, user audio is captured *after* it. On interruption the transcript keeps only the text that actually played. Control per session with `record={"audio": False}`. Egress is a separate pipeline to your own bucket.
- Retention: deleted 30 days after the session by default. Admins can "Download data" as a ZIP, and traces, logs and metrics come in OTLP JSON. The data region is fixed at project creation (EU available). **PII redaction costs nothing extra and is off by default.**
- A third-party claim that "Agents 1.8 follows full OTel GenAI semantic conventions and strips PII in-process" comes from a single agency blog and was not verified in LiveKit docs. — [Fora Soft](https://www.forasoft.com/blog/article/livekit-ai-agents-guide)
- Braintrust's LiveKit guide (as relayed) warns that LiveKit voice spans use `lk.*` attributes, and that filtering to standard AI spans drops the session, speaking and turn spans. — [vadim.blog](https://vadim.blog/voice-tracing-compared/)

**Cross-framework / backends**
- LangChain's `voice-agents-tracing` repo captures OTel spans from voice pipelines, enriches them with conversation metadata, and exports to LangSmith. — [DeepWiki](https://deepwiki.com/langchain-ai/voice-agents-tracing)
- Coval markets itself as "OTel-native." [VENDOR] — [Speechmatics](https://www.speechmatics.com/company/articles-and-news/de-risk-your-voice-agent-11-best-voice-agent-testing-platforms)

**PII redaction**
- AssemblyAI text redaction can replace entities with a hash ("Hi, my name is ####!") or an entity label ("[PERSON_NAME]"). Audio redaction is a separate option that beeps or silences the spans. Redacted audio files are available for only **24 hours** and only for **English and Spanish**. Redaction covers only the `text` property, so other features (entity detection, summaries) can still contain PII. [DOCS] — [AssemblyAI PII docs](https://www.assemblyai.com/docs/pii-redaction)
- Transcript redaction does not cover retained recordings: a stored WAV can still contain the spoken identifier. [VENDOR] — [AssemblyAI blog](https://www.assemblyai.com/blog/automatically-redact-pii-audio-video-python)
- Quoted add-on cost: about $0.08/hr for transcript redaction and $0.05/hr for audio redaction. Unverified against current pricing. [VENDOR] — [AssemblyAI policies blog](https://www.assemblyai.com/blog/pii-redaction-speech-to-text-api)

### Inferences
- PII leaks into at least four places: recordings, transcripts, LLM span `input`/`output` payloads, and derived artifacts such as summaries. Redaction has to be applied at each of them. Pipecat traces include serialized LLM input/output by default, so the tracing backend is itself a PII store.
- A tracing setup that keeps only `gen_ai.*` spans will lose turn-level timing in LiveKit, so voice dashboards should key on framework-specific attributes or a normalizing exporter.
- Per-turn `turn.was_interrupted`, `metrics.ttfb` and token/character counts are enough to build latency, interruption-rate and cost-per-call dashboards without a commercial tool.

### Gaps
- Deepgram's redaction behavior (audio vs text) was not found in results.
- Field definitions for LiveKit's EOU delay and transcription delay metrics, and whether LiveKit's PII redaction covers audio, were not on the fetched pages.
- No measured comparison of retention policies across Vapi, Retell and ElevenLabs was gathered.

---

## 4. Production failure modes reported by practitioners

### Takeaway
The recurring failures are false barge-ins (backchannels, noise and the agent's own echo triggering interruptions), double audio from duplicated interruption logic, TTS that keeps talking after barge-in, endpointing tuned too tight (cuts users off) or too loose (laggy), tail-latency spikes (mobile networks, cold starts, provider variance by time of day), TTS mangling numbers, emails and IDs (sometimes after a silent provider upgrade), dead air and context loss on transfer, and spend on voicemail or never-ending calls. Most evidence is anecdotal or vendor-written. The measured exceptions are the 89% false-barge-in baseline and TTS time-of-day variance.

### Cited Findings

**Double-talk, echo, self-interruption**
- Measured: echo is one of four named causes of false barge-ins (with backchannels, noise and misplaced turns) in a rule-based system that was 89% false. [MEASURED] — [arXiv 2205.15060](https://arxiv.org/pdf/2205.15060)
- Telephony pipelines that stream raw mic audio without AEC let the bot hear its own output. A third-party Pipecat filter guide recommends a reference-signal collector and a tuned correlation threshold. [ANECDOTAL/VENDOR] — [voiceclean guide](https://voiceclean.readthedocs.io/en/latest/pipecat-guide/)
- Pipecat's mitigations: interruptions are on by default, and "mute strategies" block user audio while the bot speaks. Release 0.0.78 added a setting, default on, to ignore emulated speech while the bot is talking. [DOCS] — [Pipecat interruptions](https://docs.pipecat.ai/pipecat/fundamentals/interruptions); [release 0.0.78](https://newreleases.io/project/pypi/pipecat-ai/release/0.0.78)
- "Double audio" race: configuring both native barge-in and manual interruption handlers causes overlapping playback, so use one. [ANECDOTAL] — [DEV](https://dev.to/callstacktech/implementing-real-time-streaming-with-vapi-build-voice-apps-3ehg)
- The agent keeps talking 2–3 s after an interrupt unless the TTS playback buffer is explicitly flushed. A default VAD threshold of 0.3 triggers on breathing. [ANECDOTAL] — [DEV](https://dev.to/callstacktech/implementing-vad-and-turn-taking-for-natural-voice-ai-flow-my-experience-1bdf)

**Endpointing too aggressive / too slow**
- Rule of thumb: if the bot cuts users off, raise the silence window to about 300 ms. If it feels laggy, lower it to about 200 ms, but first check STT, because "if Deepgram is taking >400ms for partials, the problem isn't VAD." [ANECDOTAL] — [DEV](https://dev.to/callstacktech/implementing-vad-and-turn-taking-for-natural-voice-ai-flow-my-experience-1bdf)
- Silence-based endpointing fails in loud environments because there is no real silence. Systems fall back to timeouts, which adds latency. [DOCS, Voiceflow] — [Voiceflow docs mirror](https://glama.ai/mcp/servers/@florinel-chis/voiceflow-doc-mcp/blob/dd1eccac05536155da291f9fb61c82caa8b32f16/data/voiceflow_docs/voice-input.md)
- Hamming lists turn-detection silence thresholds at 200–800 ms typical as a primary latency contributor. [VENDOR] — [Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it)

**Latency spikes**
- TTS shows the most variance of any stage, and the variance depends on time of day, which points to provider queueing. [MEASURED, one team] — [vox-bench](https://dev.to/autor_tech/were-open-sourcing-our-voice-ai-latency-benchmarking-tool-3oa8)
- STT without finalization forces a p95 wait on every turn. [MEASURED] — [Daily](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/)
- Cold starts add "500–2000ms" on serverless. Other causes: distant region, sequential (non-streaming) LLM→TTS, and long context. [VENDOR] — [Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it)
- Latency on 4G mobile spikes from 100 ms to 800 ms. [ANECDOTAL] — [DEV](https://dev.to/brains_behind_bots/building-ai-voice-agents-for-production-16ig)

**TTS mispronunciation (numbers, names, emails)**
- ElevenLabs says phone numbers, zip codes and emails "might be mispronounced," often because those items are missing from training data. It recommends normalization in prompts or preprocessing. [DOCS] — [ElevenLabs normalization](https://docs.cdntest.elevenlabs.io/best-practices/prompting/normalization)
- Silent regression: one case study describes an agent repeatedly misreading tracking numbers after a TTS provider changed its default normalization. Re-enabling number expansion fixed it. [ANECDOTAL/VENDOR] — [Dograh](https://www.dograh.com/feeds/blog/tts-number-formatting)
- Vapi auto-formats email characters for TTS, with API options to tune or disable this. [DOCS] — [Vapi email reading](https://docs.vapi.ai/assistants/email-address-reading)
- Deepgram documents common TTS pronunciation errors and fixes, and recommends testing many edge cases. [VENDOR] — [Deepgram](https://deepgram.com/learn/common-tts-pronunciation-errors)
- Normalization rule order matters: only the first matching rule applies to each word (e.g., foo.bar@gmail.com → "foo dot bar at gmail dot com"). Gradium's beta TTS claims native handling of phones, emails and IBANs. [VENDOR] — [Gradium](https://gradium.ai/content/text-normalization-tts-edge-cases-gradium); [RuntimeWire](https://runtimewire.com/article/gradium-opens-tts-beta-phone-numbers-emails-ibans)

**Context loss on transfer**
- When state is not captured before transfer, the human receives very little. The recommended handoff payload is a summary, caller intent, data already collected, and the escalation reason. [VENDOR] — [Retell](https://www.retellai.com/nl/blog/can-voicebots-escalate-calls-to-human-agents)
- A warm transfer adds 15–30 s and needs stable media bridging. Fill the consultation window with hold audio or a verbal acknowledgment. A failed SIP transfer should trigger a recovery message, not silence. [VENDOR] — [ConnexCS](https://connexcs.com/blog/the-ai-voice-agent-handoff-guide-triggers-context-and-sip-infrastructure)
- Warm transfer mechanics are SIP REFER + Replaces after a consultation call. Carrier REFER support is a prerequisite. [VENDOR] — [Dograh](https://www.dograh.com/feeds/blog/sip-refer-warm-transfer); [Bland docs](https://docs.bland.ai/tutorials/warm-transfer)

**Runaway cost**
- Controls: a hard max call duration plus an idle timeout that ends the call when neither side speaks. — [Zavu docs](https://docs.zavu.dev/guides/voice-agents/configuration). Speechify `max_call_duration_seconds`: if unset, only the plan-wide ceiling applies. — [Speechify](https://speechify.ai/blog/per-agent-max-call-duration)
- Voicemail: "every second your agent spends talking to a voicemail inbox is money burned." ElevenLabs uses LLM-based detection. Synthflow bills only up to detection plus a buffer and reports an 80% detection success rate. [VENDOR] — [ElevenLabs](https://elevenlabs.io/blog/voicemail-detection); [Synthflow](https://docs.synthflow.ai/docs/voicemail)
- Lower latency also cuts billed minutes, because faster turns shorten calls. [VENDOR argument] — [SoftwareSeni](https://www.softwareseni.com/voice-agent-latency-solved-enough-for-production-benchmarks-and-architecture-tradeoffs)

**Silent degradation**
- "Voice agents tend to degrade silently because nobody listens to the calls." The recommendation is to listen to 10–20 randomly sampled failed calls each week. [ANECDOTAL] — [Sessionize talk abstract](https://sessionize.com/s/abhisheksharma/building-voice-ai-that-doesnt-fall-apart-in-produc/178686)

**Multilingual switching**
- No sourced practitioner reports were found. Note that τ-Voice's "diverse accents" condition contributes to the clean→realistic drop. — [PMLR](https://proceedings.mlr.press/v306/ray26a.html)

### Inferences
- Three of the failure classes (echo, backchannels, noise) look the same in the logs: they all show up as "interruption." That is why labeled interruption review and AEC are prerequisites before tuning VAD or endpointing thresholds.
- Provider-side defaults can change underneath a deployed agent (the TTS normalization regression), so audio-level regression suites are needed even when the agent's own code has not changed.
- Runaway-cost controls (max duration, idle timeout, voicemail detection) belong in default configuration, not as optional extras.

### Gaps
- No indexed Reddit or HN threads were retrievable, so the practitioner signal is thin and mostly from DEV Community and vendor blogs.
- No GitHub issue directly documenting bot self-interruption from echo was found in Pipecat or LiveKit trackers.
- No sourced reports on multilingual mid-call language switching failures, or on two AI agents looping on each other.
- No measured false-endpointing rates.

---

## 5. Accessibility and UX

### Takeaway
The evidence base is thin and mostly older IVR research. Older adults struggle more with speech rate, option length and confusing choices. DTMF alongside speech is standard enterprise guidance for noisy settings and speech impairments. Read-back and confirmation of critical data (emails, numbers) is a documented prompt-level practice, paired with TTS normalization. An explicit request for a human should trigger immediate transfer.

### Cited Findings
- Older users rated IVR usability lower than younger users. Confusing choices, speech rate and option length caused most of their problems (citing Dulude 2002). [MEASURED, academic review] — [arXiv 1810.06828](https://arxiv.org/pdf/1810.06828)
- In a study of 22 students vs 22 seniors on six IVR tasks, 32% of older participants completed 5–6 tasks and half completed only 1–2. Difficulties were similar across ages, which suggests aging amplifies existing problems rather than creating new ones. [MEASURED, small study, secondary summary] — [Human Factors International](https://www.humanfactors.com/newsletters/press_8_for_natural_language.asp)
- Enterprise voice deployments should support both speech and DTMF for accessibility. Keypad input helps in noisy settings and for callers with speech impairments. [VENDOR] — [Cognigy](https://www.cognigy.com/glossary/what-is-dtmf)
- Voice removes keyboard motor-skill barriers but brings its own accessibility challenges. In a three-week study of five older adults using an Echo Dot, they preferred it to traditional devices, and discoverability was the key issue. [MEASURED, small] — [Mozilla Foundation](https://www.mozillafoundation.org/sw/research/library/accessible-voice-interfaces/); [UMD thesis](https://drum.lib.umd.edu/items/24c7fc9b-7882-43ce-8cfc-555df0ab5c0c)
- Confirmations: Vapi documents prompting the LLM to collect, read back and confirm emails. [DOCS] — [Vapi](https://docs.vapi.ai/assistants/email-address-reading)
- Human handoff: treat an explicit request for a human as an immediate transfer with no negotiation, fill the transfer window, and recover audibly on failure. [VENDOR] — [Famulor](https://www.famulor.io/blog/ai-voice-agent-call-transfer-to-a-human-the-2026-guide); [ConnexCS](https://connexcs.com/blog/the-ai-voice-agent-handoff-guide-triggers-context-and-sip-infrastructure)

### Inferences
- For critical data (amounts, emails, account numbers), two layers fit the evidence: deterministic normalization before TTS, then read-back in grouped chunks with explicit yes/no confirmation. DTMF entry is a fallback where ASR confidence is low or the environment is noisy.
- Speech rate and prompt length are most likely to hurt older callers. Exposing a configurable speaking rate and short, single-question prompts fits the IVR findings.

### Gaps
- No WCAG success criteria or standards text specific to voice agents or IVR were found. No recommended numeric speech-rate range (e.g., words per minute) was sourced.
- No sourced DTMF-fallback implementation patterns for LLM voice agents, and no measured effect of read-back confirmation on error rates.
