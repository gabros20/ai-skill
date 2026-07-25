# Surface: Multi-agent (additive)

Purpose: **Additive overlay** — stacks on top of any of the four base surfaces
([chat-assistant](surface-chat-assistant.md), [autonomous-agent](surface-autonomous-agent.md),
[rag-app](surface-rag-app.md), [batch-and-pipeline](surface-batch-and-pipeline.md)) when the system
is *also* multi-agent: distinct roles/contexts that must coordinate. Does not replace the base
surface's guidance — a multi-agent RAG app is still `surface-rag-app.md` + this ref, not this ref
alone. **The honest "when NOT to" is this reference's primary content**, not a footnote.

Read when:
- The request names multiple agents explicitly ("swarm," "crew," "sub-agents," "orchestrator +
  specialists"), or a base surface's single-loop design is genuinely failing because distinct roles
  need isolated context.
- A base surface's own escalation path already points here (autonomous-agent's sub-agent isolation,
  rag-app's decomposition layer growing into real specialist roles).

Skip when: **read this before reaching for multi-agent at all** —
- The task has heavy interdependencies or needs shared context in real time. Don't build it.
- Coordination overhead (agents talking to each other, duplicating work) would exceed the value of
  parallelizing. Don't build it.
- A single agent-as-tool call or one well-scoped sub-agent solves it — that's
  [agent-construction.md](agent-construction.md)'s sub-agent-isolation pattern, not this surface.
- The task's economic value doesn't clear the token multiplier (§2). Don't build it.

Inputs:
- Which base surface this stacks on — state it; the overlay changes meaning depending on the base
  (see §4's compose table).
- Whether the sub-tasks are genuinely independent/parallelizable, or share state/decisions that one
  agent's output changes another's — this single question decides whether §1 applies.
- The task's economic value, to weigh against §2's cost multiplier.

Produces:
- A go/no-go call on multi-agent, justified against §1–2, before any architecture is chosen.
- If go: a named shape (§3) matched to the coordination pattern actually needed, plus tool-scoping
  per agent.

## Contents
- When NOT to multi-agent (read first)
- The cost case, quantified
- The four shapes
- The pragmatic middle: orchestrator + scoped specialists
- Composing with each base surface

## Procedure

### 1. When NOT to multi-agent (read first)
The clearest primary-source argument against multi-agent-by-default: Cognition's Walden Yan
(cognition.ai/blog/dont-build-multi-agents, 2025-06-12) — parallel subagents lack visibility into
each other's decision history, and "actions carry implicit decisions, and conflicting decisions carry
bad results." His worked example: building Flappy Bird with two subagents in parallel, one designs a
Mario-style background, the other an inconsistent bird sprite, because neither saw the other's
choices. He names **coding work specifically** as the case that bites hardest — high interdependency,
often not enough economic value per parallel unit to absorb the coordination cost — and recommends a
**single-threaded linear agent** with context compaction for long tasks as the default, reserving true
multi-agent collaboration for once single-agent-to-human communication is solid. Claude Code's own
sub-agent design reflects this: sub-agents answer *questions*, they don't do parallel coding, which
avoids the conflicting-output failure mode by construction.

The corroborating field nuance: "the hard part of multi-agent is getting agents to **stay quiet**.
Put five agents on one task and they duplicate work and burn tokens talking to each other"
(@omarsar0, x.com/omarsar0/status/2080340696842539204, 2026). Coordination cost is not a hypothetical
— it's the default outcome absent a scoped design (§3–4).

### 2. The cost case, quantified
Anthropic's own multi-agent research-system writeup (2025-06-13,
anthropic.com/engineering/multi-agent-research-system) is both the clearest believer case and the
clearest cost warning, from the team that shipped one in production: "agents typically use about 4×
more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats" —
and "token usage by itself explains 80% of the variance" in performance, meaning the gain is bought
with tokens, not free. Their own scoping rule: multi-agent excels at **open-ended, breadth-first
exploration** where subtasks are genuinely independent and parallelizable, information exceeds a
single context window, or tool-integration fan-out is heavy and the task's value is high enough to
absorb the multiplier — and performs poorly on tasks requiring shared context or heavy
interdependencies, "notably most coding work." Read §1 and §2 together: they're the same finding
from two different teams — coordination cost and token cost are both real, and multi-agent is worth
it only when the base surface's single-agent path has a demonstrated, high-value gap it can't close.

Concrete result when it does pay off: "multi-agent system with Claude Opus 4 as the lead agent and
Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by **90.2%** on our internal
research eval" (same source) — a real number, on a task shape (open-ended research) that matches §2's
scoping rule.

### 3. The four shapes
Pick the cheapest shape that fits the coordination actually needed — don't default to the most
autonomous one. Full construction mechanics live in
[agent-construction.md](agent-construction.md); this table says which shape fits which situation.

| Shape | Coordination cost | Use when |
|---|---|---|
| **Agent-as-tool** — caller stays in control, the sub-agent's return value is just a tool result | Lowest | The "sub-agent" is really a specialized function call with no need to hand off control. |
| **Handoff** — control genuinely transfers to another agent (OpenAI Agents SDK's cleanest teaching of the distinction) | Low–medium | The receiving agent needs full ownership of the rest of the task, not just an answer back. |
| **Declarative graph/workflow, agent-as-node** — deterministic control flow (LangGraph/ADK Workflow/Mastra Workflows) with an agent occupying specific nodes | Medium | Most of the flow is predictable/deterministic and only certain nodes need agentic judgment — the strongest cross-framework convergence pattern (github-corpus). |
| **Autonomous role-based crew** — role-based agents converse/negotiate (CrewAI Crews, AutoGen GroupChat) | Highest | Roles are genuinely independent specialists with no shared real-time state — reach for this last, per §4's scoped-specialist pattern, not as a first move. |

### 4. The pragmatic middle: orchestrator + scoped specialists
The production shape that actually ships, not a swarm: Midday runs **10 agents (1 triage/orchestrator
+ 9 domain specialists), 43 tools grouped by domain, and each agent gets only the tools it needs**
(@pontusab, x.com/pontusab/status/1981689626101469601, 2026). The load-bearing principle is **tool-
scoping and context isolation per agent**, not agent count — this is the same context/attention-budget
isolation that makes sub-agent delegation work in a single-agent harness
([prompt-and-context-engineering.md](prompt-and-context-engineering.md)), applied across agent
boundaries. An orchestrator that routes to narrowly-scoped specialists, each with a clean context and
a small tool set, avoids both §1's conflicting-decisions failure (specialists don't share a mutable
task) and dampens §2's token cost (each agent's context stays small). This is the shape to reach for
before an autonomous role-based crew, not after.

## Composing with each base surface
| Base surface | What the overlay typically looks like |
|---|---|
| [chat-assistant](surface-chat-assistant.md) | A triage agent hands off mid-conversation to a domain specialist (support bot routing to billing vs. technical). Coordination cost is naturally bounded — the human's turn-taking is itself a checkpoint. |
| [autonomous-agent](surface-autonomous-agent.md) | The canonical high-value case (§2): orchestrator-workers for open-ended, breadth-first exploration exceeding one context window. |
| [rag-app](surface-rag-app.md) | Often already present without being named "multi-agent" — the agentic-decomposition layer (routing/sub-question agents) *is* a scoped-specialist pattern over retrieval sources. |
| [batch-and-pipeline](surface-batch-and-pipeline.md) | Rare — batch's independent-items assumption usually means no coordination is needed. If items genuinely require cross-agent negotiation, question whether the job is still "batch" (see that surface's failure modes). |

## Validation
- §1 and §2 were checked and the go/no-go call is stated explicitly, not skipped.
- The shape chosen (§3) is the cheapest one that fits the actual coordination need, not the most
  autonomous one available.
- Every agent's tool set is scoped to what it needs (§4) — no agent holds the full tool inventory
  "just in case."
- The base surface this overlay stacks on is named.
- If multi-agent was rejected, the simpler alternative (single agent + sub-agent isolation, or a
  deterministic workflow) is named as what's actually being built instead.

## Failure modes and handoff
- **Multi-agent reached for by default** without checking §1–2 — the coordination-cost and token-cost
  case has to be made, not assumed away by "more agents = more capability."
- **A swarm instead of scoped specialists** — every agent given the full tool inventory instead of a
  domain-scoped subset (§4) — this is the direct cause of §1's conflicting-decisions and §2's token-
  chatter failure modes.
- **An autonomous role-based crew chosen first** when a graph/workflow or a simple handoff would have
  done the job at lower coordination cost — pick from §3's cheapest-fitting shape, not the most
  flexible one.
- **The task actually has heavy interdependencies** (shared mutable state, sequential dependent
  decisions) — that's the single strongest "don't" signal from §1; fall back to a single-threaded
  agent with context compaction (per [surface-autonomous-agent.md](surface-autonomous-agent.md) §2).
- **Durable/crash-survivable coordination state across agents is the real ask** — that crosses into
  `backend`'s durable-execution territory (see
  [surface-autonomous-agent.md](surface-autonomous-agent.md) §4); this overlay doesn't own that
  infrastructure.
