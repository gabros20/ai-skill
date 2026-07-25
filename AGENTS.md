# Agent guide — `ai` (AI Systems)

This repository is the released `ai-skill`: an installable agent skill for building the model-powered
behavior of a product. The runtime skill lives under `skills/ai/`; the repository and Codex plugin
use the `-skill` suffix. Read this before editing.

## Ownership boundary (non-negotiable)

`ai` owns **behavior whose core uncertainty or capability comes from a model** — the cognition, not
the substrate. It owns model selection/routing, the prompt/context harness, structured outputs, tool
and MCP *consumption*, the agent loop, retrieval *behavior*, memory, evals, guardrails, and
AI-specific cost/observability. It does **not** own:

- system boundaries, NFR budgets, threat model, build-vs-buy of the AI subsystem → **architecture**
- serving substrate: MCP/tool *endpoints*, vector-store-as-served, gateways, durable-execution infra → **backend**
- the governed pipeline + the vector store *as a dataset* → **data**
- chat UI and streaming *render* → **frontend**
- independent verification / red-team *as a release gate* → **quality**
- deploy and the monitoring *platform* → **operate**
- deterministic multi-system workflows, even when one step calls a model → **automation**

`ai` *references* those substrates; it does not re-teach or override them. It works standalone and
never silently invokes a sibling skill.

## Non-negotiable invariants

1. **Retrieval-first / anti-staleness — the flagship.** The model/SDK/price/spec layer changes
   monthly. Every model name, price, version, and spec revision is date-stamped and re-verified
   against the live source before use; never freeze a volatile fact, and never assert one as
   "verified-live" inside a static doc. This is the single easiest way to ship a wrong skill — treat
   any model table (including this repo's) as illustrative until re-checked.
2. **Implement inside the decision.** Consume upstream artifacts (contracts, NFR budgets, threat
   model, `handoff.yaml`); when none exist, say so rather than inventing them.
3. **Verify-and-subtract, not just assemble.** Every recommendation names what to build, what NOT to
   build, and what to remove. Cap each pass at 3–5 decisions.
4. **Evals are the completion gate, not an afterthought.** Never assert "it works" from memory;
   report `pass^k` for reliability. Distinct from `quality`'s independent gate.
5. **Cost is architectural.** Design for prompt caching first; order the levers (cascade → cache →
   batch → effort). Teach the per-model $ math and the model/tooling license spread.

## Required behavior

1. Run `scripts/check-sync` (and `scripts/lint-skill`) before any release; never replace the generic
   gate with domain-only checks.
2. Keep runtime frontmatter to `name` and `description`. Versions/metadata live in
   `.codex-plugin/plugin.json`, `CHANGELOG.md`, tags, and releases — never in `SKILL.md`.
3. Keep `SKILL.md` the direct router: one primary job × ≤1 base surface (+ additive multi-agent
   overlay), plus the "Not this skill →" decline table. References are flat, directly linked,
   self-describing, loaded only when their conditions apply.
4. Every reference begins with `Purpose / Read when / Skip when / Inputs / Produces`; add a
   `## Contents` when it exceeds ~100 lines. Dense is acceptable; some refs intentionally exceed the
   2,500-token soft ceiling.
5. Exhaustive-coverage artifacts (guardrail controls, license flags, OTel fields) are uniform tables
   with a self-audit count, never a narrative.
6. Keep repository docs, eval fixtures, research, and site assets outside `skills/ai/`.
7. Release through matching plugin version, changelog entry, tag, and GitHub Release; set the GitHub
   About area (family-style description, canonical site alias as homepage, base + domain topics).

Do not mark the repository complete because structural lint passes. Activation, traversal, and output
evaluations must show the skill changes agent behavior usefully.
