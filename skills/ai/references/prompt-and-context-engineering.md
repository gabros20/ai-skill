# Prompt & Context Engineering

Purpose: Decide how to curate the whole per-turn token budget an agent runs on — system prompt,
tools, examples, retrieved data, message history — not just wording a good instruction. Turn
"the agent is confused / slow / expensive / drifting" into a concrete harness diagnosis: what's in
the context that shouldn't be, what's missing that should be just-in-time, and what to prune before
adding anything else.

Read when:
- The request touches a system prompt rewrite, tool-set design, few-shot examples, RAG context
  injection into a prompt, long-running agent context management, or "the agent forgot/ignored X."
- An existing harness has grown over multiple releases and needs a hygiene/pruning pass, or a model
  upgrade prompts "do we still need all this scaffolding."

Skip when:
- The ask is the agent loop mechanics itself (tool-call/feed/repeat/stop, termination, launch/
  pause/resume) — → `agent-construction.md`.
- The ask is grading whether outputs are good — → `evaluation.md`.
- The ask is the $ cost of tokens/caching or which model tier to route to — → `observability-and-
  cost.md` / `model-selection-and-routing.md` (this ref only states caching as a context-shape
  constraint, not the pricing math).
- The ask is durable/resumable execution infrastructure for long-running sessions — → backend/operate.
- The ask is the schema/validation contract for a tool's arguments or a model's final output — →
  `structured-outputs.md`.

Inputs:
- Whether the system is single-turn, multi-turn chat, or a long-horizon autonomous loop — decides
  whether compaction/note-taking/sub-agents are even relevant.
- The current system prompt + tool list, if one exists — never redesign a harness you haven't read.
- Whether the harness has been touched since the last model upgrade — decides whether a prune pass
  is overdue.

Produces: a context-curation decision per layer (system prompt altitude, tool set, few-shot set,
retrieval timing), a long-horizon strategy if the loop is multi-turn/autonomous, and a harness
hygiene verdict (what to remove, not just what to add) — filled into
[context-budget-worksheet.md](../assets/context-budget-worksheet.md).

## Contents
- The shift: prompt engineering → context engineering
- Model / Harness / Agent
- The curation toolkit (system prompt, tools, examples, JIT retrieval)
- Progressive disclosure as an applied pattern
- Long-horizon levers: compaction, note-taking, sub-agent isolation
- Harness hygiene — verify-and-subtract
- Caching as a context-shape constraint

## Procedure

### 1. The shift: prompt engineering → context engineering
Canonical framing (Anthropic, "Effective context engineering for AI agents," Sept 29, 2025,
anthropic.com/engineering/effective-context-engineering-for-ai-agents): prompt engineering = writing
and organizing instructions, a discrete one-time act. Context engineering = curating and maintaining
the **optimal set of tokens** during inference — system prompt, tools, external data, message
history — an iterative, per-turn process across an agentic loop. Two drivers force the shift: **context
rot** (accuracy degrades as token count grows, from the O(n²) cost of transformer self-attention) and
a **finite attention budget** (every added token has marginal cost, analogous to human working
memory). Guiding principle: "find the smallest possible set of high-signal tokens that maximize the
likelihood of some desired outcome." Anthropic's own prompt-engineering docs sequence evals *before*
prompt engineering (platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) —
build success criteria first, curate context second.

### 2. Model / Harness / Agent
Canonical taxonomy (@mattpocockuk, x.com/mattpocockuk/status/2050456062520615131, 2026): **Model** =
stateless parameter blob, next-token prediction only. **Harness** = everything wrapped around the
model that turns it into an agent — system prompt, tools, retrieval, loop control, memory. **Agent**
= model + harness in motion on a task. The distinction matters because harness quality, not model
choice, is usually the fastest lever: the loop itself is boilerplate (`streamText({model, tools,
stopWhen})`, per the same source) — differentiation lives entirely in what you put in the harness,
and what you leave out (§6).

### 3. The curation toolkit
Per layer, the modal default (Anthropic context-engineering canon, §1 source):
- **System prompt**: calibrate to the "right altitude" — specific enough to steer, general enough to
  generalize; avoid brittle hardcoded logic *and* vague high-level guidance; structure with XML tags
  or Markdown headers so sections are addressable.
- **Tools**: token-efficient, self-contained, unambiguous descriptions; minimize functional overlap
  — two tools that could plausibly both apply is a design bug, not a model failure (see also
  `agent-construction.md` for the contract shape itself).
- **Few-shot examples**: a small set of diverse, *canonical* examples beats exhaustively enumerating
  edge cases — exhaustive lists bloat tokens without covering the actual long tail.
- **Just-in-time retrieval**: keep lightweight references (file paths, IDs, links) in context and
  load data on demand at runtime, rather than pre-loading everything speculatively — mirrors on-demand
  human recall and is the mechanism that makes progressive disclosure (§4) work.

**What NOT to build**: a bespoke memory system before trying compaction/note-taking (§5); tools added
"just in case" they're useful; a few-shot set that tries to cover every edge case instead of the
canonical ones. **Common false belief**: attention budget ≠ context window size — a 1M-token window
does not mean 1M tokens is a free budget; every added token still costs marginal attention
(addyosmani/agent-skills `context-engineering`, github.com/addyosmani/agent-skills, MIT).

### 4. Progressive disclosure as an applied pattern
Agent Skills' three-level load model is JIT retrieval applied to procedural knowledge (Anthropic
Agent Skills docs, platform.claude.com/docs/en/agents-and-tools/agent-skills/overview): **L1** —
YAML frontmatter (`name`+`description`), always loaded, ~100 tokens/skill; **L2** — the SKILL.md
body, loaded only once triggered, budgeted under ~5k tokens; **L3** — bundled scripts/resources,
loaded or executed only as referenced, script code itself never entering context (only its output
does). The same shape generalizes beyond skills: a **5-tier context hierarchy**, most-persistent to
most-transient — rules files (CLAUDE.md-equivalents) → spec/architecture docs (load per-feature, not
whole-spec) → relevant source files (task-scoped, not the whole repo) → error output (the specific
error, not the full log) → conversation history (compacted, see §5) — is the practical version of
"lightweight reference + load on demand" (addyosmani/agent-skills `context-engineering`, MIT).
**Context flooding** — dumping >~5,000 lines of context for a task where <2,000 focused lines would
do — is the concrete anti-pattern this hierarchy exists to prevent (same source).

### 5. Long-horizon levers: compaction, note-taking, sub-agent isolation
For loops that outlive a single context window (Anthropic context-engineering canon, §1 source):
- **Compaction** — summarize the conversation near the context limit, preserve key architectural
  decisions, discard redundant tool outputs, reinitiate. Described as "the first lever" — try this
  before the other two.
- **Structured note-taking** — the agent persists progress to an external memory file/scratchpad
  instead of holding it in-window; the next turn reads the note back in rather than re-deriving state.
- **Sub-agent isolation** — delegate a focused sub-task to a specialized agent with a clean context;
  it returns a condensed summary, protecting the orchestrator's budget. This is also the on-ramp to
  `surface-multi-agent` — see that reference for the four multi-agent shapes and the explicit
  when-NOT-to-multi-agent case; the isolation *rationale* (shared across every framework surveyed —
  OpenAI Handoffs, ADK collaborative agents, LangGraph sub-graphs) is context-budget protection, not
  parallelism for its own sake.
Pick compaction for single-agent long sessions, note-taking when state must survive a full restart,
sub-agent isolation when a sub-task's context would otherwise pollute the orchestrator's.

### 6. Harness hygiene — verify-and-subtract (the distinctive discipline)
The field is loud on adding scaffolding and near-silent on removing it. Two corroborating data
points: teams **only add** to harnesses — system prompt, skills, tools — and across a model
generation this measurably **raises cost and lowers accuracy**, because nobody prunes (@sh_reya,
x.com/sh_reya/status/2074973561002115241, 2026). Concretely, **better models need less scaffolding**:
Anthropic removed **~80% of the Claude Code system prompt** for newer models (@trq212,
x.com/trq212/status/2080710971228918066, Jul 2026). Treat the harness as a maintained artifact, not
a write-once file:
- Before adding a rule/tool/example, ask whether an existing one can be cut instead — net-zero or
  net-negative growth is the target, not net-positive.
- On every model upgrade, re-test whether prompt scaffolding built for a weaker model is still
  needed — instructions that compensate for a capability gap become dead weight once the gap closes.
- Removing something from the harness needs the same evidence bar as adding it: run the regression
  eval suite (see `evaluation.md`) before and after a prune, don't just eyeball it.
**What NOT to build**: don't accumulate defensive instructions indefinitely as a substitute for
fixing the underlying tool/prompt design; don't treat harness size as a proxy for thoroughness.

### 7. Caching as a context-shape constraint
Context engineering and prompt caching interact directly: caching keys off a **stable prefix**, so a
system prompt that gets edited per-request or per-user breaks the cache. Design for this from the
first line — put volatile content (user-specific data, current timestamp, retrieved passages) *after*
the stable system-prompt/tool-definition block, never interleaved before it ("you fundamentally have
to design agents for prompt caching first — almost every feature touches it," @trq212,
x.com/trq212/status/2024638793719177291, 2026). The $ math (write/read multipliers, cascade-before-
caching-before-batch ordering) is single-homed in `observability-and-cost.md` — this ref only owns
the context-shape implication.

## Validation
- [ ] System prompt sections are addressable (XML/Markdown), calibrated to "right altitude" — not
      brittle hardcoded branches, not vague high-level guidance.
- [ ] No two tools have overlapping purpose without an explicit disambiguation rule.
- [ ] Few-shot set is curated/canonical, not an exhaustive edge-case list.
- [ ] Retrieval is just-in-time (references + on-demand load) unless the task genuinely needs
      everything upfront.
- [ ] A long-horizon loop has an explicit compaction/note-taking/sub-agent-isolation strategy, not
      "let it run until the context window fills."
- [ ] Volatile content is appended after the stable prefix, not interleaved before it.
- [ ] The last harness change included a prune candidate, not only an addition; regression evals ran
      before/after.

## Failure modes and handoff
- **The actual ask is the loop/tool-call mechanics, not what's in context** — → `agent-construction.md`.
- **The actual ask is validating output shape/correctness** — → `structured-outputs.md` for the
  contract, `evaluation.md` for grading quality.
- **Context keeps growing and nobody can say why a rule/tool exists** — harness hygiene gap; run the
  §6 prune pass before adding anything else.
- **"Just add it to the system prompt" for a per-request or per-user fact** — breaks prompt-cache
  stability (§7); route it to just-in-time retrieval instead of the stable prefix.
- **Long session needs to survive a process restart, not just a context-window limit** — durable
  execution infra, not a context-engineering technique — → backend/operate.
