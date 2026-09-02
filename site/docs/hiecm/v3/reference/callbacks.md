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
| <span class="api-chip api-chip--post">POST</span> | `/v0.5/care-contexts/discover` | A discovery request for a patient you may hold records for |
| <span class="api-chip api-chip--post">POST</span> | `/v0.5/links/link/init` | A request to start linking a care context |
| <span class="api-chip api-chip--post">POST</span> | `/v0.5/links/link/confirm` | Confirmation of a link, carrying the token the patient approved |
| <span class="api-chip api-chip--post">POST</span> | `/v0.5/health-information/hip/request` | A request for the records a consent covers |
| <span class="api-chip api-chip--post">POST</span> | `/v0.5/consents/hiu/notify` | A consent notification to an HIU bridge |
| <span class="api-chip api-chip--post">POST</span> | `/api-hiu/data/notification` | The provider pushes encrypted health information to the URL named in the request. |

## M3 Consent and fetching

| Method | Callback | What it carries |
| --- | --- | --- |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/request/on-init` | The consent request was accepted, with its request id |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/request/notify` | The patient's decision, sent to the requester |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/consent/request/hip/notify` | The patient's decision, sent to the record holder |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/on-fetch` | The consent artefact detail, fetched by artefact id |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/health-information/on-request` | Acknowledgement of a health information request |
| <span class="api-chip api-chip--post">POST</span> | `/api/v3/hiu/consent/request/on-status` | The consent manager reports the state of a consent request you asked about. |

