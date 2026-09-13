---
title: Onboarding
sidebar_label: Overview
sidebar_position: 0
description: "The Onboarding calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
verification: unverified
source: nhcx-package/apis/11-onboarding
generated: true
---

# Onboarding

Nothing moves through NHCX until both the sender and the recipient exist in the participant registry, which the platform treats as the source of truth for who may exchange claims data.

## Calls

| Call | Method and path | What it does |
| --- | --- | --- |
| [Participant create (v1)](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-participant-create) | `POST /participant/create` | Creates a participant record in the NHCX registry from a full v1 profile and returns the generated participant_code. |
| [Participant create (v2)](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-v2-participant-create) | `POST /v2/participant/create` | Registry-linked creation: registry type and ID, role codes, endpoint URL and contacts; returns participantid and a transactionid for /validate. |
| [HEM-entity participant create](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-v2-participant-hementity-create) | `POST /v2/participant/hementity/create` | Creates a hospital (HEM-entity) participant from the full empanelment payload (bank, tax, beds, specialities, doctors); returns status and hospitalid. |
| [Validate participant creation](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-validate) | `GET /validate` | Confirms a participant creation by presenting the SMS passcode and the transactionId returned by /v2/participant/create. |
| [Validate participant update](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-update-validate) | `GET /update/validate` | Confirms a participant update by presenting the SMS passcode and the transactionId returned by /v2/participant/update. |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, Participant service. | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production. | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

## Guides that use these calls

- [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant)

The whole specification, with a request you can send from the page, is the [Onboarding API reference](/reference/nhcx-onboarding).
