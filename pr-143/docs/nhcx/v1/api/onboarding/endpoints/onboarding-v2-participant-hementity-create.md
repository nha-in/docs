# Submit the HEM-entity participant create

`POST /v2/participant/hementity/create`

Creates a hospital (HEM-entity) participant from the full empanelment payload (bank, tax, beds, specialities, doctors); returns status and hospitalid.

### Business purpose

Government scheme empanelment needs far more than a name and a certificate: a hospital must be identified by scheme, state and district, carry bank details for settlement, tax identifiers for deduction handling, and descriptive data such as hospital type, bed strength, accreditation, specialities and doctors. This endpoint captures that full hospital-empanelment profile in one registry call so the payer side can settle and audit against it. It exists alongside the thinner v2 create because scheme onboarding (for example PMJAY) involves configuration that regular private-insurance onboarding does not.

### When to use

Use it for scheme hospital onboarding, such as PMJAY, when the operator asks for this form. It is not a drop-in swap for `/v2/participant/create`.

### Preconditions

- You have a valid access token.
- The body has every required field, including the bank details.
- If you send tax details, include the PAN, TAN and GST numbers together.
- You have a Base64-encoded certificate and a callback URL that uses a domain name.

### Postconditions

The registry returns `status` and `hospitalid`. It does not return a participant code, so keep the `participantcode` you sent.

### Common mistakes

- Expecting a participant code back and not saving `hospitalid`.
- Leaving out required fields inside the bank details.
- Guessing field names. Copy them exactly from the schema.
- Sending the certificate without Base64 encoding.

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
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
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

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

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
  - `status` (string)
  - `hospitalid` (string)

Example 200 response. The values are placeholders:

```json
{
  "status": "Created",
  "hospitalid": "H00012345"
}
```
