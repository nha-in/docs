---
title: Authentication
sidebar_label: Authentication
sidebar_position: 1
description: The credentials every ABDM call carries, and the headers that go with them.
verification: unverified
source: the published OpenAPI specifications
---

# Authentication

Generated from the specifications. Every scheme and header below is declared in one of them.

## Gateway session

**gatewaySession**, `http` `bearer`. The `accessToken` returned by `POST /api/hiecm/gateway/v3/sessions` in this file. Send it as `Authorization: Bearer <ACCESS_TOKEN>`.

| Header | Required | What it is |
| --- | --- | --- |
| `REQUEST-ID` | yes | A fresh UUID that you generate for this request. It is how you and NHA correlate a call with its callback and with a support ticket, so log it. Reusing one across requests makes both impossible. |
| `TIMESTAMP` | yes | The current time in ISO 8601, in IST, the +05:30 offset. Working integrations send IST even though NHA's collection fills this with Postman's `$isoTimestamp`, which emits UTC. The gateway rejects a request whose timestamp has drifted too far from its own clock, so take this from a synchronised clock rather than from a local one. |
| `X-CM-ID` | yes | Which consent manager you are talking to. `sbx` on the sandbox and `abdm` in production. Sending the wrong one against the right host is a common first-day failure and reads as an authorisation error. |

## M1 ABHA identity

**gatewaySession**, `http` `bearer`. The `accessToken` from `POST /api/hiecm/gateway/v3/sessions`, which is described in hiecm-gateway.yaml. Send it as `Authorization: Bearer <ACCESS_TOKEN>`.

| Header | Required | What it is |
| --- | --- | --- |
| `REQUEST-ID` | yes | A fresh UUID that you generate for this request. Present on 121 of the 123 requests in NHA's M1 collection. Log it, because it is how a support ticket is traced. |
| `TIMESTAMP` | yes | The current time in ISO 8601, in IST, the +05:30 offset: `2026-08-24T15:45:30.000+05:30`. Working integrations send IST; note that NHA's own collection fills this with Postman's `$isoTimestamp`, which emits UTC, so the sources disagree and IST is what production accepts. Take it from a synchronised clock. A drifted clock fails the whole module and the error does not say so. |
| `X-token` | no | The user scoped token returned when a person logs in or verifies an OTP. Profile calls act on one account, so they need this in addition to the gateway token. Required on the calls that read or change a specific person's account. The value carries a `Bearer ` prefix, exactly like the Authorization header: every one of the 33 X-token values in NHA's collection is `Bearer <token>`, never the bare token. Sending the bare token reads as an invalid token error. |
| `BENEFIT_NAME` | no | The benefit scheme an enrolment belongs to. Observed on the enrolment and benefit calls in NHA's collection, where the literal value is `healthid api` on the enrol and search calls, and `healthid` on the login OTP and verify calls under Find ABHA and on some of the benefit calls. On the enrolment OTP request the header is present but explicitly disabled, so NHA does not send it there. NHA's own collection spells this header four different ways across its requests: `BENEFIT_NAME` (most), `Benefit-Name` (the demo auth and child ABHA calls), `BENEFIT-NAME` (child update, state district search) and `Benefit_Name` (once). Underscore and hyphen are different header names on the wire, so this is a real inconsistency in the source, recorded here rather than smoothed over. The benefit programme calls also show scheme values beyond healthid: `COVIN` on an IRIS enrol and a profile photo update, and a disabled `PAN`. Nothing here has been run from this repository, so confirm the spelling and the exact values with NHA before using them in production. |
| `T-token` | no | The transaction token that carries state between the two halves of a login. Returned by the verify call and sent back on the account selection call. Like X-token, the value carries a `Bearer ` prefix in every one of NHA's recorded requests. |
| `R-token` | no | The refresh token, sent when asking for a new user token without making the person log in again. Like X-token, the value carries a `Bearer ` prefix in NHA's recorded request. |
| `aadhaarNumber` | yes | The person's Aadhaar number, RSA encrypted against NHA's public key and sent as a header rather than in a body. The recorded value is an encrypted blob, never the raw number: encrypt it the same way as an enrolment `loginId`. See the input encryption concept atom for the padding rules. |
| `healthIdNumber` | yes | The 14 digit ABHA number, sent plain in the recorded request, in the dashed `91-XXXX-XXXX-XXXX` form. |
| `KEY_TYPE` | no | Which NHA public key the encryption helper should use. |
| `TRANSACTION_ID` | no | The enrolment transaction this call belongs to, when the transaction is not carried in the body. |

## M2 Linking and sharing

**gatewaySession**, `http` `bearer`. The `accessToken` from `POST /api/hiecm/gateway/v3/sessions`, which is described in hiecm-gateway.yaml. Send it as `Authorization: Bearer <ACCESS_TOKEN>`. M2 also uses per flow tokens, a link token for linking and an authorisation token for patient scoped calls. NHA's error table names both. Their exact header names go here once the swagger is ingested, rather than being guessed now.

| Header | Required | What it is |
| --- | --- | --- |
| `REQUEST-ID` | yes | A fresh UUID that you generate for this request. The callback that answers it carries the same value, so this is how you match an asynchronous reply to the call that caused it. Store it before you send the request, not after. |
| `TIMESTAMP` | yes | The current time in ISO 8601, in IST, the +05:30 offset, from a synchronised clock. Working integrations send IST rather than the UTC that NHA's collection templates emit. |
| `X-CM-ID` | yes | Which consent manager you are talking to. `sbx` on the sandbox and `abdm` in production. NHA's M2 error table has a dedicated code for an invalid value here, which tells you how often it is wrong. |

## M3 Consent and fetching

**gatewaySession**, `http` `bearer`. The `accessToken` from `POST /api/hiecm/gateway/v3/sessions`, which is described in hiecm-gateway.yaml. Send it as `Authorization: Bearer <ACCESS_TOKEN>`.

| Header | Required | What it is |
| --- | --- | --- |
| `REQUEST-ID` | yes | A fresh UUID that you generate for this request. The callback that answers it carries the same value. In M3 a single consent can produce several callbacks, so keep the mapping from request id to consent request id rather than relying on ordering. |
| `TIMESTAMP` | yes | The current time in ISO 8601, in IST, the +05:30 offset, from a synchronised clock. Working integrations send IST rather than the UTC that NHA's collection templates emit. |
| `X-CM-ID` | yes | Which consent manager you are talking to. `sbx` on the sandbox and `abdm` in production. |

## M4 HPR and HFR

**gatewaySession**, `http` `bearer`. The `accessToken` from `POST /api/hiecm/gateway/v3/sessions`, which is described in hiecm-gateway.yaml. Send it as `Authorization: Bearer <ACCESS_TOKEN>`.

