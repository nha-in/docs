---
title: Creating and updating a participant record
sidebar_label: Participant record
description: Creating your identity on the exchange in sandbox and in production, and updating the certificate or callback address.
verification: unverified
source: Onboarding providers and payers in Sandbox and in Production (NHA); AWS Sandbox NHCX-OnBoarding APIs Postman collection; PMJAY Hospital Migration to HMIS via NHCX §3; NHCX Guide for Providers p6
sidebar_position: 4
---

# Creating and updating a participant record
A participant record is your identity on the exchange. It holds your participant code, your role, your certificate and your callback address. You create it once, then update it whenever the certificate or the address changes.

The sandbox and production differ here. The sandbox is a single call each way. Production adds a one-time passcode to the registered mobile number at every step, so nobody can register a hospital they do not control. Both are shown.

## In short

- The participant record holds your participant code, role, certificate and callback address.
- Sandbox is one call each way. Production adds a one-time passcode to the registered mobile at every step.
- The mobile number must match the HFR record exactly, or for a payer the one NHA holds.
- A certificate-only replacement in production skips the passcode, through a dedicated call.

## Sandbox: create

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'source: internal' \
  --data-raw '{
    "linked_registry_codes": ["10001"],
    "registryid": "<your ABDM client id>",
    "participant_name": "Test Hospital",
    "scheme_code": "PMJAY",
    "state": "Haryana",
    "district": "Panchkula",
    "roles": ["10001"],
    "primaryEmail": "integration@hospital.example",
    "phone": ["01123456789"],
    "primaryMobile": "9876543210",
    "signing_cert_path": "",
    "encryption_cert": "<contents of certificate.b64>",
    "endpoint_url": "https://nhcx.hospital.example"
  }'
```

Field by field:

| Field | What to put |
| :---- | :---- |
| `linked_registry_codes` | Which registry vouches for you. `10001` HFR, `10002` NIN, `10003` ROHINI, `10004` payer registry. |
| `registryid` | On the sandbox, your ABDM client ID. In production, the HFR ID for a hospital or the IRDAI ID for a payer. |
| `roles` | `10001` provider, `10002` payer, `10003` TPA. The full list is in the Overview. |
| `encryption_cert` | The base64 certificate from the previous chapter. |
| `signing_cert_path` | Optional. Leave empty. |

The response carries your new address:

```json
{ "participant_code": "1000004446@hcx" }
```

Keep it. It is `x-hcx-sender_code` on everything you send from now on. A hospital group creates one participant per facility, each with its own HFR ID, using the same credentials.

## Sandbox: update

The same shape, keyed on the participant code, used to change the certificate or the callback address:

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/update' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <access token>' \
  --data-raw '{
    "participant_code": "1000004446@hcx",
    "participant_name": "Test Hospital",
    "scheme_code": "PMJAY",
    "roles": ["10001"],
    "primaryEmail": "integration@hospital.example",
    "phone": ["01123456789"],
    "primaryMobile": "9876543210",
    "endpoint_url": "https://nhcx.hospital.example",
    "signing_cert_path": "",
    "encryption_cert": "<contents of certificate.b64>"
  }'
```

`endpoint_url` is the base of your callback server, sometimes called the bridge URL. It can be set at creation as well as on update. The exchange appends the callback path to it: a preauthorisation decision arrives at `<endpoint_url>/v1/preauth/on_submit`. The rules for this address are in Receiving a Callback.

## Production: four steps

Base: `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice`.

**1. Create.** `POST v2/participant/create`

```json
{
  "registrytype": "10001",
  "registryid": "<HFR ID>",
  "role": ["10001"],
  "endpoint_url": "",
  "mobilenumber": "<mobile on the HFR record>",
  "email": "integration@hospital.example"
}
```

The mobile number must match the one on your HFR record exactly, or for a payer the one NHA holds. The response gives `participantid` and a `transactionid`, and a passcode is sent to that mobile. The participant exists, in a pending state.

**2. Confirm.** `GET validate?transactionId=<id>&passcode=<code>`. Note the method: the two confirmation calls are GETs, not POSTs. The participant becomes active.

**3. Configure.** `POST v2/participant/update`

```json
{
  "participantcode": "<participant id>",
  "encryptioncert": "<contents of certificate.b64>",
  "endpointurl": "https://nhcx.hospital.example"
}
```

A second transaction ID and passcode arrive.

**4. Confirm again.** `GET update/validate?transactionId=<id>&passcode=<code>`. The certificate and address go live.

Passcodes and transaction IDs are valid for 24 hours. If one is lost, repeat that step; a new pair is issued.

## Replacing only the certificate

In production there is a shorter path that skips the passcode:

```
POST v2/update/cert
{ "participantId": "<participant id>", "certificate": "<contents of certificate.b64>" }
```

Use it for the yearly rotation.

## Checking it worked

Fetch your own certificate back, using the Fetching a Recipient Certificate chapter's call with your own participant code. If what comes back matches what you registered, the record is live and other participants can seal messages for you.
