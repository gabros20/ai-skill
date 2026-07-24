# RAG Pipeline Checklist (fillable)

Uniform-table format per skill convention — fill "Choice" and "Verified," never narrate. Source:
`references/retrieval-and-rag.md`. One row per stage; skip a stage only with a stated reason in
its Verified column, never a silent blank.

| # | Stage | Options | Choice | Verified |
|---|---|---|---|---|
| 1 | Chunking | Contextual retrieval (Anthropic) / late chunking (Jina-Weaviate) / naive fixed-recursive | | |
| 2 | Dense retrieval | Embedding model + vector store (name it) | | |
| 3 | Sparse retrieval | BM25 / provider-native full-text | | |
| 4 | Fusion | RRF (rank-based, k≈60) — fuse on rank, never raw score | | |
| 5 | Rerank | Cross-encoder over wide-retrieved set (name model); retrieve-width → keep-width ratio | | |
| 6 | Agentic decomposition | None / routing / query transform / sub-question / plan-then-retrieve — justified by a retrieval-eval failure, not added reflexively | | |
| 7 | Vector store | pgvector (default) / Chroma (prototype) / Qdrant-Weaviate (prod self-host) / Milvus (billion-scale) / LanceDB (embedded-multimodal) | | |
| 8 | Retrieval eval | Context Precision / Context Recall (Ragas or equivalent) measured on a project-specific query set | | |
| 9 | Generation eval | Faithfulness / Answer-Response Relevancy — separate from row 8, owned by `evaluation.md` | | |
| 10 | Freshness | Reindex/refresh cadence stated; stale-index staleness bound named | | |
| 11 | Border check | Vector-store *serving* (backend/operate) and *governed ingestion* (data) explicitly out of this pipeline's scope | | |

**Self-audit count: ____ / 11 stages chosen and verified.**

Any row left blank or marked "skipped" must carry a one-line reason in Verified (e.g. "corpus <1k
docs, single-hop queries only — rerank/decomposition skipped, retrieval eval confirms sufficient
recall"). Do not ship a pipeline with an unexplained gap.
