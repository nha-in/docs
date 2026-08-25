---
title: M1 ABHA identity errors
sidebar_label: Errors
sidebar_position: 98
description: What M1 ABHA identity returns when a call fails, and what to do about it.
verification: unverified
source: hiecm-m1.yaml
generated: true
---

# M1 ABHA identity errors

## Four error shapes, not one

Do not write a parser that expects a single shape.

### Shape 1: the wrapped ABDM error

```json
{
    "error": {
        "code": "ABDM-1204",
        "message": "UIDAI Error code : 300 : Biometric data did not match."
    }
}
```

The code lives at `error.code`. This comes from the ABHA service's own business logic.

### Shape 2: the flat ABDM error

```json
{
    "code": "ABDM-1094",
    "message": "Access to this feature is restricted. Please contact NHA to enable it.",
    "timestamp": "2024-10-25 15:02:34"
}
```

Same family of codes, no `error` wrapper, plus a `timestamp`. The collection shows `ABDM-1094` in both shapes on different calls, so the wrapper is not tied to the code. Read `error.code` first and fall back to a top level `code`.

### Shape 3: field validation

```json
{
    "txnId": "Invalid Transaction Id",
    "timestamp": "2025-01-15 13:21:16"
}
```

No code at all. The key names the field you got wrong. Several bad fields produce several keys:

```json
{
    "scope": "Invalid Scope",
    "authData": "Invalid Auth Data",
    "timestamp": "2025-01-15 13:39:03"
}
```

Treat every key except `timestamp` as a field name. These always arrive as HTTP 400.

### Shape 4: the API gateway error

```json
{
    "code": "900901",
    "message": "Invalid Credentials",
    "description": "Invalid JWT token. Make sure you have provided the correct security credentials"
}
```

A numeric code, not an `ABDM-` code, plus a `description` field the other shapes lack. This comes from the API gateway in front of the ABHA service, before your request reaches the business logic. It almost always means the `Authorization` header is wrong or expired.

## Codes

Saved example responses in NHA's M1 ABHA Postman collection. NHA's M1 document carries its code reference as screenshots with no text.

| Code | Message | What to do |
| --- | --- | --- |
| `ABDM-1013` | Invalid ABHA Number | Fix request |
| `ABDM-1094` | Access to this feature is restricted. Please contact NHA to enable it. | Fix auth |
| `ABDM-1094` | Invalid Benefit Name | Fix auth |
| `ABDM-1138` | The benefit record has already been de-linked | Treat as success |
| `ABDM-1140` | The benefit record has already been linked | Treat as success |
| `ABDM-1204` | A UIDAI failure passed through. The UIDAI code and text sit inside the message string | Fix request |
| `ABDM-1224` | Login via Biometric is not allowed. | Fix auth |
| `ABDM-9999` | Recorded as `ABDM-9999: ` with an `ABDM-1094` message stuck to the front of the text | Fix auth |

## untagged codes

The same collection, and the only source that recorded HTTP statuses.

| Code | HTTP | Message | What to do |
| --- | --- | --- | --- |
| `900901` | 401 | Invalid Credentials, invalid JWT token. From the API gateway in front of the ABHA service, before your request reaches the business logic | Fix auth |
| `900900` | 500 | Unclassified authentication failure. The one saved example had a bad path and a bad token together, so read it as a client error first | Fix auth |
| `404` | 404 | No matching resource found for given API Request`. A wrong path, not a missing record | Fix request |

## uidai codes

Codes from the Unique Identification Authority of India, passed through inside the message of ABDM-1204. NHA passes through more than these, so parse the message.

| Code | Message | What to do |
| --- | --- | --- |
| `300` | Biometric mismatch |  |
| `561` | Request expired |  |
| `563` | Duplicate request |  |
| `810` | Missing biometric data |  |

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/hiecm/v3/reference/error-codes).

<a class="next-step" href="/docs/support">
<span class="next-step__eyebrow">Next</span>
<span class="next-step__label">Still stuck? Ask for help</span>
<span class="next-step__detail">Where to file what you hit, so the answer lands back in these pages.</span>
</a>

