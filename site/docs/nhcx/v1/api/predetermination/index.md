---
title: Predetermination
sidebar_label: Overview
sidebar_position: 0
description: "The Predetermination calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
verification: unverified
source: nhcx-package/apis/04-predetermination
generated: true
---

# Predetermination

A hospital planning a treatment can learn the benefit a payer would approve for it before the patient is admitted, and plan the admission and the patient's share of the cost around the answer.

## Calls

| Call | Method and path | What it does |
| --- | --- | --- |
| [Predetermination request](/docs/nhcx/v1/api/predetermination/endpoints/predetermination-v1-predetermination-submit) | `POST /v1/predetermination/submit` | Provider asks the payer what it would approve for a proposed treatment before committing to a pre-authorisation. |
| [Predetermination callback](/docs/nhcx/v1/api/predetermination/endpoints/predetermination-v1-predetermination-on-submit) | `POST /v1/predetermination/on_submit` | Payer returns its estimate for a predetermination request to the provider: a `ClaimResponse` with `use` `predetermination` and the benefit it would approve. |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path | Hosted by |
| --- | --- |
| `/v1/predetermination/submit` | The payer |
| `/v1/predetermination/on_submit` | The provider |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx` |

## Guides that use these calls

- [Predetermination, status and search](/docs/nhcx/v1/reference/fhir/predetermination-status-and-search)

The whole specification, with a request you can send from the page, is the [Predetermination API reference](/reference/nhcx-predetermination).
