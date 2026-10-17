# Voice-agent orchestration frameworks (Pipecat, LiveKit Agents and alternatives), as of 2026-10-17

Method note: repository numbers (stars, forks, open issues, licence file, release tags/dates, last push, contributor count) were pulled directly from the GitHub API on 2026-10-17 with `gh api` (endpoints `repos/{r}`, `repos/{r}/releases`, `repos/{r}/license`, `repos/{r}/contributors`). GitHub's `open_issues_count` **includes open PRs**, and the contributor count is the last page of `contributors?per_page=1&anon=1`, which includes anonymous committers, so treat it as approximate. Pricing pages were fetched on 2026-10-17. Licence claims come from reading each repo's LICENSE file, not README badges.

Snapshot table (GitHub API, 2026-10-17):

| Repo | Stars | Forks | Open issues+PRs | Licence (LICENSE file) | Latest release (date) | Last push | ~Contributors |
|---|---|---|---|---|---|---|---|
| pipecat-ai/pipecat | 16,547 | 2,891 | 404 | BSD-2-Clause, "Copyright (c) 2024–2026, Daily" | v1.12.0 (2026-09-26) | 2026-10-17 | 366 |
| pipecat-ai/pipecat-flows | 626 | 118 | 13 | BSD-2-Clause | v1.4.0 (2026-07-05). **Repo archived** | 2026-07-05 | 16 |
| pipecat-ai/smart-turn | 1,622 | – | – | BSD-2-Clause | – | 2026-01-29 | – |
| livekit/agents (Python) | 14,775 | 3,949 | 753 | Apache-2.0 (plus a separate MODEL_LICENSE) | livekit-agents@1.8.8 (2026-10-15) | 2026-10-17 | 548 |
| livekit/agents-js (Node) | 942 | 398 | 446 | Apache-2.0 | @livekit/agents@1.9.3 (2026-10-15) | 2026-10-17 | 145 |
| TEN-framework/ten-framework | 11,173 | 1,367 | 249 | **Apache-2.0 + Agora additional conditions** (GitHub reports NOASSERTION) | 0.11.73 (2026-09-22) | 2026-10-17 | 91 |
| vocodedev/vocode-core | 3,804 | 656 | 1 | MIT | v0.1.114a2 (2024-08-07, alpha) | **2024-11-15** | 59 |
| fixie-ai/ultravox (model repo) | 4,580 | 386 | 63 | MIT | v0.6 (2025-08-18) | 2025-12-12 | 16 |
| bolna-ai/bolna | 796 | 374 | 156 | MIT | 0.10.303 (2026-10-16) | 2026-10-16 | 39 |
| jambonz/jambonz-feature-server | 104 | 78 | 244 | MIT ("Copyright (c) 2018-2024 FirstFive8, Inc.") | tag v0.9.14 (no GitHub Releases) | 2026-10-12 | 35 |
| openai/openai-agents-python | 30,093 | 4,941 | 10 | MIT | v0.24.0 (2026-10-15) | 2026-10-17 | 407 |
| openai/openai-agents-js | 3,923 | 986 | 12 | MIT | @openai/agents@0.20.0 (2026-10-08) | 2026-10-16 | 127 |

Source for all rows: GitHub API, e.g. [pipecat](https://github.com/pipecat-ai/pipecat), [pipecat-flows](https://github.com/pipecat-ai/pipecat-flows), [smart-turn](https://github.com/pipecat-ai/smart-turn), [livekit/agents](https://github.com/livekit/agents), [livekit/agents-js](https://github.com/livekit/agents-js), [ten-framework](https://github.com/TEN-framework/ten-framework), [vocode-core](https://github.com/vocodedev/vocode-core), [ultravox](https://github.com/fixie-ai/ultravox), [bolna](https://github.com/bolna-ai/bolna), [jambonz-feature-server](https://github.com/jambonz/jambonz-feature-server), [openai-agents-python](https://github.com/openai/openai-agents-python), [openai-agents-js](https://github.com/openai/openai-agents-js).

## Pipecat (and Pipecat Flows): architecture, maturity, Daily relationship, Pipecat Cloud

### Takeaway
Pipecat is a BSD-2 Python framework, copyrighted and maintained by Daily. Its model is a pipeline of frame processors. It reached 1.0 on 2026-04-14 and has shipped about a minor release every two weeks since then (12 minors by 2026-09-25). Pipecat Flows no longer ships as its own package: since pipecat-ai 1.5.0 (2026-07-04) it lives in core as `pipecat.flows`, and the standalone repo is archived. Pipecat Cloud is Daily's managed host, billed per agent-minute ($0.01–0.03/min by instance size, transport and telephony billed separately). Thoughtworks rates Pipecat "Assess" because it says self-hosting it in production takes a lot of platform work.

### Cited Findings
**Identity, licence and Daily relationship**
- The LICENSE file is BSD 2-Clause, "Copyright (c) 2024–2026, Daily". Pipecat-flows uses the same licence and holder — [GitHub LICENSE via API](https://github.com/pipecat-ai/pipecat/blob/main/LICENSE)
- The README describes it as "an open-source Python framework for building real-time voice and multimodal conversational agents… a full multi-agent system where specialists hand off, fan out in parallel, and coordinate over a shared bus, locally or distributed across processes and machines." It points to Daily (help@daily.co) for "Enterprise support… consulting and support agreements" — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- Pipecat Cloud pricing is published on daily.co, which shows the managed product is Daily's — [Daily: Pipecat Cloud pricing](https://www.daily.co/pricing/pipecat-cloud/)

**Architecture**
- From the README feature list: "Composable Pipelines: Build complex behavior from modular components"; "Multi-Agent Ready: Each pipeline is an agent. Compose them with handoff, parallel fan-out, sidecar workers, or distributed deployments"; "Real-Time… WebSockets or WebRTC" — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- Third-party summary (vendor blog): Pipecat is "pipeline-first", with composable processors in a directed graph. Parallel work such as sentiment analysis is done by forking the pipeline. It runs on localhost with remote provider keys and no media server, whereas LiveKit needs a local server, usually in Docker — [Chanl blog, 2026-04-03](https://www.channel.tel/blog/pipecat-vs-livekit-voice-framework-decision) (author's company sells agent testing and monitoring)
- A debugger, Whisker ("a real-time Pipecat debugger"), and a "Pipecat Skills" Claude Code marketplace for scaffolding and deploying to Pipecat Cloud are linked from the README — [Pipecat README](https://github.com/pipecat-ai/pipecat)

**Transports and providers (README service table, 2026-10-17)**
- Transports: Daily (WebRTC), FastAPI WebSocket, LiveKit (WebRTC), SmallWebRTCTransport, Vonage (WebRTC), WebSocket Server, WhatsApp, Local — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- Telephony serializers for WebSocket media streams: Exotel, Genesys, Plivo, Twilio, Telnyx, Vonage — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- LLMs: about 25 providers, including Anthropic, AWS, Azure, Gemini, Grok, Groq, Cerebras, Mistral, NVIDIA NIM, Ollama, OpenAI, OpenAI Responses, OpenRouter, Sarvam and Together — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- Speech-to-speech services: AWS Nova Sonic, Azure Voice Live, Gemini Multimodal Live, Grok Voice Agent, OpenAI Realtime, Ultravox — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- Video avatars: HeyGen, LemonSlice, Tavus, Simli. Analytics: OpenTelemetry, Sentry — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- Provider churn shows up as breaking changes. For example, 1.10.0 removed `LmntTTSService` because "LMNT has shut down", and changed the Speechmatics STT API in breaking ways (removed `TurnDetectionMode.FIXED/ADAPTIVE/SMART_TURN`) — [Pipecat CHANGELOG 1.10.0, 2026-09-11](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)

**Turn-taking, VAD and interruption**
- Smart Turn v3.2 is described as "an open source, community-driven, native audio turn detection model". It is BSD-2 and supports 23 languages. It "runs in as little as 10ms on some CPUs, and under 100ms on most cloud instances", in an 8 MB int8 CPU version or a 32 MB fp32 GPU version. It "works directly with PCM audio samples, rather than text transcriptions" and runs alongside Silero VAD, "only during periods of silence". Datasets, training script and weights are all open — [smart-turn README](https://github.com/pipecat-ai/smart-turn)
- A vendor blog contradicts this. It describes Pipecat's SmartTurn as "an LLM-based classifier on partial transcripts" and claims "~30% reduction in agent-talks-over-user events vs pure VAD" with no method given — [Chanl blog](https://www.channel.tel/blog/pipecat-vs-livekit-voice-framework-decision). The primary source above shows Smart Turn is audio-native, not transcript-based, so the blog is wrong on this point and its 30% figure is unsupported.
- Interruption edge cases keep surfacing in the changelog. For example, 1.12.0 "Fixed Flows node transitions where an interruption could leave the LLM…" in a bad state, and fixed realtime services resending server-VAD transcripts — [Pipecat CHANGELOG 1.12.0, 2026-09-25](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)

**Pipecat Flows (state and structured conversations)**
- "As of pipecat-ai 1.5.0, Pipecat Flows ships inside the core pipecat-ai package under the pipecat.flows namespace… This pipecat-ai-flows package is deprecated and frozen at its final release." Migration is an import rename (`pipecat_flows` → `pipecat.flows`); "the API is the same" — [pipecat-flows README](https://github.com/pipecat-ai/pipecat-flows) (repo archived per GitHub API)
- Pipecat 1.9.0 (2026-09-10) added `FlowConfig`, "which describes a Pipecat Flows conversation as data". It ships with a JSON schema (`src/pipecat/flows/flow_config.schema.json`) and YAML examples (`examples/flows/yaml/`) alongside Python flows "that show what needs code" — [Pipecat CHANGELOG 1.9.0](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)
- The `AGENTS.md` that `pipecat init` writes tells coding agents to build new flows with Pipecat Flows — [Pipecat CHANGELOG](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)
- Independent consultancy view: Pipecat Flows and LiveKit workflows "keep the LLM inside an explicit execution system with bounded, deterministic paths", which suits regulated, auditable voice agents — [WebRTC.ventures, 2026-03-20](https://webrtc.ventures/2026/03/choosing-a-voice-ai-agent-production-framework/)

**Observability**
- OpenTelemetry tracing is built in. Span attributes were moved to the "current OpenTelemetry GenAI semantic" conventions, and there are `enable_tracing`, `enable_usage_metrics` and `tracing_context` settings plus a `MetricsLogObserver` — [Pipecat CHANGELOG](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)

**Maturity and cadence**
- 1.0.0 shipped 2026-04-14 (after 0.0.108 on 2026-03-27), then 1.1.0 (04-27), 1.2.1 (05-15), 1.3.0 (05-28), 1.4.0 (06-16), 1.5.0 (07-04), 1.6.0 (07-21), 1.7.0 (08-01), 1.8.0 (08-26), 1.9.0 (09-10), 1.10.0 (09-11), 1.11.0 (09-17) and 1.12.0 (09-25). The CHANGELOG is about 18.2k lines — [Pipecat CHANGELOG](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)
- Thoughtworks Technology Radar Vol. 34 (published 2026-04-15) puts Pipecat in **Assess**. Its reasoning: it has "more framework flexibility but a less integrated production path" than LiveKit Agents, with gaps "in self-hosted deployment, transport reliability, and low-latency turn handling at scale"; "significant platform engineering work is required before it can be relied on for business-critical production workloads" — [Thoughtworks Radar: Pipecat](https://www.thoughtworks.com/radar/languages-and-frameworks/pipecat)
- Named users, as reported in a search summary of vendor and third-party comparisons: NVIDIA, Anthropic, Cresta, AWS, Mercor, ServiceNow — [Inworld comparison](https://inworld.ai/resources/vapi-vs-pipecat-vs-livekit) / [AssemblyAI comparison](https://www.assemblyai.com/blog/vapi-vs-pipecat-vs-livekit) (search snippet only, page not fetched, unverified)

**Pipecat Cloud pricing (daily.co, fetched 2026-10-17)**
- Hosting per active minute: agent-1x (0.5 vCPU / 1 GB) $0.01; agent-2x (1 vCPU / 2 GB) $0.02; agent-3x (1.5 vCPU / 3 GB) $0.03. "Reserved" (always-on, warm) instances cost $0.0005, $0.0010 and $0.0015 per minute respectively. Concurrency: "Unlimited" — [Daily: Pipecat Cloud pricing](https://www.daily.co/pricing/pipecat-cloud/)
- Transport: Daily WebRTC voice is "Free for 1:1 voice sessions" (a $0.001 figure is also shown; the page doesn't make the relationship clear). Voice+video is $0.004 per participant-minute. WebSocket is billed by your provider — [Daily: Pipecat Cloud pricing](https://www.daily.co/pricing/pipecat-cloud/)
- Telephony: Daily SIP dial-in/out $0.003–$0.02/min; Daily PSTN $0.018/min (SIP included; transcoding extra); SIP REFER $0.20 per event, and "the original call stays anchored to Daily", so minutes keep accruing during the transfer; Twilio billed by Twilio — [Daily: Pipecat Cloud pricing](https://www.daily.co/pricing/pipecat-cloud/)
- Krisp VIVA noise cancellation is free up to 10k active session-minutes/month, then $0.0015/min. Recording: audio $0.005/min, A/V $0.01349/min, storage $0.003/min. LLM/STT/TTS are billed by each provider ("bundled inference billing" available for enterprise) — [Daily: Pipecat Cloud pricing](https://www.daily.co/pricing/pipecat-cloud/)

### Inferences
- Pipecat's centre of gravity is a single vendor (Daily holds the copyright, offers support and runs the cloud), but the code is vendor-neutral. It ships LiveKit, Vonage and SmallWebRTC transports, so you can self-host Pipecat without Daily, and you can even run it on LiveKit's media layer.
- Folding Flows into core removes the version-matching problem that existed before 1.5.0. Teams on pre-1.5 Pipecat with the separate `pipecat-ai-flows` package have a small migration (import rename). Teams still on 0.0.x need a bigger one across the 1.0 boundary. A fast cadence with breaking changes in minor versions (as in 1.10.0) means you should pin versions in production.
- The SIP REFER detail matters for cost modelling. On Pipecat Cloud with Daily telephony, a "transferred" call keeps billing because the media stays anchored.

### Gaps
- No primary-source list of production Pipecat customers was fetched. The named users above come from a search snippet.
- I couldn't fetch Pipecat's core-concepts docs (`docs.pipecat.ai/getting-started/core-concepts` returned 404). The frame taxonomy (SystemFrame/DataFrame/ControlFrame), the mechanics of interruption propagation, and `ParallelPipeline` semantics therefore aren't cited from primary docs here.
- No Pipecat Cloud regions, cold-start figures or SLA were found on the pricing page.

## LiveKit Agents (Python/Node): architecture, turn detector, telephony/SIP, LiveKit Cloud pricing

### Takeaway
LiveKit Agents (Apache-2.0) runs agents as programmable participants in LiveKit WebRTC rooms, driven by an `AgentSession`. Its strongest pieces are what comes integrated: SIP and telephony, a turn detector on by default, adaptive interruption, MCP support, handoffs, and a built-in test/judge framework. Python is the flagship (14.8k stars, about 548 contributors, releases every few days in Oct 2026). Node trails it (942 stars). The turn-detector model weights are under a proprietary LiveKit Model License that allows use **only with LiveKit Agents**. LiveKit Cloud has four tiers: Build free, Ship from $50/mo, Scale from $500/mo, and Enterprise. Agent sessions cost $0.01/min over the included minutes.

### Cited Findings
**Architecture and features**
- From the README: "designed for building realtime, programmable participants". It mixes "STT, LLM, TTS, and Realtime API"; offers "Telephony integration… make calls to or receive calls from phones" via LiveKit's SIP stack; "Semantic turn detection: Uses a transformer model to detect when a user is done with their turn"; "MCP support… with one line of code"; and a "Builtin test framework: Write tests and use judges" (pytest examples) — [livekit/agents README](https://github.com/livekit/agents)
- Multi-agent handoff: a tool function returns the next agent (for example `return story_agent, "Let's start the story!"`), and agents can override the model per agent, "switching to Realtime API from standard LLMs" (`llm=openai.realtime.RealtimeModel(voice="echo")`) — [livekit/agents README](https://github.com/livekit/agents)
- LiveKit publishes a Docs MCP server and a "LiveKit Agent Skill" covering "workflow design, handoffs, tasks, and testing patterns" for coding agents — [livekit/agents README](https://github.com/livekit/agents)
- Third-party characterisation: LiveKit is "infrastructure-first". Rooms, track routing, egress/ingress, recording and SIP bridging come out of the box, and custom logic lives in lifecycle callbacks rather than pipeline nodes. Parallel side-tasks run as separate agent processes that coordinate through room events — [Chanl blog](https://www.channel.tel/blog/pipecat-vs-livekit-voice-framework-decision) (vendor). LiveKit's own comparison calls its framework "event-driven rather than pipeline-based" — [LiveKit field guide](https://livekit.io/field-guides/guide/livekit-vs-pipecat) (vendor, via search summary)

**Turn handling (docs, fetched 2026-10-17)**
- Modes are set through `turn_handling`. The turn detector model is the default and is "enabled automatically by `AgentSession`" (`inference.TurnDetector()`). The alternatives are `turn_detection="realtime_llm"` (server-side detection from OpenAI Realtime or Gemini Live, which can be combined with the turn detector), `"vad"`, `"stt"` (STT endpointing, e.g. AssemblyAI or Deepgram Flux, with VAD still handling interruptions) and `"manual"` (push-to-talk via `session.interrupt()`, `commit_user_turn()`) — [LiveKit docs: Turns](https://docs.livekit.io/agents/logic/turns/)
- Interruptions: the agent pauses and "truncates history to what the user actually heard". `interruption.mode` is `"adaptive"` (the default on LiveKit Cloud with most STTs) or `"vad"`. Adaptive mode "can distinguish true interruptions from conversational backchanneling". Other settings: `false_interruption_timeout` with `resume_false_interruption` (resumes by default), `min_duration`, `min_words`, `discard_audio_if_uninterruptible`, endpointing `min_delay`/`max_delay`, Python-only dynamic endpointing, and `user_turn_limit` (`max_words`, `max_duration`). With server-side realtime detection, `interruption.enabled=False` raises `ValueError` — [LiveKit docs: Turns](https://docs.livekit.io/agents/logic/turns/)
- The current turn detector is **audio** (`TurnDetector`, `v1` and `v1-mini`) and "encodes user audio directly", so no transcript is needed. It covers 14 languages. `v1` runs on LiveKit Inference in all regions, and `v1-mini` runs locally on CPU under the LiveKit Model License. If the model doesn't answer within about 1 s the turn commits anyway. Benchmarks live in an "eot-bench" repo — [LiveKit docs: Turn detector](https://docs.livekit.io/agents/logic/turns/turn-detector/)
- The previous **text** detector (`MultilingualModel`, Qwen2.5-0.5B-Instruct, 396 MB, about 50–160 ms/turn on CPU, under 500 MB RAM) is "deprecated and slated for removal in version 2.0". The vendor-reported per-language true-positive rate is 99.3–99.4% and the true-negative rate 85.10% (Italian) to 96.30% (Hindi), English 87.00% — [LiveKit docs: Turn detector](https://docs.livekit.io/agents/logic/turns/turn-detector/) (vendor figures, no external source named)
- A vendor blog says LiveKit uses "configurable VAD silence thresholds" for turn detection — [Chanl blog](https://www.channel.tel/blog/pipecat-vs-livekit-voice-framework-decision). LiveKit's own docs above contradict this (the default is a model-based detector), so the claim is outdated or wrong.

**Licence (verified from files)**
- The framework is Apache-2.0 (LICENSE). Turn detection models are covered by MODEL_LICENSE: "you may use these LiveKit models freely but can only use them together with the LiveKit Agents framework. You cannot use the LiveKit models on a standalone basis or with any other frameworks." The licence also states that derivative works "will be deemed the 'LiveKit Model'" — [livekit/agents MODEL_LICENSE](https://github.com/livekit/agents/blob/main/MODEL_LICENSE); [README licence section](https://github.com/livekit/agents)

**Maintenance**
- Python minor releases: 1.1.0 (2025-06-10), 1.2.0 (2025-07-17), 1.4.0 (2026-02-06), 1.5.0 (2026-03-19), 1.6.0 (2026-06-11), 1.7.0 (2026-08-20), 1.8.0 (2026-09-05). Patches 1.8.5–1.8.8 shipped between 2026-10-06 and 2026-10-15 — [GitHub releases](https://github.com/livekit/agents/releases)
- Node (agents-js) is at @livekit/agents 1.9.3 (2026-10-15) with plugins released alongside (xai, trugen, tavus) — [agents-js releases](https://github.com/livekit/agents-js/releases)
- A $100M Series C in January 2026 and users such as Salesforce, SAP and Zocdoc are reported on LiveKit's blog — [LiveKit blog](https://livekit.com/blog/best-open-source-voice-and-video-ai-agent-frameworks) (vendor; seen only through a search summary, not fetched)

**LiveKit Cloud pricing (livekit.com/pricing, fetched 2026-10-17)**
- **Build**: $0/mo, 1,000 agent-session minutes, 5 concurrent agent sessions, 1 deployment, 5,000 WebRTC minutes, 1 free US number with 50 inbound minutes, 1,000 third-party SIP minutes, $2.50 LiveKit Inference credit (about 50 min) — [LiveKit pricing](https://livekit.com/pricing)
- **Ship**: from $50/mo, 5,000 agent minutes then $0.01/min, 20 concurrent sessions, 2 deployments (+2 non-prod each), 150k WebRTC minutes then $0.0005/min, extra US numbers $1/mo, local inbound $0.01/min after 100, toll-free $2/mo + $0.02/min, third-party SIP $0.004/min after 5,000, Twilio/WhatsApp connectors $0.004/min, $5 inference credit — [LiveKit pricing](https://livekit.com/pricing)
- **Scale**: from $500/mo, 50,000 agent minutes then $0.01/min, up to 600 concurrent (the page also says "Starts at 50, request more via dashboard"), 4 deployments, 1.5M WebRTC minutes then $0.0004/min, SIP $0.003/min after 50,000, $50 inference credit, private links $50 each + $0.10/GB. **Enterprise**: custom — [LiveKit pricing](https://livekit.com/pricing)
- Platform features are metered too. Agent session recordings cost $0.005/min after the included minutes. Observability events cost $0.00003/entry after 100k / 500k / 5M included (Build / Ship / Scale). Voice isolation costs $0.0012/min after the included minutes. **Text simulations cost $0.02/turn and audio simulations $0.05/turn** (an eval product), marked "Free through Oct 31" in some columns — [LiveKit pricing](https://livekit.com/pricing)

### Inferences
- LiveKit's lock-in is mostly the model licence and the Cloud features, not the framework code. The framework is Apache-2.0 and self-hostable on OSS LiveKit server and SIP, but the default turn detector can't legally be carried to Pipecat or anything else. Its `v1` audio model runs on LiveKit Inference, so a fully self-hosted deployment either uses `v1-mini` or replaces the detector.
- LiveKit Cloud now sells evals (simulations) and observability per event/turn. Teams comparing it with Pipecat Cloud should compare the whole bill, not just the $0.01/min agent rate shared by LiveKit Ship/Scale and Pipecat agent-1x.
- The Python SDK gets features first (dynamic endpointing is "Python only"), so Node teams should expect lag.

### Gaps
- No independent latency or accuracy benchmark of LiveKit's audio turn detector versus Smart Turn was found. The eot-bench repo is referenced but wasn't examined.
- I didn't confirm when LiveKit Agents 1.0 was released (it is before 1.1.0 on 2025-06-10) or the planned date for 2.0.
- Self-hosting cost and operations for OSS LiveKit server plus SIP weren't researched.

## Alternatives: TEN Framework, Vocode, Ultravox, Bolna, Jambonz, OpenAI Agents SDK voice pipeline, which are maintained vs stale?

### Takeaway
Actively maintained: TEN (Agora), Bolna, Jambonz and the OpenAI Agents SDK. Stale: Vocode, whose last push was 2024-11-15, whose last release was an alpha in Aug 2024, and whose README is "actively looking for community maintainers". Ultravox's GitHub repo is a speech-LLM **model**, not an orchestration framework. Its commercial product is a hosted realtime API, which Pipecat wraps as an STS service. TEN's licence is **not plain Apache-2.0**: Agora's added terms forbid on-device deployment and uses that compete with Agora. OpenAI's `VoicePipeline` is a minimal STT→workflow→TTS wrapper with "no built-in interruption handling" and no transport.

### Cited Findings
**TEN Framework (Agora)**
- The LICENSE file reads: "The TEN Framework is licensed pursuant to the Apache License v2.0… with the following additional conditions". You "may not (i) host the TEN Framework or the Derivative Works on any End User devices, including but not limited to any mobile terminal devices or (ii) Deploy the TEN Framework in a way that competes with Agora's offerings and/or that allows others to compete with Agora's offerings, including without limitation enabling any third party to develop or deploy Applications". Deployment is "solely for your benefit and the benefit of your direct End Users"; "Copyright © 2025 Agora". GitHub's licence detector reports NOASSERTION — [TEN LICENSE](https://github.com/TEN-framework/ten-framework/blob/main/LICENSE)
- The ecosystem includes TEN Framework, Agent Examples, TEN VAD, TEN Turn Detection and a Portal. The examples support "both RTC and WebSocket connections", and there is a "SIP Call" extension. The quick start requires an Agora App ID and App Certificate plus OpenAI, Deepgram and ElevenLabs keys, Docker, and Node 18. Agents are graphs of extensions edited in "TMAN Designer" or `property.json`, with a Go API server and Python extensions — [TEN README](https://github.com/TEN-framework/ten-framework)
- Cadence: 0.11.70–0.11.73 between 2026-07-31 and 2026-09-22, still pre-1.0 — [TEN releases](https://github.com/TEN-framework/ten-framework/releases)

**Vocode**
- Last push 2024-11-15. Latest release v0.1.114a2 (2024-08-07, alpha); last stable v0.1.113 (2024-06-18). One open issue/PR. MIT, "Copyright (c) 2023 Ajay Raj" — [vocode-core](https://github.com/vocodedev/vocode-core)
- The README says: "We're actively looking for community maintainers, so please reach out if interested!" — [vocode-core README](https://github.com/vocodedev/vocode-core)

**Ultravox (Fixie)**
- The repo describes "a fast multimodal LLM designed for real-time voice interactions" that understands speech "without the need for a separate Audio Speech Recognition (ASR) stage" through a multimodal projector on open-weight LLMs (Llama, Mistral, Gemma). The default is built on Llama 3.3 70B, with an 8B variant. It currently "takes in audio and emits streaming text". News lists v0.7 (2025-12) on Hugging Face. "Ultravox Realtime" (ultravox.ai) is the hosted agent product. MIT — [ultravox README](https://github.com/fixie-ai/ultravox)
- Pipecat ships `UltravoxRealtimeLLMService` as a speech-to-speech service, with recent tool-calling fixes in 1.10–1.12 — [Pipecat CHANGELOG](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md); [Pipecat README](https://github.com/pipecat-ai/pipecat)

**Bolna**
- Very active: releases 0.10.300–0.10.303 all published on 2026-10-16. MIT. 796 stars, 156 open issues+PRs, about 39 contributors — [bolna](https://github.com/bolna-ai/bolna)

**Jambonz**
- `jambonz-feature-server` is MIT ("Copyright (c) 2018-2024 FirstFive8, Inc."). Latest tag v0.9.14, last commit 2026-10-12, 244 open issues+PRs, no GitHub Releases used — [jambonz-feature-server](https://github.com/jambonz/jambonz-feature-server)

**OpenAI Agents SDK voice**
- `VoicePipeline` "transcribes incoming audio… passes the text to your workflow… converts the workflow's output back to audio". It supports `AudioInput` (push-to-talk/complete clips) and `StreamedAudioInput` with "activity detection". Per the docs there is **no built-in interruption handling for streamed input**: "each detected turn starts a separate workflow run". The docs suggest using the `turn_started`/`turn_ended` lifecycle events, e.g. to mute the mic while the agent speaks. No transport layer is described. Realtime agents (`RealtimeAgent`/`RealtimeSession`) are documented as a separate section — [OpenAI Agents SDK: Voice pipeline](https://openai.github.io/openai-agents-python/voice/pipeline/)
- Maintenance: Python v0.24.0 (2026-10-15), about 407 contributors, 10 open issues+PRs. JS ships `@openai/agents-realtime` 0.20.0 (2026-10-08). Both MIT — [openai-agents-python](https://github.com/openai/openai-agents-python); [openai-agents-js](https://github.com/openai/openai-agents-js)

**Others seen**
- Cloud agent platforms set against the OSS frameworks: AWS Bedrock AgentCore ("recently added WebRTC support") and Google Vertex/ADK ("partial, WebSockets only" for realtime voice) — [WebRTC.ventures](https://webrtc.ventures/2026/03/choosing-a-voice-ai-agent-production-framework/)
- Managed voice platforms often compared with the frameworks: Vapi, Retell — [AssemblyAI comparison](https://www.assemblyai.com/blog/vapi-vs-pipecat-vs-livekit) (title only, not fetched)

### Inferences
- For a "maintained OSS orchestration framework" shortlist in Oct 2026, the realistic set is Pipecat, LiveKit Agents and TEN (licence-restricted), plus Bolna and Jambonz for telephony-centric needs. The OpenAI Agents SDK fits teams committed to OpenAI Realtime. Vocode should be treated as unmaintained.
- TEN's Agora conditions effectively rule it out for on-device or edge-on-handset agents and for anyone building a platform others deploy on (an agency, an ISV voice platform). That is a material difference from Pipecat (BSD-2) and LiveKit (Apache-2.0).
- Bolna's very high release counter (0.10.303) with several releases a day suggests automated per-merge releases. That is a sign of activity, not necessarily of stability.

### Gaps
- I didn't read Bolna's or Jambonz's docs and READMEs, so their architecture, providers, STS support and turn handling aren't cited. Known in general terms, Jambonz is a self-hostable SIP/CPaaS and Bolna an end-to-end telephony voice-agent stack, but neither description was verified this session.
- TEN Turn Detection and TEN VAD model licences weren't checked.
- The OpenAI Agents SDK Realtime agents pages (handoffs, guardrails, SIP and WebRTC transports) weren't fetched.
- Other candidates not researched: Microsoft/Azure Voice Live SDKs, Google ADK streaming, Rasa/Pipecat integrations, Vapi/Retell as managed platforms.

## How these frameworks support native STS models (OpenAI Realtime, Gemini Live) as well as cascades

### Takeaway
Both major frameworks treat speech-to-speech models as drop-in replacements for the STT+LLM+TTS trio inside the same agent abstraction. Pipecat does it as STS "services" in the pipeline: OpenAI Realtime, Gemini Live, Nova Sonic, Azure Voice Live, Grok, Ultravox. LiveKit does it with `RealtimeModel` as the session or per-agent `llm`. Each framework lets you combine the model's server-side turn detection with the framework's own detector. OpenAI's SDK separates the two: `VoicePipeline` is the cascade and `RealtimeAgent`/`RealtimeSession` is STS.

### Cited Findings
- Pipecat lists "Speech-to-Speech" services separately from STT/LLM/TTS: AWS Nova Sonic, Azure Voice Live, Gemini Multimodal Live, Grok Voice Agent, OpenAI Realtime, Ultravox — [Pipecat README](https://github.com/pipecat-ai/pipecat)
- Pipecat examples include OpenAI realtime "delegation" patterns (`realtime-openai-live-responses-delegation.py`, `realtime-openai-live-client-delegation.py`, `…-speaking-policy.py`). They pair a realtime voice model with a separate reasoning model or client-side delegation. The changelog also mentions a setting that "selects how much of the realtime input stream a user turn covers" — [Pipecat CHANGELOG 1.9.0](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)
- Recent Pipecat STS-related fixes: realtime services with their own tools (e.g. Ultravox `one_shot_selected_tools`) answering tool calls incorrectly; Ultravox async tool results not being reported; Inworld realtime resending server-VAD transcripts; Grok Voice PCM sample-rate handling; Gemini Live tracing errors — [Pipecat CHANGELOG](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)
- LiveKit: "any combination of STT, LLM, TTS, or realtime API can be used". A per-agent override can switch "to Realtime API from standard LLMs" (`openai.realtime.RealtimeModel`) during a handoff — [livekit/agents README](https://github.com/livekit/agents)
- LiveKit: `turn_detection="realtime_llm"` uses the realtime model's server-side detection (OpenAI Realtime, Gemini Live). "You can also pair the turn detector with a realtime model." With server-side detection you can't disable interruptions (`ValueError`) — [LiveKit docs: Turns](https://docs.livekit.io/agents/logic/turns/)
- OpenAI Agents SDK: `VoicePipeline` is the cascade (STT → `VoiceWorkflowBase` → TTS). Realtime agents are a separate documented section — [OpenAI Agents SDK: Voice pipeline](https://openai.github.io/openai-agents-python/voice/pipeline/)

### Inferences
- In both frameworks the STS path inherits fewer framework features than the cascade. Text-domain hooks such as transcript-based interruption filters (`min_words` needs STT), TTS-level text filtering and per-stage metrics either need a parallel STT or don't apply. The steady stream of STS-specific fixes in Pipecat's changelog suggests STS integrations are less battle-tested than the cascade services.
- Being able to switch between cascade and STS per agent (LiveKit handoff override, Pipecat service swap) makes a hybrid design practical: STS for open chit-chat, a cascade for tool-heavy or compliance-sensitive nodes.

### Gaps
- No primary source was found comparing feature parity (function calling, context truncation on interruption, transcript fidelity) between STS and cascade inside either framework.
- Gemini Live specifics in LiveKit (plugin name, limitations) weren't fetched.

## Practitioner verdicts: when teams pick Pipecat vs LiveKit vs a managed platform, and the migration pain reported

### Takeaway
The recurring verdict, mostly from vendor and consultancy blogs and one analyst, goes like this. Pick LiveKit when you need an integrated WebRTC/SIP media stack, multi-party rooms and a more turnkey production path. Pick Pipecat for pipeline-level control, transport neutrality (phone WebSocket serializers, any WebRTC) and permissive licensing everywhere, including the turn model. Pick a managed platform (Vapi, Retell) or a hyperscaler (Bedrock AgentCore, Vertex) when governance or time-to-market outweighs control. Switching frameworks is described as "real work, but not a rewrite" if prompts, tools and memory live outside the framework. No first-hand migration post-mortems were found.

### Cited Findings
- Thoughtworks (independent analyst, Radar Vol. 34, 2026-04-15): Pipecat gives "more framework flexibility but a less integrated production path" than LiveKit Agents, and "significant platform engineering work is required" for business-critical production. Ring: Assess — [Thoughtworks Radar](https://www.thoughtworks.com/radar/languages-and-frameworks/pipecat)
- WebRTC.ventures (consultancy, 2026-03-20): LiveKit suits "WebRTC-first architectures, SIP needs, and latency-sensitive deployments without building a separate media stack". Pipecat (Flows) suits "custom or self-hosted deployments, telephony and web voice agents, edge/IoT, and teams wanting vendor-neutral components". Bedrock and Vertex are rated strong on IAM and governance but "partial" on media handling and need an extra RTC stack. "Many production regulated deployments land" on a hybrid of cloud guardrails plus a media-first realtime stack — [WebRTC.ventures](https://webrtc.ventures/2026/03/choosing-a-voice-ai-agent-production-framework/)
- Forasoft (dev agency): "the audio transport should drive the choice". Pipecat for phone calls or custom transports, LiveKit Agents for multi-party WebRTC rooms or video. Switching later "is real work, but not a rewrite" — [Forasoft](https://www.forasoft.com/blog/article/pipecat-vs-livekit-agents) (via search summary, not fetched)
- Chanl (vendor of agent testing tools, 2026-04-03) warns that the wrong choice can mean "a full rewrite in six months". It argues the choice is recoverable if the "intelligence layer" (prompts, tools, memory, KBs, monitoring) sits outside the framework, so a switch mainly rewrites the pipeline definition and transport wrapper. Its cost table (Pipecat about $200–400 vs LiveKit Cloud about $500–800 at 10K min/month) is **unsourced and undated**, and its turn-detection descriptions are contradicted by primary docs (see above). Its star counts (Pipecat about 7K, LiveKit about 10K) are far below the 2026-10-17 API figures (16.5K / 14.8K) — [Chanl blog](https://www.channel.tel/blog/pipecat-vs-livekit-voice-framework-decision)
- The same blog cites Pipecat GitHub issues #3987 (deployment questions) and #3218 (multi-participant "known sync issues") — [Chanl blog](https://www.channel.tel/blog/pipecat-vs-livekit-voice-framework-decision) (issues not independently checked)
- LiveKit's own comparison says its event-driven design "tends to produce more resilient code as requirements evolve" and lists native SIP and built-in observability as advantages over Pipecat's reliance on third-party tools — [LiveKit field guide](https://livekit.io/field-guides/guide/livekit-vs-pipecat) (vendor, via search summary)
- Several comparisons say the STT/LLM/TTS providers matter more for latency and quality than the framework. Both reach sub-second latency with the same providers, but no benchmark is given — [Chanl blog](https://www.channel.tel/blog/pipecat-vs-livekit-voice-framework-decision); [search summary of Inworld/AssemblyAI/Plivo comparisons](https://www.plivo.com/blog/how-to-build-a-voice-ai-agent-livekit-pipecat-ten-or-native/)
- Pipecat and LiveKit aren't strictly either/or. Pipecat ships a LiveKit WebRTC transport (backed by `@pipecat-ai/livekit-transport` 1.0.0 on the client side) — [Pipecat README](https://github.com/pipecat-ai/pipecat); [Pipecat CHANGELOG](https://github.com/pipecat-ai/pipecat/blob/main/CHANGELOG.md)

### Inferences
- The lock-in points worth naming in a decision record: (1) the LiveKit turn-detector licence, which binds the model to LiveKit Agents; (2) LiveKit Cloud-only features (adaptive interruption is the default on Cloud, plus the simulations and observability products); (3) Daily-anchored telephony on Pipecat Cloud (SIP REFER keeps billing); (4) Flows and workflow definitions, which are framework-specific DSLs, although Pipecat's new `FlowConfig` YAML/JSON schema makes flows more portable as data.
- Most comparison content is written by parties with a commercial stake (LiveKit, Daily-adjacent, Chanl, Inworld, AssemblyAI, Plivo). The only independent assessments found were Thoughtworks and, partly, WebRTC.ventures (a consultancy that may sell implementation services on both).

### Gaps
- Searches found no Reddit, HN or Discord threads with first-hand migration accounts (Pipecat↔LiveKit, or from Vapi/Retell to a framework). The migration-pain evidence is entirely second-hand blog commentary.
- No independent cost comparison at scale (self-hosted LiveKit server vs Pipecat on own infra vs either Cloud) with dated pricing was found.
- I didn't fetch the AssemblyAI, Inworld, Plivo, thinnest.ai or autointerviewai comparison posts. Only their titles and search snippets were seen.
