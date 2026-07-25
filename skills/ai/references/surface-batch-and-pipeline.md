# Surface: Batch and pipeline

Purpose: Reshape the 10 primary-job refs for offline, at-scale work — classify/extract/tag/label
over N items with no human in the loop. **Cost-per-item is the central design axis** on this
surface in a way it isn't on any interactive surface.

Read when:
- "Classify/tag/extract N items," "run this over the whole dataset," "nightly batch job," or a
  pipeline step that calls a model to transform structured/unstructured data at scale.
- The request is really about throughput and unit economics ("this costs too much per item"), not
  answer quality on any single item.

Skip when:
- A human is present per item/turn — → [surface-chat-assistant.md](surface-chat-assistant.md).
- The batch job has no meaningful model-*behavior* decision inside it (moving files, scheduled SQL,
  a nightly export with no inference step) — that's `automation` entirely, not `ai`.
- The "batch" is actually a deterministic multi-step business process where a model call is one
  step among many non-model steps — the orchestration itself is `automation`'s; this surface owns
  only the model-call step's behavior (tier, schema, failure handling) inside it.

Inputs:
- Expected item volume and acceptable cost/item — decides the routing-cascade aggressiveness (§2).
- Whether items are truly independent, or some cross-item state/coordination is actually needed —
  state explicitly; cross-item coordination is a smell that the job isn't really "batch" (see
  [surface-multi-agent.md](surface-multi-agent.md) if it's real).
- Failure tolerance per item: does one bad output block the run, or does it fail independently and
  get flagged.

Produces:
- A cost-per-item budget with the routing-cascade and batch-API decisions that hit it.
- A schema-first output contract for every item.
- An offline/regression eval gate that runs before the batch ships, with no online-eval equivalent.

## Contents
- Job impact table
- Cost-per-item: the levers in order
- What NOT to build

## Procedure

### 1. Job impact table
| Job | How this surface bends it |
|---|---|
| [model-selection-and-routing.md](model-selection-and-routing.md) | Cheap-tier routing is the **default posture, not an exception** — most classify/extract work clears the accuracy bar on the cheapest tier. Cascade-with-verifier (cheap tier answers, a cheap verifier checks, escalate on fail — [model-selection-and-routing.md](model-selection-and-routing.md) §2) is the strategy this surface is built for. |
| [structured-outputs.md](structured-outputs.md) | Heavy, not a corner case — every item's output is a schema, generated at volume. Constrained decoding (token-guaranteed, needs logit access) fits self-hosted batch runs; reask/retry fits hosted-API batch calls. |
| [prompt-and-context-engineering.md](prompt-and-context-engineering.md) | No conversational history, no long-horizon compaction — context is one item at a time. The one carryover from interactive surfaces: cache the **shared instruction/schema prefix** across items (it's identical call to call) even though each item's content differs — this is where prompt caching pays off in batch, not per-item context management. |
| [agent-construction.md](agent-construction.md) | Usually not needed — batch is bulk single-call-per-item, not a multi-step loop. If a specific item genuinely needs multi-step tool use, that's a small autonomous-agent run composed *inside* one item's processing — name it explicitly rather than defaulting every item into a loop. |
| [memory.md](memory.md) | None, typically — items are independent by definition of this surface. Cross-item state is a signal the job isn't really batch; if it's real, see [surface-multi-agent.md](surface-multi-agent.md). |
| [evaluation.md](evaluation.md) | Offline/regression against a golden dataset is the **whole eval story** — there's no live user traffic to sample for online eval. CI-gate the run: resumable, idempotent regression suites (Inspect AI's `eval_set()` shape) fit better than a one-off offline check. |
| [guardrails-and-safety.md](guardrails-and-safety.md) | Fully automated — no approval-gate is available (no human in the loop). Classifier moderation plus schema validation on every output; failures surface as a **batch failure report** (which items failed, why), never an inline correction. |
| [observability-and-cost.md](observability-and-cost.md) | Throughput metrics are top-line: items/sec, **cost/item**, failure rate. Per-call latency, the dominant chat-surface metric, is secondary here. |
| [retrieval-and-rag.md](retrieval-and-rag.md) | Applies only if each item's processing needs corpus lookup (e.g., enrich each record against a knowledge base) — otherwise not in scope for this surface. |

### 2. Cost-per-item: the levers in order
Apply in this order, each compounding on the last:
1. **Routing cascade** (§1) — the highest-leverage lever, ahead of caching or batching (web-canon
   corpus §c). Send the item to the cheapest tier that clears the accuracy bar first.
2. **Batch API discount** — a flat **50% off** across Anthropic, OpenAI, and Google batch endpoints,
   the easiest and highest-confidence lever once volume justifies async processing (items don't need
   a synchronous response). Trades latency (batch APIs return on a delay, not real-time) for cost —
   only usable when nothing downstream needs the result immediately, which is definitionally true of
   this surface.
3. **Prompt caching on the shared prefix** — cache the instructions/schema that's identical across
   every item's call; this is a smaller win than caching in a long conversational context but still
   real at volume.
4. **Effort/reasoning-level floor** — most classify/extract tasks don't need a high reasoning
   effort; set it low explicitly rather than accepting a provider default tuned for harder tasks.
These four stack: cascade decides *which tier*, batch API decides *how it's billed*, caching and
effort trim what's left. Re-verify current batch-discount percentages and cache pricing against
provider pages before quoting a $/item figure downstream (see
[model-selection-and-routing.md](model-selection-and-routing.md) §1's re-verify note — it applies
here with more force, since batch runs amplify any pricing error by item count).

### 3. What NOT to build
Don't build a conversational memory system, a multi-step agent loop, or an online-eval pipeline for
a batch surface by default — none apply when items are independent and no human sees output in real
time. If a request for "batch processing" turns out to need cross-item coordination, multi-step
reasoning per item, or live human review, that's a signal the job has drifted off this surface —
name which surface actually fits (autonomous-agent, multi-agent, or chat-assistant) rather than
bending this one to cover it.

## Validation
- Every item's output is schema-validated before it's accepted, not spot-checked.
- The routing cascade is stated explicitly (which tier by default, what triggers escalation), not
  "just use the flagship for everything."
- Batch-API eligibility (can the result wait) is confirmed before assuming the 50% discount applies.
- A regression/offline eval suite runs and gates the batch before it ships — no batch run goes out
  on eval faith alone.
- Item independence is confirmed, or the cross-item coordination need is named and routed to
  [surface-multi-agent.md](surface-multi-agent.md).
- Cost/item and failure rate are tracked per run, not just aggregate spend.

## Failure modes and handoff
- **Every item routed to the flagship tier by default** — apply the cascade (§2.1) before accepting
  that cost.
- **No schema validation on output** — malformed items pass silently into downstream systems; gate
  every item against its schema.
- **A batch job that turns out to need cross-item state or multi-agent negotiation** — →
  [surface-multi-agent.md](surface-multi-agent.md); don't hand-roll coordination inside a
  supposedly-independent item loop.
- **The pipeline has no meaningful model-behavior decision** (pure data movement/scheduling) — →
  `automation`; this surface only owns the model-call step's behavior when one exists.
- **A "batch" job that actually needs a human per item** — → [surface-chat-assistant.md](surface-chat-assistant.md);
  this surface assumes no human in the loop.
