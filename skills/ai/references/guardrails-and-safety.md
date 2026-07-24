# Guardrails & Safety

Purpose: Decide which runtime layer(s) intercept a model's input/output before harm reaches a user
or a downstream system — structural rails, validator composition, classifier moderation,
code-execution guards, or a human approval gate — and how to red-team and validate the guardrail
itself, not just the model.

Read when:
- The request involves content moderation, jailbreak/prompt-injection defense, blocking
  unsafe/off-policy output, gating a risky tool call behind human approval, or "add a safety layer."
- A guardrail exists but nobody has measured whether it actually catches the harms it claims to.

Skip when:
- The ask is measuring whether outputs are *correct*, not whether they're *safe/on-policy* —
  → [evaluation.md](evaluation.md) (guardrails intervene at runtime; evals measure quality).
- The ask is independent red-team as a pre-ship **release gate** with its own team/process — → 
  `quality`. This ref owns guardrails **built into the running system**; `quality` verifies them
  independently before ship.
- The ask is deploying/monitoring the guardrail service itself in production — → `operate`.
- The ask is a system-wide threat model or compliance boundary (what counts as sensitive data) —
  → `architecture`; implement inside that decision, don't invent it here.

Inputs:
- What the guardrail must catch (jailbreak, PII leak, off-topic, unsafe code execution, policy
  violation) — state explicitly; "add guardrails" without a named harm produces the wrong layer.
- Latency/cost budget — classifier calls and LLM-based rails add a hop; a single-token classifier
  and a full moderation model have very different cost profiles.
- Whether a human is ever in the loop for the risky action in question — decides whether an
  approval-gate is available as an option.

Produces: a named guardrail layer (or composed stack) matched to the harm, a validated false-
positive/false-negative rate against an adversarial labeled set, and — where relevant — a red-team
pass before the layer is trusted as a control.

## Contents
- The 5-way taxonomy
- Prompt self-verification (the cheapest layer)
- Cheap single-token classifier guardrails
- Red-teaming
- Validate the guardrail like a judge (the gap nobody covers)
- License flags

## Procedure

### 1. The 5-way taxonomy — pick the layer(s) by mechanism, not vendor
These are complementary layers, not competing choices — structural rails for hard constraints,
classifiers for known-harm categories, code-exec guards for tool-use-specific risk, approval gates
for irreversible actions. Compose more than one when the harm surface is broad.

| Layer | Mechanism | Fits | Reference implementation |
|---|---|---|---|
| **Structural rails** | Config/DSL-defined input/output/dialog/retrieval/execution rails intercepting the pipeline at fixed points | Multi-turn dialog control, SOP enforcement, deterministic + auditable policy | NeMo Guardrails (Apache-2.0, Colang DSL; github.com/NVIDIA-NeMo/Guardrails — moved from NVIDIA/ org) |
| **Validator composition** | `Guard` composed from pluggable `Validator`s, each checking one risk (PII, toxicity, format), configurable `on_fail` (exception/reask/fix/filter) | Lightest-weight, "pip install and go," marketplace-distributed | Guardrails AI (Apache-2.0, Guard+Validator+Hub; guardrailsai.com/docs) |
| **Classifier moderation** | A separate model scores content against fixed harm categories; inference call, not rule/regex | Known-category harms (hate, self-harm, sexual content); vendor- or model-agnostic | OpenAI Moderation (`omni-moderation-latest`, 13 categories, free) / Llama Guard (MLCommons hazard taxonomy) |
| **Code-execution guards** | Inference-time filtering of insecure code or code-interpreter-abuse specifically | Agentic coding tools, sandboxed execution | Code Shield / LlamaFirewall (MIT; meta-llama/PurpleLlama) |
| **Approval-gate / HITL** | Human approve/reject on a risky tool call, embedded in the loop itself | Irreversible or high-stakes actions (payments, deletes, external sends) | Inspect AI approval gates (github.com/UKGovernmentBEIS/inspect_ai) — guardrails can live *inside* the eval/agent loop, not only pre-deploy |

**Explicitly treat classifier moderation as a signal, not a blocker** — combine with other logic and
recalibrate policies as the underlying model changes (OpenAI Moderation guidance,
developers.openai.com/api/docs/guides/moderation).

### 2. Prompt self-verification — the cheapest layer, weakest guarantee
Before reaching for infra, a purely prompt-engineered layer reduces (not eliminates) hallucination
and unsafe output at near-zero cost (platform.claude.com/docs/en/test-and-evaluate/strengthen-
guardrails/reduce-hallucinations):
- Explicitly permit "I don't know" — the single highest-leverage change for hallucination.
- Require direct-quote extraction before analysis on long documents (>20k tokens).
- Require a citation for every claim; retract the claim if no supporting quote exists.
- Chain-of-thought verification (explain reasoning before the final answer) and best-of-N
  consistency checks for higher-stakes generations.
Use as the first layer or when no separate guardrail infra exists yet — always independently
validate high-stakes claims regardless.

### 3. Cheap single-token classifier guardrails
A dedicated small/cheap model call that returns a single token (`'0'`/`'1'`) classifying a request
as malicious/benign, chosen "for maximum speed" over a full moderation payload (@mattpocockuk,
x.com/mattpocockuk/status/1964996433129443652, 2025). Right-sized for a pre-filter in front of an
expensive main call — don't pay for a 13-category moderation response when a binary gate is all the
decision needs.

### 4. Red-teaming
Adversarial testing that a guardrail (or the underlying model) actually holds:
- **promptfoo `redteam`** — generates adversarial cases against a target, produces a vulnerability
  report (MIT; github.com/promptfoo/promptfoo).
- **CyberSecEval** (PurpleLlama) — cybersecurity-specific red-team benchmarks (insecure-code
  suggestion, code-interpreter abuse, prompt-injection susceptibility) built against **CWE** and
  **MITRE ATT&CK** (MIT; github.com/meta-llama/PurpleLlama).
- **Inspect AI** — sandboxed execution + approval gates + post-hoc log scanners for safety
  violations across a completed run (MIT; github.com/UKGovernmentBEIS/inspect_ai).
- **NeMo's LLM Vulnerability Scanning** — benchmarks how much a given rails config actually blocks
  jailbreaks/prompt injection on a reference bot, backed by a published paper (arXiv:2310.10501).

### 5. Validate the guardrail like a judge — the gap nobody covers
Guardrails are shipped and trusted far more often than they're measured. Apply the same discipline
[evaluation.md](evaluation.md) applies to LLM judges: build a labeled adversarial set (known-bad
inputs that should be blocked, known-good inputs that should pass), and report the guardrail's
**false-positive rate** (good input wrongly blocked) and **false-negative rate** (bad input that got
through) separately — not a single "accuracy" number, for the same imbalanced-data reason judges
need precision/recall reported separately (§3, evaluation.md). A guardrail with an unmeasured FN
rate is a guess wearing a control's clothes. Guardrails AI publishes a comparative "Guardrails
Index" (index.guardrailsai.com) benchmarking validators across risk categories — a rare public
instance of this practice; build the equivalent for your own harm categories rather than assuming a
public benchmark transfers.

## Validation
- Every guardrail layer maps to a named harm from Inputs, not "add guardrails" generically.
- Classifier-moderation output is consumed as a signal combined with other logic, never as a sole
  blocker.
- Any approval-gate/HITL path is reachable for every irreversible action identified.
- Red-team results (promptfoo/CyberSecEval/Inspect) exist for any layer treated as a hard control.
- FP/FN rate against an adversarial labeled set is reported for the guardrail itself — see
  [guardrails-controls-checklist.md](../assets/guardrails-controls-checklist.md).

## Failure modes and handoff
- **The real ask is "did the model get the right answer," not "is this safe/on-policy"** — →
  `evaluation.md`.
- **The real ask is a pre-ship, independent adversarial review with sign-off authority** — → 
  `quality`; this ref covers in-product controls, not the release gate.
- **A guardrail model's weights carry a restrictive license** (Llama Guard / Prompt Guard family —
  Llama Community License, acceptable-use-bound, >700M-MAU commercial clause) while the surrounding
  tooling (LlamaFirewall, CyberSecEval) is MIT — don't assume "MIT" covers the model; check
  per-artifact (github.com/meta-llama/PurpleLlama's README ships an explicit component→license
  table).
- **Phoenix or another Elastic License 2.0 (ELv2) tool** is being used for guardrail
  tracing/evaluation in a resold/managed-hosting context — ELv2 is source-available, not OSI open
  source, and blocks reselling as a hosted service; flag before that deployment shape is chosen.
- **No adversarial labeled set exists** — don't ship the guardrail as a trusted control; build the
  minimal set (§5) before treating a pass rate as evidence.
