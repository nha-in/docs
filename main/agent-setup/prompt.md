These are official instructions from the ABDM Developer Portal (catalogue version 2026.09.16, built 2026-09-16) to set up an AI development environment for integrating with ABDM, India's health data network.

Complete the steps yourself by running the commands directly. Ask the user only the questions in step 1.

## 1. Establish scope

Ask the user which of these this project needs, and install only what they name:

- `abdm-gateway`: Gateway, sessions and the bridge registry. Sections: scaffold, integrate, debug.
- `abdm-m1`: M1, create and verify ABHA. Sections: functionalities, run, foundations, errors.
- `abdm-m2`: M2, create and link records. Sections: scaffold, design, integrate, debug, test.
- `abdm-m3`: M3, fetch data with consent. Sections: scaffold, design, integrate, debug, test.
- `abdm-m4`: M4, register facilities and professionals. Sections: scaffold, integrate, debug, test.
- `abdm-p1`: P1, PHR registration and login. Sections: scaffold, integrate, debug, test.
- `abdm-p2`: P2, Consents Management. Sections: scaffold, integrate, debug, test.
- `abdm-p3`: P3, PHR subscriptions. Sections: scaffold, design, integrate, debug, test.
- `abdm-p4`: P4, health lockers. Sections: scaffold, integrate, debug, test.
- `abdm-scan-and-register`: Scan and register. Sections: scaffold, integrate, debug.
- `abdm-scan-and-pay`: Scan and pay. Sections: scaffold, integrate, debug.
- `abdm-record-share`: Patient scan and record share. Sections: scaffold, integrate, debug.
- `abdm-fhir`: FHIR, generating and auditing bundles. Sections: generate, audit.

Most projects need one milestone skill to begin with, and `abdm-fhir` alongside it if they produce or hold FHIR documents.

## 2. Install the skills

The plugin carries every skill at once and updates in place, so prefer it wherever it installs. It is packaged both to Claude Code's layout and to the Agent Plugins 1.0 standard.

### Claude Code

```
claude plugin marketplace add nha-in/docs
claude plugin install abdm-integrators-assistant@abdm-portal
```

### Codex

Add the marketplace, then install `abdm-integrators-assistant` from the plugin directory:

```
codex plugin marketplace add nha-in/docs
```

### Every other agent

Cursor, GitHub Copilot, VS Code and Kiro read Agent Plugins 1.0, but they install from their own marketplaces rather than from a repository, and this plugin is not listed in one yet. Install the skills directly instead, which is also the fallback anywhere the marketplace add above fails.

Each skill is a folder in the cross-agent Agent Skills format: a `SKILL.md` that routes, and the sections it links to under `references/`, which load only when the work needs them. Download the whole folder into the directory your agent reads skills from:

- Claude Code: `.claude/skills/<name>/`
- Cursor: `.cursor/skills/<name>/` (it also reads `.claude/skills`)
- GitHub Copilot: `.github/skills/<name>/`
- Any other agent: wherever it reads context from

`https://nha-in.github.io/docs/main/skills/index.json` lists every skill and the exact files it is made of, so fetch that first and work from it rather than guessing at reference names. For example:

```
mkdir -p .claude/skills/abdm-scan-and-register/references
curl -fsSL https://nha-in.github.io/docs/main/skills/abdm-scan-and-register/SKILL.md -o .claude/skills/abdm-scan-and-register/SKILL.md
for f in scaffold integrate debug; do curl -fsSL https://nha-in.github.io/docs/main/skills/abdm-scan-and-register/references/$f.md -o .claude/skills/abdm-scan-and-register/references/$f.md; done
```

A skill that `index.json` gives an `archive`, such as `abdm-m1`, holds folders a loop over sections cannot fetch. Take the archive instead:

```
mkdir -p .claude/skills && curl -fsSL https://nha-in.github.io/docs/main/skills/abdm-m1.tar.gz | tar -xzf - -C .claude/skills
```

- https://nha-in.github.io/docs/main/skills/abdm-gateway/
- https://nha-in.github.io/docs/main/skills/abdm-m1/
- https://nha-in.github.io/docs/main/skills/abdm-m2/
- https://nha-in.github.io/docs/main/skills/abdm-m3/
- https://nha-in.github.io/docs/main/skills/abdm-m4/
- https://nha-in.github.io/docs/main/skills/abdm-p1/
- https://nha-in.github.io/docs/main/skills/abdm-p2/
- https://nha-in.github.io/docs/main/skills/abdm-p3/
- https://nha-in.github.io/docs/main/skills/abdm-p4/
- https://nha-in.github.io/docs/main/skills/abdm-scan-and-register/
- https://nha-in.github.io/docs/main/skills/abdm-scan-and-pay/
- https://nha-in.github.io/docs/main/skills/abdm-record-share/
- https://nha-in.github.io/docs/main/skills/abdm-fhir/

## 3. Connect the Docs MCP server

The portal serves its catalogue live over MCP (streamable HTTP). Register it with your agent:

```
claude mcp add --transport http abdm-docs https://docs.abdm.gov.in/mcp
```

For other agents, add an HTTP MCP server named `abdm-docs` at `https://docs.abdm.gov.in/mcp` using their config format.

## 4. Report back

Tell the user what you installed and where you suggest starting. Offer three prompts from the **Try asking** section of the skills that fit, and ask what they are building. One caution to keep for the whole engagement:

- The skills are snapshots. The current documentation lives at https://nha-in.github.io/docs/main/; prefer it, and the MCP server when connected, over any downloaded copy that has aged.

## 5. Plan before you build

Integration work starts from a plan file and keeps it current. Before the first change to the codebase and the first sandbox call:

1. Look for `INTEGRATION-PLAN.md` at the root of the repository. If it exists, read it, say in one line where the work stands, and resume from the first step that is not `done`.
2. If it does not exist, scope the work first: the goal, the role, the modules and the skill that carries each, the routes the interview switched on, and what is out of scope. Write the file with every step `pending` and its exit condition, show it to the person, and start when they agree.
3. After every step, update the file at once: its status, the evidence that proves its exit condition (a request id, a passing test, a file changed), the date, and the count and percentage of steps `done`.

| Status | Means |
|---|---|
| `pending` | Not started |
| `in progress` | The step being worked on now. One at a time |
| `done` | Its exit condition was observed, and the evidence is in the file |
| `blocked` | Waiting on something only the person can give. The file names it and asks one question |

The last steps are the module's functional test cases. Their run log is its own file, linked from the plan. Never write a secret to the plan: no token, client secret, OTP, password or patient identifier.

