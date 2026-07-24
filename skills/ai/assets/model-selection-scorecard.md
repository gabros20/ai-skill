# Model Selection Scorecard (fillable)

Fillable decision table per call-class/feature. Background and the price/license tables:
[model-selection-and-routing.md](../references/model-selection-and-routing.md). Re-verify every
$/MTok figure at fill time — pricing pages churn monthly, don't trust a stale copy of this sheet.

## Per call-class decision

| Field | Fill in |
|---|---|
| Call class / feature name | |
| Task kind (classify / extract / open-ended reasoning / tool-use / …) | |
| Measured or estimated accuracy floor required | |
| Tier picked (frontier / mid / small — not a hardcoded model ID) | |
| Model ID pinned for this pass (date-stamped) | |
| Input $/MTok · Output $/MTok (date-stamped, source URL) | |
| Effort/reasoning level set explicitly? (Y/N — default is often `high`) | |
| Expected calls/day × avg tokens → est. $/day | |
| Cache-eligible? (stable system prompt/tools prefix present) | |
| Batch-eligible? (offline, no human in loop → flat 50% off) | |

## Cascade (fill in if this call-class is high-volume/low-complexity)

| Field | Fill in |
|---|---|
| Cheap-tier attempt first? (Y/N) | |
| Escalation trigger (verifier fail / confidence threshold / classifier) | |
| Escalation cap (hop limit — should be 1) | |
| Escalation logged? (Y/N) | |

## Fallback chain (fill in per call-class, ordered)

| Order | Provider/tier | Trigger | What the user sees if this hop is used |
|---|---|---|---|
| 1 (primary) | | — | Normal response |
| 2 | | | |
| 3 | | | |

- Same-tier-different-provider before same-provider-degraded-tier — confirm the order above
  follows this, not cost-only ordering.
- Every non-primary hop names what changes in the UX. Blank cells here mean a silent degradation —
  fix before ship.

## Open-vs-closed + self-host (fill in only if self-hosting is on the table)

| Question | Answer |
|---|---|
| Data residency or fine-tune ownership requiring self-host? | |
| Call volume where self-host GPU cost < API spend at this scale? | |
| Open-weight model considered | |
| License (verify against primary LICENSE file, not the marketing page) | |
| Commercial/resold context? If yes, license flag cleared? (Y/N) | |
| Who owns the serving substrate (vLLM/Ollama/gateway) — confirm this is a `backend`/`operate` handoff, not owned here | |

**Self-audit: ____ / 10 required fields above completed** (call-class + cascade sections; count
fallback-chain rows separately, ≥2 hops expected for anything user-facing). Anything left blank
must be either filled before ship or explicitly marked "not applicable" with a stated reason.
