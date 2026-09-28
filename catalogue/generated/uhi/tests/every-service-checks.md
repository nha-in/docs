---
id: uhi.test.every-service-checks
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Go-live checks every UHI service carries
summary: Eight items every UHI go-live checklist carries, from Milestone 2 and
  key registration to signing, async handling and passed test cases.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/build-it-well.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/build-it-well.mdx#checked-for-every-service.
      Edit the page, never this file.
related:
  tests:
    - uhi.test.run-test-cases
    - uhi.test.consultation-go-live-checklist
  concepts:
    - uhi.concept.screen-requirements
  decisions:
    - uhi.decision.choose-role
---

# Go-live checks every UHI service carries

## In plain words

Each service's go-live checklist carries these items. Work through them before
you request sign-off.

| # | Item |
| --- | --- |
| 1 | For an [EUA](/docs/uhi/v1/getting-started/glossary#eua), [Milestone 2](/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) completed |
| 2 | Ed25519 key pair generated with the Header Generation Utility; public key submitted |
| 3 | Sandbox registration form completed and sandbox access received |
| 4 | HTTPS callback URL live and reachable from the public internet |
| 5 | Request signing implemented: Ed25519 and BLAKE-512 |
| 6 | Asynchronous answers handled. Nothing blocks on a synchronous reply to `search` |
| 7 | Every test case for your service passed in sandbox |
| 8 | Sign-off requested with sandbox test evidence |

[Physical Consultation](/docs/uhi/v1/services/consultation#go-live-checklist)
carries its full twenty item checklist.

## Before you start

Your service page, with its own test cases and go-live checklist, and your role for that service.

## What happens

Treat each row as a pass or fail item that needs evidence. Items 1 to 4 are set up before you build. Items 5 and 6 live in your code. Items 7 and 8 close the list.

## How you know it worked

Each row has evidence: the Milestone 2 completion, the submitted public key, the sandbox access, a callback received on your public HTTPS URL, a signed call that is not refused, and every test case passed.

## When it goes wrong

An EUA without Milestone 2 cannot be onboarded onto any service, so item 1 blocks the rest. A callback URL reachable only inside your network fails item 4. A handler that waits on the reply to `search` for results fails item 6. For Physical Consultation, pass its twenty item list as well.
