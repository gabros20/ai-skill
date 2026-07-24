# Changelog

All notable changes to **ai** are documented here.

The release procedure synchronizes `.codex-plugin/plugin.json`, this changelog, git tag
`v<version>`, and the matching GitHub Release. Runtime `SKILL.md` contains no version metadata.

## [Unreleased]

### Added
- Queue unreleased changes here.

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
