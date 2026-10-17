# Changelog

All notable changes to **ai** are documented here.

The release procedure synchronizes `.codex-plugin/plugin.json`, this changelog, git tag
`v<version>`, and the matching GitHub Release. Runtime `SKILL.md` contains no version metadata.

## [Unreleased]

### Added
- **Voice overlay** (`surface-voice`, additive, stacks on chat-assistant or autonomous-agent):
  cascade vs native speech-to-speech vs hybrid per node; STS failure modes (session caps and
  reconnect, fixed voice, audio/transcript divergence, quadratic input on token-billed sessions);
  latency at the caller's ear with endpointing and LLM first token dominating; three end-of-turn
  detector types, eager end-of-turn as an LLM-cost multiplier, STT finalization; interruption as
  the false-yield / swallowed-interruption pair with history holding only what was heard; speech
  components picked on language per mode, finalization and billing unit (Hungarian as the worked
  case, turn detection the binding constraint); a speech-layer cost formula; audio evals in noise
  with a calibrated judge; call guardrails outside the model; voice licence flags. Router row,
  `backend` decline for voice transport, `success`/`marketing` decline for support-line policy and
  call consent, a voice `downstream_requirements` row in `handoff`, and voice evals.

## [0.3.0] — 2026-10-17

### Added
- **Governed memory** (`memory` §2b), for all four philosophies: the memory record's fields, a
  candidate-is-never-authority write path, scope from the authenticated caller, instruction-beats-
  preference, no inferred sensitive traits, forget propagation to derived vectors/summaries/caches/
  checkpoints, gated procedural memory; grounded in OWASP's memory-poisoning guidance.
- **Routing is seven decisions** (`model-selection-and-routing` §2): workflow, model/effort, tool
  discovery, skill, retrieval, delegation, review/repair, each with its failure to measure; hard
  eligibility filters before any learned router (narrow, never grant); decision-model adapters for
  routing only, calibrated per category; resolved route recorded per run, fail closed.
- **Media meters** (`model-selection-and-routing` §2): keep the billing unit (image / megapixel /
  second), regular rate not promo, $ per accepted asset, copy outputs before provider retention.
- **Router rollout** (`evaluation` §9): baseline → shadow → label → canary → promote on cost per
  successful task, with a versioned policy and rollback.
- **One primary loop per request** (`agent-construction` §8) plus dated status notes (DeepAgents
  local shell has no isolation; Mastra Durable Agents beta, Temporal runner experimental;
  LlamaIndexTS and workflows-ts archived).
- **Subagent contract** (`surface-multi-agent` §4): typed definition, grants narrow never widen,
  references not transcripts, serialize conflicting writes, a second model is not proof.
- **Capability registry and grant-filtered discovery** (`tool-and-mcp-integration` §1).
- **Telemetry content policy** and meter-unit traps (`observability-and-cost` §1, §4); OTel
  checklist grows to 18 controls.
- OWASP abuse-case matrix as repeatable agent red-team cases (`guardrails-and-safety` §4).
- **Completeness**: four downstream requirement rows in `handoff` (external-action safety, isolated
  execution, approval and reconnect, scoped retrieval and deletion) mirrored as
  `downstream_requirements` in `assets/handoff.yaml`; a component-coverage line ("decision or
  N/A because …") in the Validation of all four base surfaces and the multi-agent overlay.

### Changed
- **Memory starting default** (`memory` §2): explicit, user-editable preference records first;
  mem0-style inferred memory only once a recall eval shows it helps without storing wrong or
  excessive facts (was: start with mem0 fact extraction).

## [0.2.0] — 2026-10-17

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

[0.3.0]: https://github.com/gabros20/ai-skill/releases/tag/v0.3.0
[0.2.0]: https://github.com/gabros20/ai-skill/releases/tag/v0.2.0
[0.1.0]: https://github.com/gabros20/ai-skill/releases/tag/v0.1.0
