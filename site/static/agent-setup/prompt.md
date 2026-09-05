These are official instructions from the ABDM Developer Portal (catalogue version 2026.08.24, built 2026-09-05) to set up an AI development environment for integrating with ABDM, India's health data network.

Complete the steps yourself by running the commands directly. Ask the user only the questions in step 1.

## 1. Establish scope

Ask the user which of these this project needs, and install only what they name:

- `abdm-m1`: ABDM Milestone 1: ABHA identity, login, profile
- `abdm-m2`: ABDM Milestone 2: linking and sharing records
- `abdm-m3`: ABDM Milestone 3: consent and fetching
- `abdm-m4`: ABDM Milestone 4: the HPR and HFR registries
- `abdm-p1`: ABDM P1: PHR identity and profile, the patient side of M1
- `abdm-p2`: ABDM P2: PHR linking and records, the patient side of M2
- `abdm-p3`: ABDM P3: PHR consent and notifications, the patient side of M3
- `abdm-phr-services`: services a PHR app may offer on top of ABDM, none of them certified
- `hiecm-m1-build`: scaffolding an M1 integration flow by flow against the sandbox
- `hiecm-m1-debug`: diagnosing a failed M1 call
- `hiecm-m2-build`: scaffolding an M2 integration flow by flow against the sandbox
- `hiecm-m2-debug`: diagnosing a failed M2 call
- `hiecm-m3-build`: scaffolding an M3 integration flow by flow against the sandbox
- `hiecm-m3-debug`: diagnosing a failed M3 call
- `hiecm-m4-build`: scaffolding the HPR and HFR registrations M4 asks for
- `hiecm-m4-debug`: diagnosing a failed M4 registration call
- `hiecm-p1-build`: scaffolding registration and login in a PHR app
- `hiecm-p1-debug`: diagnosing a failed call from a PHR app, across P1 to P3
- `hiecm-p2-build`: scaffolding discovery and linking in a PHR app
- `hiecm-p3-build`: scaffolding consent and record fetching in a PHR app
- `fhir-generate`: building NRCES compliant FHIR bundles in this codebase
- `fhir-audit`: checking an existing FHIR store for NRCES compliance

A project that produces FHIR documents from its own code wants `fhir-generate`; one with an existing FHIR store wants `fhir-audit`; most need only one of the two.

## 2. Install the skills

The plugin carries every skill at once and updates in place, so prefer it wherever it installs. It is packaged both to Claude Code's layout and to the Agent Plugins 1.0 standard.

### Claude Code

```
claude plugin marketplace add eka-care/abdm-docs
claude plugin install abdm-integrators-assistant@abdm-portal
```

### Codex

Add the marketplace, then install `abdm-integrators-assistant` from the plugin directory:

```
codex plugin marketplace add eka-care/abdm-docs
```

### Every other agent

Cursor, GitHub Copilot, VS Code and Kiro read Agent Plugins 1.0, but they install from their own marketplaces rather than from a repository, and this plugin is not listed in one yet. Install the skills directly instead, which is also the fallback anywhere the marketplace add above fails.

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
- /skills/abdm-m4/SKILL.md
- /skills/abdm-p1/SKILL.md
- /skills/abdm-p2/SKILL.md
- /skills/abdm-p3/SKILL.md
- /skills/abdm-phr-services/SKILL.md
- /skills/hiecm-m1-build/SKILL.md
- /skills/hiecm-m1-debug/SKILL.md
- /skills/hiecm-m2-build/SKILL.md
- /skills/hiecm-m2-debug/SKILL.md
- /skills/hiecm-m3-build/SKILL.md
- /skills/hiecm-m3-debug/SKILL.md
- /skills/hiecm-m4-build/SKILL.md
- /skills/hiecm-m4-debug/SKILL.md
- /skills/hiecm-p1-build/SKILL.md
- /skills/hiecm-p1-debug/SKILL.md
- /skills/hiecm-p2-build/SKILL.md
- /skills/hiecm-p3-build/SKILL.md
- /skills/fhir-generate/SKILL.md
- /skills/fhir-audit/SKILL.md

## 3. Connect the Docs MCP server

The portal's Docs MCP server is not publicly reachable yet. Skip this step; /docs/hiecm/v3/getting-started/mcp has the current status and the connect instructions for when it opens.

## 4. Report back

Tell the user what you installed and where you suggest starting. Two cautions to keep for the whole engagement:

- Nothing in these skills has been run against the ABDM sandbox. Verify response shapes against real calls before relying on them.
- The skills are snapshots. The current documentation lives at /; prefer it, and the MCP server when connected, over any downloaded copy that has aged.

