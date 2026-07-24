# Structured Outputs

Purpose: Turn "the model must return JSON matching this shape" or "this tool call must have valid
arguments" into a concrete generation mechanism — constrained decoding, reask/retry, or
provider-native strict mode — schema-first (Zod/Pydantic), with a named library/provider pick and
what NOT to reach for.

Read when:
- The request needs a model response to conform to a schema: extraction, classification, tool-call
  arguments, a typed final answer consumed by downstream code.
- An existing "ask the model to output JSON" approach is failing intermittently (malformed JSON,
  missing keys, hallucinated enum values).

Skip when:
- The ask is the tool-call loop itself (when to call, how to feed results back, termination) — →
  `agent-construction.md` (this ref owns only the argument/output *schema conformance*, not the loop).
- The ask is grading whether the *content* of a structured output is correct, not whether its *shape*
  is valid — → `evaluation.md`.
- The ask is a self-hosted inference stack decision (which engine, GPU sizing) — → backend/operate;
  this ref names which engines embed constrained decoding, not how to run them.

Inputs:
- Whether the target is a hosted API (OpenAI/Anthropic/etc.) or a self-hosted/open-weight model —
  decides whether provider-native strict mode is even available.
- Whether logit/token-level access exists — decides whether constrained decoding is possible at all.
- The failure tolerance: does a bounded retry (non-zero failure probability) suffice, or is a hard
  syntactic guarantee required (e.g., feeding a downstream parser that will crash on malformed input).

Produces: a named structured-output mechanism (one of the three legs below) wired to a schema
(Zod/Pydantic), a retry/validation strategy if using reask/retry, and — for tool calls specifically —
confirmation that argument conformance is enforced the same way as final-output conformance.

## Contents
- Schema-first, regardless of mechanism
- The three legs
- Decision table
- Tool-arg conformance = the same problem
- Token economics: YAML over JSON
- What NOT to build

## Procedure

### 1. Schema-first, regardless of mechanism
Every approach surveyed converges on the same interface: define the shape once as a **Pydantic model
(Python) or Zod schema (TS)**, then let the mechanism (not hand-written parsing) enforce it. This is
the near-universal convention across frameworks (Pydantic AI, Instructor, CrewAI's `output_pydantic`,
Semantic Kernel's `response_format`, the OpenAI/Anthropic SDKs) — the schema is the contract; pick the
*mechanism* that enforces it, don't hand-roll regex/string-parsing on top of a free-text response.

### 2. The three legs
Two genuinely different mechanisms, plus the provider-native convergence of both ideas:

- **Constrained decoding** — the schema constrains the token-sampling distribution *during*
  generation; output is syntactically guaranteed valid, no malformed JSON is possible even from small
  models that can't reliably follow "output valid JSON" instructions. Requires logit/token-level
  access — native to self-hosted inference, needs explicit provider support for hosted APIs.
  Reference implementations: **Outlines** (dottxt-ai/outlines, Apache-2.0) — typed-extraction style,
  `model(prompt, output_type)`, provider-independent across OpenAI/Ollama/vLLM/Transformers/
  llama.cpp, and now embedded *inside* vLLM's own structured-output support, making it a de facto
  inference-layer standard even for people who never call it directly. **Guidance**
  (guidance-ai/guidance, MIT, Microsoft-backed) — constrained decoding plus interleaved control flow
  (`lm += gen("field", regex=r"\d+")` mixed with Python conditionals/loops in one program) — pick over
  Outlines specifically when generation needs to be interleaved with logic, not just typed.
- **Reask/retry** — relies on the model's native tool-calling/JSON mode to produce output, then
  validates against the schema post-hoc; on failure, re-prompts with the validation error appended
  and retries up to a bound. No logit access needed, works with any hosted API that supports
  tool-calling — but not guaranteed, only bounded (non-zero failure probability after max retries).
  Reference implementation: **Instructor** (567-labs/instructor, formerly jxnl/instructor, MIT) —
  `response_model=User`, `max_retries=3`, provider-agnostic adapters
  (`instructor.from_provider("openai/gpt-4o-mini")`-style). Instructor explicitly positions itself as
  "structured-output-only" and defers to a full agent framework (e.g. Pydantic AI) once the use case
  grows into agent/eval/observability territory — a clean boundary marker for which tool to reach for.
- **Provider-native strict mode** — the provider applies JSON-Schema-constrained decoding inside its
  own inference, no third-party dependency. **OpenAI**: `"strict": true` inside the `json_schema`
  response-format config (Chat Completions and Responses APIs) — guarantees no omitted required keys
  or hallucinated enum values; first request with a new schema pays schema-compilation latency,
  subsequent requests with the same schema don't (as of 2026-07-25, developers.openai.com/api/docs/
  guides/structured-outputs — re-verify model support list, e.g. legacy `gpt-4-turbo` falls back to
  non-strict JSON mode). **Anthropic**: `output_config: {format: {type: "json_schema", schema: ...}}`
  for full-response structured output, plus `strict: true` on individual tool definitions for
  tool-argument conformance specifically; `client.messages.parse()` (Python/TS) is the typed
  convenience wrapper, directly analogous to OpenAI's Pydantic/Zod-typed `.parse()` helpers (as of
  2026-07-25 — re-verify against platform.claude.com/docs before citing exact field names, this
  surface moves fast).

### 3. Decision table
| Leg | Guarantee | Needs | Pick when |
|---|---|---|---|
| Constrained decoding (Outlines/Guidance) | Syntactic, hard | Logit access (self-hosted or inference-engine support) | Open-weight/local model, small model that can't follow JSON instructions, or already on vLLM |
| Reask/retry (Instructor) | Bounded (non-zero failure) | Tool-calling-capable hosted API | Hosted-API-only stack, fastest to wire up, provider-agnostic portability matters |
| Provider-native strict | Syntactic, hard, per-provider | Direct API use of that provider | Single-vendor direct integration, want the guarantee without an extra library |

Guardrails AI's "generate structured data" feature (validator-composition applied to structured-output
correctness) is a fourth, hybrid flavor worth knowing about but not a first-class leg — it overlaps
both the guardrails and structured-output clusters; see `guardrails-and-safety.md`.

### 4. Tool-arg conformance = the same problem
"Tools are just structured outputs" (12-Factor Agents, Factor 4, humanlayer/12-factor-agents, code
Apache-2.0 / essays CC BY-SA 4.0) — a tool call is nothing more than the model emitting validated
structured data against the tool's parameter schema. This is why the same three legs apply: a tool
definition's parameter schema is enforced by constrained decoding, reask/retry, or provider-native
strict mode exactly like a final-answer schema. See `agent-construction.md` for the tool-contract
shape (typed schema + validate-and-retry) and the loop that consumes the call; this ref owns only the
conformance mechanism.

### 5. Token economics: YAML over JSON
For structured output where token cost matters (long extraction schemas, high-volume batch jobs),
**YAML is measurably fewer tokens than JSON** for the same structure — no repeated quote/brace/comma
punctuation — and is a legitimate first-class reliability/cost lever, not a cosmetic choice (Chip
Huyen, x.com/chipro/status/1787539138562204126, 2024, from production LLM-deployment lessons).
Constrained-decoding and reask/retry libraries both support YAML output schemas; provider-native
strict-JSON-Schema modes are JSON-only by definition — factor this into the leg choice when per-call
token cost at scale is the binding constraint (cross-ref `observability-and-cost.md` for the $ math).

### 6. What NOT to build
- Don't hand-roll post-hoc regex/string-parsing extraction on a free-text response when any of the
  three legs is available — this is the exact anti-pattern all three exist to replace.
- Don't reach for a full constrained-decoding stack (Outlines/Guidance/self-hosted vLLM) just to solve
  a hosted-API structured-output need — provider-native strict mode or Instructor is simpler and
  sufficient; constrained decoding earns its complexity when logit access is already available or a
  hard guarantee on a small/local model is the actual requirement.
- Don't treat schema conformance as correctness — a syntactically valid JSON object can still be
  semantically wrong; structured-output enforcement and structured-output *evaluation* (JSON-
  correctness as an eval metric) are complementary, not redundant — see `evaluation.md`.

## Validation
- [ ] Schema is defined once (Pydantic/Zod), not duplicated across a prompt string and validation code.
- [ ] Mechanism is named explicitly (constrained decoding / reask-retry / provider-native), not
      "we ask the model to output JSON" with no enforcement.
- [ ] If reask/retry: `max_retries` is bounded and the validation error is fed back verbatim, not a
      generic "try again."
- [ ] If provider-native strict: model/version is confirmed to support strict mode (not all do).
- [ ] Tool-call arguments are validated the same way as final-answer output, not treated as a special
      case.
- [ ] Schema conformance is not conflated with content correctness — a separate eval exists for the
      latter.

## Failure modes and handoff
- **The real ask is the agent loop that calls the tool, not the argument schema** — →
  `agent-construction.md`.
- **The real ask is whether the structured output's *content* is right** — → `evaluation.md`.
- **Structured output feeds a self-hosted inference decision (which engine, sizing)** — → backend/
  operate; this ref only names which engines embed which mechanism.
- **Provider strict-mode support/field names are version-sensitive** — fetch current docs before
  generating config code; both OpenAI's and Anthropic's structured-output surfaces have moved host/
  API shape recently (see re-verify notes in §2).
