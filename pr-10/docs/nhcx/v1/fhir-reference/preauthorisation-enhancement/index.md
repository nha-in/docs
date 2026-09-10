# Preauthorisation enhancement

An enhancement extends an already approved preauthorisation. The patient stays longer, a second procedure is added, or the treatment plan grows. The provider posts it to the same `/v1/preauth/submit` endpoint under workflow 13, quoting the original reference with a new correlation ID. The payer answers on `/v1/preauth/on_submit`. Multiple enhancements may be raised until discharge, each only after the previous request on the case has closed.

## In short

- An enhancement is a preauthorisation bundle with one more item and a larger total.
- Nothing in the payload marks it as an enhancement: `Claim.related` is absent and the case number is unchanged.
- Only the workflow code in the header separates it from the original request.
- Sequencing is enforced by the payer, not by the payload.

## Nothing in the payload says this is an enhancement

The enhancement bundle is a preauthorisation bundle. `Claim.use` is still `preauthorization`. `Claim.identifier[0].value` is still `VB26AA2600001`, the same case number as the original request. `Claim.status` is still `active`. **`Claim.related` is absent**, so there is no `prior` link to the earlier submission and no `relationship` code. `Claim.created` is a new timestamp and nothing else changes.

The only difference between the original request and the enhancement, inside the FHIR payload, is that `Claim.item` has grown from one entry to two, and `Claim.total` has grown to match.

The declaration that this is an enhancement lives entirely at the protocol layer, in the workflow ID and the correlation ID of the JWE envelope. The integration guide states it plainly: an enhancement is "a new preauth request with the old reference but new correlation id". A payload-only reader cannot distinguish an enhancement from a resubmission or from a first request that happened to have two items. Key your state machine on the workflow ID you sent and the correlation ID you stored, never on the bundle.

## The bundle

54 entries. The first six and the last two are the request; the middle is three complete ABDM clinical documents.

| Entry | Resource | `fullUrl` | What it is for |
| :---- | :---- | :---- | :---- |
| 0 | `Claim` | absolute | The request, now with two items |
| 1 | `Patient` | absolute | Beneficiary |
| 2, 3 | `Organization` | absolute | Provider, then payer |
| 4 | `Coverage` | absolute | The policy |
| 5 | `Practitioner` | absolute | The treating doctor |
| 6 to 17 | 12 resources headed by a `Composition` | `urn:uuid:` | ABDM `DiagnosticReportRecord`, "Lipid Profile" |
| 18 to 42 | 25 resources headed by a `Composition`, including three `Condition`, eleven `Observation`, a `Procedure`, a `MedicationRequest` and an `AllergyIntolerance` | `urn:uuid:` | ABDM `DischargeSummaryRecord`, "Discharge Summary for Dengue" |
| 43 to 51 | 9 resources headed by a `Composition` | `urn:uuid:` | ABDM `DiagnosticReportRecord`, "Blood Sugar Fasting" |
| 52, 53 | `Procedure` | absolute | One per `Claim.procedure` entry |

`Bundle.identifier` is still the case number. `Bundle.id` is still the literal string `PreAuth`.

## The second item

The two items are what the payer adjudicates. They differ in more than the amount.

| Path | `item[0]` | `item[1]` |
| :---- | :---- | :---- |
| `sequence` | `1` | `2` |
| `procedureSequence` | `[1]` | `[2]` |
| `category.coding` | code `MP`, "General medicine" | code `MG`, "General Medicine" |
| `productOrService.coding` | code `MG0111A`, "Pleural Effusion" | code `MG004B`, "Dengue hemorrhagic fever" |
| `productOrService.text` | `Testing ABC` | `Testing 123` |
| `modifier.coding` | code `STRAT006b`, "HDU" | code `STRAT006c`, "ICU - Without Ventilator" |
| `servicedPeriod` | `2026-02-22` to `2026-02-27` | `2026-02-22` to `2026-02-25` |
| `quantity`, `factor` | `1`, `0.5` | `1`, `0.5` |
| `unitPrice`, `net` | `3300` | `8500` |

`Claim.total.value` is `11800`, the sum of both nets. **The request total is cumulative.** The already-approved line is resubmitted in full alongside the new one, exactly as the integration guide requires: the bundle must carry "already approved treatments and treatments for approval".

Both category codings sit in `https://payer.pmjay.nha.gov.in`. `MP` and `MG` render as the same specialty with different capitalisation. They are distinct codes in the plan and are not interchangeable. Take each item's category from the package the plan publishes, not from the specialty name.

`Claim.careTeam` and `Claim.diagnosis` do not grow. Both items point at `careTeamSequence` `[1]` and `diagnosisSequence` `[1]`. Only `procedure` grows, to two.

## Supporting information

Six entries, all category `INV`, all with the category taken from the wrong system.

| Seq | Code | Meaning | Value |
| :---- | :---- | :---- | :---- |
| 1 | `MAND0408` | Clinical notes, history, admission notes | `valueAttachment`, `application/pdf` |
| 2 | `MAND0409` | Any investigations done | `valueAttachment`, `image/jpeg`, 261,752 base64 characters |
| 3 | `MAND0570` | Planned line of management | `valueAttachment`, `application/pdf` |
| 4 | `MAND0455` | CXR PA view or CECT chest abdomen and pelvis | `valueReference` to entry 6 |
| 5 | `MAND0409` | Any investigations done | `valueReference` to entry 18 |
| 6 | `MAND0408` | Clinical notes, history, admission notes | `valueReference` to entry 43 |

`MAND0408` and `MAND0409` each appear twice, once as an attachment and once as a reference. Sequences run `1` to `6` without gaps, unlike the claim bundles. As in the first request, there is no admission-date or encounter-date entry.

## The response

`preauth/enhancement/enhancement_resp.txt`, 7,979 bytes, five entries, the same shape as any preauthorisation response. `outcome` is `complete`, `disposition` is `approved`, and the claim-level adjudication reason is `approved`.

Two things about it will break naive code.

**The items come back out of order.** `item[0]` has `itemSequence` `2` and `item[1]` has `itemSequence` `1`. The new line is adjudicated first, the carried-forward line second. Index the response by `itemSequence`, never by array position.

| `itemSequence` | `eligible` | `eligpercent` | `eligquant` | status |
| :---- | :---- | :---- | :---- | :---- |
| 2 | `3600.0` | `100` | `1` | `Approved` |
| 1 | `2700.0` | `100` | `1` | `Approved` |

The new item was requested at 8,500 and allowed at 3,600, yet the response is still `complete` with reason `approved` and no `processNote` explains the cut. A reduced amount does not force `outcome` to `partial`. Reconcile amounts yourself.

**The two totals are computed on different bases.**

| `total[].id` | Category code | Amount | Basis |
| :---- | :---- | :---- | :---- |
| `total` | `benefit` | `3600.0` | The increment, this enhancement only |
| `PMJAY-T` | `eligible` | `6300.0` | Cumulative, 2700 plus 3600 |

Nothing in the handbook, the integration guide or the samples states this rule. It is visible only by arithmetic against the earlier approval. The claim response for the same case reports both cumulatively, so the basis is not even consistent across exchanges. Track the approved amount as a running figure of your own, reconcile `PMJAY-T` against it, and treat `benefit` on an enhancement as a delta.

## Traps

**Supporting-info category uses the code value set.** All six entries set `category.coding.system` to `…/CodeSystem/ndhm-supportinginfo-code` with code `INV`. The category belongs in `…/CodeSystem/ndhm-supportinginfo-category`. Every enhancement and first-request sample does this; only the query answer bundle gets the category system right.

**The attached documents do not match the codes they are filed under.** `MAND0455`, the chest imaging code, references a Lipid Profile. `MAND0409`, "any investigations done", references a discharge summary. `MAND0408`, clinical notes, references a fasting blood sugar report. The attachments are shuffled relative to the original request too: the 261,752-character JPEG filed under `MAND0408` there is filed under `MAND0409` here. This is sandbox data. Do not reproduce it.

**Inline attachments are base64-encoded twice.** All three `valueAttachment.data` values decode to another base64 string before they decode to the PDF or JPEG. The `DocumentReference` attachments in the same bundle are encoded once. The first request has the same defect. Encode once, and check the decoded bytes for a file signature on anything you receive.

**There is no `preAuthRef` anywhere.** The response to the first approval does not issue one and the enhancement does not quote one. Nothing in either payload links this submission to the approval it extends. That is the same absence chapter 07 records on the response side, and it is why the case number and your own stored correlation IDs are the only reliable thread through a case.

**Sequencing is enforced by the payer, not by you.** An enhancement is refused with a payer error in three cases: no approved record, a request still in progress, or the claim already raised. Surface those errors as they arrive rather than pre-guessing them.

**The bundle timestamps in the archive are not chronological.** This enhancement is stamped `2026-02-26T16:13:49+05:30`, twenty-four minutes after the first request, but the approval it supposedly follows is stamped `21:39`. The sandbox capture is not a replay of a single ordered run. Do not infer the exchange order from `Bundle.timestamp`.
