---
id: hiecm.decision.spec-per-module
type: decision
gateway: hiecm
milestone: n/a
version: abdm-v3
title: One OpenAPI file per module
summary: Each HIE-CM module is published as its own complete OpenAPI file, in
  YAML and JSON.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/api-specifications.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/api-specifications.mdx#spec-per-module. Edit
      the page, never this file.
related:
  decisions:
    - hiecm.decision.callbacks-as-webhooks
---

# One OpenAPI file per module

## In plain words

Each module has a specification of its own: the gateway, M1 to M4, P1 to P4,
and the three use cases. A module's file is complete on its own, so an
integration that builds one milestone reads one file. Each is published in
YAML and JSON, for example `/specs/hiecm-m2.yaml` and `/specs/hiecm-m2.json`.

The headers every call carries, such as `REQUEST-ID` and `TIMESTAMP`, are
declared again in each file, so no file depends on another.

## Before you start

Know which milestones your role builds. See [milestones](/docs/hiecm/v3/milestones).

## What happens

Load only the files for the modules you build, and treat each as independent. A header declared in one file is declared again in every other, so do not merge the files into one document.

## How you know it worked

Every call your integration makes is found in the file of the module it belongs to, with no reference into another file.
