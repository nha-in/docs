---
name: abdm-m1
description: Use when building, debugging or testing ABDM Milestone 1: creating an ABHA number or address, ABHA login, profile management, or the gateway session token. Carries the endpoints, the required headers, the two token rule, the encryption rule, every recorded error code and the M1 test matrix. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.
---

# ABDM M1, ABHA identity

Generated from the ABDM Developer Portal on 2026-09-14, catalogue version 2026.08.24. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download it from the portal's /skills/abdm-m1/SKILL.md path when it is older than the work you are doing.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version, which you can compare against the version above.

## What this skill covers

- **Scaffold.** Build it flow by flow against the sandbox, as a loop that ends on an observed result rather than on a call returning 200. [references/scaffold.md](references/scaffold.md)
- **Integrate.** 55 operations, with their hosts and headers. [references/integrate.md](references/integrate.md)
- **Debug.** The loop from a failed call to a named fix, and 89 recorded error codes. [references/debug.md](references/debug.md)
- **Test.** 122 test cases, each with the call it makes and what to see when it passes. [references/test.md](references/test.md)

Open one when the work calls for it. This file is the map, not the material.

## Before anything else

- Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.
- Get an access token first, from the gateway session endpoint. Every other call needs it in `Authorization: Bearer <token>`.
- Two tokens exist and they are not interchangeable. The gateway access token goes in `Authorization`. The user token from an enrolment or a login goes in `X-token`. Profile endpoints need both.
- Sensitive fields travel encrypted. Aadhaar numbers, mobile numbers, email addresses, OTP values and passwords are encrypted before they go in the body, then base64 encoded.
- The padding is RSA-OAEP with SHA-1, for both the digest and the mask generation function: `RSA/ECB/OAEPWithSHA-1AndMGF1Padding` in Java, `oaepHash: "sha1"` in Node. PKCS#1 v1.5 is refused, and so is OAEP with SHA-256. Neither refusal names encryption, so a wrong padding reads back as a wrong value.
- The key is the 4096-bit certificate from `/v3/profile/public/certificate`. It arrives as base64 DER, so add PEM armour before loading it. The helper at `/v3/phr/app/enrollment/encrypt` holds a different, 2048 bit key and is not interchangeable with it.
- Prove the padding before building a flow. `POST /v3/profile/login/request/otp` with `loginHint: "mobile"` returns 200 and a `txnId` when it is right, and `Invalid Mobile Number` when it is wrong. `/v3/enrollment/request/otp` refuses every input identically, so it cannot tell you.
- One path serves several jobs. The `scope` array in the body picks which one, so read it before assuming an endpoint does one thing.

## Practices that hold across every call

- Read the body, not only the status. A refusal often names the field in its body while the status says nothing useful, and a bad clock can arrive as a 404.
- Prove an assumption against a call that is able to disagree with you. An endpoint that refuses every input with one message cannot tell you which input was right, and testing against it turns a correct answer into a ruled out one.
- Suspect the transport before the data. When a call refuses a value you believe in, check the encryption, the headers and the clock before you doubt the number. Those failures are reported as if the value were wrong.
- Do not carry an encryption path from one module to another. The padding, the certificate and the key size belong to the registry you are calling, and a path that works in one module produces a value another cannot read.
- Never log a sensitive value before you encrypt it, and never send one to a remote service to be encrypted. Both move the leak rather than removing it.
- Generate a fresh REQUEST-ID for every call and log it before sending. Once a call has failed it is the only handle on it.
- Send TIMESTAMP in UTC with milliseconds and a trailing Z. Local time is refused, sometimes as a 404.
- Cache a public certificate with a validity window rather than forever. A rotation fails every encrypted call at once, and a cache with no expiry cannot recover on its own.

## Where the detail is

- Every endpoint, with its body fields and responses: /docs/hiecm/v3/api/m1
- The flows as diagrams: /docs/hiecm/v3/milestones/m1
- Every error code across modules: /docs/hiecm/v3/reference/error-codes
- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary
- Terms: /docs/hiecm/v3/getting-started/glossary
