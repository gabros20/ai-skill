# Managed voice-agent platforms (Vapi, Retell, ElevenLabs Agents, Bland, Synthflow, PolyAI, Sierra, Twilio ConversationRelay, OpenAI Realtime): build-vs-buy fact base, as of 2026-10-17

Method note: pricing pages for Vapi, Retell, ElevenLabs, Bland, Synthflow, PolyAI and Twilio were fetched on **2026-10-17**. Retell's model and price table was checked against the raw HTML (curl + grep), not only a summarizer. That check matters because summarizers have made up "latest model" tables before. The model names below (e.g. "GPT 6 Astra", "Claude 5.5 Opus") appear verbatim on Retell's live page. All prices are USD, list price, as fetched on 2026-10-17 unless another date is given. "Platform fee" means the vendor's own orchestration/hosting charge. "Pass-through" means STT/LLM/TTS/telephony that the vendor resells or passes on at cost.

## Q1. What each platform manages, BYO support, pricing structure, concurrency, compliance, retention, lock-in, maturity

### Takeaway
The market has split into three pricing models:
- **Unbundled orchestrators** (Vapi, Retell): a platform fee of $0.05–0.055/min, with STT/LLM/TTS/telephony itemized on top.
- **Bundled per-minute vendors** (Bland at $0.12–0.14/min with LLM/STT/TTS included; ElevenLabs Agents at $0.08/min with the LLM and telephony billed on top).
- **Sales-led enterprise vendors** (Synthflow enterprise from $30k/yr, PolyAI, Sierra), with no public per-minute price.

Compliance features are paid gates rather than defaults. Vapi charges $2,000/mo for HIPAA and limits its EU region to the Premier tier. ElevenLabs offers EU/India residency only under Enterprise controls.

### Cited Findings

**Vapi** (unbundled orchestrator)
- Platform fee is "$0.05/min Vapi hosting", and "Models pass-through at cost" on all plans — [Vapi pricing](https://vapi.ai/pricing) (2026-10-17)
- Pass-through ranges on the pricing calculator: Deepgram STT $0.0095–0.0099/min; OpenAI LLM $0.0077–0.0452/min; ElevenLabs TTS $0.0146–0.0238/min — [Vapi pricing](https://vapi.ai/pricing)
- Transport: Vapi Telephony/SIP free, Vapi WebSockets free, Daily WebRTC free. Twilio is $0.008/min inbound and $0.014/min outbound, Vonage $0.00814/min, Telnyx $0.0055/min. These are billed by the carrier, not by Vapi — [Vapi pricing](https://vapi.ai/pricing)
- Tiers:
  - **No Success Package**: $0 start, $5 free credits, 1 number, **4 concurrent calls**, **14-day** raw data retention, Discord/email support with no SLA.
  - **Core**: $29/mo; 5 numbers, **10 concurrent**, **30-day** retention, ZDR included, 2-business-day SLA.
  - **Pro**: "10% of Vapi hosting fee, $999/mo minimum"; 10 numbers, **30 concurrent**, **180-day** retention, RBAC + ZDR, 99% uptime SLA.
  - **Premier**: custom price, 99.9% uptime SLA, SSO, dedicated SIP.
  - Source: [Vapi pricing](https://vapi.ai/pricing)
- Add-ons: **HIPAA $2,000/month** (includes a BAA and DPA); extra concurrency **$10/line/month**; extra organizations $20/org/month — [Vapi pricing](https://vapi.ai/pricing)
- Vapi's own example for 1,000 min/mo: hosting $50 + STT $10 + LLM $8–45 + voice $15–24 + transport $0 = **$82–129/mo** — [Vapi pricing](https://vapi.ai/pricing)
- **EU region is available only with the Premier Success Package**. It runs as a separate, isolated environment (dashboard.eu.vapi.ai, api.eu.vapi.ai, sip.eu.vapi.ai), and every resource (assistants, tools, numbers, SIP credentials) belongs to one region — [Vapi docs: EU region](https://docs.vapi.ai/security-and-privacy/eu-region.md)
- Zero Data Retention:
  - ZDR is an org-level dashboard setting. Vapi does not keep recordings, transcripts, messages, summaries, structured outputs or detailed logs. Call history, cost and latency metadata are still kept.
  - ZDR "does not require a separate purchase."
  - **ZDR and HIPAA mode are mutually exclusive.** HIPAA mode instead stores recordings and logs in private storage under a BAA.
  - Source: [Vapi docs: ZDR](https://docs.vapi.ai/security-and-privacy/zero-data-retention.md); [Vapi docs: HIPAA](https://docs.vapi.ai/security-and-privacy/hipaa.md)
- Export/escape path under ZDR: Vapi tells customers to set up their own storage bucket and subscribe to the `end-of-call-report` webhook *before* enabling ZDR, "because once ZDR is active, any call content you do not send to your own systems cannot be recovered" — [Vapi docs: ZDR](https://docs.vapi.ai/security-and-privacy/zero-data-retention.md)
- The docs nav lists GDPR, HIPAA, ZDR, PCI and **SOC 2 Type II** compliance pages, plus TCPA consent guidelines, a recording-consent plan, static IPs and a proxy guide — [Vapi docs nav](https://docs.vapi.ai/customization/multilingual)
- The docs nav also lists 12 STT integrations (AssemblyAI, Azure, Cartesia, Deepgram, ElevenLabs, Gladia, Google, OpenAI, Soniox, Speechmatics, xAI and others) and LLM providers including Anthropic and Anthropic Bedrock. There are features for squads/handoffs, warm and blind transfers, call queues, versioning, traffic splitting, and "Understanding latency/cost" pages. A CLI is marked "(new)" — [Vapi docs nav](https://docs.vapi.ai/security-and-privacy/eu-region)
- Maturity signal: Vapi runs a user conference, VapiCon, on Nov 11–12 (2026 footer) — [Vapi pricing](https://vapi.ai/pricing). Vapi began as a pivot of the YC-backed app Superpowered in Nov 2023 — [TechCrunch](https://techcrunch.com/2023/11/10/yc-backed-productivity-app-superpowered-pivots-to-become-a-voice-api-platform-for-bots)

**Retell AI** (unbundled orchestrator)
- Headline: "$0.07–$0.31/min for AI Voice Agents", pay-as-you-go, $10 free credits — [Retell pricing](https://www.retellai.com/pricing) (2026-10-17)
- **Voice Infra platform fee: $0.055/min** — [Retell pricing](https://www.retellai.com/pricing)
- TTS per minute: Retell/Minimax/Fish/Cartesia/OpenAI/Inworld voices $0.015. ElevenLabs Flash $0.040, Multilingual v2 $0.06, v3 $0.10, v3 Conversational $0.08, v4 $0.10, v4 Turbo $0.08 — [Retell pricing](https://www.retellai.com/pricing)
- LLM per minute, standard / "Fast tier" (verified in raw HTML): Claude 5.5 Sonnet $0.064; Claude 5.5 Haiku $0.0032; Claude 5.5 Opus $0.128; GPT 5.1 $0.04/$0.08; GPT 5 mini $0.008/$0.016; GPT 4.1 mini $0.0128/$0.0192; GPT 6 Sol $0.064/$0.128; GPT 6 Astra $0.32/$0.64; Gemini 3.0 Flash $0.016; Gemini 3.1 Flash Lite $0.008. **Fast tier roughly doubles the LLM price** — [Retell pricing](https://www.retellai.com/pricing)
- Speech-to-speech via Retell: GPT Realtime / Realtime 1.5 $0.345/min; GPT Realtime 2 / 2.1 $0.38/min; Realtime mini / 2.1 mini $0.07/min — [Retell pricing](https://www.retellai.com/pricing). The page does not say whether these replace or add to the $0.055 infra fee (see Gaps).
- Telephony: $0.015/min via Twilio/Telnyx; **SIP trunking / custom telephony "No Charge"**; Retell numbers $2.00/month (custom numbers free); verified number $10 (the page contradicts itself: "/month" vs "one-time"); SMS $0.01/msg; Retell SMS $20/month — [Retell pricing](https://www.retellai.com/pricing)
- Concurrency: **first 20 concurrent calls free, then $8 per concurrency per month**; Enterprise custom "starting at 50+" — [Retell pricing](https://www.retellai.com/pricing)
- Knowledge base: $8/KB/month with the first 10 free, **plus $0.005/min when used** — [Retell pricing](https://www.retellai.com/pricing)
- Per-use add-ons: batch call +$0.005/dial; Branded Call +$0.10/outbound call; advanced denoising +$0.005/min; safety guardrails +$0.005/min; PII removal +$0.01/min; AI Quality Assurance free for the first 100 min, then **$0.10/min** — [Retell pricing](https://www.retellai.com/pricing)
- Retell's own worked example: LLM $0.04 + infra $0.055 + TTS $0.015 + telephony $0.00 + add-ons $0.00 = **$0.11/min**. Note the example sets telephony to $0 — [Retell pricing](https://www.retellai.com/pricing)
- Billing rules: per-second billing with no per-call rounding; failed connections are not billed; **billing continues during silence and hold**; after a transfer the AI fee stops but **telephony billing continues** — [Retell pricing](https://www.retellai.com/pricing)
- Compliance: "SOC 2 certified, HIPAA-ready, with SSO and custom compliance terms". The Enterprise table lists HIPAA/BAA, custom BAA/MSA/DPA, SSO and RBAC — [Retell pricing](https://www.retellai.com/pricing)
- Language: an agent defaults to English (US). The chosen language must be supported by both the voice provider and an ASR provider, and "the dashboard is the source of truth" for which combinations work. Retell advises against auto-detection for closely related languages — [Retell docs: language](https://docs.retellai.com/agent/language.md)

**ElevenLabs Agents ("ElevenAgents", formerly Conversational AI)** (bundled voice + platform)
- The API pricing page lists "Speech Engine – Agents: **$0.08 price per minute**", described as "Our speech models in one low-latency agent pipeline" — [ElevenLabs API pricing](https://elevenlabs.io/pricing/api) (2026-10-17)
- Tier table, as included minutes / additional per-minute / **burst** per-minute / concurrent calls: 15 / $0.080 / $0.160 / 4; 75 / $0.080 / $0.160 / 6; 275 / $0.080 / $0.160 / 10; 1,238 / $0.080 / $0.160 / 20; 3,738 / $0.080 / $0.160 / 30; 12,375 / $0.080 / $0.160 / 40 — [ElevenLabs API pricing](https://elevenlabs.io/pricing/api)
- Plan prices (monthly): Starter $6, Creator $22, Pro $99, Scale $299, Business $990; Enterprise custom, with "Elevated concurrency limits" and "BAAs for HIPAA customers" — [ElevenLabs pricing](https://elevenlabs.io/pricing). Matching the tier rows to plan names is inferred from their order; the page does not label them.
- Third-party claims, **not confirmed on ElevenLabs' own pages**:
  - The LLM is billed per minute on top, about $0.0005/min (GPT-5 Nano) to $0.0446/min (GPT-5.5).
  - Telephony is billed separately.
  - There is a "95% discount for silences longer than 10 seconds" (one source only).
  - Sources disagree on Business included minutes (12,375 vs 13,750).
  - Source: search summary across [getmacha](https://www.getmacha.com/blog/elevenlabs-agents-pricing-explained), [cloudzero](https://www.cloudzero.com/blog/elevenlabs-pricing/), [happyrobot](https://www.happyrobot.ai/hub/elevenlabs-pricing), [costbench](https://www.costbench.com/software/voice-ai-agents/elevenlabs-conversational/hidden-costs/)
- Managed scope: a native Twilio integration, SIP trunking, batch outbound calls, a knowledge base, analytics and evaluation, retention policy configuration, "Manage agents as code – CLI", versioning, and a TCPA disclosure page — [ElevenLabs Agents docs](https://elevenlabs.io/docs/eleven-agents/overview)
- **BYO LLM**: "Choose from supported LLMs or bring your own custom model"; a custom LLM connects through an endpoint plus credentials kept in secret storage — [ElevenLabs Agents docs](https://elevenlabs.io/docs/eleven-agents/overview); [ElevenLabs LLM docs](https://elevenlabs.io/docs/eleven-agents/customization/llm.md)
- Compliance (vendor claim): "SOC 2 Type II, ISO 27001, and PCI DSS Level 1 certified, with HIPAA and GDPR compliance", plus ISO 42001 and AIUC-1. Enterprise controls include **Zero Retention Mode** and **data residency across the US, EU, and India**, SSO, and "on-prem options" — [ElevenLabs Agents page](https://elevenlabs.io/agents)
- Component latency (vendor-reported): Flash v2.5 TTS "ultra-low 75ms latency"; v4 Turbo "median inference latency of ~100ms"; Scribe v2 Realtime STT "~150ms" — [ElevenLabs TTS docs](https://elevenlabs.io/docs/overview/capabilities/text-to-speech); [ElevenLabs API pricing](https://elevenlabs.io/pricing/api)

**Bland AI** (fully bundled)
- Start plan: $0 platform fee, **$0.14/min** talk time, **$0.05/min transfer**, **10 concurrent**, 100 calls/day and 100/hour, 1 voice, 10 KBs.
- Build plan: **$299/month**, **$0.12/min**, $0.04/min transfer, **50 concurrent**, 2,000/day and 1,000/hour, 5 voices.
- Enterprise: custom price, unlimited caps.
- Source: [Bland pricing](https://www.bland.ai/pricing) (2026-10-17)
- "LLM, speech-to-text, and text-to-speech" are included in the per-minute rate with "no token charges". Customers can bring their own telephony and avoid transfer fees; Bland's built-in Twilio is billed at pass-through cost — [Bland pricing](https://www.bland.ai/pricing)
- Enterprise: on-prem or VPC deployment, a dedicated orchestration server, data residency, and SMS and custom voice actor as Enterprise-only features — [Bland pricing](https://www.bland.ai/pricing)
- Compliance: SOC 2 Type I and Type II, HIPAA-eligible with BAA, GDPR, PCI DSS; documentation available under NDA on Enterprise — [Bland pricing](https://www.bland.ai/pricing)

**Synthflow** (moved upmarket)
- The pricing page now shows only Enterprise: "**Enterprise contracts start at $30,000 annually**", scoped on call volume, concurrency, telephony, integrations and security. It offers native telephony, SIP trunking, MSA/DPA, and implementation and launch support. Vendor claims: "65M+ voice calls every month in 30+ countries" and G2 4.5 from 1,000+ reviews — [Synthflow pricing](https://synthflow.ai/pricing) (2026-10-17). No self-serve per-minute tier was visible on the page.

**PolyAI** (enterprise, fully managed)
- Pricing is "on a per-minute basis, which includes proactive performance improvements, maintenance and 24/7 support". All plans include a "99.9% SLA for uptime on your phone lines" and 24/7/365 emergency support. No numbers are published (demo form only) — [PolyAI pricing](https://poly.ai/pricing) (2026-10-17)

**Sierra** (enterprise agent platform with voice)
- Voice product claims: "over 55 languages" with mid-conversation language switching; per-turn model routing ("Every turn is routed to the optimal model"); voice simulations for testing; agent-building with "Ghostwriter"; voice payments (card and ACH over the phone, with no IVR handoff); escalation to humans with full context — [Sierra voice](https://sierra.ai/product/voice). No public pricing (see Gaps).

**Twilio ConversationRelay** (build-light: Twilio runs telephony plus speech, you bring the LLM/app)
- **Conversation Relay $0.07/min**; Media Streams (raw audio fork for DIY pipelines) $0.0044/min; SIPREC $0.0044/min — [Twilio US voice pricing](https://www.twilio.com/en-us/voice/pricing/us) (2026-10-17)
- Underlying US voice rates: local calls $0.0140/min outbound and $0.0085/min inbound; toll-free $0.0140 outbound and $0.0220 inbound; browser/app and SIP interface $0.0040/min — [Twilio US voice pricing](https://www.twilio.com/en-us/voice/pricing/us)

**OpenAI Realtime API (speech-to-speech, native SIP)**
- Pricing as captured from OpenAI's page on 2026-07-13, per a third party: gpt-realtime-2.1 is $32/M audio-in tokens, $0.40/M cached audio-in, $64/M audio-out, and $4/$24 per M text in/out. gpt-realtime-2.1-mini is $10 / $0.30 / $20 and $0.60/$2.40 — [Fora Soft](https://www.forasoft.com/blog/article/openai-realtime-api-pricing). This is secondary; re-verify on openai.com/pricing.
- Third-party per-minute estimates vary widely: $0.06–0.11/min for the flagship with working caching versus $0.15–0.24/min without it — [Fora Soft](https://www.forasoft.com/blog/article/openai-realtime-api-pricing); [The Neuron](https://www.theneuron.ai/explainer-articles/openai-just-made-it-super-easy-to-build-voice-apps-that-actually-work)
- SIP calling launched with gpt-realtime GA (Aug 2025) — [The Neuron](https://www.theneuron.ai/explainer-articles/openai-just-made-it-super-easy-to-build-voice-apps-that-actually-work). Sources disagree on whether native SIP is production-grade or still beta; one recommends bridging through a carrier — [noqta](https://noqta.tn/en/blog/openai-gpt-realtime-voice-agents-sip-mcp-2026); [Fora Soft integration](https://www.forasoft.com/blog/article/openai-realtime-api-webrtc-sip-websockets-integration)
- Resold through Retell, the same models cost $0.345–0.38/min (flagship) or $0.07/min (mini) — [Retell pricing](https://www.retellai.com/pricing)

### Inferences
- **The platform layer in an unbundled stack is about $0.05–0.055/min** (Vapi, Retell). Self-building removes that fee, so it is the most a build can save at the orchestration layer. STT/LLM/TTS/carrier costs stay either way, unless the build also changes providers.
- **Retention and residency are bought, not configured.** On Vapi, 180-day retention needs Pro ($999/mo minimum), and the EU region needs Premier (custom price). An EU-based buyer with GDPR residency needs therefore lands in a sales contract on Vapi, and on ElevenLabs, whose EU residency sits under Enterprise controls. That makes the EU a stronger build trigger than the US.
- **Lock-in is lowest where telephony is BYO.** Retell (no charge for custom SIP or numbers), Bland (BYO telephony avoids transfer fees) and Vapi (free SIP, Twilio/Telnyx/Vonage) all let the number stay at the customer's carrier, so a migration only re-points the SIP trunk. Vapi's single-region model means an org cannot move between the US and EU regions in place; resources must be recreated.
- **Transcript export depends on webhooks.** Vapi's own guidance is to send end-of-call reports to your own storage. That is the practical export path, and it also hedges against the retention windows (14 or 30 days on lower tiers).
- **Bundled pricing (Bland) is predictable but opaque**: you cannot pick the LLM per call or see token costs. Unbundled pricing (Vapi/Retell) is transparent but has many line items.

### Gaps
- Vapi's published latency claims and figures were not captured (the docs have an "Understanding latency" page, which was not fetched). Retell's latency claims were not captured either.
- Retell's EU data residency and default retention period: not found. ElevenLabs' default conversation retention: not stated on the pages fetched.
- Whether Retell's speech-to-speech prices ($0.345–0.38/min) include or add to the $0.055 infra fee: not stated.
- Whether Retell supports a custom LLM over WebSocket: not verified in this pass. Vapi BYO keys for providers: the pricing page says "pass-through at cost", but the BYOK billing mechanics were not verified.
- Phone-number porting out of Vapi, Retell or ElevenLabs: no source found.
- Sierra pricing: no public source. Sierra is widely reported to price per outcome, but I found no citation in this pass. PolyAI per-minute rate: not public.
- **Google's offerings** (Gemini Live API pricing, Customer Engagement Suite / Conversational Agents telephony): not researched within the tool budget. Treat this as an open gap.
- Status-page uptime history and incident frequency for any vendor: not collected.
- Daily.co, Telnyx AI Assistants, Deepgram Voice Agent API, Voiceflow and Cartesia-hosted agents were not covered. They are candidate "others" for a later pass.

## Q2. True all-in cost per minute at small and medium volume, and where hidden costs appear

### Takeaway
At list price on 2026-10-17, a realistic US PSTN call with a mid-tier LLM costs about **$0.09–0.15/min all-in** on Vapi, Retell or ElevenLabs. Bland costs **$0.12–0.14/min** flat. Premium voices, Fast-tier LLMs, speech-to-speech models, compliance add-ons and per-minute QA can push a minute to **$0.25–0.50+**. Vendors' headline examples ($0.11/min at Retell, $0.082/min at Vapi) assume $0 telephony.

### Cited Findings
- Layered arithmetic. Every input comes from the vendor pages cited in Q1, dated 2026-10-17. "Twilio" uses Twilio's own US local rates: $0.0085/min in, $0.014/min out.

  | Stack (US PSTN, per min) | Platform | STT | LLM | TTS | Telephony | **Total** |
  |---|---|---|---|---|---|---|
  | Vapi, low (Vapi SIP) | 0.050 | 0.0095 | 0.0077 | 0.0146 | 0 | **$0.082** |
  | Vapi, high + Twilio outbound | 0.050 | 0.0099 | 0.0452 | 0.0238 | 0.014 | **$0.143** |
  | Retell vendor example | 0.055 | incl. | 0.040 (GPT 5.1) | 0.015 | 0 (BYO SIP) | **$0.110** |
  | Retell + Retell telephony | 0.055 | incl. | 0.040 | 0.015 | 0.015 | **$0.125** |
  | Retell + ElevenLabs Flash + Claude 5.5 Sonnet + KB | 0.055 (+0.005 KB) | incl. | 0.064 | 0.040 | 0.015 | **$0.179** |
  | Retell + GPT 6 Astra Fast + ElevenLabs v4 + PII + QA | 0.055 | incl. | 0.64 | 0.10 | 0.015 (+0.01 PII, +0.10 QA) | **$0.92** |
  | ElevenLabs Agents + small LLM + Twilio inbound | 0.080 | incl. | ~0.005–0.045 (3rd-party) | incl. | 0.0085 | **~$0.094–0.134** |
  | Bland Start / Build | 0.14 / 0.12 all-in | incl. | incl. | incl. | BYO or pass-through | **$0.12–0.14** (+$0.04–0.05/min transferred) |
  | Twilio ConversationRelay + own LLM | 0.07 + 0.0085 inbound | incl. (inference) | your LLM | incl. (inference) | incl. | **~$0.08 + LLM** |

  Sources: [Vapi](https://vapi.ai/pricing), [Retell](https://www.retellai.com/pricing), [ElevenLabs](https://elevenlabs.io/pricing/api), [Bland](https://www.bland.ai/pricing), [Twilio](https://www.twilio.com/en-us/voice/pricing/us)
- **Small volume (1,000 min/mo):** Vapi's own estimate is $82–129/mo — [Vapi](https://vapi.ai/pricing). Retell at $0.125/min is about $125 plus $2/number. ElevenLabs on the Creator ($22, 75 min included) or Pro ($99, 275 min) plan pays the extra minutes at $0.08 — [ElevenLabs](https://elevenlabs.io/pricing/api). Bland Start: $140.
- **Medium volume (20,000 min/mo):**
  - Vapi at about $0.105 average is ~$2,100 + $29 Core; +$2,000/mo if HIPAA — [Vapi](https://vapi.ai/pricing).
  - Retell at $0.125 is ~$2,500, with concurrency free up to 20 — [Retell](https://www.retellai.com/pricing).
  - Bland Build: $299 + 20,000 × $0.12 = $2,699 — [Bland](https://www.bland.ai/pricing).
  - ElevenLabs Business: $990 includes 12,375 min, plus 7,625 × $0.08 = $610, plus LLM and telephony — [ElevenLabs](https://elevenlabs.io/pricing/api).
- Hidden or surprise cost points, from vendor pages:
  - **Concurrency:** ElevenLabs charges **burst pricing at $0.16/min (2×)** above the tier's concurrency — [ElevenLabs](https://elevenlabs.io/pricing/api). Vapi charges $10/line/mo beyond the plan's 4/10/30 lines; Retell $8 per concurrency per month beyond 20 — [Vapi](https://vapi.ai/pricing), [Retell](https://www.retellai.com/pricing).
  - **Premium voices:** ElevenLabs voices through Retell cost $0.04–0.10/min versus $0.015 for platform voices (up to 6.7×) — [Retell](https://www.retellai.com/pricing).
  - **LLM "Fast tier"** doubles LLM cost on Retell — [Retell](https://www.retellai.com/pricing).
  - **Silence and hold are billed** on Retell, and telephony keeps billing after an AI transfer — [Retell](https://www.retellai.com/pricing). Bland charges $0.04–0.05/min for transfers — [Bland](https://www.bland.ai/pricing).
  - **Per-feature metering** on Retell: KB +$0.005/min, PII +$0.01/min, denoise +$0.005/min, guardrails +$0.005/min, **AI QA $0.10/min**, branded caller ID $0.10/call — [Retell](https://www.retellai.com/pricing).
  - **Compliance:** Vapi HIPAA is $2,000/mo flat — [Vapi](https://vapi.ai/pricing).
  - **Retention:** longer data retention needs a higher Vapi tier (14 → 30 → 180 days) — [Vapi](https://vapi.ai/pricing).
  - **Carrier:** toll-free inbound on Twilio costs $0.022/min, 2.6× local — [Twilio](https://www.twilio.com/en-us/voice/pricing/us).
- Third-party claim, attribution uncertain (it came from a search summary over vendor-adjacent comparison blogs): Vapi's headline of about $0.05–0.13/min "jumps to $0.23–0.33/min" once BYOK model and STT/TTS are added — [particula](https://particula.tech/blog/vapi-vs-retell-vs-livekit-vs-pipecat-voice-agent-platform) / [inworld (vendor-written; Inworld sells TTS)](https://inworld.ai/resources/vapi-vs-pipecat-vs-livekit). This conflicts with Vapi's own calculator range ($0.082–0.129 before telephony), so treat it with caution.

### Inferences
- The **LLM and TTS choice moves the price more than the platform choice**. Swapping GPT 5 mini ($0.008) for Claude 5.5 Sonnet ($0.064) on Retell adds $0.056/min, which is more than Retell's whole infra fee.
- At 20k min/mo, Vapi's $2,000 HIPAA add-on adds about **$0.10/min**, roughly doubling the per-minute cost. Healthcare at small or medium volume is where managed economics break first.
- ElevenLabs' **effective rate is flat at $0.08/min across plans**; tiers buy included minutes and concurrency, not a discount. Concurrency spikes are the main cost risk because of the 2× burst rate.
- Bland's flat price is competitive with unbundled stacks running a mid or premium LLM. It is more expensive than an unbundled stack with a cheap LLM and platform TTS ($0.08–0.10).

### Gaps
- ElevenLabs Agents LLM pass-through rates and the silence discount come only from third parties; they are not confirmed on an ElevenLabs page.
- Non-US carrier rates (e.g. Hungary/EU DIDs and termination) were not collected. EU PSTN termination usually costs more than US rates; this is not sourced here.
- Volume discounts at the Enterprise tiers of every vendor: not published.

## Q3. When do practitioners outgrow a managed platform and move to Pipecat/LiveKit, and why?

### Takeaway
The evidence is mostly vendor-written or vendor-adjacent comparison blogs, not first-hand practitioner reports. Those sources put the break-even somewhere between **about 10k and 50k+ minutes/month**, with claimed savings of 60–80% per minute. Self-building means taking on latency tuning, telephony and uptime yourself. Independent practitioner evidence (Reddit/HN threads describing a migration) was not found in this pass.

### Cited Findings
- Sources disagree on the threshold. One says that above about 50K min/month, building on LiveKit or Pipecat "saves 60–80% on per-minute cost", but you then own latency tuning, telephony and uptime. Another puts the break-even at about 10k min/month. These come from a search summary over comparison blogs ([particula](https://particula.tech/blog/vapi-vs-retell-vs-livekit-vs-pipecat-voice-agent-platform), [samcom](https://www.samcomtechnologies.com/blog/vapi-vs-livekit-for-ai-voice-agents-in-2026-a-developer-head-to-head), [cloudtalk](https://www.cloudtalk.io/livekit-vs-vapi-ai/), [inworld – vendor-written](https://inworld.ai/resources/vapi-vs-pipecat-vs-livekit)). Exact attribution of each figure to each blog was not confirmed (see Gaps).
- Platform-fee comparison at 10,000 min/mo, as cited by a comparison blog: about $500 for Vapi versus about $100 for LiveKit Cloud past its included allowance — same source set as above. This is consistent with Vapi's $0.05/min × 10,000 = $500 — [Vapi pricing](https://vapi.ai/pricing).
- Latency: a vendor-adjacent blog benchmark reports Vapi (standard) at **480ms P50 / 750ms P95** versus LiveKit self-hosted in the same region at **380ms P50 / 610ms P95**. This is a single author's test, not independent — [samcom](https://www.samcomtechnologies.com/blog/vapi-vs-livekit-for-ai-voice-agents-in-2026-a-developer-head-to-head) (attribution per search summary)
- Pipecat and LiveKit Agents are open-source frameworks; you pay for the AI services plus your own hosting — [pipecat-ai on PyPI](https://pypi.org/p/pipecat-ai); [Fora Soft LiveKit playbook (vendor/agency)](https://www.forasoft.com/blog/article/livekit-ai-agents-guide)
- Control levers that a managed platform prices or gates, per vendor pages:
  - Model choice is limited to the vendor's menu, although Vapi and ElevenLabs allow custom LLMs.
  - Retention windows and ZDR depend on the tier.
  - EU residency is Premier/Enterprise only.
  - Concurrency is capped per tier.
  - Sources: [Vapi](https://vapi.ai/pricing), [Vapi EU](https://docs.vapi.ai/security-and-privacy/eu-region.md), [ElevenLabs](https://elevenlabs.io/agents)

### Inferences
- The orchestration fee is **$0.05–0.08/min** (Vapi/Retell/ElevenLabs), roughly 35–60% of a typical $0.11–0.14 all-in minute. That matches the claimed 60–80% savings only if the build also renegotiates STT/TTS/LLM, e.g. self-hosted or cheaper providers. At 10k min/mo the fee is about $500–800/mo, below the cost of a fraction of an engineer. At 100k min/mo it is $5k–8k/mo, which can fund one. That suggests a **cost-driven break-even in the tens of thousands of minutes per month**, earlier when compliance add-ons apply ($2k/mo HIPAA, Premier for EU).
- Non-cost triggers that show up in the fact base: (1) EU data residency, which is sales-gated on managed platforms; (2) the need for custom turn-taking or latency below the platform's floor (one benchmark shows about a 100ms P50 gap); (3) the per-feature metering that adds up (QA $0.10/min, PII $0.01/min).
- **Middle paths exist between full-managed and full-DIY.** Twilio ConversationRelay ($0.07/min, Twilio runs telephony and speech while you own the LLM loop) and Twilio Media Streams ($0.0044/min, raw audio for a Pipecat/LiveKit pipeline) let a team leave the platform in steps — [Twilio](https://www.twilio.com/en-us/voice/pricing/us).

### Gaps
- No first-hand practitioner migration posts (Reddit, HN, X) were found by search. The available material is SEO comparison content, often written by vendors (Inworld, Cekura, Fora Soft). Exact per-claim attribution within those blogs was not fetched page by page, so treat the figures as indicative and anecdotal.
- No independent, reproducible latency benchmark across managed platforms was found.
- Reliability and outage history as a driver for leaving: not sourced.

## Q4. Hungarian-language support by platform

### Takeaway
Hungarian is **explicitly documented** only by Bland (language code `hu`) and in ElevenLabs' TTS model docs (Flash v2.5 adds Hungarian). Vapi and Retell make language support depend on the STT/TTS provider chosen, and their docs point to the dashboard rather than a published list. Every Hungarian claim needs a live test call before it is relied on.

### Cited Findings
- **Bland**: the call API language list includes "hu - Hungarian" — [Bland API docs](https://docs.bland.ai/api-v1/post/calls)
- **ElevenLabs**: "Flash v2.5 supports 32 languages – all languages from v2 models plus: Hungarian, Norwegian & Vietnamese". The v4 and v4 Turbo models claim "90+ languages" — [ElevenLabs TTS docs](https://elevenlabs.io/docs/overview/capabilities/text-to-speech). The ElevenAgents overview gives conflicting counts ("31 languages" in a voice table, "70+ languages" elsewhere) and names no languages — [ElevenLabs Agents docs](https://elevenlabs.io/docs/eleven-agents/overview)
- **Retell**: the supported language must be covered by both the voice provider and an ASR provider. "The combinations change as providers add coverage, so the dashboard is the source of truth." No static list containing Hungarian was found in the docs fetched — [Retell docs: language](https://docs.retellai.com/agent/language.md)
- **Vapi**: the multilingual docs page did not mention Hungarian (0 matches in raw HTML). Support comes from the chosen transcriber (Deepgram, Azure, Google, Gladia, Soniox, Speechmatics, ElevenLabs, etc.) and voice provider — [Vapi multilingual docs](https://docs.vapi.ai/customization/multilingual)
- **Sierra**: "over 55 languages" with no list given — [Sierra voice](https://sierra.ai/product/voice)

### Inferences
- Because Vapi and Retell are unbundled, Hungarian is possible on both if the chosen STT (e.g. ElevenLabs Scribe, Azure, Google) and TTS (ElevenLabs Flash v2.5 or newer) support it. The platform itself is not the constraint. Hungarian STT accuracy on telephony audio (8 kHz) is the real risk, and it should be tested.
- ElevenLabs Agents probably supports Hungarian, since its own Flash v2.5 TTS does. This is not explicitly documented for the Agents product.

### Gaps
- Hungarian support in PolyAI, Synthflow, Twilio ConversationRelay's speech providers, OpenAI Realtime and Google: not verified.
- No Hungarian quality evidence (WER/MOS on phone audio) was found for any platform.
