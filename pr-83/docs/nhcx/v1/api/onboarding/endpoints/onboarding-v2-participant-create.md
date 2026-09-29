# Submit the participant create (v2)

`POST /v2/participant/create`

Production call. Registry-linked creation: registry type and ID, role codes, endpoint URL and contacts; returns participantid and a transactionid for /validate.

### Business purpose

Production onboarding needs to prove that the organisation registering on NHCX is the same one already known to an external authority (the ABDM Health Facility Registry for hospitals, the IRDAI registry for insurers and TPAs). The v2 create therefore takes a thin, registry-linked payload rather than a full profile, validates the mobile number against the number held in HFR or the NHCX payer details, and sends a one-time passcode to that number. This is step 1 of the four-step production sequence and is what turns a verified facility into an addressable NHCX participant.

### When to use

Use it for production onboarding, after sandbox certification. The production address is `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/create`. Follow it with `GET /validate` within 24 hours, using the returned `transactionid` and the SMS passcode. In the sandbox, use `/participant/create` instead.

### Preconditions

- You have a valid access token.
- `registrytype` and `role` use the codes from the valid enum lists.
- The registry ID is right, with leading zeros removed from an IRDAI ID.
- The mobile number matches the one held in HFR or the NHCX payer details.

### Postconditions

The registry returns `participantid` and a `transactionid`, and sends a passcode by SMS. You are not registered until `/validate` succeeds.

### Common mistakes

- Mixing up role codes and registry type codes, which share numbers.
- Using a mobile number that does not match the one on record.
- Losing the `transactionid`, or letting 24 hours pass before `/validate`.
- Sending the v1 body, or expecting `participant_code` back.

### Best practices

- Persist transactionid immediately, together with the timestamp, so the /validate step can be completed by whoever holds the registered phone.
- Verify the mobile number and registry ID against HFR or IRDAI records before calling; the check is strict and every failed attempt is a manual round trip.
- Treat the error object in a 200 response as meaningful and surface it to the operator rather than assuming success from the HTTP status alone.
- Do not retry blindly: each call generates a new transaction ID and passcode and invalidates the plan to confirm the previous one.
- Keep sandbox and production credentials, hosts and participant codes strictly separate.

### Related scenario

An insurer's TPA has cleared sandbox certification and received production credentials. Its integrator obtains a Bearer token, then calls /v2/participant/create with registrytype 10004, the IRDAI-issued registry ID (leading zeros stripped), role ["10003"], the production callback base URL and the mobile number the NHA has on file. The response returns participantid, the facility details and transactionid 1vouv8tlz2tnl-1fpspjhwj07c6, and an SMS passcode reaches the compliance officer's phone. Within the hour the team calls GET /validate with both values to confirm creation, then proceeds to /v2/participant/update to publish its encryption certificate.

### Specification

Chapter [Your certificate](/docs/nhcx/v1/getting-started/your-certificate) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/create \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "registrytype": "10001",
  "registryid": "XXXXX74586",
  "role": [
    "10001"
  ],
  "endpointurl": "https://nhcx.demohospital.example.in",
  "mobilenumber": "XXXX748348",
  "email": "sample@gmail.com"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `registrytype` (string)
- `registryid` (string)
- `role` (string[])
- `endpointurl` (string)
- `mobilenumber` (string)
- `email` (string)

## Responses

- `200`: HTTP 200 with ParticipantCreateV2Resp: participantid, facilityname, facilitycontact and facilityemail echoed from the linked registry, a transactionid such as 1vouv8tlz2tnl-1fpspjhwj07c6, and an error object (code, message, trace).
  - `participantid` (string)
  - `facilityname` (string)
  - `facilitycontact` (string)
  - `facilityemail` (string)
  - `transactionid` (string)
  - `error` (object)
  - `error.code` (string)
  - `error.message` (string)
  - `error.trace` (string)

Example 200 response. The values are placeholders:

```json
{
  "participantid": "XXXXX7583@hcx",
  "facilityname": "Demo Multispeciality Hospital",
  "facilitycontact": "XXXX748348",
  "facilityemail": "sample@gmail.com",
  "transactionid": "1vouv8tlz2tnl-1fpspjhwj07c6",
  "error": {
    "code": "",
    "message": "",
    "trace": ""
  }
}
```
