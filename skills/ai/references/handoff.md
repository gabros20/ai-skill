# Handoff

Purpose: Package a completed `ai` build (the harness, the eval results, the model/routing config,
any tool/retrieval contracts it depends on) so downstream skills can verify, deploy, serve, or code
against it without re-deriving what was decided, plus a compact `handoff.yaml` companion for
pipeline routing.

Read when:
- Finishing an `ai` build that `quality` is expected to independently verify, `operate` is expected
  to deploy/monitor, `backend` is expected to serve the substrate (endpoints/tools/vector store),
  `frontend` is expected to code the UI against, or `data` is expected to govern the dataset.
- Deciding whether this run should emit a machine-readable companion at all.

Skip when:
- The request is standalone with no downstream consumer in view ("improve this prompt," "pick a
  model for this call," "add a retrieval eval") — produce the harness/config/eval and stop; an
  unread `handoff.yaml` is clutter, not diligence.
- You need a specific job's own procedure — that's one of the 10 job references (`model-selection-
  and-routing.md`, `agent-construction.md`, `evaluation.md`, etc.) or a surface ref. This reference
  covers what happens after the system's cognition is decided, not how to design it.

Inputs: the completed harness/prompt spec, the eval suite and its results, the model/routing config,
any tool or retrieval contracts this build depends on or exposes, the upstream artifacts `ai` built
against when running inside a pipeline (architecture's NFR/threat model, backend's serving
contracts, data's dataset schema), and the decisions/assumptions/risks recorded while building.

Produces: a `handoff.yaml` companion beside the harness and eval results, filled from
[assets/handoff.yaml](../assets/handoff.yaml) — never a duplicate of the prompt text, eval traces,
or code.

## Contents
- Standalone vs pipeline
- What `ai` consumes
- What `ai` hands downstream
- The handoff.yaml template
- Per-consumer needs
- The seam discipline
- Validation
- Failure modes

## Standalone vs pipeline

`ai` runs in two modes, read from context, not a flag. **Standalone**: the request is self-contained
("write this prompt," "add a retrieval eval," "pick a routing cascade for this classifier") with no
downstream work named — deliver the harness, config, or eval and stop. **Pipeline**: the request or
an orchestrating controller names downstream work explicitly (`quality` verifies this, `backend`
serves the endpoints this agent calls, `operate` deploys and monitors it), or a multi-skill run is
already in motion — emit the `handoff.yaml` companion. Default to standalone; only emit the
companion when a downstream consumer is actually expected to read it.

## What `ai` consumes

When `architecture` has already run, `ai` designs cognition **inside** the decided shape rather than
re-deriving it:

| Artifact (from `architecture`) | What `ai` takes from it |
|---|---|
| Solution-architecture doc | the system shape/surface it's building cognition for, not implementation detail it re-litigates |
| NFR budgets | latency/cost/reliability targets the model/routing/eval design must meet |
| Threat model | which controls `ai`'s guardrails implement (vs which `quality` verifies independently — name the border, don't assume it) |
| Build-vs-buy decision on the AI subsystem | whether this is a from-scratch harness or wraps a managed/vendor agent service |

When `backend` or `data` have already run (or run in parallel), `ai` consumes their contracts rather
than inventing its own: tool/MCP endpoint schemas from `backend` (the agent's tool definitions must
match byte-for-byte, per `backend`'s `surface-agentic.md`), and vector-store/dataset schema from
`data` when retrieval is grounded in a governed pipeline. When none of these ran (fully standalone
`ai`), say so explicitly rather than inventing a contract to fill the gap.

## What `ai` hands downstream

`ai` hands distinct artifacts to five distinct consumers — **do not conflate them.**

| Artifact | Primary consumer | What they take from it |
|---|---|---|
| Harness spec (system prompt, tools available, context-management policy) + eval suite + eval results | `quality` | the starting point for *independent* verification — `quality` re-derives its own adversarial/red-team eval against the same task, it does not simply re-run `ai`'s eval suite and call that independent |
| Model/routing config, cost telemetry hooks, guardrail/approval-gate points | `operate` | what to deploy and monitor — dashboards/alerts on cost, latency, cache-hit rate, and guardrail trigger rate; `ai` instruments the hooks, `operate` owns the dashboard/alert/deploy pipeline |
| Tool/MCP contract the agent expects to call, any durable-execution requirement identified | `backend` | the endpoint/substrate to build or confirm — `ai` defines the contract shape and behavior, `backend` implements and serves it |
| The turn/streaming behavioral contract (what renders, when a tool call pauses the turn) | `frontend` | what to build the chat/agent UI against — `ai` defines the behavior, `frontend` codes the render |
| Vector-store schema and retrieval-freshness assumptions (when retrieval is grounded in a governed dataset) | `data` | what the ingestion pipeline must produce and keep current for `ai`'s retrieval behavior to hold |

Each consumer is a consumer, not a co-author: `ai` ships the harness, config, and eval suite; it does
not run the independent security scan, the production dashboard, the endpoint, the UI, or the
ingestion pipeline itself.

## The handoff.yaml template

`assets/handoff.yaml` is the fillable schema. Field meanings follow the same seam discipline as the
sibling `architecture` and `backend` skills' handoffs: only `objective` is required; every other
field may be empty, and a consumer must tolerate it absent rather than treat absence as a schema
violation. `artifacts_created` entries use `type` values: `harness`, `eval-suite`, `model-config`,
`tool-contract`, `retrieval-config`. `recommended_next` names the actual next skill(s) — `quality`,
`operate`, `backend`, `frontend`, `data` — never a vague "further work needed."

## Per-consumer needs

**`quality`** needs the harness spec and `ai`'s own eval results as a *starting point*, not a
substitute for independent verification — it re-derives its own adversarial/red-team pass against the
same task. **`operate`** needs the cost/latency/cache telemetry hooks and the model/routing config to
monitor against, not a re-explanation of the harness — a pointer to what's instrumented and what it
emits. **`backend`** needs the tool/MCP contract confirmed in its actually-implemented shape when
built in parallel — flag any deviation from what `ai` specified explicitly, don't let it surface as a
silent runtime schema mismatch. **`frontend`** needs the turn/streaming behavioral contract (when a
reply streams, when it pauses for a tool call, what a guardrail rejection looks like to the user).
**`data`** needs to know which vector-store schema and freshness cadence the retrieval behavior
assumes, when a governed pipeline populates the store `ai`'s retrieval design queries.

## The seam discipline

The harness, the eval suite, and their results are the real deliverable. `handoff.yaml` is a routing
index into them, never a copy. If a consumer needs more than the index gives, the harness/eval is
incomplete or under-documented — the yaml should not grow to compensate. Only `objective` is
required; every downstream skill must tolerate every other field absent.

## Validation

Before emitting: `objective` is one sentence and non-empty; every path in `artifacts_created`
resolves to a real harness spec/eval suite/config; `assumptions` and `risks` trace to entries
recorded during the build, not invented at handoff time; every `unresolved` item names an owner;
`recommended_next` names an actual sibling skill, not a vague call for more work; if a threat model
was consumed, the border between `ai`-implemented guardrails and `quality`-verified controls is
stated explicitly; every volatile fact (model name, price, SDK version) referenced from the harness
carries its date stamp and re-verify note, per this skill's anti-staleness invariant — don't let a
frozen model name or price slip into the handoff uncaveated.

## Failure modes

- **Duplicating the harness's prompt text or eval traces into handoff.yaml** — defeats its purpose
  as an index; keep it a pointer.
- **Emitting handoff.yaml in standalone mode** when nothing downstream will read it — skip it.
- **`status: complete` with a non-trivial `validation.remaining`** — use `partial` and say what's
  outstanding (e.g. "harness built, red-team pass not yet run").
- **Handing `quality` the same eval suite `ai` already ran and calling that independent
  verification** — `quality`'s value is a fresh, adversarial pass against the task, not a rerun.
- **The threat-model border line is missing** — `quality` doesn't know which guardrails `ai` already
  implemented versus which it must verify from scratch; name the border explicitly when a threat
  model was consumed.
- **A tool/MCP contract handed to `backend` without the exact schema** — the agent will generate
  calls that don't match what gets implemented; the contract must be byte-for-byte, not descriptive.
- **Silently invoking `quality`, `operate`, `backend`, `frontend`, or `data`** instead of naming it
  in `recommended_next` — the never-auto-invoke boundary rule from the main SKILL.md applies at the
  handoff seam too.
- **An `unresolved` item with no owner** — assign one or drop the item until it has one.
