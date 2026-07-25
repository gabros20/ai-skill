# Surface: RAG app

Purpose: Reshape the 10 primary-job refs for a system where grounded retrieval — answering from a
specific corpus with citations and freshness guarantees — is the point of the product, not one
feature among several. [retrieval-and-rag.md](retrieval-and-rag.md) owns the retrieval *pipeline*
mechanics (chunk/fuse/rerank/decompose/eval); this surface says how retrieval, once it's the spine,
reshapes the other 8 jobs around it.

Read when:
- The product's job is "answer from our docs," "cite sources," "knowledge-base assistant," or
  freshness/grounding is a named requirement (the corpus updates and answers must track it).
- Hallucination complaints on a knowledge task are the presenting symptom.

Skip when:
- Retrieval is one tool among several inside a general-purpose agent, not the system's whole
  purpose — apply [retrieval-and-rag.md](retrieval-and-rag.md) directly without the full surface
  treatment; likely compose with [surface-autonomous-agent.md](surface-autonomous-agent.md) instead.
- The system is chat-first and retrieval is incidental to most turns — →
  [surface-chat-assistant.md](surface-chat-assistant.md); compose the two only when grounding is
  genuinely the product, not a per-turn convenience.
- The ask is deploying/scaling the vector store, or the governed ingestion pipeline that populates
  it — → `backend`/`operate` (serving) or `data` (governed dataset); see the three-way border
  restated in §5.

Inputs:
- Corpus freshness requirement — static snapshot vs. live-updating — decides the reindex cadence
  and whether "the index is stale" is a first-class failure mode to design for.
- Whether citations are a hard product requirement (legal/medical/support) or a nice-to-have —
  decides how strict the cite-or-retract guardrail (§4) needs to be.
- Query complexity distribution: mostly single-hop lookup vs. multi-hop/comparative — decides
  whether the agentic-decomposition layer is warranted (see [retrieval-and-rag.md](retrieval-and-rag.md) §4).

Produces:
- A system where every other job's default is reshaped around "the corpus is the source of truth."
- A citation contract (structured, not narrative "according to...").
- A staleness/freshness policy with a stated reindex cadence.

## Contents
- Job impact table
- Grounding is the guardrail
- The three-way retrieval border

## Procedure

### 1. Job impact table
| Job | How this surface bends it |
|---|---|
| [retrieval-and-rag.md](retrieval-and-rag.md) | **The spine.** Every other row below bends around its 5-stage pipeline (chunk → hybrid retrieve+fuse → rerank → agentic decomposition if warranted → evaluate retrieval/generation separately), not the other way around. |
| [model-selection-and-routing.md](model-selection-and-routing.md) | Favor models with strong grounded-citation-following behavior over raw reasoning power for single-hop queries — the heavy lifting is retrieval, not generation. Reserve higher effort/tier for the agentic-decomposition path (multi-hop/comparative queries), not the default single-hop answer. |
| [prompt-and-context-engineering.md](prompt-and-context-engineering.md) | Context is dominated by retrieved chunks, not conversation history. Just-in-time retrieval is the default shape: keep chunk IDs/paths, pull full content only for what actually gets cited, rather than stuffing every candidate chunk into every call. |
| [structured-outputs.md](structured-outputs.md) | **Citations are a schema contract**, not prose — every claim carries a chunk-id/source-url field the caller can render or verify, not a free-text "according to the document." |
| [agent-construction.md](agent-construction.md) | The agentic decomposition layer (routing/query-transform/sub-question/plan-then-retrieve — [retrieval-and-rag.md](retrieval-and-rag.md) §4) *is* this surface's agent loop for non-trivial queries. Don't build a separate general-purpose tool-using loop on top unless the app genuinely does more than retrieve-and-answer — that's [surface-autonomous-agent.md](surface-autonomous-agent.md) territory. |
| [memory.md](memory.md) | Freshness dominates persistence — the corpus itself functions as the system's long-term memory, reindexed on a schedule (border to `data`, §5), not accumulated in-context. Conversational memory (if any) is secondary and session-scoped, per [surface-chat-assistant.md](surface-chat-assistant.md). |
| [evaluation.md](evaluation.md) | Retrieval quality (Context Precision/Recall) and generation quality (Faithfulness/Response Relevancy) are reported as **two separate numbers**, per [retrieval-and-rag.md](retrieval-and-rag.md) §5 — this surface's primary release gate, ahead of any generic eval. |
| [guardrails-and-safety.md](guardrails-and-safety.md) | **Cite-or-retract is the load-bearing guardrail (§2)** — grounding the answer strictly in retrieved context, with an explicit "I don't know" path when the corpus doesn't cover the question, does more safety work here than a generic moderation classifier. |
| [observability-and-cost.md](observability-and-cost.md) | Track retrieval-specific telemetry — which chunks were retrieved, rerank scores, citation-coverage rate (fraction of claims with a valid citation) — not just token/cost. Add **index staleness** (time since last reindex vs. corpus update cadence) as a first-class monitored signal. |

### 2. Grounding is the guardrail
The strongest guardrail on this surface isn't a bolted-on classifier — it's the retrieval design
itself, backed by an explicit self-verification prompt pattern: allow "I don't know" when the corpus
doesn't cover the question, require every claim to trace to a retrieved chunk (cite-or-retract), and
optionally add a chain-of-thought verification pass before answering (Anthropic, "Reduce
hallucinations," platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/
reduce-hallucinations). This is cheap and directly targets this surface's dominant failure mode —
confidently answering outside the corpus — in a way generic moderation classifiers don't. Layer
classifier-based moderation (see [guardrails-and-safety.md](guardrails-and-safety.md)) on top for
input safety, not as a substitute for grounding discipline.

### 3. The three-way retrieval border
Restate the seam once, canonically (full mechanics in [retrieval-and-rag.md](retrieval-and-rag.md)
§6, don't re-derive here): retrieval **behavior** — chunking, fusion, rerank, decomposition, retrieval
eval — is `ai`'s. The vector store **as served infrastructure** (deployment, connection pooling,
backup, uptime) is `backend`/`operate`'s. The vector store **as a governed dataset** (ingestion
pipeline, source-of-truth lineage, access control on what gets indexed) is `data`'s. A single "the
RAG app is slow" or "answers are stale" complaint can be any of the three — state explicitly which
layer a given question is actually about before answering it; don't silently absorb an infra or
governance question into this surface's behavioral scope.

## Validation
- Every claim in a generated answer carries a structured citation (chunk id/source), not a narrative
  reference.
- Context Precision/Recall (retrieval) and Faithfulness/Relevancy (generation) are reported
  separately, and a failure routes to the correct fix (chunking vs. prompt) per
  [retrieval-and-rag.md](retrieval-and-rag.md) §5.
- The system has an explicit "I don't know" path for out-of-corpus questions, not a forced answer.
- Index staleness has a stated acceptable bound (reindex cadence vs. corpus update frequency), and
  it's monitored, not assumed fresh.
- The retrieval-behavior / served-infrastructure / governed-dataset border (§3) is named whenever a
  request could plausibly belong to more than one.

## Failure modes and handoff
- **The agentic-decomposition layer is added reflexively** instead of being justified by a retrieval
  eval failure on the actual query distribution — see [retrieval-and-rag.md](retrieval-and-rag.md)
  §4's verify-and-subtract stance; it applies here first.
- **Citations rendered as free text** instead of a structured field — routes to
  [structured-outputs.md](structured-outputs.md).
- **The complaint is actually about the vector store's uptime/latency/scaling, or the ingestion
  pipeline's schedule/lineage** — → `backend`/`operate` or `data` respectively (§3); this surface
  doesn't own either.
- **Grounding failures persist despite good retrieval metrics** — that's a generation-side
  guardrail/prompt gap, not a retrieval gap — → [guardrails-and-safety.md](guardrails-and-safety.md)
  and [prompt-and-context-engineering.md](prompt-and-context-engineering.md).
- **The app has grown well beyond retrieve-and-answer** (multi-step tool use, unattended runs) — →
  compose with [surface-autonomous-agent.md](surface-autonomous-agent.md) rather than stretching
  this surface's agentic-decomposition layer to cover it.
