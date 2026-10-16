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

## Tools & MCP
- Model Context Protocol spec — https://modelcontextprotocol.io/specification (stable 2025-11-25; 2026-07-28 RC pending — re-verify)
- MCP Python/TypeScript SDKs (MIT, v1 for prod) · FastMCP (PrefectHQ, Apache-2.0) — https://github.com/PrefectHQ/fastmcp · MCP registry

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

## Observability
- OpenTelemetry GenAI semantic conventions (`gen_ai.*`) · OpenLLMetry (Apache-2.0, semconv upstreamed) · Langfuse (open-core) · Helicone (Apache-2.0)

## Donor skills (patterns/shape, not verbatim)
- wshobson/agents `prompt-engineering-patterns` / `llm-evaluation` (MIT) · addyosmani/agent-skills `context-engineering` (MIT)
- jpoindexter model-routing-and-fallback (no license — paraphrase only) · goodnight77/rag-skills (MIT) · elastic/posthog LLM-observability skills

## Method
Detailed source-linked corpora and the build-gate synthesis live in this repository under
`research/` ({skills,web-canon,github,x}-corpus.md + synthesis.md). Licensing is
teaching content: where a donor is copyleft (GPL/CC-BY-SA) or source-available (BSL/SSPL/ELv2), only
concepts were reused, never verbatim text or code.
