These are official instructions from the ABDM Developer Portal (catalogue version 2026.08.24, built 2026-09-01) to set up an AI development environment for integrating with ABDM, India's health data network.

Complete the steps yourself by running the commands directly. Ask the user only the questions in step 1.

## 1. Establish scope

Ask the user which of these this project needs, and install only what they name:

- `abdm-m1`: ABDM Milestone 1: ABHA identity, login, profile
- `abdm-m2`: ABDM Milestone 2: linking and sharing records
- `abdm-m3`: ABDM Milestone 3: consent and fetching
- `fhir-generate`: building NRCES compliant FHIR bundles in this codebase
- `fhir-audit`: checking an existing FHIR store for NRCES compliance

A project that produces FHIR documents from its own code wants `fhir-generate`; one with an existing FHIR store wants `fhir-audit`; most need only one of the two.

## 2. Install the skills

### Claude Code

Install the plugin, which carries every skill at once and stays current through `claude plugin update`:

```
claude plugin marketplace add eka-care/abdm-docs
claude plugin install abdm@abdm-portal
```

If the marketplace add fails (the repository may not be accessible from here), fall back to the per-file downloads below.

### Other agents

Each skill is one markdown file in the cross-agent SKILL.md format. Download each chosen skill into the directory your agent reads skills from:

- Claude Code: `.claude/skills/<name>/SKILL.md`
- Cursor: `.cursor/skills/<name>/SKILL.md` (it also reads `.claude/skills`)
- GitHub Copilot: `.github/skills/<name>/SKILL.md`
- Any other agent: wherever it reads context from

URLs below are relative to the origin you fetched this file from.

For example:

```
mkdir -p .claude/skills/abdm-m1 && curl -fsSL /skills/abdm-m1/SKILL.md -o .claude/skills/abdm-m1/SKILL.md
```

- /skills/abdm-m1/SKILL.md
- /skills/abdm-m2/SKILL.md
- /skills/abdm-m3/SKILL.md
- /skills/fhir-generate/SKILL.md
- /skills/fhir-audit/SKILL.md

## 3. Connect the Docs MCP server

The portal's Docs MCP server is not publicly reachable yet. Skip this step; /docs/hiecm/v3/getting-started/mcp has the current status and the connect instructions for when it opens.

## 4. Report back

Tell the user what you installed and where you suggest starting. Two cautions to keep for the whole engagement:

- Nothing in these skills has been run against the ABDM sandbox. Verify response shapes against real calls before relying on them.
- The skills are snapshots. The current documentation lives at /; prefer it, and the MCP server when connected, over any downloaded copy that has aged.

