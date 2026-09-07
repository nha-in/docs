---
title: Communication
sidebar_label: Communication
description: The payer's asynchronous channel to the provider, specified field by field and with no sample bundle in either direction.
verification: unverified
source: "NHCX PMJAY Integration Handbook §12.1, §12.2, §12.3, and its communication implementation notes; NHCX Requests and Responses for UseCases, Communication sheet and Value sets; Sample FHIR bundles, `preauth/preauthresponse_with_query.txt`; AWS Sandbox NHCX Use Case Postman Collection; NHCX Provider Side Use Cases, Sandbox Exit Process"
sidebar_position: 17
---

# Communication

Communication is the payer's asynchronous channel to the provider. It is not a response to anything. The payer uses it to raise a turnaround-time alert, pass on a grievance, announce a policy or wallet change, or ask for a document that the standard query mechanism does not cover. The provider must acknowledge within thirty seconds, whether or not the underlying issue is resolved.

**There is no sample bundle for either direction.** The PMJAY archive holds nothing under communication, and the sandbox Postman entry for `/v1/communication/request` carries the same recycled ciphertext as seven other endpoints. Everything in this chapter is drawn from the PMJAY handbook sections 12.2 and 12.3, which describe a payload captured on 3 December 2025 for case `PMJAY/CH/S/2024/R2/1000010394`, and from the NHCX Communication sheet. Treat it as specified and unsampled, and expect to discover differences on first contact.

## In short

- The payer's asynchronous channel to the provider. It is not a response to anything.
- There is no sample bundle for either direction; everything here is from specification.
- The provider must acknowledge within thirty seconds, whether or not the issue is resolved.
- Under PMJAY this channel never carries a document query.

## The endpoints

| Endpoint | Direction | What it carries |
| :---- | :---- | :---- |
| `POST /v1/communication/request` | Payer to gateway to provider | The `Task` bundle with the message |
| `POST /v1/communication/on_request` | Provider to gateway to payer | The acknowledgement, same shape |

`x-hcx-correlation_id` must be identical on both. The gateway validates `x-hcx-workflow_id` on both.

## The request bundle

Four entries as specified: `Task`, `Communication`, and the two `Organization`s with the payer first.

### Task

| Path | Specified value |
| :---- | :---- |
| `Task.identifier[0].value` | The case number, `PMJAY/CH/S/2024/R2/1000010394` |
| `Task.status` | `completed`, not `requested` |
| `Task.intent` | `proposal` |
| `Task.code.coding.system` | `http://terminology.hl7.org/CodeSystem/financialtaskcode` |
| `Task.code.coding.code` | `poll`, display "Poll" |
| `Task.reasonCode.coding.system` | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-reason-code` |
| `Task.reasonCode.coding.code` | `tatquery`, display "Tat Query Intimation" |
| `Task.input[0].type.coding` | `include`, system `http://terminology.hl7.org/CodeSystem/financialtaskinputtype` |
| `Task.input[0].valueReference.reference` | The `Communication` resource |

`Task.status` is `completed` on the request as well as the acknowledgement. That is the status of the communication event, not of the problem it reports. A turnaround-time breach is still open after the `Task` says `completed`.

`poll` combined with an `include` input is the general NHCX push pattern. It tells the gateway to deliver the referenced resource to the recipient.

### Communication

| Path | Specified value |
| :---- | :---- |
| `Communication.id` | The case number without the prefix, `1000010394` |
| `Communication.identifier[0].type.coding.code` | `MR`, "Medical record number", used here as the claim reference |
| `Communication.identifier[0].system` | `https://payer.pmjay.gov.in` |
| `Communication.status` | `completed` |
| `Communication.category[0].coding.system` | `http://terminology.hl7.org/CodeSystem/communication-category` |
| `Communication.category[0].coding.code` | `reminder` |
| `Communication.priority` | `asap` |
| `Communication.topic.coding.system` | `http://terminology.hl7.org/CodeSystem/communication-topic` |
| `Communication.topic.coding.code` | `progress-update` |

### Category, topic and priority

| Field | Code | When it is used |
| :---- | :---- | :---- |
| `category` | `reminder` | Turnaround-time breach, follow-up, deadline alert |
| `category` | `notification` | One-way information: policy update, wallet change, scheme revision |
| `category` | `instruction` | The provider must perform a specific action |
| `category` | `questionnaire` | A structured question set needing a response |
| `topic` | `progress-update` | Tied to an active claim or preauthorisation. The common case |
| `topic` | `appointment-reminder` | Operational, not tied to a case |
| `priority` | `routine` | No urgent action |
| `priority` | `urgent` | High priority, normal service level |
| `priority` | `asap` | Immediate action expected |
| `priority` | `stat` | Patient safety or fraud |

### Reason codes

`Task.reasonCode` is the field to switch on. It decides which desk the message reaches.

| Code | Trigger |
| :---- | :---- |
| `tatquery` | The case has breached the payer's service-level threshold. The most common code in live traffic |
| `grievance` | A beneficiary or provider complaint needs acknowledgement or corrective action |
| `walletupdate` | The patient's benefit balance or entitlement has changed since approval |
| `policychange` | Rates revised, packages added, empanelment changed |
| `additionalinfo` | The payer needs documents or clarification beyond the standard query |
| `claimArbitration` | The payer has acknowledged a reprocess or erroneous-claim request |

The handbook spells the last one `claimArbitration` in its scenario table and `claimArbitartion` in its reason-code table. Send `claimArbitration` and accept either on receipt.

## The acknowledgement bundle

Identical structure. `Task.status`, `Task.intent`, `Task.reasonCode` and `Task.code` are all echoed back unchanged. Three things differ:

- `Bundle.meta.lastUpdated` and `Bundle.timestamp` carry the acknowledgement time. The captured pair sits about ten minutes apart.
- The provider `Organization` entry comes first, ahead of the payer.
- The handbook records the sandbox payload as having the two organisations' identifier types swapped. The provider organisation is typed `NIIP` and the payer organisation `NPI`, which is backwards. Take the role from the entry order and from `Organization.type`, never from the identifier type code.

## What the samples show

Nothing. No communication bundle exists in the archive in either direction. The only field-level record is the handbook's transcription of one sandbox payload, and that transcription is where the swapped identifier defect was found.

## The query modelled two ways

This is the trap that costs the most time. The NHCX protocol layer and the PMJAY handbook both define a `Task` and `Communication` pair as the way a payer asks the provider a question. It carries `reasonCode` `additionalinfo` and, in the Communication sheet, a `payload` holding the attachment. That is the design above.

The live PMJAY samples do not use it. A payer question arrives inside the preauthorisation or claim response instead, as free text in `ClaimResponse.item.adjudication.reason.coding.display`, pipe-delimited and with no coded structure at all:

```
other Request acknowledged and accepted for further processing.|USER1000099~02/26/2026, 08:47 ~other~testing query with souvik~PPD-Trust|null|USER1000099~02/26/2026, 09:13 ~other~Testing query 2 with souvik~PPD-Trust
```

Each segment is username, timestamp, type, comment and trust, tilde-separated, and a `null` segment appears where a turn is empty. The provider's answer is not a `Communication` either. It is the entire claim bundle re-submitted with the documents added. Chapters 09 and 12 cover that form, which is the only one with samples.

So build both. The ad-hoc form is what PMJAY sends today. The `Task` and `Communication` pair is what the protocol specifies and what a non-PMJAY payer on the general network is entitled to send you.

## Traps

- **Two specifications for the same bundle.** The handbook carries a `Communication` in both directions with `Task.code` `poll`. The NHCX Communication sheet carries a `CommunicationRequest` on the payer's message with `Task.code` `poll`, and a `Communication` on the provider's reply with `Task.code` `deliver`. Parse `Task.input[0].valueReference` by resolving the reference and reading the resource type, not by assuming one.
- **The sheet marks fields mandatory that the handbook's capture omits.** `reasonReference`, `basedOn`, `about`, `statusReason` and `payload` are all listed as mandatory in the sheet and none appears in the transcribed payload. Accept their absence.
- **`Communication.status` is `completed` before anything is resolved.** Do not close a case on it.
- **Identifier types are swapped in the acknowledgement.** See above. This is a recorded sandbox defect, not a reading error.
