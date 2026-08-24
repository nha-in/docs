---
id: hiecm.decision.spec-per-module
type: decision
gateway: hiecm
milestone: n/a
version: abdm-v3
title: One OpenAPI file per module rather than one file for the gateway
summary: >
  The catalogue keeps a separate specification per milestone, which
  suits retrieval and per module publishing better than a single large
  document.
sources:
  - file: catalogue/openapi/CONVENTIONS.md
    status: not-yet-hashed
    note: This repository's own specification conventions.
verified:
  status: unverified
related:
  decisions: [hiecm.decision.callbacks-as-webhooks]
---

# One OpenAPI file per module rather than one file for the gateway

## In plain words

ABDM's surface could be described in one large OpenAPI file, or in one
file per module. This catalogue uses one per module: gateway, M1, M2,
M3 and M4.

## Before you start

Nothing. This is a structural choice you meet the moment you open
`catalogue/openapi/`.

## What happens

| | One file per module | One file for everything |
|---|---|---|
| Reading | A module is a whole document | Reader filters mentally |
| Publishing | One reference page per module | One very long page |
| Phase honesty | M4 declares itself Phase 2 and stays empty | Phasing hides inside tags |
| Retrieval | Module facets sit on `info` once | Facets must go per operation |
| Duplication | Shared headers repeated per file | Declared once |

The default is one per module. The decisive reason is that scope here is
phased: M1 to M3 carry content and M4 is Phase 2. A file that declares
its own phase in `info.x-abdm-phase` cannot quietly leak Phase 2 content
into a Phase 1 answer.

The cost is real and accepted: the shared headers are repeated in each
file, because no bundling step exists and cross file references do not
resolve reliably when each spec is served as a static file.

## How you know it worked

You chose correctly if a developer integrating one milestone never
opens another module's file, and if a retrieval query scoped to a
module can be answered without filtering out four other modules of
operations.

## When it goes wrong

The failure mode is header drift: the same parameter defined five times
and edited in four. If that starts happening, add a bundling step and
author against shared components, rather than switching to a single
file.

Switching is cheap in either direction, because the operations
themselves are unchanged by the split.

