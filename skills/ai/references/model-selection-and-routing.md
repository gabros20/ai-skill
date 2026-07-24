# Model Selection & Routing

Purpose: Decide which model handles a given piece of work — provider/tier pick, the routing
cascade that sends easy work to cheap tiers, fallback when a call fails, the effort/reasoning
knob, and open-vs-closed + self-host — with the $ math and license implications named, not
assumed.

Read when:
- The request touches "which model should I use," a routing/cascade design, retry/fallback logic
  for a model call, an effort/reasoning-level choice, or open-weight vs closed-API + self-host.
- A cost or latency budget needs a concrete lever, not just "use a cheaper model."

Skip when:
- The ask is *how to emit* token/cost/cache telemetry once a model is chosen — →
  [observability-and-cost.md](observability-and-cost.md).
- The ask is the serving substrate itself — deploying vLLM/Ollama, standing up a gateway process,
  MCP endpoints, durable-execution infra — → `backend`/`operate`. This reference owns the
  *routing behavior*; it references the gateway/serving layer, it doesn't re-teach running one.
- The ask is prompt/context design once the model is picked — → `prompt-and-context-engineering.md`.
- The ask is validating output correctness — → `evaluation.md`.

Inputs:
- The task's actual intelligence requirement (classification/extraction vs open-ended reasoning)
  — state explicitly; most routing mistakes are guessing this rather than measuring it.
- Latency and cost budget per call, and expected call volume — decides cascade vs flat-flagship.
- Whether the deployment can self-host (data residency, ops capacity, GPU budget) or must call a
  hosted API.

Produces:
- A tier pick (not a hardcoded model ID) with a named fallback chain.
- A cascade design for high-volume/low-complexity paths, or a stated reason to skip one.
- An effort/reasoning-level default per call class.
- An open/closed + license decision, flagged if the deployment is hosted/resold.
- A fillable pass: [model-selection-scorecard.md](../assets/model-selection-scorecard.md).

## Contents
- Provider/tier selection by price-per-intelligence
- Routing cascade — the #1 cost lever
- Fallback & degradation — degrade honestly, never silently
- Effort/reasoning knobs
- Open vs closed + self-host, and the license spread

## Procedure

### 1. Provider/tier selection by price-per-intelligence
Every major provider ships 3–5 tiers spanning roughly a 5–10× output-price gap between flagship
and cheapest tier (web-canon-corpus §c). Pick by **price-per-intelligence for the task**, not by
brand loyalty or "always use the flagship." Modal frontier lineup, **version-dated, re-verify
before quoting** (pricing pages churn monthly — re-check `platform.claude.com/docs/en/about-claude/models/overview`,
`developers.openai.com/api/docs/pricing`, `ai.google.dev/gemini-api/docs/pricing`,
`docs.x.ai` before publishing any $ figure downstream):

| Provider | Flagship (as of 2026-07-25) | ID | Input $/MTok | Output $/MTok |
|---|---|---|---|---|
| Anthropic (top) | Claude Fable 5 | `claude-fable-5` | $10 | $50 |
| Anthropic (flagship) | Claude Opus 5 | `claude-opus-5` | $5 | $25 |
| Anthropic (mid) | Claude Sonnet 5 | `claude-sonnet-5` | $3 (intro $2 through 2026-08-31) | $15 (intro $10) |
| Anthropic (fast) | Claude Haiku 4.5 | `claude-haiku-4-5` | $1 | $5 |
| OpenAI | GPT-5.6 Sol / Terra / Luna | `gpt-5.6-sol`/`-terra`/`-luna` | $5 / $2.50 / $1 | $30 / $15 / $6 |
| Google | Gemini 2.5 Pro / 3.6 Flash | `gemini-2.5-pro`/`gemini-3.6-flash` | $1.25–2.50 / $1.50 | $10–15 / $7.50 |
| xAI | Grok 4.5 | `grok-4.5` | $2 (<200k ctx) | $6 (<200k ctx) |

Spot-checked live 2026-07-25 against Anthropic's models-overview page: table confirmed accurate,
plus one detail worth carrying — Claude Opus 5 and Sonnet 5 default the `effort` param to `high`
on the API and Claude Code (see §4). Anthropic pricing source: (Anthropic models overview,
platform.claude.com/docs/en/about-claude/models/overview); OpenAI/Google/xAI per web-canon-corpus §c.
**Never freeze these numbers in a downstream doc without a re-verify note** — this is the
fastest-churning fact class in the whole skill.

### 2. Routing cascade — the #1 cost lever
Send classification/extraction/routing-decision work to the cheapest tier that clears the
accuracy bar; reserve the flagship for genuinely open-ended reasoning. This is the highest-
leverage cost lever, ahead of caching and batching (web-canon-corpus §c) — apply it first.

Model the abstraction as **tiers (frontier/mid/small), not hardcoded model IDs** — tier names
survive a model-generation bump, hardcoded IDs don't. Five routing strategies, cheapest-to-most-
sophisticated:

| Strategy | How | Use when |
|---|---|---|
| Task-kind static table | Map task type → tier, fixed at design time | Task types are known and stable |
| Difficulty estimation from cheap signals | Input length/structure/keyword heuristics pick the tier | Signal is cheap and correlates with difficulty |
| Classifier/router model | A small model classifies then dispatches | Task mix is heterogeneous, worth the extra call |
| Cascade-with-verifier | Cheap tier answers; a cheap verifier checks; escalate on fail | Correctness matters more than one extra round-trip |
| Capability-based gating | Route by required capability (vision/tools/context length), not difficulty | The failure mode is "wrong tool," not "too hard" |

Bound escalation: cap depth at one hop (cheap → flagship, not a ladder), and log every escalation
— an unbounded escalation ladder and a cascade that silently never escalates are both named
failure modes in practitioner routing guidance (skills-corpus, jpoindexter donor, paraphrased —
no verbatim lift, source has no declared license).

### 3. Fallback & degradation — degrade honestly, never silently
**Routing and fallback are different problems**: routing picks the right tier for the task up
front; fallback recovers when the *chosen* call fails. Routing without fallback is a single point
of failure; fallback without routing burns money retrying everything at flagship tier (paraphrased
from skills-corpus jpoindexter donor — concept only, source unlicensed).

Classify errors before deciding retry policy:

| Error class | Retryable? | Action |
|---|---|---|
| 429 rate limit | Yes | Backoff with full jitter, respect `Retry-After` |
| 5xx server error | Yes | Backoff with full jitter, bounded attempts |
| Timeout | Yes, cautiously | Check for partial side effects (tool calls) before retrying |
| 400 bad request | No | Fix the request; retrying repeats the bug |
| 401/403 auth | No | Credential/config issue, surface immediately |
| Content-filter block | No (same input) | Route to a different provider/tier, or degrade UX |

Fallback **order is policy**: prefer same-tier-different-provider before same-provider-degraded-
tier — a degraded-tier answer that looks identical to the user is worse than an equal-quality
answer from a second provider. Wrap multi-provider calls behind one interface so the caller
doesn't branch on vendor. For sustained failure, a circuit breaker (closed → open → half-open)
stops hammering a down provider; hedged requests (fire a second call after a timeout, take
whichever returns first) trade cost for tail latency on latency-critical paths.

**The distinctive discipline**: when a fallback degrades quality, say so — never silently, never
as a hard error. Name what the user sees per degradation type (shorter answer, no citations,
"best effort" flag, queued-for-retry) rather than returning a worse answer indistinguishable from
a normal one. Before falling back, scrub the request against a per-model capability matrix
(vision/tools/JSON-mode/max-context) — the same matrix that gates routing also prevents sending
an unsupported param to the fallback model.

### 4. Effort/reasoning knobs
`effort`/reasoning-level parameters are a first-class cost lever, often cheaper and nearly as
capable as swapping to a smaller model — try lowering effort before downgrading tier (web-canon-
corpus §c). Confirmed live 2026-07-25: on Claude Opus 5 and Sonnet 5, `effort` defaults to `high`
on the Claude API and Claude Code — set it explicitly per call class rather than accepting the
default for cost-sensitive batch work (Anthropic models overview, platform.claude.com). Re-verify
the current default per model before relying on it; defaults have changed release-to-release.

### 5. Open vs closed + self-host, and the license spread
Self-host when data residency, fine-tune ownership, or call volume make the ops/GPU cost cheaper
than API spend at scale; call a hosted API by default otherwise — self-hosting trades a $/token
line item for an ops burden (serving substrate, scaling, model updates), which is a `backend`/
`operate` decision this reference references but doesn't own.

**Open ≠ open-source license** — the single most decision-changing, under-taught fact in this
space. Verify against the primary LICENSE file before a commercial claim; open-weight flagships,
version-dated (as of 2026-07-25, HF model cards — re-verify, these version-bump monthly):

| Family | Flagship | License | Commercial use |
|---|---|---|---|
| Alibaba Qwen | Qwen3.6-35B-A3B / Qwen3.5-397B-A17B | Apache 2.0 | Unrestricted |
| DeepSeek | DeepSeek-V4-Pro | MIT | Unrestricted |
| Mistral | Mistral-Large-3 | Apache 2.0 | Unrestricted |
| Zhipu/Z.ai | GLM-5.2 | MIT | Unrestricted |
| Moonshot | Kimi K2.6 / K2.7-Code | Modified MIT | Verify exact clause before reselling |
| Meta Llama | Llama 4 Maverick/Scout | **Llama Community License** | **Use-restricted, not OSI-approved** — check the field-of-use and >700M-MAU clauses before a commercial deployment |

Qwen/DeepSeek/Mistral/GLM are genuinely permissive (MIT/Apache); Llama is the outlier — a custom
license gating certain commercial uses, not a standard open-source grant. Treat "open-weight" and
"open-source license" as two separate questions on every self-host decision. VRAM scales with
**active** params × quantization for MoE architectures, not total param count — don't size
hardware off the headline parameter count.

**Border**: the serving substrate that runs a self-hosted or gateway-routed model (vLLM/Ollama,
litellm/Portkey/vercel-ai gateways, MCP endpoints) is `backend`/`operate` territory — this
reference owns the routing/fallback *behavior*; it points at the gateway rather than re-teaching
how to deploy one.

## Validation
- Every model reference in downstream output names a tier, not a hardcoded ID, unless the ID
  itself is the point (a pinned snapshot for reproducibility).
- A cascade exists for any high-volume classification/extraction path, or its absence is a stated
  choice, not an oversight.
- Every fallback path is classified (retryable vs not) and ordered (same-tier-different-provider
  before same-provider-degraded-tier).
- No degradation reaches the user silently — the UX names what changed.
- Any open-weight model recommended for a commercial/resold context carries its license flag,
  Llama explicitly.
- Every $/MTok figure carries a date stamp and a re-verify pointer.

## Failure modes and handoff
- **No fallback at all** — a single provider outage becomes a hard outage. Add one before ship.
- **Silent quality degradation** — a degraded-tier answer presented identically to a normal one.
  Surface it in the UX instead.
- **Unbounded escalation ladder** — cascades that keep climbing tiers without a cap; bound at one
  hop and log.
- **Route-everything-cheap** — no escalation path at all, quietly shipping wrong answers on hard
  inputs; pair every cascade with a verifier or eval gate (→ `evaluation.md`).
- **Ask is really about telemetry, not the routing decision** — route to
  [observability-and-cost.md](observability-and-cost.md).
- **Ask is really about deploying the serving substrate** — route to `backend`/`operate`; this
  reference stops at the routing/fallback behavior.
