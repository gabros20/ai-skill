# `ai` (AI Systems) — Research Synthesis & Build Gate

**Date:** 2026-07-25 · **Author:** controller (main agent), from the 4-channel swarm.
**Inputs:** `research/ai/{skills,web-canon,github,x}-corpus.md` (+ 11 raw worker reports in
`scratchpad/ai-research/reports/`). ~16 agents, 4 Opus leads, 0 fatal relay hits.
**Purpose:** define the wedge, the router shape, invariants, distinctive value-add, policy rulings,
and the composition crew — for sign-off before any building.

---

## 1. The wedge (all 4 channels, high confidence) — OPEN

No unified `ai` / agent-engineering **faceted-router** skill exists. The market is:
- **Vendor SDK collections** — one repo, many single-purpose skills, no router (langchain-ai,
  vercel/ai, firebase, botpress, letta, togethercomputer).
- **Narrow single-topic skills** — one prompt pattern, one LangGraph mechanic, one eval harness.
- **Single-domain routers that prove the shape but not the scope** — `goodnight77/rag-skills`
  (RAG-only router), `arize-ai/phoenix` (eval-only router), `jpoindexter/design-and-ai-skills`
  (an ai-engineering *family*, still narrow per-skill).

Same open wedge that justified backend/frontend/architecture. **We build the language/provider/
model-agnostic superset router** — job → deployment-surface navigation across the whole AI-systems
craft. Closest pretenders (`affaan-m/…agentic-engineering`, `omgkit/ai-engineering`) are narrow, not
seam-spanning.

## 2. The distinctive through-line (x-channel's sharpest contribution, corroborated)

The field has settled **what** the pieces are (loop, harness, retrieval, evals, MCP) and is loud on
**adding** — more agents, more tools, more scaffolding — but near-silent on disciplined
**subtraction and accountability**. Evidence: sh_reya ("harness accretion raises cost + hurts
accuracy over a model cycle; nobody prunes"), trq212 ("we removed ~80% of the Claude Code system
prompt for newer models"), swyx/METR (">50% of SWE-bench passes are unmergeable slop"), omarsar0
("the hard part of multi-agent is getting agents to stay quiet").

**Positioning:** `ai` teaches **verify-and-subtract, not just assemble** — prune the harness, budget
the tokens, decompose the judge, distrust the benchmark, prove the retrieval, decide when *not* to
multi-agent. This is open, defensible ground and it cleanly respects the peer seams.

## 3. Recommended skill shape — faceted router (mirrors backend/frontend/architecture)

### Primary jobs (10) — pick one; evals is the ⭐ flagship
1. **model-selection-and-routing** — provider/tier choice, routing cascade, fallback/degradation,
   cost/latency/effort budget, open-vs-closed + self-host decision.
2. **prompt-and-context-engineering** — the harness: prompt→context engineering, attention budget,
   JIT retrieval, compaction, note-taking, progressive disclosure, caching-aware design; **harness
   hygiene / pruning**.
3. **structured-outputs** — constrained decoding vs reask/retry vs provider-native; schema (Zod/
   Pydantic) as the contract; tool-arg conformance.
4. **agent-construction** — the loop (model→tool→feed→repeat→stop), tool contracts (typed +
   validate-and-retry), MCP-as-consumed, termination, launch/pause/resume; **and multi-agent shapes**
   (agent-as-tool / handoff / crew / graph-with-agent-node) with an explicit *when NOT to multi-agent*.
5. **retrieval-and-rag** — chunking (contextual/late), embeddings, hybrid + RRF, cross-encoder rerank,
   agentic decomposition, vector-store selection (pgvector-default → dedicated at scale), retrieval eval.
6. **memory** — working/episodic/semantic/procedural; short-vs-long-term split; four philosophies
   (fact-store / temporal-KG / self-editing / ontology-graph).
7. **evaluation** ⭐ **FLAGSHIP** — error-analysis-first, LLM-as-judge (critique shadowing + jury +
   role-binding), offline/online/regression/safety, pass^k, three harness shapes, RAG-metric vocab.
8. **guardrails-and-safety** — structural rails / validator-composition / classifier moderation /
   code-exec / approval-gate; prompt self-verification; red-team.
9. **observability-and-cost** — OTel-GenAI semconv (`gen_ai.*`), trace/span, token/cost/latency/cache
   telemetry, online evals as production monitors.
10. **agentic-retrieval-harness / durable-execution** — *candidate 10th or fold into #4/#5*; durable
    run (Temporal/Inngest/Restate) leans SEAM (backend/operate) — see §6.

> Convergence check: web proposed 10 jobs, github 12, skills 9, x validated all as first-class. The
> 10 above consolidate github's "self-host inference" and "durable execution" into SEAM references
> (§6) rather than owned jobs — `ai` owns model *behavior*, not the serving substrate.

### Base surfaces (4) — deployment shape reshapes how every job applies; add at most one
Surfaces are the **system type**, per family convention (they point to job refs, don't redefine them):
- **surface-chat-assistant** *(default / simplest)* — interactive, streaming, conversational memory,
  human-in-loop; "start simplest" per Anthropic canon.
- **surface-autonomous-agent** — the long-horizon harness: loop + tools + context-compaction +
  durable execution + termination.
- **surface-rag-app** — retrieval-centric knowledge app; grounding, citations, freshness.
- **surface-batch-and-pipeline** — offline/at-scale classification/extraction; throughput,
  cost-per-item, no human in loop.

### Additive overlay (1) — stacks on top of any base surface (backend's additive-agentic mechanic)
- **surface-multi-agent** — when the system is *also* multi-agent, stack this on the base shape (a
  multi-agent RAG app = `surface-rag-app` + `surface-multi-agent`). Carries the orchestrator+scoped-
  specialists pattern **and the honest "when NOT to multi-agent" teaching** (coordination cost,
  token-chatter). *Additive — does not replace the base.*

### + Handoff reference (`handoff.yaml` companion; consumed by quality/operate/backend/frontend/data)

**Total ≈ 10 jobs + 5 surfaces + handoff ≈ 16 references** (backend shipped 15; comparable).

## 4. Universal invariants (load-bearing)

1. **Retrieval-first / anti-staleness — THE flagship structural stance (stronger here than anywhere).**
   The model/SDK/price/spec layer churns monthly. This very research caught the environment's own
   model cache stale within one cycle (Opus 4.8→Opus 5, "GPT-5"→GPT-5.6 Sol, AI SDK v6→v7, MCP
   2025-11-25→2026-07-28 RC). **Every model/price/version/spec fact is date-stamped + carries a
   re-verify instruction (pricing pages, `npm view`, HF cards, the spec changelog); never freeze
   names.** Teach the *method* of staying current, not a frozen snapshot.
2. **Implement inside the decision (the border).** `ai` owns behavior whose core uncertainty comes
   from a model. NOT: system shape/NFR/threat-model/build-vs-buy (→ architecture); serving substrate
   — MCP/tool *endpoints*, vector-store-as-served, gateways, durable-execution infra (→ backend);
   governed pipelines + vector store *as dataset* (→ data); deterministic multi-system workflows even
   when a step calls a model (→ automation); chat UI + streaming *render* (→ frontend); independent
   verification/red-team *gate* (→ quality); deploy/monitor *platform* (→ operate).
3. **Verify-and-subtract, not just assemble (the distinctive discipline).** Every recommendation
   names what to build, **what NOT to build, and what to remove**. Prune the harness; cap decisions
   at 3–5 per pass; treat the harness as a maintained artifact with regression discipline.
4. **Evals are the completion gate, not an afterthought.** Error-analysis-first; binary judges;
   align judge via precision/recall; offline+online+regression+safety; report pass^k for reliability.
   Distinct from quality's independent gate.
5. **Default-stack, then deviate.** Name the current modal default per layer (version-dated), but
   every rec = concrete pick + what-NOT + trade-off, weighted by reversibility. Adoption numbers are
   engagement, not gospel; **distrust benchmarks** (>50% SWE-bench slop).
6. **Cost is an architectural constraint from the first line.** Design for prompt caching first;
   routing cascade before caching before batch (flat 50%); effort/reasoning knobs; budget tokens
   (Jevons: cheaper ≠ less spend). Teach the per-model $ math + the licensing spread.
7. **Distinguish facts / decisions / assumptions / proposals; single-home facts.** Preserve upstream
   decisions or flag the conflict; prefer repo/artifact evidence; state unknowns as TBD.

## 5. Distinctive value-add (the backend-DB-license analog) — two-part

**A. Token/cost economics + model licensing (WINNER).** Version-verified per-model $ math (input/
output/cache-write/cache-read/batch multipliers), routing cascades, effort knobs — AND the open-
weight license spread: MIT/Apache (Qwen/DeepSeek/Mistral/GLM) vs Llama's use-restricted Community
License vs "Modified MIT" (Kimi). **"Open ≠ open-source license."** Concrete, decision-changing,
under-taught.

**B. The AI-tooling license cluster (BSL/SSPL/ELv2/open-core).** Restate (BSL 1.1), Inngest (SSPL),
Phoenix (Elastic License 2.0 + patent notice), Langfuse & litellm (open-core), Mastra `ee/`
(source-available), PurpleLlama (MIT code / restrictive model weights). Teach the **pattern**
("source-available, self-host yes / resell no, converts to Apache after N years"), not winners —
exactly backend's DB-license move.

**Structural differentiator (baked into invariant 1):** anti-staleness as a *taught method*.

## 6. Seams that need EXPLICIT decline rows (learning from backend v0.1.1 soft-note)

Backend's one smoke-test ding was an *implicit* border-decline. `ai` gets explicit "Not this skill →"
rows in the router from day one:
- Serving substrate (vLLM/Ollama/gateways, MCP *endpoints*, durable-execution infra) → **backend/operate**.
- Vector store *as governed dataset* / ETL pipeline populating it → **data**.
- System shape, NFR budgets, threat model, build-vs-buy of the AI subsystem → **architecture**.
- Chat UI, streaming *rendering*, error/recovery UX → **frontend**.
- Independent verification, red-team *as a gate*, release evidence → **quality**.
- Deploy, prod monitoring *platform*, incident response → **operate**.
- Deterministic multi-system workflow (even with one model step) → **automation**.

`ai` owns the **cognition**; it *references* the substrate rather than re-teaching it. RAG three-way
seam stated once, canonically: retrieval **behavior** (ai) vs vector-store-as-served-substrate
(backend) vs governed pipeline + dataset (data).

## 7. Load-bearing patterns to encode (reference content, source-linked in corpora)

Agent loop is boilerplate → differentiation is the harness · Model/Harness/Agent taxonomy · workflow-
vs-agent (Anthropic 5 patterns) · four multi-agent shapes · graph-vs-loop paired primitive · tool
contract = typed schema + validate-and-retry · CodeAgent vs JSON-tool-call fork · context engineering
(attention budget, JIT, compaction, note-taking, sub-agent isolation) · RAG 5-stage (contextual/late
chunk → hybrid+RRF → rerank → agentic decomp → eval retrieval+generation separately) · vector-store
decision (pgvector default) · 4 memory philosophies + short/long split · structured output 3 legs
(constrained-decode / reask-retry / provider-native, all schema-first) · evals (error-analysis-first,
critique shadowing, jury, role-binding, offline/online/regression/safety, pass^k, 3 harness shapes,
RAG-metric vocab) · guardrails 5-way taxonomy · observability (OTel-GenAI semconv, trace/span,
cost/cache telemetry) · token economics (caching-as-architecture, cascade, batch-50%, effort) ·
MCP-as-consumed (spec → SDK pin-v1 → FastMCP → registry).

## 8. Residual gaps to close during the build (do NOT block the gate)

1. **Re-verify the whole model/price/version layer at build time** — Opus 5 / GPT-5.6 / Gemini / Grok
   lineups, AI SDK version (`npm view ai version`), **MCP 2026-07-28 RC status** (most time-sensitive).
2. **Deep-read Microsoft Agent Framework** (live successor to AutoGen + Semantic Kernel) — likely a
   first-tier agent-construction donor; not in this pass's deep-read set.
3. **Multi-agent skeptic canon** (Cognition "Don't Build Multi-Agents", Anthropic multi-agent post) —
   represent the believer-vs-skeptic split with primary sources.
4. **Memory cognitive taxonomy** (working/episodic/semantic/procedural) is vendor-blog-sourced — find
   the canonical mapping before treating as settled.
5. **VRAM/self-host sizing** deliberately omitted (no chart fetched) — fetch a GGUF sizing table if the
   model-selection ref quotes numbers.
6. **OpenAI "Practical Guide to Building Agents" PDF** unextractable — re-fetch with a PDF tool if used.
7. **LMArena leaderboard** unfetchable via WebFetch (client-rendered) — browser-automate or omit; do
   not fabricate rankings.

## 9. Composition crew (Phase 3 — pending gate approval; mirrors backend)

6 Sonnet writers → 1 Opus integrator → 1 Opus review + 1 Sonnet eval → validated pack (check-sync).
Provisional writer split:
- **W1** model-selection-and-routing · observability-and-cost (the cost/licensing value-add spine)
- **W2** prompt-and-context-engineering · structured-outputs
- **W3** agent-construction · surface-multi-agent (+ when-NOT-to)
- **W4** retrieval-and-rag · memory
- **W5** evaluation ⭐ · guardrails-and-safety (the flagship pair)
- **W6** surfaces (chat-assistant/autonomous-agent/rag-app/batch-and-pipeline) · handoff
Integrator owns SKILL.md router + plugin + SOURCES + single-home cross-checks + explicit seam rows.
Gates before each fan-out. Per [[skill-build-drill]] + [[tokenomics-discipline]].

## 10. Open design decision for the gate

**The surface axis.** Two candidates surfaced: **deployment-shape** (my recommendation above — chat /
autonomous-agent / rag-app / batch + additive multi-agent, matching the family's "surface = system
type" convention) vs **lifecycle-phase** (github's Decide/Build/Evaluate/Harden/Operate — cleaner as
a *workflow* but breaks the family convention that surfaces are runtime types, and duplicates the
jobs). **Recommendation: deployment-shape** (consistent with backend/frontend/architecture; lifecycle
lives in the Core-workflow section instead). Flagging for explicit sign-off.
