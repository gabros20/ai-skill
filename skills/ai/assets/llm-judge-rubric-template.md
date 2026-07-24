# LLM-Judge Rubric Build Sheet — Critique Shadowing

Fillable build sheet for the 7-step Critique Shadowing method. Source:
[evaluation.md](../references/evaluation.md) §2 (Hamel Husain, hamel.dev/blog/posts/llm-judge/).
Work top to bottom; steps 3–4 loop until stable, steps 5–6 loop until aligned.

## Step 1 — Principal domain expert(s)
- Name(s): ____________________ (1–2 people; must represent the target user, e.g. a lawyer for
  legal docs, not a generalist PM)

## Step 2 — Dataset
- Feature × Scenario × Persona coverage (list the cells you need filled):
  | Feature | Scenario | Persona | Filled? |
  |---|---|---|---|
  | | | | ☐ |
- Synthetic inputs generated: ____ (LLM-generated *inputs* only — never LLM-generated *grades*)
- Real production traces included: ____
- Saturation check: are new failure modes still appearing as examples are added? ☐ yes (keep
  going) ☐ no (stop, ~30 examples minimum before stopping)

## Step 3 — Expert labels (binary + critique)
For each example:
- Grade: ☐ Pass ☐ Fail
- Critique (detailed enough that a new teammate understands the reasoning without asking):
  ________________________________________________
- [ ] Binary, not 1–5 — a scale invites criteria drift; binary forces the critique to say what
  actually matters.

## Step 4 — Fix the system first
- [ ] Obvious/pervasive errors in the AI system itself are fixed before judge-building continues
  (a judge trained against a broken baseline learns the wrong bar).
- If new errors surfaced during labeling, loop back to Step 3 after the fix.

## Step 5 — Build the judge (few-shot)
- Few-shot examples used (3+ minimum, pulled verbatim from Step 3 critiques):
  1. ____
  2. ____
  3. ____
- Holdout set size (never seen by the few-shot prompt): ____
- Alignment after iteration N:
  | Iteration | Precision | Recall | Notes |
  |---|---|---|---|
  | 1 | | | |
  | 2 | | | |
  | 3 | | | |
- Target: >90% alignment is the typical stopping point reached around iteration 3 — not a hard
  requirement, state your own bar if different: ____

## Step 6 — Error analysis on the judge itself
- Segment failure rate by Feature / Scenario / Persona:
  | Segment | Judge accuracy | Root cause | Action |
  |---|---|---|---|
  | | | | |
- High-impact categories loop back to Step 3 (more labeled examples in that segment).

## Step 7 — Specialized judges, only if needed
- [ ] Confirmed via Step 6 that a generic judge misses a recurring, specific pattern before
  building a specialized judge for it.
- [ ] Anything deterministically checkable (format, presence of a required field, a regex match) is
  a code assertion, not a model call.

## Anti-pattern check (fail any of these → stop and fix before shipping the judge)
- [ ] Not using a non-domain-expert proxy rater (e.g. "the CEO reviewed a few examples")
- [ ] Not skipping straight to a 1–5 scale for speed
- [ ] Not treating an off-the-shelf/generic judge as sufficient without holdout validation
- [ ] Critiques are detailed, not terse one-liners
- [ ] Not fine-tuning the judge to paper over a broken primary system
