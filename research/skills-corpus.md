# `ai` skill — Skills-Discovery Channel Corpus

Research channel: **skills discovery** (existing AI/agent SKILLS on skills.sh + local `~/.claude/skills`).
Purpose: find donor skills to LIFT for the `ai` ("AI Systems") faceted-router skill, and detect any existing unified "ai"/"agent-engineering" mega-skill (the wedge).
Method: ~27 `npx skills find` sweeps (Opus orchestrator) → 3 Sonnet deep-read workers → aggregation.
Status: **DRAFT — discovery complete, worker deep-reads landing.** Every claim carries a source link.

---

## (b) THE WEDGE — is there already a unified `ai` / agent-engineering mega-skill?

**No.** High confidence. The scope our `ai` skill claims (model/provider selection → routing/fallback → prompt & context architecture → agents/tool-use/MCP → RAG behavior → evals → guardrails → AI observability) is **not** owned by any single skill on skills.sh.

Evidence — targeted wedge sweeps returned only narrow or off-target skills:
- `"ai systems"` → design-systems / ddia-systems / systems-thinking (nothing AI-systems). 
- `"ai product"` → paper-reproduction, product-photoshoot (off-target).
- `"ai stack"` → fullstack-dev, tanstack-ai (off-target).
- `"agent-engineering"` closest pretenders: [affaan-m/everything-claude-code@agentic-engineering](https://skills.sh/affaan-m/everything-claude-code/agentic-engineering) (5.6K installs) and [doanchienthangdev/omgkit@ai-engineering](https://skills.sh/doanchienthangdev/omgkit/ai-engineering) — both narrow single-topic, not faceted routers (pending worker confirmation).

What DOES exist instead: **vendor SDK collections** — multiple single-purpose skills under one repo, each covering one product surface, no router:
- [langchain-ai/langchain-skills](https://skills.sh/langchain-ai/langchain-skills) — ecosystem-primer, deep-agents-memory, langgraph-persistence, langgraph-human-in-the-loop, langgraph-cli, managed-deep-agents.
- [vercel/ai](https://skills.sh/vercel/ai/ai-sdk) — ai-sdk, migrate-ai-sdk-v6-to-v7.
- [firebase/agent-skills](https://skills.sh/firebase/agent-skills/firebase-ai-logic) — firebase-ai-logic, firebase-ai-logic-basics.
- [botpress/skills](https://skills.sh/botpress/skills/adk-evals), [letta-ai/skills](https://skills.sh/letta-ai/skills/letta-configuration), [togethercomputer/skills](https://skills.sh/togethercomputer/skills/together-embeddings), [launchdarkly/agent-skills](https://skills.sh/launchdarkly/agent-skills/online-evals).

**Read:** the wedge is wide open — same pattern that held for backend/frontend/architecture. Opportunity = the *faceted router* that unifies these fragmented single-topic skills into job→surface navigation. No competitor owns the seam-spanning "AI Systems" concept.

---

## (a) Donors table (discovery-level; lift-worthiness enriched by workers)

Install counts as reported by `npx skills find` on 2026-07-25. Lift-worthiness: HIGH / MED / LOW / SEAM (peer-turf reference only).

| Skill | URL | Installs | What it teaches | Lift |
|---|---|---|---|---|
| anthropics/skills@mcp-builder | https://skills.sh/anthropics/skills/mcp-builder | 93.6K | Build MCP servers (also installed locally) | SEAM (backend) |
| firebase/agent-skills@firebase-ai-logic-basics | https://skills.sh/firebase/agent-skills/firebase-ai-logic-basics | 76.3K | Firebase AI Logic provider integration | MED |
| vercel/ai@ai-sdk | https://skills.sh/vercel/ai/ai-sdk | 43.1K | AI SDK: providers, streaming, tools, structured output, agents, embeddings | HIGH |
| firebase/agent-skills@firebase-ai-logic | https://skills.sh/firebase/agent-skills/firebase-ai-logic | 34.1K | Firebase AI provider integration (advanced) | MED |
| wshobson/agents@prompt-engineering-patterns | https://skills.sh/wshobson/agents/prompt-engineering-patterns | 18.5K | Prompt engineering patterns/templates | HIGH |
| addyosmani/agent-skills@context-engineering | https://skills.sh/addyosmani/agent-skills/context-engineering | 14.5K | Context-window architecture / context engineering | HIGH |
| langchain-ai/langchain-skills@deep-agents-memory | https://skills.sh/langchain-ai/langchain-skills/deep-agents-memory | 13K | Agent memory patterns | HIGH |
| langchain-ai/langchain-skills@langgraph-persistence | https://skills.sh/langchain-ai/langchain-skills/langgraph-persistence | 11.8K | Durable agent state / checkpointing | MED/SEAM |
| langchain-ai/langchain-skills@langgraph-human-in-the-loop | https://skills.sh/langchain-ai/langchain-skills/langgraph-human-in-the-loop | 11.3K | HITL interrupt/approval pattern | HIGH |
| github/awesome-copilot@agentic-eval | https://skills.sh/github/awesome-copilot/agentic-eval | 9.9K | Agentic evaluation | HIGH |
| github/awesome-copilot@ai-prompt-engineering-safety-review | https://skills.sh/github/awesome-copilot/ai-prompt-engineering-safety-review | 9.9K | Prompt safety review | HIGH |
| wshobson/agents@llm-evaluation | https://skills.sh/wshobson/agents/llm-evaluation | 9.4K | LLM evaluation methodology | HIGH (flagship) |
| github/awesome-copilot@create-llms / update-llms | https://skills.sh/github/awesome-copilot/create-llms | 9K / 8.7K | llms.txt authoring | LOW |
| affaan-m/everything-claude-code@agentic-engineering | https://skills.sh/affaan-m/everything-claude-code/agentic-engineering | 5.6K | Agentic engineering practices | MED (wedge probe) |
| affaan-m/everything-claude-code@ai-first-engineering | https://skills.sh/affaan-m/everything-claude-code/ai-first-engineering | 5.3K | AI-first eng workflow | LOW |
| trailofbits/skills@agentic-actions-auditor | https://skills.sh/trailofbits/skills/agentic-actions-auditor | 4.9K | Audit agentic actions (security) | SEAM (quality/security) |
| langchain-ai/deepagents@langgraph-docs | https://skills.sh/langchain-ai/deepagents/langgraph-docs | 4.2K | LangGraph docs primer | LOW |
| vercel/chat@chat-sdk | https://skills.sh/vercel/chat/chat-sdk | 4.5K | Chat app scaffold | SEAM (frontend) |
| langchain-ai/langchain-skills@langgraph-cli | https://skills.sh/langchain-ai/langchain-skills/langgraph-cli | 3.7K | LangGraph CLI | LOW |
| muratcankoylan/...context-engineering-collection | https://skills.sh/muratcankoylan/agent-skills-for-context-engineering/context-engineering-collection | 3.1K | Context engineering collection | MED |
| langchain-ai/langchain-skills@ecosystem-primer | https://skills.sh/langchain-ai/langchain-skills/ecosystem-primer | 2.7K | LangChain ecosystem map | MED |
| launchdarkly/agent-skills@aiconfig-online-evals | https://skills.sh/launchdarkly/agent-skills/aiconfig-online-evals | 2.5K | Online evals via feature flags | HIGH |
| qodex-ai/ai-agent-skills@multi-agent-orchestration | https://skills.sh/qodex-ai/ai-agent-skills/multi-agent-orchestration | 1.9K | Multi-agent orchestration | HIGH |
| refoundai/lenny-skills@ai-evals | https://skills.sh/refoundai/lenny-skills/ai-evals | 1.7K | AI evals (PM lens) | MED |
| launchdarkly/agent-skills@online-evals | https://skills.sh/launchdarkly/agent-skills/online-evals | 1.6K | Online eval methodology | HIGH |
| botpress/skills@adk-evals | https://skills.sh/botpress/skills/adk-evals | 1.4K | Agent Dev Kit evals | MED |
| huggingface/skills@huggingface-community-evals | https://skills.sh/huggingface/skills/huggingface-community-evals | 1.2K | HF community eval harness | MED |
| arize-ai/phoenix@phoenix-evals | https://skills.sh/arize-ai/phoenix/phoenix-evals | 984 | Phoenix eval framework (traces + evals) | HIGH |
| neolabhq/context-engineering-kit@prompt-engineering | https://skills.sh/neolabhq/context-engineering-kit/prompt-engineering | 991 | Prompt eng + reflect + reasoning | MED |
| jpoindexter/design-and-ai-skills@model-routing-and-fallback | https://skills.sh/jpoindexter/design-and-ai-skills/model-routing-and-fallback | (low) | Model routing + fallback logic | HIGH |
| truefoundry/tfy-agent-skills@guardrails | https://skills.sh/truefoundry/tfy-agent-skills/guardrails | 14 | Guardrails config | MED |
| patricio0312rev/skills@guardrails-safety-filter-builder | https://skills.sh/patricio0312rev/skills/guardrails-safety-filter-builder | 218 | Safety filter builder | MED |
| patricio0312rev/skills@structured-output-extractor | https://skills.sh/patricio0312rev/skills/structured-output-extractor | 242 | Structured output extraction | MED |
| shipshitdev/library@llm-structured-output | https://skills.sh/shipshitdev/library/llm-structured-output | 42 | Structured output schema patterns | MED |
| latestaiagents/agent-skills@hybrid-retrieval | https://skills.sh/latestaiagents/agent-skills/hybrid-retrieval | 44 | Hybrid RAG retrieval | MED |
| latestaiagents/agent-skills@rag-evaluation | (search) | — | RAG eval | MED |
| goodnight77/rag-skills@rag-skills | https://skills.sh/goodnight77/rag-skills/rag-skills | 11 | RAG patterns | MED |
| timescale/pg-aiguide@postgres-hybrid-text-search | https://skills.sh/timescale/pg-aiguide/postgres-hybrid-text-search | (low) | Postgres hybrid search | SEAM (data/backend) |
| togethercomputer/skills@together-embeddings | https://skills.sh/togethercomputer/skills/together-embeddings | (low) | Embeddings via Together | MED |
| mem0ai/mem0@mem0-vercel-ai-sdk | https://skills.sh/mem0ai/mem0/mem0-vercel-ai-sdk | 295 | Long-term memory layer | MED |
| posthog/ai-plugin@instrument-llm-analytics | https://skills.sh/posthog/ai-plugin/instrument-llm-analytics | (low) | LLM analytics instrumentation | HIGH (observability) |
| elastic/agent-skills@observability-llm-obs | https://skills.sh/elastic/agent-skills/observability-llm-obs | (low) | LLM observability | HIGH (observability) |
| semgrep/skills@llm-security | https://skills.sh/semgrep/skills/llm-security | (low) | LLM security scanning | SEAM (quality/security) |
| getsentry/sentry-for-ai@sentry-sdk-setup | https://skills.sh/getsentry/sentry-for-ai/sentry-sdk-setup | (low) | Sentry AI monitoring | SEAM (operate) |
| letta-ai/skills@letta-configuration | https://skills.sh/letta-ai/skills/letta-configuration | (low) | Stateful agents / memory (MemGPT) | MED |
| langwatch/skills@evaluate-multimodal | https://skills.sh/langwatch/skills/evaluate-multimodal | 11 | Multimodal eval | MED |

### Local `~/.claude/skills` AI-adjacent assets (lift-for-free candidates)
- **vercel:ai-sdk** (installed) — full Vercel AI SDK skill: providers, streaming, structured output, tool calling, agents, MCP, embeddings, reranking, image gen. (worker W3 reading)
- **vercel:ai-gateway**, **vercel:vercel-agent**, **vercel:workflow** — Vercel AI Gateway / agent / durable workflow skills.
- **agents-sdk** — Cloudflare Agents SDK (stateful agents, durable workflows, MCP servers, voice agents).
- **mcp-builder** (anthropics) — MCP server construction.
- **cloudflare** — Workers AI, Vectorize, Agents SDK section.
- **claude-api** — Anthropic model ids/pricing/tool-use/caching reference.
- **dataviz**, **generate-image/video** — adjacent, not AI-systems.

---

## (b') Existing mega-skill probes — detail
Pending worker W1 read of affaan-m/agentic-engineering and langchain ecosystem-primer to confirm neither is a faceted router.

---

## (c) Recurring patterns/shapes across AI skills
_Pending worker deep-reads. Preliminary from discovery:_
- Vendor-collection shape dominates: one repo, many single-purpose skills, no router (langchain-ai, vercel, firebase, botpress, launchdarkly, togethercomputer).
- Eval is the most-populated category with the most reputable donors (wshobson, awesome-copilot, launchdarkly, arize-ai/phoenix, langwatch, botpress, huggingface) — confirms eval as our flagship signal.
- Provider/SDK skills cluster around vendor lock-in (Vercel AI SDK, Firebase, Together) — our skill must be provider-neutral to differentiate.

---

## (d) Candidate primary-jobs & surfaces implied by what exists
_Pending worker synthesis. Preliminary job list implied by donor density:_
1. Select model/provider + routing & fallback/degradation (jpoindexter, vercel ai-sdk).
2. Architect prompts & context (wshobson prompt-patterns, addyosmani context-eng, neolabhq).
3. Produce structured/typed outputs (shipshitdev, patricio, vercel ai-sdk).
4. Build agents: loops, tool use, MCP-as-consumed, multi-agent (langchain deep-agents, qodex, agents-sdk).
5. Manage memory/personalization (mem0, letta, langchain deep-agents-memory).
6. RAG / retrieval behavior: embeddings, chunking, hybrid, rerank, retrieval eval (latestaiagents, goodnight77, together, timescale).
7. Evaluate: offline/online/regression/safety (wshobson, awesome-copilot, launchdarkly, phoenix, langwatch).
8. Guardrails / policy / HITL approval (truefoundry, patricio, langchain HITL).
9. AI observability / tracing / analytics (posthog, elastic, phoenix, sentry-for-ai).

Surfaces (per family convention, ~5): likely {chat/assistant, agent/tool-runner, RAG pipeline, batch/inference job, eval harness} — to be validated against other channels.

---

## (e) Notable quotes with attribution
_Pending worker deep-reads (exact SKILL.md quotes + attribution)._

---

## (f) Open questions
1. Is affaan-m/agentic-engineering or omgkit/ai-engineering actually seam-spanning, or narrow? (W1)
2. Which eval donor is most rigorous & lift-worthy — wshobson vs phoenix vs launchdarkly vs awesome-copilot? (W2)
3. Licenses on the high-lift donors (wshobson/agents, langchain-ai, addyosmani, vercel/ai, awesome-copilot) — MIT/Apache vs restrictive? (all workers)
4. How much does local vercel:ai-sdk already give us for free vs. needing provider-neutral rewrite? (W3)
5. Do we treat langgraph-persistence / durable state as ours or backend-seam? (borderline)
6. Surface taxonomy: does {chat, agent, RAG, batch, eval-harness} hold, or should surfaces be job-agnostic like other family skills?

---
_Sources: `npx skills find` sweeps 2026-07-25; skills.sh leaderboard; worker reports skills-1/2/3.md (in scratchpad/ai-research/reports/)._
