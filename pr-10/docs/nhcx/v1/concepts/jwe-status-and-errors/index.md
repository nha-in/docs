# JWE, status and errors

The previous chapter got you onto the network. This one is about what a message is, how to tell where it is in its life, and what to do when it is refused. None of it belongs to any single use case, and all of it applies to every one.

## In short

- A message is a sealed letter inside an addressed envelope. The exchange reads the envelope only.
- A wrong envelope is refused at once; a wrong letter is refused later, on the callback.
- The workflow code says which step a message is; the status word says how far along it is.
- The correlation ID is the thread. Reusing one after an error is how a retry goes nowhere.
- Where the published sources contradict each other, one table here settles what to send.

## Envelope and letter

Picture a sealed letter inside an addressed envelope.

The envelope is what the exchange reads. It carries who sent the message and who it is for, a number for this particular call and a number for the whole conversation it belongs to. It also carries which step of the claim it represents, the time, and a status word saying whether this is a request going out or an answer coming back. The exchange uses these to route and to keep records.

The letter is the FHIR bundle. It is sealed with the receiver's public key before it leaves the sender, so the exchange can carry it but cannot read it. Only the receiver can open it.

A few facts can be written on the outside of the envelope as well, for example the amount claimed. These are called domain headers. They let the exchange keep an audit trail without opening anything.

This split explains a pattern that runs through the rest of the documentation. If the envelope is wrong, the exchange rejects the message and the sender hears immediately. If the letter is wrong, the receiver rejects it and the sender hears later, on the callback. Two kinds of error, from two different places.

## One exchange or several

NHCX is designed so that there can be more than one instance of it, each with its own participants, relaying messages between them when a sender and receiver are on different ones. This is why a participant's address carries the exchange name after the `@`, as in `1518@hcx` or `100001@sbx`. For a hospital talking to a payer on the same exchange, none of this is visible. It matters only in that the address format is fixed and should not be shortened.

## Every field on the envelope

The format is JWE, and every NHCX field on it starts with `x-hcx-`.

| Field | In plain words |
| :---- | :---- |
| `sender_code` | Who is sending. Your participant ID. |
| `recipient_code` | Who it is for. For a provider, the processor code from the policy lookup. |
| `api_call_id` | A fresh number for this one call. |
| `request_id` | A number for this request. |
| `correlation_id` | A number for the whole conversation. The same on the request and on every answer to it. |
| `workflow_id` | Which step of the claim this is. The codes are listed in the Workflow Codes chapter. |
| `timestamp` | When it was sent. |
| `status` | Whether this is a request going out or an answer coming back, and how far along. |
| `ben-abha-id` | The beneficiary's ABHA number, without hyphens. |
| `error_details`, `debug_details`, `debug_flag` | Used only when something has gone wrong. |

Two more fields, `alg` and `enc`, name the encryption used. The specification says `RSA-OAEP` with `A256GCM`; the handbook and the live samples use `RSA-OAEP-256`. Follow the samples.

The serialisation is contested too. The message-security page says to assemble the result in flattened JSON serialisation; the FAQ and the handbook both say compact serialisation, the five-part dot-separated string, and every sample is compact. Build compact.

**Domain headers** are a few facts written on the outside of the envelope for the exchange's records, such as the amount claimed, so it can keep an audit trail without opening the letter. Each use case says which facts it allows.

## The same conversation

Three of the numbers above are unique identifiers in the UUID format. `api_call_id` is new every time. `request_id` is new per request. `correlation_id` is the one to be careful with.

The correlation ID is the thread. The initiator picks it when a conversation starts, the responder copies it back on the answer, and the exchange pairs the two.

The sandbox exit checklists, which are what an integrator is certified against, state the rule differently. On a response, the correlation ID should be the **API call ID** of the request being answered, and it must differ from the response's own API call ID. The protocol pages support the simpler reading above. Confirm which the gateway pairs on before certification; both readings are in the corpus. If a request fails, the exchange retires that correlation ID, and the next attempt needs a fresh one; reusing it is how a retry silently goes nowhere.

The timestamp is contested on two axes. Format: the protocol page defines it as a Unix timestamp, and the sample header in Common Mistakes carries epoch milliseconds, while the handbook and FAQ both use ISO 8601. Zone: the FAQ says UTC with a trailing `Z`, the handbook says Indian time with `+05:30` and that UTC will fail validation. The sample bundles use ISO with `+05:30`. It is a validated field; establish the form with the payer before building.

## Status words

The `status` field says how far along a message is. Only a few values exist, and they pair with the workflow code: the code says which step, the status says where that step stands.

- `request.initiated` is what an initiator sends. It means "I am starting this".
- `response.partial` is what a responder sends to say "received, working on it", or to give an interim answer.
- `response.complete` is a final answer.
- `response.error` means the message was refused.

Three more are the exchange's own: `request.queued`, `request.dispatched` and `request.stopped`. They show up in receipts and status checks, and describe where the exchange has got to in delivering something.

Put together, a preauthorisation's life reads like this.

| Who sends | Workflow code | Status | Meaning |
| :---- | :---- | :---- | :---- |
| Provider | 12 | `request.initiated` | New preauthorisation |
| Payer | 20 | `response.partial` | Received, under review |
| Payer | 24 | `request.initiated` | Query raised. The payer is now the initiator. |
| Provider | 19 | `response.complete` | Query answered |
| Payer | 21 | `response.complete` | Approved |

Using the wrong status is the first item on the portal's list of common mistakes. The full table of which status goes with which code is in the Workflow Codes chapter.

```mermaid
sequenceDiagram
  box rgb(220,239,227) Provider side
    participant P as Provider
  end
  box rgb(220,232,245) Payer side
    participant Y as Payer
  end
  P->>Y: 12, request.initiated: new preauthorisation
  Y-->>P: 20, response.partial: received
  Y->>P: 24, request.initiated: query, payer now initiates
  P-->>Y: 19, response.complete: query answered
  Y-->>P: 21, response.complete: approved
```

## The receipt

When a message reaches the exchange, or reaches your callback, the receiver answers straight away with `202 Accepted` and a short receipt. The receipt repeats the call and correlation numbers, names sender and recipient, says what kind of message it was, and gives a protocol status of `request.queued`, `request.dispatched` or `request.error`. It is not the decision. It says only that the message was taken in.

Your own callback endpoint must send exactly this receipt, within 30 seconds. Anything else, including a slow `200`, is read as a failed delivery.

## When a message is refused

Refusals come from two places, and the envelope-and-letter split above says which.

**The exchange refuses the envelope.** A missing header, an unknown recipient, an expired token, a bad status value. The sender hears at once, in the response to its own call.

**The receiver refuses the letter.** It could not decrypt the bundle, or the bundle failed validation. The receiver sends back a **protocol response** on the callback: the same envelope fields, `status` set to `response.error`, and a short code, message and trace in `error_details`. The exchange logs the header part for audit. Business reasons, such as "this patient is not covered", travel inside a sealed response instead, so the exchange never sees them.

Error codes come in families. `PAYR-` codes are the payer's, and read like plain sentences: not registered with this payer for this policy, policy does not exist, coverage balance insufficient, claim amount exceeds the preauthorisation, duplicate claim. Gateway and bridge codes cover the envelope side. The full sheet, updated 11 August 2026, is on the portal.

**Retries and the error API.** If your callback does not send a proper receipt, the exchange tries five times and then drops the request, retiring its correlation ID. It then reports the failure to the original sender on a separate endpoint, `/v1/error`, which every participant must host. A system without it never learns that its request died.

## Codes met live

The error table reads like a list of code lookups, and several of the codes mean something else in the running sandbox. From the September 2026 run:

| Code | The message | What it turned out to mean |
| :---- | :---- | :---- |
| `PAYR-1027` | Invalid item id found for item in claim component | `Claim.item` has no FHIR element `id` (`Item/1`). Nothing to do with the package code |
| `PAYR-1083` | No HPR details found for the practitioner … category code as HPIN | The `Practitioner` carries no identifier typed `HPIN` |
| `PAYR-1238` | Beneficiary is having an active preauthorization request at this hospital with reference number … | Scheme rule, not a bundle fault: one live preauthorisation per beneficiary per hospital. The reference number ends in the SHA's case id |
| `PAYR-1401` | Policy not allowed for the hospital | The plan was asked for under a policy the hospital is not empanelled under; ask under the beneficiary's own |
| `PAYR-1019` | Invalid sequence received in supporting info element | A `supportingInfo` entry with no `sequence`; number the whole list once it is assembled |
| `PAYR-1083` | No HPR details found for the practitioner | The `Practitioner` carries no identifier typed `HPIN` |
| `PAYR-1256`, `PAYR-1363` | Response for Authentication Consent Questionnaire is missing | The plan's consent questionnaire, unanswered, where no biometric token was taken |
| `PAYR-1008` | Invalid content type … / Invalid input, code and reason code | Two different faults on one code: a document outside pdf, jpg, jpeg, png and fhir+json; or a Task code paired with a reason the scheme does not accept |
| `PAYR-1245` | Only one conservative procedure can be booked for a case | The master's `ProcedureType`; an enhancement on a conservative case must add a medical package |
| `ERR-PYR-CLM-007` | No prior preauthorization or claim record found for case number | The claim was sent under a number of its own instead of the pre-authorisation's |
| `PAYR-1322` | Active instance found for case number | A request is already open on that case; the scheme takes one at a time |

`NHCX-1010`, *no data with given correlation id for call back request*, belongs beside them and is the exchange's own. It is what a payer hears when it answers a submission it left silent. NHCX redelivers an unanswered request, drops it after a few tries and retires the correlation, so a verdict taken minutes later has nowhere to land. The remedy is the one the live PMJAY payer uses: acknowledge the submission at once with a `ClaimResponse` whose `outcome` is `queued`, and send the decision later on the same thread.

Two things follow. A refusal in the `PAYR-102x` block is structural, so check ids and sequences before values. And the refusals arrive in order: the SHA validates the bundle first and applies the scheme's rules only to a bundle that passed, so `PAYR-1238` is, perversely, the first sign the bundle is right.

## The mistakes everyone makes

The portal keeps a list. In plain words:

1. Wrong status word for the leg of the message.
2. No `/v1/error` endpoint, so failures go unnoticed.
3. Answering a callback with something other than `202` and the receipt.
4. Missing or malformed envelope headers.
5. In production, the wrong registry ID: providers send the HFR ID, payers the IRDAI ID without leading zeros.
6. Forgetting the `Accept: application/json` header.
7. Addressing the insurer's code instead of the processor's.
8. Reusing a correlation ID, especially after an error.
9. Retrying on a `401` with the same expired token instead of fetching a new one.
10. Trying to de-link a policy from a participant that did not link it.

## Everything is logged

The exchange records every call it receives: the envelope, the encryption details, sender and recipient, and whether validation passed. It never records the letter. Participants can query the audit trail for their own transactions, and NHA publishes reports from it for payers, providers, regulators and observers.

## What to send when the sources disagree

This chapter and the ones after it flag every place the published documents contradict each other, which is the honest thing to do but leaves you with a decision to make on each one. This table makes those decisions once. Every value here is what the published sample payloads actually carry, and where no sample settles it the row says so rather than inventing a ruling.

Send these. If a payer rejects one, that rejection is better evidence than anything here, and you should follow it.

| Contested point | Send this | Why |
| :---- | :---- | :---- |
| Key wrapping algorithm | `RSA-OAEP-256` | The handbook, the samples and the Postman collection agree. One protocol page says `RSA-OAEP`; it is outnumbered |
| Content encryption | `A256GCM` | Uncontested in the samples |
| Serialisation | Compact, five parts | The message-security page says flattened JSON. The FAQ, the handbook and every sample use compact |
| Timestamp format | ISO 8601 with `+05:30` | The samples use it throughout. Accept a Unix epoch on the way in |
| Correlation ID on a response | Copy the request's `correlation_id` | The protocol pages say so. The exit checklists say use the request's `api_call_id`; that reading makes threading impossible |
| `api_call_id` | A fresh UUID on every message, including responses | So a response and its request never share one |
| Identifier type for an ABHA number | `ABHA` | From the NRCeS identifier-type code system, not the HL7 `JHN` |
| Cancellation Task input name | `initimationNumber` | The misspelling is in the payer's own payload. Send it |
| `entity_type` in a receipt | Derive it from the path | The second-to-last segment, or the last where that is `v1`, with `on_` stripped |

Two points genuinely have no answer, and guessing is worse than knowing you are guessing.

**The workflow code for eligibility, insurance plan, search, predetermination and status.** The workflow sheet lists none. The header is not marked optional anywhere. Agree a value with your payer in writing before the first call, and record what you agreed.

**Domain headers.** This chapter says a few facts may be written on the outside of the envelope and that each use case says which it allows. No use case chapter names one, in this documentation or in the sources behind it. Send none until a payer asks for one.
