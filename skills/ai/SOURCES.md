# Sources

The `ai` skill was built from a 4-channel research pass (skills marketplaces, GitHub, practitioner
discourse, and canonical docs/writings), 2026-07-25. Sources are grouped by topic below with their
license where it affects reuse. **All model names, prices, versions, and spec revisions were
version-verified against live sources on 2026-07-25 and are date-stamped in the references — re-verify
before relying on any of them (this layer churns monthly).**

## Agents, harness & orchestration
- Anthropic, "Building Effective Agents" — https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, "Effective Context Engineering for AI Agents" — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic, "Building a multi-agent research system" — https://www.anthropic.com/engineering/multi-agent-research-system
- Cognition, "Don't Build Multi-Agents" — https://cognition.ai/blog/dont-build-multi-agents
- 12-Factor Agents (HumanLayer) — https://github.com/humanlayer/12-factor-agents (Apache-2.0 code / CC-BY-SA-4.0 content)
- LangGraph — https://github.com/langchain-ai/langgraph (MIT) · DeepAgents — https://github.com/langchain-ai/deepagents (MIT)
- OpenAI Agents SDK — https://github.com/openai/openai-agents-python (MIT) · Google ADK — https://adk.dev/ (Apache-2.0)
- Pydantic AI — https://github.com/pydantic/pydantic-ai (MIT) · Mastra — https://github.com/mastra-ai/mastra (Apache-2.0 core + `ee/` source-available)
- smolagents (CodeAgent) — https://github.com/huggingface/smolagents (Apache-2.0) · rig (Rust) — https://github.com/0xPlaygrounds/rig (MIT)
- Microsoft Agent Framework (successor to AutoGen + Semantic Kernel) — https://github.com/microsoft/agent-framework (MIT)
- Read 2026-10-17: Anthropic, multi-agent research system (subagent task contract, artifact references) · OpenAI orchestration and handoffs — https://developers.openai.com/api/docs/guides/agents/orchestration · LangChain overview (agents built on LangGraph) — https://docs.langchain.com/oss/javascript/langchain/overview · Pydantic AI durable execution (one engine per agent) — https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/ · Deep Agents backends — https://docs.langchain.com/oss/python/deepagents/backends · Mastra Durable Agents (beta) — https://mastra.ai/docs/harness/durable-agents · Mastra workflow runners (Temporal experimental) — https://mastra.ai/docs/deployment/workflow-runners · LlamaIndexTS and workflows-ts (archived, deprecated) — https://github.com/run-llama/LlamaIndexTS · https://github.com/run-llama/workflows-ts

## Tools & MCP
- Model Context Protocol spec — https://modelcontextprotocol.io/specification (stable 2025-11-25; 2026-07-28 RC pending — re-verify)
- MCP Python/TypeScript SDKs (MIT, v1 for prod) · FastMCP (PrefectHQ, Apache-2.0) — https://github.com/PrefectHQ/fastmcp · MCP registry
- Read 2026-10-17: Anthropic, advanced tool use (Tool Search Tool, `defer_loading`) — https://www.anthropic.com/engineering/advanced-tool-use · Cursor, dynamic context discovery — https://cursor.com/blog/dynamic-context-discovery

## Computer use (read 2026-10-17)
- OpenAI computer-use guide — https://developers.openai.com/api/docs/guides/tools-computer-use
- "Screenshots or Tools?" hybrid GUI–MCP agents — https://arxiv.org/abs/2608.03327 · OSWorld 2.0 — https://arxiv.org/abs/2606.29537
- browser-use (MIT) · Stagehand (MIT) · Playwright MCP (Apache-2.0) · Skyvern (AGPL-3.0) · SearXNG (AGPL-3.0) · Firecrawl (AGPL-3.0) · Crawl4AI (Apache-2.0 **plus an appended Attribution Requirement** — public/web-app use must credit it) — LICENSE files read 2026-10-17

## Retrieval / RAG & vector stores
- Anthropic, "Contextual Retrieval" — https://www.anthropic.com/engineering/contextual-retrieval
- Late chunking (Jina/Weaviate) — https://weaviate.io/blog/late-chunking · Hybrid + RRF — https://weaviate.io/blog/hybrid-search-explained
- Cohere Rerank — https://docs.cohere.com/docs/rerank-overview · LlamaIndex "agentic retrieval" — https://www.llamaindex.ai/blog/rag-is-dead-long-live-agentic-retrieval
- pgvector (PostgreSQL License) · Qdrant · Weaviate (BSD-3) · Milvus · Chroma · LanceDB (Apache-2.0/permissive) · LlamaIndex (MIT)
- Web search / fetch / research tools (read 2026-10-17; prices re-verify): Parallel extract best practices — https://docs.parallel.ai/extract/best-practices · Parallel search modes — https://docs.parallel.ai/search/modes · Parallel deep research — https://docs.parallel.ai/task-api/examples/task-deep-research · Exa search guide for agents — https://exa.ai/docs/reference/search-api-guide-for-coding-agents · Exa Agent — https://exa.ai/docs/reference/agent-api-guide · Anthropic web search tool — https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool · Google Places API — https://developers.google.com/maps/documentation/places/web-service/op-overview

## Memory
- Letta / MemGPT — https://www.letta.com/blog/memory-blocks/ (Apache-2.0; active dev → letta-code)
- mem0 — https://github.com/mem0ai/mem0 (Apache-2.0) · Zep/Graphiti temporal KG — https://arxiv.org/abs/2501.13956 (OSS engine = getzep/graphiti) · cognee (Apache-2.0)
- OWASP AI Agent Security Cheat Sheet (memory poisoning, abuse-case matrix; CC BY-SA 4.0, read 2026-10-17) — https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html

## Evaluation (flagship) & guardrails
- Hamel Husain — "Your AI Product Needs Evals" / "LLM-as-a-Judge" / Evals FAQ (w/ Shreya Shankar) — https://hamel.dev/blog/posts/evals-faq/
- Anthropic, "Demystifying evals for AI agents" — https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- Simon Willison, "FAQs About AI Evals" — https://simonwillison.net/2025/Jul/3/faqs-about-ai-evals/
- LangSmith evaluation concepts — https://docs.langchain.com/langsmith/evaluation-concepts
- Benchmark trust: OpenAI's SWE-Bench Pro retraction — https://x.com/OpenAI/status/2074972179385720836 · "The Leaderboard Illusion" — https://arxiv.org/abs/2504.20879 · Artificial Analysis Coding Agent Index ($/task) — https://artificialanalysis.ai/agents/coding-agents
- promptfoo (MIT) · deepeval (Apache-2.0) · Inspect AI (MIT, UK AISI) · ragas (Apache-2.0) · autoevals (MIT)
- NeMo Guardrails (Apache-2.0) · Guardrails AI (Apache-2.0) · PurpleLlama (MIT code / Llama Community License weights)
- Arize Phoenix (**Elastic License 2.0** — source-available, patent notice; concept-only reuse)

## Structured outputs
- Outlines (Apache-2.0, constrained decoding) · Guidance (MIT) · Instructor (MIT, reask/retry) · OpenAI/Anthropic provider-native structured output & tool-calling docs

## Models, token economics & serving
- Anthropic / OpenAI / Google / xAI model + pricing pages (version-verified 2026-07-25; re-verify)
- Open-weight model cards on Hugging Face (Qwen, DeepSeek, Mistral, Kimi, GLM — MIT/Apache; Llama — restricted Community License)
- Self-host sizing: Hugging Face MoE explainer — https://huggingface.co/blog/moe · NVIDIA inference optimization — https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/ · vLLM parallelism — https://docs.vllm.ai/en/latest/serving/parallelism_scaling.html · vLLM prefix-cache salting — https://docs.vllm.ai/en/latest/design/prefix_caching.html
- Vercel AI SDK — https://ai-sdk.dev (v7, `ai@7.0.37` npm-verified 2026-07-25; re-verify) · vLLM (Apache-2.0) · Ollama (MIT) · llama.cpp (MIT)
- Gateways/routing: litellm (open-core) · Portkey (MIT). Durable execution: Temporal (MIT) · Inngest (SSPL) · Restate (BSL 1.1)
- Routing, read 2026-10-17: Cursor, how Cursor Router works (2026-08-06) — https://prod.cursor.com/blog/how-cursor-router-works · OpenAI Decisions API (public beta) — https://developers.openai.com/api/docs/guides/decisions · Vercel AI Gateway Decision (beta; a triggered decision fallback bills both calls) — https://vercel.com/docs/ai-gateway/modalities/decision · RouteLLM — https://github.com/lm-sys/RouteLLM
- Media meters, read 2026-10-17 (re-verify): Replicate pricing — https://replicate.com/pricing · fal image endpoint (per-megapixel billing) — https://fal.ai/models/fal-ai/flux-pro/v1.1

## Observability
- OpenTelemetry GenAI semantic conventions (`gen_ai.*`) · OpenLLMetry (Apache-2.0, semconv upstreamed) · Langfuse (open-core) · Helicone (Apache-2.0)
- OTel GenAI spans, "Capturing instructions, inputs, and outputs" (content off by default; read 2026-10-17) — https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md · Meter units (read 2026-10-17, re-verify; the dated examples behind `observability-and-cost` §4): Inngest pricing, executions = runs × (steps + 1) — https://www.inngest.com/pricing · Vercel Connect pricing, billed per token request — https://vercel.com/docs/connect/pricing · OpenRouter pricing, fee on credit purchases — https://openrouter.ai/pricing

## Voice (read 2026-10-17; re-verify — the dated facts behind `surface-voice`)
- Architecture and STS limits: OpenAI GPT-Live guide — https://developers.openai.com/api/docs/guides/live · OpenAI Realtime conversations (60-minute session, voice fixed after first audio, `conversation.item.truncate`) — https://developers.openai.com/api/docs/guides/realtime-conversations · Gemini Live session management — https://ai.google.dev/gemini-api/docs/live-session · Gemini Live guide (language list, NON_BLOCKING tools) — https://ai.google.dev/gemini-api/docs/live-guide
- Turn-taking: Deepgram eager end-of-turn — https://developers.deepgram.com/docs/flux/voice-agent-eager-eot · Daily STT benchmark (finalization: median vs p95) — https://www.daily.co/blog/benchmarking-stt-for-voice-agents/ · LiveKit observability (overlapping stages, `lk.agents.*` metrics) — https://docs.livekit.io/agents/observability/ · LiveKit turns (truncate to what was heard) — https://docs.livekit.io/agents/logic/turns/ · LiveKit turn detector (14 languages) — https://docs.livekit.io/agents/logic/turns/turn-detector/ · Smart Turn (BSD-2, 23 languages) — https://github.com/pipecat-ai/smart-turn · barge-in baseline — https://arxiv.org/pdf/2205.15060 · Hamming latency guide (vendor-reported production percentiles) — https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it
- Components: Deepgram models and languages — https://developers.deepgram.com/docs/models-languages-overview · ElevenLabs text normalization — https://elevenlabs.io/docs/best-practices/prompting/normalization · Cartesia pricing (750–800 characters per audio minute) — https://cartesia.ai/pricing
- Evals and traces: τ-Voice (ICML 2026) — https://proceedings.mlr.press/v306/ray26a.html · LiveKit testing — https://docs.livekit.io/agents/build/testing/ · Pipecat OpenTelemetry — https://docs.pipecat.ai/server/utilities/opentelemetry
- Licences (LICENSE files read): Pipecat (BSD-2-Clause) — https://github.com/pipecat-ai/pipecat · LiveKit Agents (Apache-2.0) and its MODEL_LICENSE — https://github.com/livekit/agents/blob/main/MODEL_LICENSE · TEN Framework (Apache-2.0 + Agora conditions) — https://github.com/TEN-framework/ten-framework/blob/main/LICENSE
- The full sourced report and its dated vendor ledger stay in `research/voice/` in this repository; the ledger is not folded.

## Donor skills (patterns/shape, not verbatim)
- wshobson/agents `prompt-engineering-patterns` / `llm-evaluation` (MIT) · addyosmani/agent-skills `context-engineering` (MIT)
- jpoindexter model-routing-and-fallback (no license — paraphrase only) · goodnight77/rag-skills (MIT) · elastic/posthog LLM-observability skills

## Method
Detailed source-linked corpora and the build-gate synthesis live in this repository under
`research/` ({skills,web-canon,github,x}-corpus.md + synthesis.md). Licensing is
teaching content: where a donor is copyleft (GPL/CC-BY-SA) or source-available (BSL/SSPL/ELv2), only
concepts were reused, never verbatim text or code.
