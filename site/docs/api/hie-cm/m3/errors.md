---
title: M3 errors
sidebar_label: Errors
sidebar_position: 5
description: What the M3 source says about failures, and the states you have to handle at each step.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
---

# M3 errors

[NHA](/docs/overview/glossary#nha)'s [ABDM](/docs/overview/glossary#abdm) Milestone 3 (M3) document does not contain an error catalogue. There are no error codes in it, no messages and no remediation table. This page does not invent one. What it does give you is the list of places the flow can stall, and what the document does say about each.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 3. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## The one error mechanism the source names

The request status call is the mechanism NHA's document offers for finding out what went wrong. Its description is explicit: it lets you check whether a request is completed, still in progress or failed, and it provides error details where there are any.

`/api/hiecm/consent/v3/request/status`

So when a consent request goes quiet, that call is the first thing to reach for, not a retry of the request itself. Retrying the request creates a second request and a second thing for the patient to answer.

## Where the flow can stall

Each row is a real stall the shape of the flow allows. The cause column is reasoning from the flow, not text quoted from NHA's document.

| Stage | What you observe | Where to look |
|---|---|---|
| After consent request init | No on-init callback arrives | Your callback URL registration, and whether your endpoint is reachable from NHA's [gateway](/docs/overview/glossary#gateway) |
| After on-init | Status stays `Requested` | The patient has not acted. This is not an error. It has no timeout you control. |
| After the patient acts | Status is `Denied` | The patient refused. There is no partial grant to fall back on. Ask again only with a better reason. |
| After a grant | No consent artefact ids in the notification | Read the notify callback again. The grant notification is where the artefact ids arrive. |
| Consent fetch | No on-fetch callback | The artefact id you quoted, and whether the consent has since expired or been revoked |
| Health information request | on-request arrives, data never does | Your data push callback URL. The records land there, not on the on-request callback. |
| Data push | Records arrive but will not decrypt | Your key material. The scheme is [ECDH](/docs/overview/glossary#ecdh), specified on the [HIP](/docs/overview/glossary#hip) side in NHA's M2 document. See [M2](/docs/api/hie-cm/m2). |

## Two failures that are not bugs

**Expiry.** A granted consent carries an expiry date and time the patient set. After it passes, the consent is spent. NHA's document has a set of expiry screens, but they are screenshots and no text converted, so the exact behaviour at the boundary is not documented here. Treat expiry as a hard stop and raise a fresh request.

**Revocation.** The patient can revoke a consent at any time after granting it. A fetch that worked yesterday can fail today for that reason alone. This is the system working as designed.

## What is missing, and where to go instead

The M3 document is a change note against an existing page set. It carries the flow and the endpoint paths. It does not carry error codes, HTTP status codes or response bodies, because every sample in it is a screenshot.

For error responses per endpoint, use the [M3 API reference](/reference/hiecm-m3) and the [gateway reference](/reference/hiecm-gateway). If you hit a failure neither of those explains, [support](/docs/support) lists the channels.
