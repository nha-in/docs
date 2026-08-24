---
title: Get started on the sandbox
sidebar_label: Get started
sidebar_position: 2
description: Register for ABDM sandbox credentials, exchange them for an access token, and make your first gateway call.
verification: unverified
source: ABDM__M1_ABHA_Collection.postman_collection.md, ABDM__Proposed_Simplified_Milestone_1.md
---

# Get started on the sandbox

There are four steps between you and your first [ABDM](/docs/overview/glossary#abdm) call:
register on the sandbox, wait for a client id and client secret, exchange them for an access
token, then call an endpoint with that token. The waiting step is the long one, so this page
also says what to do while you wait.

:::note[Documented, not verified]
This page follows NHA's published Milestone 1 document and the M1 Postman collection NHA
publishes with it. Nothing here has been run against the ABDM sandbox from this repository, so
treat request and response shapes as unconfirmed.
:::

## 1. Register on the ABDM sandbox

Create an account at [https://sandbox.abdm.gov.in](https://sandbox.abdm.gov.in). You register
your organisation, pick the roles you want, and submit the form.

The [NHA](/docs/overview/glossary#nha) team reviews the request by hand and issues your
sandbox client id and client secret. This is not instant. Plan for days, not minutes. Nothing
in ABDM unblocks until those credentials arrive, so raise the request on day one.

## 2. Use the wait

Every call needs a token, and every token needs those credentials. Spend the wait on the parts
that need neither.

- Decide which role your system takes. [What you can do](/docs/overview/what-you-can-do) maps a
  kind of system to the milestones it needs.
- Read the [M1 API sequence](/docs/api/hie-cm/m1/api-sequence) so you know the order of calls
  before you have a token.
- Open the [gateway session reference](/reference/hiecm-gateway), which covers the call in
  step 3.

The M1, M2 and M3 interactive references are published, but their operation lists are empty
today. NHA published most of the request and response samples in those documents as
screenshots, so this portal has not transcribed them yet.

## 3. Exchange the credentials for an access token

Every call to the gateway carries a bearer token. You get one from the session endpoint. The
call below is transcribed from NHA's M1 Postman collection.

```bash
curl --location 'https://apissbx.abdm.gov.in/api/hiecm/gateway/v3/sessions' \
  --header 'REQUEST-ID: <A_UUID_YOU_GENERATE>' \
  --header 'TIMESTAMP: <CURRENT_ISO_8601_UTC_TIMESTAMP>' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
    "clientId": "healthid-api",
    "clientSecret": "<CLIENT_SECRET_FROM_NHA_SANDBOX>",
    "grantType": "client_credentials"
  }'
```

Notes on the fields:

| Field | Where it comes from |
| --- | --- |
| `REQUEST-ID` | A UUID your system generates per request. Do not reuse one. |
| `TIMESTAMP` | The current time in ISO 8601, in UTC. |
| `X-CM-ID` | `sbx` on the sandbox. This names the consent manager. |
| `clientId` | The collection sends the literal value `healthid-api` here, not a per-integrator id. If NHA issued you a different client id, send that. |
| `clientSecret` | The client secret NHA issued you in step 1. |
| `grantType` | `client_credentials`. |

The collection reads `accessToken` out of the response body and stores it for the calls that
follow. Send it as `Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>`.

We have not transcribed the full response body from NHA's document. The Milestone 1 document
shows it as a screenshot, so the remaining fields are not confirmed here. See
[M1 APIs](/docs/api/hie-cm/m1/apis) for what the Postman collection does carry.

## 4. Make a first call

With a token in hand, the smallest useful call is the one that starts
[ABHA](/docs/overview/glossary#abha) creation by sending a one-time password
([OTP](/docs/overview/glossary#otp)) to the mobile number linked to the patient's Aadhaar. It
runs against a different base URL from the gateway. NHA's Milestone 1 document gives the ABHA
sandbox base URL as `https://abhasbx.abdm.gov.in/abha/api/v3/`.

The document shows that request as a screenshot, so this portal has not transcribed the curl or
the response body. Go to [M1 APIs](/docs/api/hie-cm/m1/apis) for what the Postman collection
does carry, and to [M1 API sequence](/docs/api/hie-cm/m1/api-sequence) for the order of calls.

## Where to go next

- [What you can do](/docs/overview/what-you-can-do) to pick the milestones your system needs.
- [Choose your gateway](/docs/api) if you are not sure whether you want
  [HIE-CM](/docs/overview/glossary#hie-cm), [UHI](/docs/overview/glossary#uhi) or
  [NHCX](/docs/overview/glossary#nhcx).
- [Support](/docs/support) when the sandbox does something this portal does not explain.
