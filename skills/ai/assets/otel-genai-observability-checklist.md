# OTel-GenAI Observability Checklist (fillable)

Uniform-table format per skill convention — fill "Implemented" and "Evidence," never narrate.
Source: OpenTelemetry GenAI semantic conventions (upstreamed from OpenLLMetry, Apache-2.0) +
elastic/agent-skills `observability-llm-obs` (Apache-2.0), paraphrased. Background:
[observability-and-cost.md](../references/observability-and-cost.md).

| # | Control | Implementation required | Implemented (Y/N) | Evidence / location |
|---|---|---|---|---|
| 1 | Operation identity | `gen_ai.operation.name` set on every LLM span | | |
| 2 | Provider identity | `gen_ai.provider.name` set on every LLM span | | |
| 3 | Model identity | `gen_ai.request.model` and `gen_ai.response.model` both captured (requested vs actually-served) | | |
| 4 | Token usage | `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens` captured per call | | |
| 5 | Cache tokens split | Cache-write and cache-read token counts tracked as **separate** fields, not blended | | |
| 6 | Cost attribution | A cost field present (custom attribute — cost is NOT in the OTel spec) mapped to $/call | | |
| 7 | Request shape | `gen_ai.request.temperature` / `gen_ai.request.max_tokens` captured | | |
| 8 | Error taxonomy | `error.type` populated using the standard OTel error taxonomy, not a free-text string | | |
| 9 | Conversation linkage | `gen_ai.conversation.id` ties spans back to a session/thread | | |
| 10 | Finish-reason capture | `gen_ai.response.finish_reasons` captured, correlatable with quality/safety review | | |
| 11 | Trace/span hierarchy | Root span → child LLM/tool-call spans reconstructible via `trace.id` + parent/child links | | |
| 12 | Session/Trace/Generation distinction | A conversation-level "session" is distinguishable from a single request-lifecycle "trace" | | |
| 13 | Cache-hit-rate dashboard | Cache-hit-rate visible on the same dashboard as cost and latency, not a separate/omitted view | | |
| 14 | Per-org/feature spend cap | A `max_total_tokens`-style cap or $/month ceiling configured, not unlimited spend | | |
| 15 | Online-eval wiring | The offline judge (from `evaluation.md`) also runs against live traffic as a monitor | | |
| 16 | Platform license cleared | If self-hosting/reselling the observability platform, its license (open-core/ELv2/etc.) is checked against the primary LICENSE file | | |

**Self-audit count: ____ / 16 controls implemented and evidenced.**

Anything below 16/16 must be either fixed before ship or explicitly waived with a stated reason
and owner — do not ship a silent gap, especially rows 5–6 (cache/cost splitting) and 13
(cache-hit-rate visibility), which are this cluster's most commonly-skipped controls.
