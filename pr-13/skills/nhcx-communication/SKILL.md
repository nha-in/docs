---
name: nhcx-communication
description: Add NHCX communication to a hospital information system or a standalone claims desk. Receive the payer's CommunicationRequest, classify it as a query, a notification or a note, acknowledge notifications at once, and answer queries with the TaskBundle reply on the request's own thread, held to the pinned bundle. Starts by checking whether the app already receives payer messages or answers queries, and whether it keeps the pre-auth or claim a query is about, then builds, extends or reuses only what is missing. Self-contained; needs no other skill installed. Use for payer queries, notifications, the inbox, the communication reply, NHCX use case B4, flow steps F9b (communication payer) and F12b.
---

# NHCX communication: the payer's questions and notices

This skill handles the messages a payer starts on a case: it files each CommunicationRequest, decides whether it is a query, a notification or a note, acknowledges notifications at once, and sends the desk's answer to a query as a Communication on the request's own thread.

Read `core/LADDER.md` first. It holds the ladder every NHCX skill walks: the definition of compliant, the stages, the workspace, how to run a stage, and the rules. This folder carries everything it needs and runs on its own; the other six NHCX skills are separate folders, and none of them has to be installed. Paths starting `core/`, `stages/`, `references/`, `fhir/`, `flow/`, `ui/`, `templates/` or `scripts/` are relative to this folder. Paths starting `nhcx-package/` are in the NHCX package, which `scripts/fetch-package.sh` fetches into the target project beside `nhcx-build/`; `references/material.md` names the package file of every pin by its label.

## What this skill covers

| | |
| --- | --- |
| Flow steps | F9b Answer a query, and the claim query of F11, for a `communication` payer; F12b The inbox |
| Tabs | Communication (tab 6); the inbox view across cases |
| Wire | In: `v1/communication/request` on a new thread. Out: `v1/communication/on_request` with the request's correlation id and workflow id echoed, carrying either the TaskBundle reply to a query or, for a notification, the payer's own bundle back with `Task.status completed` |
| Next actions | "Answer the payer (n)", which leads every list while a query is open; "Answer the payer's query" |
| Use cases | B4, its query and notification rows; C6 as readers |
| Module | 7.10, the communication half |
| Pins | `communication/response` (`nhcx-package/fhir/B4/communication-response.json`, the reply), and `communication/request` (`nhcx-package/fhir/B4/communication-request.json`) read as the payer's message |
| Payer fixtures | `nhcx-package/fhir/C6/C6-preauth-query-wf24.json` and `C6-claim-query-wf27.json` (queries), `nhcx-package/fhir/C6/C6-notification-wfN02.json` (a PMJAY notification); the replies in `nhcx-package/fhir/B4/*` |
| Tables | `claim_query`, its correlation id unique |
| FHIR | `fhir/FHIR.md` section 7; `references/fhir-knowledge.md` section 9; `references/flow-knowledge.md` section 3 |

Not here: a `resubmit` payer's query (PMJAY). It arrives inside the ClaimResponse on the case's own thread and is answered as a fresh submit by the pre-auth use case (19, 131) or the claim use case (161). A PMJAY CommunicationRequest is always a notification.

## Needs and hands on

Needs: at least one leg a payer can ask about, a pre-auth or a claim, with its bundle as sent kept on the leg (`request_json`). The reply lifts the Claim, Patient, Organizations, Practitioner and Coverage from it. Stage 0 checks for it below, whichever way the app got it.

Hands on: `claim_query` rows by kind and status. An open query flips its leg's sub-stage to `queried` and leads every action list; an answered query leaves the leg to wait for the decision on its own thread.

## Capability check

Stage 0 (`stages/0-capability-check.md`) gives every capability below a verdict: search for the markers, run the check, record what was observed.

### Own

| Id | What | Look for | Present when (observed) |
| --- | --- | --- | --- |
| `communication.receive` | Receive and file a CommunicationRequest | a handler for `v1/communication/request`; `CommunicationRequest`, `contentString`, `basedOn`; a table keyed on the request's correlation id | Delivered through the door, `C6-preauth-query-wf24.json` matches its case by the claim number inside and creates one `claim_query` row with the questions verbatim; a second delivery creates none; the `communication/request` pin reads into its questions and the leg asked about |
| `communication.classify` | Query, notification or note | `intent`, `reasonCode`, `additionalinfo`, `tatquery`, `claimArbitartion` | The classification table (7.10 Validate, row 3): `C6-preauth-query-wf24.json` is a query; `C6-notification-wfN02.json` is a notification; the same notification under a `communication` adapter with `intent order` is a query; a bare Communication is a note |
| `communication.acknowledge` | Acknowledge a notification at once | a send on `v1/communication/on_request` with `Task.status` `completed` | The payer's bundle goes back with `Task.status completed`, the reason echoed and the provider Organization first, with the request's correlation id and workflow id in `jwe_headers`; sent outside the callback (the 7.1 stub sees no send during receipt) |
| `communication.reply` | F9b: the TaskBundle reply | `Communication`, `basedOn`, `inResponseTo`, `contentAttachment` | Fed the request pin and the pre-auth pin, the builder produces `communication/response` byte for byte with `meta.lastUpdated`, `timestamp` and `authoredOn` excluded; `basedOn` names the request and `inResponseTo` is absent; the correlation id and workflow id are the request's; an empty reply is refused before any HTTP call (7.10 Validate, rows 1, 4 and 5) |
| `communication.screens` | The Communication tab and the inbox | an inbox route; a reply form | The questions render verbatim from the stored request; the reply box sits on the inbox item for a `communication` payer; a notification shows as acknowledged and changes nothing; "Answer the payer (n)" leads the actions while a query is open |

### Foundation

All six capabilities in `core/FOUNDATION.md`. `foundation.callback` is partial until the door matches an inbound request by the claim number inside it; `foundation.state` until an open query flips the leg's sub-stage to `queried`; `foundation.storage` until `claim_query` exists with its unique correlation id.

### Prerequisites

The pre-auth use case (`nhcx-preauth`) or the claim use case (`nhcx-claim`) owns this. The check is here, so neither skill need be installed.

| Capability | Why | Look for | Present when (observed) |
| --- | --- | --- | --- |
| `preauth.send` or `claim.send` (at least one), with the bundle as sent | A query names a Claim the hospital sent, and the reply lifts its entries from that bundle | a pre-auth or claim leg with `correlation_id` and the bundle it posted (`request_json` or the archive) | A leg sent with a stubbed client stores its correlation id and the bundle as posted, with the Claim, Patient, both Organizations, the Practitioner and the Coverage in it |

### Host facts

The document store, since a reply can attach documents; the accepted content types.

## The ladder, for this skill

| Stage | What is specific here |
| --- | --- |
| 0 | The tables above. |
| 1 | Confirm the shared page, or write it if this skill runs first on the app. Own row: B4. If every payer in scope is a `resubmit` payer, the reply is `later` and only receipt and acknowledgement are in. |
| 2 | Risks: acknowledge or lose the thread; the reply keyed on the wrong correlation id (it carries the request's); `basedOn`, never `inResponseTo`; nothing is sent inside the callback. |
| 3 | The host facts above. |
| 4 | The `claim_query` home; the reply's source map (the queried leg's bundle as sent, the desk's text and documents); the classification inputs. If this skill maps first, every table's home too. |
| 5 | The Communication tab and the inbox; action F9b for a `communication` payer. |
| 6 | The communication half of 7.10; the foundation modules stage 0 found absent or partial. |
| 7 | The communication half of 7.10, as far as its verdicts say. |
| 8 | 7.10 Validate rows 1, 3, 4, 5 and 8. |
| 9 | The reply pin; the request reader; the classification table as a parametrised test; matrix rows B4 query and B4 notification; the C6 captures as readers; the cross-cutting rows for an inbound request (redelivery, unmatched). |
| 10 | Rung 1. Rung 3 walks B4, since a generic payer asks by communication. Rung 4 sees N02 notifications only. |
| 11 | This skill's section. |

## Rules for these legs

- A `resubmit` payer's CommunicationRequest is always a notification, whatever it says.
- A notification is acknowledged at once and the case left alone.
- A query is filed `open` and leads every action list until answered. The leg row is untouched; its sub-stage reads `queried` while the query is open.
- The reply names the request in `Communication.basedOn`, never `inResponseTo`, and echoes the request's correlation id and workflow id.
- Documents in a reply go under the payer's code, else `ODN`.
- Nothing is sent inside the callback.
- A bare `Communication` with no request is a note: recorded, shown, never acted on.

## Done when

- Every gate in this skill's block of `nhcx-build/STATE.md` is closed with evidence.
- The reply pin passes, and the request pin reads.
- The compliance points in `core/LADDER.md` hold for F9b (communication payer) and F12b.
