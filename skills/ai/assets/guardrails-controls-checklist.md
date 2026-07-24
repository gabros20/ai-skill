# Guardrails Controls Checklist (fillable)

Uniform-table format per skill convention — fill "Implemented" and "Evidence," never narrate.
Source: [guardrails-and-safety.md](../references/guardrails-and-safety.md).

| # | Layer | Control | Implementation required | Implemented (Y/N) | Evidence / location |
|---|---|---|---|---|---|
| G01 | Structural rails | Input/output/dialog rail config exists for defined risk points | Rails or equivalent pipeline intercept present at each named point | | |
| G02 | Validator composition | Each output validated against composed risk checks before reaching the user | `Guard`+`Validator` (or equivalent) with `on_fail` action set, not silently ignored | | |
| G03 | Classifier moderation | Content scored against a fixed harm taxonomy | Moderation call wired in as a *signal*, combined with other logic, not sole blocker | | |
| G04 | Code-execution guard | Any executed/generated code is filtered for known-insecure patterns | Code-exec guard present on every code-interpreter/agentic-coding path | | |
| G05 | Approval-gate / HITL | Irreversible or high-stakes actions pause for human approval | Every action on the "irreversible" list from Inputs has a reachable approval path | | |
| G06 | Prompt self-verification | Model permitted to say "I don't know"; citations required for claims | Explicit instruction present in system prompt; citation-then-retract pattern implemented for long-doc grounding | | |
| G07 | Red-team coverage | Guardrail tested against adversarial inputs, not just designed | promptfoo `redteam` / CyberSecEval / Inspect scanner run recorded, dated | | |
| G08 | FP/FN measurement | Guardrail's own accuracy is measured, not assumed | Labeled adversarial set exists; FP rate and FN rate reported separately | | |
| G09 | License flag | Any guardrail model/tool with a restrictive or source-available license is flagged before the deployment shape is chosen | License checked per-artifact (tooling vs. model weights can differ) | | |
| G10 | Recalibration | Classifier/moderation policy revisited when the underlying model changes | Recalibration owner and cadence named | | |

**Self-audit count: ____ / 10 controls implemented and evidenced.**

Anything below 10/10 must be either fixed before the guardrail is trusted as a control, or
explicitly waived with a stated reason and owner — do not ship a silent gap.

## License flags to check per artifact (G09 detail)

| Artifact | License | Flag |
|---|---|---|
| NeMo Guardrails (code) | Apache-2.0 | Clean |
| Guardrails AI (code) | Apache-2.0 | Clean |
| OpenAI Moderation API | Vendor API, free | Not self-hostable; recalibrates on vendor's schedule |
| Llama Guard / Prompt Guard (model weights) | Llama Community License | Acceptable-use-bound, >700M-MAU commercial clause — do NOT assume MIT covers the model even when surrounding tooling is MIT |
| LlamaFirewall / CyberSecEval (code) | MIT | Clean — but check the model weights it wraps separately |
| Arize Phoenix (if used for guardrail eval/tracing) | Elastic License 2.0 (ELv2) | Source-available, not OSI open source; blocks reselling as a hosted/managed service — flag before that deployment shape |

Re-verify each license against the current LICENSE file before a hard claim — these shift (see
[guardrails-and-safety.md](../references/guardrails-and-safety.md) failure modes).
