---
id: nhcx.endpoint.abha-biometric-v2-auth-verify
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify
summary: >-
  Complete a face check of a scheme patient and receive the short-lived token that
  proves they were present.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. NHCX Face-Auth API Curl, FACE AUTH Aadhar Verify.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 15, Q26.9 process type.
related:
  endpoints:
  - nhcx.endpoint.abha-biometric-faceauth-init
  - nhcx.endpoint.abha-biometric-capture-pid
  - nhcx.endpoint.abha-biometric-v2-auth-verify
  - nhcx.endpoint.abha-biometric-auth-refresh-token
  - nhcx.endpoint.abha-biometric-auth-init
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.payr-1256
  - nhcx.error.payr-1363
  concepts:
  - nhcx.concept.biometric-authentication
  - nhcx.concept.pmjay-on-nhcx
  flows:
  - nhcx.flow.biometric-face
  decisions:
  - nhcx.decision.biometric-modality
---

# POST /pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify

## In plain words

[PMJAY](../glossary/pmjay.md) requires proof that the beneficiary is physically present at the hospital. The hospital proves it by authenticating the beneficiary against their [ABHA](../../shared/glossary/abha.md), by fingerprint, iris or face. Face verify completes a face authentication once the capture is `COMPLETE`. It sends the encrypted Aadhaar number and the Aadhaar-linked mobile, and returns the same token pair as fingerprint and iris, with the ABHA profile.

These are plain JSON calls: no JWE envelope and no callback.

## Before you start

- A session token for the `Authorization` header, not `bearer_auth`. See [the session token](../concepts/session-token.md).
- The participant code of the scheme payer the authentication is for. It goes in the `payerid` header.
- A `txnId` from [face auth init](abha-biometric-faceauth-init.md) that [capture PID](abha-biometric-capture-pid.md) reports `COMPLETE`.
- The patient's Aadhaar number, encrypted with the public key below using the transformation `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`, base64 encoded.
- The patient's Aadhaar-linked mobile number.

## What happens

Encrypt the Aadhaar number with this X.509 public key:

```text
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9Nwgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1AayfZp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7irDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkNergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXuiwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAlsIzQpnSVDUVEzv17grVAw078CAwEAAQ==
```

Then call the ABDM proxy host:

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'REQUEST-ID: <NEW_UUID_FOR_THIS_CALL>' \
  --header 'TIMESTAMP: <CURRENT_UTC_ISO_TIMESTAMP>' \
  --header 'payerid: <PAYER_PARTICIPANT_CODE>' \
  --header 'process: Preauth' \
  --data-raw '{
    "authData": {
      "authMethods": ["face_auth"],
      "face": {
        "txnId": "<TXN_ID_FROM_FACEAUTH_INIT>",
        "aadhaar": "<ENCRYPTED_AADHAAR_NUMBER>",
        "mobile": "<AADHAAR_LINKED_MOBILE>"
      }
    },
    "authMode": "FACE_AUTH"
  }'
```

`REQUEST-ID` is a new UUID for every call ([REQUEST-ID](../../shared/glossary/request-id.md)). `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z` ([TIMESTAMP](../../shared/glossary/timestamp-header.md)). `process` is `Preauth` at registration or pre-authorisation, and `Discharge` at discharge.

**Retrying.** A face capture belongs to its `txnId`. After a failure, start again with a new init.

## How you know it worked

You receive a JSON body with a `tokens` object and an `ABHAProfile`:

```json
{
  "txnId": "<TXN_ID>",
  "message": "<MESSAGE>",
  "tokens": {
    "token": "<USER_TOKEN>",
    "expiresIn": "1800",
    "refreshExpiresIn": "1296000",
    "refreshToken": "<REFRESH_TOKEN>"
  },
  "ABHAProfile": {
    "ABHANumber": "<ABHA_NUMBER>",
    "preferredAddress": "<ABHA_ADDRESS>",
    "abhaStatus": "ACTIVE"
  }
}
```

`expiresIn` and `refreshExpiresIn` arrive as strings here. The profile also carries name, date of birth, gender, photo, mobile and address.

The step is done when both tokens are stored against the case. Keep only the profile fields the record needs.

## When it goes wrong

- The Aadhaar number is sent in the clear, or validated as twelve digits after encryption. Send the base64 ciphertext.
- The call is made before capture PID answers `COMPLETE`.
- The call goes to the fingerprint host. Use the ABDM proxy host.
- No token is obtained before the pre-authorisation or claim. The request is refused with [`PAYR-1256`](../errors/payr-1256.md) or [`PAYR-1363`](../errors/payr-1363.md) unless it carries the consent questionnaire response.
