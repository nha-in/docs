# Fetch participants list

`POST /fetch/participants/list`

Payer discovery: lists participants filtered by role, registration date window and optional entity type; the first step of the cashless workflow.

### Business purpose

A patient is not cashless merely by having insurance. The hospital must first discover which payer to deal with, and that payer's participantcode becomes the payerId used for NHCX routing and the x-hcx-recipient_code header. This endpoint is the discovery workhorse: it returns every participant of a given role registered within a date window, which is how a hospital builds its payer picker and how a payer sees the providers on the exchange. It is item 1 of the provider sandbox-exit checklist.

### When to use

Use it first, to find the payers you can send to. Refresh the list from time to time, not for every patient.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You send a role and a date range, with dates in `dd/MM/yyyy` format.
- The date range covers when the participants you expect were registered.

### Postconditions

You get a list of participants with their codes and names. The shape of the list can vary, so read it defensively.

### Common mistakes

- Sending dates in any format other than `dd/MM/yyyy`.
- Using a date range so narrow that some payers are missing.
- Expecting to filter by name. Filter the list yourself.

### Best practices

- Fetch once with a wide window, cache the list, and filter by name and scheme type locally, as the handbook's internal payers endpoint does.
- Accept all three response shapes defensively.
- Follow selection with /participant/search or /participant/details to confirm status and roles, and /fetch/certs to obtain the certificate before encrypting.
- Remove any hard-coded reference to 1000003538@hcx at go-live; production counterparties are resolved from this call.
- Refresh the cached list on a schedule so newly registered payers appear.

### Related scenario

A hospital's admission desk opens the cashless screen for a patient holding a government scheme card. The integration has already called /fetch/participants/list with role PAYER, a window from 01/04/2021 to today and entitytype Gov, and cached the result. The desk types the scheme name, the client filters the cached list, and the operator selects the state health agency's participantcode. The engine then calls /participant/get/policies to link the patient's policy, /fetch/certs for the payer certificate, and submits /v1/insuranceplan/request followed by /v1/preauth/submit.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "role": "PAYER",
  "fromdate": "01/04/2021",
  "todate": "20/03/2026",
  "entitytype": "Gov"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `role` (string)
- `fromdate` (string)
- `todate` (string)
- `entitytype` (string)

## Responses

- `200`: HTTP 200 with ParticipantListResponse: a participantdetails array of ParticipantDetails with participantcode, participantname, address and state.
  - `participantdetails` (object[])
  - `participantdetails.participantcode` (string)
  - `participantdetails.participantname` (string)
  - `participantdetails.address` (string)
  - `participantdetails.state` (string)

Example 200 response. The values are placeholders:

```json
{
  "participantdetails": [
    {
      "participantcode": "1000003538@hcx",
      "participantname": "NHCX Dummy Payer",
      "address": "New Delhi",
      "state": "Delhi"
    },
    {
      "participantcode": "<payer participant code>",
      "participantname": "Demo Insurance Company",
      "address": "Bengaluru",
      "state": "Karnataka"
    }
  ]
}
```
