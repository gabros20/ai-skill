# ai — AI Systems

**Visual guide:** [aiengskill.vercel.app](https://aiengskill.vercel.app)

Build **the model-powered behavior of a product** — model selection and routing, the prompt/context
harness, structured outputs, tool and MCP consumption, the agent loop, retrieval/RAG, memory, evals,
guardrails, and AI cost/observability — across chat, autonomous-agent, RAG, batch, and multi-agent
systems, in any provider or language. `ai` is the **intelligence layer of the Build stage** of the
[Digital Product Skills](https://github.com/gabros20) family, peer of `frontend` and `backend`: an
agent skill for building the part of a product whose core uncertainty or capability comes from a
model.

It sits between `architecture` (which decides system boundaries, the contract shape, NFR budgets, and
the threat model) and `operate`/`quality` (which deploy, monitor, and independently verify what gets
built). It owns the **cognition** — the running model-powered behavior and the decisions behind it —
not the substrate it runs on. It is a **provider-, model-, and language-agnostic router grounded in
the current stack, not a single-vendor SDK tutorial and not a system-design tool.**

## What it does

A **faceted router**: pick one primary job × at most one base deployment-surface (the multi-agent
overlay stacks additively on top).

**Primary jobs** — model selection & routing · prompt & context engineering · structured outputs ·
tool & MCP integration · agent construction · retrieval & RAG · memory · **evaluation ⭐** ·
guardrails & safety · observability & cost.

**Surface overlays** — chat assistant (default) · autonomous agent · RAG app · batch & pipeline ·
**multi-agent** (additive). The base surface reshapes how every job applies for that deployment
shape; `surface-multi-agent` stacks on top of whichever base surface applies rather than replacing it.

**The differentiator:** three things most AI material skips. **Evaluation is the flagship** — not an
afterthought: error-analysis-first, LLM-as-judge via critique-shadowing, jury and role-binding,
offline/online/regression/safety suites, and `pass^k` for reliability. The through-line is
**verify-and-subtract, not just assemble** — prune the harness, budget tokens, decompose the judge,
distrust benchmarks, prove the retrieval, and decide when *not* to multi-agent (the field is loud on
adding and near-silent on pruning). And a distinctive value-add: **token/cost economics + model and
tooling licensing** — the per-model cost math (routing cascade → cache → batch → effort), plus
"open ≠ open-source" (Llama's restricted Community License vs MIT/Apache families) and the
source-available tooling cluster (BSL/SSPL/ELv2/open-core: Restate, Inngest, Phoenix, Langfuse,
litellm).

Running through all of it is the flagship invariant — **retrieval-first / anti-staleness**: the
model/SDK/price/spec layer changes monthly, so every model name, price, version, and spec revision is
date-stamped and re-verified against the live source, never frozen. The `handoff.yaml` even carries a
`volatile_facts` block so a stale value can't leak downstream. Full attribution in
[SOURCES.md](skills/ai/SOURCES.md).

## Install

```bash
npx skills add gabros20/ai-skill -g -y
```

Or use it in Codex with `$ai`.

## Examples

```text
$ai build an agent that answers questions over our docs, then prove it works with evals

$ai our token bill is too high — set up model routing with a cheap tier and honest fallback

$ai add retrieval with chunking, hybrid search, and reranking, grounded with citations

$ai write an LLM-as-a-judge and a regression suite for our support assistant

$ai our context is bloated and slow — prune the harness before we add more
```

## Route by job

| User intent | Reads | Contribution |
|---|---|---|
| Pick/route a model, set a cost/latency/effort budget, add fallback, decide open-vs-closed / self-host | [model-selection-and-routing](skills/ai/references/model-selection-and-routing.md) | Price-per-intelligence pick, routing cascade (#1 cost lever), degrade-honestly fallback, "open ≠ open-source" license read |
| Engineer the prompt/context harness, or prune an over-grown one | [prompt-and-context-engineering](skills/ai/references/prompt-and-context-engineering.md) | Whole-token-budget curation, Model/Harness/Agent framing, long-horizon levers, harness-hygiene / prune-before-add |
| Get typed/structured output or conformant tool arguments | [structured-outputs](skills/ai/references/structured-outputs.md) | Schema-first contract, constrained-decode vs reask/retry vs provider-native, tool-arg conformance |
| Design/consume tools or integrate MCP; decide direct-API vs CLI vs MCP | [tool-and-mcp-integration](skills/ai/references/tool-and-mcp-integration.md) | Tool contract (typed + validate-retry), MCP anatomy + build chain, direct/CLI/MCP decision |
| Build an agent: the loop, termination, multi-agent shape, durability, framework pick | [agent-construction](skills/ai/references/agent-construction.md) | Workflow-vs-agent shape, four multi-agent shapes + when-NOT, durable-execution decision + license, framework pick with what-NOT |
| Add retrieval/RAG behavior — chunking, hybrid, rerank, agentic retrieval, vector-store choice | [retrieval-and-rag](skills/ai/references/retrieval-and-rag.md) | 5-stage pipeline (contextual/late → hybrid+RRF → rerank → agentic decomp → eval separately), pgvector-default decision |
| Give the system durable memory across turns/sessions | [memory](skills/ai/references/memory.md) | Short-vs-long-term split, four philosophies as options, benchmark-subordinated recall eval |
| Prove the system works — dataset, aligned judge, harness, CI gate ⭐ | [evaluation](skills/ai/references/evaluation.md) | Error-analysis-first taxonomy, Critique-Shadowing judge + jury, three harness shapes, offline/online/regression/safety, pass^k |
| Add guardrails/safety — moderation, rails, validators, code-exec guards, approval gates, red-team | [guardrails-and-safety](skills/ai/references/guardrails-and-safety.md) | Uniform 5-way controls table + self-audit, prompt self-verification, validate-the-guardrail-like-a-judge |
| Instrument AI cost and behavior — traces, token/cost/latency/cache, online-eval monitors | [observability-and-cost](skills/ai/references/observability-and-cost.md) | OTel-GenAI `gen_ai.*` semconv, cache-as-architecture, cost-lever ordering, license-pattern read |

**Surface overlay (add at most one base; the multi-agent overlay stacks additively):**

| System type | Reads | Reshapes |
|---|---|---|
| Interactive assistant — streaming, conversational, human-in-loop (default) | [surface-chat-assistant](skills/ai/references/surface-chat-assistant.md) | Single-call-before-loop default, session memory, online-eval fit, lighter guardrail posture |
| Autonomous agent — long-horizon loop, runs unattended | [surface-autonomous-agent](skills/ai/references/surface-autonomous-agent.md) | Compaction/JIT/note-taking as structural, harness-hygiene on model upgrades, approval-gate default, durable-execution border, pass^k |
| RAG / knowledge app — retrieval-centric, grounded | [surface-rag-app](skills/ai/references/surface-rag-app.md) | retrieval-and-rag as spine, citations as a schema contract, cite-or-retract guardrail, index-staleness monitored |
| Batch / pipeline — offline classify/extract at scale | [surface-batch-and-pipeline](skills/ai/references/surface-batch-and-pipeline.md) | Cheap-tier routing default, cost-lever ordering, schema-heavy output, offline/regression eval only |
| **Multi-agent** — orchestrated specialists, stacked additively on the base surface | [surface-multi-agent](skills/ai/references/surface-multi-agent.md) | **Orchestrator + tool-scoped specialists (not swarms), the honest when-NOT-to-multi-agent (~15× tokens), four shapes, per-base composition** |

Plus [handoff](skills/ai/references/handoff.md) — the `handoff.yaml` companion (with `volatile_facts`)
to `quality`, `operate`, `backend`, `frontend`, and `data` when downstream work is expected.

## Outputs

A running model-powered behavior plus the decision record behind it: a model/routing choice, a
prompt/context harness, structured-output and tool contracts, an agent loop, a retrieval pipeline, a
memory layer, an eval suite (dataset + aligned judge + CI gate), a uniform guardrails controls table,
and OTel-GenAI telemetry — plus fillable checklists and a `handoff.yaml` companion (carrying
`volatile_facts`) that feeds `quality`/`operate` downstream, grounded in the tool each artifact names
and date-stamped for re-verification, never a frozen template dump.

## Reference and asset library

16 references under `skills/ai/references/` (10 primary jobs, 5 surface overlays, 1 handoff contract)
and 9 fillable assets under `skills/ai/assets/`:

- **Assets:** `model-selection-scorecard.md` · `otel-genai-observability-checklist.md` ·
  `context-budget-worksheet.md` · `agent-loop-and-tool-contract-checklist.md` ·
  `rag-pipeline-checklist.md` · `eval-harness-starter.md` · `llm-judge-rubric-template.md` ·
  `guardrails-controls-checklist.md` · `handoff.yaml`

## Digital Product lifecycle

`ai` is the intelligence layer of the **Build** stage, peer of `frontend` and `backend`: it consumes
`architecture`'s contracts, NFR budgets, threat model, and `handoff.yaml` upstream, and hands its
running behavior, eval suites, and telemetry hooks to `operate` and `quality` downstream. It
*references* rather than owns the serving substrate (`backend`: MCP/tool endpoints, vector-store-as-
served, gateways, durable-execution infra), the governed dataset/pipeline (`data`), and the chat UI
(`frontend`). It works standalone with no upstream artifact required, and never silently invokes a
sibling skill.

## Repository layout

```text
skills/ai/    runtime skill (SKILL.md + 16 references + 9 assets + agents/openai.yaml)
evals/        activation · traversal · output · compression-ablation fixtures
research/     4-channel research corpora + build-gate synthesis
docs/         installation and usage
.codex-plugin/  plugin manifest
```

## Documentation & releases

- [docs/installation.md](docs/installation.md) · [docs/usage.md](docs/usage.md) ·
  [docs/recipes.md](docs/recipes.md)
- [CHANGELOG.md](CHANGELOG.md) — release history (current: v0.1.0)
- [SOURCES.md](skills/ai/SOURCES.md) — source attribution and license posture
- [CONTRIBUTING.md](CONTRIBUTING.md) — local validation (`scripts/lint-skill`, `scripts/check-sync`)

## License

MIT — see [LICENSE](LICENSE).
