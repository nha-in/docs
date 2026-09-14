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
- The certificate response tells you the padding. `GET /v3/profile/public/certificate` returns `{"publicKey", "encryptionAlgorithm"}`, and `encryptionAlgorithm` is currently `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`. Read that field and translate it for your language. Do not hard code a padding: a constant is right until it is not, and the failure then looks like a bad value rather than a stale constant.
- PKCS#1 v1.5 is refused, and so is OAEP with SHA-256. Neither refusal names encryption, so a wrong padding reads back as a wrong value.
- More than one certificate is published and they are not interchangeable. `/v3/profile/public/certificate` is 4096-bit and `/v3/phr/app/login/public/certificate` is 2048-bit, both naming the same algorithm. Ciphertext length tells them apart: 512 bytes against 256. The helper at `/v3/phr/app/enrollment/encrypt` uses the 2048 bit key.
- Every certificate arrives as bare base64 DER with no PEM armour, whatever the field name suggests. Add the armour, wrapping at 64 characters per line, before your library will load it.
- Prove the padding before building a flow, with a mobile that is registered against an ABHA account. `POST /v3/profile/login/request/otp` with `loginHint: "mobile"` returns 200 and a `txnId` when the padding is right, and `Invalid Mobile Number` when it is wrong. The number has to be a real one: an unregistered number returns that same refusal whatever the padding, so it proves nothing. `/v3/enrollment/request/otp` refuses every input identically and cannot tell you either way.
- One path serves several jobs. The `scope` array in the body picks which one, so read it before assuming an endpoint does one thing.
- Holds regardless of the design: the reason a front desk adopts ABHA is that the receptionist stops typing. `GET /v3/profile/account` returns the whole registration form: names, day, month and year of birth, gender, mobile, email, the full address with LGD codes and a photograph. So the ABHA step comes BEFORE the registration form and fills it. A journey that registers the patient first and offers ABHA afterwards has already spent the keystrokes it existed to save.
- Two ways the profile reaches the desk. The patient scans a QR carrying your facility id and a counter id, consents in their own app, and ABDM posts the profile to your callback, so nobody at the desk types or asks anything. Or the desk runs the identifier journey, which ends in a token that reads the profile. Build whichever the deployment can reach, but the form is the destination either way.
- Present the filled form for confirmation rather than saving it unseen. The profile is what ABDM holds, not what the clinician sees: names get transliterated, addresses age, and a shared mobile may belong to a relative.
- ABDM publishes operations, not a user experience. The journey is the integrator's to design, and a product that knows its own counter will often beat any default. Offer the suggested shape below, say it is a suggestion, and build what the user asks for instead when they have a view.
- Suggested shape: one entry rather than a menu. Take one identifier, send one OTP, and branch on what comes back, because asking a person at a desk whether they want to log in or register puts a question to them they often cannot answer. A chooser is better where the desk genuinely knows, such as a counter that only registers new patients.
- Holds regardless of the design: read the accounts on the verification response before creating. Creating when an account already exists leaves the patient holding two ABHA numbers and no M1 operation merges them. This is the one failure worth designing around first.
- Holds regardless of the design: an ABHA is optional to the patient record, which is keyed by the hospital's own number. ABDM does not require a person to hold one to be treated, so a journey that cannot complete without one blocks care. Make that a deliberate decision rather than an omission.
- Five creation methods, each answering a different condition: Aadhaar OTP, mobile OTP, face authentication, an identity document, and a child ABHA under a parent, plus demographic authentication as an exact-match sixth. How many to show at once is a product decision. Showing one chosen from what the desk already holds is a suggestion, not a rule.
- The surface is more than a registration form. Finding a forgotten ABHA, upgrading a mobile-made address to KYC, showing the card and QR, sharing a profile by QR at a counter, and updating a mobile number are each placements the operations support. List them for the integrator so their own design can account for them rather than meeting them later.
- Holds regardless of the design: OTP attempts are counted against the transaction, not the person. Repeated sends lock that transaction and the error names the attempt count rather than the wait. A fresh transaction is the recovery. The code is never persisted and never logged.

## Practices that hold across every call

- Read the body, not only the status. A refusal often names the field in its body while the status says nothing useful, and a bad clock can arrive as a 404.
- When ABDM publishes a parameter, read it rather than hard coding what it currently says. The certificate endpoints return the encryption algorithm beside the key; code that reads that field survives a rotation and code that assumes a constant fails silently on the day it changes. Refuse to act on a published value you do not recognise rather than falling back to a default.
- Read every field in a response, not the one you came for. The M1 certificate call returns the padding next to the key, and a catalogue that recorded only the key cost an integrator a day rediscovering it.
- Prove an assumption against a call that is able to disagree with you. An endpoint that refuses every input with one message cannot tell you which input was right, and testing against it turns a correct answer into a ruled out one.
- Suspect the transport before the data. When a call refuses a value you believe in, check the encryption, the headers and the clock before you doubt the number. Those failures are reported as if the value were wrong.
- Do not carry an encryption path from one module to another. The padding, the certificate and the key size belong to the registry you are calling, and a path that works in one module produces a value another cannot read.
- Never log a sensitive value before you encrypt it, and never send one to a remote service to be encrypted. Both move the leak rather than removing it.
- Generate a fresh REQUEST-ID for every call and log it before sending. Once a call has failed it is the only handle on it.
- Do not match an error code with string equality. ABDM returns codes carrying trailing punctuation and whitespace, observed as `"code": "ABDM-9999: "`. Trim and compare on the prefix, or the branch you wrote for that code never runs.
- A failure does not always carry a body. An HTTP 401 with zero bytes was observed on a PHR profile call with no user token. Handle the empty body before you parse, or your client throws on the simplest failure there is.
- On a `HIS-` response from the registries, read `details[0].code` before the top level `code`. The outer code and the HTTP status describe the wrong thing: a 422 saying the data was wrong carried `HIS-403`, not permitted, one level down. Acting on the outer code sends you hunting through a payload that is fine.
- Repeated bad credentials lock the client. Eight consecutive failed session calls locked a sandbox client for about eight minutes, and every attempt in that window returned `Invalid user credentials`, which reads as a wrong secret rather than a temporary lock. Back off on an auth failure rather than retrying, and never loop a credential check.
- Send TIMESTAMP in UTC with milliseconds and a trailing Z. Local time is refused, sometimes as a 404.
- Cache a public certificate with a validity window rather than forever. A rotation fails every encrypted call at once, and a cache with no expiry cannot recover on its own.

## Where the detail is

- Every endpoint, with its body fields and responses: /docs/hiecm/v3/api/m1
- The flows as diagrams: /docs/hiecm/v3/milestones/m1
- Every error code across modules: /docs/hiecm/v3/reference/error-codes
- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary
- Terms: /docs/hiecm/v3/getting-started/glossary
