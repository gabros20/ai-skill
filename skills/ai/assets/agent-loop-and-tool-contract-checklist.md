# Agent Loop & Tool Contract Checklist (fillable)

Uniform-table format per skill convention — fill "Implemented" and "Evidence," never narrate.
Source: [agent-construction.md](../references/agent-construction.md) +
[tool-and-mcp-integration.md](../references/tool-and-mcp-integration.md).

| # | Control | Implementation required | Implemented (Y/N) | Evidence / location |
|---|---|---|---|---|
| 1 | Control-flow shape named | One of the 5 workflow patterns or "autonomous agent," with the reason steps can't be predefined — not defaulted | | |
| 2 | Stop condition | Explicit step/token/goal-check limit; no unbounded loop | | |
| 3 | Tool schema fidelity | Model-facing schema generated from (or contract-tested against) the actual execution-side validation | | |
| 4 | Schema-failure handling | Validate-and-auto-retry: error fed back to the model, not a hard fail | | |
| 5 | Tool scope (least-privilege) | Each agent/sub-agent has only the tools its task needs, not the full tool set | | |
| 6 | Sub-agent context isolation | Sub-agents get a clean context and return a condensed summary, not their raw transcript | | |
| 7 | Multi-agent justified | Task is parallelizable/breadth-first/exceeds one context window — not chosen by default over a single-threaded agent | | |
| 8 | Delegation shape named | One of agent-as-tool / handoff / crew / graph-node stated explicitly, not implicit | | |
| 9 | Durability story | Stated for any loop spanning >1 tool call or >1 request cycle (or explicitly justified as out of scope) | | |
| 10 | Durable-engine license flagged | BSL/SSPL/MIT noted before build-vs-buy on Temporal/Inngest/Restate-class infra | | |
| 11 | MCP SDK/spec version pinned | v1 SDK for production; spec revision re-verified against modelcontextprotocol.io, not assumed | | |
| 12 | MCP consent/trust flow | Explicit user consent for tool invocation/sampling; untrusted-server tool descriptions flagged | | |
| 13 | Integration path justified | Direct API / CLI / MCP chosen with a stated reason, not MCP-by-default for a single caller | | |
| 14 | Code-execution sandboxing | If CodeAgent/code-as-action is used, execution is sandboxed — never treated as a security boundary by default | | |
| 15 | Harness regression discipline | Prompt/tool/skill additions reviewed on a cadence, not purely additive across model-cycle upgrades | | |

**Self-audit count: ____ / 15 controls implemented and evidenced.**

Anything below 15/15 must be either fixed before ship or explicitly waived with a stated reason and
owner — do not ship a silent gap.
