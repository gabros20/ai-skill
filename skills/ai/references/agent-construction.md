# Agent Construction

Purpose: Decide the shape of an agent's control loop — workflow vs autonomous agent, the tool
contract, the multi-agent shape (if any), and whether the loop needs to survive a crash — before
picking a framework. The loop itself is now boilerplate; the decisions that matter are what you
build *around* it.

Read when:
- The request is "build an agent," "make this tool-calling," "should this be autonomous," or
  involves picking/comparing an agent framework (LangGraph, CrewAI, OpenAI Agents SDK,
  Pydantic-AI, Mastra, ADK, Microsoft Agent Framework, …).
- The system needs more than one agent (delegation, handoff, crew) and you need to decide the
  shape — or whether to avoid multi-agent entirely.
- A long-running or multi-step agent loop needs to survive a crash/restart/deploy.

Skip when:
- The steps are fully predefinable and no model needs to direct its own process — that's a
  deterministic pipeline; see the workflow patterns in §2 below before reaching for an agent at
  all, and if the system genuinely has no model-driven uncertainty, this isn't an `ai` job at all
  → `automation`.
- The ask is tool-argument schema mechanics (constrained decoding vs reask/retry vs
  provider-native) as its own topic, not agent-loop tool-calling — → `structured-outputs.md`.
- The ask is building/hosting an MCP server as a reusable backend capability, or the transport/SDK
  mechanics of MCP itself — → [tool-and-mcp-integration.md](tool-and-mcp-integration.md) (this ref
  only covers the tool-contract shape the loop expects).
- The ask is the durable-execution *infrastructure* (Temporal worker setup, workflow/activity
  split, idempotency keys) — → backend's `async-and-messaging` / `surface-agentic`; this ref only
  covers *when* to reach for it and the license shape of the options.

Inputs:
- Whether the task's steps can be predefined in code, or the model must direct its own process —
  state explicitly, don't default to "agent" because it's exciting.
- Target language/runtime (Python/TS/Rust/other) — narrows the framework field materially.
- Whether the system needs more than one agent, and why (parallelizable subtasks? isolated
  context? a genuine handoff of control?).
- Whether the loop must survive process restarts / can run for hours-to-days.

Produces: a named control-flow shape (workflow pattern, single agent, or one of the four
multi-agent shapes), a tool contract (schema + retry policy), a framework pick with what-NOT
named, and — if applicable — a durability decision with its license flag surfaced.

## Contents
- The agent loop is boilerplate; the harness is the decision
- Workflow vs agent — start simplest
- The tool contract
- CodeAgent vs JSON-tool-call
- The four multi-agent shapes
- When NOT to multi-agent
- Durable/resumable execution
- Framework picks by axis

## Procedure

### 1. The agent loop is boilerplate; the harness is the decision
Every framework has converged on the same shape: `instructions + tools + driver loop
(model-call → tool-exec → feed-result-back → repeat until stop-condition)`. Concretely, `agent =
while(true) { model(context) → if tool_call: run tool, append result; else: return }` — reducible
to `streamText({ model, tools, stopWhen: stepCountIs(n) })` in one line
(@mattpocockuk, x.com/mattpocockuk/status/1978858379230454155). The field's shared vocabulary now
separates three layers: **Model** (stateless next-token function) → **Harness** (prompt + context
+ tools + loop + everything wrapped around the model) → **Agent** (the running system)
(@mattpocockuk, x.com/mattpocockuk/status/2050456062520615131). **The design work is entirely in
the harness, not the loop** — this is why `agent-construction` decisions cluster around context
management, tool contracts, and stop conditions, not loop mechanics. Corroborated independently by
Pydantic AI ("the inner loop is settled; the leverage is in the layer around it," v2 release notes)
and by the convergence of purpose-built "harness frameworks" (Flue, Vercel `eve`) as a new
category, not more loop libraries.

### 2. Workflow vs agent — start simplest
Before writing a loop, name which of these you're building — the field's load-bearing taxonomy
(Anthropic, anthropic.com/engineering/building-effective-agents):

| Shape | Pattern | Use when |
|---|---|---|
| Prompt chaining | Fixed sequence of LLM calls, each on the prior output | Task decomposes into a known sequence |
| Routing | Classify input, dispatch to a specialized path | Distinct input categories need distinct handling |
| Parallelization | Sectioning (split work) or voting (redundant runs, aggregate) | Independent subtasks, or accuracy via consensus |
| Orchestrator-workers | Central LLM plans, spawns/directs workers, synthesizes | Subtasks aren't predictable in advance |
| Evaluator-optimizer | One LLM generates, another critiques in a loop | Clear evaluation criteria, iterative refinement helps |
| **Autonomous agent** | Model directs its own process/tool use, open-ended | Steps genuinely can't be predefined |

**Default to the simplest workflow pattern that fits; reach for an autonomous agent only when the
step sequence can't be predefined** — this is the single most consistently repeated piece of
advice across the canon (Anthropic, Mastra docs, 12-Factor Agents §"own your control flow",
github.com/humanlayer/12-factor-agents). Most "agent" requests are actually routing or
orchestrator-workers wearing an agent costume; naming the real shape avoids paying autonomy's
token/reliability cost for a task that didn't need it.

### 3. The tool contract
Standardized across every framework surveyed: **typed schema (Pydantic/Zod/Standard Schema) +
docstring-as-description + validate-and-auto-retry-on-schema-failure** — the framework catches a
schema-invalid tool call, feeds the validation error back to the model, and lets it retry, rather
than hard-failing the turn (Pydantic AI, Atomic Agents/Instructor, AG2 `@tool`, github.com/pydantic/
pydantic-ai). Two rules that hold regardless of framework:
- The schema the agent sees **must match the actual execution-side validation byte-for-byte** — a
  mismatch produces calls that fail unpredictably after the model already "succeeded." Generate
  one from the other; never hand-maintain both.
- Tool descriptions are an attention-budget cost, not free documentation — keep the tool set
  small, non-overlapping, and unambiguous (Anthropic's ACI framing, anthropic.com/engineering/
  building-effective-agents; @chipro: capability ≈ tools + planning, x.com/chipro/status/
  1876681640505901266). Each agent/sub-agent should carry only the tools its task needs — Midday's
  production system scopes 43 tools across 10 specialist agents rather than handing all 43 to
  every agent (@pontusab, x.com/pontusab/status/1981689626101469601).
The three-way choice of *how* to enforce the schema (constrained decoding / reask-retry /
provider-native) is `structured-outputs.md`'s decision — this ref only states that agent tool-args
need one of those three, non-negotiably.

### 4. CodeAgent vs JSON-tool-call
The default everywhere is the model emitting a JSON tool-call dict. **smolagents' CodeAgent
pattern is the real, still-contested alternative**: the model writes and executes actual code as
its action instead (github.com/huggingface/smolagents, Apache-2.0, ~28k stars, as of 2026-07-25) —
measured ~30% fewer steps/LLM calls and higher scores on hard benchmarks, because one code block
can express what would otherwise be several sequential tool calls (loops, conditionals,
intermediate variables). Same idea underlies Claude-Code-style agentic coding and DeepAgents Code.
**What NOT to build**: code-execution-as-action is a genuine security boundary problem —
smolagents explicitly flags its local Python executor as *not* a security boundary; if you adopt
CodeAgent, sandbox execution (E2B/Modal/Docker-class isolation) is mandatory, not optional. Default
to JSON tool-calls unless the task's action space benefits from composability (multi-step
data manipulation, control flow) enough to justify standing up a sandbox.

### 5. The four multi-agent shapes
When a system needs more than one agent, it's one of these four (converged across every framework
surveyed):

| Shape | Control stays with caller? | Teacher example |
|---|---|---|
| **Agent-as-tool** | Yes — sub-agent runs, returns a value, caller continues | AutoGen `AgentTool`, Semantic Kernel agents-as-plugins |
| **Handoff** | No — control genuinely transfers | OpenAI Agents SDK `handoffs` (cleanest teacher of the distinction) |
| **Autonomous crew** | No single caller — peers converse toward a shared goal | CrewAI Crews, AutoGen/AG2-classic GroupChat |
| **Graph-with-agent-node** | Deterministic graph wraps otherwise-autonomous steps | LangGraph, ADK 2.0 Workflow Runtime, Mastra Workflows, CrewAI Flows |

The **graph-vs-loop split is a paired primitive, not competing designs** — nearly every serious
framework now ships both an autonomy primitive (agent/loop) and a deterministic graph/workflow
engine, and lets you compose them (CrewAI Crews+Flows, Mastra Agent+Workflow, ADK Agent+Workflow,
Pydantic AI's graph library). Treat "should this be a graph or a loop" as a per-node decision, not
a framework-level commitment. **Context/attention-budget isolation is the shared rationale for
delegation**: each sub-agent gets a clean context window and returns a condensed summary rather
than its full transcript — DeepAgents' filesystem+summarization, AG2's `compact=`/`assembly=`,
Mastra's Observational Memory, Agno/Atomic Agents' Context Providers all converge on this same
move (github.com/langchain-ai/deepagents; github.com/ag2ai/ag2).

### 6. When NOT to multi-agent
The believer and skeptic cases are both real and evidence-backed — name which applies before
adding an agent:
- **Believer case (Anthropic's multi-agent research system, anthropic.com/engineering/
  multi-agent-research-system)**: an orchestrator-worker system (lead agent plans + spawns
  parallel subagents) beat single-agent Opus by 90.2% on breadth-first research — tasks that
  decompose into independent, parallelizable directions, exceed one context window, or need many
  complex tool calls. The explicit cost: agents use ~4× the tokens of a chat turn; **multi-agent
  systems use ~15× more tokens than a single chat turn** — pay it only when task value clears that
  bar.
- **Skeptic case (Cognition, cognition.ai/blog/dont-build-multi-agents)**: multi-agent breaks
  when agents need to share context or have real dependencies between their outputs — "actions
  carry implicit decisions, and conflicting decisions carry bad results" (two sub-agents building
  visually inconsistent halves of one thing because neither saw the other's decisions). Cognition's
  recommendation: default to a **single-threaded linear agent** with continuous context; when
  context genuinely runs out, hand off via a compression step that preserves "key details, events,
  and decisions," not by forking into parallel agents.
- **The practitioner middle** (@omarsar0, x.com/omarsar0/status/2080340696842539204): "the hard
  part of multi-agent is getting agents to stay quiet" — five agents on one task duplicate work and
  burn tokens talking to each other. The pragmatic default in production is **one orchestrator +
  tool-scoped specialists** (§5's agent-as-tool or graph-node shape), not autonomous swarms.
- **Decision rule**: reach for multi-agent only for genuinely parallelizable, low-inter-dependency,
  high-value work (Anthropic's breadth-first case); default to single-threaded for anything with
  shared state, tight coupling, or coding-style sequential dependency (Cognition's case, and most
  coding tasks per Anthropic's own post). `surface-multi-agent.md` carries the fuller
  multi-agent-*system* design surface (orchestrator+specialist scoping, coordination-cost
  budgeting) when the answer is yes.

### 7. Durable/resumable execution
A plain in-memory while-loop dies on crash/restart/deploy and can't survive a multi-hour or
multi-day wait. Reach for durable execution when a loop (a) spans more than one tool call across
process boundaries, (b) can outlive a single request, or (c) has side effects that must not
double-fire on retry — not for a single-turn chatbot response. This ref teaches **when** and the
**license shape**; the implementation (workflow/activity split, idempotency keys, worker setup)
is backend/operate turf (`async-and-messaging`, `surface-agentic`).

| Engine | License | The pattern |
|---|---|---|
| **Temporal** | MIT | Heaviest, most battle-tested; full server + worker model, real ops overhead. The modal default for orgs already running infra teams. |
| **Inngest** | **SSPL v1.0** (non-OSI) → converts to Apache-2.0 **3 years** after each release | Step-function model (`step.run()`), lighter, HTTP-invoked, TS-first. Self-host your own workloads freely; SSPL blocks reselling it as a hosted service without open-sourcing your stack. |
| **Restate** | **BSL 1.1** → converts to Apache-2.0 **4 years** after each release | Language-native durable primitives, explicitly markets "Durable AI Agents" as first-class. Self-host for your own production workloads is an explicit grant; operating a public "Restate Platform Service" (reselling as managed hosting) is not. |

Teach the **pattern**, not a winner — self-host yes, resell no, converts to permissive after N
years — the same BSL/SSPL shape as CockroachDB, Redis 8, and MongoDB (see backend's `persistence`
DB-license table for the analog). Two of the three leading agent-durability engines are
source-available-with-a-future-open-date, not permissive OSS; surface that before a build-vs-buy
call, not after.

### 8. Framework picks by axis
Retrieval-first — re-verify star counts/versions before citing (all figures below live-verified
2026-07-25 via `gh api`); frameworks in this niche ship breaking changes fast.

| Axis | Modal default | What NOT to build |
|---|---|---|
| Python, graph-first | **LangGraph** (MIT, ~38k★) — durable checkpointing, HITL interrupts, subgraphs | Don't hand-roll checkpointing/replay when a graph engine already solves it |
| Python, loop-first, type-safety | **Pydantic-AI** (MIT, ~18k★) — validated deps/output, composable "capabilities" | — |
| Python, opinionated batteries-included harness | **DeepAgents** (MIT, ~26k★) — planning + sub-agent isolation + FS + compaction, Claude-Code-shaped | Don't rebuild context-management primitives DeepAgents already ships |
| Vendor-anchored, simplest mental model | **OpenAI Agents SDK** (MIT) — clean handoff-vs-agent-as-tool distinction, works with 100+ LLMs despite the name | — |
| TypeScript | **Mastra** (Apache-2.0 core + `ee/` source-available, ~26k★) — Agent + Workflow duality, suspend/resume HITL | Don't treat `ee/` code as a free reference impl — it needs a commercial license in production |
| Rust | **rig** (MIT, ~8k★) — only real default in this niche; `rig-core` (portable) / `rig-agent` (orchestration) split | — |
| Minimal/teaching-grade | **PocketFlow** (MIT, ~11k★, ~100 LOC) — Node+Flow as the one primitive everything else derives from | Don't reach for a 400k-LOC framework when the task is genuinely simple |
| Enterprise / .NET+Python parity | **Microsoft Agent Framework** (MIT, github.com/microsoft/agent-framework, ~12.4k★ as of 2026-07-25) — successor to both AutoGen and Semantic Kernel; adds durability/checkpointing/HITL/observability/governance as first-class, ships sequential/concurrent/handoff/group-collaboration graph patterns | **AutoGen and Semantic Kernel are legacy** — Microsoft explicitly redirects new builds to Agent Framework (migration guides ship for both); teach the old two as pattern-origins (GroupChat, agents-as-plugins) only |

## Validation
- [ ] The control-flow shape is named explicitly (one of §2's workflow patterns, or "autonomous
      agent" with the reason steps can't be predefined) — not defaulted to "agent."
- [ ] Every tool's exposed schema matches its execution-side validation, and schema failures
      retry-with-feedback rather than hard-fail.
- [ ] If multi-agent: the shape is named (§5) and justified against §6's decision rule, not chosen
      by default; each agent/sub-agent carries only the tools its task needs.
- [ ] If a loop can outlive one request or has non-idempotent side effects: a durability story is
      stated, with the chosen engine's license surfaced.
- [ ] The framework pick names what-NOT (the alternative not chosen, and why), not just "we use X."
- [ ] Legacy frameworks (AutoGen, Semantic Kernel) are cited as pattern-origin only, not
      recommended for new builds.

## Failure modes and handoff
- Durable-execution *infrastructure* (worker setup, workflow/activity split, idempotency keys) —
  → backend's `async-and-messaging` / `surface-agentic`; this ref only decides *whether* and
  *which license*.
- Tool-argument enforcement mechanics (constrained decoding vs reask/retry vs provider-native) as
  their own topic → `structured-outputs.md`.
- MCP transport/SDK/server-building decisions → [tool-and-mcp-integration.md](
  tool-and-mcp-integration.md).
- The system needs deep multi-agent-system design (coordination budgeting, scoped-specialist
  layout) once §6 says yes → `surface-multi-agent.md`.
- The ask is really "should this system even use an agent," a threat model, or build-vs-buy at the
  system level → `architecture`; implement inside that decision, don't invent it here.
- Evaluating whether the constructed agent actually works → `evaluation.md` is the completion
  gate, not an afterthought.
