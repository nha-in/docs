---
title: Status and search
sidebar_label: Overview
sidebar_position: 0
description: "The Status and search calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
verification: unverified
source: nhcx-package/apis/08-status
generated: true
---

# Status and search

Asynchronous exchanges lose messages, stall in queues and outlive the shift of the desk operator who started them.

## Calls

| Call | Method and path | What it does |
| --- | --- | --- |
| [Status check](/docs/nhcx/v1/api/status/endpoints/status-v1-status) | `POST /v1/status` | Sender asks NHCX where its own in-flight request stands; the gateway answers request.queued or request.dispatched, and only dispatched yields a callback. |
| [Search submit](/docs/nhcx/v1/api/status/endpoints/status-v1-search-submit) | `POST /v1/search/submit` | Authorised entity such as NHA or IRDAI sends a Task to retrieve claim information for a case; the payer returns the documents on the search callback. |
| [Search result callback](/docs/nhcx/v1/api/status/endpoints/status-v1-search-on-submit) | `POST /v1/search/on_submit` | Callback returning a search result for task type code=poll; for a claim-document search the payload is the ClaimResponse for the reference number. |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path | Hosted by |
| --- | --- |
| `/v1/status` | The payer |
| `/v1/search/submit` | The payer |
| `/v1/search/on_submit` | The provider |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx` |

## Guides that use these calls

- [Predetermination, status and search](/docs/nhcx/v1/reference/fhir/predetermination-status-and-search)

The whole specification, with a request you can send from the page, is the [Status and search API reference](/reference/nhcx-status).
