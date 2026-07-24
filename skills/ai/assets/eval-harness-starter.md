# Eval Harness Starter (fillable)

Dataset shape, judge-prompt template, and a pass^k report skeleton. Source:
[evaluation.md](../references/evaluation.md) §5–6. Fill in brackets; delete rows that don't apply.

## 1. Dataset shape — `{input, target, metadata}`

One row per sample. `target` is either a literal expected value (exact/similarity match) or a
grading rubric/criterion string consumed by the judge — the dataset doubles as the rubric.

```json
{
  "input": "<the exact prompt/state the system receives>",
  "target": "<expected output, OR a criterion string for a model-graded judge>",
  "metadata": {
    "feature": "<which feature/capability this exercises>",
    "scenario": "<happy path / edge case / adversarial>",
    "persona": "<user type, if relevant>",
    "source": "real | synthetic",
    "failure_mode": "<taxonomy label from error analysis, once known>"
  }
}
```

- Build from real traces first (§1 of evaluation.md — open coding → axial coding → saturation);
  synthetic inputs (LLM-generated) fill gaps, never replace real ones.
- `failure_mode` starts empty; fill it in as the error-analysis taxonomy stabilizes, then use it to
  segment pass rates by category.

## 2. Judge-prompt template (Critique Shadowing → few-shot judge)

```
You are grading whether the AI system's response satisfies the criterion below.
Answer with a single line: GRADE: C (correct/pass) or GRADE: I (incorrect/fail).
Then give a one-sentence reason.

## Criterion
{criterion}            <- populated from Sample.target

## Input
{input}

## System response
{output}

## Examples of expert grading (few-shot, from Critique Shadowing)
Example 1 — GRADE: C
Response: [...]
Critique: [...why this passes, in the expert's own words...]

Example 2 — GRADE: I
Response: [...]
Critique: [...why this fails — be as specific as the expert critique that trained this...]

[3+ examples minimum; each one a real expert-labeled critique, not invented]

## Grade the response above
```

- Extract the grade via regex on the fixed `GRADE: C`/`GRADE: I` line — the dominant convention
  across Inspect AI, openai/evals, and autoevals.
- Optional knobs: `partial_credit` (allow 0.5), `include_history` (grade the full transcript, not
  just the final turn) — expose both if the harness supports them.
- Role-bind the grader: use a different model (or explicitly labeled "grader" role) than the
  model-under-test to avoid self-grading bias.
- For jury grading: run 3+ diverse grader models independently, take the majority `GRADE`.

## 3. Judge alignment report (fill after running the judge against a human-labeled holdout)

| | Human: Pass | Human: Fail |
|---|---|---|
| **Judge: Pass** | TP = ____ | FP = ____ |
| **Judge: Fail** | FN = ____ | TN = ____ |

- Precision = TP / (TP + FP): ____
- Recall = TP / (TP + FN): ____
- Report precision and recall **separately** — do not report only raw agreement (TP+TN)/total; it
  hides imbalanced-data failure.
- Target: iterate the few-shot examples until both are acceptable for the decision this judge
  gates (state the acceptable threshold explicitly — there is no universal number).

## 4. pass@k vs pass^k report skeleton

Run each task `k` times (independent trials, same input).

| Task ID | Trials (k) | Successes | pass@k (≥1 success) | pass^k (all succeed) |
|---|---|---|---|---|
| ____ | ____ | ____ | ____% | ____% |

- **pass@k** = did at least one of k attempts succeed — the metric most public benchmarks report.
- **pass^k** = did *all* k attempts succeed — report this one for production-reliability claims;
  users don't get a silent retry.
- Choose `k` to match real retry behavior (k=1 if there's no retry path at all).

## 5. Suite assignment (tag every eval row)

| Suite | This eval is... | Runs |
|---|---|---|
| Offline | ☐ | every commit / CI gate |
| Online | ☐ | continuous, against live traffic |
| Regression | ☐ | every change, target ~100% |
| Safety | ☐ | cross-cutting, layered on offline+online |
