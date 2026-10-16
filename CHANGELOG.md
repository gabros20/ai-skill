# Changelog

All notable changes to **ai** are documented here.

The release procedure synchronizes `.codex-plugin/plugin.json`, this changelog, git tag
`v<version>`, and the matching GitHub Release. Runtime `SKILL.md` contains no version metadata.

## [Unreleased]

### Added
- **Cost-per-success model picking** (`model-selection-and-routing` §1b): `R`/`C`/`C/R` per
  (model, harness, effort), a rotated private task set, a running Pareto, and a launch/shortlist/
  quarterly cadence; scorecard gains a cost-per-success block. Image/video generation routing on
  its own meter.
- **Reading a published score** (`evaluation` §8): variant, harness, independent-vs-vendor, and
  still-trusted checks; preference arenas as taste only.
- **Open-web and vertical retrieval as agent tools** (`retrieval-and-rag` §7): the five search jobs
  plus vertical lookup, a routing table, two web tools + one tool per vertical index, an
  excerpts-first stop rule, deep research as an async capped job, separate meters.
- **Computer-use agents** (`surface-autonomous-agent` §5, `tool-and-mcp-integration` §2):
  tools-first, GUI-fallback, owned sandbox, untrusted screen content, screenshot budgeting,
  long-horizon failure honesty, loop-ownership and license read of the OSS layers.
- Tool fees as their own cost line and $ per successful task (`observability-and-cost` §4).

### Fixed
- MoE self-host sizing: memory follows *total* parameters (every expert is resident); active
  parameters set per-token speed. Added the four-question sizing method and the shared-prefix-cache
  isolation flag.
- Model-selection §1 no longer names a provider lineup (the named models had gone legacy) and
  restates the tier price spread as "an order of magnitude or more", dated and illustrative
  (~40× flagship-to-fast, ~100× top-to-fast on Anthropic's models page, 2026-10-17), replacing the
  stale "5–10×".
- OSS web/browser license flags consolidated into one table (`retrieval-and-rag` §7); Crawl4AI's
  appended attribution requirement stated.

## [0.1.0] — 2026-07-25

### Added
- Initial release of the `ai` skill — the model-powered / intelligence layer of the Digital Product
  Skills family, peer of `frontend`/`backend`. A faceted router over 10 primary jobs
  (model-selection-and-routing, prompt-and-context-engineering, structured-outputs,
  tool-and-mcp-integration, agent-construction, retrieval-and-rag, memory, evaluation,
  guardrails-and-safety, observability-and-cost) and 5 deployment surfaces (chat-assistant,
  autonomous-agent, rag-app, batch-and-pipeline, and the additive multi-agent overlay). 16
  references, 9 fillable assets (model-selection scorecard, OTel-GenAI observability checklist,
  context-budget worksheet, agent-loop & tool-contract checklist, RAG-pipeline checklist,
  eval-harness starter, LLM-judge rubric template, guardrails controls checklist, `handoff.yaml`),
  and activation/traversal/output/compression evals.
- Evaluation is the flagship job. The through-line is **verify-and-subtract, not just assemble**:
  prune the harness, budget tokens, decompose the judge, distrust benchmarks, prove retrieval, and
  decide when not to multi-agent.
- **Anti-staleness is the flagship invariant** — every model, price, version, and spec fact is
  date-stamped and re-verified against the live source; the `handoff.yaml` carries a `volatile_facts`
  block so frozen values can't leak downstream. Distinctive value-add: token/cost economics + model
  and tooling licensing (open ≠ open-source; BSL/SSPL/ELv2/open-core). Provider-, model-, and
  language-agnostic; consumes architecture's contracts/threat-model and hands running behavior +
  eval suites + telemetry to `quality`/`operate`.

[0.1.0]: https://github.com/gabros20/ai-skill/releases/tag/v0.1.0
