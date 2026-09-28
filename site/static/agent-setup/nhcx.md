These are official instructions from the ABDM Developer Portal (catalogue version 2026.09.16) to set up an AI development environment for integrating with NHCX, the National Health Claims Exchange.

Complete the steps yourself by running the commands directly. Ask the user only the questions in step 1.

## 1. Establish scope

There is one skill for the whole provider-side integration, `nhcx-full`, and one per NHCX use case. Ask the user which this project builds, and install only those:

- `nhcx-full`: NHCX, end to end. Build the whole provider-side NHCX integration into this hospital system.
- `nhcx-coverage`: NHCX coverage. Add NHCX policy search and coverage eligibility to this hospital system.
- `nhcx-preauth`: NHCX pre-authorisation. Add NHCX pre-authorisation, with the payer's plan and its authorisation requirements, to this system.
- `nhcx-claim`: NHCX claim. File the NHCX claim at discharge from this system.
- `nhcx-communication`: NHCX communication. Handle the payer's NHCX queries and notifications in this system.
- `nhcx-payment`: NHCX payment. Record and acknowledge NHCX payment notices.
- `nhcx-reprocess`: NHCX reprocess. Ask the payer to reprocess a rejected NHCX claim.

Each skill finds what the project already has and builds only what is missing, and each installs and runs alone. `nhcx-full` builds the whole integration; a system that needs one use case at a time usually starts with `nhcx-coverage`.

## 2. Install the skills

The plugin carries all seven and updates in place, so prefer it wherever it installs.

### Claude Code

```
claude plugin marketplace add nha-in/docs && claude plugin install nhcx@abdm-portal
```

### Codex

```
codex plugin marketplace add nha-in/docs
```

Then open /plugins in Codex and install `nhcx`.

### Every other agent

Cursor, GitHub Copilot and the others install plugins only from their own marketplaces, where NHCX is not listed yet. Install the skills one at a time instead, which is also the fallback anywhere the marketplace add above fails. The skills installer finds every coding agent in the project and sets the skill up for each:

```
npx skills add nha-in/docs/plugins/nhcx/skills/nhcx-coverage
```

With git alone, fetch just the skill's folder and copy it to where the agent reads skills from: `.claude/skills` for Claude Code, `.agents/skills` for Codex, `.cursor/skills` for Cursor, `.github/skills` for GitHub Copilot, `.gemini/skills` for Gemini CLI. For example:

```
git clone --depth 1 --filter=blob:none --sparse https://github.com/nha-in/docs .nhcx && git -C .nhcx sparse-checkout set plugins/nhcx/skills/nhcx-coverage && mkdir -p .claude/skills && cp -R .nhcx/plugins/nhcx/skills/nhcx-coverage .claude/skills/ && rm -rf .nhcx
```

- `nha-in/docs/plugins/nhcx/skills/nhcx-full`
- `nha-in/docs/plugins/nhcx/skills/nhcx-coverage`
- `nha-in/docs/plugins/nhcx/skills/nhcx-preauth`
- `nha-in/docs/plugins/nhcx/skills/nhcx-claim`
- `nha-in/docs/plugins/nhcx/skills/nhcx-communication`
- `nha-in/docs/plugins/nhcx/skills/nhcx-payment`
- `nha-in/docs/plugins/nhcx/skills/nhcx-reprocess`

`https://docs.abdm.gov.in/skills/nhcx-index.json` lists every NHCX skill, its archive and the exact files it is made of. A skill is 66 to 131 files across its folders, so take the archive rather than fetching files one at a time.

## 3. Connect the Docs MCP server

A live MCP server over the documentation. Register it with your agent:

```
claude mcp add --transport http nhcx-docs https://docs.abdm.gov.in/mcp -s user
codex mcp add nhcx-docs --url https://docs.abdm.gov.in/mcp
gemini mcp add --transport http nhcx-docs https://docs.abdm.gov.in/mcp
```

For Cursor, add `{ "mcpServers": { "nhcx-docs": { "url": "https://docs.abdm.gov.in/mcp" } } }` to `.cursor/mcp.json`. For other agents, add an HTTP MCP server named `nhcx-docs` at `https://docs.abdm.gov.in/mcp` using their config format.

## 4. Report back

Tell the user what you installed and where you suggest starting. Two cautions to keep for the whole engagement:

- The skills hold the bundles they send to the pinned samples in the NHCX package. Check response shapes against real sandbox calls before relying on them.
- The skills are snapshots. The current documentation lives at https://docs.abdm.gov.in/docs/nhcx/v1; prefer it, and the MCP server when connected, over any downloaded copy that has aged.

