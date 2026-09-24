---
title: Session
sidebar_label: Overview
sidebar_position: 0
description: "The Session calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
source: nhcx-package/apis/01-session
generated: true
---

# Session

The token does not come from NHCX.

## APIs

| Call | Called by | Method and path | What it does |
| --- | --- | --- | --- |
| [Session token](/docs/nhcx/v1/api/session/endpoints/session-api-hiecm-gateway-v3-sessions) | Any participant | `POST /api/hiecm/gateway/v3/sessions` | Mints the ABDM gateway session token that every NHCX call carries, from the client ID and secret you received when you registered on the ABDM sandbox. |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, ABDM session token. | `https://dev.abdm.gov.in` |
| Production. | `https://apis.abdm.gov.in` |

## Guides that use these calls

- [Session token](/docs/nhcx/v1/getting-started/session-token)
- [Quickstart](/docs/nhcx/v1/getting-started/quickstart)

The whole specification, with a request you can send from the page, is the [Session API reference](/reference/nhcx-session).
