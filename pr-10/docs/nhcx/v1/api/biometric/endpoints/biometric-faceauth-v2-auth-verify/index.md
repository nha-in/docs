# Face auth verify

`POST /pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify`

Completes a face authentication with the encrypted Aadhaar number, the Aadhaar-linked mobile and the `txnId`, and returns the beneficiary's user token.

### Business purpose

It completes the face method with the same outcome as fingerprint and iris: the user token that proves presence to the scheme and rides on the eligibility check, the pre-authorisation and the claim.

### When to use

After `Face auth capture PID` answers `COMPLETE`.

### Preconditions

- The `txnId` from `Face auth init`, with the capture reported `COMPLETE`.
- `aadhaar` is the Aadhaar number encrypted with the X.509 public key the portal publishes, using the transformation `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`. The ciphertext is roughly 680 base64 characters for a 4096-bit key.
- `mobile` is the Aadhaar-linked mobile number.
- `authMethods` is `["face_auth"]` and `authMode` is `FACE_AUTH`.
- The ABDM session token on `Authorization`, with a fresh `REQUEST-ID`, the current `TIMESTAMP`, `payerid` and `process`, sent to the ABDM proxy host.

### Postconditions

Returns the same token pair as `Biometric auth verify`, a thirty-minute user token and a fifteen-day refresh token, plus a full ABHA profile: name, date of birth, gender, photo, address, state and district.

### Common mistakes

- Sending the Aadhaar number in the clear.
- Validating the ciphertext as a twelve-digit number.
- Logging or storing the encrypted Aadhaar value.
- Sending it to the fingerprint host.

### Best practices

- Never log or store the encrypted Aadhaar value.
- Take from the ABHA profile only what the record needs.
- Store the user token and its expiry against the case.

### Related scenario

The capture for a discharge face authentication has answered `COMPLETE`. The desk encrypts the patient's Aadhaar number with the portal's public key, posts it here with the `txnId` and the Aadhaar-linked mobile, and receives the token pair and the ABHA profile. It stores the token against the case, keeps only the profile fields the record needs, and discards the encrypted value.

### Specification

Chapter [Biometric authentication](/docs/nhcx/v1/roles/provider/biometric-authentication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify \
  --header 'REQUEST-ID: <uuid>' \
  --header 'TIMESTAMP: <iso timestamp>' \
  --header 'payerid: <payer code>' \
  --header 'process: Preauth' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face": {
      "txnId": "<txn id>",
      "aadhaar": "<encrypted aadhaar>",
      "mobile": "<aadhaar mobile>"
    }
  },
  "authMode": "FACE_AUTH"
}'
```
