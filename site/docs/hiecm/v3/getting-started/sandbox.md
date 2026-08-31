---
title: Sandbox access
sidebar_label: Sandbox access
description: Register for ABDM sandbox credentials, exchange them for an access token, and make your first gateway call.
verification: unverified
source: ABDM__M1_ABHA_Collection.postman_collection.md, ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
sidebar_position: 2
covers: [shared.sandbox.registration-and-credentials, shared.sandbox.callback-url]
---

# Sandbox access

Four steps stand between you and your first [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) call: register
on the sandbox, wait for a client id and client secret, exchange them for an access token, then
call an endpoint with that token. The wait is the step you cannot control, so this page also
says what to do during it.

## 1. Register on the ABDM sandbox

Create an account at [https://sandbox.abdm.gov.in](https://sandbox.abdm.gov.in) and register
your organisation. NHA's M4 document gives the same instruction in one line: to obtain a
`clientId` and a `clientSecret`, register on the sandbox application.

[NHA](/docs/hiecm/v3/getting-started/glossary#nha) reviews the request before it issues them. No
turnaround time is published. Nothing in ABDM unblocks until the credentials arrive, so raise
the request on day one.

## 2. Use the wait

Every call needs a token, and every token needs those credentials. Spend the wait on the parts
that need neither.

- Decide which role your system takes. [What you can build](/docs/hiecm/v3/getting-started/what-you-can-build)
  maps a kind of system to the milestones it needs, and
  [Integration milestones](/docs/hiecm/v3/getting-started/milestones) gives the role to milestone table.
- Read the [M1 API sequence](/reference/hiecm-m1) for the order of calls.
- Open the [gateway session reference](/reference/hiecm-gateway), which covers step 3.

The [M1 reference](/reference/hiecm-m1) carries its operation list. The M2, M3 and M4
references are published with empty operation lists. NHA published most of the request and
response samples in those documents as screenshots, so they have not been transcribed yet.

## 3. Exchange the credentials for an access token

Every call to the gateway carries a bearer token, issued by the session endpoint. The call
below is transcribed from NHA's M1 Postman collection.

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

The Milestone 1 document shows the response body as a screenshot, so the remaining fields are
not transcribed here. See [M1 APIs](/docs/hiecm/v3/api/m1/apis) for what the Postman collection
does carry.

## 4. Make a first call

The smallest useful call starts [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) creation by sending a
one-time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) to the mobile number linked to the
patient's Aadhaar. It runs against a different base URL from the gateway: NHA's Milestone 1
document gives the ABHA sandbox base URL as `https://abhasbx.abdm.gov.in/abha/api/v3/`.

That request is a screenshot in the document, so the curl and the response body have not been
transcribed. See [M1 APIs](/docs/hiecm/v3/api/m1/apis) for what the Postman collection does
carry, and [M1 API sequence](/reference/hiecm-m1) for the order of calls.

## 5. Register a callback URL, before you start M2 or M3

In [M1](/docs/hiecm/v3/api/m1) the answer to a call comes back in the response to that call. In [M2](/docs/hiecm/v3/api/m2) and [M3](/docs/hiecm/v3/api/m3) it does not. The response only acknowledges that ABDM received your request. The answer arrives afterwards as a POST from ABDM to a URL you registered in advance.

You register one base URL. ABDM posts to paths under it, and each callback carries the `REQUEST-ID` you sent on the original call so you can match the answer to the question. The paths are listed on [callbacks](/docs/hiecm/v3/reference/callbacks).

Two things about that URL decide whether your integration works:

- **It has to be reachable from the public internet.** If it is not, the flow appears to hang and nothing tells you why. There is no error, because from ABDM's side the call succeeded and the callback was sent.
- **It has to be listening whether or not you are ready.** ABDM posts when the answer is ready, not when you ask for it. In production this is an endpoint in your own infrastructure that runs continuously. During development it is usually a tunnel to a process on your machine, which means the URL changes every time the tunnel restarts, and you have to register the new one.

## Where to go next

- [What you can build](/docs/hiecm/v3/getting-started/what-you-can-build) to pick your milestones.
- [Introduction](/docs/hiecm/v3) for what [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) covers.
  Booking services runs on [UHI](/docs/uhi/v1), the Unified Health Interface. Insurance claims
  run on [NHCX](/docs/nhcx/v1), the National Health Claims Exchange. The picker at the top of
  the sidebar switches between the three.
- [Support](/docs/support) when the sandbox does something these pages do not explain.
