---
title: Session
sidebar_label: Overview
sidebar_position: 0
description: "The Session calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
verification: unverified
source: nhcx-package/apis/01-session
generated: true
---

# Session

The token does not come from NHCX.

## Calls

| Call | Method and path | What it does |
| --- | --- | --- |
| [Session token](/docs/nhcx/v1/api/session/endpoints/session-session-token) | `POST /api/hiecm/gateway/v3/sessions` | Mints the ABDM gateway session token that every NHCX call carries, from the client ID and secret issued for Milestone 1. |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, ABDM session token. | `https://dev.abdm.gov.in` |
| Production. ABDM's published production gateway. Confirm it in your onboarding letter. | `https://apis.abdm.gov.in` |

## Guides that use these calls

- [Session token](/docs/nhcx/v1/getting-started/session-token)
- [Quickstart](/docs/nhcx/v1/getting-started/quickstart)

The whole specification, with a request you can send from the page, is the [Session API reference](/reference/nhcx-session).
