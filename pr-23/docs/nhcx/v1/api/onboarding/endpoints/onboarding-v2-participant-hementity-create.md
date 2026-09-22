# Submit the HEM-entity participant create

`POST /v2/participant/hementity/create`

Creates a hospital (HEM-entity) participant from the full empanelment payload (bank, tax, beds, specialities, doctors); returns status and hospitalid.

### Business purpose

Government scheme empanelment needs far more than a name and a certificate: a hospital must be identified by scheme, state and district, carry bank details for settlement, tax identifiers for deduction handling, and descriptive data such as hospital type, bed strength, accreditation, specialities and doctors. This endpoint captures that full hospital-empanelment profile in one registry call so the payer side can settle and audit against it. It exists alongside the thinner v2 create because scheme onboarding (for example PMJAY) involves configuration that regular private-insurance onboarding does not.

### When to use

Use during scheme-specific hospital onboarding when the operator directs you to the HEM-entity form rather than the registry-linked /v2/participant/create. It shares the create description with the other two create endpoints, but the OpenAPI schemas differ materially, so it is not a drop-in alternative. It is a synchronous registry call with no workflow or x-hcx-status codes. The docs do not state whether a passcode confirmation via /validate follows; the response carries no transactionid, so plan the approval step with your onboarding contact.

### Preconditions

- Bearer token with the Bearer prefix in bearer_auth, plus Accept and Content-Type: application/json.
- Required ParticipantCreateBodyV2 fields: participant_name, scheme_code, state, district, entityid, bankdetails, participantcode, hospitaltype, incentiveCode, hospitalbedstrength, lab_yn, roles, specialityList, primaryEmail, primaryMobile, encryption_cert, endpoint_URL.
- BankDetails requires facilitybankaccountname, authorizedsignatoryname, bankaccountnumber, ifsccode, bankname, bankbranchname, bankaddress, micrcode and accounttype; upiid, paymenttype and mailid are optional.
- If taxdetails is supplied, pannumber, tannumber and gstnumber are all required within it.
- A Base64-encoded self-signed X.509 encryption certificate and a domain-name callback URL.

### Postconditions

HTTP 200 with ParticipantCreateResponseV2 containing status and hospitalid. Unlike the other two create calls, the response does not return a participant code, despite the shared description; the participantcode you supplied in the body is the identifier the record is keyed on. There is no asynchronous callback. Errors follow the registry envelope of 400 Client Error, 404 Resource not found and 500 Downstream systems down, each with ErrorResponse (timestamp, error code, message, trace).

### Common mistakes

- Expecting a participant_code in the response and failing to persist the hospitalid that is actually returned.
- Leaving out nested required fields, especially inside bankdetails, or supplying taxdetails with only some of pannumber, tannumber and gstnumber.
- Mixing field naming: this schema uses snake_case for participant_name, scheme_code and encryption_cert but flattened lowercase for participantcode and hospitalbedstrength; copy names exactly from the schema.
- Sending the PEM certificate without Base64 encoding.
- Registering an endpoint_URL with an IP address or port, which fails the go-live reachability checks.

### Best practices

- Build the payload from the schema field by field and validate nested objects (BankDetails, HospitalDoctorDetails, IncentiveRequest) before sending; a 400 does not point at the offending nested field.
- Collect bank, tax, MICR and IFSC values from the finance team in advance; they are mandatory and settlement depends on them.
- Keep the private key that pairs with encryption_cert in PKCS8 form on the callback host only.
- Never log the full request; it contains bank account and tax identifiers.
- Confirm with the onboarding operator whether a passcode approval step applies, since the response has no transactionid to pair with /validate.

### Related scenario

A district hospital being empanelled under a state scheme is asked to register as an HEM entity. The hospital's IT partner obtains a Bearer token and assembles the full payload: scheme_code, state and district, bed strength, hospital type, speciality list, doctor roster, bank details for settlement and PAN, TAN and GST numbers, plus the Base64 certificate and callback URL. They call /v2/participant/hementity/create and receive status and hospitalid. The record is then available to the scheme payer via /participant/search, and the hospital moves on to fetching the payer's certificate with /fetch/certs before sending its first pre-authorisation.

### Specification

Chapter [Your certificate](/docs/nhcx/v1/getting-started/your-certificate) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/hementity/create \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participant_name": "District Hospital Demo",
  "participantcode": "XXXXX7583@hcx",
  "scheme_code": "PMJAY",
  "state": "Karnataka",
  "district": "Mysuru",
  "entityid": "IN2910001234",
  "hospitaltype": "Public",
  "incentiveCode": "NABH",
  "hospitalbedstrength": "200",
  "lab_yn": "Y",
  "roles": [
    "provider"
  ],
  "specialityList": [
    "General Medicine",
    "General Surgery"
  ],
  "primaryEmail": "claims@districthospital.example.in",
  "primaryMobile": "9800000000",
  "encryption_cert": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...",
  "endpoint_url": "https://nhcx.districthospital.example.in",
  "bankdetails": {
    "facilitybankaccountname": "District Hospital Demo",
    "authorizedsignatoryname": "Medical Superintendent",
    "bankaccountnumber": "000000000000",
    "ifsccode": "SBIN0000000",
    "bankname": "State Bank of India",
    "bankbranchname": "Mysuru Main",
    "bankaddress": "Mysuru, Karnataka",
    "micrcode": "570002000",
    "accounttype": "Current"
  },
  "taxdetails": {
    "pannumber": "AAAAA0000A",
    "tannumber": "BLRA00000A",
    "gstnumber": "29AAAAA0000A1Z5"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.

## Body

- `participant_name` (string)
- `participantcode` (string)
- `scheme_code` (string)
- `state` (string)
- `district` (string)
- `entityid` (string)
- `hospitaltype` (string)
- `incentiveCode` (string)
- `hospitalbedstrength` (string)
- `lab_yn` (string)
- `roles` (string[])
- `specialityList` (string[])
- `primaryEmail` (string)
- `primaryMobile` (string)
- `encryption_cert` (string)
- `endpoint_url` (string)
- `bankdetails` (object)
- `bankdetails.facilitybankaccountname` (string)
- `bankdetails.authorizedsignatoryname` (string)
- `bankdetails.bankaccountnumber` (string)
- `bankdetails.ifsccode` (string)
- `bankdetails.bankname` (string)
- `bankdetails.bankbranchname` (string)
- `bankdetails.bankaddress` (string)
- `bankdetails.micrcode` (string)
- `bankdetails.accounttype` (string)
- `taxdetails` (object)
- `taxdetails.pannumber` (string)
- `taxdetails.tannumber` (string)
- `taxdetails.gstnumber` (string)

## Responses

- `200`: HTTP 200 with ParticipantCreateResponseV2 containing status and hospitalid.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "status": "Created",
  "hospitalid": "H00012345"
}
```
