# Usage reference

## Activation

`ai` should trigger on requests to build **the model-powered behavior of a product** — model
selection/routing, the prompt/context harness, structured outputs, tool/MCP consumption, the agent
loop, retrieval/RAG, memory, evals, guardrails, and AI cost/observability. Realistic triggers: "build
an agent," "pick/route a model to cut cost," "engineer/prune the context," "add RAG / chunking /
reranking," "give the agent memory," "write evals / an LLM judge," "add guardrails / moderation,"
"instrument token cost and traces," "make our tool calls return valid JSON."

It should **not** trigger on: "design the system / threat model / NFR budgets" (`architecture`),
"host/scale/auth an MCP or tool server, or the vector store as served infra" (`backend`), "build the
ETL pipeline / govern the vector store as a dataset" (`data`), "build the chat UI / streaming render"
(`frontend`), "independently red-team / sign off before release" (`quality`), "deploy / set up
monitoring" (`operate`), or "orchestrate a deterministic multi-system workflow" (`automation`) —
unless the request also requires model-powered behavior.

Use `/ai` as documentation shorthand only. Codex explicit invocation is `$ai`; other clients use an
`@` mention, a skill tool, or natural-language activation.

## Mission and boundary

`ai` owns the intelligence layer of the Build stage — **behavior whose core uncertainty or capability
comes from a model**: the model/routing choice, the prompt/context harness, structured outputs, tool
and MCP *consumption*, the agent loop, retrieval *behavior*, memory, evals, guardrails, and
AI-specific cost/observability. It sits between `architecture` (which decides boundaries, contract
shape, NFR budgets, and the threat model) and `operate`/`quality` (which deploy, monitor, and
independently verify). It owns the cognition, not the substrate: it *references* `backend`'s serving
infra (MCP/tool endpoints, gateways, durable-execution), `data`'s governed dataset/pipeline, and
`frontend`'s UI rather than owning them. It consumes upstream artifacts (contracts, NFR budgets,
threat model, `handoff.yaml`) when they exist, works standalone when they don't, recommends siblings
for work it does not own, and never silently invokes them.

## Workflow

1. Pick **one primary job** and **at most one base surface**; stack `surface-multi-agent` additively
   on top when the system is also multi-agent.
2. **Retrieval-first / anti-staleness:** before generating any model/SDK/provider-specific code or
   quoting a model name, price, version, or spec revision, re-verify it against the live source
   (pricing page, `npm view`/PyPI, HF card, the spec changelog). Never freeze a volatile fact.
3. Read only the selected references (2–3 at most — never preload the pack).
4. Produce the artifact: a concrete pick + what NOT to build + what to remove + a trade-off, capped
   at 3–5 decisions per pass (verify-and-subtract).
5. Prove it with an eval appropriate to the surface (offline/online/regression/safety; `pass^k` for
   reliability) — never assert "it works" from memory.
6. Emit a compact `handoff.yaml` (with `volatile_facts`) when downstream build/verify work is
   expected.

## Route by job

| User intent | Reference | Expected contribution |
|---|---|---|
| Pick/route a model, set a cost/latency/effort budget, add fallback, decide open-vs-closed / self-host | `references/model-selection-and-routing.md` | Price-per-intelligence pick, routing cascade, degrade-honestly fallback, "open ≠ open-source" read |
| Engineer the prompt/context harness, or prune an over-grown one | `references/prompt-and-context-engineering.md` | Whole-token-budget curation, Model/Harness/Agent framing, long-horizon levers, harness-hygiene |
| Get typed/structured output or conformant tool arguments | `references/structured-outputs.md` | Schema-first contract, constrained-decode vs reask/retry vs provider-native |
| Design/consume tools or integrate MCP; decide direct-API vs CLI vs MCP | `references/tool-and-mcp-integration.md` | Tool contract, MCP anatomy + build chain, direct/CLI/MCP decision |
| Build an agent: loop, termination, multi-agent shape, durability, framework pick | `references/agent-construction.md` | Workflow-vs-agent shape, four multi-agent shapes + when-NOT, durability + license, framework pick |
| Add retrieval/RAG behavior — chunking, hybrid, rerank, agentic retrieval, vector-store choice | `references/retrieval-and-rag.md` | 5-stage pipeline, evaluate retrieval + generation separately, pgvector-default decision |
| Give the system durable memory | `references/memory.md` | Short-vs-long-term split, four philosophies as options, recall eval |
| Prove the system works — dataset, judge, harness, CI gate | `references/evaluation.md` | Error-analysis-first, Critique-Shadowing judge + jury, three harness shapes, pass^k |
| Add guardrails/safety — moderation, rails, validators, code-exec, approval gates, red-team | `references/guardrails-and-safety.md` | Uniform 5-way controls table + self-audit, validate-the-guardrail |
| Instrument AI cost and behavior — traces, token/cost/cache, online-eval monitors | `references/observability-and-cost.md` | OTel-GenAI `gen_ai.*` semconv, cache-as-architecture, cost-lever ordering |

Surface overlays (`surface-chat-assistant`, `surface-autonomous-agent`, `surface-rag-app`,
`surface-batch-and-pipeline`, `surface-multi-agent`) reshape the primary job for that deployment
shape. Always stack `surface-multi-agent` additively on top of the base surface — it changes the
coordination, not the base.

## Outputs and completion

| Output | Complete when |
|---|---|
| Model/routing choice | Tier picked by price-per-intelligence, routing cascade + fallback stated, every $/version fact date-stamped with a re-verify note |
| Prompt/context harness | Token budget curated across layers, harness inventoried, prune-before-add applied |
| Structured-output / tool contract | Schema-first (Zod/Pydantic), enforcement mechanism chosen with a reason, conformance ≠ correctness noted |
| Agent | Control-flow shape named, tool contract + retry, multi-agent weighed against when-NOT, durability + license surfaced if needed |
| Retrieval pipeline | Staged (chunk → hybrid+RRF → rerank → agentic-if-needed), retrieval + generation evaluated separately |
| Eval suite | Failure taxonomy from real traces, aligned judge (precision/recall), suite type named, pass^k reported |
| Guardrails artifact | Uniform control→implementation→verified table with a self-audit count |
| Observability | OTel-GenAI `gen_ai.*` telemetry + token/cost/cache tracking wired |

When downstream work is expected, provide the `handoff.yaml` companion with artifact paths,
decisions, constraints, risks, `volatile_facts` (fact / as-of / re-verify-at), and the recommended
next skill — and, when a threat model was consumed, state the border between ai-implemented controls
and quality-verified controls.
