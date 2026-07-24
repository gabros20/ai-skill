# Evaluation ⭐ (flagship)

Purpose: Turn "does this AI system actually work" into a concrete eval program — a labeled dataset,
an aligned judge (human or LLM), a harness shape that matches the system, and a taxonomy that says
which suite runs when. The completion gate for every other `ai` job, not an afterthought.

Read when:
- Nothing yet measures whether the system behaves acceptably, "it feels worse since we changed the
  prompt/model," a judge/scorer needs building, or CI needs a pass/fail gate on model behavior.
- An existing eval only checks the model against a public/generic benchmark and a domain-specific
  correctness signal is missing.

Skip when:
- The ask is independent, adversarial verification before ship (red-team as a *release gate*,
  separate reviewer/team) — → `quality`. This ref covers evals **built into** the product; `quality`
  verifies independently.
- The ask is a guardrail/safety control at runtime (moderation classifier, rail, approval gate) —
  → [guardrails-and-safety.md](guardrails-and-safety.md). Evals measure; guardrails intervene.
- The ask is chunking/hybrid-search/rerank mechanics — → `retrieval-and-rag.md`; this ref owns only
  the RAG *metric vocabulary* used to score that pipeline.
- The ask is production tracing/cost dashboards, not a labeled judgment — → `observability-and-
  cost.md` (online evals are the bridge between the two — see §4).

Inputs:
- Real transcripts/traces from the system (or a close proxy) — synthetic-only datasets miss the
  failure modes that matter. State explicitly if none exist yet (start there, don't skip to judge-
  building).
- A domain expert who can say pass/fail on a real example and explain why — not a generic rater.
- The system's shape (single call / RAG / multi-turn agent) — decides which harness shape and which
  suite types apply.

Produces: a failure-mode taxonomy from real data, a labeled dataset (`{input, target, metadata}`),
an aligned judge (with measured precision/recall, not raw agreement), a harness wired into CI with a
named shape, and an explicit offline/online/regression/safety suite assignment.

## Contents
- Error-analysis-first (where the effort actually goes)
- Binary judges + Critique Shadowing (building an aligned LLM judge)
- Decompose and jury the judge
- Three harness shapes
- Dataset shape + offline/online/regression/safety taxonomy
- pass@k vs pass^k
- RAG-metric vocabulary
- Distrust benchmarks

## Procedure

### 1. Error-analysis-first — spend 60–80% of eval effort here
The single most-repeated, most-consensus-heavy claim across this field (Hamel Husain & Shreya
Shankar, hamel.dev/blog/posts/evals-faq/, modified 2026-07-18): building dashboards or generic
metrics before reading real transcripts is the top failure mode. The procedure —
1. **Open coding**: read real traces with a domain expert, freeform-note every failure, no
   taxonomy yet.
2. **Axial coding**: cluster the notes into a named failure taxonomy (e.g. "wrong tool called,"
   "citation not grounded," "refused a valid request").
3. **Saturate**: keep sampling until new failure types stop appearing — ~100 traces is the rule of
   thumb, not a hard rule (hamel.dev/blog/posts/evals-faq/).
4. Build evaluators **only for discovered failure modes**, never speculative ones. "Eval-driven
   development" (writing evals before looking at real failures) reliably underperforms.

**What NOT to build**: a metrics dashboard before this pass. A pile of arbitrary-scale scores looks
like progress and produces none — it's the single named anti-pattern in this source.

### 2. Binary judges + Critique Shadowing
Prefer **binary pass/fail over 1–5 Likert scales**, for both human labels and LLM judges — Likert
scales are unactionable and let "criteria drift" hide; forcing a binary decision makes the rater
articulate what actually matters (hamel.dev/blog/posts/llm-judge/, 2024-10-29).

**Critique Shadowing** — the concrete method for turning a domain expert's judgment into an aligned
LLM judge (Hamel Husain, hamel.dev/blog/posts/llm-judge/):
1. Identify 1–2 principal domain experts who represent the target user.
2. Build a dataset across Feature × Scenario × Persona; mix synthetic inputs (LLM-generated, not
   LLM-graded) with real production traces; keep expanding until failure modes saturate (~30
   examples minimum).
3. Expert labels each example **binary pass/fail + a detailed critique** — detailed enough that a
   new teammate would understand the reasoning without asking.
4. Fix obvious, pervasive errors in the system itself before judge-building on a broken baseline.
5. Few-shot the judge prompt with 3+ of the expert's labeled critiques; test against a holdout set;
   iterate — typically ~3 cycles reach >90% alignment.
6. Segment failure rates by Feature/Scenario/Persona; hand-classify root causes; loop back to (3)
   for high-impact categories.
7. Build specialized judges only where error analysis shows a recurring pattern a generic judge
   misses; use deterministic code assertions for anything checkable without a model at all.

### 3. Decompose and jury the judge
- **Align judge-to-human via precision and recall separately, never raw agreement** — raw agreement
  is misleading on imbalanced pass/fail data (hamel.dev/blog/posts/evals-faq/,
  hamel.dev/blog/posts/llm-judge/).
- **Decompose holistic scores.** A single 1–10 or pass/fail judgment "hides both its reasoning and
  its ceiling effects" (@omarsar0, x.com/omarsar0/status/2070942495832470001, 2026) — once most
  outputs score 9/10, the judge stops discriminating. Score sub-criteria independently (grounding,
  tool-call correctness, tone) and roll up, rather than one opaque number.
- **Role-bind the grader.** Decouple the judge model from the model-under-test explicitly (Inspect
  AI's `model_role="grader"` pattern) — grading a model with itself biases toward self-approval.
- **Jury pattern.** When judge reliability matters, use 3+ diverse grader models graded
  independently and take the majority vote, rather than trusting one judge
  (github.com/UKGovernmentBEIS/inspect_ai, MIT).

### 4. Three harness shapes — pick the one that matches the system
| Shape | Model | Fits | Fixture |
|---|---|---|---|
| **Assertion-matrix** | Declarative config: prompts × providers × test cases × assertions, no code | Teams wanting zero-code eval + a CI gate fast | promptfoo (MIT, `redteam` built in; acquired by OpenAI 2026, still OSS) |
| **Test-as-code** | `LLMTestCase` + `assert_test(case, [metrics])` — "pytest for LLMs," threshold-gated | Teams with an existing test culture; evals live in the normal test runner | deepeval (Apache-2.0) |
| **Task/Solver/Scorer** | Dataset, solver (the system under test, itself composable), scorer (heuristic/similarity/model-graded/custom-rubric) — each independently swappable | **Agentic and safety evals** specifically — the only shape with first-class sandboxing, tool/turn/cost limits, and human-approval gates *inside* the eval loop | Inspect AI (MIT, UK AISI) |

Retrieval-first: confirm current package versions (`npm view` equivalents / PyPI) before generating
config — this cluster ships fast.

### 5. Dataset shape + the offline/online/regression/safety taxonomy
Samples converge on one shape almost universally: **`{input, target, metadata}`**
(ragas/Inspect/deepeval all use it). `target` is either a literal expected value or a **grading
rubric/criterion string consumed by the judge** — your dataset doubles as the rubric (Inspect's
`{criterion}` template variable is populated directly from `Sample.target`). See
[eval-harness-starter.md](../assets/eval-harness-starter.md).

Four suite types, clearest framing from LangSmith (docs.langchain.com/langsmith/evaluation-concepts)
and Anthropic (anthropic.com/engineering/demystifying-evals-for-ai-agents, 2026-01-09):
| Type | Data | Runs when | Purpose |
|---|---|---|---|
| **Offline** | Curated dataset with references | Every commit, gates CI | Reproducible, scales to thousands of tasks |
| **Online** | Live production traffic, no references | Continuously | Catches unforeseen failures; reactive, noisier; feeds new offline cases back |
| **Regression** | Previously-solved tasks | Every change | Targets ~100% pass; catches silent capability loss — capability evals "graduate" in once consistently solved |
| **Safety** | Adversarial/red-team cases | Cross-cutting | Layered on both offline and online, not a fourth independent lane |

### 6. pass@k vs pass^k
**pass@k** = probability of ≥1 success in k attempts (what most public benchmarks report).
**pass^k** = probability that **all** k trials succeed — the metric that actually predicts
production reliability, since a user doesn't get to retry silently (anthropic.com/engineering/
demystifying-evals-for-ai-agents, 2026-01-09). Report pass^k, not pass@k, for anything judged by
reliability rather than best-case capability. See
[eval-harness-starter.md](../assets/eval-harness-starter.md) for a report skeleton.

### 7. RAG-metric vocabulary — converged, portable, single-homed here
The metric names are the same across ragas, deepeval, and autoevals (deepeval literally ships a
`RAGAS` composite metric averaging the four) — treat this vocabulary as settled, not vendor-specific
(docs.ragas.io/en/stable/concepts/metrics/available_metrics/, dated 2025-12-09; re-verify against
current docs, this page churns):
| Metric | Measures | Diagnoses |
|---|---|---|
| **Faithfulness** | Is the answer grounded in the retrieved context, no unsupported claims | Generation-layer hallucination |
| **Context Precision** | Are the *ranked* relevant chunks near the top | Retrieval ranking/rerank quality |
| **Context Recall** | Did retrieval surface everything needed to answer | Retrieval coverage/chunking |
| **Answer/Context Relevancy** | Is the output (or retrieved context) actually relevant to the input | Either layer |

Evaluate retrieval and generation **separately** — this vocabulary is what tells you whether to fix
chunking or the prompt, rather than one blended "RAG quality" number. Retrieval mechanics
(chunking, hybrid+RRF, rerank) live in `retrieval-and-rag.md`; this table is the scoring layer only.

### 8. Distrust benchmarks
Generic, off-the-shelf metrics and public leaderboards fail because correctness is domain- and
product-specific (hamel.dev/blog/posts/evals-faq/) — and the leaderboards themselves are shakier
than they look: METR/FrontierCode found **more than half of SWE-bench "passes" are unmergeable
slop** against maintainer-validated tasks (@swyx, x.com/swyx/status/2064081945567580323, 2026).
Foundation-model benchmarks are not your evals (@HamelHusain, x.com/HamelHusain/status/
1921221339337421235). Treat any adoption number or leaderboard rank as engagement, not gospel —
build the domain-specific dataset from §1 before trusting a published score.

## Validation
- A failure taxonomy exists, built from real traces via open→axial coding, not assumed upfront.
- Judge alignment is reported as precision/recall against a human-labeled holdout, not raw
  agreement.
- The harness shape (assertion-matrix / test-as-code / Task-Solver-Scorer) is named and matches the
  system (agentic/safety work uses Task-Solver-Scorer).
- Suite type (offline/online/regression/safety) is assigned per eval, not left implicit.
- Reliability claims cite pass^k, not pass@k, where retries aren't available to the user.
- No ship decision rests solely on a public benchmark score.

## Failure modes and handoff
- **No real traces exist yet** — don't start with judge-building; instrument the system and collect
  ~30–100 real interactions first.
- **Judge disagreement with humans is high and unexplained** — decompose the judge into
  sub-criteria (§3) before assuming the judge model is simply "bad."
- **The ask is really "block this before it ships," not "measure it"** — that's an independent
  gate → `quality`.
- **The ask is a runtime intervention (filter, rail, approval)** — → `guardrails-and-safety.md`;
  build the eval that proves the guardrail works, but the guardrail itself lives there.
- **Eval infra exists but nobody looks at failures** — the eval flywheel (traces → critiques →
  fine-tuning data → debugging) breaks if the dataset isn't revisited; treat it as a maintained
  artifact, not a one-time deliverable.
