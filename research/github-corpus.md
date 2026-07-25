# AI Systems Skill — GitHub Corpus

Research channel: GitHub repos (via github-relay discovery + direct deep-reads).
Method: curated hydrate of ~64 modal-default donors + 14-shard topic-batch sweep (853 unique repos surfaced), enriched/ranked top tier, then 4 parallel Sonnet workers deep-read READMEs + docs for 4 clusters. Stars/licenses verified live 2026-07-25 via `gh api`. **Star-skepticism applied**: the discovery sweep surfaced several improbable high-star unknowns (affaan-m/ECC 232k, NousResearch/hermes-agent 219k, Graphify-Labs/graphify, NVIDIA/NemoClaw, JuliusBrussee/caveman, DietrichGebert/ponytail) with fake-star/typosquat/planted signatures — **excluded as donors**. The backbone below is the verified modal-default set.

---

## (a) Repo donors table

`default?` legend: **YES** = what most people reach for in the niche · **RISING** = gaining, credible challenger · **NICHE** = distinctive but not default · **LEGACY** = superseded/maintenance, teach as origin-of-pattern not current best practice.

### Agent frameworks & orchestration
| Repo | URL | Stars | License | Teaches | default? |
|---|---|---|---|---|---|
| langchain-ai/langgraph | https://github.com/langchain-ai/langgraph | 38k | MIT | Low-level graph orchestration runtime (Pregel/superstep: nodes+edges+shared state), durable checkpointing, HITL interrupts, subgraphs — the substrate stateful agent loops sit on | YES |
| langchain-ai/langchain | https://github.com/langchain-ai/langchain | 142k | MIT | Model/tool/vector-store integration layer + higher-level `create_agent`; pivoted from LCEL chains to agent-first "agent engineering platform" | YES |
| langchain-ai/deepagents | https://github.com/langchain-ai/deepagents | 26k | MIT | Opinionated Claude-Code-shaped harness on LangGraph: planning, sub-agents w/ isolated context, virtual FS, context summarization+disk-offload, loadable skills, HITL tool approval | RISING |
| crewAIInc/crewAI | https://github.com/crewAIInc/crewAI | 56k | MIT | Dual primitive: "Crews" (role-based autonomous multi-agent) + "Flows" (event-driven deterministic control `@start`/`@listen`/`@router`); they compose | YES |
| microsoft/autogen | https://github.com/microsoft/autogen | 60k | MIT code / CC-BY-4.0 docs | Layered multi-agent conversation framework; origin of GroupChat/ConversableAgent/agent-as-tool patterns | LEGACY (→ Microsoft Agent Framework) |
| ag2ai/ag2 | https://github.com/ag2ai/ag2 | 4.8k | Apache-2.0 | Community fork of AutoGen, v1.0 rewrite: protocol-driven Agent/Network over typed channels + write-ahead-log Hub (durable/replayable multi-agent state); classic API split to ag2-classic | NICHE |
| pydantic/pydantic-ai | https://github.com/pydantic/pydantic-ai | 18k | MIT | "FastAPI feeling for agents" — validation-first, typed `deps_type`/`output_type`, RunContext DI, composable capabilities, YAML/JSON agent-spec, own graph lib + durable execution | RISING |
| agno-agi/agno | https://github.com/agno-agi/agno | 41k | Apache-2.0 | "Framework + runtime for agent platforms" — AgentOS (50+ REST/SSE/WS endpoints), RBAC/multi-tenant, pluggable storage, deploy-anywhere; own-your-stack ops layer | RISING |
| openai/openai-agents-python | https://github.com/openai/openai-agents-python | 28k | MIT | OpenAI's lightweight primitives: Agent + first-class **handoffs** (vs agent-as-tool), Runner loop, Guardrails, Sessions, Tracing, SandboxAgent, RealtimeAgent; 100+ LLMs | YES |
| openai/openai-agents-js | https://github.com/openai/openai-agents-js | 3.5k | MIT | Same core ported to TS/Node/Deno/Bun; browser-native RealtimeSession (WebRTC voice) is a first-class scenario | RISING |
| google/adk-python | https://github.com/google/adk-python | 20k | Apache-2.0 | Google's code-first framework; 2.0 adds graph Workflow Runtime (routing/fan-out/loops/retry/HITL) + Task API for agent-to-agent delegation | RISING |
| huggingface/smolagents | https://github.com/huggingface/smolagents | 28k | Apache-2.0 | The **CodeAgent** pattern — LLM writes+executes Python as its action (vs JSON tool-call), ~30% fewer steps; core kept <1k LOC; strong sandbox story | NICHE (influential) |
| microsoft/semantic-kernel | https://github.com/microsoft/semantic-kernel | 28k | MIT | Enterprise plugin/kernel model; "agents-as-plugins" collapses agent-as-tool + tools into one call mechanism; Python/.NET/Java parity | LEGACY (→ Microsoft Agent Framework) |
| mastra-ai/mastra | https://github.com/mastra-ai/mastra | 26k | Apache-2.0 core + `ee/` source-available | TS-native LangChain/LangGraph answer: model routing, Agent + graph Workflow (`.then()`/`.branch()`/`.parallel()`), suspend/resume HITL, MCP server authoring | RISING→YES (TS) |
| BrainBlend-AI/atomic-agents | https://github.com/BrainBlend-AI/atomic-agents | ~low-k | MIT | Schema-first "LEGO block" composition (Pydantic in/out schemas as the contract, built on Instructor); deliberate reaction against autonomous multi-agent | NICHE |
| The-Pocket/PocketFlow | https://github.com/The-Pocket/PocketFlow | 11k | MIT | The minimal graph abstraction (~100 LOC, zero deps): Node+Flow as the one primitive from which agent/RAG/multi-agent are derived; "agentic coding" pitch | NICHE (teaching-grade) |
| FoundationAgents/MetaGPT | https://github.com/FoundationAgents/MetaGPT | 70k | MIT | Role+SOP-driven software-company sim (`Code = SOP(Team)`): fixed roles pass structured doc artifacts (PRD→design→API→code) through a pipeline; research artifact (AFlow) | NICHE |
| 0xPlaygrounds/rig | https://github.com/0xPlaygrounds/rig | 8k | MIT | The default **Rust** LLM/agent lib; clean split `rig-core` (portable contracts) vs `rig-agent` (orchestration + serializable AgentRun state machine); WASM, 20+ vector stores, OTel | YES (Rust) |

### RAG / vector / retrieval + memory
| Repo | URL | Stars | License | Teaches | default? |
|---|---|---|---|---|---|
| run-llama/llama_index | https://github.com/run-llama/llama_index | 51k | MIT | Canonical RAG data framework: connectors→nodes/indices→retriever/query-engine→synthesis; supplies the shared RAG vocabulary; core + 300+ integration packages | YES |
| deepset-ai/haystack | https://github.com/deepset-ai/haystack | 26k | Apache-2.0 | Pipeline-as-DAG orchestration (explicit inspectable components); frames "context engineering" as the goal; lifecycle hooks for guardrails/cost | RISING (enterprise) |
| chroma-core/chroma | https://github.com/chroma-core/chroma | 29k | Apache-2.0 | Minimal-surface embedded vector store (4-fn API), auto-embed, metadata filtering; the zero-config prototyping default | YES (prototyping) |
| qdrant/qdrant | https://github.com/qdrant/qdrant | 34k | Apache-2.0 | Production dedicated vector engine: dense+sparse+multivector, hybrid fusion (RRF + DBSF named), quantization, distributed sharding, Discovery/MMR tuning, Qdrant Edge | YES (prod self-host) |
| weaviate/weaviate | https://github.com/weaviate/weaviate | 17k | BSD-3-Clause | Vector DB with built-in generative-search + reranking as query-time ops; object+vector co-storage; pluggable vectorizer modules | RISING |
| pgvector/pgvector | https://github.com/pgvector/pgvector | 22k | PostgreSQL License (permissive) | "Vectors next to relational data" Postgres extension; 6 distance operators as native SQL; ACID/JOIN/PITR for free — the "don't run a 2nd service" default | YES (already-on-Postgres) |
| lancedb/lancedb | https://github.com/lancedb/lancedb | 11k | Apache-2.0 | Embedded multimodal "AI lakehouse" on Lance columnar format; vector+FTS+SQL, git-like data versioning, multimodal blobs | RISING (embedded/multimodal) |
| milvus-io/milvus | https://github.com/milvus-io/milvus | 45k | Apache-2.0 | Distributed K8s-native billion-scale vector search; compute/storage separation, every ANN index, GPU (CAGRA), sparse+dense fusion; Milvus Lite embedded mode | YES (scale) |
| infiniflow/ragflow | https://github.com/infiniflow/ragflow | 85k | Apache-2.0 | Full "deep document understanding" RAG engine: template-based chunking w/ HITL boundary verification, multi-recall + fused rerank, grounded citations | RISING (batteries-included engine) |
| HKUDS/LightRAG | https://github.com/HKUDS/LightRAG | 38k | MIT | Lightweight graph-RAG (KG + vector dual-level retrieval); 4 selectable chunking strategies; role-specific LLM config; RAGAS+Langfuse integration | RISING (graph-RAG) |
| mem0ai/mem0 | https://github.com/mem0ai/mem0 | 62k | Apache-2.0 | Multi-level memory (User/Session/Agent); single-pass ADD-only extraction, entity linking, multi-signal fused retrieval, temporal reasoning; LoCoMo/LongMemEval benchmarks | YES (memory) |
| getzep/zep | https://github.com/getzep/zep | 4.8k | Apache-2.0 | **OSS CE deprecated** — now an examples/integrations shell; real engine moved to getzep/graphiti (temporal knowledge graph). Cite Graphiti for the memory model | NICHE/LEGACY-OSS |
| letta-ai/letta | https://github.com/letta-ai/letta | 24k | Apache-2.0 | **Legacy server** (README self-flags); active dev → letta-ai/letta-code. Origin of MemGPT self-editing memory (core-memory in-context blocks + paged archival/recall) | LEGACY-in-presentation |
| topoteretes/cognee | https://github.com/topoteretes/cognee | 29k | Apache-2.0 | KG-based persistent memory + ontology; clean `remember`/`recall`/`forget`/`improve` verb API; session-cache vs permanent-graph split | RISING (KG-memory) |

### Eval (flagship) / guardrails / observability / structured output / prompt
| Repo | URL | Stars | License | Teaches | default? |
|---|---|---|---|---|---|
| explodinggradients/ragas | https://github.com/explodinggradients/ragas | ~15k | Apache-2.0 | RAG-metric vocabulary (faithfulness/context_precision/context_recall/answer_relevancy) the ecosystem echoes; custom LLM-as-judge metrics; synthetic test-set gen. **Moved → vibrantlabsai/ragas** | YES (RAG metric naming) |
| promptfoo/promptfoo | https://github.com/promptfoo/promptfoo | 24k | MIT | Declarative assertion-matrix eval (YAML: prompts×providers×tests×assertions), local-first, CI-gate; **red-teaming first-class** (`redteam`). **Acquired by OpenAI** | YES (eval CLI + red-team) |
| confident-ai/deepeval | https://github.com/confident-ai/deepeval | 17k | Apache-2.0 | "Pytest for LLMs" — LLMTestCase + assert_test, threshold-gated; broadest metric taxonomy (G-Eval, DAG, agentic, RAG, multiturn, MCP, multimodal, safety); trace-based eval via `@observe()` | YES (test-as-code) |
| UKGovernmentBEIS/inspect_ai | https://github.com/UKGovernmentBEIS/inspect_ai | 2.4k | MIT | UK AISI safety/agentic harness — cleanest **Task/Solver/Scorer** separation; jury-of-judges majority vote, decoupled grader role, resumable eval-sets, sandbox+approval+scanners in the eval loop | RISING (advanced/safety) |
| openai/evals | https://github.com/openai/evals | 19k | MIT (data carve-out) | Original YAML-registry model-graded eval framework that seeded the ecosystem's vocabulary | LEGACY (→ hosted Dashboard Evals) |
| braintrustdata/autoevals | https://github.com/braintrustdata/autoevals | 977 | MIT | Composable single-example scorer library (Py+TS); SCORERS.md is the cleanest flat "all scorer types" taxonomy; scorers adapted from openai/evals | NICHE (vocab reference) |
| langfuse/langfuse | https://github.com/langfuse/langfuse | 32k | Open-core (MIT + `ee/` commercial) | Full LLM-ops platform: tracing + prompt mgmt + eval (LLM-judge/code/user-feedback) + datasets/regression runs + playground; self-host or cloud. **Now part of ClickHouse** | YES (self-host obs+eval) |
| Arize-ai/phoenix | https://github.com/Arize-ai/phoenix | 11k | **Elastic License 2.0 (source-available)** | OTel-native tracing (built on OpenInference semconv) + evals + datasets/experiments + prompt playground + built-in debugging agent + MCP server | RISING (OTel-native) |
| Helicone/helicone | https://github.com/Helicone/helicone | 6k | Apache-2.0 | Gateway/proxy-first observability (point baseURL, zero instrumentation) — distinct adoption path from SDK-instrumentation; sessions, prompt versioning | RISING (gateway-first obs) |
| traceloop/openllmetry | https://github.com/traceloop/openllmetry | 7k | Apache-2.0 | OTel instrumentation libraries; **its semconv upstreamed into official OpenTelemetry GenAI** — vendor-neutral emit layer, plugs into any backend (Datadog/Honeycomb/Grafana/…) | YES (instrumentation std) |
| NVIDIA/NeMo-Guardrails | https://github.com/NVIDIA-NeMo/Guardrails | 6.8k | Apache-2.0 | Programmable "rails" via Colang DSL: dialog/input/output/execution rails; LLM vulnerability scanning; most expressive, steepest curve. **Moved → NVIDIA-NeMo/Guardrails** | NICHE→RISING |
| guardrails-ai/guardrails | https://github.com/guardrails-ai/guardrails | 7k | Apache-2.0 | **Guard + Validator** composition, configurable `on_fail` (exception/reask/fix/filter); Hub marketplace of validators; publishes comparative "Guardrails Index" benchmark | YES (code-first guardrails) |
| meta-llama/PurpleLlama | https://github.com/meta-llama/PurpleLlama | 4.3k | **Split: MIT code / Llama Community License weights** | Purple-teaming: CyberSecEval red-team benchmarks (MIT) + guardrail models Llama Guard/Prompt Guard/Code Shield/LlamaFirewall (restrictive model license) | RISING (Llama Guard) / NICHE (toolkit) |
| dottxt-ai/outlines | https://github.com/dottxt-ai/outlines | 15k | Apache-2.0 | **Constrained decoding** (token-level guarantee) via `model(prompt, output_type)`; embedded inside vLLM — de facto standard at inference layer | YES (constrained decoding) |
| guidance-ai/guidance | https://github.com/guidance-ai/guidance | 22k | MIT | Constrained decoding **+ interleaved control flow** (mix Python logic with generation, `lm +=`, grammar/regex `gen()`); Microsoft-backed | YES (co-modal w/ Outlines) |
| 567-labs/instructor | https://github.com/567-labs/instructor | 14k | MIT | **Reask/retry** structured output (Pydantic response_model, auto-retry on validation error); the hosted-API counterpart to constrained decoding. **Moved from jxnl/instructor** | YES (reask/retry) |
| humanlayer/12-factor-agents | https://github.com/humanlayer/12-factor-agents | 25k | Apache-2.0 code / CC-BY-SA-4.0 content | Manifesto: agents as mostly-deterministic software w/ LLM steps; origin of "context engineering," "own your context window," "tools are structured outputs" | YES (reference manifesto) |

### MCP / serving / gateways / durable runtime / SDK & prompt refs
| Repo | URL | Stars | License | Teaches | default? |
|---|---|---|---|---|---|
| modelcontextprotocol/modelcontextprotocol | https://github.com/modelcontextprotocol/modelcontextprotocol | 8.7k | MIT/Apache (transitional) | The MCP **spec** — schema, versioned releases (2026-07-28), tool/resource/prompt contract, transports | YES (ground truth) |
| modelcontextprotocol/servers | https://github.com/modelcontextprotocol/servers | 89k | MIT→Apache (transitional) | Reference server implementations (7, "educational not production"); defers discovery to the registry | YES (reference) |
| modelcontextprotocol/registry | https://github.com/modelcontextprotocol/registry | 7k | MIT/Apache | Server-discovery "app store" (Go/Postgres); API-freeze v0.1, stabilizing | RISING |
| modelcontextprotocol/python-sdk | https://github.com/modelcontextprotocol/python-sdk | 24k | MIT | Canonical Python server/client (`@mcp.tool()`, 3 transports); **v2 pre-release alpha** — pin `<2` for prod today | YES (v1) |
| modelcontextprotocol/typescript-sdk | https://github.com/modelcontextprotocol/typescript-sdk | 13k | MIT/Apache | TS SDK; v2 beta splits `@modelcontextprotocol/server`+`/client`, Standard Schema (Zod/Valibot/ArkType) | YES (v1) |
| PrefectHQ/fastmcp | https://github.com/PrefectHQ/fastmcp | 27k | Apache-2.0 | Ergonomic production layer over the SDK — "powers 70% of MCP servers"; Servers/Apps/Clients. **Moved from jlowin/fastmcp** | YES (build MCP servers, Python) |
| punkpeye/fastmcp | https://github.com/punkpeye/fastmcp | 3.2k | MIT | TS equivalent (sessions/auth/SSE/edge-runtime/stateless) on the official SDK | NICHE (TS) |
| vllm-project/vllm | https://github.com/vllm-project/vllm | 87k | Apache-2.0 | Production GPU-serving reference — PagedAttention, continuous batching, prefix caching, PD-disagg, wide quantization, spec decoding, OpenAI+Anthropic API | YES (GPU serving) |
| ollama/ollama | https://github.com/ollama/ollama | 177k | MIT | Local-first one-command model running; REST API + first-class coding-agent integrations | YES (local dev) |
| ggml-org/llama.cpp | https://github.com/ggml-org/llama.cpp | 122k | MIT | Low-level C/C++ inference kernel under most local tooling; GGUF quantization (1.5–8bit), CPU+GPU hybrid, llama-server | YES (kernel layer) |
| sgl-project/sglang | https://github.com/sgl-project/sglang | 31k | Apache-2.0 | vLLM's rival — RadixAttention prefix caching, zero-overhead scheduler; distinct RL/post-training rollout backbone niche | RISING/YES (frontier scale) |
| huggingface/text-generation-inference | https://github.com/huggingface/text-generation-inference | 11k | Apache-2.0 | **Archived/maintenance-mode**; HF redirects to vLLM/SGLang/llama.cpp. Cautionary "know when serving engine is superseded" | LEGACY |
| InternLM/lmdeploy | https://github.com/InternLM/lmdeploy | 8k | Apache-2.0 | TurboMind + PyTorch dual-backend; strong VLM serving + Ascend NPU; InternLM-ecosystem-centric | NICHE |
| mudler/LocalAI | https://github.com/mudler/LocalAI | 48k | MIT | Meta-runtime aggregator — one OpenAI/Anthropic-compatible API over many backends (llama.cpp/vLLM/whisper/SD) + built-in agents/RAG/MCP | RISING (multi-backend self-host) |
| BerriAI/litellm | https://github.com/BerriAI/litellm | 55k | **Open-core (MIT + `enterprise/` paid)** | Unified 100+ provider call API + Gateway/Proxy (virtual keys, spend, guardrails, Router retry/fallback/load-balance) | YES (OSS gateway) |
| Portkey-AI/gateway | https://github.com/Portkey-AI/gateway | 13k | MIT | Lightweight edge-deployable gateway (122kb, 1600+ models); retries/fallback/routing + distinctive **MCP Gateway** angle | RISING (fully-open counterpoint) |
| temporalio/temporal | https://github.com/temporalio/temporal | 22k | MIT | Canonical durable-execution server; workflows survive crashes/retries/timers — heaviest, most battle-tested for long-running agent loops | YES (durable, heavyweight) |
| inngest/inngest | https://github.com/inngest/inngest | 5.6k | **SSPL v1.0 → Apache after 3yr** | Step-function durable execution (`step.run()`), flow control, event/cron triggers; lighter TS-first Temporal alternative | RISING |
| restatedev/restate | https://github.com/restatedev/restate | 4.2k | **BSL 1.1 → Apache after 4yr** | Language-native durable primitives; explicitly markets "Durable AI Agents" as first-class | NICHE/RISING |
| vercel/ai | https://github.com/vercel/ai | 26k | Apache-2.0 | Unified provider-SDK for TS (`generateText`, one shape all providers), AI SDK UI hooks, structured output via Zod, `ToolLoopAgent` | YES (TS provider SDK) |
| anthropics/claude-cookbooks | https://github.com/anthropics/claude-cookbooks | 50k | MIT | Notebook recipes: tool use, RAG, sub-agents, evals, prompt caching, vision. **Renamed from anthropic-cookbook** | YES (Anthropic prompt ref) |
| openai/openai-cookbook | https://github.com/openai/openai-cookbook | 75k | MIT | OpenAI-side capability-organized notebook recipes (content lives at cookbook.openai.com) | YES (OpenAI prompt ref) |

### Legit discovery adds (surfaced by sweep, worth a look; not deep-read this pass)
| Repo | URL | Stars | Note |
|---|---|---|---|
| langflow-ai/langflow | https://github.com/langflow-ai/langflow | 152k | Visual agent/flow builder (MIT) |
| langgenius/dify | https://github.com/langgenius/dify | 150k | LLM-app platform (open-core) |
| FlowiseAI/Flowise | https://github.com/FlowiseAI/Flowise | 55k | Visual LLM-app builder |
| ray-project/ray | https://github.com/ray-project/ray | 43k | Ray Serve for distributed inference (borders data/infra) |
| upstash/context7 | https://github.com/upstash/context7 | 59k | MCP docs-retrieval server |
| block/goose (aaif-goose mirror noise) | https://github.com/block/goose | ~51k | On-machine agent (verify canonical owner `block`) |
| getzep/graphiti | https://github.com/getzep/graphiti | — | The real OSS temporal-KG engine behind Zep memory |
| microsoft/agent-framework | https://github.com/microsoft/agent-framework | — | The successor to AutoGen + Semantic Kernel — verify + likely a first-tier donor |

---

## (b) Hottest-stack signals (what's actually winning)

- **Agent orchestration — the graph-vs-loop split is now a paired primitive, not a competition.** Nearly every serious framework ships BOTH an autonomy primitive (Agent/loop) and a deterministic graph/workflow engine: CrewAI Crews/Flows, ADK 2.0 Agent/Workflow, Mastra Agent/Workflow, LangGraph itself, Pydantic-AI's graph, AG2's TransitionGraph. "Graph runtime + agent-as-node" is converging as the industry-standard control shape across vendors (Google, Microsoft-successor, LangChain).
- **Winning-by-momentum:** LangGraph/LangChain/DeepAgents stack (deepest 3-tier story), CrewAI (autonomy niche), OpenAI Agents SDK (simplest mental model), Mastra (TS default), Pydantic-AI (type-safety, rising fast). Agno + ADK rising on "own-your-platform" and graph-workflow convergence.
- **Corporate consolidation is reshaping the map mid-2026:** Microsoft EOL'd BOTH AutoGen (maintenance) and Semantic Kernel (superseded) → **Microsoft Agent Framework**. Teach those two as pattern-origins, not current best practice.
- **MCP is the universal tool-transport.** Every agent framework in the survey supports MCP as a tool source and/or exposes agents as MCP servers — the single strongest cross-cluster convergence signal. Build layer = **FastMCP (PrefectHQ)** ("70% of servers"), official SDKs for max control, registry for discovery. Both official SDKs are mid v1→v2 transition (2026-07-28 spec) — pin v1 for prod.
- **Serving:** llama.cpp = kernel layer under everything local; **vLLM = GPU-serving default**, SGLang the fast-closing rival (owns the RL/post-training rollout niche); **Ollama = local-dev default**, LocalAI = multi-backend aggregator. TGI is archived/superseded.
- **Gateways/routing:** **litellm = modal OSS gateway** (Stripe/Netflix/OpenAI-Agents/Google-ADK adopters) but open-core; Portkey the fully-MIT edge-first alternative with an MCP-gateway angle; vercel/ai the in-process TS-library equivalent.
- **Observability — OpenTelemetry-GenAI is winning, first-party confirmed.** OpenLLMetry's semconv was upstreamed into official OTel; Phoenix runs on OpenInference (parallel OTel semconv). Recommend an OTel-GenAI emitter as the vendor-neutral base and treat the platform (Langfuse/Phoenix/Helicone/Datadog) as a swappable destination. Two adoption sub-patterns: SDK-instrumentation-first (Langfuse/Phoenix) vs gateway/proxy-first (Helicone).
- **Vector stores — no single winner, decide by use case:** Chroma (prototype), LanceDB (embedded/multimodal), Qdrant/Weaviate (prod self-host), Milvus (billion-scale), **pgvector (already-on-Postgres default)**. **Hybrid dense+sparse fusion (RRF/DBSF) is now the modal default query**, not an advanced trick.
- **Memory has four distinct philosophies** (encode as options, not one blob): mem0 (fact-extraction + fused retrieval), Zep/Graphiti (temporal KG), Letta/MemGPT (self-editing in-context core+archival), cognee (KG+ontology+session/permanent split). LoCoMo + LongMemEval are the standard benchmarks.
- **Structured output has three legs, all on Pydantic-as-schema:** constrained decoding (Outlines/Guidance, token-guaranteed, needs logit access — Outlines embedded in vLLM), reask/retry (Instructor, hosted-API-friendly, bounded retries), provider-native JSON/tool-calling underneath both.

---

## (c) Patterns worth encoding

**Agent loop / tool contract**
- The agent loop has converged on one shape everywhere (`instructions + tools + driver loop: model-call → tool-exec → feed-result → repeat until stop`). The design interest is entirely in what's layered *around* it.
- Tool/function-call contract is standardized: typed schema (Pydantic/Zod) + docstring-as-description + **validate-and-auto-retry-on-schema-failure** (feed error back, don't hard-fail).
- **CodeAgent alternative** (smolagents): LLM writes/executes code as its action instead of emitting JSON tool-calls — measurable efficiency/accuracy wins; same idea underlies Claude-Code-style agentic coding.

**Multi-agent — 4 recurring shapes**
1. Agent-as-tool (caller stays in control, gets return value) — AutoGen AgentTool, SK agents-as-plugins.
2. Handoff (control genuinely transfers) — OpenAI Agents SDK is the cleanest teacher of the distinction.
3. Autonomous role-based crew / GroupChat — CrewAI, AutoGen/AG2-classic, MetaGPT roles.
4. Declarative graph/workflow with agent-as-node — LangGraph, ADK Workflow, CrewAI Flows, Mastra Workflows (the strongest convergence).

**Context/memory as a first-class subsystem** — DeepAgents FS+summarization+disk-offload, AG2 knowledge/compact/assembly, Mastra Observational Memory, Atomic/Agno Context Providers. The "agent harness" (planning + context mgmt + delegation, opinionated, atop a raw loop framework) is emerging as a named layer (LangChain's 3-tier: LangGraph → create_agent → DeepAgents).

**Durable/resumable execution** — LangGraph checkpointing, Pydantic-AI durable execution, AG2 write-ahead-log, Rig serializable AgentRun, Mastra suspend/resume, ADK Task API. For crash-surviving/multi-day agent loops, graduate to Temporal/Inngest/Restate. Treated as a core requirement, not nice-to-have.

**RAG / retrieval**
- Chunking menu: fixed/recursive (baseline) · semantic/vector-boundary · structural/paragraph/template (RAGFlow's HITL boundary verification = "quality in, quality out") · role-specific LLM config per pipeline stage (LightRAG).
- **Hybrid search + fusion (RRF, DBSF) as the default query**, plus re-ranking (multi-recall+fused rerank, MMR, reranker-as-default).
- Contextual retrieval (prepend chunk-level context before embedding) is now a documented named pattern (Milvus tutorial), not just an Anthropic blog trick.
- Three separable product layers in the decision tree: which vector store ≠ which orchestration framework ≠ do-you-even-assemble-a-pipeline (RAGFlow/LightRAG engines do it end-to-end).
- pgvector-vs-dedicated-DB is the single most reusable decision-framing: default pgvector for small/mid RAG already on Postgres; graduate to Qdrant/Milvus/Weaviate for distributed scale/advanced fusion/vector-native ops.

**Evals (flagship) — three harness architectures by sophistication**
1. Assertion-matrix (promptfoo) — declarative config, no code, CI-gate, built-in red-team.
2. Test-as-code (deepeval) — "pytest for LLMs," threshold-gated `assert_test`.
3. Task/Solver/Scorer (Inspect AI) — most decomposed, the right shape for agentic/safety evals (sandbox + tool/turn/cost limits + human-approval gates in the eval loop).
- Dataset/assertion model: samples are `{input, target, metadata}` almost universally; `target` doubles as the per-sample grading rubric ("your dataset IS your rubric").
- **LLM-as-judge** depth: decouple grader model from model-under-test (role binding) to avoid self-grading bias; **jury pattern** (3+ diverse graders, majority vote) when reliability matters; `GRADE: C/I` regex extraction convention; `partial_credit` + `include_history` knobs; G-Eval (CoT judge on free-text criteria) and DAG (auditable deterministic+LLM node graph) as build-your-own-judge primitives.
- **RAG metric vocabulary is converged and portable**: Faithfulness, Answer/Context Relevancy, Context Precision, Context Recall (ragas ≈ deepeval ≈ autoevals; deepeval literally ships a `RAGAS` composite).
- Offline (static golden dataset) vs regression (Inspect `eval_set()`: idempotent/resumable/multi-model×task — the closest to "eval CI infra") vs online (eval-on-traces: Langfuse/deepeval `@observe()` — evals become production monitors) vs CI-gating (threshold pass/fail, universal).
- Safety/red-team: promptfoo `redteam`, Inspect sandbox+approval+scanners, PurpleLlama CyberSecEval (CWE/MITRE ATT&CK).

**Guardrails taxonomy** — rail/dialog-flow DSL (NeMo/Colang, expressive, steep) · validator-composition (Guardrails AI Guard+Validator+on_fail, marketplace, lightest) · model-based classifiers (Llama Guard/Prompt Guard, inference-call moderation) · code-execution-specific (Code Shield/LlamaFirewall) · eval-loop-embedded approval (Inspect HITL gates — guardrails can live in the agent loop, not only pre-deploy).

**Observability** — instrument with an OTel-GenAI-compliant emitter (OpenLLMetry / OpenInference) as vendor-neutral base; platform is a swappable destination.

**MCP** — protocol → reference servers (thin) → registry (discovery) → SDK (low-level, pin v1) → framework (FastMCP, the default). MCP-as-consumed-tool-contract: server exposes tools/resources/prompts over standard transport; host discovers + invokes.

---

## (d) Candidate jobs / surfaces implied

Jobs (what a user hires the AI skill to do), each mappable to donor evidence above:
1. **Select & route models/providers** — gateways (litellm/Portkey/vercel-ai), fallback/retry, cost/latency mgmt. [Seam with backend = serving substrate.]
2. **Architect prompts & context** — 12-factor manifesto, context-window ownership, harness context-management (DeepAgents/AG2/Mastra).
3. **Enforce structured outputs** — constrained decoding (Outlines/Guidance) vs reask/retry (Instructor) vs provider-native.
4. **Build agents** — loop, tool contracts, multi-agent shapes (handoff/agent-as-tool/crew/graph), CodeAgent alt; frameworks LangGraph/CrewAI/OpenAI-SDK/Pydantic-AI/ADK/Mastra/Agno.
5. **Consume tools via MCP** — FastMCP/SDK/registry; MCP as universal tool transport.
6. **Give agents memory** — mem0/Graphiti/Letta/cognee; four models; short-vs-long-term split.
7. **Build RAG/retrieval behavior** — chunking, embeddings, hybrid search+fusion, re-ranking, contextual retrieval; vector-store selection; end-to-end engines vs assemble-yourself.
8. **Evaluate (FLAGSHIP)** — offline/online/regression/CI-gating harnesses; LLM-as-judge + jury; RAG metrics; agentic + safety/red-team evals.
9. **Guardrail** — validator/rail/classifier/code-exec/approval-gate taxonomy.
10. **Observe AI in production** — OTel-GenAI instrumentation + platform destination; SDK-first vs gateway-first.
11. **Run agents durably** — Temporal/Inngest/Restate for crash-surviving long-running loops.
12. **Self-host inference** — vLLM/SGLang/Ollama/llama.cpp/LocalAI; throughput vs ergonomics vs aggregation. [Seam with operate = prod infra.]

Surfaces (per the family's faceted-router convention): likely 5 surfaces × these jobs — e.g. Decide (selection/tradeoff), Build (implementation pattern), Evaluate (the flagship harness), Harden (guardrails/safety), Operate (observability/durability/serving). Evals is the flagship surface-and-job.

---

## (e) License flags — restrictive cluster foregrounded

**Teach these as first-class build-vs-buy / redistribution decisions (analogous to backend's DB-license angle):**

| Repo | License | The restriction to teach |
|---|---|---|
| **restatedev/restate** | **BSL 1.1** (source-available) | Self-host your own workloads OK; may NOT operate a "Public Restate Platform Service" (resell as managed hosting). Converts to **Apache-2.0 four years** after each release. Textbook CockroachDB/Sentry BSL. |
| **inngest/inngest** | **SSPL v1.0** (non-OSI) | MongoDB-style copyleft blocking hosted-service resale without open-sourcing your stack. Converts to **Apache-2.0 three years** after each release ("Grant of Future License"). |
| **Arize-ai/phoenix** | **Elastic License 2.0** (source-available) | May NOT provide Phoenix to third parties as a hosted/managed service. Carries an active **patent notice (US 11,315,043 / 11,615,345)** with patent-litigation license-termination. Highest-severity flag in the survey. |
| **langfuse/langfuse** | **Open-core** | Root MIT, but `ee/` (+ `web/src/ee/`, `worker/src/ee/`) under a separate commercial Enterprise License (not OSS). Canonical open-core pattern. Now part of ClickHouse. |
| **BerriAI/litellm** | **Open-core split** | MIT everywhere except `enterprise/`: dev/test modifications free, **production use needs a paid BerriAI Enterprise subscription**; BerriAI retains IP in patches. |
| **mastra-ai/mastra** | **Apache-2.0 + `ee/` source-available** | Core Apache-2.0, but code under `ee/` dirs is a Mastra Enterprise License — free dev/test, paid for production. Don't cite `ee/` as a free reference impl. |
| **meta-llama/PurpleLlama** | **Split MIT / Llama Community License** | Tooling (LlamaFirewall, CyberSecEval) = MIT; **model weights** (Llama Guard family, Prompt Guard) = Llama Community License — acceptable-use-bound, >700M-MAU commercial clause. "MIT" does NOT cover the models. |

**Benign "Other"/NOASSERTION — false alarms to NOT mislabel as restrictive:**
- **vercel/ai** — plain Apache-2.0 (monorepo detection artifact).
- **pgvector/pgvector** — PostgreSQL License, fully permissive (BSD/MIT-family); flag only for correct attribution (it's "PostgreSQL License," not "MIT").
- **All modelcontextprotocol/\*** — benign MIT→Apache-2.0 transition notice; new contributions Apache-2.0, docs CC-BY-4.0. Not restrictive.
- **openai/evals** — actually MIT (GH false-negative), but has a contributor data carve-out ("OpenAI reserves the right to use this data") and is functionally legacy.
- **microsoft/autogen** — code MIT, docs CC-BY-4.0 (attribution needed for verbatim docs reuse).
- **12-factor-agents** — Apache-2.0 code + CC-BY-SA-4.0 content (both standard, not "custom").

**Archived / superseded (not a legal flag, a currency flag):**
- **huggingface/text-generation-inference** — archived, HF redirects to vLLM/SGLang/llama.cpp.
- **microsoft/autogen** + **microsoft/semantic-kernel** — superseded by Microsoft Agent Framework.
- **getzep/zep** (OSS CE deprecated → Graphiti) + **letta-ai/letta** (legacy server → letta-code).

---

## (f) 2026 reorgs / repo-moves (so links don't rot)

- `explodinggradients/ragas` → **vibrantlabsai/ragas** (org rebrand; consulting pivot).
- `jlowin/fastmcp` → **PrefectHQ/fastmcp** (the Python FastMCP, ~27k stars — NOT the 3.2k `punkpeye/fastmcp` TS port).
- `jxnl/instructor` → **567-labs/instructor**.
- `anthropics/anthropic-cookbook` → **anthropics/claude-cookbooks**.
- `NVIDIA/NeMo-Guardrails` → **NVIDIA-NeMo/Guardrails** (org reorg).
- **promptfoo** acquired by **OpenAI** (still MIT/OSS).
- **langfuse** now part of **ClickHouse** (Jan 2026).
- **Microsoft Agent Framework** is the live successor to AutoGen + Semantic Kernel — treat both those repos as legacy.
- `microsoft/autogen` successor lives at **github.com/microsoft/agent-framework**.
- Zep's real OSS engine = **getzep/graphiti** (the `getzep/zep` repo is now an examples shell).
- Letta active dev = **letta-ai/letta-code** (the `letta-ai/letta` repo is the legacy server).
- MCP official SDKs (Python + TS) are mid **v1→v2** transition tied to the **2026-07-28 spec** — pin v1 for production, don't teach v2 patterns as stable.

---

## (g) Open questions for skill authoring

1. **Microsoft Agent Framework** wasn't in the deep-read set but is the live successor to two 60k/28k-star donors — needs a dedicated read before the skill ships; likely a first-tier "Build agents" donor.
2. **Where's the frontend/backend seam on serving?** Serving engines (vLLM/Ollama) and durable runtimes (Temporal) border backend/operate turf. The AI skill should own model/provider *behavior* (routing, fallback, cost, structured output, eval) and reference — not re-teach — the serving substrate. Confirm the exact cut with the backend/operate channels.
3. **RAG plumbing vs RAG behavior seam** (with backend + data): the AI skill owns retrieval *behavior* (chunking/embeddings/re-ranking/retrieval-eval); backend owns the vector-store-as-served-substrate; data owns the governed pipeline + vector store as dataset. The three-layer separation (which store ≠ which framework ≠ engine-vs-assemble) is the decision-tree spine.
4. **Is "agentic coding" (CodeAgent / Claude-Code-shaped harnesses: DeepAgents, smolagents, Letta-code) in-scope or its own thing?** It recurs across the agent cluster but overlaps the coding-agent product space.
5. **How prescriptive on the BSL/SSPL/ELv2 cluster?** The durable-runtime + Phoenix licenses are genuine adoption blockers — the skill should teach the *pattern* ("source-available with future-open date, self-host yes / resell no") rather than pick winners, mirroring backend's DB-license teaching.
6. **Structured output "third leg"** — provider-native JSON/tool-calling underlies both constrained-decoding and reask/retry; worth confirming whether the skill teaches all three or frames provider-native as the substrate.
7. **Star-provenance:** several high-star discovery repos looked planted/fake — if any turn out legitimate on a health pass, revisit. Current call: excluded.
