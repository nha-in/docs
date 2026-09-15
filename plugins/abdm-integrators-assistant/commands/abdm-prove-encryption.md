---
description: Prove your RSA padding against the ABDM sandbox before you build a flow on it.
argument-hint: '[m1|m4] [--mobile <10 digits>]'
---

Prove the encryption path for `$ARGUMENTS` before any flow is built on it. With no argument, prove M1.

Every ABDM journey opens with a call carrying an encrypted value, so a wrong padding stops you on your first request. The refusal names the business field rather than the encryption, which sends you to check your test data instead of your crypto.

## What this runs

**M1.** `POST /v3/profile/login/request/otp` on `https://abhasbx.abdm.gov.in/abha/api/v3`, with `loginHint: "mobile"` and `scope: ["abha-login", "mobile-verify"]`, carrying a mobile number you control encrypted under the certificate from `/v3/profile/public/certificate`.

Load the `abdm-m1` skill for the headers and the full body. The atom behind this check is `hiecm.test.m1-encryption-padding`.

**M4.** The NHPR certificate at `/v4/int/api/v1/auth/cert` and `RSA/ECB/PKCS1Padding`. Load the `abdm-m4` skill. This padding is the NHPR's and is not M1's, so prove each separately and never reuse one path for the other.

## Pick the endpoint that can disagree with you

Run the M1 check against the login OTP endpoint and nowhere else. `/v3/enrollment/request/otp` answers `{"loginId": "Invalid LoginId"}` for plaintext, for an empty string, for base64 that is not ciphertext, and for correct ciphertext alike. A padding matrix run against it returns the same refusal for every row, so it rules out the correct answer along with the wrong ones.

## Passing

HTTP 200, a `txnId`, and a message naming the last four digits of the mobile. An OTP arrives on that phone. Report the padding, the key source and the key size that produced it, then stop.

## Failing

- `400 {"loginId": "Invalid Mobile Number"}` for a number you know is correct. The padding is wrong. PKCS#1 v1.5 and OAEP with SHA-256 both produce this. Use OAEP with SHA-1 for both the digest and the mask generation function, and try again.
- The padding is already OAEP with SHA-1 and the refusal stands. You encrypted under the wrong key. The helper at `/v3/phr/app/enrollment/encrypt` holds a 2048 bit key; this call wants the 4096-bit certificate.
- Your library will not load the key. Add the PEM armour. The certificate arrives as base64 DER.
- A 404 on a path you can see is correct. Check `TIMESTAMP` is UTC with milliseconds and a trailing `Z`.

Report the failing padding and what you changed. Do not move on to a flow until this passes.
