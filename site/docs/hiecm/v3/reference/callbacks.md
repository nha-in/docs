---
title: Callbacks
sidebar_label: Callbacks
sidebar_position: 2
description: The calls ABDM makes back to your bridge, as the specifications declare them.
verification: unverified
source: the published OpenAPI specifications
generated: true
covers: [hiecm.concept.asynchronous-callbacks, hiecm.decision.callbacks-as-webhooks]
---

# Callbacks

A call you make is acknowledged, and the answer arrives later at your own endpoint. Those inbound calls are declared as webhooks in the specifications, and this page is generated from them.

## M2 Linking and sharing

| Method | Callback | What it carries |
| --- | --- | --- |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hip/patient/care-context/discover` | A discovery request for a patient you may hold records for |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hip/link/care-context/init` | A request to start linking a care context |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hip/link/care-context/confirm` | Confirmation of a link, carrying the token the patient approved |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hip/health-information/request` | A request for the records a consent covers |
| <span class="api-chip api-chip--post">POST</span> | `/v0.5/consents/hiu/notify` | A consent notification to an HIU bridge |
| <span class="api-chip api-chip--post">POST</span> | `/api-hiu/data/notification` | The provider pushes encrypted health information to the URL named in the request. |
| <span class="api-chip api-chip--post">POST</span> | `/v3/hip/token/on-generate-token` | The link token m2_generate_link_token generated, or why it failed |
| <span class="api-chip api-chip--post">POST</span> | `/v3/link/on_carecontext` | The outcome of a care context linking call you made |
| <span class="api-chip api-chip--post">POST</span> | `/v3/links/context/on-notify` | The outcome of a care context notify call you made |
| <span class="api-chip api-chip--post">POST</span> | `/v3/patients/sms/on-notify` | The outcome of an SMS deep link notify call you made |

## M3 Consent and fetching

| Method | Callback | What it carries |
| --- | --- | --- |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/request/on-init` | The consent request was accepted, with its request id |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/request/notify` | The patient's decision, sent to the requester |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/consent/request/hip/notify` | The patient's decision, sent to the record holder |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/on-fetch` | The consent artefact detail, fetched by artefact id |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/health-information/on-request` | Acknowledgement of a health information request |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/request/on-status` | The consent manager reports the state of a consent request you asked about. |
| <span class="api-chip api-chip--post">POST</span> | `/health-information/transfer` | The encrypted health data itself, pushed to the URL you supplied |

