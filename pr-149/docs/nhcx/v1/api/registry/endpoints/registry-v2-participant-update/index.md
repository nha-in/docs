# Submit the participant certificate and bridge update (v2)

`POST /v2/participant/update`

Production call. Stages a change to a participant encryption certificate and/or endpoint URL; returns a transactionid for passcode confirmation via /update/validate.

### Business purpose

Exactly two operational values rotate over a participant's life: the public encryption certificate that counterparties encrypt claims data with, and the endpoint (bridge) URL that the gateway delivers callbacks to. Both are security-sensitive, so the v2 update takes only those fields and gates the change behind an SMS passcode to the registered mobile number. It is step 3 of the production onboarding sequence, where a newly confirmed participant publishes its certificate for the first time, and the documented route for annual key rotation thereafter.

### When to use

Use it in production, right after your participant is confirmed, to upload your certificate and callback URL. Use it again whenever either changes, then confirm with `/update/validate` within 24 hours. The production address is `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/update`. In the sandbox, use `/participant/update`.

### Preconditions

- Your participant code exists and creation has been confirmed.
- The certificate is Base64-encoded.
- You have a valid access token in the `bearer_auth` header.
- The new private key is already on your callback server.

### Postconditions

- You get a transaction ID, and a passcode goes to your registered mobile number.
- Nothing changes until `/update/validate` succeeds with that passcode.

### Common mistakes

- Treating the `200` as done and skipping `/update/validate`.
- Sending the raw certificate instead of the Base64-encoded one.
- Using the v1 field names in this body.
- Starting a new update while a passcode is pending, which cancels the earlier one.

### Best practices

- Prepare the new key pair, deploy the PKCS8 private key to the callback host and only then publish the certificate.
- Keep the previous private key available for at least 24 hours after validation to decrypt callbacks encrypted against a cached certificate.
- Persist transactionid with its 24-hour expiry and complete /update/validate promptly.
- Rotate encryption keys once a year, matching the 365-day validity of the self-signed certificate.
- Verify the new endpointurl is a domain name on an India-based server with the NHCX NAT IPs whitelisted before submitting.

### Related scenario

A TPA has just confirmed its production participant with /validate. Its engineers generate a 2048-bit RSA key, a 365-day self-signed X.509 certificate, Base64-encode it and deploy the private key to the callback host. They call /v2/participant/update with participantcode, encryptioncert and endpointurl; the response returns status and a transactionid, and the registered phone receives a passcode. After GET /update/validate succeeds, the first provider to call /fetch/certs for the TPA receives the new certificate and can encrypt a pre-authorisation for it.

### Specification

Chapter [Your certificate](/docs/nhcx/v1/getting-started/your-certificate) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/update \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "participantcode": "XXXXX7583@hcx",
  "encryptioncert": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...",
  "endpointurl": "https://nhcx.demotpa.example.in"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `participantcode` (string)
- `encryptioncert` (string)
- `endpointurl` (string)

## Responses

- `200`: HTTP 200 with ParticipantCertUpdateResp: participant_code, status and transactionid.
  - `participant_code` (string)
  - `status` (string)
  - `transactionid` (string)

Example 200 response. The values are placeholders:

```json
{
  "participant_code": "XXXXX7583@hcx",
  "status": "Update initiated",
  "transactionid": "1vouv8tlz2tnl-1fpspjhwj07c6"
}
```
