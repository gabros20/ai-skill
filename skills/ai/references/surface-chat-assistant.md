# Surface: Chat assistant

Purpose: Reshape the 9 primary-job refs for an interactive, turn-taking system with a human present
at every turn — the **default surface** when no other shape is named. Does not redefine the job
refs; states which knobs each turns when the caller is a person in a live conversation, not a batch
job or an unattended agent.

Read when:
- The request is a chatbot, support assistant, copilot side-panel, or any "talk to it" interface.
- No other surface is named and the system takes turns with a human — start here by default.

Skip when:
- The system runs many steps without a human present at each one (crash-survivable, long-horizon,
  tool-heavy) — → [surface-autonomous-agent.md](surface-autonomous-agent.md).
- Grounded retrieval/citations over a knowledge base is the point of the product, not one feature
  among several — → [surface-rag-app.md](surface-rag-app.md) (compose the two when a chat UI fronts
  a retrieval-centric app).
- There's no human turn at all — offline classify/extract at scale — →
  [surface-batch-and-pipeline.md](surface-batch-and-pipeline.md).
- The request is about the message list, input box, or streaming render itself — → `frontend`; this
  surface owns the turn loop behind it, not the pixels.

Inputs:
- Per-turn latency budget (state it — "snappy chat" and "thorough analysis" imply different tier/
  effort defaults).
- Whether replies stream token-by-token and whether the turn can be interrupted mid-stream.
- Memory scope: session-only, or does the assistant need to recall across sessions — state
  explicitly, don't default to cross-session persistence.

Produces:
- A turn-loop design: default single-call-plus-retrieval, with an explicit trigger for when to
  escalate to a tool-using loop.
- A conversational-memory policy (what's kept verbatim, what's summarized, what's dropped).
- A latency-first model/effort pick, and an online-eval plan against live traffic.

## Contents
- Start simplest — the load-bearing default
- Job impact table
- Streaming and the human-in-the-loop border
- What NOT to build

## Procedure

### 1. Start simplest — the load-bearing default for this surface
Anthropic's canonical framing (Building Effective AI Agents, 2024-12-19,
anthropic.com/engineering/building-effective-agents): begin with the simplest solution — a single
model call, optionally with retrieval or well-chosen examples — and add agentic autonomy only when
the task's steps genuinely can't be predefined. Chat assistants are the surface where this bites
hardest because the temptation to reach for a tool-calling loop on turn one is constant. Concretely:
a chat turn is a **while-loop candidate, not a default while-loop** — most turns resolve in one call;
escalate to [agent-construction.md](agent-construction.md)'s loop only for the subset of turns that
need multi-step tool use, and keep those turns short (the human is the natural checkpoint, so don't
build long-horizon machinery this surface doesn't need — that's
[surface-autonomous-agent.md](surface-autonomous-agent.md)'s problem).

The cost case for staying simple is concrete: agentic turns run **~4× the tokens of a plain chat
interaction**, and multi-agent turns run **~15×** (Anthropic, "How we built our multi-agent research
system," 2025-06-13, anthropic.com/engineering/multi-agent-research-system) — a chat surface that
defaults to the loop pays that multiplier on every single-question turn that didn't need it.

### 2. Job impact table
| Job | How this surface bends it |
|---|---|
| [model-selection-and-routing.md](model-selection-and-routing.md) | Latency-first tier pick; dial `effort` down for snappy turns, up only for the subset that needs deep reasoning. Cascade is lower-priority here than in batch — interactive volume per session is small; a fallback chain for mid-turn failure matters more than a cost cascade. |
| [prompt-and-context-engineering.md](prompt-and-context-engineering.md) | Conversation history *is* the primary context. Compact/summarize only once the transcript nears the attention budget (long-running sessions) — lighter-touch than the autonomous-agent surface, where compaction is a constant, structural concern. |
| [structured-outputs.md](structured-outputs.md) | Only the tool-call payload is schema-constrained; the visible reply stays natural language unless the product explicitly renders structured cards. |
| [agent-construction.md](agent-construction.md) | Optional, not default (§1). When used, keep the loop short — a handful of tool calls per turn, not an unattended run. |
| [retrieval-and-rag.md](retrieval-and-rag.md) | On-demand, per-turn retrieval when the question needs it. If grounding/citations are the product's whole point, compose with [surface-rag-app.md](surface-rag-app.md) instead of treating retrieval as incidental here. |
| [memory.md](memory.md) | Session-scoped by default. Cross-session memory is opt-in and must be stated explicitly — don't silently persist what a user said in one conversation into the next. |
| [evaluation.md](evaluation.md) | **Online eval on live traffic** (thumbs-up/down, session completion, escalation rate) is the natural fit for this surface — a human rates every turn already. Still gate releases on an offline regression suite; online eval alone isn't sufficient before ship. |
| [guardrails-and-safety.md](guardrails-and-safety.md) | Prompt self-verification (cheapest layer) is often sufficient because the human catches residual errors in real time — a materially lighter posture than the autonomous-agent surface's mandatory approval-gate. Still classifier-moderate untrusted input on ingress. |
| [observability-and-cost.md](observability-and-cost.md) | Track per-session token/cost, and make **time-to-first-token + tokens/sec** a top-line metric — perceived latency is this surface's defining constraint in a way it isn't for batch or autonomous runs. |

### 3. Streaming and the human-in-the-loop border
**Border:** the chat UI, message list, input affordances, and the actual token-by-token render are
`frontend`'s (SSE-vs-WebSocket transport choice lives in backend's `surface-realtime`). This surface
owns *what* gets streamed and *when* the turn pauses for a tool call or clarifying question — the
behavioral contract frontend renders, not the rendering itself. State this split explicitly when a
request blurs "make the chat feel responsive" (this surface + prompt/context design) with "fix the
streaming connection" (frontend/backend transport).

### 4. What NOT to build
Don't stand up a multi-agent orchestrator, a durable-execution engine, or a persistent cross-session
memory store for a chat assistant by default — each is a real cost (§1's token multiplier, an ops
surface, a data-retention decision) that only pays for itself once the single-call-plus-retrieval
default demonstrably fails the task. Add exactly the piece that's failing, verified against an eval
(§2's online-eval row), not preemptively.

## Validation
- The default turn path is a single call (optionally with retrieval); the agent-loop escalation
  trigger is named, not assumed.
- Latency budget and `effort` default are stated per turn class, not left at provider defaults.
- Conversational-memory scope (session vs cross-session) is explicit.
- An online-eval signal (feedback, completion, escalation rate) feeds the regression suite, not just
  a one-off offline eval.
- The chat-UI/streaming-render border is named when the request touches both this surface and
  `frontend`.

## Failure modes and handoff
- **Reaching for an agent loop or multi-agent orchestrator on turn one** — start with the single
  call; escalate only against a stated failure (§1, §4).
- **Cross-session memory persisted without being asked for** — state the scope explicitly before
  building it (→ [memory.md](memory.md)).
- **The real ask is the streaming transport or message-list UI** — → `frontend`; this surface stops
  at the turn-loop behavior.
- **The real ask is unattended multi-step work** (no human present each turn) — →
  [surface-autonomous-agent.md](surface-autonomous-agent.md).
- **Grounding/citations are the actual product**, not a per-turn convenience — →
  [surface-rag-app.md](surface-rag-app.md).
