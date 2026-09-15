# Adjudicator: act on a case

`POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case`

Approves, rejects, queries or forwards a PMJAY case in the State Health Agency's Transaction Management System, as the role that currently holds it.

### Business purpose

This is the action half of the NHCX Payer Service. A PMJAY case sits at `request.initiated` until a role acts on it here, so in the sandbox this call is what makes a case move. A scheme payer building its own side can copy the shape: the exchange carries messages, the queue decides cases, and a case ID the payer issues joins the two.

### When to use

After `Adjudicator: role for a case` has named the role that holds the case, with the action spelled exactly as that role takes it:

- `PPD-Trust`, pre-authorisation: `Approve`, `Reject`, `Query`, with `usecase` `PREAUTH`.
- `CEX-Trust`, first claim desk: `Forward`, with `usecase` `CLAIM`.
- `CPD-Trust`, second claim desk: `cpdApprove`, `cpdReject`, `Pending`, with `usecase` `CLAIM`.
- Medical Audit Committee: `Approve`, `Reject`, `iQuery`, with `usecase` `Medical Audit Committee`.
- `ACO-Trust` and `SHA-Trust`: `Approve`, `Reject`, `Pending`, with `usecase` `CLAIM`.
- Claim Review Committee: `Approve`, `Reject`, `Pending`, with `usecase` `Claim Review Committee`.

### Preconditions

- `casenumber` is the scheme's case ID, not the hospital's claim number.
- `action` is spelled exactly as the holding role takes it. It is case-sensitive.
- `receivercode` is the payer's registry ID and `sendercode` the provider's participant code, both without the `@hcx` suffix.
- `memberid` names the beneficiary, and `remarks` is free text the desk records.
- `correlationid` is a fresh UUID for every call.
- An ordinary ABDM session token on `bearer_auth`.

### Postconditions

Acting on the case makes the scheme issue its verdict, which reaches the provider over NHCX as an ordinary `ClaimResponse` on the original request's correlation ID. The desk call and that callback are two halves of one step, correlated by the case rather than by this call's own correlation ID. An action refused for the current role means the role has moved, or was never what you assumed.

### Common mistakes

- Sending `Approve` to `CPD-Trust`, which takes `cpdApprove` and `cpdReject`.
- Sending `CLAIM` as the `usecase` at either committee, which takes its full name with spaces.
- Assuming a case walks all six claim roles. On the recorded sandbox run neither committee held the case.
- Reusing a correlation ID across desk calls.
- Raising a second request on a case while the first is still queued, which the sandbox refused with `PAYR-1322`.

### Best practices

- Read the role immediately before every action.
- Retry shortly on `Event Meta Log not found for correlationId`, which means the exchange has not finished delivering the request, and on `Case not found for caseId`, which means the case is mid-filing.
- Hold both threads in a test harness: this call, and the callback it causes.
- Report the scheme's pace rather than asserting it. An enhancement may be answered `queued` again and decided minutes later.

### Related scenario

On the recorded sandbox run the pre-authorisation was approved as `PPD-Trust` with `Approve` and `usecase` `PREAUTH`. After the claim was raised it was forwarded by `CEX-Trust`, approved by `CPD-Trust` as `cpdApprove`, then by `ACO-Trust` and `SHA-Trust`, each time after reading the role again and with a new correlation ID. The role lookup then answered with no role, and the approval arrived on the claim's own callback.

### Specification

Chapter [PMJAY adjudication APIs](/docs/nhcx/v1/roles/provider/pmjay-adjudication-apis) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/pmjay/hcx/nhcxpayerservice/wrapper/process/case \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "casenumber": "<case number>",
  "action": "Approve",
  "receivercode": "<payer code>",
  "usecase": "PREAUTH",
  "correlationid": "<correlation id>",
  "sendercode": "<participant code>",
  "memberid": "<member id>",
  "remarks": "ok"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `casenumber` (string)
- `action` (string)
- `receivercode` (string)
- `usecase` (string)
- `correlationid` (string)
- `sendercode` (string)
- `memberid` (string)
- `remarks` (string)

## Responses

- `200`: Acting on the case makes the scheme issue its verdict, which reaches the provider over NHCX as an ordinary `ClaimResponse` on the original request's correlation ID.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "status": "success",
  "message": "Case processed"
}
```
