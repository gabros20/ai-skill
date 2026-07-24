# Context Budget Worksheet (fillable)

Fill in brackets. Source: `references/prompt-and-context-engineering.md`. Run this before adding
anything new to a harness, and again on every model upgrade — the goal both times is the same:
justify what's in context, not just add to it.

## 1. Harness inventory
List every persistent component of the context. If you can't name why a row exists, it's a prune
candidate.

| Component | Tokens (est.) | Last touched | Still needed because | Keep / Prune |
|---|---|---|---|---|
| System prompt | ____ | ____ | ____ | [ ] keep [ ] prune |
| Tool: ____ | ____ | ____ | ____ | [ ] keep [ ] prune |
| Tool: ____ | ____ | ____ | ____ | [ ] keep [ ] prune |
| Few-shot set | ____ | ____ | ____ | [ ] keep [ ] prune |
| Rules file (CLAUDE.md-equiv) | ____ | ____ | ____ | [ ] keep [ ] prune |
| Other: ____ | ____ | ____ | ____ | [ ] keep [ ] prune |

- Total estimated per-turn token cost: ____
- [ ] This inventory was actually read end-to-end before the current change, not assumed.

## 2. System prompt altitude check
- [ ] Not brittle hardcoded branch logic (would break on an unseen case)
- [ ] Not vague high-level guidance (gives no actionable steer)
- [ ] Structured with addressable sections (XML tags / Markdown headers)
- [ ] Volatile content (per-user/per-request data, timestamps) is appended AFTER the stable prefix,
      not interleaved before it (prompt-cache stability)

## 3. Tool set check
- [ ] No two tools have overlapping purpose without an explicit disambiguation rule
- [ ] Every tool description states both what it does and when to use it
- [ ] Tool count justified — each one earns its context cost, not "might be useful"

## 4. Few-shot audit
- [ ] Examples are canonical/diverse, not an exhaustive edge-case list
- [ ] Count: ____ examples (if >5–6, justify why exhaustiveness is required here)

## 5. Retrieval timing
- [ ] Data is loaded just-in-time (reference + on-demand fetch), not pre-loaded speculatively
- [ ] If pre-loaded: justified because the task genuinely needs everything upfront — state why: ____

## 6. Long-horizon strategy (multi-turn / autonomous loops only)
- Strategy chosen: [ ] compaction [ ] structured note-taking [ ] sub-agent isolation [ ] none (single-turn)
- [ ] If none of the three and the loop is long-running, this is a gap — pick one
- [ ] If sub-agent isolation: each sub-agent returns a condensed summary, not raw transcript

## 7. Context flooding check
- Context loaded for the current task: ____ lines (target <2,000 focused; >5,000 is flooding)
- [ ] Trimmed to task-scoped files/sections, not the whole repo/spec

## 8. Prune-before-add gate
Before adding anything new to the harness:
- [ ] At least one existing component was evaluated for removal in the same pass
- [ ] If nothing was removed, state why growth is net-positive this time: ____
- [ ] Regression eval suite run before this change: [ ] yes — result: ____ [ ] no (blocker — run it)
- [ ] Regression eval suite run after this change: [ ] yes — result: ____ [ ] no (blocker — run it)

## 9. Model-upgrade re-check (run this whenever the underlying model changes)
- [ ] Re-tested whether scaffolding built to compensate for a weaker model is still needed
- [ ] Any instruction removed as a result: ____ (or "none — justified below": ____)

## Sign-off
- [ ] This worksheet reflects the harness as it will ship, not as originally planned
- [ ] Net token delta for this change: ____ (+/-) — net-negative or net-zero is the target
