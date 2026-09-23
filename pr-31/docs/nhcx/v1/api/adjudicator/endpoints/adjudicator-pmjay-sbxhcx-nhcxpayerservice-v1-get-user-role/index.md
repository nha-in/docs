# Submit the adjudicator: role for a case

`POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role`

Asks the NHCX Payer Service which role in the State Health Agency's Transaction Management System holds a PMJAY case, and so which actions may be taken on it next.

### Business purpose

A PMJAY case is not decided over NHCX. The exchange carries the submission to the scheme and the verdict back, but the decision is taken in the SHA's own system, by a named role, on that system's schedule. This call is how an integrator reads that queue. It is also the only way to see where a PMJAY case stands, because a status `Task` sent to the scheme over NHCX is refused, first with `PAYR-1018` and then with `PAYR-1008`.

### When to use

Call it before every `Adjudicator: act on a case`, and whenever a PMJAY case has gone quiet. The case moves on its own, so read the role each time.

### Preconditions

- `caseid` is the scheme's case ID, not the hospital's claim number.
- `payerid` is the scheme payer's code.
- A valid ABDM session token.

### Postconditions

Returns the role that holds the case in `currentuserrole`. A decided case has no role.

### Common mistakes

- Sending the hospital's claim number as `caseid`.
- Acting on the case without reading the role first.
- Taking a pre-authorisation role on a claim as an error. The case is still in the pre-authorisation queue.

### Best practices

- Store the scheme's case ID beside your own claim number the moment it appears.
- Read the role before every action, and again after it.
- Expect this lookup and the action call to sit on different hosts. That is how the service is deployed, not a documentation error.

### Related scenario

A hospital has raised a pre-authorisation that sits at `request.initiated`. It takes the case ID from the payer's acknowledgement and posts it here with the payer code. The answer is `PPD-Trust`, so it approves the case as that role with `Adjudicator: act on a case`. After the claim is raised it reads the role again at every step, through `CEX-Trust`, `CPD-Trust`, `ACO-Trust` and `SHA-Trust`, until the lookup answers with no role and the verdict arrives on the claim's own callback.

### Specification

Chapter [PMJAY adjudication APIs](/docs/nhcx/v1/roles/provider/pmjay-adjudication-apis) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "caseid": "<case number>",
  "payerid": "<payer code>"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `caseid` (string)
- `payerid` (string)

## Responses

- `200`: The service answers with the role that holds the case in `currentuserrole`, and `errormessage` empty.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "currentuserrole": "PPD-Trust",
  "errormessage": null
}
```
