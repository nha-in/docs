---
title: API references
sidebar_label: All endpoints
sidebar_position: 1
description: Every operation published for this gateway, module by module.
verification: unverified
source: the published OpenAPI specifications
generated: true
---

# API references

Every endpoint below is generated from the specification that declares it. Each one has its own page with the headers, the body and a request you can send.

This page lists every module, including any that the role you have chosen does not use. The sidebar shows only yours.

## NHCX biometric authentication

6 endpoints across 2 use cases: Fingerprint and iris, Face. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/nhcx-biometric)

## NHCX session token

1 endpoint across 1 use case: Sessions. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/nhcx-gateway)

## NHCX participant service

12 endpoints across 3 use cases: Onboarding, Discovery, Policy linking. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/nhcx-participant)

## NHCX use case endpoints

22 endpoints across 11 use cases: Coverage eligibility, Insurance plan, Preauthorisation, Claim, Task, Communication, Search, Predetermination, Payment, Status, Endpoints. Each endpoint has its own page in the sidebar.

[Read the whole specification](/reference/nhcx-usecases)

## Callbacks with no documented trigger

2 callbacks are declared at module level with no call named against them. Which call produces each one is not documented, so this page does not say.

| Module | Method | Arrives at | What it carries |
| --- | --- | --- | --- |
| NHCX use case endpoints | <span class="api-chip api-chip--post">POST</span> | [`delivery`](/docs/nhcx/v1/api/nhcx-usecases/endpoints/nhcx-webhook-delivery) | The exchange delivers a message to your bridge URL |
| NHCX use case endpoints | <span class="api-chip api-chip--post">POST</span> | [`error`](/docs/nhcx/v1/api/nhcx-usecases/endpoints/nhcx-webhook-error) | The exchange reports a message it could not deliver |

