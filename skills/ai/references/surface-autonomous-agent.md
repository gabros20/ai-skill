# Surface: Autonomous agent

Purpose: Reshape the 9 primary-job refs for a system that runs many steps without a human present
at each one — the long-horizon harness: loop + tools + context compaction + durable execution +
termination. This is where prompt/context engineering and agent construction bend hardest of any
surface.

Read when:
- The system takes many tool-calling steps unattended: coding agents, research agents, ops
  automation, "kick it off and check back later."
- The request names "agent," "autonomous," "long-running," or describes a task whose step sequence
  can't be predefined up front.

Skip when:
- A single call plus retrieval already solves it — → [surface-chat-assistant.md](surface-chat-assistant.md)
  and its "start simplest" default; don't reach for this surface's machinery reflexively.
- The task is a deterministic multi-step business process where a model call is one step, not the
  organizing principle — → `automation`.
- The point of the system is grounded retrieval, not autonomy — → [surface-rag-app.md](surface-rag-app.md)
  (its agentic-decomposition layer is not the same thing as this surface's long-horizon loop; compose
  the two only when the agent does more than retrieve-and-answer).
- Multiple agents with distinct roles coordinate — layer
  [surface-multi-agent.md](surface-multi-agent.md) on top of this surface, don't re-derive
  coordination here.

Inputs:
- Whether the run can span more than one request/response cycle and must survive a crash/restart —
  decides the durable-execution border (§4).
- The termination condition: fixed step budget, goal-check, cost cap, or human-callback — state it
  explicitly; "run until it stops" is not a termination condition.
- What privileged/destructive actions the agent may take unattended vs must pause for approval.

Produces:
- A loop design with a stated stop condition and a durability story (or an explicit reason it's
  out of scope).
- A context-compaction policy for when the transcript exceeds the attention budget.
- A harness-hygiene plan: what gets pruned, and on what cadence (model upgrades, at minimum).
- An approval-gate map for privileged actions.

## Contents
- Job impact table
- Context compaction — the central bend
- Harness hygiene: prune, don't only add
- The durable-execution border

## Procedure

### 1. Job impact table
| Job | How this surface bends it |
|---|---|
| [agent-construction.md](agent-construction.md) | The loop itself — model-call → tool-exec → feed-result → repeat → stop — is this surface's spine. Termination and launch/pause/resume (12-Factor Agents #6, "own your control flow," github.com/humanlayer/12-factor-agents) are load-bearing here in a way they aren't for a chat turn. |
| [prompt-and-context-engineering.md](prompt-and-context-engineering.md) | **Central bend (§2)**: context accumulates every step, so compaction, structured note-taking, and sub-agent context isolation move from optional to structural (Anthropic, "Effective Context Engineering for AI Agents," 2025-09-29, anthropic.com/engineering/effective-context-engineering-for-ai-agents). |
| [model-selection-and-routing.md](model-selection-and-routing.md) | A long run makes many sub-calls of varying difficulty — route each step by its own complexity (cascade-with-verifier fits well) rather than pinning the whole run to one tier. Budget for the run's aggregate token cost, not one call's. |
| [structured-outputs.md](structured-outputs.md) | Tool-call arguments are schema-constrained on every step, not just at the edges — a malformed call mid-run wastes an entire step, not one turn. |
| [retrieval-and-rag.md](retrieval-and-rag.md) | Retrieval becomes one tool among several the loop can invoke on demand (just-in-time, not upfront-stuffed) rather than a fixed per-turn step. |
| [memory.md](memory.md) | Episodic memory (this run's own history) and procedural memory (notes/skills learned and reused) matter more here than a chat surface's session memory — self-editing memory-block patterns (Letta/MemGPT) and structured note-taking both target this surface. |
| [evaluation.md](evaluation.md) | Offline + regression harnesses (Task/Solver/Scorer shape, e.g. Inspect AI) fit better than online eval — there's no live human rating each step. Use agentic-eval metrics (tool-call correctness, task completion, step efficiency), and report **pass^k** (all k trials succeed) as the production-reliability number, not pass@k. |
| [guardrails-and-safety.md](guardrails-and-safety.md) | **Approval-gate is the default posture**, not the lighter self-verification a synchronous chat surface can lean on — no human is watching every step. HITL interrupt patterns (LangGraph human-in-the-loop) gate privileged/destructive actions specifically. |
| [observability-and-cost.md](observability-and-cost.md) | Track run-level aggregates (total steps, total cost, wall-clock duration, escalation count) alongside per-step traces — a single "session" now spans many spans, and the run's own termination behavior is itself a metric to watch (did it stop when it should have). |

### 2. Context compaction — the central bend
Every step of an autonomous run adds to the transcript; unmanaged, this hits the model's attention
budget and degrades ("context rot" from the O(n²) cost of attending over a growing history —
Anthropic, cited above). The toolkit, in order of first resort:
- **Just-in-time retrieval** — keep lightweight references (IDs, file paths) in context and load
  full content only at the point of use, rather than front-loading everything a run might need.
- **Compaction** — periodically summarize the older portion of the transcript into a condensed form
  and drop the verbatim history, preserving decisions/state, not narrative.
- **Structured note-taking** — write durable facts to an external memory file/scratchpad rather than
  relying on the model to re-derive them from a shrinking context window each step.
- **Sub-agent isolation** — delegate a sub-task to a sub-agent with its own clean context, and fold
  back only a condensed result (this is also this surface's entry point into
  [surface-multi-agent.md](surface-multi-agent.md)).
A chat surface can often skip all of this (turns are short, the human resets context implicitly by
asking a new question); an autonomous run cannot — treat compaction as a structural requirement from
the first design pass, not a fix applied once a run starts failing.

### 3. Harness hygiene: prune, don't only add
The distinctive risk on this surface: harnesses only ever *grow* — more tools, more system-prompt
instructions, more skills — and across a model-generation cycle that raises cost and *hurts*
accuracy (@sh_reya, x.com/sh_reya/status/2074973561002115241, 2026). The counter-discipline, evidenced
in production: Anthropic "removed ~80% of the Claude Code system prompt for our newest models"
(@trq212, x.com/trq212/status/2080710971228918066, Jul 2026) — better models need *less* scaffolding,
not more. Treat the harness (tools, prompts, skills available to the loop) as a maintained artifact:
re-evaluate what's still earning its token cost on every model upgrade, and remove what isn't,
verified against the regression suite (§1's evaluation row) so pruning doesn't silently regress
capability.

### 4. The durable-execution border
Treat "the loop must survive a crash/restart/deploy" as a default requirement once a run spans more
than one tool call or can outlast a single request/response cycle — shipping an unattended loop as
an in-memory process with no crash-recovery story is a named anti-pattern (ThoughtWorks Technology
Radar flags "Ignoring Durability in Agent Workflows" as a Caution), and OpenAI's Agents SDK
integrates Temporal specifically because the workflow/activity split (deterministic orchestration
code that replays vs. side-effecting tool calls that must be idempotent) maps cleanly onto agent
loops. **This reference only tells you when to reach for it** — the workflow/activity mechanics,
idempotency-key design, and the Temporal/Inngest/Restate choice live in `backend`'s
`async-and-messaging` (Inngest is SSPL v1.0 → Apache after 3yr; Restate is BSL 1.1 → Apache after
4yr — flag the license if self-hosting either as a resold service). A single-tool-call, single-cycle
step doesn't need this — don't over-engineer a one-shot task into a durable workflow.

## Validation
- Every run has a stated stop condition (step budget, goal-check, cost cap, or human callback) —
  not "runs until it stops."
- A compaction/note-taking/sub-agent-isolation policy exists before the run is long enough to need
  one, not retrofitted after a context-rot failure.
- The harness (tools + system prompt + skills) has a stated last-pruned date or an explicit reason
  nothing was removed at the last model upgrade.
- Every run spanning >1 tool call or >1 request cycle has a named durability story, or an explicit,
  stated reason it's out of scope.
- Privileged/destructive actions route through an approval gate — no unattended run holds write/
  delete/spend authority by default.
- Agentic evals report pass^k (reliability across repeated trials), not just a single pass@1 number.

## Failure modes and handoff
- **No termination condition** — the run either loops forever or stops arbitrarily; name the
  condition before shipping.
- **Context rot from unmanaged transcript growth** — apply §2's toolkit before it degrades output,
  not after.
- **Harness accretion with no pruning discipline** — treat every model upgrade as a prune
  opportunity (§3), not just an add opportunity.
- **An unattended run with no crash-recovery story and real side effects** — route the durability
  mechanics to `backend`'s `async-and-messaging`; this surface only flags that it's needed (§4).
- **The threat model for what the agent may do unattended is undecided** — that boundary call is
  `architecture`'s; this surface implements the approval-gate scoping once the decision is made.
- **Multiple distinct agent roles are coordinating**, not one loop — layer
  [surface-multi-agent.md](surface-multi-agent.md) rather than building ad hoc coordination inside
  a single loop.
