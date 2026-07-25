# Installation

Install the `ai` runtime pack from the independently versioned
`gabros20/ai-skill` repository.

## Prerequisites

- An Agent Skills-compatible client.
- No skill-specific credentials or tools are required. `ai` is provider- and language-agnostic; it
  recommends fetching current provider docs at build time (retrieval-first) but ships no keys.

## Install with skills.sh

```bash
npx skills add gabros20/ai-skill
```

## Clone and install

```bash
git clone https://github.com/gabros20/ai-skill.git
cd ai-skill
./install.sh codex
```

Available targets:

| Argument | Destination |
|---|---|
| `codex` | `${CODEX_HOME:-$HOME/.codex}/skills/ai/` |
| `agents` | `~/.agents/skills/ai/` |
| `claude` | `~/.claude/skills/ai/` |
| `cursor` | `~/.cursor/skills/ai/` |
| `antigravity` | Gemini IDE and Antigravity CLI skill paths |
| `opencode` | `~/.config/opencode/skills/ai/` |
| `grok` | `~/.grok/skills/ai/` |
| `hermes` | `~/.hermes/skills/ai/` |
| `all` | Claude, Codex, and the cross-agent path |

The installer stages a complete copy before replacing an existing installation. If replacement
fails, it restores the previous copy.

## Verify

Start a new client session and use the client's supported invocation form:

- Codex: `$ai`
- Slash-command clients: `/ai`
- Other clients: an `@` mention, skill tool, or natural-language trigger

For Codex, verify the installed files directly:

```bash
test -f "${CODEX_HOME:-$HOME/.codex}/skills/ai/SKILL.md"
```

## Update

```bash
cd ai-skill
git pull --ff-only
./install.sh codex
```

Review `CHANGELOG.md` and GitHub Releases for version history. Version metadata intentionally stays
outside runtime `SKILL.md`.

## Uninstall

```bash
rm -rf "${CODEX_HOME:-$HOME/.codex}/skills/ai"
```
