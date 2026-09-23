# Submit the participant details (v2 search)

`POST /participant/details`

V2 variant of participant search: takes participant_code and returns the matching full registry records.

### Business purpose

This is the second of two endpoints that read a single participant by code. It exists as the v2 generation of the registry lookup (operationId participantV2SearchPost) and serves the same business need as /participant/search: confirming that a counterparty exists, is active, holds the expected role and publishes an encryption certificate and callback endpoint before any encrypted transaction is addressed to it.

### When to use

Use it wherever you would use `/participant/search`. It takes the same request and returns the same response.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You have the target's `participant_code`.

### Postconditions

You get the participant's full registry record. Nothing changes.

### Common mistakes

- Expecting a richer answer than `/participant/search` gives.
- Sending the code under a field name other than `participant_code`.
- Reading `encryption_cert` as the certificate itself instead of calling `/fetch/certs`.
- Leaving out the `Accept` header.

### Best practices

- Wrap both lookup endpoints behind one client function so the path can be switched by configuration.
- Check status and roles before choosing a recipient code.
- Cache the record and refresh on routing or decryption errors rather than on every transaction.
- Do not log payment_details.

### Related scenario

A payer's inbound gateway receives a /v1/claim/submit whose protected header names x-hcx-sender_code 100001@sbx. Before decrypting and processing, its integration calls /participant/details with that participant_code to confirm the sender is a registered provider with status Active and to record participant_name for the adjudication file. The claim is then decrypted with the payer's private key and passed to the claims team, whose decision goes back on /v1/claim/on_submit.

### Specification

Chapter [Creating and updating a participant](/docs/nhcx/v1/getting-started/creating-and-updating-a-participant) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/details \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participant_code": "100001@sbx"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `participant_code` (string)

## Responses

- `200`: HTTP 200 with ParticipantSearchResponse: timestamp and a participants array of full participant records (participant_code, linked_registry_codes, participant_name, scheme_code, roles, address, contact fields, status, signing_cert_path, encryption_cert, endpoint_url, payment_details).

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": 1716204567358,
  "participants": [
    {
      "participant_code": "100001@sbx",
      "participant_name": "Demo Multispeciality Hospital",
      "linked_registry_codes": [
        "IN2910001234@hfr"
      ],
      "roles": [
        "provider"
      ],
      "status": [
        "Active"
      ],
      "primaryEmail": "claims@demohospital.example.in",
      "primaryMobile": "9800000000",
      "encryption_cert": "https://registry.example.in/certs/100001.pem",
      "endpoint_url": "https://nhcx.demohospital.example.in"
    }
  ]
}
```
