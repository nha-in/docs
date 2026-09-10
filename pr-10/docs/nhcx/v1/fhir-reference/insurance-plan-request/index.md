# Insurance plan request

The smallest message in the whole exchange. One `Task` asking a payer to send back the plan for a policy. There is no patient in it, no encounter and no clinical content, because the plan is a property of the policy and the hospital, not of any admission. The provider sends it once per policy it deals with and caches the answer.

## In short

- The smallest message in the whole exchange: one `Task` asking for the plan behind a policy.
- No patient, no encounter, no clinical content, because the plan belongs to the policy and the hospital.
- Sent once per policy the hospital handles, not once per patient.
- Refresh on a `policychange` communication, on a schedule, and before treatment planning if the cache has no version stamp.

## The bundle

One entry.

| # | Resource | What it is for |
| :---- | :---- | :---- |
| 1 | `Task` | The poll. Carries `code` and two `input[]` values |

The entry uses `urn:uuid:` for both `fullUrl` and `id`, which is the handbook's recommended form. The eligibility bundles use absolute URLs instead. Both work.

## The fields that matter

| Path | Value in the sample |
| :---- | :---- |
| `Bundle.type` | `collection` |
| `Bundle.id` | `6a249219-1401-4fa5-baba-b16b551bf31a` |
| `Bundle.identifier` | system `https://payer.pmjay.nha.gov.in`, value `f9d2071c-ef8d-41ab-a899-c81d4c192a28` |
| `Bundle.meta.lastUpdated` | `2026-03-03T12:14:48+05:30` |
| `Task.status` | `requested` |
| `Task.intent` | `original-order` |
| `Task.code.coding.system` | `http://terminology.hl7.org/CodeSystem/financialtaskcode` |
| `Task.code.coding.code`, `.display` | `poll`, `Poll` |
| `input[0].type.coding` | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code`, code `policyNumber`, display `PolicyNumber` |
| `input[0].valueString` | `PMJAY/HP/S/G` |
| `input[1].type.coding` | same system, code `providerId`, display `Provider ID` |
| `input[1].valueString` | `SBX_001205` |

Both inputs are `valueString`. There is no `valueIdentifier` and no system attached to the values themselves, so the payer resolves them by convention.

At least one input is mandatory. Sending both narrows the answer to the packages this hospital is empanelled for, which matters: the sampled response is 21 MB with both inputs supplied.

## Task codes across the exchange

`poll` is one of four Task codes NHCX uses, and they do not share a code system. This is worth a table because the temptation to hardcode one system is strong and wrong.

| Exchange | System | Code |
| :---- | :---- | :---- |
| Insurance plan request | `http://terminology.hl7.org/CodeSystem/financialtaskcode` | `poll` |
| Cancel request | `http://terminology.hl7.org/CodeSystem/financialtaskcode` | `cancel` |
| Payment notice | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-codes` | `deliver` |
| Cancel response | `http://hl7.org/fhir/CodeSystem/task-code` | `approve` |

The `financialtaskcode` value set defines `cancel`, `poll`, `release`, `reprocess` and `status`. Only `poll` and `cancel` have samples.

## What the sample shows

`insuranceplan_request.txt` is 1,269 bytes, sent 3 March 2026 at 12:14. The response came back forty-two minutes later.

The file is unrepresentative in one respect. It is a provider-to-payer request, but it carries a `meta.tag` of `SUBSETTED` on both the bundle and the `Task`. `SUBSETTED` means "resource encoded in summary mode" and is something a server puts on a response it has trimmed. Its presence here indicates the sample was captured from the payer's own store after processing rather than from the wire. Do not send `SUBSETTED` on a request.

## Traps

**The Task code system is not the one the older documentation gives.** Earlier NHCX material puts `poll` under `https://nhcx.abdm.gov.in/api`. The sample uses `http://terminology.hl7.org/CodeSystem/financialtaskcode`, which is the real HL7 financial task code system and the one the payer accepted. Use the HL7 system.

**`intent` is `original-order`, not `order`.** Both are valid FHIR `RequestIntent` codes and they mean different things: `order` is a generic order, `original-order` is the initiating one. The sample sends `original-order`. Element tables elsewhere say `order`. This is not known to be enforced, but match the sample.

**`providerId` is not the HFR ID.** The sample sends `SBX_001205`, a sandbox participant code. Every other bundle in the corpus identifies the same hospital as `IN1910000151`, its HFR ID, in `Organization.identifier` and in `facility.identifier`. A fourth form, `1652`, appears in the preauthorisation responses. There is no statement anywhere that `providerId` here means the participant code rather than the HFR ID; the sample is the only evidence. Send whatever your participant record was onboarded with, and expect to try both against a new payer.

**There is no `Bundle.timestamp`.** Every other request bundle in the corpus carries one. This one has only `meta.lastUpdated`, and unlike the eligibility requests that value is a real date rather than the frozen `2025-11-11T15:09:41.516+05:30` template. So the field you read for the send time is not the same field across exchanges. Read `timestamp` when it exists and fall back to `meta.lastUpdated`.

**The bundle identifier is a UUID, not a case number.** Eligibility, preauthorisation and claim bundles put the case number in `Bundle.identifier.value`. This exchange has no case, so the value is a second UUID, unrelated to `Bundle.id`. Nothing correlates the request to the response except the callback; the response's own `Bundle.identifier` is `100155-1000003614`, the payer's plan key, which does not appear in the request at all.

## When to send it

Once per policy the hospital handles, not once per patient. The plan changes on the payer's schedule, not yours.

Refresh it when a `Communication` arrives with reason `policychange`, on whatever periodic schedule you set, and before treatment planning if your cached copy has no version stamp. Chapter 05 covers what to do with the answer and why the cache matters as much as it does.
