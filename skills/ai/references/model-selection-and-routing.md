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
- A tier pick (not a hardcoded model ID) with a named fallback chain, justified by cost per
  success (`C/R`) on a private task set where the work is task-shaped.
- A cascade design for high-volume/low-complexity paths, or a stated reason to skip one.
- An effort/reasoning-level default per call class.
- An open/closed + license decision, flagged if the deployment is hosted/resold.
- A fillable pass: [model-selection-scorecard.md](../assets/model-selection-scorecard.md).

## Contents
- Provider/tier selection by price-per-intelligence
- Pick by cost-per-success, not $/MTok or leaderboard rank
- Routing cascade — the #1 cost lever
- Fallback & degradation — degrade honestly, never silently
- Effort/reasoning knobs
- Open vs closed + self-host, and the license spread

## Procedure

### 1. Provider/tier selection by price-per-intelligence
Every major provider ships 3–5 tiers whose output prices span **an order of magnitude or more**
between the top tier and the cheapest — read the actual spread off the live pricing page (on
Anthropic's models page, read 2026-10-17, it was ~40× flagship-to-fast and ~100× top-to-fast;
illustrative, re-verify). Pick by **price-per-intelligence for the task**, not by brand loyalty or "always
use the flagship."

The tier *structure* is stable; the specific model names, IDs, and prices churn monthly and **must
be re-fetched from the live pricing page before you quote them** — this is the fastest-moving fact
class in the skill, and the anti-staleness invariant applies in full. Re-check the live sources:
`platform.claude.com/docs/en/about-claude/models/overview`, OpenAI's pricing page,
`ai.google.dev/gemini-api/docs/pricing`, `docs.x.ai`.

Anchor to the tier shape, not memorized names: each lineup is a **top / flagship / mid / fast**
ladder (Anthropic's included), and OpenAI, Google, and xAI each publish the same flagship / mid /
small (often a nano) shape. Read the current names and IDs from the models page — this document
deliberately names none, because any it named would already be legacy. **Name the current model and confirm every price per provider on its
live page at build time** rather than trusting any snapshot, including this one.

> ⚠️ Do not copy a model/price table from memory or a stale doc into production. The decision shape
> — a spread of an order of magnitude or more from flagship to cheapest tier, pick the cheapest tier that clears the accuracy bar — is what
> transfers; the specific cells are illustrative and out of date the moment they're written. A
> "verified-live" claim frozen into a document is exactly the anti-pattern this skill teaches
> against: re-verification is a step you run, not a checkbox you inherit.

**Pin identity before you price or score.** A marketing nickname is not an API model ID, and
sibling lines with near-identical names (a Flash vs a Pro image line, a "-Max" API vs the
downloadable checkpoint of the same family) can differ several-fold in price and capability.
Resolve every candidate to the exact API ID (or the exact Hugging Face repo) first; never attach an
API twin's score to an open checkpoint, or a nickname's price to the ID you actually call.

### 1b. Pick by cost-per-success, not $/MTok or leaderboard rank
For agentic and task-shaped work the number to minimize is **cost per successful task**, measured
per **(model, harness, effort level)** — the same weights under a different agent harness or
effort setting are a different system. Record three numbers together:

| Symbol | What | Note |
|---|---|---|
| `R` | Resolve rate on a named task set (0–1) | Binary done/not-done; no partial credit unless defined up front |
| `C` | $ per attempt, all-in | Input + cache write/read + reasoning + output + tool fees — not $/MTok in isolation |
| `I` | An intelligence index | A **floor** (constraint), never the ranking key |

Derived: **cost per success = `C / R`** (minimize) and **tasks per dollar = `R / C`** (maximize).
Illustrative arithmetic: model A at `R=0.70`, `C=$0.40` costs $0.57 per success; model B at
`R=0.82`, `C=$2.20` costs $2.68 — B is "smarter" and resolves more, but A wins unless the extra 12%
of failures are catastrophic. Never rank on cost alone (a cheap model that fails 80% is expensive)
or on intelligence alone (you pay for unused headroom — the "intelligence tax" is the extra `C`
that buys no extra `R`).

The procedure, which keeps the anti-staleness invariant honest without re-running public suites on
every launch:
1. **Decide the task shape first** — repo repair, long shell work, multi-language edits, fresh
   algorithms, chat taste. Public scores do not transfer across shapes; read any published score
   through `evaluation.md` §8's checks.
2. **Filter on public boards that report $/task**, not raw % — e.g. the Artificial Analysis Coding
   Agent Index reports cost, tokens, and time *per task* by model and agent
   (artificialanalysis.ai/agents/coding-agents, checked 2026-10-17 — re-verify its columns).
3. **Decide on a private set**: freeze 10–20 real tasks from your own work, run them in the harness
   you actually ship, score binary, log the token bill, compute `C/R` on *your* distribution, and
   rotate 2–3 tasks each cycle so the winner can't memorize the set. Keep separate private sets
   per axis (e.g. a language-quality set never folds into a coding `R`).
4. **Keep a running Pareto**: drop from the default anything both costlier and worse than another
   candidate (the "kill zone").
5. **Cadence**: launch week → skim the boards, update the Pareto row, no private run; shortlist
   change → rerun the private set; quarterly → rotate tasks and re-run `evaluation.md` §8's
   still-trusted check on each board you filter with.

The private-set mechanics (binary judging, dataset shape) are `evaluation.md`'s; this section owns
using them to pick a model. Fill the cost-per-success block of
[model-selection-scorecard.md](../assets/model-selection-scorecard.md).

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

**Routing is seven decisions, not one** — a gateway picks provider and quota, not workflow, skill,
or safe action. Route and measure each:

| Decision | Start with | Failure to measure | Owned in |
|---|---|---|---|
| Workflow | Explicit intent categories | A write request routed into a generic chat path | `agent-construction.md` §2 |
| Model and effort | Tier aliases (fast / reasoning / judge) | A cheap attempt that costs a repair or drops a constraint | §1b–4 here |
| Tool discovery | Grant filter, then a small registry | Similar tools confused; an unavailable connector offered | `tool-and-mcp-integration.md` §1 |
| Skill | Metadata shortlist, then load the pick | Wrong or conflicting instructions, over-loading | `prompt-and-context-engineering.md` §4 |
| Retrieval | Exact SQL/API for state, hybrid search for documents | Semantic search inventing a precise state answer | `retrieval-and-rag.md` §4 |
| Delegation | One agent; explicit independent subtasks | Coordination cost exceeding the gain | `surface-multi-agent.md` |
| Review and repair | Deterministic validators, then selective model review | A reviewer agreeing with the mistake, or looping | `evaluation.md` §3 |

**Hard eligibility filters run before any learned router** — tenant grants, region, data policy,
modality, budget. A router narrows the eligible set, never grants; a confident classification is
not authorization. Decision-model endpoints (typed predicate/choice/
rubric answers; OpenAI's Decisions API was public beta when read 2026-10-17 — re-verify) fit intent,
tier, and skill routing, not tool arguments, which stay with function calling or structured output
(developers.openai.com/api/docs/guides/decisions). Wrap them in a swappable adapter with a
deterministic fallback, and count both calls' cost and latency when the fallback fires (Vercel AI
Gateway Decision docs, read 2026-10-17); calibrate thresholds per category on your
own traffic, ambiguous and out-of-distribution inputs included (RouteLLM README). Switching models
can miss the prompt cache — count it (Cursor router post, 2026-08-06). Rollout: `evaluation.md` §9.

**Image/video generation routes the same way, on a different meter:**
- Tier by how hard the output will be scrutinized (hero/brand asset → frontier tier; filler and
  drafts → cheap tier); read the price from the first-party page (aggregator and reseller rates
  drift).
- **Keep the billing unit** (per image, megapixel, or second) and compare at your exact settings —
  one model can bill per image on one host and per megapixel, rounded up, on another (`SOURCES.md`,
  read 2026-10-17). Price the ongoing case at the regular rate, never a promo.
- Report **$ per accepted asset**: total spend ÷ assets kept, rejected drafts and billed failures
  included.
- **Copy outputs into storage you own** before provider retention expires — the retention facts
  and the copy step are `backend`'s `service-integration.md` "Calling a third-party / AI /
  transactional-email service".
- Keep video opt-in per run — per-second billing makes one clip cost more than many stills — and
  give the run a spend ceiling.
- Drive a deterministic generation with a direct API call, not an agentic CLI (latency and
  nondeterminism for no judgment gained); set dimensions and duration through the API's
  parameters where they exist (e.g. OpenAI's image `size`) — prompt words are an unreliable
  substitute.

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
doesn't branch on vendor. Fallbacks stay inside the eligibility filters: record the resolved route
per run and fail closed when no allowed route remains. For
sustained failure, a circuit breaker (closed → open → half-open) stops hammering a down provider; hedged requests (fire a second call after a timeout, take
whichever returns first) trade cost for tail latency on latency-critical paths.

**The distinctive discipline**: when a fallback degrades quality, say so — never silently, never
as a hard error. Name what the user sees per degradation type (shorter answer, no citations,
"best effort" flag, queued-for-retry) rather than returning a worse answer indistinguishable from
a normal one. Before falling back, scrub the request against a per-model capability matrix
(vision/tools/JSON-mode/max-context) — the same matrix that gates routing also prevents sending
an unsupported param to the fallback model.

### 4. Effort/reasoning knobs
`effort`/reasoning-level parameters are a first-class cost lever, often cheaper and nearly as
capable as swapping to a smaller model — try lowering effort before downgrading tier. Availability
and defaults vary by provider and model and change release-to-release: some models default a
reasoning/`effort` parameter to a high setting, which is expensive for cost-sensitive batch work,
so **verify the current parameter name and default for your target model on its live docs page and
set it explicitly per call class** rather than assuming the default carries over from a previous
generation.

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
"open-source license" as two separate questions on every self-host decision; also read for
revenue- or MAU-gated clauses that require a separate deal above a threshold.

**Size a self-host box with four questions, in order:**
1. **Fits?** Weights ≈ parameter count × bytes per parameter at the chosen precision (16-bit ≈ 2
   bytes, so 7B ≈ 14 GB; 4-bit ≈ 0.5 byte plus quantization overhead), **plus the KV cache**, which
   grows with batch × sequence length (NVIDIA, developer.nvidia.com/blog/mastering-llm-techniques-
   inference-optimization/). For **MoE, memory follows the *total* parameter count** — every
   expert must be resident even though only the active ones compute per token (Hugging Face,
   huggingface.co/blog/moe: a Mixtral 8x7B needs VRAM for a dense ~47B model). Active params set
   per-token compute/speed, not the memory bill.
2. **Breathes?** Decode is memory-bandwidth-bound (same NVIDIA source), so capacity decides *fit*
   and bandwidth decides *tok/s* — a large-but-slow unified-memory box and a small-but-fast GPU
   answer different questions.
3. **Smart enough?** An open-weights intelligence filter, then the §1b private set on the exact
   checkpoint and quantization you will run — not the hosted API twin's score.
4. **Legal?** The license read above. And confirm the weights are actually downloadable — an
   "open weights soon" announcement or a hosted-only "open" model is not a self-host option, and
   downloadable is not the same as hostable when the model needs a rack — then call it as a hosted
   open-weight API: you keep the license terms and lose the ops burden.

Self-host `C` for §1b is (hardware amortization + power, idle included + ops time) ÷ tasks per
month. Shard one model across devices only for **capacity**: if it fits one GPU, distributed
inference is "probably unnecessary" (vLLM, docs.vllm.ai/en/latest/serving/parallelism_scaling.html)
— extra boxes for a model that fits add hops and idle watts, which lowers tasks per dollar.
**A shared prefix/KV cache is not tenant isolation**: latency differences can reveal another
user's cached content, which is why vLLM offers per-request cache salting so only requests with the
same salt reuse cached blocks (docs.vllm.ai/en/latest/design/prefix_caching.html, read 2026-10-17).
Decide here whether tenants may share a cache; the serving configuration is `backend`'s.

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
- Eligibility filters run before any learned router or decision model; every fallback route was
  itself evaluated.
- Media spend is reported per accepted asset, in the provider's billing unit, at the regular rate.
- Any open-weight model recommended for a commercial/resold context carries its license flag,
  Llama explicitly.
- Every $/MTok figure carries a date stamp and a re-verify pointer.
- Agentic/task-shaped picks report `R`, `C`, and `C/R` per (model, harness, effort) on a private
  set — not a leaderboard rank or a $/MTok comparison alone.
- Self-host sizing uses total params for MoE memory, includes the KV cache, and names whether
  tenants share a prefix cache.

## Failure modes and handoff
- **No fallback at all** — a single provider outage becomes a hard outage. Add one before ship.
- **Silent quality degradation** — a degraded-tier answer presented identically to a normal one.
  Surface it in the UX instead.
- **Unbounded escalation ladder** — cascades that keep climbing tiers without a cap; bound at one
  hop and log.
- **Route-everything-cheap** — no escalation path at all, quietly shipping wrong answers on hard
  inputs; pair every cascade with a verifier or eval gate (→ `evaluation.md`).
- **Max-intelligence by default** — the top-index model picked for batch or routine work pays
  the intelligence tax; pick the cheapest tier whose `R` clears the bar.
- **Hardware sized off active params** — an MoE that "only activates 13B" still needs memory for
  all of its experts.
- **Ask is really about telemetry, not the routing decision** — route to
  [observability-and-cost.md](observability-and-cost.md).
- **Ask is really about deploying the serving substrate** — route to `backend`/`operate`; this
  reference stops at the routing/fallback behavior.
