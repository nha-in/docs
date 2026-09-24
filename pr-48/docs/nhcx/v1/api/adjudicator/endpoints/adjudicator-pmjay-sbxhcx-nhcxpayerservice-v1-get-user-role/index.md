# Adjudicator: get the user role for a case

`POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role`

Asks the NHCX Payer Service which role in the State Health Agency's Transaction Management System holds a PMJAY case, and so which actions may be taken on it next.

### Business purpose

A PMJAY case is not decided over NHCX. The exchange carries the submission to the scheme and the verdict back, but the decision is taken in the SHA's own system, by a named role, on that system's schedule. This call is how an integrator reads that queue. It is also the only way to see where a PMJAY case stands, because a status `Task` sent to the scheme over NHCX is refused, first with `PAYR-1018` and then with `PAYR-1008`.

### When to use

It is mandatory before any claim action. Call it before every `Adjudicator: act on a case`, and whenever a PMJAY case has gone quiet. The case moves on its own, so read the role each time.

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
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "caseid": "<case number>",
  "payerid": "<payer code>"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the payer service.

## Body

- `caseid` (string, required): The scheme's case ID, such as `2026072210000472`. Not the hospital's claim number.
- `payerid` (string, required): The scheme payer's registry code without the `@hcx` suffix, such as `1518`.

## Responses

- `200`: The service answers with the role that holds the case in `currentuserrole`, and `errormessage` empty.
  - `currentuserrole` (string)
  - `errormessage` (object)

Example 200 response. The values are placeholders:

```json
{
  "currentuserrole": "PPD-Trust",
  "errormessage": null
}
```
