# Submit the participant search

`POST /participant/search`

Reads a participant's full registry record by participant_code, including roles, status, encryption_cert and endpoint_URL.

### Business purpose

Before addressing a transaction to a counterparty, an integrator needs to know that the participant exists, is active, holds the expected role and publishes an encryption certificate and callback endpoint. The registry is the phone book of NHCX, and this call is the direct lookup by code. Providers use it to inspect a payer they have selected; payers use it to confirm the sender of an inbound request; everyone uses it to verify their own record after an update.

### When to use

Use it to check a participant's record once you know its code. Call it before you send the first message to a new recipient, or to confirm your own record after an update.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You have the target's `participant_code`, the same value you will put in `x-hcx-recipient_code`.

### Postconditions

You get the participant's full registry record. Nothing changes, and an unknown code returns `404`.

### Common mistakes

- Sending the code under a field name other than `participant_code`.
- Assuming a record means the participant can transact: its status must be active.
- Reading `encryption_cert` as the certificate itself. Use `/fetch/certs` for that.
- Leaving out the `Accept` header.

### Best practices

- Cache the record for the session and re-read it when a transport error (NHCX-1001) or decrypt failure (PAYR-1001/PAYR-1002) suggests stale routing or key data.
- Check roles and status before selecting the counterparty for x-hcx-recipient_code.
- Call it against your own code after every registry update to confirm the change is live.
- Never log payment_details from the response.
- Treat the participants array as possibly empty and handle 404 gracefully.

### Related scenario

A hospital's TPA desk has selected a payer code from /fetch/participants/list for a PMJAY patient. Before submitting anything the integration calls /participant/search with that participant_code and receives the payer's record: roles include payer, status is Active, scheme_code matches, and endpoint_URL and encryption_cert are populated. The engine stores the code as the payerId that will become x-hcx-recipient_code, calls /fetch/certs to obtain the actual certificate, and then encrypts and sends /v1/coverageeligibility/check.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/search \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "participant_code": "<payer participant code>"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `participant_code` (string)

## Responses

- `200`: HTTP 200 with ParticipantSearchResponse: timestamp (Unix timestamp when the request is sent) and participants, an array of full participant records with participant_code, linked_registry_codes, participant_name, scheme_code, roles, address, primaryEmail, additionalEmail, phone, primaryMobile, additionalMobile, status, signing_cert_path, encryption_cert, endpoint_url and payment_details.
  - `timestamp` (integer)
  - `participants` (object[])
  - `participants.participant_code` (string)
  - `participants.participant_name` (string)
  - `participants.linked_registry_codes` (string[])
  - `participants.scheme_code` (string)
  - `participants.roles` (string[])
  - `participants.status` (string[])
  - `participants.primaryEmail` (string)
  - `participants.primaryMobile` (string)
  - `participants.encryption_cert` (string)
  - `participants.endpoint_url` (string)

Example 200 response. The values are placeholders:

```json
{
  "timestamp": 1716204567358,
  "participants": [
    {
      "participant_code": "<payer participant code>",
      "participant_name": "Demo Insurance Company",
      "linked_registry_codes": [
        "125@payer"
      ],
      "scheme_code": "default",
      "roles": [
        "payer"
      ],
      "status": [
        "Active"
      ],
      "primaryEmail": "claims@demoinsurer.example.in",
      "primaryMobile": "9800000001",
      "encryption_cert": "https://registry.example.in/certs/1518.pem",
      "endpoint_url": "https://nhcx.demoinsurer.example.in"
    }
  ]
}
```
