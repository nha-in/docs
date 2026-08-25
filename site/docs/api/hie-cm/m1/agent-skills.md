---
title: M1 agent skills
sidebar_label: Agent skills
sidebar_position: 4
description: How the M1 agent skills are built, what exists today, and how to install them into Claude Code, Cursor, Codex CLI or GitHub Copilot.
verification: unverified
source: repository catalogue/hiecm atom folders and plugins/abdm
---

# M1 agent skills

If you are integrating Milestone 1 (M1) with a coding agent such as Claude Code or Cursor, you want the agent to hold the [ABHA](/docs/overview/glossary#abha) rules in front of it rather than guess at them. That is what the [ABDM](/docs/overview/glossary#abdm) agent skills are for. They are the same content as these pages, packaged so an agent loads only the part it needs.

:::note[Not on a marketplace yet]
The two skills below exist in this repository today, under `plugins/abdm/skills/`, and install locally with the script in this page. There is no published marketplace listing yet, so `/plugin marketplace add` is not available. Check [what's new](/docs/whats-new) for that release.
:::

## What the skills are

They are build outputs, not hand written documents. The pipeline runs in one direction:

1. Every M1 fact lives once, as an atom in this repository's catalogue: an endpoint, a flow, an error, a test case.
2. `scripts/compile-skills.mjs` selects the atoms each skill needs and assembles them against a template.
3. The output is a set of `SKILL.md` files under `plugins/abdm/skills/`, checked by `scripts/validate-skills.mjs` against the same atoms.

One consequence matters to you. A compiled skill is never edited by hand. If a skill tells your agent something wrong, the atom behind it is wrong, and fixing the atom fixes the skill on the next build. Report it through [support](/docs/support) rather than patching your local copy.

## What exists today

Two of the three planned M1 skills:

- **`hiecm-m1-build`** walks each M1 flow (create an ABHA, log in, find an ABHA, update a profile) as an observe-orient-decide-act loop, citing the flow and endpoint atoms behind every call. Same ground as the [API sequence](/docs/api/hie-cm/m1/api-sequence) page.
- **`hiecm-m1-debug`** matches a failed M1 call against the Catalogue's M1 error atoms and walks to a named fix, verified by the original call succeeding. Same ground as the [errors](/docs/api/hie-cm/m1/errors) page.

**`hiecm-m1-test` does not exist yet, and is not merely unpublished.** The Catalogue has no atoms of type `test` yet anywhere, for any milestone, so there is nothing to compile it from. The [test cases](/docs/api/hie-cm/m1/test-cases) page has the content in prose; it has not been broken into typed atoms. Building this skill from prose would mean inventing structure the compiler cannot check against anything, which is the one thing this pipeline exists to refuse to do. A page that does not exist is merely absent; this section says so out loud instead of guessing at one.

## Installing

All four targets below read the identical `SKILL.md` file; only the destination directory differs. From a checkout of this repository:

```bash
node scripts/compile-skills.mjs        # (re)compiles, if you changed an atom
scripts/install-skill.sh hiecm-m1-build claude    # or cursor | codex | copilot | all
scripts/install-skill.sh hiecm-m1-debug claude
```

| Target | Where it lands | Notes |
|---|---|---|
| Claude Code | `.claude/skills/<name>/` | Auto-discovered from the project. A `/plugin install abdm` path will exist once this is on a marketplace; today, install the two skills directly. |
| Cursor | `.cursor/skills/<name>/` | Same file, unmodified. |
| Codex CLI | `.codex/skills/<name>/` | Same file, unmodified. |
| GitHub Copilot | `.github/skills/<name>/` | Covers Copilot in VS Code, Visual Studio, JetBrains, github.com and the CLI, since they all read from this one path. |

Add `--user` (not supported for the Copilot target, which has no single documented global path) to install to your personal skills directory instead of this project's.

## What to do about the test skill in the meantime

Point your agent at the [test cases](/docs/api/hie-cm/m1/test-cases) page directly. The [APIs](/docs/api/hie-cm/m1/apis) page carries the paths, headers, bodies and curl samples taken from NHA's M1 Postman collection if you need more than the two compiled skills cover.

The OpenAPI file behind the [interactive M1 reference](/reference/hiecm-m1) is still a stub. It carries the tag groups and the security scheme, and no operations, because NHA's swagger has not been fetched and reconciled yet. Do not point an agent at it expecting endpoint definitions.
