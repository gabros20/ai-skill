# Observability & Cost

Purpose: Instrument model calls with a vendor-neutral trace/span vocabulary, decide the token/
cost/cache telemetry that actually predicts spend, wire online evals as production monitors, and
pick an observability platform with its license implications named.

Read when:
- The request touches "how do I trace/instrument LLM calls," a cost dashboard, cache-hit-rate
  tracking, choosing between an SDK-instrumentation and a gateway-proxy adoption path, or an
  observability-platform license question (self-host/resell context).
- Production evals or monitors need wiring against live traffic, not a curated dataset.

Skip when:
- The ask is *deciding* which model/tier to call — → [model-selection-and-routing.md](model-selection-and-routing.md).
- The ask is offline/regression eval design or judge construction — → `evaluation.md` (online
  evals as production monitors are covered here; the judge/harness itself lives there — single-
  home, don't duplicate).
- The ask is deploying the observability platform itself, incident response, or SLOs — →
  `operate`. This reference owns the AI-specific telemetry *semantics*; it references the
  platform, it doesn't re-teach running one.
- The ask is a general APM/logging setup with no model-specific telemetry — → `backend`.

Inputs:
- Whether instrumentation is greenfield (pick SDK-instrument vs gateway-proxy) or must plug into
  an existing OTel pipeline (Datadog/Honeycomb/Grafana already in place).
- The cost questions that actually matter: per-request $, per-user/per-feature $, cache-hit-rate,
  not just raw token counts.
- Self-host vs managed-cloud for the observability platform — decides which license clause bites.

Produces:
- A trace/span emission shape using `gen_ai.*` OTel fields.
- A cache-hit-rate-first design note on any new agent/chat feature.
- An online-eval-as-monitor wiring point (references `evaluation.md` for the judge itself).
- A platform pick with its license flagged.
- A fillable audit: [otel-genai-observability-checklist.md](../assets/otel-genai-observability-checklist.md).

## Contents
- OTel-GenAI semantic conventions — the vendor-neutral base
- Trace/span vocabulary
- Token/cost/cache telemetry
- Cost governance — batch, caps, and Jevons
- Platform pick and license flags

## Procedure

### 1. OTel-GenAI semantic conventions — the vendor-neutral base
Instrument against the **OpenTelemetry GenAI semantic conventions** (`gen_ai.*`), not a
proprietary schema — this is now first-party OTel, not one vendor's opinion. OpenLLMetry's
semconv was upstreamed directly into official OpenTelemetry as the GenAI working group's output
(github-corpus §b/c, traceloop/openllmetry, Apache-2.0); Arize Phoenix runs on OpenInference, a
parallel/complementary OTel-based semconv. Emit through an OTel-GenAI-compliant instrumentation
layer and treat the *platform* (Langfuse/Phoenix/Helicone/Datadog/Honeycomb/…) as a swappable
destination downstream of the emission format — decoupling emission from platform is the whole
point of standardizing on OTel here.

Core field vocabulary (elastic/agent-skills donor, Apache-2.0, grounded in the OTel GenAI spec —
skills-corpus):

| Field | Meaning |
|---|---|
| `gen_ai.operation.name` | The operation kind (chat, embeddings, tool-call, …) |
| `gen_ai.provider.name` | Provider (anthropic, openai, google, …) |
| `gen_ai.request.model` / `gen_ai.response.model` | Requested vs actually-served model ID |
| `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens` | Token counts, the cost primitive |
| `gen_ai.request.temperature` / `gen_ai.request.max_tokens` | Request-shape params |
| `error.type` | Standard OTel error taxonomy applied to the call |
| `gen_ai.conversation.id` | Ties spans back to a conversation/session |
| `gen_ai.response.finish_reasons` | Why generation stopped — feeds quality/safety correlation |

**Cost is explicitly not in the OTel spec** — instrumentations add custom attributes for it (e.g.
`llm.response.cost.usd_estimate`); expect to discover the exact field name per instrumentation
rather than assume a standard one (skills-corpus, elastic donor).

### 2. Trace/span vocabulary
Standardize on **trace = one request lifecycle; span/observation = one nested operation** (an LLM
call, a retrieval step, a tool call) carrying timing + tokens + cost + I/O (web-canon-corpus §b,
Langfuse tracing docs, langfuse.com/docs/tracing) — this aligns with LangSmith's runs/threads and
Braintrust's "Instrument" terminology, so the vocabulary transfers across platforms. A finer
hierarchy worth adopting for chat products specifically: **Session → Trace → {Generation, Span}**
— a Session is one conversation (distinct from a generic product-analytics "session" = one site
visit), a Trace is one request lifecycle within it, a Generation is the LLM call itself
(skills-corpus, posthog donor, concept only — no verbatim lift, source unlicensed).

For agentic/multi-step systems, reconstruct the orchestration chain from `trace.id` plus parent/
child span relationships — root span → multiple LLM/tool-call child spans — rather than treating
each call as an independent event; this is what makes a trace viewer show the actual agent
decision path, not just a flat call log (skills-corpus, elastic donor).

### 3. Token/cost/cache telemetry
**Caching is architecture, not a tuning knob — design for cache-hit-rate first**, from the first
line of the harness (x-corpus, @trq212, @0xSero — minimalist agent-loop authors explicitly
optimize prompt structure for cache-hit rate as a primary design constraint). Concretely: hold the
system prompt and tool definitions stable and prefix-stable across calls, put volatile content
(user turn, retrieved context) after the stable prefix, and track cache-hit-rate as a first-class
dashboard metric alongside latency and $ — a low hit rate on a chat/agent product is usually a
prompt-structure bug, not a caching-infra problem. Provider caching economics differ and must be
tracked per-provider: Anthropic's 5-min-write (1.25×) vs 1-hr-write (2×) vs cached-read (0.1×);
OpenAI's write-premium + 30-min TTL requiring `prompt_cache_key` (web-canon-corpus §c) — emit
cache-write vs cache-read token counts as separate fields, not a single blended token count, or
the cost dashboard will misattribute spend.

### 4. Cost governance — batch, caps, and Jevons
- **Batch APIs**: flat **50% off** across Anthropic/OpenAI/Google (web-canon-corpus §c) — the
  easiest lever for any offline/no-human-in-loop workload (→ `surface-batch-and-pipeline`). Apply
  the lever order: routing cascade first (model-selection-and-routing.md §2), then caching, then
  batch — cascade changes which model runs, caching changes what you pay for a repeated prefix,
  batch changes the price of what's left.
- **Online evals as production monitors**: run the same judge/critique infrastructure built for
  offline eval against live traffic continuously — this turns eval infra into a monitoring signal,
  not a one-time gate (web-canon-corpus §b; github-corpus §c, Langfuse/deepeval `@observe()`
  pattern). The judge construction itself is `evaluation.md`'s job; this reference owns wiring it
  to run continuously and feeding results into the same dashboard as cost/latency.
- **Per-seat/per-org spend caps** are entering production practice directly — Uber reportedly caps
  coding-agent spend at **$1,500/month per employee per tool** (x-corpus, @simonw); platform-level
  caps (`max_total_tokens`, free-tier ceilings) are shipping as first-class product features
  (x-corpus, @_philschmid, Gemini Managed Agents). Budget at the org/feature level, not just
  per-call.
- **Jevons paradox — cheaper tokens don't mean lower total spend.** Efficiency gains expand usage,
  which expands aggregate cost (x-corpus, @swyx) — treat "we made it cheaper per call" as a
  forecast-revision trigger for total budget, not a cost-reduction win to bank uncritically.

### 5. Platform pick and license flags
Two adoption sub-patterns, pick by integration constraint: **SDK-instrumentation-first**
(Langfuse, Phoenix — instrument in-process, richest control over spans) vs **gateway/proxy-first**
(Helicone — point `baseURL` at the gateway, zero code instrumentation, fastest to adopt on an
existing codebase) (github-corpus §b). Teach the license *pattern*, not a winner — verify current
terms before a hard claim in a hosted/resold context:

| Platform | License | Flag |
|---|---|---|
| Langfuse | Open-core (root MIT, `ee/` commercial) | Self-host free; enterprise features are a separate commercial license, not OSS |
| Arize Phoenix | Elastic License 2.0 + patent notice | **Highest-severity flag in this cluster** — may not be offered to third parties as a hosted/managed service; carries active patent-litigation license-termination clauses |
| BerriAI litellm (gateway) | Open-core (MIT + `enterprise/`) | Dev/test free; production use of `enterprise/` needs a paid subscription |
| Helicone | Apache-2.0 | Clean, no resale restriction |
| OpenLLMetry (instrumentation layer) | Apache-2.0 | Clean — the emission layer, not a platform |

The shared shape across the open-core/source-available cluster: self-host yes, resell the
platform itself as a competing managed service usually no — read the exact clause before a
hosted-offering decision, the same discipline `backend`'s DB-license teaching applies to database
products.

## Validation
- Every LLM span carries `gen_ai.operation.name`, `gen_ai.request.model`/`response.model`, and
  input/output token counts at minimum.
- Cache-write and cache-read tokens are tracked as separate fields, not blended.
- Cache-hit-rate appears on the same dashboard as cost and latency, not omitted.
- A per-org or per-feature spend cap exists, or its absence is a stated choice.
- Any observability platform picked for a hosted/resold context carries its license flag verified
  against the primary LICENSE file, not the marketing page.
- Online-eval wiring points at `evaluation.md`'s judge, not a re-implemented one.

## Failure modes and handoff
- **Token count without cost attribution** — dashboards that show tokens but never $/feature or
  $/user; add the cost field before shipping the dashboard.
- **Blended cache tokens** — cache-write and cache-read counted together, hiding whether caching
  is even working; split them.
- **Ask is really about which model to route to** — route to
  [model-selection-and-routing.md](model-selection-and-routing.md).
- **Ask is really about building the judge/eval harness** — route to `evaluation.md`; this
  reference only covers running it online as a monitor.
- **Ask is deploying the platform itself, not the telemetry semantics** — route to `operate`.
- **Phoenix or another Elastic-License/BSL/SSPL platform is being considered for a hosted resale
  offering** — stop and surface the conflict before proceeding.
