---
name: ai
description: >-
  Build model-powered behavior — model routing, context engineering, structured outputs, tools/MCP,
  agents, RAG, memory, evals, guardrails, and cost/observability — across chat, agent, RAG, batch,
  and multi-agent systems, any provider or language. Use to route a model, engineer context, build
  an agent or tool loop, add RAG or memory, write evals, or add guardrails. Not for system/threat
  design (→ architecture), serving or MCP hosting (→ backend), data pipelines (→ data), chat UI
  (→ frontend), independent QA (→ quality), deploy (→ operate), or deterministic workflows
  (→ automation).
---

# AI Systems

## Mission and boundary

Build the **model-powered behavior** of a product — the part whose core uncertainty or capability
comes from a model. Own the *cognition*: model choice and routing, the prompt/context harness,
structured outputs, tool and MCP consumption, the agent loop, retrieval behavior, memory, evals,
guardrails, and AI-specific cost/observability. Own the intelligence, not the substrate it runs on.

The border — with `architecture` (system shape, NFR budgets, threat model, build-vs-buy), `backend`
(serving substrate: MCP/tool *endpoints*, vector-store-as-served, gateways, durable-execution
infra), `data` (governed pipelines + the vector store *as a dataset*), `frontend` (chat UI and
streaming *render*), `quality` (independent verification / red-team *gate*), `operate` (deploy and
the monitoring *platform*), and `automation` (deterministic multi-system workflows, even when one
step calls a model) — is enumerated in the routing decline-rows and invariants below. `ai`
*references* those substrates; it does not re-teach or override them. Operate independently when
invoked alone; when compatible upstream artifacts exist (a solution-architecture doc, contracts, an
NFR budget, a threat model, a `handoff.yaml`), build inside them rather than re-deriving. Recommend
adjacent skills when useful; never invoke them automatically unless the user explicitly requested a
composition workflow.

## Route before acting

1. Pick the **one primary job** the request needs (most requests are one — name it).
2. Add **at most one base surface** — the deployment shape reshapes how every job applies.
3. **The multi-agent overlay is additive.** When the system is *also* multi-agent, stack
   `surface-multi-agent` **on top of** the chosen base surface — it does not replace it. A
   multi-agent RAG app is `surface-rag-app` **+** `surface-multi-agent`.
4. **Retrieval-first / anti-staleness:** before generating any model/SDK/provider-specific code or
   quoting any model name, price, version, or spec revision, **re-verify it against the live source**
   (pricing page, `npm view`/PyPI, HF model card, the spec changelog) — this layer churns monthly and
   memorized facts are stale (see invariants).
5. Read each selected reference **completely** before producing the affected artifact. Load 2–3 at
   most; never preload the pack.

### Primary job (pick one)

| User intent | Read | Contribution |
|---|---|---|
| Pick/route a model or provider, set a cost/latency/effort budget, add fallback/degradation, or decide open-vs-closed / self-host | [model-selection-and-routing](references/model-selection-and-routing.md) | Price-per-intelligence pick, routing cascade (the #1 cost lever), fallback that degrades honestly, effort knobs, "open ≠ open-source" license read |
| Engineer the prompt/context harness — attention budget, JIT retrieval, compaction, note-taking, progressive disclosure — or **prune** an over-grown harness | [prompt-and-context-engineering](references/prompt-and-context-engineering.md) | Whole-token-budget curation, Model/Harness/Agent framing, long-horizon levers, harness-hygiene / prune-before-add discipline |
| Get typed/structured output or conformant tool arguments; pick constrained-decoding vs reask/retry vs provider-native | [structured-outputs](references/structured-outputs.md) | Schema-first contract (Zod/Pydantic), the three enforcement mechanisms + when each, tool-arg conformance |
| Design/consume tool calls or integrate MCP; decide direct-API vs CLI vs MCP; build against the MCP spec/SDKs | [tool-and-mcp-integration](references/tool-and-mcp-integration.md) | Tool contract (typed + validate-retry), MCP anatomy + build chain (spec→SDK pin-v1→FastMCP→registry), direct/CLI/MCP decision |
| Build an agent: the loop, termination, multi-agent shape, durability decision, framework pick | [agent-construction](references/agent-construction.md) | Workflow-vs-agent shape, tool contract, four multi-agent shapes + when-NOT, durable-execution decision + license flag, framework pick with what-NOT |
| Add retrieval/RAG behavior — chunking, embeddings, hybrid search, rerank, agentic retrieval, vector-store choice | [retrieval-and-rag](references/retrieval-and-rag.md) | 5-stage pipeline (contextual/late chunk → hybrid+RRF → rerank → agentic decomp → eval separately), pgvector-default vector-store decision |
| Give the system durable memory across turns/sessions | [memory](references/memory.md) | Short-vs-long-term split, four philosophies (fact-store / temporal-KG / self-editing / ontology) as options, benchmark-subordinated recall eval |
| Prove the system works — build a dataset, an aligned judge, a harness, a CI gate ⭐ | [evaluation](references/evaluation.md) | Error-analysis-first taxonomy, Critique-Shadowing judge + jury, three harness shapes, offline/online/regression/safety, pass^k |
| Add guardrails/safety — moderation, rails, validators, code-exec guards, approval gates, red-team | [guardrails-and-safety](references/guardrails-and-safety.md) | Uniform 5-way controls table (control→impl→verified) + self-audit, prompt self-verification, validate-the-guardrail-like-a-judge |
| Instrument AI cost and behavior — traces, token/cost/latency/cache telemetry, online-eval monitors | [observability-and-cost](references/observability-and-cost.md) | OTel-GenAI `gen_ai.*` semconv (vendor-neutral), cache-as-architecture, cost-lever ordering (cascade→cache→batch), license-pattern read |

### Surface overlay (add at most one base surface)

Pick the one base surface that matches the deployment shape; `surface-multi-agent` stacks additively
on top of it (step 3). Surfaces **reshape** how the jobs apply — they point to the job references,
they don't redefine them.

| System type | Read | Reshapes |
|---|---|---|
| Interactive assistant — streaming, conversational, human-in-loop (**default / start-simplest**) | [surface-chat-assistant](references/surface-chat-assistant.md) | Single-call-before-loop default, session-scoped memory, online-eval fit, lighter (self-verification) guardrail posture |
| Autonomous agent — long-horizon loop, tools, runs unattended | [surface-autonomous-agent](references/surface-autonomous-agent.md) | Compaction/JIT/note-taking/sub-agent-isolation as structural, harness-hygiene on every model upgrade, approval-gate default, durable-execution border, pass^k |
| RAG / knowledge app — retrieval-centric, grounded, citation-bearing | [surface-rag-app](references/surface-rag-app.md) | retrieval-and-rag is the spine, citations as a schema contract, cite-or-retract as the load-bearing guardrail, index-staleness as a monitored failure |
| Batch / pipeline — offline classify/extract at scale, no human in loop | [surface-batch-and-pipeline](references/surface-batch-and-pipeline.md) | Cheap-tier routing default, cost-lever ordering (cascade→batch-50%→cache→effort-floor), schema-heavy output, offline/regression eval only |
| **Multi-agent ⭐ (additive)** — orchestrated specialists on top of a base shape. **Stacks on, does not replace.** | **[surface-multi-agent](references/surface-multi-agent.md)** | **Orchestrator + tool-scoped specialists (not swarms), the honest when-NOT-to-multi-agent (coordination cost, ~15× tokens), four shapes, per-base composition** |

### Not this skill → (route elsewhere before acting)

| The request is really… | Route to | Why |
|---|---|---|
| System boundaries, contracts, NFR budgets, threat model, or build-vs-buy of the AI subsystem | `architecture` | `ai` implements *inside* that decision; it doesn't make the system-shape call |
| Hosting/scaling/authing an MCP or tool *server*, the vector store *as served infra*, a model gateway, or durable-execution *infrastructure* | `backend` | `ai` owns consumption + behavior; the substrate is backend's |
| The vector store *as a governed dataset*, the ETL/ingestion that populates it, retention/PII | `data` | `ai` owns retrieval *behavior*; the dataset + pipeline is data's |
| Chat UI, streaming *rendering*, error/recovery UX | `frontend` | `ai` decides *what* streams; frontend renders it |
| Independent, adversarial verification / red-team *as a release gate* | `quality` | `ai` builds evals *into* the product; quality verifies independently |
| Deploying the system or running the monitoring *platform*, incident response | `operate` | `ai` defines AI-specific telemetry; operate runs the platform |
| A deterministic multi-system workflow — even when one step calls a model | `automation` | Model-in-a-step ≠ model-driven; the coordination is automation's |

## Universal invariants

- **Retrieval-first / anti-staleness — the flagship stance.** The model/SDK/price/spec layer changes
  monthly; memorized names and numbers are stale. Every model name, price, version, and spec
  revision is **date-stamped and re-verified against the live source** before use (pricing pages,
  `npm view`/PyPI, HF model cards, the spec changelog). Teach and practice the *method* of staying
  current; never freeze a volatile fact. Carry `volatile_facts` into the handoff so a frozen value
  can't leak downstream un-caveated.
- **Implement inside the decision (the border).** Own the cognition, not the boundary/NFR/threat
  *decision* (→ `architecture`), the serving substrate — MCP/tool endpoints, vector-store-as-served,
  gateways, durable-execution infra (→ `backend`), the governed pipeline + vector store as dataset
  (→ `data`), the chat UI/streaming render (→ `frontend`), the independent verification gate
  (→ `quality`), the deploy/monitoring platform (→ `operate`), or deterministic multi-system
  workflows (→ `automation`). Consume upstream artifacts; when none exist (standalone run), say so
  rather than inventing a contract or threat model.
- **Verify-and-subtract, not just assemble.** Every recommendation names what to build, **what NOT
  to build, and what to remove.** Prune the harness on each model upgrade; better models need *less*
  scaffolding. Cap each pass at 3–5 decisions. The field is loud on adding and silent on pruning —
  be the exception.
- **Evals are the completion gate, not an afterthought.** Error-analysis-first; binary judges
  aligned via precision/recall; offline + online + regression + safety; report **pass^k** for
  reliability. Distinct from `quality`'s independent gate — never assert "it works" from memory.
- **Default-stack, then deviate — and distrust benchmarks.** Name the current modal default per
  layer (version-dated), but every recommendation is a **concrete pick + what NOT to build + the
  trade-off**, weighted by reversibility. Adoption numbers and leaderboards are engagement, not
  gospel (>50% of SWE-bench "passes" are unmergeable) — build the domain-specific eval before
  trusting a score.
- **Cost is an architectural constraint from the first line.** Design for prompt caching first;
  order the levers (routing cascade → cache → batch's flat 50% → effort floor); budget tokens
  (cheaper ≠ less spend). Teach the per-model $ math *and* the model/tooling license spread
  (open ≠ open-source; BSL/SSPL/ELv2/open-core self-host-yes/resell-no).
- **Distinguish facts, decisions, assumptions, and proposals.** Preserve upstream decisions and user
  constraints or flag the conflict; prefer repository and artifact evidence over generic defaults;
  state unknowns as TBD rather than inventing a value.

## Core workflow

1. Inspect the request, the codebase, and any upstream artifacts (contracts, NFR budgets, threat
   model, a `handoff.yaml`); record material assumptions and unresolved inputs with owners.
2. Route (above): one primary job, ≤1 base surface, `surface-multi-agent` stacked additively if the
   system is multi-agent. Re-verify volatile model/SDK facts before any model-specific code; read
   selected refs fully.
3. Produce the artifact grounded in what the reference names — concrete pick + what-NOT + trade-off,
   capped at 3–5 decisions per pass, subtracting where the simpler thing wins.
4. Prove it with an eval appropriate to the surface (offline/online/regression/safety; pass^k for
   reliability); emit `handoff.yaml` (with `volatile_facts`) when downstream build/verify is expected.

## Artifact contract

Each reference defines its own artifact — a running implementation or decision plus the record behind
it. Every `ai` artifact must record: the decision made and options considered; the trade-off
accepted (including what was *removed*); facts/decisions/assumptions distinguished; and, for any
model/SDK/provider-specific fact, the **date it was verified and how to re-verify it**.
Exhaustive-coverage artifacts (guardrail controls, license flags, OTel fields) are a uniform table
with a self-audit count, never a narrative. A full `ai` pass produces up to four kinds of artifact —
the running behavior, its eval suite, its guardrails/telemetry, and the fillable checklists in
[assets/](assets/) — plus the machine-readable `handoff.yaml` companion when downstream work is
expected; see [handoff](references/handoff.md).

## Completion and handoff

Before completion:

- Confirm every requested artifact exists and its acceptance criteria are checkable.
- Confirm an eval was actually run (not asserted), with the suite type named and pass^k reported
  where reliability matters.
- Confirm every exhaustive-checklist artifact is a table with a self-audit count, not a narrative.
- Confirm every volatile model/SDK/price/spec fact is date-stamped with a re-verify pointer.
- Record decisions, assumptions, risks, and unresolved questions with named owners.
- When downstream build/verify work is expected, emit the `handoff.yaml` companion (artifact paths,
  decisions, constraints, risks, `volatile_facts`, recommended next skill). Never silently invoke a
  build skill; name it in `recommended_next`.

## Resources

Load only what the selected route requires; never preload. The routing tables above name each
reference's contribution — this is the index.

- **Primary jobs** ([references/](references/)): model-selection-and-routing · prompt-and-context-
  engineering · structured-outputs · tool-and-mcp-integration · agent-construction · retrieval-and-
  rag · memory · evaluation ⭐ · guardrails-and-safety · observability-and-cost.
- **Surface overlays** ([references/](references/)): surface-chat-assistant (default) ·
  surface-autonomous-agent · surface-rag-app · surface-batch-and-pipeline · surface-multi-agent ⭐
  (additive).
- **Pipeline:** [handoff](references/handoff.md) — standalone vs pipeline behavior and the
  `handoff.yaml` companion (with `volatile_facts`) consumed by `quality`, `operate`, `backend`,
  `frontend`, and `data`.
- **Assets** ([assets/](assets/)): model-selection scorecard · OTel-GenAI observability checklist ·
  context-budget worksheet · agent-loop & tool-contract checklist · RAG-pipeline checklist ·
  eval-harness starter · LLM-judge rubric template · guardrails controls checklist · `handoff.yaml`
  envelope.
