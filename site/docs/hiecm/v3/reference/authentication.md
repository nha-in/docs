---
title: Authentication
sidebar_label: Authentication
sidebar_position: 1
description: The credentials every ABDM call carries, and the headers that go with them.
source: the published OpenAPI specifications
generated: true
sidebar_class_name: sidebar-icon sidebar-icon--lock-keyhole
---

# Authentication

Generated from the specifications. Every scheme and header below is declared in one of them.

## Gateway session

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## M1 Identity

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## M2 Health Information Provider

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## M3 Health Information User

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## M4 Registry Integration

**bearerAuth**, `http` `bearer`. M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

## P1 Registration and login

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## P2 Consents Management

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## P3 Subscription

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## P4 Locker

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Scan and Register

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Patient scan and record share

**bearerAuth**, `http` `bearer`. JWT access token issued by the ABDM session API after successful validation of client id and secret.

| Header | Required | What it is |
| --- | --- | --- |
| `REQUEST-ID` | yes | Random UUID, a v4 style guid, unique per request. |
| `TIMESTAMP` | yes | ISO 8601 timestamp of when the request was initiated. |
| `X-HIU-ID` | yes | Identifier of the health information user to which the request was intended. |
| `X-CM-ID` | yes | Suffix of the consent manager to which the request was intended. sbx in the sandbox, abdm in production. |
| `X-AUTH-TOKEN` | yes | JWT access token issued by the PHR service after successful user authentication. If the HIP does not have any role, then it is mandatory. |
| `request-id` | yes | Random UUID, a v4 style guid, unique per callback. |
| `timestamp` | yes | ISO 8601 timestamp of when the callback was sent. |
| `x-hiu-id` | yes | Identifier of the health information user to which the request was intended. |

## Scan and Pay

**bearerAuth**, `http` `bearer`. The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

