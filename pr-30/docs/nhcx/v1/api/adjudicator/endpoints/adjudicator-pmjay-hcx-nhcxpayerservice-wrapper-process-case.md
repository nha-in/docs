# Submit the adjudicator: act on a case

`POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case`

Approves, rejects, queries or forwards a PMJAY case in the State Health Agency's Transaction Management System, as the role that currently holds it.

In the sandbox this call is reached on `https://apisbeta.NHA.gov.in`, a different host from the role lookup, which sits on `https://apisbx.ABDM.gov.in`. That is the only published address for it. No production host is published for this call, so obtain it at onboarding and keep it configurable rather than deriving it from the sandbox one.

### Business purpose

This is the action half of the NHCX Payer Service. A PMJAY case sits at `request.initiated` until a role acts on it here, so in the sandbox this call is what makes a case move. A scheme payer building its own side can copy the shape: the exchange carries messages, the queue decides cases, and a case ID the payer issues joins the two.

### When to use

Call it after `Adjudicator: role for a case` names the role that holds the case. Each role accepts its own action names, and `usecase` must match the role.

### Preconditions

- `casenumber` is the scheme's case ID, not the hospital's claim number.
- `action` is spelled exactly as the current role expects. It is case-sensitive.
- A fresh `correlationid` for every call.
- A valid ABDM session token.

### Postconditions

The scheme's decision reaches you over NHCX as a normal `ClaimResponse` on the original request's correlation ID. If the action is refused, the role has moved, so read it again.

### Common mistakes

- Sending `Approve` to `CPD-Trust`, which takes `cpdApprove`.
- Sending `CLAIM` as `usecase` at a committee, which takes its full name.
- Reusing a correlation ID across calls.
- Raising a second request on a case while the first is still queued.

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
  --url https://apisbeta.nha.gov.in/pmjay/hcx/nhcxpayerservice/wrapper/process/case \
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
