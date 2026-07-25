# Claude Code repository guide

This is the released `ai-skill` (runtime skill `ai`, under `skills/ai/`). Read [AGENTS.md](AGENTS.md)
for the ownership boundary and non-negotiable invariants — especially **retrieval-first /
anti-staleness**: never present a model name, price, version, or spec revision as fact without
date-stamping it and re-verifying against the live source.

Run `scripts/check-sync` before any release. Keep `SKILL.md` the router; keep versions out of it.
