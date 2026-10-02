These are official instructions from the ABDM Developer Portal (catalogue version 2026.09.16) to set up an AI development environment for integrating with UHI, the Unified Health Interface.

Complete the steps yourself by running the commands directly. Ask the user only the questions in step 1.

## 1. Establish scope

There is one skill per UHI service. Ask the user which services this project builds, and whether it is the patient app (EUA) or the provider system (HSPA), and install only those skills:

- `uhi-consultation`: Physical Consultation. Let patients in our app book a physical consultation.
- `uhi-ambulance`: Ambulance Booking. Add ambulance search and a quote to our app.
- `uhi-pmjay-hem`: PM-JAY HEM hospital discovery. Show PM-JAY empanelled hospitals near the patient.
- `uhi-blood-bank`: Blood Bank discovery. Show blood banks near the patient that hold the group they need.
- `uhi-jan-aushadhi`: Jan Aushadhi. Let patients find a Jan Aushadhi Kendra that stocks their medicine.
- `uhi-notto`: NOTTO hospital discovery. Show hospitals authorised for a kidney transplant in a state.

Each skill installs and runs alone. An EUA completes Milestone 2 on HIE-CM before any UHI onboarding, which the `abdm-integrators-assistant` plugin carries as `abdm-m2`.

## 2. Install the skills

The plugin carries all six and updates in place, so prefer it wherever it installs.

### Claude Code

```
claude plugin marketplace add nha-in/docs && claude plugin install uhi-integrators-assistant@abdm-portal
```

### Codex

```
codex plugin marketplace add nha-in/docs
```

Then open /plugins in Codex and install `uhi-integrators-assistant`.

### Every other agent

Cursor, GitHub Copilot and the others install plugins only from their own marketplaces, where this plugin is not listed yet. Install the skills one at a time instead, which is also the fallback anywhere the marketplace add above fails:

```
npx skills add nha-in/docs/plugins/uhi-integrators-assistant/skills/uhi-pmjay-hem
```

- `nha-in/docs/plugins/uhi-integrators-assistant/skills/uhi-consultation`
- `nha-in/docs/plugins/uhi-integrators-assistant/skills/uhi-ambulance`
- `nha-in/docs/plugins/uhi-integrators-assistant/skills/uhi-pmjay-hem`
- `nha-in/docs/plugins/uhi-integrators-assistant/skills/uhi-blood-bank`
- `nha-in/docs/plugins/uhi-integrators-assistant/skills/uhi-jan-aushadhi`
- `nha-in/docs/plugins/uhi-integrators-assistant/skills/uhi-notto`

`https://nha-in.github.io/docs/pr-100/skills/uhi-index.json` lists every UHI skill, its archive and the exact files it is made of, so take the archive rather than fetching files one at a time.

## 3. Connect the Docs MCP server

A live MCP server over the documentation. Register it with your agent:

```
claude mcp add --transport http abdm-docs https://docs.abdm.gov.in/mcp
```

For other agents, add an HTTP MCP server named `abdm-docs` at `https://docs.abdm.gov.in/mcp` using their config format.

## 4. Report back

Tell the user what you installed and where you suggest starting. Offer three prompts from the **Try asking** section of the skills that fit, and ask what they are building.
The skills are snapshots. The current documentation lives at https://nha-in.github.io/docs/pr-100/docs/uhi/v1; prefer it, and the MCP server when connected, over any downloaded copy that has aged.

