---
title: M1 agent skills
sidebar_label: Agent skills
sidebar_position: 4
description: How the M1 agent skills are built, and their current status, which is not yet published.
verification: unverified
source: repository README.md and the catalogue/hiecm atom folders
---

# M1 agent skills

If you are integrating Milestone 1 (M1) with a coding agent such as Claude Code or Cursor, you want the agent to hold the [ABHA](/docs/overview/glossary#abha) rules in front of it rather than guess at them. That is what the [ABDM](/docs/overview/glossary#abdm) agent skills are for. They are the same content as these pages, packaged so an agent loads only the part it needs.

:::note[Not published yet]
The M1 skill bundle does not exist yet. There is no download and no install
command. This page says how it will work and what it will be called, so that
you know what to look for. Check [what's new](/docs/whats-new) for the release.
:::

## What the skills are

They are build outputs, not hand written documents. The pipeline runs in one direction:

1. Every M1 fact lives once, as an atom in this repository's catalogue: an endpoint, a flow, an error, a test case.
2. The compiler selects the atoms each skill needs and assembles them against a template.
3. The output is a set of `SKILL.md` files inside a Claude Code plugin named `abdm`.

One consequence matters to you. A compiled skill is never edited by hand. If a skill tells your agent something wrong, the atom behind it is wrong, and fixing the atom fixes the skill on the next build. Report it through [support](/docs/support) rather than patching your local copy.

## What the M1 skills will cover

The compiler produces skills by kind, not one giant skill. For M1 that means an orientation skill for the concepts, a build skill that walks the flows on the [API sequence](/docs/api/hie-cm/m1/api-sequence) page, a test skill built from the [test cases](/docs/api/hie-cm/m1/test-cases), and a debug skill built from the [errors](/docs/api/hie-cm/m1/errors) page.

## Current status

The M1 atom folders in this repository's catalogue hold no atoms yet, and no plugin has been built from them. So:

- There is no marketplace URL to add.
- There is no install command that works today.
- The `abdm` plugin name above is the compiler's target, not a published package you can fetch.

Anything that claims otherwise is ahead of the code.

## What installing will look like

When the bundle ships, Claude Code installs it as a plugin from a marketplace. The two commands take this shape, with the marketplace address coming from the release note:

```text
/plugin marketplace add <MARKETPLACE_URL_FROM_THE_RELEASE_NOTE>
/plugin install abdm
```

Cursor and other agents read skill files from the repository rather than from a plugin marketplace. The install step there is a copy of the compiled skill folder into the agent's skills directory. We will publish the exact path with the bundle, because guessing it now would waste your afternoon.

## What to do in the meantime

Point your agent at these pages. The [M1 overview](/docs/api/hie-cm/m1) links the whole ladder in reading order, and the [APIs](/docs/api/hie-cm/m1/apis) page carries the paths, headers, bodies and curl samples taken from NHA's M1 Postman collection. That is the densest M1 context available today, and it is less convenient than a skill.

The OpenAPI file behind the [interactive M1 reference](/reference/hiecm-m1) is still a stub. It carries the tag groups and the security scheme, and no operations, because NHA's swagger has not been fetched and reconciled yet. Do not point an agent at it expecting endpoint definitions.
