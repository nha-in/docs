# Adjudicator: act on a case

`POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case`

Approves, rejects, queries, forwards or pends a PMJAY case in the State Health Agency's Transaction Management System, as the role that currently holds it.

In the sandbox this call is reached on `https://apisbeta.nha.gov.in`, a different host from the role lookup, which sits on `https://apisbx.abdm.gov.in`. That is the only published address for it. No production host is published for this call, so obtain it at onboarding and keep it configurable rather than deriving it from the sandbox one.

### Business purpose

This is the action half of the NHCX Payer Service. A PMJAY case sits at `request.initiated` until a role acts on it here, so in the sandbox this call is what makes a case move. A scheme payer building its own side can copy the shape: the exchange carries messages, the queue decides cases, and a case ID the payer issues joins the two.

### When to use

Call it after `Adjudicator: get the user role for a case` names the role that holds the case. Each role accepts its own action names, and `usecase` must match the role.

### Roles and actions

| Step | Role | Actions | `usecase` |
| --- | --- | --- | --- |
| Pre-authorisation | `PPD-Trust` | `Approve`, `Reject`, `Query` | `PREAUTH` |
| Claim 1 | `CEX-Trust` | `Forward` | `CLAIM` |
| Claim 2 | `CPD-Trust` | `cpdApprove`, `cpdReject`, `Pending` | `CLAIM` |
| Claim 3 | Medical Audit Committee | `Approve`, `Reject`, `iQuery` | `Medical Audit Committee` |
| Claim 4 | `ACO-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim 5 | `SHA-Trust` | `Approve`, `Reject`, `Pending` | `CLAIM` |
| Claim 6 | Claim Review Committee | `Approve`, `Reject`, `Pending` | `Claim Review Committee` |

### Preconditions

- `casenumber` is the scheme's case ID, not the hospital's claim number.
- `action` is spelled exactly as the current role expects. It is case-sensitive.
- A fresh `correlationid` for every call.
- A valid ABDM session token.

### Postconditions

The scheme's decision reaches you over NHCX as a normal `ClaimResponse` on the original request's correlation ID. If the action is refused, the role has moved, so read it again.

### Common mistakes

- Sending `Approve` to `CPD-Trust`, which takes `cpdApprove`.
- Sending `Query` to the Medical Audit Committee, which takes `iQuery`.
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
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
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

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the payer service.

## Body

- `casenumber` (string, required): The scheme's case ID, the same one sent to the role lookup as `caseid`.
- `action` (string, required): The action, spelled exactly as the current role takes it in the table above. Case-sensitive. One of: Approve, Reject, Query, Forward, Pending, cpdApprove, cpdReject, iQuery.
- `receivercode` (string, required): The payer's registry code without the `@hcx` suffix, such as `1518`.
- `usecase` (string, required): `PREAUTH` for a pre-authorisation, `CLAIM` for the claim roles, and the committee's full name at the two committees. One of: PREAUTH, CLAIM, Medical Audit Committee, Claim Review Committee.
- `correlationid` (string, required): A new UUID for every request.
- `sendercode` (string, required): Your participant code without the `@hcx` suffix.
- `memberid` (string, required): The beneficiary's member ID.
- `remarks` (string, required): Free text the desk records with the action.

## Responses

- `200`: Acting on the case makes the scheme issue its verdict, which reaches the provider over NHCX as an ordinary `ClaimResponse` on the original request's correlation ID.
  - `status` (string)
  - `message` (string)

Example 200 response. The values are placeholders:

```json
{
  "status": "success",
  "message": "Case processed"
}
```
