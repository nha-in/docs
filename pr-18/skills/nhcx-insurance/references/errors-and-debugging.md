# Errors and debugging

Sources:

- `nhcx-package/nhcx-error.yaml`: every NHCX, PAYR and ERR-PYR code, with the standard and reference payer readings side by side.
- `nhcx-package/docs/06-Reference/01-Error Codes.md`: the same codes as tables.
- `nhcx-package/docs/01-Overview/04-JWE, Status and Errors.md`, "Codes met live".
- `nhcx-package/docs/03-Building a Provider/11-PMJAY Sandbox Run.md`: one full case run, refusal by refusal.
- `nhcx-package/docs/06-Reference/02-Troubleshooting.md`.
- The nhcx-adapter release README, "Troubleshooting".

The live readings are from runs against the PMJAY SHA Himachal Pradesh sandbox payer (`1518@hcx`).

## 1. Where an error comes from

Three places refuse a message, and the family of the code says which (`nhcx-error.yaml`, `spaces`):

| Family | Who refused | How you hear it |
| --- | --- | --- |
| Gateway answers to your own send (`400`, `401`) | the exchange, before the message goes further | the HTTP answer to your POST on `<nhcx base>/v1/...`; a `401` is an expired token or a missing `Bearer` |
| A delivery your key cannot open (own transport) | your receiving end | the JWE will not decrypt: the certificate on your participant record is not the key you hold |
| Adapter codes (`INVALID_ENVELOPE`, `CERT_NOT_FOUND`, `CALLBACK_HTTP_500`), nhcx-adapter only | nhcx-adapter, before or after the wire | the HTTP answer to your `/fhir/out` call, `{"ok": false, "error": {...}}` |
| `NHCX-*` | the exchange; the message never reached the payer | the HTTP answer to your call (`gateway_status` 4xx with `upstream_body`), or a `ProtocolResponse` delivered to your callback later |
| `PAYR-*`, `ERR-PYR-*` | the payer; the message reached it | a `ProtocolResponse` on your callback with `x-hcx-status: response.error` and `x-hcx-error_details {code, message}`, on the request's correlation id |

A `ProtocolResponse` is plain JSON, not a bundle. The exchange delivers it with `type: ProtocolResponse` and the `x-hcx-` fields in the clear; nhcx-adapter passes it on with `X-Nhcx-Payload-Kind: protocol` and `fhir` set to the body. Read `fhir.type == "ProtocolResponse"` and `fhir["x-hcx-error_details"]`. Settle the leg as refused at the door with the payer's words, and keep the thread the payer last answered on.

PAYR numbers are not globally unique. The same number means different things on different sheets (`nhcx-error.yaml` lists them under `collisions`), and the live sandbox reuses several with a meaning the published sheet does not give. Match on the message text and log both.

## 2. PAYR and ERR codes met live

The published text is from `nhcx-package/nhcx-error.yaml`. Where the standard and reference payer sheets collide, both readings are given. The live text and the fix are from the sandbox runs.

| Code | Published text | Live text | What it means | Fix |
| --- | --- | --- | --- | --- |
| PAYR-1008 | Invalid FHIR bundle received (reference payer); Eligible coverage amount is insufficient (standard) | "Invalid content type" or "Invalid input, code and reason code" or "Invalid Base64" | Three faults on one code: a document outside pdf, jpg, jpeg, png and fhir+json; a Task code paired with a reason the scheme does not accept (every `status`, `reprocess`, `release` Task on the sandbox, and a reprocess with the intimation input misspelt); an attachment it will not decode | Check the content type. For a Task, the sandbox takes only one financial task code, `cancel` (`11-PMJAY Sandbox Run.md`, "What the sandbox will not take"). Spell the reprocess input `intimationNumber` |
| PAYR-1018 | Time limit for submission expired (standard); No task reason code received (reference payer) | asks for a `Task.reasonCode` on a status enquiry | The status Task is refused as incomplete; with a reason it is refused with PAYR-1008 | Do not offer a status enquiry on PMJAY; switch it off in the PMJAY payer adapter |
| PAYR-1019 | Requested additional information was not received in time (standard); Invalid sequence received in supporting info element (reference payer) | "Invalid sequence received in supporting info element" | A `supportingInfo` entry with no `sequence` | Number the whole list once it is assembled |
| PAYR-1027 | (item error family) | "Invalid item id found for item in claim component" | `Claim.item` has no element `id` (`Item/1`). Nothing to do with the package code | Put `id` on every item, procedure and supportingInfo |
| PAYR-1083 | (practitioner family) | "No HPR details found for the practitioner ... category code as HPIN" | The Practitioner carries no identifier typed `HPIN` | Add the `HPIN` identifier under `https://hpr.abdm.gov.in` |
| PAYR-1096, PAYR-1503 | (supporting-info value-type family) | the death date is missing | A death claim without the `ONS`/`DTM` entry | Add `ONS`/`DTM` with the death instant and answer the plan's death forms |
| PAYR-1214 | No previous preauthorization approved record found for the resubmission request | same | A 121 after a rejection | Send a fresh 12 |
| PAYR-1238 | Beneficiary is having an active preauthorization request at this hospital with reference number ... | same; the reference ends in the SHA's case id | Scheme rule, not a bundle fault: one live pre-auth per beneficiary per hospital. Perversely the first sign the bundle is right, because validation runs first | Cancel the other case (PC01) or let it be rejected; sweep before a run |
| PAYR-1245 | Rule failure | "Only one conservative procedure can be booked for a case" | The master's `ProcedureType`; an enhancement on a conservative case must add a medical package | Pick a package whose `ProcedureType` is medical |
| PAYR-1254, PAYR-1365 | Response for STG Questionnaire id ... is mandatory for procedure code ... | same | A package's treatment-guideline questionnaire unanswered | Answer every `/stgquestionnaire/` form the plan attaches to the quoted packages |
| PAYR-1256, PAYR-1363 | Response for Authentication Consent Questionnaire is missing | same | The plan's consent questionnaire unanswered where no biometric token was taken; 1256 on the pre-auth, 1363 on the claim | Answer the policy-level consent form on both legs |
| PAYR-1270 | Item LM100 is not applicable for preauthorization request | same | `LM100` on a pre-auth | Only a LAMA or DAMA claim before or during surgery carries it |
| PAYR-1321 | Error occurred while processing the request due to invalid workflow id | same | 151, 19 or 16 on `v1/claim/submit` | Answer a claim query on 161; never resubmit a decided claim, reprocess it |
| PAYR-1322 | No active case found for the given case number | "Active instance found for case number" | A request is already open on that case; the scheme takes one at a time | Wait about 30 seconds after a decision, then send again; up to three tries |
| PAYR-1362 | No procedure with code LM100 received with 'Requested' status | same | A LAMA or DAMA claim before or during surgery that still carries the package | Collapse the claim to one `LM100` line |
| PAYR-1367, PAYR-1368 | No biometric records found ... / units of cycle information received | same | A cyclic package (dialysis) claimed without a biometric record per cycle and cycle information | Do not claim a cyclic package unless the HMIS can produce both |
| PAYR-1401 | policy not allowed for the hospital | same | The plan was asked for under a policy the hospital is not empanelled under | Ask under the beneficiary's own policy code from the policy search |
| PAYR-1406 | Existing request with correlation id ... is in progress | same | A second plan request while one is still being served | Wait 15 to 60 minutes; reuse the master you hold |
| ERR-PYR-CLM-007 | on none of the published sheets; `nhcx-error.yaml` lists it as observed live | "No prior preauthorization or claim record found for case number" | The claim was sent under a number of its own instead of the pre-auth's | Send the claim under the pre-auth's claim number |

Refusals arrive in order: the SHA validates the bundle first and applies the scheme's rules only to a bundle that passed. A refusal in the `PAYR-102x` block is structural, so check ids and sequences before values.

## 3. Gateway protocol errors

From `nhcx-package/nhcx-error.yaml` (the gateway space) and the live notes:

| Code | Message | When you meet it | Fix |
| --- | --- | --- | --- |
| NHCX-1006 | Duplicate request. Request with same correlation id already exist | A request sent again on a correlation id the exchange already holds | Mint a fresh correlation id for every request; only a response echoes one |
| NHCX-1010 | No Data with given Correlation id for call back request | A response sent on a thread the exchange has retired: the request was redelivered five times without a 2xx, or the id was never a request | Acknowledge inbound requests at once; a payer that decides minutes later sends `outcome queued` first |
| NHCX-1012 | No records found with the requested api caller id | The sandbox's own `v1/status` route, whatever id you pass | Ask status as a Task on `v1/task/submit` |
| NHCX-1015 | Invalid response received from receiver (published); the registry answers "You are not authorized to update/modify details" | Updating a participant's endpoint or certificate with a client id that did not create it | Use the creator's credentials or the NHCX participant portal (nhcx-adapter release README, "Troubleshooting") |
| NHCX-1016 | Invalid Api Action / no policies found (the registry, on a policy search) | A policy search that finds nothing | Read it as an empty result |
| NHCX-1018 | Invalid ABHA number received | An ABHA not in `XX-XXXX-XXXX-XXXX` form on the envelope | Format it, or omit the header |

With nhcx-adapter as the transport, its local codes and their HTTP statuses are in `api-knowledge.md` section 5. The ones you will meet first:

- `CERT_NOT_FOUND`: the recipient has no certificate on the registry; nothing to fix locally.
- `SELF_ENCRYPTION_KEY`: the registry handed out your own certificate for another code; run `nhcx-adapter cert <CODE> --refresh`.
- `DECRYPT_FAILED` on `/in`: your registered certificate is not the key you hold; run `nhcx-adapter check`.
- `WRONG_RECIPIENT` on `/in`: a message for a participant this adapter does not hold.
- `CALLBACK_HTTP_<n>` and `CALLBACK_UNREACHABLE`: your HMIS refused or was down; NHCX will redeliver up to five times.
- `TOKEN_HTTP_401`: wrong `clientId` or `clientSecret`, or sandbox credentials against production.

## 4. Reading a ledger thread

The per-case archive is the first place to look, with any transport: every message sent and received, by correlation id, in `<cases dir>/<claim number>/transactions.txt` (step 4). With nhcx-adapter as the transport, its ledger also holds what reached it but not your HMIS; the commands below read it.

Step 1. Find the thread. From the leg row's `correlation_id`, or from the case number in a summary:

```sh
curl -s -H "Authorization: Bearer $KEY" "$ADAPTER/ledger/thread/<CORRELATION_ID>" | python3 -m json.tool
curl -s -H "Authorization: Bearer $KEY" "$ADAPTER/ledger?since=2h&direction=in&limit=100" | python3 -c 'import json,sys; [print(r["id"], r["created_at"][11:19], r["direction"], r["path"], r["workflow_id"], r["hcx_status"], r["status"], r.get("fhir_summary",{}).get("outcome")) for r in json.load(sys.stdin)["items"]]'
nhcx-adapter ledger thread <CORRELATION_ID>            # no server needed
```

Step 2. Read the derived `state`:

| state | Meaning | What to do |
| --- | --- | --- |
| `awaiting_response` | You sent a request and nothing came back | Wait; on the SHA a decision needs the desk. Check `peer.status_code` on the outbound row is 202 |
| `partial` | A `response.partial` arrived (20, 25, or the SHA's 37) | The payer has it. The decision comes on the same thread |
| `completed` | A `response.complete` arrived | The leg should be settled in the HMIS. If it is not, the callback failed or the reader misread it |
| `awaiting_our_response` | A request reached you (a CommunicationRequest, a payment notice) | Your reply is due on this correlation id |
| `error` | A rejection, a failed send or delivery, or a protocol message | Open the message with `error` or `format: protocol` |

Step 3. Read one message in full, bundle included:

```sh
curl -s -H "Authorization: Bearer $KEY" "$ADAPTER/ledger/<LEDGER_ID>" | python3 -m json.tool | less
```

On an inbound row, `peer.status_code` is what your callback answered and `peer.response` is its body. A `delivery_failed` row with a 500 is your handler raising. On an outbound row, `peer.status_code` is the gateway's answer and `peer.response` its body. A `rejected` row carries `GATEWAY_HTTP_<n>` and the NHCX error in `peer.response`.

Step 4. Compare with the HMIS's own archive for the case, `<cases dir>/<claim number>/transactions.txt`. Each line names the workflow id, correlation id, api call id, ledger id and file.

- A message in the ledger and not in the archive is a callback that failed.
- A message in the archive marked `outcome=unmatched` is one the HMIS could not tie to a case: the correlation id is on no leg row, and the bundle names no claim number the HMIS knows.
- A message in neither is a send that never left; look at the HMIS's error on the leg row.

Files, when the server is down: `<ledger.dir>/<yyyy-mm-dd>/<id>.json`, and `index.jsonl` in the same folder for the summaries. `ledger.dir` is `data/ledger` by default.

## 5. Correlation mistakes

Each of these was made once in a real build.

- Answering on the wrong thread. A communication reply or a payment acknowledgement must carry the request's `x-hcx-correlation_id`; every other leg must not carry one. A PMJAY query answer (19, 131, 161) goes on a new correlation id; a same-thread answer is swallowed without a refusal.
- Sending a non-UUID correlation id. nhcx-adapter replaces anything that is not an 8-4-4-4-12 UUID with a fresh one, so the thread is silently lost; store what the transport returned, not what you sent. With your own transport, a request's correlation id is its own `api_call_id` and an answer echoes the request's.
- Matching by path or by header type. Route an inbound message by its correlation id first, then by the claim number inside the bundle. With nhcx-adapter, the `X-Hcxkit-Flow` header is inverted on purpose and must not be a filter.
- Closing a thread on the first reply. The acknowledgement and the decision share one correlation id; a settled-status guard throws the approval away.
- Losing the thread after a refusal at the door. A send refused with a ProtocolResponse went out under a correlation id the payer never took in. The case still lives on the thread the payer last answered; keep it as `thread_correlation_id`.
- Reusing a correlation id after an error. The exchange retires it; the next attempt needs a fresh one.
- Forgetting the workflow id on a reply. Some payers match the payment acknowledgement on the notice's own workflow id; PMJAY wants 17.

## 6. Redelivery and deduplication

NHCX redelivers an unacknowledged message up to five times and then drops the correlation id. The SHA redelivers a large plan answer on its own, two or three times about a minute apart, under the same `x-hcx-api_call_id`. A case archive showed it as three lines on one api call id. With `callback.also` configured, one delivery reaches every target, and a refusal by any one of them makes NHCX redeliver to all.

So:

- Dedupe on `x-hcx-api_call_id` (with nhcx-adapter, `X-Hcxkit-Txn-Id` carries the same value). Either store the last applied `api_call_id` on the leg row and ignore a repeat, or keep an inbound ledger keyed on it and answer `duplicate`. A payer that omits the id is deduped on identical outcome and adjudication.
- Dedupe payment notices and communication requests on their correlation id, with a unique index on each table.
- Answer 2xx before doing slow work. The exchange allows 30 seconds for the 202 receipt (nhcx-adapter gives your HMIS 20 of them, `callback.timeoutSeconds`); anything slower is a failed delivery.
- Un-record a delivery whose application failed for a passing reason (database away), so the redelivery is not waved off as a duplicate.
- With nhcx-adapter, treat `X-Nhcx-Redelivery: true` as a hint, not a rule: the ledger flag is per adapter process and is lost on a ledger reset.

## 7. A send reported as failed can still have landed

Seen live on the sandbox three times in one night. A pre-authorisation went out through nhcx-adapter, the connection dropped after the request had been written, and it answered the hospital `GATEWAY_UNREACHABLE` with HTTP 502. NHCX had taken the message: the SHA acknowledged it four seconds later on the correlation the adapter had minted. A hospital that treats that 502 as "not sent" sends again. The scheme refuses the duplicate (ERR-PYR-PRE-030 "Active instance found for case number", PAYR-1238 for a fresh pre-auth), and a live case stands at the payer that the hospital has no record of.

So:

- nhcx-adapter's failure body names the ids the message went out under: `ledger_id`, `txn_id`, `correlation_id`, `api_call_id`, `request_id` and the `headers` map. Keep them. With your own transport the ids are the ones you minted before sealing: store them before the POST, so a failed POST still has a thread to look for.
- Record the failed leg under that correlation, not as nothing. Carry the ids on the client's error and write them onto the leg row.
- When an answer arrives on a failed leg's correlation, revive it: the leg becomes a sent leg, the record moves from draft to with-the-payer, and the desk is not offered a second send. A protocol error answer revives nothing.
- Anything that creates a record before it sends must name that record in the refusal, or the record is orphaned where nobody can see it. An enhancement handler returns the child it raised alongside the gateway's words.

## 8. Sandbox pace rules

What the SHA Himachal Pradesh sandbox (`1518@hcx`) did across the runs. `nhcx-package/docs/03-Building a Provider/11-PMJAY Sandbox Run.md` records one such run in order.

- One live pre-authorisation per beneficiary per hospital (PAYR-1238). Every HMIS that shares the facility's participant code shares the limit, so sweep before a run: withdraw every approved case without a claim, then wait ten seconds.
- One request at a time per case (PAYR-1322). About 30 seconds between a decision and the next leg; an enhancement refused with "Active instance" is resent up to three times.
- Decisions are taken on the NHCX Payer Service desk, not on the exchange (`nhcx-package/docs/03-Building a Provider/12-PMJAY Adjudication APIs.md`). A case has to be driven through roles: PPD-Trust decides a pre-auth; a claim walks CEX-Trust, CPD-Trust, the Medical Audit Committee, ACO-Trust, SHA-Trust and the Claim Review Committee. The desk answers "Event Meta Log not found" or "Case not found" until the exchange has delivered the request; retry every six seconds, up to 150 seconds. A decision the desk accepts is sometimes never sent; taken again a minute later it is answered in seconds, so decide up to four rounds of 90 seconds.
- An enhancement's query has to be taken a minute after the acknowledgement.
- A claim episode with a query answered and the roles walked takes about ten minutes. Run cases one at a time and allow 20 minutes per case.
- The plan answer arrives in pieces over a minute and is redelivered; expect the same api call id three times.
- The beneficiary registry behind the ABDM session refuses a search now and then while a token refreshes. Retry the search up to four times, 30 seconds apart.
- The sandbox approves a claim query answer at zero with "No query response comments received" when the `CQD` reply is missing, and sometimes even when it is present. Report it; do not assert on the amount.
- The status Task is refused on this sandbox: without a `Task.reasonCode` it answers PAYR-1018, with any reason code PAYR-1008. PMJAY decides on its own desk and answers no status enquiry, so do not offer one for it. Record the refusal on the enquiry row and move on.
- The reprocess Task is taken only under the standard's spelling, `intimationNumber`. Use that spelling on every Task (cancel included); the package's bundles carry it too. The SHA answers workflow 37, "Arbitration claim submission process completed successfully".
- A test payer you run yourself has none of these limits; six use cases ran in under four minutes against one.
