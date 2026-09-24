---
title: Onboarding
sidebar_label: Overview
sidebar_position: 0
description: "The Onboarding calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
source: nhcx-package/apis/11-onboarding
generated: true
---

# Onboarding

Nothing moves through NHCX until both the sender and the recipient exist in the participant registry, which the platform treats as the source of truth for who may exchange claims data.

## APIs

Onboarding differs between the two environments. The sandbox registers a participant in one call. Production registers it in steps, each confirmed with a passcode sent to the registered mobile number.

### Sandbox

Base URL: `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice`. Credentials: the client ID and secret you received when you registered on the ABDM sandbox.

| Call | Called by | Method and path | What it does |
| --- | --- | --- | --- |
| [Participant create (v1)](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-participant-create) | Provider or payer | `POST /participant/create` | Creates a participant record in the NHCX registry from a full v1 profile and returns the generated participant_code. |

To change the record later in the sandbox, use [Submit the participant update (v1)](/docs/nhcx/v1/api/registry/endpoints/registry-participant-update) in the participant registry.

### Production

Base URL: `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice`. Credentials: the production credentials issued after sandbox certification. The rows run in the order the steps happen.

| Call | Called by | Method and path | What it does |
| --- | --- | --- | --- |
| [Participant create (v2)](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-v2-participant-create) | Provider or payer | `POST /v2/participant/create` | Registry-linked creation: registry type and ID, role codes, endpoint URL and contacts; returns participantid and a transactionid for /validate. |
| [Validate participant creation](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-validate) | Provider or payer | `GET /validate` | Confirms a participant creation by presenting the SMS passcode and the transactionId returned by /v2/participant/create. |
| [Submit the participant certificate and bridge update (v2)](/docs/nhcx/v1/api/registry/endpoints/registry-v2-participant-update) | Provider or payer | `POST /v2/participant/update` | Stages the certificate and callback URL; the call sits in the participant registry. |
| [Validate participant update](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-update-validate) | Provider or payer | `GET /update/validate` | Confirms a participant update by presenting the SMS passcode and the transactionId returned by /v2/participant/update. |

### Scheme hospital onboarding

No environment limit is published for this call. Use it when the scheme operator, for example PMJAY, asks for this form.

| Call | Called by | Method and path | What it does |
| --- | --- | --- | --- |
| [HEM-entity participant create](/docs/nhcx/v1/api/onboarding/endpoints/onboarding-v2-participant-hementity-create) | Provider (a hospital) | `POST /v2/participant/hementity/create` | Creates a hospital (HEM-entity) participant from the full empanelment payload (bank, tax, beds, specialities, doctors); returns status and hospitalid. |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, Participant service. | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production. | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

## Guides that use these calls

- [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant)
- [Your callback URL is rejected or never called](/docs/nhcx/v1/troubleshooting/your-callback-url-is-rejected)

The whole specification, with a request you can send from the page, is the [Onboarding API reference](/reference/nhcx-onboarding).
