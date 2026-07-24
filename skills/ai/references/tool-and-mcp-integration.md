# Tool and MCP Integration

Purpose: Decide how an agent reaches the outside world — the tool contract's shape, whether the
integration should be a direct API call, a CLI, or an MCP server, and which layer of the MCP stack
(spec/SDK/framework/registry) to build or consume against. Owns tool *design* and MCP
*consumption*; does not own hosting an MCP server as a production service.

Read when:
- The request is "wire this tool," "let the agent call X," "should this be an MCP server," or
  compares direct API/CLI/MCP integration paths.
- An agent needs to consume an existing MCP server (internal, vendor, or public registry).
- A tool call keeps failing schema validation, or a tool's blast radius needs scoping.

Skip when:
- The ask is *hosting/serving* an MCP server as a reusable backend capability — auth, scaling,
  gateway, multi-tenant exposure — → backend's `surface-agentic` (§2, "Tool/function endpoints and
  MCP servers"); this ref covers authoring a server's tool surface and consuming one, not running
  it as infra.
- The ask is the three-leg structured-output enforcement mechanism itself (constrained decoding /
  reask-retry / provider-native) as a general topic — → `structured-outputs.md`; this ref applies
  the pattern specifically to tool-call arguments.
- The ask is agent loop shape, multi-agent delegation, or durable execution — →
  [agent-construction.md](agent-construction.md).
- The workflow is deterministic and non-model-driven even though it calls an API — → `automation`.

Inputs:
- Whether the capability is single-caller (one agent, one integration) or must be reusable across
  multiple agent clients/products — decides direct API/CLI vs MCP.
- Target language/runtime for SDK or FastMCP-layer pick.
- Whether the MCP server is internal-only, a public registry entry, or a private/remote deployment
  crossing a network boundary.

Produces: a named integration shape (direct API / CLI / MCP) with its trade-off, a tool contract
(schema + retry policy), and — if MCP — a pinned SDK/spec version and a stated consent/trust
posture.

## Contents
- Tool contract = schema + validate-and-retry
- Direct API vs CLI vs MCP
- MCP anatomy
- MCP spec status (re-verify)
- The build chain: spec → SDK → FastMCP → registry
- Private/remote MCP posture
- What NOT to build

## Procedure

### 1. Tool contract = schema + validate-and-retry
Every tool a model calls — direct function, CLI wrapper, or MCP tool — needs the same contract:
a typed schema (Pydantic/Zod/Standard Schema — TS SDKs increasingly accept any of Zod v4/Valibot/
ArkType), a docstring/description the model reads as the tool's spec, and
**validate-and-auto-retry-on-schema-failure**: catch the invalid call, feed the validation error
back to the model as the next turn, let it retry — never hard-fail the turn on a malformed
argument. This is the standard mechanism across Pydantic AI, Instructor
(github.com/567-labs/instructor, MIT), and every MCP SDK's tool decorator. Two failure classes to
design against explicitly:
- **Schema drift** — the schema the model sees (its tool definition) and the schema the handler
  actually validates against must be the same artifact, generated once, not hand-duplicated; drift
  produces calls that "succeed" from the model's view and 400 on execution.
- **Ambiguous/overlapping tools** — token-costly and error-prone; keep the tool surface small and
  non-overlapping (Anthropic's ACI framing, anthropic.com/engineering/building-effective-agents).

### 2. Direct API vs CLI vs MCP
Anthropic's own developer guidance frames this as an explicit decision, not "always MCP"
(@ClaudeDevs, x.com/ClaudeDevs/status/2047086372666921217):

| Path | Reach for when | Cost |
|---|---|---|
| **Direct API call** | Single caller, capability already has a clean typed endpoint, no discovery needed | Cheapest in tokens/latency; no protocol overhead; not reusable across agent clients without re-wiring |
| **CLI** | The capability already ships a CLI with good `--help`/man-page self-description an agent can read | Leans on existing tooling; less structured than a typed schema, weaker validation guarantees |
| **MCP** | The capability must be reusable across multiple agent clients/products, or the caller is a generic host (Claude Desktop/Code, ChatGPT) that doesn't know your API ahead of time | Protocol + connection overhead; a context-efficient client (only load tool descriptions actually needed) matters at scale |

**Default to a direct tool/function endpoint for a single-caller integration** — the same framing
backend's `surface-agentic` uses: a bespoke tool endpoint is simpler for one caller, MCP earns its
overhead when the capability needs to be multi-client. Don't reach for MCP-server ceremony to wire
one agent to one internal API.

### 3. MCP anatomy
MCP is JSON-RPC 2.0 over a defined role model, modeled on the Language Server Protocol
(modelcontextprotocol.io/specification, live-verified 2026-07-25):
- **Roles**: Host (the LLM application, e.g. Claude Code) → Client (a connector inside the host,
  one per server) → Server (exposes context/capabilities).
- **Server primitives**: **Tools** (functions the model executes), **Resources** (context/data for
  user or model), **Prompts** (templated workflows for users).
- **Client primitives**: **Sampling** (server-initiated recursive LLM calls), **Roots**
  (server-initiated filesystem/URI boundary queries), **Elicitation** (server-initiated requests
  for more user info).
- **Transports**: **stdio** (local process) and **Streamable HTTP** (replaced the old HTTP+SSE
  pair; resumable, session-scoped via `MCP-Session-Id`).
- **Trust model**: explicit user consent is required before data access, tool invocation, or
  sampling; **tool descriptions are untrusted unless sourced from a trusted server** — a prompt-
  injection vector if skipped. Design consuming clients to surface this consent step, not
  auto-approve.

### 4. MCP spec status — re-verify at build time
**Stable spec as of 2026-07-25: 2025-11-25** (confirmed live at modelcontextprotocol.io/
specification, which still serves the `2025-11-25` schema path). A **2026-07-28 release candidate**
exists (blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) and had not superseded
2025-11-25 as of this fetch — it is dated three days ahead of this writing, so its promotion to
stable is imminent and unresolved. **Re-verify at modelcontextprotocol.io/specification before
teaching v2026-07-28 patterns as current** — this is the single most time-sensitive fact in this
reference; do not freeze it.

### 5. The build chain: spec → SDK → FastMCP → registry
Teach MCP as a layered stack, not one repo:
1. **Spec** (modelcontextprotocol/modelcontextprotocol, github.com/modelcontextprotocol/
   modelcontextprotocol) — the schema, ground truth for wire semantics.
2. **Reference servers** (modelcontextprotocol/servers, ~89k★, MIT→Apache-2.0 transitional) — 7
   maintained examples (Everything, Fetch, Filesystem, Git, Memory, Sequential Thinking, Time),
   explicitly labeled "educational, not production-ready." Most former servers (GitHub, Slack,
   Postgres, …) were archived out to vendors or the registry.
3. **SDKs** — official Python (github.com/modelcontextprotocol/python-sdk, MIT, ~24k★) and
   TypeScript (github.com/modelcontextprotocol/typescript-sdk, MIT/Apache, ~13k★) SDKs. **Both are
   mid v1→v2 transition tied to the 2026-07-28 spec — pin `<2` in production for either language;
   don't teach v2 patterns (TS's split `@modelcontextprotocol/server`/`client` packages, Python's
   v2 alpha) as stable yet.**
4. **Framework** — **PrefectHQ/fastmcp** (github.com/PrefectHQ/fastmcp, Apache-2.0, ~27k★, moved
   from `jlowin/fastmcp` — update any old link) is the build default: decorator-based tool
   definition with auto schema/validation/docs generation, claims to power "70% of MCP servers
   across all languages." FastMCP 1.0 was even absorbed into the official Python SDK. TS
   equivalent: `punkpeye/fastmcp` (MIT, ~3.2k★) — smaller, unaffiliated, same positioning (SDK
   ergonomics layer) at a niche scale.
5. **Registry** (modelcontextprotocol/registry, github.com/modelcontextprotocol/registry) — the
   discovery layer ("an app store for MCP servers"), Go/Postgres, **API-freeze v0.1** as of this
   writing — early but the intended long-term discovery path; the reference-servers repo itself now
   defers listing to it. Verify registry maturity before depending on it for production discovery.

**Border**: authoring a server's tool surface with FastMCP (steps 3–4) is this ref's turf;
*deploying* that server as an authenticated, scaled, multi-tenant service is backend/operate's
(`surface-agentic` §2) — the same code, different concern.

### 6. Private/remote MCP posture
Enterprise consumption is standardizing on **outbound-only connections to internally-hosted
servers**, not exposing MCP endpoints publicly:
- OpenAI's private MCP servers: keep the server inside your network; ChatGPT/Codex/the Responses
  API connect via outbound-only HTTPS (@OpenAIDevs, x.com/OpenAIDevs/status/2059703536825565499).
- Google's Managed Agents ship **Remote MCP servers** with credential refresh as a first-class
  capability alongside background execution and custom function calling (@_philschmid,
  x.com/_philschmid/status/2074533915038027972) — routing "run the agent loop" toward a managed
  serving substrate, a signal that agent-hosting is drifting toward the platform layer.
- MCP tools are starting to be metered as products in their own right (Cloudflare's Monetization
  Gateway for MCP tools, @Cloudflare, x.com/Cloudflare/status/2072311802285723953) — if the tool
  surface will be billed/rate-limited per caller, that's a gateway concern (litellm, Portkey's
  MCP Gateway angle) layered in front, not something this ref's contract design needs to solve.
Default posture for a new internal integration: private/internal MCP server, outbound-only from
the host, explicit per-tool consent in the client — public/registry exposure is a deliberate
escalation, not the default.

### 7. What NOT to build
- Don't stand up an MCP server for a single internal caller — a direct tool/function endpoint is
  simpler and cheaper; reach for MCP when reuse across clients is real, not hypothetical.
- Don't hand-duplicate the tool schema between "what the model sees" and "what the handler
  validates" — generate one from the other.
- Don't auto-approve tool descriptions from an untrusted MCP server — the spec's trust model exists
  because tool descriptions are an injection surface, not decoration.
- Don't teach MCP v2 SDK patterns as production-stable while v1 is still the pinned line for both
  official SDKs.
- Don't re-derive gateway/auth/scaling for a hosted MCP server here — that's `surface-agentic`'s
  job; this ref stops at "the server's tool surface is well-designed."

## Validation
- [ ] The integration path (direct API / CLI / MCP) is named with its reason — not MCP-by-default.
- [ ] Every tool's model-facing schema is generated from (or contract-tested against) its
      execution-side validation.
- [ ] Schema-invalid calls retry with the validation error fed back, not a hard fail.
- [ ] If MCP: SDK major version is pinned (v1 for production), and the spec revision cited is
      re-verified against modelcontextprotocol.io/specification, not assumed from this document.
- [ ] MCP client consent/trust flow is explicit for tool invocation and any server-initiated
      sampling; untrusted-server tool descriptions are flagged, not silently trusted.
- [ ] A private/internal MCP server does not default to public exposure without a stated reason.

## Failure modes and handoff
- The ask becomes "host this MCP server for production traffic" (auth, scaling, multi-tenant,
  gateway) → backend's `surface-agentic`, this ref's job ends at tool-surface design.
- The ask is really about the enforcement mechanism for structured output generally, not
  specifically tool-call arguments → `structured-outputs.md`.
- The ask is agent loop shape or which framework wires the tool call → 
  [agent-construction.md](agent-construction.md).
- A tool is billed/rate-limited per caller or per organization → that's a gateway concern
  (litellm/Portkey-class routing layer), not a change to the tool contract itself.
- The MCP spec revision cited anywhere in this pack is more than a few weeks old → re-fetch
  modelcontextprotocol.io/specification before trusting it; the 2026-07-28 RC is actively pending.
