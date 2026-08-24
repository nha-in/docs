---
title: M3 test cases
sidebar_label: Test cases
sidebar_position: 6
description: What to exercise before you call M3 done, and what the source does not specify.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
---

# M3 test cases

[NHA](/docs/overview/glossary#nha)'s [ABDM](/docs/overview/glossary#abdm) Milestone 3 (M3) document does not contain a test case list. No test data, no expected responses, no pass criteria. This page does not invent them. It lists the paths through the flow that a working M3 integration has to survive, derived from the flow the document describes.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 3. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

Nothing on this page has been run against the ABDM sandbox from this repository. Treat it as a checklist to build against, not a report of results.

## Before you start

You need three things in place.

1. Sandbox credentials and an access token. [Get started](/docs/overview/get-started) covers the signup.
2. A registered callback URL that NHA's [gateway](/docs/overview/glossary#gateway) can reach. Most M3 results arrive there, not in a response body.
3. A patient with an [ABHA](/docs/overview/glossary#abha) address and at least one record held by a [HIP](/docs/overview/glossary#hip). Sandbox test identities are in the [data dictionary](/docs/api/data-dictionary).

Without the third, a consent request can be granted and still return no records. You will not be able to tell a working integration from a broken one.

## The paths to exercise

| # | Path | What proves it worked |
|---|---|---|
| 1 | Raise a consent request | You receive an on-init callback carrying a consent request id |
| 2 | Poll request status before the patient acts | Status comes back `Requested` |
| 3 | Patient grants | You receive a notify callback with one or more [consent artefact](/docs/overview/glossary#consent-artefact) ids and the request id |
| 4 | Patient denies a second request | You receive a notify callback with status `Denied` and no artefact ids |
| 5 | Fetch the artefact | You receive an on-fetch callback for the artefact id you quoted |
| 6 | Request health information | You receive an on-request callback with a transaction id, request id and status |
| 7 | Receive the data | Encrypted records arrive at the data push callback URL you supplied |
| 8 | Decrypt and render | The records read as [FHIR](/docs/overview/glossary#fhir) content your system can display |
| 9 | Notify receipt | You call health information notify and the transaction closes |

The endpoint path for each of these is on the [API sequence](/docs/api/hie-cm/m3/api-sequence) page.

## The edge paths worth running

These are the ones that break in production if you skip them in sandbox.

| Case | Why it matters |
|---|---|
| Fetch after the consent expires | Expiry is set by the patient. Your code has to stop, not retry forever. |
| Fetch after the patient revokes | Revocation can land between a successful fetch and the next one. |
| A grant that produces more than one artefact | Records in two hospitals produce two artefacts. Handling only the first is a common bug. |
| A request for several [HI types](/docs/overview/glossary#hi-type) where only some exist | You have to render a partial result without treating it as a failure. |
| No on-init callback at all | Confirms your callback URL is registered and reachable. |

## Coverage of the code tables

Run at least one request per purpose of use code you plan to send in production, and one per HI type you plan to display. Both tables are on the [use cases](/docs/api/hie-cm/m3/use-cases) page. A code your system never sends in sandbox is a code your system has never tested.

## What is not specified

| Missing | Where it would have been |
|---|---|
| Expected response bodies | Every sample in NHA's M3 document is a screenshot |
| The on-status callback path | Not stated in the document |
| Sandbox test identities for consent | Not in the M3 document. See the [data dictionary](/docs/api/data-dictionary). |
| Pass criteria for certification | Not in the M3 document |

For response shapes, use the [M3 API reference](/reference/hiecm-m3) and the [gateway reference](/reference/hiecm-gateway). [Support](/docs/support) lists the channels for anything neither covers.
