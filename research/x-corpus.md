# AI Systems skill — X / practitioner-discourse corpus

**Channel:** X/Twitter practitioner discourse (what people actually ship + believe), for building the `ai` (AI Systems) faceted-router skill.
**Method:** 5 serial `xrelay batch` sweeps (65 keyword/`from:` queries), deduped into one archive of **1,117 unique tweets**. All 65 queries succeeded; **0 fatal rate-limit hits** (X imposed several `retryAfterMs` backoffs mid-run, all absorbed internally by `batch`, no query failed). Ranked offline on engagement (likes + 3·replies + 2·bookmarks) + author authority; aggressively filtered engagement-farm content.
**Corpus window:** posts span 2023 → Jul 2026; the bulk of high-signal material is Q4 2025 – Jul 2026 (current models referenced: Claude Opus 5 / Fable 5, Gemini 3.x Flash, GPT-5.6, Kimi K2/K3, DeepSeek V4, GLM-5.2, Nemotron 3).
**Caution applied:** the open-keyword net was heavily polluted by (a) fabricated "Anthropic engineer: 99% of engineers run swarms of 300 self-improving agents" quote-bait (accounts `0xMovez`, `0xCodez`, `LunarResearcher`), (b) "As an AI Engineer, please learn…" copypasta farmed across many accounts, (c) "10 GitHub repos / $200K job in 90 days" listicles. These are excluded from claims below; every claim is attributed to a named, verifiable practitioner or org account.

---

## (a) Source table — highest-signal, attributed

Engagement shown as Likes/Bookmarks at capture. Grouped by theme.

### Frameworks, stack & the "harness" turn
| Handle | Post | Date | Claim / takeaway |
|---|---|---|---|
| @mattpocockuk (314k) | [x.com/…/2050456062520615131](https://x.com/mattpocockuk/status/2050456062520615131) | 2026 | Canonical taxonomy: **Model** (stateless param blob, next-token only) vs **Harness** (everything around the model that turns it into an agent) vs **Agent**. This model/harness split is now the field's shared vocabulary. |
| @mattpocockuk | [x.com/…/1975867465084092834](https://x.com/mattpocockuk/status/1975867465084092834) | 2025 | "The AI SDK solves two hard problems: contacting the LLM, and streaming to the frontend. That's it." (Vercel AI SDK as the minimal TS substrate.) |
| @mattpocockuk | [x.com/…/1978858379230454155](https://x.com/mattpocockuk/status/1978858379230454155) | 2025 | "Build complex agents across any model and any tool in 5 lines": `streamText({model, tools, stopWhen: stepCountIs(5)})`. Agent loop = model + tools + stop condition. |
| @calcsam (Mastra, 15k) | [x.com/…/1976346378013147359](https://x.com/calcsam/status/1976346378013147359) | 2025 | $13M seed for **Mastra**, "the leading TypeScript agent framework." |
| @calcsam | [x.com/…/2042286632158790131](https://x.com/calcsam/status/2042286632158790131) | 2026 | Mastra platform GA: Studio (evals, logs, traces, datasets, metrics), Server (deploy agents+workflows), **Memory Gateway** ("SoTA agent memory"). Framework → platform trajectory. |
| @calcsam | [x.com/…/1987986946245976441](https://x.com/calcsam/status/1987986946245976441) | 2025 | "Patterns for building AI agents" book — agent design patterns, prototype→production, security basics. |
| @FredKSchott (Astro, 27k) | [x.com/…/2050274923852210397](https://x.com/FredKSchott/status/2050274923852210397) | 2026 | **Flue** — "the first agent *harness* framework," TS, "like Claude Code but 100% headless." New category: harness frameworks. |
| @vercel (443k) | [x.com/…/2067180054979936413](https://x.com/vercel/status/2067180054979936413) | 2026 | **eve** agent framework — file-convention layout (`agent.ts`, `instructions.md`, `tools/`, `skills/`, `sandbox/`, `schedules/`); "Like Next.js, for agents." |
| @pydantic (Python) | [x.com/…/2069477260264968303](https://x.com/pydantic/status/2069477260264968303) | 2026 | **Pydantic AI v2**: "The inner loop of an agent is settled; the leverage is in the layer *around* it" — v2 makes that capabilities layer composable. |
| @hwchase17 (LangChain) | [x.com/…/2014920966972088763](https://x.com/hwchase17/status/2014920966972088763) | 2026 | "LangChain vs langgraph vs deepagents — when to use each." Even the vendor now frames it as tiered choice, not one framework. |
| @lateinteraction (DSPy/Omar Khattab) | [x.com/…/1955384445139292222](https://x.com/lateinteraction/status/1955384445139292222) | 2025 | **DSPy 3.0** out of beta. |
| @lateinteraction | [x.com/…/2038672828321440242](https://x.com/lateinteraction/status/2038672828321440242) | 2026 | "Millions of dollars in savings by **Shopify**, using DSPy." (DSPy production credibility.) |
| @pontusab (Midday, 31k) | [x.com/…/1980596762332303534](https://x.com/pontusab/status/1980596762332303534) | 2026 | "Best stack to build AI assistants": Next.js · TS · **Vercel AI SDK v5** · tRPC · shadcn · Trigger · Redis · **Zod 4** · AI Elements · Supabase · Drizzle. The mainstream TS AI-app stack. |
| @0xSero (58k) | [x.com/…/2048156544034799675](https://x.com/0xSero/status/2048156544034799675) | 2026 | `pi-mono/agent` is "the best agent loop I've read… only a few files… simplest, most efficient harness token-wise, highest cache hit rate." Minimalist-loop movement. |

### Prompt / context / harness engineering
| Handle | Post | Date | Claim |
|---|---|---|---|
| @karpathy (3.5M) | [x.com/…/2039805659525644595](https://x.com/karpathy/status/2039805659525644595) | 2026 | "LLM Knowledge Bases" — building personal, curated knowledge bases as durable context; "large fraction of my token throughput" now goes to LLM-authored notes. Context-as-asset. (60.6k L / 108k B — highest-engagement post in corpus.) |
| @mattpocockuk | [x.com/…/1958179930262356032](https://x.com/mattpocockuk/status/1958179930262356032) | 2025 | Endorses Anthropic's "context engineering template." |
| @_avichawla (72k) | [x.com/…/2072980277870383366](https://x.com/_avichawla/status/2072980277870383366) | 2026 | Emerging canonical framing: "An agent is a **while loop with four layers of engineering** wrapped around it — prompt, context, harness, loop engineering." |
| @muratcan (22k) | [x.com/…/2059113412278227328](https://x.com/muratcan/status/2059113412278227328) | 2026 | **SkillOpt** paper — "gradient descent for SKILL.md files"; treats markdown skill files as an optimizable part of the harness. Harness optimization is becoming a research object. |
| @trq212 (Anthropic/Claude Code, 319k) | [x.com/…/2024638793719177291](https://x.com/trq212/status/2024638793719177291) | 2026 | "You fundamentally have to **design agents for prompt caching first** — almost every feature touches it." Caching is an architectural constraint, not an optimization. |
| @trq212 | [x.com/…/2080710971228918066](https://x.com/trq212/status/2080710971228918066) | Jul 2026 | "We removed ~80% of the Claude Code system prompt for our newest models" — better models need *less* prompt scaffolding. |

### Evals (flagship area)
| Handle | Post | Date | Claim |
|---|---|---|---|
| @HamelHusain | [x.com/…/1939684861813608543](https://x.com/HamelHusain/status/1939684861813608543) | 2025 | "If I could give one tool for LLM evals it would be **error analysis**. Nothing else comes close. This is what **Look At Your Data™** means." The canonical evals thesis. |
| @HamelHusain | [x.com/…/1921221339337421235](https://x.com/HamelHusain/status/1921221339337421235) | 2025 | "It is very easy to make mistakes creating evals" — common-mistakes talk w/ @sh_reya. Foundation-model benchmarks ≠ your evals. |
| @HamelHusain | [x.com/…/1956371273858314397](https://x.com/HamelHusain/status/1956371273858314397) | 2025 | Best public example of production evals done right: @ttorres's AI interview coach — evals to "rapidly squash bugs." |
| @sh_reya (Shreya Shankar) | [x.com/…/2001514443193356776](https://x.com/sh_reya/status/2001514443193356776) | 2025 | "For a year I didn't believe I needed personal evals… I felt I could just vibe-check." The journey from vibes → evals, told by an eval researcher. |
| @sh_reya | [x.com/…/2074973561002115241](https://x.com/sh_reya/status/2074973561002115241) | 2026 | **Key contrarian:** "Devs only ADD to harnesses (system prompt, skills, tools). On a 6+ month scale when new models release, costs go up and accuracy is impacted." Harness accretion is a hidden liability. |
| @sh_reya | [x.com/…/2069475929353834909](https://x.com/sh_reya/status/2069475929353834909) | 2026 | Deep dive: "how much one can automate evals with AI coding tools" — using AI to debug AI. |
| @RLanceMartin | [x.com/…/1777788446498763080](https://x.com/RLanceMartin/status/1777788446498763080) | 2024 | "LLM app development is **rate-limited by quality evals**." |
| @omarsar0 (elvis) | [x.com/…/2070942495832470001](https://x.com/omarsar0/status/2070942495832470001) | 2026 | On LLM-as-judge: "holistic judge scores hide both their reasoning and their ceiling effects" — decompose judges. |
| @mattpocockuk | [x.com/…/1987873636821221400](https://x.com/mattpocockuk/status/1987873636821221400) | 2026 | **Eval-driven development** "gives instant feedback on how good your context engineering is." Demo on a Claude-Code-style askForClarification tool. |
| @mattpocockuk | [x.com/…/1989364793036468654](https://x.com/mattpocockuk/status/1989364793036468654) | 2026 | **Evalite** (TS evals): watch mode + local UI + aggressive AI-SDK model caching. Evals in the TS ecosystem. |
| @swyx | [x.com/…/2064081945567580323](https://x.com/swyx/status/2064081945567580323) | 2026 | **Benchmark-reality bomb:** METR / FrontierCode found "**more than half of SWEBench results is unmergeable slop**"; 1000+ hrs of maintainer-validated SWE tasks "most frontier models cannot yet" do. |
| @swyx | [x.com/…/2061206120233054327](https://x.com/swyx/status/2061206120233054327) | 2026 | "Every evals/analytics startup is going through a one-time generational upgrade into a **continual-learning platform** in 2026." Evals → online/continual learning. |
| @chipro (Chip Huyen) | [x.com/…/1787539138562204126](https://x.com/chipro/status/1787539138562204126) | 2024 | LinkedIn LLM-deployment lessons: chose **YAML over JSON** for structured output (fewer tokens); structured outputs are a first-class reliability concern. |

### RAG / retrieval / memory
| Handle | Post | Date | Claim |
|---|---|---|---|
| @HamelHusain | [x.com/…/1986448116158243106](https://x.com/HamelHusain/status/1986448116158243106) | 2026 | "Dear anyone that said RAG is dead, **Eat it.**" The definitive anti-"RAG is dead" stake. |
| @HamelHusain | [x.com/…/1955682262340829295](https://x.com/HamelHusain/status/1955682262340829295) | 2025 | Free book: "**Beyond Naive RAG**: Practical Advanced Methods." The consensus is "naive RAG is dead," not RAG. |
| @dani_avila7 (33k) | [x.com/…/2018766464933613871](https://x.com/dani_avila7/status/2018766464933613871) | 2026 | Field report: "RAG + vector DB gives decent results, but **agentic search over the repo (glob/grep/read) consistently worked better** on real codebases. We pushed further: RAG + [agentic]." Hybrid > either alone. |
| @jerryjliu0 (LlamaIndex, 130k) | [x.com/…/2073407100642852871](https://x.com/jerryjliu0/status/2073407100642852871) | 2026 | "**Retrieval Harness** for modern agentic retrieval in 2026" — a persistent data pipeline that indexes/updates a knowledge base and exposes it to agents. Retrieval reframed as agent infrastructure. |
| @jerryjliu0 | [x.com/…/2058953208782074127](https://x.com/jerryjliu0/status/2058953208782074127) | 2026 | 90-min workshop tracing RAG → document context → agents, 2023→2026. |
| @calcsam | (Mastra Memory Gateway, above) | 2026 | Agent memory sold as a managed gateway product — memory is productizing. |
| @RLanceMartin | [x.com/…/2080706869036040633](https://x.com/RLanceMartin/status/2080706869036040633) | 2026 | Opus 5 patterns for async/long-horizon: "split brain + hands, self-correction loops, **memory with dreaming**, org-level agents." |

### Agents, multi-agent, tools & MCP
| Handle | Post | Date | Claim |
|---|---|---|---|
| @chipro | [x.com/…/1876681640505901266](https://x.com/chipro/status/1876681640505901266) | 2025 | 8000-word agents note: an agent's capability is "determined by the set of **tools** it has access to and its capability for **planning**." Tools + planning = the two axes. |
| @omarsar0 | [x.com/…/2080340696842539204](https://x.com/omarsar0/status/2080340696842539204) | 2026 | **Multi-agent nuance:** "The hard part of multi-agent is getting agents to **stay quiet**. Put five agents on one task and they duplicate work and burn tokens talking to each other." (Offloop's D1 dispatcher.) |
| @pontusab | [x.com/…/1981689626101469601](https://x.com/pontusab/status/1981689626101469601) | 2026 | Production multi-agent structure at Midday: "10 agents (triage + 9 specialists), 43 tools grouped by domain, 12 artifacts. **Each agent gets only the tools it needs.**" Orchestrator + scoped specialists. |
| @ClaudeDevs (Anthropic, 623k) | [x.com/…/2047086372666921217](https://x.com/ClaudeDevs/status/2047086372666921217) | 2026 | "Building agents that reach production systems with MCP — **when should agents use direct APIs vs CLIs vs MCP?** Plus context-efficient MCP clients." The MCP-vs-API/CLI decision is now official guidance. |
| @OpenAIDevs (383k) | [x.com/…/2059703536825565499](https://x.com/OpenAIDevs/status/2059703536825565499) | 2026 | **Private MCP servers**: keep MCP inside your network, ChatGPT/Codex/Responses API connect via outbound-only HTTPS. Enterprise MCP posture. |
| @_philschmid (Google DeepMind) | [x.com/…/2074533915038027972](https://x.com/_philschmid/status/2074533915038027972) | 2026 | **Managed Agents** (Gemini API): Background Execution, **Remote MCP servers**, Custom Function Calling, credential refresh. Agents-as-managed-service from a frontier lab. |
| @jxnlco (Jason Liu) | [x.com/…/2066977733054234828](https://x.com/jxnlco/status/2066977733054234828) | 2026 | "If you can easily answer 'what are you working on', you're **not using agents enough**." Parallel/async agents as the new default working style. |
| @mathemagic1an | [x.com/…/2079560769562136860](https://x.com/mathemagic1an/status/2079560769562136860) | 2026 | "Allowing agents to interact with the world and **self-orchestrate via code execution** exposes latent structure shared across tasks." Code-execution-as-orchestration thesis. |
| @Cloudflare (295k) | [x.com/…/2072311802285723953](https://x.com/Cloudflare/status/2072311802285723953) | 2026 | Monetization Gateway to "charge for any web page, dataset, API, or **MCP tool**." MCP tools becoming metered products. |

### Models, token economics, local/open
| Handle | Post | Date | Claim |
|---|---|---|---|
| @claudeai (1.7M) | [x.com/…/2080699495453528290](https://x.com/claudeai/status/2080699495453528290) | Jul 2026 | Claude **Opus 5**: "comes close to the frontier intelligence of Fable 5 **at half the price**." Price/intelligence framing is the headline metric. |
| @_philschmid | [x.com/…/2079590167103341009](https://x.com/_philschmid/status/2079590167103341009) | Jul 2026 | **Gemini 3.6 Flash** GA: "~20% more token-efficient, better and cheaper than 3.5"; **$1.50/1M input, $7.50/1M output.** Concrete per-token pricing. |
| @_philschmid | [x.com/…/2079987692603945286](https://x.com/_philschmid/status/2079987692603945286) | 2026 | **Model routing built in:** 3.6 Flash is the new default in Managed Agents, "route back to 3.5 Flash or 3.5 Flash-Lite" with zero code change. |
| @skirano (108k) | [x.com/…/2003845468451914202](https://x.com/skirano/status/2003845468451914202) | 2026 | Autonomous writer agent (up to 300 tool calls) on **Gemini 3 Flash**: "generate an entire novel for **$0.40** in ~3 minutes." Concrete agentic cost. |
| @skirano | [x.com/…/1944475540951621890](https://x.com/skirano/status/1944475540951621890) | 2025 | **Kimi K2** "so good at tool calling and agentic loops… calls multiple tools in parallel reliably, and **knows when to stop**." Open-weight model in production. |
| @skirano | [x.com/…/1803144853741535322](https://x.com/skirano/status/1803144853741535322) | 2024 | Context caching the entire 400k-token Gemini Cookbook as one prompt. Caching-as-context strategy. |
| @UnslothAI (79k) | [x.com/…/2069418532375564484](https://x.com/UnslothAI/status/2069418532375564484) | 2026 | **1-bit GLM-5.2 GGUF** vs Claude Opus 4.8 vs GPT-5.5, same prompt — ran locally on Mac Studio M3 Ultra (256GB) at ~21.6 tok/s. Quantized local frontier-ish is real. |
| @NVIDIAAI (324k) | [x.com/…/2062521325076299981](https://x.com/NVIDIAAI/status/2062521325076299981) | 2026 | **Nemotron 3 Ultra**: 550B MoE open model "for long-running agents," 5x faster inference, "lowers cost of complex agentic tasks by up to 30%." |
| @lmstudio (61k) | [x.com/…/2062583889147928967](https://x.com/lmstudio/status/2062583889147928967) | 2026 | LM Studio mobile app — "your local models in your pocket." Local-first tooling maturing. |
| @simonw | [x.com/…/2062143151184465964](https://x.com/simonw/status/2062143151184465964) | 2026 | **Cost governance in the wild:** "Uber reportedly caps coding agents at **$1,500/month per employee per tool**." Orgs are now budgeting agent spend. |
| @JensenHuang (513k) / @satyanadella (7.5M) | [Huang](https://x.com/JensenHuang/status/2080643682408321103) · [Nadella](https://x.com/satyanadella/status/2080646162483417097) | Jul 2026 | Coordinated industry letters on why **open-weight models matter** — open vs closed is now a policy/geopolitics topic, not just a dev preference. |
| @swyx | [x.com/…/2076155833428431012](https://x.com/swyx/status/2076155833428431012) | 2026 | **Jevons paradox** applied to agentic engineering: cheaper/faster agents *increase* total demand and spend, not decrease it. |
| @ThierryBorgeat (31k) | [x.com/…/2064783848710303902](https://x.com/ThierryBorgeat/status/2064783848710303902) | 2026 | Citadel Securities macro note titled "Tokenomics" — institutional skepticism on AI unit economics. |

### Governance / safety / observability
| Handle | Post | Date | Claim |
|---|---|---|---|
| @mattpocockuk | [x.com/…/1964996433129443652](https://x.com/mattpocockuk/status/1964996433129443652) | 2025 | **Guardrail pattern:** AI-SDK filter for malicious requests returns a single token (`'0'`/`'1'`) "for maximum speed." Cheap classifier guardrails. |
| @mattpocockuk | [x.com/…/2079193858190041399](https://x.com/mattpocockuk/status/2079193858190041399) | 2026 | Teaching via a **request logger** that reads raw traffic to Anthropic/OpenAI — observability by inspecting the wire. |
| @RLanceMartin | [x.com/…/2046648501950713973](https://x.com/RLanceMartin/status/2046648501950713973) | 2026 | Praises Claude Console **prompt-caching dashboard**: "caching is impt for cost + latency; diagnostics + visibility." AI observability = cost/latency/cache telemetry. |

---

## (b) Hottest-stack consensus (what practitioners actually run)

1. **TypeScript is the default app layer for AI products.** The dominant builder stack: **Vercel AI SDK (v5)** as the model/streaming substrate + Next.js + tRPC + Zod 4 + shadcn/AI Elements + Trigger.dev (background) + Supabase/Drizzle (@pontusab ×3, @mattpocockuk, @vercel). Python remains the substrate for research/optimization and data-heavy retrieval (@lateinteraction DSPy, @jerryjliu0 LlamaIndex, @pydantic).
2. **The "harness" has become the unit of engineering.** Shared vocabulary now separates **Model** (stateless) from **Harness** (prompt + context + tools + loop) from **Agent** (@mattpocockuk). Whole frameworks now brand around it: Flue ("harness framework"), Vercel `eve` ("Next.js for agents"), Mastra (framework→platform), Pydantic AI v2 ("leverage is the layer around the loop"). Minimalist counter-movement: hand-rolled few-file loops (`pi-mono`, @0xSero).
3. **Agent = a while-loop over tools with a stop condition.** Reduced to `streamText({model, tools, stopWhen})` (@mattpocockuk). Capability ≈ tools + planning (@chipro).
4. **Agentic retrieval > naive RAG; hybrid wins.** Consensus: give the agent search tools (glob/grep/read, or a "retrieval harness") rather than only a vector store; combine with RAG for real workloads (@dani_avila7, @jerryjliu0). "Naive RAG is dead" — RAG itself is not (@HamelHusain).
5. **Evals are the accepted bottleneck.** "LLM app dev is rate-limited by quality evals" (@RLanceMartin); error analysis / "Look At Your Data" is the #1 practice (@HamelHusain, @sh_reya); eval-driven development + TS eval tooling (Evalite) are normalizing (@mattpocockuk). LLM-as-judge is standard but must be decomposed (@omarsar0).
6. **Prompt caching is a first-class design constraint**, not a tuning knob — "design agents for caching first" (@trq212); harnesses optimize for cache-hit rate (@0xSero); observability centers on cache/cost/latency (@RLanceMartin).
7. **MCP is the consumed-integration standard**, with an explicit decision layer (direct API vs CLI vs MCP) and enterprise variants (private/remote MCP) (@ClaudeDevs, @OpenAIDevs, @_philschmid).
8. **Managed agent services from the labs are arriving** (Google Gemini Managed Agents: background execution, remote MCP, model routing, `max_total_tokens` cost caps) — pulling "run the agent loop" toward the serving substrate (@_philschmid).

## (c) Contrarian / minority takes

- **Harness accretion is a liability (strongest contrarian).** @sh_reya: teams only *add* to harnesses (prompts, skills, tools); across a 6-month model cycle this *raises* cost and *hurts* accuracy. Implies a prune/regression discipline almost nobody practices.
- **Benchmarks are lying.** @swyx / METR: >50% of SWEBench "passes" are unmergeable slop; frontier models can't yet do maintainer-grade SWE work. Undercuts leaderboard-driven model selection.
- **Multi-agent is mostly a coordination-cost trap.** @omarsar0: multi-agent's hard part is stopping agents from duplicating work and "burning tokens talking to each other." The pragmatic middle is one orchestrator + tool-scoped specialists (@pontusab), not swarms. (Note: the corpus's loud "swarms of 300 self-improving agents / Loops→Graphs" content is engagement-farm fabrication, not practitioner belief — see caution above.)
- **Cheaper agents cost more in aggregate.** @swyx invokes Jevons paradox: efficiency gains drive usage up; @simonw shows orgs already hard-capping agent spend ($1,500/mo). Unit-economics skepticism reaches institutional finance (@ThierryBorgeat / Citadel "Tokenomics").
- **"RAG is dead" is itself the contrarian-bait; practitioners reject it** (@HamelHusain "Eat it"). The real shift is naive→agentic/hybrid retrieval.
- **Better models need *less* scaffolding** — Anthropic cut ~80% of the Claude Code system prompt for newer models (@trq212). Cuts against ever-growing prompt engineering.
- **Local/open frontier-ish is viable**, not just a toy: 1-bit GLM-5.2 on a Mac Studio (@UnslothAI), Nemotron 3 open MoE for agents (@NVIDIA), open-weights as policy cause (@JensenHuang, @satyanadella). A real self-host axis vs the closed-API default.

## (d) Token / cost reality from the field

- **Price/intelligence ratio is the headline model metric.** Opus 5 marketed as "≈Fable 5 at half the price" (@claudeai); Gemini 3.6 Flash quoted concretely at **$1.50/1M in, $7.50/1M out**, "20% more token-efficient" (@_philschmid).
- **Concrete agentic-run costs are now shared openly:** a 300-tool-call novel-writing agent for **$0.40 in 3 min** on Gemini 3 Flash (@skirano).
- **Caching is where the money is.** "Design for prompt caching first" (@trq212); harnesses compete on cache-hit rate (@0xSero); cache the whole cookbook/knowledge base as context (@skirano). Observability = cache/cost/latency dashboards (@RLanceMartin).
- **Cost controls are entering the platform:** Gemini Managed Agents ship `max_total_tokens` + free tier (@_philschmid); Codex-session token-saving hacks circulate (@cjzafir); orgs cap per-seat agent spend (@simonw).
- **Efficiency ≠ savings (Jevons):** cheaper tokens expand usage and total spend (@swyx); macro desks question AI unit economics (@ThierryBorgeat).
- **Self-host as a cost/control lever:** quantized local models (LM Studio, Unsloth GGUF) and open MoE models (Nemotron, GLM, DeepSeek V4, poolside Laguna 118B/8B-active/1M-ctx) give a real "own the inference" option.

## (e) Signals for our jobs / surfaces + the wedge

**Job/surface signals the discourse validates as first-class in `ai`:**
- **Model & provider selection / routing / fallback** — routing is now a product feature (Gemini Managed Agents default + fallback), price/intelligence is the deciding axis, open-vs-closed + self-host is a live decision. Strong "Select the model" job.
- **Token / cost / latency / cache management** — caching as *architecture* (@trq212), per-token pricing literacy, org-level budgeting, Jevons. A distinctive **"design for caching / cost from the first line"** stance is a real wedge — most content treats cost as an afterthought; the field is moving the other way.
- **Prompt & context architecture / the harness** — the model/harness/agent taxonomy and "4-layer while loop" give us clean surface language. Wedge: **harness as a maintained artifact with prune/regression discipline** (@sh_reya's accretion warning) — almost no one teaches decommissioning context/tools.
- **Agents (loop, tool use, MCP-as-consumed, multi-agent)** — reduce to loop+tools+stop; MCP-vs-API/CLI decision; multi-agent as scoped-specialist orchestration, *not* swarms. Wedge: honestly teach **when NOT to go multi-agent** (coordination cost, token-chatter) — counter-programs the farm hype.
- **RAG / agentic retrieval** — "retrieval harness," agentic search + hybrid, "naive RAG is dead." Seam with `data` (vector store as governed dataset) is exactly where practitioners draw it.
- **Evals (flagship) + guardrails + observability** — error analysis / Look-At-Your-Data, eval-driven dev, decomposed LLM-judge, evals→continual learning, benchmark distrust, cheap single-token guardrails, cache/cost/latency observability. This is the richest, most consensus-backed area — flagship status confirmed.

**The wedge (synthesized):** the field has settled *what* the pieces are (loop, harness, retrieval, evals, MCP) but is loud on adding and near-silent on **disciplined subtraction and accountability**: prune the harness, budget the tokens, decompose the judge, distrust the benchmark, prove the retrieval, decide when *not* to multi-agent. An `ai` skill that treats **evals + cost/caching + harness-hygiene as the through-line** (verify-and-subtract, not just assemble) sits in open, defensible ground and cleanly respects the peer seams (backend serves, data governs, quality independently verifies, architecture shapes).

## (f) Open questions

1. **Multi-agent skeptic canon is under-captured.** The corpus surfaced nuance (@omarsar0, @sh_reya) and farm-noise believers, but not the marquee skeptic essays (e.g., Cognition "Don't build multi-agents", Anthropic's own multi-agent post). Worth a targeted web/GitHub pass to represent the real believer-vs-skeptic split with primary sources.
2. **Memory** appears mostly as product announcements (Mastra Memory Gateway, "memory with dreaming") — thin on *how* practitioners actually implement durable agent memory (summarization vs KG vs vector vs files). Needs deeper thread reads.
3. **Structured outputs / tool-calling reliability** yielded strong but sparse hits (@chipro YAML-over-JSON, @mattpocockuk single-token). Under-mined relative to its importance; a focused sweep would help.
4. **Guardrails / AI safety in production** is thin (one strong pattern). May live more in company blogs than X.
5. **Prompt/skill optimization as tooling** (SkillOpt, DSPy optimizers) is nascent — is it real practice yet or research-frontier? Unclear from X alone.
6. **Attribution of the "harness/loop/graph" taxonomy** — heavily farmed, so the genuine originator vs amplifier chain is muddy; verify canonical sources (Anthropic, karpathy, Chip Huyen) before quoting the framing as consensus.
