# Cascaded voice pipeline components: streaming STT, streaming TTS, turn detection (as of 2026-10-17)

Method note: all vendor prices were read from the vendor's own pricing or docs page on **2026-10-17**. Model IDs marked "raw-verified" were confirmed by downloading the vendor page with curl and grepping its HTML/JSON-LD, not just from a summarizer. (This repo has a known gotcha where WebFetch makes up "latest model" names, so the raw check matters.) Model names have moved a lot since 2025: ElevenLabs has **Eleven v4 / v4 Turbo**, Cartesia **Sonic-3.6**, AssemblyAI **Universal-3.6 Pro Realtime**, Speechmatics **Melia 1 / Oak 1 / Linden 1**, and OpenAI **gpt-live-transcribe / gpt-realtime-2.1 / gpt-live-1**. Do not fall back on 2025-era names.

## 1. Streaming STT: which providers truly stream with partials, plus price, latency, accuracy and Hungarian support

### Takeaway
Every major cloud vendor now has a dedicated WebSocket streaming STT. Two of them also build turn detection into the STT model: Deepgram **Flux** and Speechmatics **Linden 1**. Groq Whisper is file/REST only, so it is not streaming. List prices run from about $0.15/hr (AssemblyAI Universal-Streaming) to $0.45/hr (AssemblyAI Universal-3.6 Pro Realtime), and about $1.02/hr for OpenAI's live transcription. Hungarian is the main constraint for a HU product. Deepgram Flux and AssemblyAI's multilingual streaming do **not** cover it. Deepgram Nova-3 (monolingual `hu`), ElevenLabs Scribe v2 family (90+ languages), and NVIDIA Parakeet/Canary (open, CC-BY-4.0) do.

### Cited Findings

**Deepgram (pricing checked 2026-10-17)**
- Model lineup per the Deepgram docs: **Flux** is "our latest-generation streaming model unifying best-in-class ASR with model-native turn detection", recommended for real-time agents. **nova-3** is the "highest-performing general-purpose ASR (no turn detection)". **nova-2** is for languages nova-3 does not yet support and for filler-word identification. — [Deepgram Models & Languages](https://developers.deepgram.com/docs/models-languages-overview)
- Flux model options: `flux-general-en` (English, all accents) and `flux-general-multi` (en, es, fr, de, hi, ru, pt, ja, it, nl). That is **10 languages, with no Hungarian**. — [Deepgram Models & Languages](https://developers.deepgram.com/docs/models-languages-overview)
- Nova-3's language list includes **Hungarian: `hu`** as a monolingual code. Nova-3's `multi` code-switching mode covers only the same 10 languages (en, es, fr, de, hi, ru, pt, ja, it, nl). Nova-2 also lists `hu`. — [Deepgram Models & Languages](https://developers.deepgram.com/docs/models-languages-overview)
- Pay-as-you-go streaming prices: Nova-3 Monolingual $0.0048/min, Nova-3 Multilingual $0.0058/min, Flux English $0.0065/min, Flux Multilingual $0.0078/min (raw-verified in page JSON-LD; Flux Multilingual Growth tier $0.0068). The page labels these "**Limited-time promotional rates on streaming**", with higher struck-through list prices, e.g. $0.0077/min for Nova-3 Monolingual streaming. Pre-recorded: Nova-3 Mono $0.0043/min, Whisper Large $0.0048/min. — [Deepgram Pricing](https://deepgram.com/pricing)
- Billing: "true per-second billing", no per-request minimum. Multichannel is billed on total channel duration. $200 free credit with no expiry. PAYG concurrency: 150 WSS / 50 REST for STT, 45 for TTS, 45 for the Voice Agent API. — [Deepgram Pricing](https://deepgram.com/pricing)
- Vendor accuracy claim, not independent: Nova-3 gives a "54.2% reduction in word error rate (WER) for streaming and 47.4% for batch processing compared to competitors". Deepgram also says Flux has "Nova-3 level accuracy". — [Deepgram Models & Languages](https://developers.deepgram.com/docs/models-languages-overview)

**AssemblyAI (checked 2026-10-17)**
- Streaming models and their API values: **Universal-3.6 Pro Realtime** (`universal-3-6-pro`) at $0.45/hr; **Universal-Streaming English** (`universal-streaming-english`) at $0.15/hr; **Universal-Streaming Multilingual** (`universal-streaming-multilingual`) at $0.15/hr. The "Universal-3.6 Pro Realtime" name is raw-verified on the page. — [AssemblyAI Pricing](https://www.assemblyai.com/pricing)
- **Billing gotcha:** streaming is billed on **session duration**, meaning the time the WebSocket is open, including idle time, not the audio actually sent. Add-ons: diarization +$0.12/hr, Medical Mode +$0.15/hr, keyterms +$0.04/hr on Universal-Streaming English (included on the others), General Prompting (beta) +$0.05/hr, Voice Focus +$0.10/hr (U3.6 Pro only). PAYG concurrency: 100 new streams/min (free tier: 5). Endpoint: `wss://streaming.assemblyai.com/v3/ws`. — [AssemblyAI Pricing](https://www.assemblyai.com/pricing)
- Hungarian: AssemblyAI's multilingual streaming docs list English, Spanish, French, German, Italian and Portuguese only. For other languages they point to a Whisper Streaming model (`speech_model: "whisper-rt"`, "99 languages"). A newer page describes Universal-3 Pro Streaming as covering "18 languages ... with native mid-sentence code-switching", and its listing does not include Hungarian. — [AssemblyAI multilingual streaming docs](https://www.assemblyai.com/docs/speech-to-text/universal-streaming/multilingual-transcription); [AssemblyAI multilingual voice agents report](https://www.assemblyai.com/reports/multilingual-voice-agents) (search-snippet level; the language list was not fetched in full)

**ElevenLabs Scribe (checked 2026-10-17)**
- Model IDs from the docs, raw-verified: `scribe_v2_realtime` ("Real-time speech recognition model, 90+ languages"), `scribe_v2`, and `scribe_v2_medical`. — [ElevenLabs Models](https://elevenlabs.io/docs/overview/models)
- Prices per hour: Scribe v2 $0.22; **Scribe v2 Realtime $0.39** (+$0.08/hr keyterm prompting, +$0.12/hr transcript editing). The pricing page claims "~150ms latency" for Realtime and ">98% accuracy" for Scribe v2; both are vendor claims. Per-unit rates are the same across plan tiers. — [ElevenLabs API Pricing](https://elevenlabs.io/pricing/api)
- The ElevenLabs models page includes a full-name language list with "Hungarian (hu)". The 90+ language count is attached to the Scribe v2 models. — [ElevenLabs Models](https://elevenlabs.io/docs/overview/models)

**Speechmatics (checked 2026-10-17)**
- New lineup: **Melia 1** (general multilingual, "transcribes 56 languages without choosing one up front, switches language mid-sentence", pre-recorded $0.12/hr), **Enhanced** ($0.38/hr, highest accuracy, single chosen language), **Standard** ($0.23/hr), **Oak 1 Medical** ($0.15/hr), and **Linden 1 agent STT**: "Only available as a Real-time model. Our voice agent model, with built-in turn detection for conversational use cases." Self-serve real-time concurrency is 50 sessions (2 on Free). $100 free credits. — [Speechmatics Pricing](https://www.speechmatics.com/pricing)

**OpenAI (checked 2026-10-17; all IDs raw-verified on the pricing page)**
- Transcription per minute: `gpt-live-transcribe` $0.017 ("Live transcription"), `gpt-realtime-whisper` $0.017 ("Live transcription"), `gpt-transcribe` $0.0045, `gpt-4o-transcribe` $0.006 (tokens: $2.50 in / $10 out per 1M), `gpt-4o-mini-transcribe` $0.003, `gpt-4o-transcribe-diarize` $0.006, Whisper $0.006. `gpt-realtime-translate` is $0.034/min. — [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)

**Groq (file-based, not streaming)**
- whisper-large-v3-turbo costs $0.04/hour of audio with a **10-second minimum charge per request**. An older Groq ASR guide (Oct 2024) also says audio under 30 s is padded with silence. Which of the two floors actually applies to short clips is unconfirmed. — [Groq Pricing](https://groq.com/pricing); [Groq model page](https://console.groq.com/docs/model/whisper-large-v3-turbo); [Groq ASR guide PDF](https://groq.com/GroqDocs/Groq%20ASR%20Model%20Guide.pdf)

**Google Chirp 3**
- Third-party listings put Chirp 3 at $0.016/min, and OpenRouter lists a release date of May 5, 2026. Google's own Chirp 3 streaming SKU could not be read: the official pricing page rendered without its table. — [OpenRouter Chirp 3](https://openrouter.ai/google/chirp-3); [Google STT pricing](https://cloud.google.com/speech-to-text/pricing) (not extractable)

**Cartesia Ink (STT)**
- The Ink-2 model is priced at "3 credits = 1 second of audio" (10,800 credits/hr), and Cartesia states "One hour of audio is only $0.39 on the Scale plan". — [Cartesia Pricing](https://cartesia.ai/pricing)

**Open-weight STT (Hugging Face model-card metadata via the HF API, 2026-10-17)**
- `nvidia/parakeet-tdt-0.6b-v3`: CC-BY-4.0, 25 European languages **including `hu`**, last modified 2026-08-05. — [HF card](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3)
- `nvidia/canary-1b-v2`: CC-BY-4.0, 25 languages **including `hu`**, last modified 2026-08-31. — [HF card](https://huggingface.co/nvidia/canary-1b-v2)
- `nvidia/canary-qwen-2.5b`: CC-BY-4.0. — [HF card](https://huggingface.co/nvidia/canary-qwen-2.5b)
- `nvidia/nemotron-speech-streaming-en-0.6b`: an English streaming ASR model under license "other" (an NVIDIA license, not CC/Apache). Check its terms before commercial use. — [HF card](https://huggingface.co/nvidia/nemotron-speech-streaming-en-0.6b)
- `kyutai/stt-1b-en_fr`: CC-BY-4.0, **English and French only**. — [HF card](https://huggingface.co/kyutai/stt-1b-en_fr)

**Independent accuracy benchmarks**
- Artificial Analysis (AA) runs separate batch and **streaming** STT leaderboards. AA-WER is a duration-weighted average over about 8 hours of audio: AA-AgentTalk 50%, VoxPopuli 25%, Earnings22 25%. Streaming latency is measured **from the Silero-VAD-detected end of speech**, as separate time-to-first-partial and time-to-final metrics. Price is normalized per 1,000 minutes. Providers in the streaming charts include OpenAI, ElevenLabs, NVIDIA, Inworld, Google, Mistral, Rev AI, Deepgram, Smallest.ai, Gradium, Alibaba, Amazon, Cartesia, Together, Soniox, Microsoft AI, AssemblyAI, Speechmatics and others. — [Artificial Analysis STT streaming](https://artificialanalysis.ai/speech-to-text/streaming)
- A secondary snapshot of the AA batch leaderboard dated 2026-06-02 lists Fun-Realtime-ASR-preview 1.7%, ElevenLabs Scribe v2 2.2%, MAI Transcribe 1.5 2.4%, MAI Transcribe 1 2.6%, and Gemini 3 Pro (High) 2.7%. This is an aggregator, not AA itself, and sources disagree on whether 55 or 57 models were scored. An earlier AA v2.0 release had Scribe v2 at 2.3%. — [benchmarklist (AA non-streaming)](https://benchmarklist.com/benchmarks/artificial_analysis_speech_to_text_non_streaming/); [The Decoder](https://the-decoder.com/elevenlabs-and-google-dominate-artificial-analysis-updated-speech-to-text-benchmark/)

### Inferences
- "Truly streaming with partials", by transport: Deepgram Nova-3/Flux (WSS), AssemblyAI Universal-Streaming / U3.6 Pro Realtime (WSS v3), ElevenLabs Scribe v2 Realtime, Speechmatics real-time (incl. Linden 1), OpenAI `gpt-live-transcribe` / `gpt-realtime-whisper` ("Live transcription"), Cartesia Ink. **Not streaming:** Groq Whisper (per-request file billing with a 10 s floor), OpenAI `gpt-transcribe` / `gpt-4o-transcribe` (file transcription rows), and Parakeet-TDT/Canary as packaged (offline cards; Nemotron speech streaming is NVIDIA's streaming variant).
- For a Hungarian voice agent, the realistic streaming STT shortlist is Deepgram Nova-3 `hu` (cheapest at $0.0048/min promo, but no model-native turn detection), ElevenLabs Scribe v2 Realtime ($0.0065/min), and possibly Speechmatics or Google Chirp 3 (HU support not verified here). Self-hosted, the options are Parakeet/Canary (CC-BY-4.0, HU listed) wrapped in a chunked or streaming runner. Flux's built-in turn-taking is not available for Hungarian.
- AssemblyAI's session-duration billing means an idle open socket costs money. Deepgram's per-second billing applies to the audio you stream, and most agents stream continuously, so in practice both bill about the full call length.

### Gaps
- Azure Speech real-time STT pricing and Hungarian status: not fetched (the page is JS-heavy). It needs a direct check.
- Google Chirp 3 official streaming price, billing increment, and Hungarian support: the official page would not render, and only third-party $0.016/min figures were found.
- Per-model numbers from the AA **streaming** leaderboard (WER, time-to-final, time-to-first-partial) were not in the fetched HTML, so no independent streaming latency figures are recorded here.
- Open ASR Leaderboard (HF) rankings: the Space app did not render via fetch. No current figures.
- Speechmatics real-time per-hour rates (the table I parsed showed pre-recorded) and Hungarian coverage of Melia 1 / Linden 1: not confirmed.
- OpenAI live-transcription language coverage and latency: not documented in the sources fetched.
- Whether AssemblyAI `whisper-rt` covers Hungarian: not confirmed.

## 2. Streaming TTS: models, latency, price, Hungarian support, open models, cloning and consent

### Takeaway
ElevenLabs now offers Eleven v4 / v4 Turbo; Flash v2.5 stays the cheapest real-time option at $0.04/1K chars and explicitly adds Hungarian. Cartesia Sonic-3.6 (2026-08-27 snapshot) lists Hungarian and costs about $0.028–0.04 per generated minute depending on plan. Deepgram Aura-2 is $0.030/1K chars. Among open models: Kokoro (Apache-2.0, English card), Orpheus (Apache-2.0), Sesame CSM-1B (Apache-2.0, gated), Chatterbox (MIT, 23 languages but no HU), and Kyutai TTS (CC-BY-4.0, en/fr). **None of the open TTS cards checked list Hungarian.** PlayHT is gone.

### Cited Findings

**ElevenLabs (checked 2026-10-17; IDs raw-verified)**
- Model IDs and claimed latency, which excludes application and network latency: `eleven_v4` ("most emotionally rich", 90+ languages); `eleven_v4_turbo` ("most expressive, real-time ... (~100ms†)", 90+ languages); `eleven_v3` (70+ languages); `eleven_v3_conversational` ("~280ms†", 70+ languages); `eleven_flash_v2_5` ("~75ms†", covers all `eleven_multilingual_v2` languages **plus hu, no, vi**); `eleven_flash_v2` (en, ~75ms). `eleven_multilingual_v2` (29 languages) does **not** list hu. Turbo v2/v2.5 are deprecated as "functionally equivalent" to Flash, which has lower latency. For agents the docs recommend `eleven_v4_turbo`, `eleven_flash_v2_5`, `eleven_flash_v2`, or `eleven_multilingual_v2`. — [ElevenLabs Models](https://elevenlabs.io/docs/overview/models)
- API prices per 1K characters, the same across tiers: v4 $0.08; v4 Turbo $0.04; v3 $0.08; v3 Conversational $0.04; v2 Multilingual $0.08; Flash/Turbo $0.04. Character limits: v3 5,000; v2 10,000; Flash 40,000. Plan fees: Starter $6, Creator $22, Pro $99, Scale $299, Business $990 per month. The page's "per minute" TTS figure just repeats the per-1K figure and should not be used. — [ElevenLabs API Pricing](https://elevenlabs.io/pricing/api)
- Independent: Artificial Analysis Speech Arena (user-vote Elo) shows **Eleven v4 Turbo** as "highest quality" at Quality Elo 1330. Its best quality-for-price picks are Eleven v4 Turbo, Qwen-Audio-3.1-TTS-Plus, and Gemini 3.8 Flash TTS. The cheapest is Kokoro 82M v1.0 via Replicate at $0.65/1M chars. No date or vote count is shown. — [Artificial Analysis TTS](https://artificialanalysis.ai/text-to-speech)

**Cartesia (checked 2026-10-17)**
- The docs list snapshot `sonic-3.6-2026-08-27` (released August 27, 2026, Stable) with 44 languages, **including `hu`**. Older IDs still referenced: sonic-3, sonic-3-5, sonic-2, sonic-turbo, sonic-preview. — [Cartesia TTS models](https://docs.cartesia.ai/build-with-cartesia/tts-models)
- Pricing: 1 credit = 1 character, and "One minute of audio generation requires 750-800 credits" (raw-verified). Plans: Free $0 / 20K credits; Pro $5 / 100K; Startup $49 / 1.25M; Scale $299 / 8M. Overage per 1M credits: $65 Pro, $45 Startup, $38 Scale. Instant voice cloning from Pro up. Professional Voice Clone (PVC) slots: 2 on Startup, 4 on Scale. PVC training is free. — [Cartesia Pricing](https://cartesia.ai/pricing)

**Deepgram Aura (checked 2026-10-17)**
- Aura-1 $0.0150/1K chars and Aura-2 $0.030/1K chars. A separate "**Flux TTS**" line at $0.0450/1K chars appears in the page's JSON-LD (raw-verified). It is a new product name, not investigated further. TTS concurrency is 45 (REST + WSS). — [Deepgram Pricing](https://deepgram.com/pricing)

**OpenAI TTS (checked 2026-10-17)**
- `gpt-4o-mini-tts`: $0.60/1M text-input tokens, $12.00/1M audio-output tokens. `tts-1`: $15/1M characters. `tts-1-hd`: $30/1M characters. No newer standalone TTS model is listed. — [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)

**Rime / Hume / PlayHT**
- Rime docs: **Mist v3** time-to-first-audio about 37 ms (P50) on the GPU engine; **Arcana v3** about 120 ms engine TTFB. The docs recommend migrating Arcana traffic to "Coda". Both latencies are vendor-reported, and no per-character price was found. — [Rime docs](https://docs.rime.ai/docs/models)
- Hume Octave: the official pricing page returned no price data when fetched, and the only figure found came from a competitor blog (unverified). — [Hume pricing](https://www.hume.ai/pricing); [AA Octave page](https://artificialanalysis.ai/text-to-speech/models/octave-tts)
- PlayHT/PlayAI: Meta took over the team in July 2025, the API went offline around July 26, 2025, and the service closed on December 31, 2025 with clones deleted. These dates come from secondary or affiliate sources and are consistent with each other; one outlier says December 2025 for the acquisition. — [anyspeech (updated June 2026)](https://anyspeech.io/playht-alternatives); [texttolab](https://texttolab.com/blog/play-ht-shutdown-alternatives)

**Open-weight TTS (HF API metadata, 2026-10-17)**
- `hexgrad/Kokoro-82M`: Apache-2.0, card language tag `en`. — [HF](https://huggingface.co/hexgrad/Kokoro-82M)
- `canopylabs/orpheus-3b-0.1-ft`: Apache-2.0, gated (auto-approve). — [HF](https://huggingface.co/canopylabs/orpheus-3b-0.1-ft)
- `sesame/csm-1b`: Apache-2.0, gated (auto-approve). — [HF](https://huggingface.co/sesame/csm-1b)
- `ResembleAI/chatterbox`: MIT, 23 languages (ar, da, de, el, en, es, fi, fr, he, hi, it, ja, ko, ms, nl, no, pl, pt, ru, sv, sw, tr, zh), **no hu**, last modified 2026-06-10. — [HF](https://huggingface.co/ResembleAI/chatterbox)
- `kyutai/tts-1.6b-en_fr`: CC-BY-4.0, en/fr. — [HF](https://huggingface.co/kyutai/tts-1.6b-en_fr)

**Voice cloning rights and consent**
- ElevenLabs only allows "professional cloned voices verified by a human" into the shared Voice Library. Instant clones and Voice Design voices are excluded. Evading verification safeguards such as CAPTCHA violates the Prohibited Use Policy and can lead to a permanent ban. — [ElevenLabs help: sharing voices](https://elevenlabs.io/docs/help-center/product/voices/voice-library/can-i-share-an-ai-generated-voice-in-the-voice-library)
- Secondary guides (not official) say ElevenLabs PVC lets you clone **only your own voice on your own account**, even when another person consents, and that the policy bars replicating a person's voice without consent or legal right. — [aiproductivity.ai guide](https://aiproductivity.ai/guides/elevenlabs-voice-cloning-ethics/); [terms.law summary](https://terms.law/ai-output-rights/elevenlabs/)
- Cartesia: PVC slots are limited by plan, speech generated with a PVC costs 1 credit/char, and voice localization costs 225 credits per accent. — [Cartesia Pricing](https://cartesia.ai/pricing)

### Inferences
- Hungarian real-time TTS options are ElevenLabs `eleven_flash_v2_5` (explicit `hu`, ~75 ms claimed, $0.04/1K), Cartesia Sonic-3.6 (explicit `hu`), and probably Eleven v4 / v4 Turbo (90+ languages; the full-name list including Hungarian appears on the models page, but I did not confirm it is the v4 list). No checked open-weight TTS lists Hungarian, so a self-hosted HU voice would need fine-tuning or an unverified multilingual model.
- The PlayHT shutdown, with clones deleted and no export, is a concrete argument for keeping the original consented voice recordings on your side and for an abstraction layer over the TTS vendor.

### Gaps
- Google Cloud TTS and Azure Neural TTS current prices and streaming TTFB: not fetched.
- Independent **TTFB** comparisons for TTS: AA reports throughput (chars/s), and per-model TTFB was not extracted. All TTFB figures above are vendor-reported.
- Official ElevenLabs PVC verification flow and the Cartesia/Rime consent terms: not read from primary policy pages.
- Rime and Hume list prices: not found.
- Kokoro's actual multilingual voice packs, if any, beyond the `en` card tag: not verified.

## 3. Turn detection and endpointing: VAD, semantic turn models, barge-in, echo cancellation

### Takeaway
The current standard stack is **Silero VAD plus a semantic end-of-turn model**. That model is either audio-based (Pipecat Smart Turn v3.x, BSD-2, about 8M parameters, 23 languages), text-based (LiveKit turn-detector, 14 languages, no HU), or built into the STT (Deepgram Flux, Speechmatics Linden 1). Speculative "eager" end-of-turn cuts hundreds of milliseconds but adds 50–70% more LLM calls.

### Cited Findings
- **Pipecat Smart Turn v3**: open model under BSD-2-clause, with weights, datasets and training code all public. It is a Whisper Tiny encoder with a linear classifier, about 8M parameters (int8 ONNX 8 MB, fp32 32 MB). It works on **audio, not transcripts**. Inference can be as low as 10 ms on some CPUs and is under 100 ms on most cloud instances. It covers 23 languages. Pipecat bundles it as `LocalSmartTurnAnalyzerV3`, recommended alongside Silero VAD with `stop_secs` of about 0.2 s, and it has been the default user-turn-stop strategy since Pipecat v0.0.102. — [pipecat-ai/smart-turn GitHub](https://github.com/pipecat-ai/smart-turn); [HF card](https://huggingface.co/pipecat-ai/smart-turn-v3); [Pipecat docs](https://docs.pipecat.ai/server/utilities/turn-detection/smart-turn-overview)
- **Smart Turn v3.2** handles short replies like "yes"/"okay" better, with about 40% fewer misclassifications on the project's own benchmark. It also improves robustness to noisy environments. — [Daily blog](https://www.daily.co/blog/smart-turn-v3-2-handling-noisy-environments-and-short-responses/)
- **LiveKit turn-detector**: a small open-weights language model that adds conversational context to VAD. The `MultilingualModel` covers 14 languages: en, es, fr, de, it, pt, nl, zh, ja, ko, id, tr, ru, hi, so **no Hungarian**. The HF license is "other". It is **text-only** ("cannot incorporate prosodic cues such as pauses, intonation, or emphasis") and relies on the STT for language identification. Defaults: `min_endpointing_delay` 0.5 s, `max_endpointing_delay` 6.0 s. RAM is under 500 MB per the HF card. A 25 ms per-inference figure appears only on a third-party mirror. — [LiveKit turn detector docs](https://docs.livekit.io/agents/logic/turns/turn-detector); [HF livekit/turn-detector](https://huggingface.co/livekit/turn-detector)
- LiveKit reports its improved end-of-turn model "cuts voice AI interruptions 39%" (vendor-reported). — [LiveKit blog](https://livekit.com/blog/improved-end-of-turn-model-cuts-voice-ai-interruptions-39)
- **Deepgram Flux end-of-turn parameters**: `eot_threshold` 0.5–0.9, default 0.7 (higher means fewer false turn-ends but more latency). `eager_eot_threshold` 0.3–0.9 is off by default; turning it on emits `EagerEndOfTurn` and `TurnResumed` events for speculative LLM calls. Deepgram says this cuts end-to-end latency "by hundreds of milliseconds" but can increase LLM calls by **50–70%**. `eot_timeout_ms` 500–10000, default 5000, is a silence fallback. — [Deepgram Flux configuration](https://developers.deepgram.com/docs/flux/configuration)
- Telnyx turns eager EOT on by default for `deepgram/flux` and reports about 150 ms lower median response latency when eager turns fire (vendor). Bolna suggests 0.4–0.5 thresholds for the lowest perceived latency. Docs disagree on how eager and final thresholds must be ordered. — [Telnyx release note](https://telnyx.com/release-notes/automatic-eager-end-of-turn-deepgram-flux); [Bolna docs](https://www.bolna.ai/docs/deepgram-flux)
- Speechmatics **Linden 1** is a real-time-only agent STT with built-in turn detection. — [Speechmatics Pricing](https://www.speechmatics.com/pricing)
- Silero VAD is the reference end-of-speech detector that Artificial Analysis uses to start its streaming STT latency clock. — [Artificial Analysis STT streaming](https://artificialanalysis.ai/speech-to-text/streaming)
- A fixed silence-timer endpoint adds directly to response time ("every millisecond of that silence timer adds straight to response time"). — [Soniox wiki: voice agent latency budget](https://soniox.com/wiki/voice-agent-latency-budget)

### Inferences
- For Hungarian, the LiveKit text turn-detector and Flux's model-native EOT are both unavailable, which leaves Smart Turn (audio-based; whether HU is among its 23 languages is unverified) or a VAD silence timer. Prosody-based models like Smart Turn should transfer better to unsupported languages than text-based ones, but that is untested.
- Eager or speculative EOT turns latency into LLM cost. Budget for roughly 1.5–1.7x LLM calls if you enable it (from Deepgram's 50–70% figure).

### Gaps
- Barge-in/interruption handling specifics (LiveKit `allow_interruptions`, false-interruption recovery, Pipecat interruption strategies): not fetched in detail.
- **Echo cancellation (AEC)**: no sources gathered. Browser WebRTC AEC, Krisp/noise suppression, and the telephony side remain open.
- Silero VAD current version and license: the HF API returned no card metadata for `snakers4/silero-vad`, so it needs a GitHub check (historically MIT, unverified here).
- Which 23 languages Smart Turn covers, and whether Hungarian is one of them: not verified.

## 4. Latency budget of a cascaded pipeline

### Takeaway
Practitioners converge on about **800 ms voice-to-voice** as the target, with a sub-500 ms median as a stretch goal. The LLM's time-to-first-token is the largest and most variable slice. Endpointing silence is the most-overlooked one. Streaming overlap across stages is mandatory, because summing worst-case stage ranges exceeds 1.4 s.

### Cited Findings
- Example 800 ms allocation: VAD/capture 50 ms, STT 150 ms, LLM TTFT 400 ms, TTS first chunk 150 ms, network 50 ms. A single 300 ms tool call pushes time-to-first-audio to 1100 ms or more. — [twig.so: 800ms rule](https://www.twig.so/blog/voice-ai-agents-latency-budget-800ms)
- P95-oriented stage ranges: STT first-partial 100–300 ms, LLM TTFT 200–600 ms, TTS first audio 150–400 ms, network 20–100 ms, orchestration 20–50 ms. Summed worst-case exceeds 1400 ms, hence streaming. Targets: sub-800 ms P95, sub-500 ms median. — [Hamming AI](https://hamming.ai/blog/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it); [FutureAGI](https://futureagi.com/blog/how-to-measure-voice-ai-latency-2026/)
- The LLM is called "the bottleneck" (350–1000 ms range). Streaming TTS cuts perceived latency by 300–600 ms compared with batch synthesis. Tools and retrieval should run in parallel with inference. — [morphllm](https://www.morphllm.com/voice-agent-api); [Netguru](https://www.netguru.com/blog/voice-ai-low-latency-techniques)
- Vendor component latencies that feed the budget, all vendor-reported and excluding network: ElevenLabs Flash ~75 ms, v4 Turbo ~100 ms, v3 Conversational ~280 ms; Scribe v2 Realtime ~150 ms; Rime Mist v3 ~37 ms P50; Smart Turn 10–100 ms; LiveKit `min_endpointing_delay` default 500 ms. — [ElevenLabs Models](https://elevenlabs.io/docs/overview/models); [ElevenLabs Pricing](https://elevenlabs.io/pricing/api); [Rime docs](https://docs.rime.ai/docs/models); [Smart Turn GitHub](https://github.com/pipecat-ai/smart-turn); [LiveKit docs](https://docs.livekit.io/agents/logic/turns/turn-detector)

### Inferences
- Rebuilding the budget from vendor numbers: endpointing (VAD 200 ms `stop_secs` plus Smart Turn ~50 ms, or a 500 ms LiveKit minimum delay) + STT final (~150 ms) + LLM TTFT (300–600 ms) + TTS TTFB (75–150 ms) + network (50–100 ms) comes to about **0.8–1.5 s**. Endpointing and the LLM dominate, which is why eager EOT and speculative generation are the main levers.
- Note: most of these "budget" pages are vendor or SEO marketing, so treat them as consensus framing, not measurements.

### Gaps
- No independent measured end-to-end voice-to-voice benchmark of named cascades was retrieved. AA's streaming STT latency figures were not extractable.
- Telephony (PSTN/SIP) added latency was not covered.

## 5. Cost per conversation-minute for a typical cascade (prices dated 2026-10-17)

### Takeaway
STT plus TTS in a cascade costs roughly **$0.017–0.023 per conversation-minute before the LLM and telephony**, assuming the agent speaks about 50% of the time. Bundled agent platforms list $0.05–0.08/min: OpenAI gpt-live-1 $0.05/min plus backend model; Deepgram Voice Agent $0.075/min; ElevenLabs Agents $0.08/min.

### Cited Findings (inputs)
- STT per minute: Deepgram Nova-3 Mono streaming $0.0048 (promo; list $0.0077), Flux English $0.0065. AssemblyAI Universal-Streaming $0.15/hr = $0.0025/min, billed on session time. ElevenLabs Scribe v2 Realtime $0.39/hr = $0.0065/min. OpenAI `gpt-live-transcribe` $0.017/min. — [Deepgram](https://deepgram.com/pricing); [AssemblyAI](https://www.assemblyai.com/pricing); [ElevenLabs](https://elevenlabs.io/pricing/api); [OpenAI](https://developers.openai.com/api/docs/pricing)
- TTS: about 750–800 characters per generated audio minute (Cartesia's stated conversion). ElevenLabs Flash / v4 Turbo $0.04/1K chars. Deepgram Aura-2 $0.030/1K. Cartesia Scale $299/8M ≈ $0.037/1K (Pro ≈ $0.05/1K). — [Cartesia Pricing](https://cartesia.ai/pricing); [ElevenLabs](https://elevenlabs.io/pricing/api); [Deepgram](https://deepgram.com/pricing)
- Bundled: Deepgram Voice Agent API Standard $0.075/min (BYO LLM $0.065, BYO LLM+TTS $0.050), billed on WebSocket connection time. ElevenLabs Agents $0.08/min ($0.16 burst). OpenAI `gpt-live-1` $0.05/min, billed per second, with "backend model and tool usage billed separately". — [Deepgram](https://deepgram.com/pricing); [ElevenLabs](https://elevenlabs.io/pricing/api); [OpenAI](https://developers.openai.com/api/docs/pricing)

### Inferences (arithmetic; assumptions are mine)
Assumptions: STT billed for the full conversation minute (continuous streaming); the agent speaks 0.5 min per conversation-minute, so TTS covers about 400 characters (0.5 × 800); LLM, telephony and hosting excluded.
- **A. Budget English:** Deepgram Nova-3 $0.0048 + Aura-2 400 × $0.030/1K = $0.012 → **≈ $0.017/min**. At non-promo Nova-3 list $0.0077 → ≈ $0.020/min.
- **B. Turn-native English:** Deepgram Flux EN $0.0065 + ElevenLabs Flash 400 × $0.04/1K = $0.016 → **≈ $0.0225/min**.
- **C. Cheapest STT:** AssemblyAI Universal-Streaming $0.0025 + Cartesia Scale 400 × $0.0374/1K = $0.015 → **≈ $0.0175/min**, plus a $299/mo plan commitment.
- **D. Hungarian-capable:** Deepgram Nova-3 `hu` $0.0048, or Scribe v2 Realtime $0.0065, + ElevenLabs Flash v2.5 (`hu`) $0.016 → **≈ $0.021–0.0225/min**. Swapping in Cartesia Sonic-3.6 (`hu`) at Scale gives ≈ $0.020–0.0215/min.
- **E. OpenAI cascade:** `gpt-live-transcribe` $0.017 + `tts-1` 400 × $0.015/1K = $0.006 → ≈ $0.023/min. With `gpt-4o-mini-tts` the cost is token-priced, and the per-minute figure could not be computed.
- At these rates the LLM and telephony line items will probably match or exceed STT+TTS. With eager EOT on, multiply the LLM line by about 1.5–1.7.

### Gaps
- LLM per-minute cost is excluded (another researcher's scope), as are telephony (Twilio/Telnyx per-minute) and orchestration hosting.
- The characters-per-minute conversion is Cartesia's figure, and speaking rate varies by language. Hungarian character density relative to English is unmeasured here.
- Volume, Growth and Enterprise discounts are not modelled (e.g. Deepgram Growth Flux Multilingual $0.0068/min).
