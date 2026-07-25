# Recipes

Use the invocation form supported by your client. The examples below use Codex's explicit `$ai` form.

## Build an agent and prove it works

Use when: a product needs a model-driven agent (tool-calling, multi-step) and you want it verified,
not vibe-checked.

```text
Use $ai to build an agent that answers questions over our docs — the loop, tool contract, and
termination — then write evals that prove it works.
```

Route: primary job `agent-construction` (workflow-vs-agent shape, tool contract + validate-retry,
framework pick with what-NOT) + surface `surface-rag-app` (retrieval-centric) + the flagship
`evaluation` (error-analysis-first, an aligned judge, `pass^k`). Retrieval-first: confirms current
framework/SDK versions before generating code.

## Cut token cost with model routing

Use when: one flagship model runs everything and the bill is too high.

```text
Use $ai to set up model routing to cut our token cost: a cheap tier for classification, escalate to
the flagship only when needed, with honest fallback.
```

Route: primary job `model-selection-and-routing` — the routing cascade as the #1 cost lever (ahead of
caching and batching), a tiers-not-model-IDs abstraction, and fallback that degrades honestly (never
silently, never to a bare error). Every model name and price is date-stamped with a re-verify pointer,
because that layer churns monthly.

## Add a grounded RAG pipeline

Use when: an assistant should answer from your content with citations and stop hallucinating.

```text
Use $ai to add retrieval so our assistant answers from our knowledge base: deliberate chunking,
hybrid search, reranking, and grounded citations.
```

Route: primary job `retrieval-and-rag` (contextual/late chunking → hybrid retrieve fused with RRF →
cross-encoder rerank → agentic decomposition only if a retrieval-eval failure demands it; pgvector by
default) + surface `surface-rag-app` (citations as a schema contract, cite-or-retract as the
load-bearing guardrail). Retrieval and generation are evaluated separately so you know whether to fix
chunking or the prompt.

## Write evals and an LLM judge

Use when: "it feels worse since we changed the prompt/model" and nothing actually measures it.

```text
Use $ai to set up evals for our support assistant: a labeled dataset, an aligned LLM judge, and a CI
gate — so we know when it regresses.
```

Route: primary job `evaluation` (flagship) — error analysis on real traces first (open→axial coding),
a binary judge built via Critique Shadowing and aligned by precision/recall (not raw agreement),
decompose-and-jury the judge, a harness shape (assertion-matrix / test-as-code / Task-Solver-Scorer)
matched to the system, and `pass^k` for reliability. No ship decision rests on a public benchmark.

## Prune an over-grown agent harness

Use when: an agent keeps getting slower and *worse* as tools and prompt text pile up.

```text
Use $ai to prune our agent's harness before we add more: what context, tools, and instructions are
still earning their token cost, and what should we remove?
```

Route: primary job `prompt-and-context-engineering` — the verify-and-subtract through-line: harness
accretion raises cost and hurts accuracy across a model cycle, and better models need *less*
scaffolding. Re-evaluate the harness on every model upgrade and remove what isn't earning its tokens,
verified against the regression suite so pruning doesn't silently regress capability.
