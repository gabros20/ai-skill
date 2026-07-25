# Web-Canon Corpus — `ai` (AI Systems) Skill Research

**Channel:** canonical docs, writings, papers, blogs.
**Aggregated:** 2026-07-25 by the web-canon sub-orchestrator from 4 parallel Sonnet fetch workers.
**Method note:** every fetch worker verified claims against the live page at fetch time (2026-07-25), not model memory. Model names / SDK versions / prices are the fastest-churning facts here and are dated + flagged throughout. Raw worker reports: `scratchpad/ai-research/reports/web-{1,2,3,4}.md`.

---

## (a) Source table

| # | Title | URL | Author / Org | What it teaches |
|---|---|---|---|---|
| 1 | Building Effective AI Agents | https://www.anthropic.com/engineering/building-effective-agents | Anthropic Eng (Dec 19 2024) | Workflow-vs-agent taxonomy; 5 workflow patterns; ACI/tool design; "start simplest" |
| 2 | Agent Skills (overview) | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | Anthropic | Filesystem skills, progressive disclosure (3 levels), frontmatter contract, sandboxing |
| 3 | Equipping agents with Agent Skills | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Anthropic Eng | Why skills > prompts/tools for procedural knowledge |
| 4 | Effective Context Engineering for AI Agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic Eng (Sep 29 2025) | **Canonical** prompt→context-engineering shift; attention budget; compaction; sub-agents |
| 5 | Introducing Contextual Retrieval | https://www.anthropic.com/engineering/contextual-retrieval | Anthropic Eng (Sep 19 2024) | Contextual embeddings + contextual BM25; 49%/67% failure reduction; caching cost |
| 6 | Demystifying evals for AI agents | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | Anthropic Eng (Jan 9 2026) | Eval complexity ladder; grader taxonomy; pass@k vs pass^k; regression suites |
| 7 | Reduce hallucinations / guardrails | https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations | Anthropic | Prompt-level guardrail patterns (allow "I don't know", cite-or-retract, CoT verify) |
| 8 | Prompt engineering overview + best practices | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | Anthropic | Evals-first sequencing; SMART success criteria; grading methods |
| 9 | Model Context Protocol spec (2025-11-25) | https://modelcontextprotocol.io/specification/2025-11-25 | MCP (Anthropic-originated, multi-vendor) | JSON-RPC; host/client/server; tools/resources/prompts/sampling/roots/elicitation; stdio + Streamable HTTP |
| 10 | MCP 2026-07-28 release candidate | https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ | MCP | **RC that may supersede 2025-11-25 — verify at publish** |
| 11 | A Practical Guide to Building Agents (PDF) | https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf | OpenAI | When to build agents, orchestration patterns, guardrails (PDF text unextractable — low confidence) |
| 12 | OpenAI Agents SDK | https://openai.github.io/openai-agents-python/ | OpenAI | Agents/Handoffs/Guardrails/Sessions/Runner/Tracing; Swarm successor; Apr 2026 sandboxing update |
| 13 | Google Agent Development Kit (ADK) | https://adk.dev/ | Google | Code-first agents; sequential/parallel/loop workflows; native MCP; ADK 2.0 GA graph workflows |
| 14 | LangGraph overview | https://docs.langchain.com/oss/python/langgraph/overview | LangChain | StateGraph nodes/edges/state; checkpointing; HITL; low-level vs LangChain high-level |
| 15 | Mastra docs | https://mastra.ai/docs | Mastra (YC) | TS agents+workflows+memory; agent-vs-workflow decision; 90+ provider routing |
| 16 | DSPy | https://dspy.ai/ | Stanford NLP | Program-not-prompt; Signatures/Modules/Optimizers; GEPA |
| 17 | LlamaIndex agents & workflows | https://developers.llamaindex.ai/python/framework/use_cases/agents/ | LlamaIndex | Event-driven Workflows; AgentWorkflow multi-agent; agentic RAG |
| 18 | 12-Factor Agents | https://github.com/humanlayer/12-factor-agents | Dex Horthy / HumanLayer | 12 factors; "agents are mostly just software"; own your context/control-flow |
| 19 | Late Chunking (Weaviate explainer) | https://weaviate.io/blog/late-chunking | Jina AI / Weaviate (Sep 5 2024) | Embed whole doc first, pool chunk vectors after; late-interaction quality at naive storage |
| 20 | Hybrid search + RRF explained | https://weaviate.io/blog/hybrid-search-explained | Weaviate (Jan 27 2025) | Dense+sparse parallel; RRF fuses on rank not score; orthogonal failure modes |
| 21 | Cohere Rerank overview | https://docs.cohere.com/docs/rerank-overview | Cohere | Cross-encoder 2nd-stage rerank; refine, don't replace 1st-stage |
| 22 | RAG is Dead, Long Live Agentic Retrieval | https://www.llamaindex.ai/blog/rag-is-dead-long-live-agentic-retrieval | LlamaIndex (May 29 2025) | "Naive top-k RAG is dead"; agentic retrieval routing/decomposition |
| 23 | Long-Context vs RAG decision framework | https://tianpan.co/blog/2026-04-09-long-context-vs-rag-production-decision-framework | TianPan (Apr 9 2026) | 5-factor RAG-vs-long-context; cost/latency/freshness; synthetic-benchmark caveat |
| 24 | LlamaIndex agentic strategies | https://developers.llamaindex.ai/python/framework/optimizing/agentic_strategies/agentic_strategies/ | LlamaIndex | Routing / query transforms / sub-question / plan-then-retrieve |
| 25 | Ragas metrics | https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/ | Ragas (Dec 9 2025) | Faithfulness, Context Precision/Recall; retrieval-vs-generation split |
| 26 | Letta memory / Memory Blocks | https://www.letta.com/blog/memory-blocks/ | Letta/MemGPT (May 14 2025) | OS-inspired memory hierarchy; self-editing memory blocks; shared blocks |
| 27 | mem0 — what is agent memory | https://mem0.ai/blog/what-is-ai-agent-memory | mem0 (Jul 22 2026) | Conversation/session/user/org layers; capture→promote→retrieve; ADD/UPDATE/DELETE/NOOP |
| 28 | Zep: Temporal KG for Agent Memory | https://arxiv.org/abs/2501.13956 | Zep/Graphiti (Jan 20 2025) | Bi-temporal knowledge graph; episodic/semantic/community tiers; DMR 94.8% |
| 29 | Your AI Product Needs Evals | https://hamel.dev/blog/posts/evals/ | Hamel Husain (Mar 29 2024) | 3-level eval framework; look at your data; eval flywheel |
| 30 | LLM Evals FAQ | https://hamel.dev/blog/posts/evals-faq/ | Hamel Husain + Shreya Shankar (mod. Jul 18 2026) | Error analysis (open/axial coding); binary>Likert; 60–80% time on error analysis |
| 31 | LLM-as-a-Judge That Drives Business Results | https://hamel.dev/blog/posts/llm-judge/ | Hamel Husain (Oct 29 2024) | 7-step judge methodology; Critique Shadowing; align via precision/recall |
| 32 | FAQs About AI Evals | https://simonwillison.net/2025/Jul/3/faqs-about-ai-evals/ | Simon Willison (Jul 3 2025) | Evals = the distinguishing factor; 70% pass can beat 100% |
| 33 | OpenAI evaluation best practices | https://developers.openai.com/api/docs/guides/evaluation-best-practices | OpenAI | Metric/human/LLM-judge; 5-step; **URL deprecating Nov 30 2026** |
| 34 | Braintrust evals | https://www.braintrust.dev/docs/guides/evals | Braintrust | Data+Task+Scorers; immutable experiments; Instrument→Observe→Annotate→Evaluate→Deploy |
| 35 | LangSmith evaluation concepts | https://docs.langchain.com/langsmith/evaluation-concepts | LangChain | **Clearest offline/online taxonomy**; reference-free vs reference-based evaluators |
| 36 | NeMo Guardrails | https://github.com/NVIDIA/NeMo-Guardrails | NVIDIA (v0.23.0) | Input/output/dialog/retrieval/execution rails; Colang |
| 37 | Guardrails AI | https://www.guardrailsai.com/docs | Guardrails AI | Validators + Guards; Hub; structured-data enforcement |
| 38 | OpenAI Moderation API | https://developers.openai.com/api/docs/guides/moderation | OpenAI | `omni-moderation-latest`; 13 categories; "signal not blocker" |
| 39 | Langfuse tracing | https://langfuse.com/docs/tracing | Langfuse | Trace/span vocabulary; token+cost+latency tracking |
| 40 | AI Engineering (book) | https://www.oreilly.com/library/view/ai-engineering/9781098166298/ | Chip Huyen (2025) | Most-read O'Reilly 2025; models/evals/RAG/agents/finetuning (TOC unverified) |
| 41 | Anthropic models overview + pricing | https://platform.claude.com/docs/en/about-claude/models/overview | Anthropic | Live model lineup + prices (see §c) |
| 42 | OpenAI models + pricing | https://developers.openai.com/api/docs/pricing | OpenAI | GPT-5.6 Sol/Terra/Luna lineup + prices |
| 43 | Google Gemini models + pricing | https://ai.google.dev/gemini-api/docs/pricing | Google | Gemini 2.5 Pro stable / 3.6 Flash lineup |
| 44 | xAI Grok models | https://docs.x.ai/docs/models | xAI | Grok 4.5/4.3/4.20 lineup |
| 45 | Vercel AI SDK docs | https://ai-sdk.dev/docs/introduction | Vercel | **v7 current** (`ai@7.0.37`); `@ai-sdk/harness` agent-loop package |
| 46 | OpenAI Structured Outputs | https://developers.openai.com/api/docs/guides/structured-outputs | OpenAI | `strict: true` JSON-schema-constrained decoding |
| 47 | vLLM docs | https://docs.vllm.ai/en/latest/ | vLLM (UC Berkeley) | PagedAttention, continuous batching, speculative decoding, quantization |
| 48 | Ollama | https://ollama.com | Ollama | Easiest local open-model runner; cloud passthrough |
| 49 | LM Studio | https://lmstudio.ai | LM Studio | Local desktop LLM; runs GLM 5.2 / Kimi 2.6 / DeepSeek V4 Pro |

---

## (b) Canonical patterns

### Agents & orchestration
- **The load-bearing taxonomy (Anthropic #1, now industry-wide):** *Workflows* = LLMs+tools on predefined code paths; *Agents* = LLMs dynamically directing their own process/tool use. Five named workflow patterns: **prompt chaining, routing, parallelization (sectioning/voting), orchestrator-workers, evaluator-optimizer.** Autonomous agents only for open-ended, non-predefinable step sequences.
- **Universal advice:** start with the simplest thing (single call + retrieval/examples); add agentic autonomy only when steps genuinely can't be predefined. Echoed by Anthropic #1, Mastra #15, and 12-Factor #18 ("own your control flow").
- **Every framework converges on delegation as the multi-agent primitive**, differently named: OpenAI **Handoffs** (#12), Anthropic **orchestrator-workers / sub-agents** (#1, #4), ADK **collaborative agents** (#13), LlamaIndex **AgentWorkflow** (#17), LangGraph **sub-graphs** (#14). Shared rationale: **context/attention-budget isolation** — each sub-agent gets a clean context and returns a condensed summary.
- **12-Factor Agents (#18)** is the "agents are mostly just software" spine: own your prompts, own your context window, tools are just structured outputs, unify execution+business state, launch/pause/resume, own your control flow, small focused agents, stateless-reducer agents.
- **Tool design is a first-class surface**: Anthropic's ACI (#1), context-engineering's "token-efficient, unambiguous, non-overlapping tools" (#4), 12-Factor's "tools are just structured outputs" (#18).

### Context engineering (the discipline shift)
- **Canonical source: Anthropic "Effective Context Engineering" (#4, Sep 29 2025).** Prompt engineering (write instructions once) is *subsumed* into context engineering: curating the optimal token set every inference turn across system prompt + tools + external data + message history.
- Drivers: agentic loops accumulate context; **"context rot"** from O(n²) attention; **finite attention budget** (like human working memory).
- Toolkit: right-altitude system prompts; minimal non-overlapping tools; curated canonical few-shot (not exhaustive edge cases); **just-in-time retrieval** (keep IDs/paths, load at runtime); long-horizon levers — **compaction**, **structured note-taking** (external memory files), **sub-agent isolation**.
- **Agent Skills (#2)** operationalize progressive disclosure: L1 frontmatter (~100 tok, always loaded) → L2 SKILL.md body (<5k tok, on trigger) → L3 bundled resources/scripts (loaded/executed on reference; code output enters context, not code).

### MCP (as-consumed)
- **Current stable spec: 2025-11-25** (#9). JSON-RPC 2.0; roles Host/Client/Server; modeled on LSP. Server primitives: **Tools, Resources, Prompts**; client primitives: **Sampling, Roots, Elicitation**. Transports: **stdio** and **Streamable HTTP** (replaced HTTP+SSE; resumable, session via `MCP-Session-Id`). Explicit consent/trust model; tool descriptions are untrusted unless from a trusted server.
- **MCP is the interoperable layer frameworks build ON, not against** — ADK ships native MCP tool support (#13). **A 2026-07-28 RC exists (#10) and may already be the new stable revision — most time-sensitive fact in this corpus.**

### RAG / retrieval behavior
Canon converges on a 5-stage modern pipeline:
1. **Chunk deliberately**: either contextual retrieval (Anthropic #5 — prepend 50–100 tok LLM context to each chunk before indexing; ~$1.02/M doc tokens via prompt caching) or late chunking (Jina/Weaviate #19 — embed whole doc, pool chunk vectors after). Both fix chunks-lose-document-context.
2. **Retrieve hybrid**: dense + sparse/BM25 in parallel, fuse with **Reciprocal Rank Fusion** (#20 — RRF fuses on rank because BM25 and cosine scores are incompatible scales; k≈60). Most uncontested claim in the cluster.
3. **Rerank 2nd stage**: retrieve wide (Anthropic used top-150), cross-encoder rerank (Cohere #21), keep small high-precision set (top-20). Largest single accuracy jump (Anthropic: 49%→67% failure reduction from adding rerank).
4. **Add an agentic/decomposition layer** when queries are non-trivial: routing, query transforms, sub-question decomposition, plan-then-retrieve (LlamaIndex #22, #24). This is what "RAG evolved into," not a replacement.
5. **Evaluate retrieval and generation separately** (Ragas #25): Context Precision/Recall = retrieval quality; Faithfulness/Response Relevancy = generation quality — tells you whether to fix chunking or the prompt.

### Agent memory
- Three products, one shared split — **in-context now** vs **persisted + retrieved on demand** — diverging on storage model:
  - **Letta/MemGPT (#26):** OS-inspired hierarchy (core/in-context blocks → recall → archival); **self-editing memory** via tool calls (model manages its own memory); shareable memory blocks.
  - **mem0 (#27):** conversation/session/user/org layers; capture→promote→retrieve; LLM-mediated **ADD/UPDATE/DELETE/NOOP** consolidation over a vector store.
  - **Zep/Graphiti (#28):** **bi-temporal knowledge graph** (validity intervals: when-true vs when-ingested); episodic/semantic/community tiers; rejects flat vector-only memory.
- All map onto a **working / episodic / semantic / procedural** cognitive taxonomy (weakest-sourced — synthesized from vendor blogs, not a single canonical paper).

### Evals (flagship discipline)
The single dominant methodology across Hamel #29–31, Anthropic #6, Willison #32:
1. **Look at your data constantly** — error analysis is the highest-leverage activity; **spend 60–80% of eval effort here** (#30).
2. **Open coding → axial coding → taxonomy saturation** (~100 traces until failure modes stop appearing) (#30).
3. **Binary pass/fail > 1–5 Likert** for humans and judges — forces explicit criteria ("criteria drift") (#31).
4. **Critique Shadowing** to build an LLM judge: expert gives pass/fail + detailed critique → few-shot the judge → iterate to alignment (#31).
5. **Align judge to humans via precision/recall separately, not raw agreement** (imbalanced data) (#29, #31).
6. **Eval maturity ladder**: unit tests → human/model eval → A/B (Hamel #29); code-based → model-based → human graders (Anthropic #6); mirrored in Braintrust/LangSmith datasets+scorers+experiments (#34, #35).
7. **Eval flywheel** — same trace/critique infra feeds fine-tuning data curation and debugging (#29).
8. **Generic off-the-shelf metrics fail** — correctness is domain/product-specific (#29, #30).
- **pass@k vs pass^k** (#6): pass^k (all k trials succeed) is the production-reliability metric.
- **Offline/online/regression/safety taxonomy** (clearest in LangSmith #35 + Anthropic #6): offline = curated datasets w/ references, gate CI; online = live traffic, no references, reactive; regression = ~100% pass on solved tasks (capability evals "graduate" in); safety = cross-cutting concern layered on both.

### Guardrails (three archetypes)
1. **Structural pipeline rails** — NeMo (#36: input/output/dialog/retrieval/execution rails + Colang), Guardrails AI (#37: Validators+Guards). Deterministic, composable, auditable.
2. **Classifier-based moderation** — OpenAI Moderation (#38: 13 categories, "signal not blocker").
3. **Prompt-engineered self-verification** — Anthropic (#7: allow "I don't know", cite-or-retract, CoT verify, best-of-N). Cheapest, weakest guarantee, good first layer.

### Observability
- **Trace/span vocabulary** (Langfuse #39): trace = one request lifecycle; span/observation = nested op (LLM call/retrieval/tool) with timing+tokens+cost+I/O. Aligns with LangSmith runs/threads (#35) and Braintrust "Instrument" (#34). Standardize on trace/span.

### Structured outputs
- Both major providers converge on **JSON-schema-constrained decoding**: OpenAI `strict: true` (#46, guarantees schema adherence, first-request schema-compile latency); Anthropic `output_config` + `strict` on tool defs, plus `client.messages.parse()` typed wrapper. Use the same idea for tool-argument conformance.

---

## (c) Model + token-economics landscape (version-verified 2026-07-25)

> All figures live-fetched 2026-07-25. **These supersede the environment's stated model names** (env said "Opus 4.8 / Haiku 4.5 / Claude 5 family"): Opus 4.8 is real but now **legacy** — flagship is **Claude Opus 5**.

### Frontier / closed
| Provider | Flagship | ID | Context | Input $/MTok | Output $/MTok |
|---|---|---|---|---|---|
| Anthropic (top) | Claude Fable 5 / Mythos 5 | `claude-fable-5` / `claude-mythos-5` | 1M | $10 | $50 |
| **Anthropic (flagship)** | **Claude Opus 5** | `claude-opus-5` | 1M | $5 | $25 |
| Anthropic (mid) | Claude Sonnet 5 | `claude-sonnet-5` | 1M | $2→$3 (intro ends 2026-08-31) | $10→$15 |
| Anthropic (fast) | Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1 | $5 |
| OpenAI | GPT-5.6 Sol / Terra / Luna | `gpt-5.6-sol` / `-terra` / `-luna` | 1.05M | $5 / $2.50 / $1 | $30 / $15 / $6 |
| Google | Gemini 2.5 Pro (stable) / 3.6 Flash | `gemini-2.5-pro` / `gemini-3.6-flash` | — | $1.25–2.50 / $1.50 | $10–15 / $7.50 |
| xAI | Grok 4.5 | `grok-4.5` | 500K | $2 (<200k) | $6 (<200k) |

Source pages: Anthropic #41, OpenAI #42, Google #43, xAI #44. Env-cache (2026-06-24) is one release behind on Anthropic + assumes bare "GPT-5"/"Grok 4"/"Gemini 3.x Pro" — all corrected above.

### Open-weight flagships (Hugging Face, 2026-07-25)
| Family | Flagship | License | Context |
|---|---|---|---|
| Meta Llama | Llama 4 Maverick/Scout — **no newer version found (stalled)** | Llama Community License (unconfirmed this fetch) | — |
| Alibaba Qwen | Qwen3.6-35B-A3B / Qwen3.5-397B-A17B | Apache 2.0 | 262K native / ~1M via YaRN |
| DeepSeek | DeepSeek-V4-Pro (1.6T/49B active) | MIT | 1M |
| Mistral | Mistral-Large-3-675B-Instruct-2512 | Apache 2.0 | — |
| Moonshot | Kimi K2.6 / K2.7-Code | Modified MIT | 256K |
| Zhipu/Z.ai | GLM-5.2 (753B) | MIT | 1M |

**Open ≠ open-source license**: Qwen/DeepSeek/Mistral/GLM are MIT/Apache (commercial-friendly); Kimi is "Modified MIT"; **Llama is a custom use-restricted community license, not OSI-approved**. Frontier open models are now trillion-param MoE ("open but datacenter-scale"); locally-feasible tier = Qwen3.6-35B-A3B, Mistral-Small-4, Llama 4 Scout. VRAM scales with **active** params × quantization, not total (MoE).

### Token economics (verified)
- **Prompt caching, provider-differentiated**: Anthropic — 5-min write 1.25×, 1-hr write 2×, read 0.1× (#41). OpenAI GPT-5.6+ — write 1.25×, 30-min TTL, requires `prompt_cache_key`; older OpenAI had no write fee (#42/caching). Both now converge on a **write-premium + cheap-read** model. Min cacheable prompt OpenAI = 1,024 tokens.
- **Batch APIs**: flat **50%** off across Anthropic, OpenAI, Google — highest-confidence, easiest cost lever.
- **Model routing/cascade**: every provider ships 3–5 tiers; flagship output ≈ 5–10× cheapest-tier output; cheap tier is "good enough" for classification/extraction — highest-leverage lever before caching/batching.
- **Output-token / effort control**: `effort`/reasoning-level params are a first-class lever; lowering effort on a flagship is often cheaper and near-as-capable as switching to a smaller model.

### SDK / local tooling
- **Vercel AI SDK: v7 current** — `ai@7.0.37` on npm (authoritative, #45). User's "AI SDK 5→7" range **confirmed**: SDK went through 5, 6, 7; **7 is current**. Notable: dedicated **`@ai-sdk/harness`** agent-loop package (telemetry for multi-step turns, suspension/interrupt handling) — agentic control flow is the active dev area. Re-run `npm view ai version` at publish (patches ship fast).
- **vLLM (#47):** PagedAttention, continuous batching, speculative decoding, FP8/INT quantization, tensor/pipeline/expert parallelism.
- **Ollama (#48):** easiest local runner + cloud passthrough. **LM Studio (#49):** desktop; runs GLM 5.2 / Kimi 2.6 / DeepSeek V4 Pro (independently corroborates open-flagship versions); MLX + llama.cpp; "Bionic" preview.

---

## (d) Hottest-stack read from the canon

- **Agentic control flow is where everyone is investing right now.** OpenAI Agents SDK added sandboxing + in-distribution harness (Apr 2026, #12); Vercel shipped a separate `@ai-sdk/harness` package (#45); ADK 2.0 GA added graph-based workflows (#13); LangGraph is explicitly the "low-level orchestration runtime for long-running stateful agents" (#14). The primitive that won: **delegation to focused sub-agents with isolated context**.
- **MCP is the consensus interop layer** — the standard frameworks build on, not compete with. Watch the 2026-07-28 RC.
- **Context engineering has displaced "prompt engineering" as the framing** (Anthropic #4). The mental model everyone now shares: finite attention budget, just-in-time retrieval, compaction, external note-taking.
- **RAG didn't die — naive top-k RAG did.** Modern stack = contextual/late chunking → hybrid + RRF → cross-encoder rerank → agentic decomposition layer. Emerging hybrid: retrieve-to-narrow then long-context-reason over the subset (#22, #23).
- **Evals are the agreed distinguishing factor** between reliable and YOLO AI systems (Willison #32; Hamel #29–31). Error-analysis-first, binary judges, Critique Shadowing, offline+online+regression. This is the deepest, most mature, most consensus-heavy body of canon — strong flagship candidate.
- **Token economics converged**: 3–5 tier model families, write-premium caching, flat 50% batch, effort/reasoning knobs. Open-weight frontier went trillion-param MoE + mostly-permissive licenses (except Llama).

---

## (e) Candidate jobs / surfaces + distinctive value-add

### Candidate jobs (faceted-router axis)
1. **Select & route a model** — provider/tier choice, routing/cascade, fallback, cost/latency/effort budget.
2. **Architect prompts & context** — prompt→context engineering; caching-aware; progressive disclosure.
3. **Produce structured outputs** — schema-constrained decoding, tool-arg conformance, validation.
4. **Build an agent** — loop, tool use, MCP-as-consumed, handoffs, termination, launch/pause/resume.
5. **Orchestrate multi-agent systems** — orchestrator-workers, evaluator-optimizer, sub-agent context isolation.
6. **Add retrieval / RAG behavior** — chunking, hybrid+RRF, rerank, contextual, agentic decomposition.
7. **Give the system memory** — working/episodic/semantic/procedural; Letta/mem0/Zep patterns.
8. **Evaluate the system (FLAGSHIP)** — error analysis, LLM-as-judge, offline/online/regression/safety.
9. **Add guardrails** — structural rails, classifier moderation, prompt self-verification.
10. **Observe in production** — traces/spans, token/cost/latency, drift, online evals.

### Candidate surfaces (per job)
Chat assistant · batch/pipeline job · autonomous agent · RAG app · coding agent · voice/realtime. (Surface axis needs a design decision by the skill builder — leaning toward deployment-shape: interactive-chat / batch / autonomous-agent / retrieval-app / multi-agent.)

### Distinctive value-add candidates (backend taught DB licenses)
- **WINNER candidate — Token/cost economics + open-vs-closed licensing.** Directly mirrors backend's DB-license move: teach the per-model $ math (input/output/cache/batch multipliers), routing cascades, effort knobs, AND the open-weight license spread (MIT/Apache vs Llama's restricted community license; "open ≠ open-source"). This is concrete, decision-changing, and under-taught elsewhere. Backing: fully version-verified pricing (§c) + license table.
- **Runner-up — Eval-first discipline as the spine.** The Hamel/Anthropic evals canon is the most mature, most consensus-heavy body here; making evals the load-bearing flagship (not an afterthought) is distinctive vs. tutorials that treat evals last.
- **Structural differentiator — Anti-staleness as a taught method.** The model landscape is version-dated and churns monthly (this corpus caught Opus 4.8→Opus 5, "GPT-5"→GPT-5.6, "Grok 4"→4.5 all within one env-cache cycle). Teach HOW to re-verify (pricing pages, npm registry, HF cards) rather than freezing names — a genuinely distinctive stance for an AI skill.

---

## (f) Open questions & staleness flags (re-verify at build time)

**Time-sensitive / must re-check:**
1. **MCP 2026-07-28 RC (#10)** — has it become the stable revision superseding 2025-11-25? Single most time-sensitive fact.
2. **Claude Opus 5** is flagship (Opus 4.8 legacy) — re-confirm lineup at build; Anthropic naming cadence is fast (Fable/Mythos/Opus/Sonnet 5 all live).
3. **Vercel AI SDK v7** (`ai@7.0.37`) — re-run `npm view ai version`; patches ship same-day-fast.
4. **Llama appears stalled at Llama 4** while all other open families jumped a major version — re-check for Llama 4.x/5.
5. **Open-model versions** (Qwen3.6, DeepSeek-V4, Mistral-Large-3, Kimi K2.6/K2.7, GLM-5.2) churn — re-verify HF cards.

**Could not verify (do not fabricate):**
6. **LMArena/benchmark leaderboard** — client-rendered, not fetchable via plain WebFetch; needs browser automation. No ranking asserted.
7. **OpenAI "Practical Guide to Building Agents" PDF (#11)** — text unextractable; content inferred from SDK docs. Re-fetch with PDF-text tool.
8. **Chip Huyen AI Engineering TOC (#40)** — O'Reilly 403'd; chapter list unverified. Don't cite chapter numbers without fresh fetch.
9. **OpenAI eval-docs URL (#33)** deprecating Nov 30 2026; Anthropic docs host migrated to `platform.claude.com`. Update canonical URLs at build.
10. **Llama & Kimi K2.7 exact license clauses** — pull from primary LICENSE files before stating commercial terms.
11. **Ollama / vLLM exact version numbers** — not surfaced this pass; fetch `/download` or GitHub releases.
12. **Local VRAM sizing figures** — deliberately omitted (no sizing chart fetched); fetch a GGUF sizing table before publishing numbers.

**Design questions for the skill builder:**
13. Surface axis: deployment-shape (chat/batch/agent/RAG/multi-agent) vs. app-type? Needs a call.
14. Where's the frontend/backend/data/automation seam drawn in practice — e.g. does "add RAG behavior" (this skill) vs "RAG plumbing/serving" (backend) vs "vector store as governed dataset" (data) split cleanly, or need explicit seam docs?
15. Working/episodic/semantic/procedural memory taxonomy is under-sourced (vendor blogs only) — find the canonical cognitive-science-to-agents mapping before treating as settled.
16. Is "agents-as-first-class" the spine (like frontend/product did) with evals as flagship, or evals as spine? The canon supports either; recommend agents-spine + evals-flagship + token-economics as the distinctive value-add.
