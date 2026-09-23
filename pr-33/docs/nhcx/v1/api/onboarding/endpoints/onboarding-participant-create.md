# Submit the participant create (v1)

`POST /participant/create`

Creates a participant record in the NHCX registry from a full v1 profile and returns the generated participant_code.

### Business purpose

Nothing moves through NHCX until both the sender and the recipient exist in the participant registry, which the platform treats as the source of truth for who may exchange claims data. This call is the original, full-profile way to register a hospital, insurer or TPA: it captures the organisation's name, roles, contact points, linked registry identifiers, callback endpoint and public encryption certificate in one record. The registry then issues the participant_code that every later transaction is addressed with.

### When to use

Call it once, when you first register, before any other NHCX call. The sandbox uses this path. To change a certificate or callback URL later, use an update call.

### Preconditions

- Your registration was approved and you hold a client ID and secret.
- You have a valid access token.
- You have made your key pair and certificate, and Base64-encoded the certificate.
- You have the right registry ID: HFR ID for providers, IRDAI ID for payers and TPAs.

### Postconditions

The registry returns your `participant_code`. You cannot send transactions with it until NHCX activates the record.

### Common mistakes

- Sending the wrong registry ID, or an IRDAI ID with leading zeros.
- Using v2 field names such as `endpointurl` in this v1 body.
- Registering a callback URL with an IP address or a port.
- Sending the raw PEM certificate instead of the Base64 form.

### Best practices

- Keep the private key generated alongside the certificate in PKCS8 form locally; only the certificate (public half) is registered.
- Store the returned participant_code as configuration; it becomes x-hcx-sender_code on every outbound message and the value payers use in /fetch/certs.
- Do not re-run create to fix a field; the registry is updated with /participant/update, and an entity can legitimately hold several participant codes only when each is linked to a separate HFR ID.
- Log the request minus the certificate body and never log the bearer token or client_secret.
- Treat host and prefix as one environment variable; sandbox codes and credentials do not carry into production.

### Related scenario

A 200-bed hospital has been approved for the NHCX sandbox and received its client credentials. The integration team first calls POST /get/session to obtain a Bearer token, then generates an RSA key pair and self-signed certificate. They call /participant/create with the hospital's HFR ID as registryid, role PROVIDER, the Base64 certificate and their callback base URL. The registry returns participant_code 100001@sbx. With that code in hand the team calls /fetch/participants/list to find the dummy payer 1000003538@hcx and /fetch/certs to obtain its certificate, and only then sends the first /v1/coverageeligibility/check.

### Specification

Chapter [Your certificate](/docs/nhcx/v1/getting-started/your-certificate) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'source: internal' \
  --header 'Content-Type: application/json' \
  --data '{
  "linked_registry_codes": [
    "10001"
  ],
  "registryid": "<client id>",
  "participant_name": "Test Hospital",
  "scheme_code": "PMJAY",
  "state": "Haryana",
  "district": "Panchkula",
  "roles": [
    "10001"
  ],
  "primaryEmail": "integration@hospital.example",
  "phone": [
    "01123456789"
  ],
  "primaryMobile": "9876543210",
  "signing_cert_path": "",
  "encryption_cert": "<encryption cert>",
  "endpoint_url": "https://nhcx.hospital.example"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.
- `source` (string, required): Sent on this call, as the package's request carries it.

## Body

- `linked_registry_codes` (string[])
- `registryid` (string)
- `participant_name` (string)
- `scheme_code` (string)
- `state` (string)
- `district` (string)
- `roles` (string[])
- `primaryEmail` (string)
- `phone` (string[])
- `primaryMobile` (string)
- `signing_cert_path` (string)
- `encryption_cert` (string)
- `endpoint_url` (string)

## Responses

- `200`: On success the registry returns HTTP 200 with ParticipantCreateResponse containing only participant_code, described as the machine-generated unique identifier of the participant on the HCX instance; sandbox codes look like 100001@sbx and production codes like XXXXX7583@hcx.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "participant_code": "100001@sbx"
}
```
