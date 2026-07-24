# Memory

Purpose: Decide what an agent remembers beyond the current context window, and which of the four
production memory philosophies (fact-extraction, temporal knowledge graph, self-editing core,
ontology graph) fits the system's actual need — versus defaulting to "just add a vector store" or
"just extend the context window."

Read when:
- The request is "the agent forgets past sessions," "personalize across conversations," "remember
  user preferences," or a multi-session/multi-user agent needs state that outlives one context
  window.
- Choosing between summarization, a vector-store-backed memory layer, and a knowledge-graph memory
  product for a specific agent.

Skip when:
- The need is retrieving facts from a static document corpus, not facts *about the user or prior
  interactions* — → `retrieval-and-rag.md` (memory and RAG both retrieve, but memory's corpus is
  self-generated conversational/episodic state, not an external knowledge base — see border below).
- The need is within-session context management (compaction, note-taking, sub-agent context
  isolation) — → `prompt-and-context-engineering.md`; that's the *current* context window, this ref
  is what survives *past* it.
- The memory store itself needs deploying/scaling as infrastructure — → `backend`/`operate`.

Inputs:
- Session shape: single continuous conversation vs. many discrete sessions per user vs. multi-user
  shared state.
- What must be recalled: user preferences/facts (semantic), what happened and when (episodic), how
  to perform a recurring task (procedural), or all three.
- Update pattern: does memory need to change/contradict itself over time (a user's stated
  preference changes) — decides whether temporal/conflict-resolution matters or simple append
  suffices.

Produces:
- A short-term vs. long-term memory split for the system.
- A philosophy pick (fact-store / temporal-KG / self-editing-core / ontology-graph) with the
  tradeoff named against the alternatives.
- A stance on how memory quality gets measured (LoCoMo/LongMemEval, or a narrower project-specific
  eval).

## Contents
- The short-term/long-term split
- Four philosophies, encoded as options
- The cognitive taxonomy (and why it's under-canonical)
- Benchmarks
- Border: memory vs RAG
- What NOT to build

## Procedure

### 1. The short-term/long-term split
Every memory system reduces to two tiers, regardless of vendor: **short-term / in-context** —
whatever fits in the active context window this turn (recent turns, working state) — and
**long-term / persisted-and-retrieved** — state written out of the context window and pulled back
in on demand when relevant. The design question is never "does this system have memory," it's
"what triggers a write to the long-term tier, and what triggers a read back from it." Short-term
management (compaction, summarization-within-session) is owned by
`prompt-and-context-engineering.md`; this ref owns the long-term tier's write/read/consolidate
mechanics.

### 2. Four philosophies — encode as options, not a single winner
No canonical single "correct" memory architecture exists yet; four production philosophies have
emerged, each a defensible default for a different priority:

| Philosophy | Product | Mechanism | Pick when |
|---|---|---|---|
| **Fact-extraction + fused retrieval** | mem0 (Apache-2.0, mem0.ai/blog/what-is-ai-agent-memory, 2026-07-22) | Conversation/session/user/org layers; LLM-mediated **ADD/UPDATE/DELETE/NOOP** consolidation over a vector store — each new turn is checked against existing facts and merged, not just appended | Preference/fact recall is the main need and a vector-store-backed layer is already acceptable infra |
| **Bi-temporal knowledge graph** | Zep, engine now **Graphiti** (arxiv.org/abs/2501.13956, 2025-01-20) | Tracks two timelines per fact — when it was true in the world vs. when it was ingested — plus episodic/semantic/community tiers; rejects flat vector-only memory. 94.8% on the paper's Deep Memory Retrieval benchmark | Facts change over time and *when something became true* (not just what's true now) matters — e.g. "user's job title as of March" vs. "as of now" |
| **Self-editing in-context core + archival** | Letta / MemGPT, active dev at **letta-code** (letta.com/blog/memory-blocks, 2025-05-14) | OS-inspired hierarchy: a small always-in-context "core memory" the model edits via tool calls, backed by paged "archival"/"recall" memory it queries explicitly; memory blocks can be shared across agents | The agent should manage its own memory explicitly (visible, model-editable state) rather than an opaque background pipeline |
| **Ontology graph, session-vs-permanent split** | cognee (Apache-2.0) | Knowledge-graph + ontology; explicit `remember`/`recall`/`forget`/`improve` verb API; a session cache promotes into a permanent graph | The domain has real structure worth modeling as entities/relations, not just flat facts, and forgetting needs to be a first-class explicit operation |

Default absent a stronger signal: start with the fact-extraction model (mem0) — cheapest to stand
up on infra most teams already have (a vector store). Move to a temporal KG (Graphiti) only when
"when did this become true" is a real product requirement; move to self-editing core (Letta) only
when the agent itself, not a background job, should own memory edits; move to an ontology graph
(cognee) only when the domain has entity/relation structure worth the modeling cost.

### 3. The cognitive taxonomy — teach it, flag its sourcing
The four philosophies above are commonly mapped onto a **working / episodic / semantic /
procedural** memory taxonomy borrowed from cognitive science: working = current context, episodic
= what happened and when, semantic = facts and preferences, procedural = how to do a recurring
task. Use this vocabulary — it's genuinely useful for scoping a memory ask — but **flag it as
vendor-blog-sourced, not a single canonical paper**: no one primary source in this research
converged on it; it's a synthesized mapping repeated across product blogs. Don't cite it as settled
science in a decision document; cite it as a scoping heuristic.

### 4. Benchmarks
**LoCoMo** and **LongMemEval** are the standard long-horizon memory benchmarks the products above
report against (mem0 and Graphiti both cite LoCoMo-family results). Useful for comparing off-the-
shelf memory products against each other; **not** a substitute for a project-specific eval —
benchmark performance on synthetic long-conversation datasets doesn't guarantee the memory layer
recalls *this* product's actual entities correctly. Treat published benchmark numbers the way
`evaluation.md` treats any benchmark: a directional signal, not gospel — build a narrow eval on the
system's own recall failures before trusting a vendor's leaderboard number.

### 5. Product drift — re-verify before naming a package
Two of the four philosophies changed shape mid-research-cycle; don't cite the old name as current:
- **Zep's OSS core is deprecated** — the `getzep/zep` repo is now an examples/integration shell;
  the actual temporal-KG engine lives at `getzep/graphiti`. Cite Graphiti for the memory model.
- **Letta's legacy server** (`letta-ai/letta`) self-flags as legacy in its own README; active
  development is at `letta-ai/letta-code`.
**(as of 2026-07-25; re-verify both repos' README status before naming a package version in a
build doc — this cluster moves fast.)**

### 6. Border: memory vs RAG
Both retrieve. The difference is the corpus: `retrieval-and-rag.md` retrieves from an external,
largely static knowledge base (docs, code, a wiki); this ref retrieves from state the *system
itself generated* (past turns, extracted facts, episodic history) that's specific to a user or
session. A system can need both — retrieval-and-rag's 5-stage pipeline (chunk → hybrid retrieve →
rerank) is a legitimate implementation detail *inside* a memory layer's retrieval step (mem0 and
Graphiti both retrieve over a vector store internally) — but the *what* being retrieved and *why*
differ enough to warrant separate design decisions. Point to `retrieval-and-rag.md` for the
retrieval mechanics once a memory layer's storage model is chosen.

### What NOT to build
Don't stand up a knowledge-graph memory system (Graphiti/cognee) for a single-user, single-session
chat assistant with no cross-session recall need — that's short-term context management
(`prompt-and-context-engineering.md`), not long-term memory. Don't reach for self-editing
core-memory (Letta) before verifying the added complexity (the model must reliably call
memory-edit tools correctly) is worth it over a simpler background-consolidation pipeline (mem0).
The simplest thing that satisfies the actual recall requirement wins by default.

## Validation
- The short-term/long-term split is stated explicitly — what's expected to survive only this turn
  vs. what must persist across sessions.
- The philosophy pick names the tradeoff against at least one alternative from §2, not just "we use
  mem0/Letta/etc."
- If temporal correctness ("when was this true") matters, a bi-temporal or otherwise time-aware
  store is used — not a flat fact table that only supports overwrite.
- The working/episodic/semantic/procedural taxonomy, if used, is flagged as a scoping heuristic,
  not cited as settled science.
- A project-specific recall eval exists (or is explicitly deferred with a reason), not just a
  vendor benchmark number.

## Failure modes and handoff
- **The real need is within-session context management**, not cross-session persistence — →
  `prompt-and-context-engineering.md`.
- **The corpus is an external knowledge base, not self-generated conversational state** — →
  `retrieval-and-rag.md`.
- **The memory store needs production deployment/scaling** — → `backend`/`operate`.
- **Memory-layer output quality (not just recall) needs grading** (does the agent use recalled
  memory correctly, not just retrieve it) — → `evaluation.md`.
