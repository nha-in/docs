---
id: hiecm.test.m1-encryption-padding
type: test
gateway: hiecm
milestone: M1
version: abdm-v3
title: Prove your encryption padding before you build anything else
summary: >
  One call that answers differently for a right and a wrong RSA padding,
  so you find out in a minute rather than after a day of reading your
  test data.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: not-yet-hashed
    note: >
      The login OTP operation this test calls, and its recorded refusals.
  - file: (private) sandbox investigation, abhasbx.abdm.gov.in, 2026-09-14
    status: not-publicly-citable
    role: corroboration
    note: >
      The padding matrix behind the pass and fail bodies below, run by an
      integrator against a provisioned sandbox client and reported to this
      portal.
related:
  concepts: [hiecm.concept.encrypted-identifiers, hiecm.concept.input-encryption]
  endpoints: [hiecm.endpoint.m1-login-request-otp, hiecm.endpoint.m1-get-public-certificate]
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500]
skills:
  - hiecm-m1-build
---

# Prove your encryption padding before you build anything else

## In plain words

Every M1 journey begins with a call that carries an encrypted value, so
a wrong padding stops you on your first request. The refusal you get
back names the business field rather than the encryption, which sends
you to look at your Aadhaar number or your mobile number instead of
your crypto.

This is not a certification case. It is a precondition check you run
once, before you build a flow, so that every later failure is about the
flow rather than about the padding.

## Before you start

- A gateway access token. See
  [the gateway session](../concepts/gateway-session.md).
- The public certificate, fetched and armoured. See
  [get RSA public certificate](../endpoints/m1-get-public-certificate.md).
  It arrives as base64 DER and your library needs PEM.
- A mobile number you control AND that is registered against an ABHA
  account. This is the load bearing precondition. A number that is not registered returns the same refusal as bad ciphertext does, so the value you send has to be a real one. The
  assertion below does not need you to read the OTP, only to receive a
  200.

## What happens

Encrypt the 10 digit mobile number, no country code, with RSA-OAEP and
SHA-1 for both the digest and the mask generation function. Base64 the
ciphertext. Send it as `loginId`:

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <UTC_ISO_8601_WITH_MILLISECONDS_AND_Z>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": ["abha-login", "mobile-verify"],
  "loginHint": "mobile",
  "loginId": "<MOBILE_ENCRYPTED_OAEP_SHA1_BASE64>",
  "otpSystem": "abdm"
}'
```

In Node the encryption is:

```js
crypto.publicEncrypt(
  { key: pem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha1' },
  Buffer.from(mobile, 'utf8'),
).toString('base64')
```

where `pem` is the `publicKey` from the certificate call wrapped in
`-----BEGIN PUBLIC KEY-----` armour at 64 characters per line.

Run this call against `/v3/profile/login/request/otp` and nowhere else.
`/v3/enrollment/request/otp` refuses every input with the same body, so
a padding matrix run against it excludes the correct answer.

The login endpoint only tells them apart when the plaintext is a
registered number. Sending a correctly encrypted `9999999999` there
returns `400 {"loginId": "Invalid Mobile Number"}`, exactly what a
wrong padding returns. The 200 is the signal, and only a real number
can produce it.

## How you know it worked

You receive 200 and a body carrying `txnId` and a message naming the
last four digits of the mobile:

```response
{"txnId": "<TXN_ID>", "message": "OTP sent to mobile number ending with ******<LAST4>"}
```

An OTP arrives on that phone. The padding is right and the certificate
is right. Build the rest of M1 on that code path.

## When it goes wrong

- `400 {"loginId": "Invalid Mobile Number"}` for a number you know is
  correct. The padding is wrong. PKCS#1 v1.5 and OAEP with SHA-256 both
  return this. Use OAEP with SHA-1 for both the digest and the mask
  generation function.
- The same refusal with the padding already correct. You encrypted
  under the wrong key. The helper at `/v3/phr/app/enrollment/encrypt`
  holds a 2048 bit key, and this call wants the 4096-bit certificate
  from `/v3/profile/public/certificate`. See
  [encrypt a value](../endpoints/m1-encrypt-value.md).
- Your library will not load the key at all. Add the PEM armour. See
  [get RSA public certificate](../endpoints/m1-get-public-certificate.md).
- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
