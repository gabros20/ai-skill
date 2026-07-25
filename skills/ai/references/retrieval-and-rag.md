# Retrieval and RAG

Purpose: Decide the shape of a system's retrieval behavior — how documents get chunked, how
candidates get retrieved and fused, whether/how they get reranked, when to add an agentic
decomposition layer over raw top-k, and which vector store the retrieval behavior is validated
against. Owns the *behavior*, not the store's operation or the pipeline that populates it.

Read when:
- The request is "make answers grounded in our docs," "add RAG," "search isn't finding the right
  chunk," "improve retrieval quality," or picks a vector store for a new retrieval feature.
- Retrieval accuracy is being debugged and it's unclear whether the fault is retrieval (wrong
  chunks) or generation (right chunks, wrong answer).

Skip when:
- The vector store already exists and the ask is deploying/scaling/operating it (connection
  pooling, sharding, backup) — → `backend` (`persistence.md` covers pgvector as a Postgres
  extension) or `operate`.
- The ask is a governed ETL pipeline that populates the store as a dataset (ingestion schedule,
  lineage, access control on the source data) — → `data`.
- The ask is generation-quality grading once retrieval is confirmed correct — → `evaluation.md`
  (owns the LLM-as-judge harness; this ref owns only the retrieval-metric half).
- The system's core uncertainty is "should this be RAG at all vs. long-context stuffing vs. an
  agent with search tools" as an architectural boundary call — name the tradeoff here (§4) but the
  system-shape decision itself is `architecture`'s.

Inputs:
- Corpus size/shape (structured vs. prose vs. code), update frequency (static vs. live), and
  whether it's already on Postgres — decides the vector-store pick (§5).
- Query pattern: single-hop lookup vs. multi-hop/comparative — decides whether §4's agentic layer
  is warranted.
- Current failure mode if debugging: wrong chunks retrieved (fix chunking/fusion/rerank) vs. right
  chunks, bad answer (route to `evaluation.md`'s generation metrics).

Produces:
- A chunking strategy with its rationale.
- A retrieve→fuse→rerank pipeline shape, with the "what NOT to add yet" boundary stated.
- A vector-store pick with the tradeoff named against the alternative.
- A retrieval-evaluation stance (which metrics, cross-referenced to `evaluation.md`).

## Contents
- The 5-stage modern pipeline
- Stage 1: chunk deliberately
- Stage 2: hybrid retrieve, fuse with RRF
- Stage 3: cross-encoder rerank
- Stage 4: agentic decomposition layer (and when NOT to add it)
- Stage 5: evaluate retrieval and generation separately
- Vector-store decision
- What NOT to build

## Procedure

### 0. The 5-stage modern pipeline
"Naive top-k RAG is dead" (LlamaIndex, "RAG is Dead, Long Live Agentic Retrieval," 2025-05-29,
llamaindex.ai/blog/rag-is-dead-long-live-agentic-retrieval) is the industry framing — but RAG
itself is not: "Dear anyone that said RAG is dead, eat it" (Hamel Husain,
x.com/HamelHusain/status/1986448116158243106). What died is a single embed→top-k→stuff step done
with no chunking discipline, no fusion, no rerank. The consensus replacement, converged across
Anthropic, Weaviate, Cohere, and LlamaIndex canon:
**chunk deliberately → hybrid retrieve + fuse → rerank → (agentic decomposition if warranted) →
evaluate retrieval and generation separately.** Each stage below names the modal default, the
alternative, and what NOT to reach for first.

### 1. Chunk deliberately
Fixed/recursive chunking loses a chunk's document context — a chunk like "the company grew 3%
that quarter" is useless without knowing which company, which quarter. Two fixes, pick one:
- **Contextual retrieval** (Anthropic, 2024-09-19, anthropic.com/engineering/contextual-retrieval):
  prepend a 50–100 token LLM-generated context blurb to each chunk *before* embedding and before
  building the BM25 index. Cheap via prompt caching (~$1.02 per million document tokens,
  date-stamped **as of 2024-09-19, re-verify against current cache pricing** — see
  `model-selection-and-routing.md`). Anthropic's staged numbers: **contextual embeddings alone
  reduced retrieval failures ~35%; adding contextual BM25 (hybrid, §2) reached ~49%; adding
  reranking (§3) reached ~67%** — each stage compounds on the last.
- **Late chunking** (Jina AI / Weaviate, 2024-09-05, weaviate.io/blog/late-chunking): embed the
  *whole* document first through a long-context embedding model, then mean-pool token vectors into
  chunk-sized vectors after the fact. Gets late-interaction-quality context retention at the
  storage cost of naive chunking (no LLM call per chunk) — pick this when contextual retrieval's
  per-chunk LLM cost is the constraint and a long-context embedder is available.
Both fix the same problem; contextual retrieval trades compute for interpretability (a human can
read the injected context), late chunking trades an embedding-model requirement for zero added
LLM cost. Default: contextual retrieval when caching is already in the stack; late chunking when
chunk volume makes per-chunk LLM calls the bottleneck.

### 2. Hybrid retrieve, fuse with Reciprocal Rank Fusion
Run dense (embedding/cosine) and sparse (BM25) retrieval in parallel, then fuse with **RRF**
(Weaviate, 2025-01-27, weaviate.io/blog/hybrid-search-explained) — the single most uncontested
claim in this corpus. Fuse **on rank, not raw score**: BM25 and cosine-similarity scores live on
incompatible scales and can't be weighted-averaged meaningfully; RRF instead sums
`1 / (k + rank)` per result list, `k ≈ 60` by convention. Dense and sparse retrieval fail on
orthogonal cases (dense misses exact keyword/ID matches; sparse misses semantic paraphrase) — this
is why hybrid, not either alone, is now the modal default query shape, not an advanced trick
(GitHub corpus, Qdrant/Weaviate donor read). A field report corroborates the general shape at the
codebase-retrieval extreme: "RAG + vector DB gives decent results, but agentic search over the
repo (glob/grep/read) consistently worked better on real codebases... RAG + [agentic]"
(@dani_avila7, x.com/dani_avila7/status/2018766464933613871) — hybrid retrieval generalizes beyond
dense+sparse to "structured search + vector search."

### 3. Cross-encoder rerank
Retrieve wide (Anthropic's own contextual-retrieval work retrieved top-150), pass the candidate
set through a cross-encoder reranker, keep a small high-precision set (top-20). This is the
**largest single accuracy jump** in the pipeline — adding reranking on top of contextual
embeddings + hybrid BM25 took retrieval-failure reduction from ~49% to ~67% (§1, Anthropic, cited
above). Cohere Rerank
(docs.cohere.com/docs/rerank-overview) is the modal hosted default; the discipline generalizes to
any cross-encoder (bi-encoder retrieves cheaply at scale, cross-encoder refines expensively on a
small candidate set — never run a cross-encoder over the full corpus). Rerank *refines*, it
doesn't replace stage 2.

### 4. Agentic decomposition layer — add only for non-trivial queries
For single-hop factual lookups, stages 1–3 are the system. For multi-hop, comparative, or
ambiguous queries, add a decomposition layer: **routing** (pick which index/tool to query),
**query transformation** (rewrite the user query into a better retrieval query), **sub-question
decomposition** (split a compound question into retrievable sub-questions), or **plan-then-
retrieve** (LlamaIndex, developers.llamaindex.ai/python/framework/optimizing/agentic_strategies/).
This is what "RAG evolved into," not a separate system replacing it. **What NOT to build**: don't
reach for this layer by default — it adds LLM calls, latency, and a new failure surface (bad
decomposition compounds into bad retrieval) for query patterns that a single hybrid-retrieve-and-
rerank pass already answers correctly. Verify with retrieval eval (§5) that stages 1–3 are
actually failing on the target query distribution before adding it — verify-and-subtract, not
reflexive escalation.

### 5. Evaluate retrieval and generation separately
Retrieval and generation fail independently and need independent metrics — conflating them hides
which stage to fix. Use the converged RAG-metric vocabulary — **Context Precision / Context Recall**
grade retrieval, **Faithfulness / Answer Relevancy** grade generation — whose definitions are
single-homed in [evaluation.md](evaluation.md) §7 (the flagship eval ref owns the metric table); this
section owns only the retrieval-side *diagnostic routing*. If Context Recall is low, fix chunking/fusion/rerank
(§1–3), not the prompt. If Faithfulness is low with good Context Recall, the retrieval pipeline is
fine — the fault is in generation, and the fix routes to `evaluation.md`'s LLM-as-judge harness
and prompt/context-engineering discipline, not back into this pipeline.

### 6. Vector-store decision
Three separable layers — don't conflate them: **which vector store** (an engine choice) ≠ **which
orchestration framework** (LangChain/LlamaIndex/Haystack, a code-organization choice) ≠ **whether
to assemble a pipeline at all** (RAGFlow/LightRAG ship the whole stages-1–4 pipeline as one
product, trading control for speed-to-first-RAG).

Store pick, in order of reach-for-first:
| Situation | Pick | Why |
|---|---|---|
| Already on Postgres, <~500K vectors | **pgvector** (PostgreSQL License, permissive) | One SQL statement joins vectors and source rows; no dual-write, no second system to run. Setup/ops mechanics owned by `backend`'s `persistence.md`. |
| Prototyping, no infra yet | **Chroma** (Apache-2.0) | Minimal 4-function embedded API, zero config. |
| Production self-host at scale, or rich payload-filtered hybrid fusion (RRF + DBSF) | **Qdrant** or **Weaviate** | Purpose-built ANN + hybrid fusion + distributed sharding; graduate here when pgvector's HNSW/IVFFlat stops meeting latency/recall at growing scale. |
| Billion-scale, GPU-accelerated ANN | **Milvus** (Apache-2.0) | Compute/storage separation, every major ANN index family, K8s-native. |
| Embedded + multimodal | **LanceDB** | Columnar Lance format, git-like data versioning, vector+FTS+SQL in one embedded engine. |

**Default: pgvector until a named failure** (recall/latency at measured scale, or a fusion
capability pgvector lacks) forces graduation — not novelty-seeking. **(as of 2026-07-25; re-verify
current pgvector max-practical-scale and each store's current hybrid-fusion feature set against
its docs before a hard capacity claim.)**

**Border**: retrieval **behavior** (this ref: chunking, fusion, rerank, decomposition, retrieval
eval) is `ai`'s. The vector store **as served infrastructure** (deployment, pooling, backup,
uptime) is `backend`/`operate`'s. The vector store **as a governed dataset** (ingestion pipeline,
source-of-truth lineage, access control on what gets indexed) is `data`'s. A single feature can
cross all three — state which layer a given question is actually about before answering it.

## Validation
- The chunking strategy names which document-context-loss problem it fixes and why (contextual vs.
  late), not just "we chunk."
- Retrieval uses hybrid (dense+sparse) fused on rank via RRF, not raw-score blending, unless a
  measured eval shows single-mode retrieval suffices for the query distribution.
- A rerank stage exists over a wide-retrieved candidate set before generation, or its absence is a
  stated tradeoff (latency-sensitive path, small corpus where precision@k is already high).
- The agentic decomposition layer (§4) is justified by a retrieval-eval failure on the actual query
  distribution, not added reflexively.
- Retrieval quality (Context Precision/Recall) and generation quality (Faithfulness/Relevancy) are
  reported as separate numbers, not one blended "RAG score."
- The vector-store pick names the tradeoff against pgvector-as-default, or states why pgvector was
  sufficient.

## Failure modes and handoff
- **The real question is architectural** (RAG vs. long-context vs. agent-with-search-tools as a
  system-shape decision) — this ref names the tradeoff but the boundary call is `architecture`'s.
- **The vector store needs deploying, scaling, or backing up** — → `backend`/`operate`; this ref
  owns the behavior that runs against it, not its operation.
- **The ask is really about the ingestion pipeline** (source-of-truth, lineage, refresh schedule,
  access control on indexed data) — → `data`.
- **Generation is wrong despite good retrieval metrics** — → `evaluation.md`'s LLM-as-judge harness
  and `prompt-and-context-engineering.md`; don't re-tune chunking for a generation-side fault.
- **Query pattern needs multi-agent orchestration over multiple retrieval sources**, not just
  decomposition — → `agent-construction.md` / `surface-multi-agent.md`.
