# Adjudicator: role for a case

`POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role`

Asks the NHCX Payer Service which role in the State Health Agency's Transaction Management System holds a PMJAY case, and so which actions may be taken on it next.

### Business purpose

A PMJAY case is not decided over NHCX. The exchange carries the submission to the scheme and the verdict back, but the decision is taken in the SHA's own system, by a named role, on that system's schedule. This call is how an integrator reads that queue. It is also the only way to see where a PMJAY case stands, because a status `Task` sent to the scheme over NHCX is refused, first with `PAYR-1018` and then with `PAYR-1008`.

### When to use

Before every call to `Adjudicator: act on a case`, because the role that answers is the only one whose action names are legal, and whenever a PMJAY case has gone quiet. The service moves cases on its own schedule, so read the role again rather than assuming the next step.

### Preconditions

- `caseid` is the scheme's case ID, the digits at the end of the case reference the payer issues, not the hospital's claim number. The sandbox hands it out inside the `PAYR-1238` refusal of a later request for the same beneficiary, and in the payer's acknowledgement and status answers once a request is accepted.
- `payerid` is the scheme payer's code.
- An ordinary ABDM session token on `bearer_auth`, with `Content-Type` and `Accept` set to `application/json`.

### Postconditions

The service answers with the role that holds the case in `currentuserrole`, and `errormessage` empty. Once a case is decided, the lookup answers with no role at all. Asked about the hospital's own number, it answers `No Data found with the caseid <id>. Please use the current active case id.`

### Common mistakes

- Sending the hospital's claim number as `caseid`.
- Acting on the case without reading the role first, and being refused because it has moved.
- Reading a pre-authorisation role on a claim as an error. `PPD-Trust` while you are asking about a claim means the case has not yet left the pre-authorisation queue.
- Expecting a status API over NHCX for a PMJAY case.

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
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer/pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role \
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
