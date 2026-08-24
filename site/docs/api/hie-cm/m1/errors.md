---
title: M1 errors
sidebar_label: Errors
sidebar_position: 8
description: The M1 error shapes and codes the sources actually carry, what causes each one, and what to do.
verification: unverified
source: ABDM__M1_ABHA_Collection.postman_collection.md
---

# M1 errors

When a Milestone 1 ([M1](/docs/api/hie-cm/m1)) call of [ABDM](/docs/overview/glossary#abdm) fails, the body tells you what went wrong. There is more than one body shape, and which one you get depends on which layer rejected you. This page lists the shapes, the codes [NHA](/docs/overview/glossary#nha)'s sources actually carry, and what to do about each.

:::note[Documented, not verified]
This page follows NHA's published document for the M1 ABHA Postman collection. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## Read this first

**The full M1 error catalogue is not transcribed.** NHA's M1 document lists "Error Code Reference" as a developer resource, but the document as we received it carries the reference as screenshots that did not convert to text. What follows comes from the saved example responses in NHA's M1 [ABHA](/docs/overview/glossary#abha) Postman collection. That is around twenty real failures out of a catalogue that is certainly larger.

Treat this page as a starting set, not a complete list. If you hit a code that is not here, [support](/docs/support) is the route to getting it added.

## Four error shapes, not one

Do not write a parser that expects a single shape. The collection's saved responses show four.

### Shape 1: the wrapped ABDM error

```json
{
    "error": {
        "code": "ABDM-1204",
        "message": "UIDAI Error code : 300 : Biometric data did not match."
    }
}
```

The code lives at `error.code`. This is the shape you get from the ABHA service's own business logic.

### Shape 2: the flat ABDM error

```json
{
    "code": "ABDM-1094",
    "message": "Access to this feature is restricted. Please contact NHA to enable it.",
    "timestamp": "2024-10-25 15:02:34"
}
```

Same family of codes, no `error` wrapper, plus a `timestamp`. The collection shows `ABDM-1094` in both shapes on different calls, so the wrapper is not tied to the code.

Read `error.code` first and fall back to a top level `code`.

### Shape 3: field validation

```json
{
    "txnId": "Invalid Transaction Id",
    "timestamp": "2025-01-15 13:21:16"
}
```

No code at all. The key is the name of the field your system got wrong, and the value says what is wrong with it. Several bad fields produce several keys in one body:

```json
{
    "scope": "Invalid Scope",
    "authData": "Invalid Auth Data",
    "timestamp": "2025-01-15 13:39:03"
}
```

Handle this by treating every key except `timestamp` as a field name. These always arrive as HTTP 400.

### Shape 4: the API gateway error

```json
{
    "code": "900901",
    "message": "Invalid Credentials",
    "description": "Invalid JWT token. Make sure you have provided the correct security credentials"
}
```

A numeric code, not an `ABDM-` code, and a `description` field the other shapes do not have. This comes from the API gateway in front of the ABHA service, before your request reaches the business logic. It almost always means the `Authorization` header is wrong or the token has expired.

## Codes the sources carry

### Authentication and access

| Code | HTTP | Message | What causes it | What to do |
|---|---|---|---|---|
| `900901` | 401 | Invalid Credentials. Invalid JWT token. | The gateway access token in `Authorization` is missing, malformed or expired. | Call [Get an access token](/docs/api/hie-cm/m1/apis#get-an-access-token) again and retry once. If it fails a second time, check your client ID and secret. |
| `900900` | 500 | Unclassified Authentication Failure | The gateway could not classify the auth failure. The saved example shows it on a malformed path with a bad token. | Check both the URL and the `Authorization` header before you read a 500 as an NHA outage. The one example the sources carry was caused by the client. |
| `ABDM-1094` | 401 | Access to this feature is restricted. Please contact NHA to enable it. | Your client is not entitled to that endpoint. Every saved example is on a benefit programme or insurance call, which are government integrator only. | Stop calling it, or ask NHA to enable the entitlement. Retrying will not help. |
| `ABDM-1094` | 401 | Invalid Benefit Name | The `BENEFIT_NAME` header does not match a benefit programme registered against your client. | Use the exact benefit name NHA gave you at onboarding. The collection uses `healthid api`. |
| `ABDM-9999` | 401 | Wraps an `ABDM-1094` message | Seen once, with the code recorded as `ABDM-9999: ` and the inner code stuck to the front of the message text. | Treat it as the code named inside the message. Log the raw body, because the code field is unreliable here. |
| `ABDM-1224` | 401 | Login via Biometric is not allowed. | Your client is not entitled to the biometric or face login routes. | Use an OTP route. Biometric routes are optional in M1, so this does not block certification. |
| Invalid X-token | 400 | `{"message": "Invalid X-token", "timestamp": "..."}` | The user token in `X-token` is missing, malformed or expired. Note there is no `code` field. | Call [Refresh the user token](/docs/api/hie-cm/m1/apis#refresh-the-user-token). If that fails, send the person back through login. |

### Aadhaar and biometric failures

Every one of these arrives as `ABDM-1204` with HTTP 422. The real cause is the code from the Unique Identification Authority of India (UIDAI), the body that runs Aadhaar. It sits inside the message string, so parse the message, not only the code.

| UIDAI code | Message | What causes it | What to do |
|---|---|---|---|
| 300 | Biometric data did not match. | The fingerprint, IRIS or face capture is not the person the Aadhaar number belongs to. | Ask the person to try the capture again. After a second failure, offer an [OTP](/docs/overview/glossary#otp) route instead. |
| 561 | Request expired. The PID timestamp is older than the configured threshold. | The captured data block sat too long between capture and submission. | Capture again and submit immediately. Do not cache a block across a user session. |
| 563 | Duplicate request. The same authentication request was re-sent. | Your system sent the identical capture block twice. A retry loop on a timeout is the usual cause. | A capture block is single use. Make a fresh capture rather than retrying the old one. |
| 810 | Missing biometric data as specified in "Uses". | The block does not carry the biometric type the request asked for. | Check that the device is capturing the modality you declared, and that the registered device service is the right one for it. |

The UIDAI codes above are quoted from the collection's saved responses. UIDAI publishes many more. NHA passes them through in this message field, so expect codes that are not in this table.

### Request validation

All HTTP 400, all shape 3, no code.

| Key in the body | Value | What causes it |
|---|---|---|
| `txnId` | Invalid Transaction Id | The `txnId` is missing, malformed, from a different flow, or already spent. |
| `scope` | Invalid Scope | The `scope` array is missing or holds a value the endpoint does not accept. |
| `authData` | Invalid Auth Data | The `authData` object is missing or empty. Sending an empty body produces `scope` and `authData` together. |
| `authMethod` | Invalid Auth Methods | `authData.authMethods` names a method this endpoint or your client does not support. |
| `loginId` | Invalid LoginId | The identifier is malformed, or not encrypted when the endpoint expected it encrypted. |
| `faceDto` | Invalid Aadhaar face request | The face authentication object is missing or malformed. |
| `bioDto` | Invalid Aadhaar bio request | The biometric object is missing or malformed. |
| `PID` | Invalid Face Auth PID | The captured data block is not readable as a valid block. |

The most common of these on day one is `txnId`. M1 flows chain a transaction ID from one call to the next, and it changes at several steps. Read the `txnId` out of every response and use the newest one, rather than holding the first.

### Business rules

| Code | HTTP | Message | What causes it | What to do |
|---|---|---|---|---|
| `ABDM-1013` | 400 | Invalid ABHA Number | The ABHA number is the wrong length or fails its checksum. The saved example is a 13 digit number where 14 were needed. | Validate before you call. ABHA numbers use the Luhn checksum, which NHA's M1 document names under developer utilities. |
| `ABDM-1140` | 400 | The benefit record has already been linked | You linked a benefit that is already linked. Government integrators only. | Treat it as success. The end state you wanted is already true. |
| `ABDM-1138` | 400 | The benefit record has already been de-linked | The mirror of the above. | Treat it as success. |

### Routing

| Code | HTTP | Body | What causes it |
|---|---|---|---|
| `404` | 404 | `{"code":"404","type":"Status report","message":"Runtime Error","description":"No matching resource found for given API Request"}` | The path is wrong. The saved example was produced by typing `profile/lo/verify` instead of `profile/login/verify`. |

Read a 404 in M1 as a wrong path before you read it as a missing record. The one saved example was a typo. Check the trailing slash on the base URL, because the collection's base URLs end in `/` and the paths do not start with one.

## Things that are not errors but look like them

**HTTP 200 with `status: PENDING`.** [Poll PID capture](/docs/api/hie-cm/m1/apis#poll-pid-capture) answers 200 for `PENDING`, `VERIFIED` and `COMPLETE` alike. Branch on the `status` field. A system that only checks the status code will think face auth finished the moment it started.

**A `message` naming a masked mobile number.** [Request a login OTP](/docs/api/hie-cm/m1/apis#request-a-login-otp) returns `"OTP is sent to Mobile number ending with ******0161"` on success. That is a success body, and it is worth showing the person so they know which handset to check.

## What is missing from this page

Three gaps, stated plainly.

- **The published error catalogue.** NHA's M1 document lists an error code reference but shows it as images. Codes between `ABDM-1013` and `ABDM-1224` clearly exist in quantity, and we have five of them.
- **Rate limits.** Neither source says how many OTP requests a mobile number or an Aadhaar number is allowed in a window, or what the response is when you exceed it. OTP flows almost always have such a limit.
- **Token expiry on the gateway token.** The saved login example gives the user token 1800 seconds. Nothing in the sources says how long the gateway access token from the sessions call lasts. Handle `900901` as a signal to refresh rather than assuming a lifetime.

## Next

- [APIs](/docs/api/hie-cm/m1/apis) for the request and response detail of every endpoint named above.
- [Test cases](/docs/api/hie-cm/m1/test-cases) for failure paths worth running deliberately.
- [Support](/docs/support) for reporting a code that is not on this page.
