# Submit the biometric auth verify

`POST /hcx/abha/biometric/auth/verify`

Completes the authentication started by `Biometric auth init` with the captured PID block, and returns the beneficiary's user token, valid thirty minutes.

### Business purpose

The user token this call returns is the proof of presence PMJAY asks for. It rides on the eligibility check, the pre-authorisation and the claim. Without it a request must carry the plan's consent questionnaire instead, or it is refused: `PAYR-1256` at the pre-authorisation, `PAYR-1363` at the claim.

### When to use

Call it right after the capture, with the `txnId` from init and the PID block from the device.

### Preconditions

- A `txnId` from `Biometric auth init` for the same method.
- The PID block from the capture device.
- The same headers as init.

### Postconditions

Returns a user token valid for thirty minutes and a refresh token valid for fifteen days. The user token goes on the eligibility check, the pre-authorisation and the claim.

### Common mistakes

- Putting the PID block under the wrong key for the method.
- Storing the token against the session instead of the case.
- Using a refreshed token where a cyclic visit needs a new capture.

### Best practices

- Store the user token and its expiry against the case.
- Store the refresh token, and refresh automatically for the duration of the transaction cycle.
- Keep nothing from the ABHA profile beyond what the encounter needs.

### Related scenario

Right after the fingerprint capture, the desk posts the `txnId` from init and the device's PID block in `fingerPrintAuthPid`, with `authMethods` `["bio"]`. The answer carries a thirty-minute token and a fifteen-day refresh token. The token goes on the header of the eligibility check and the pre-authorisation, and both tokens are stored against the case.

### Specification

Chapter [Biometric authentication](/docs/nhcx/v1/roles/provider/biometric-authentication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/verify \
  --header 'process: Preauth' \
  --header 'payerid: <payer code>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "txnId": "<txn id>",
      "fingerPrintAuthPid": "<pid block>"
    }
  },
  "authMode": "FINGERPRINT"
}'
```

## Headers

- `process` (string, required): No source puts `process` or `payerid` on `faceauth/init` or `capture/pid`.
- `payerid` (string, required): `payerid` is the insurer's own participant code. Every insurer has one, even when it works through a TPA.

## Body

- `scope` (string[])
- `authData` (object)
- `authData.authMethods` (string[])
- `authData.bio` (object)
- `authData.bio.txnId` (string)
- `authData.bio.fingerPrintAuthPid` (string)
- `authMode` (string)

## Responses

- `200`: On success it returns `authResult` `success`, a user `token` with `expiresIn` 1800 seconds, a `refreshToken` with `refreshExpiresIn` 1296000 seconds, fifteen days, and the ABHA `accounts` matched.
  - `txnId` (string)
  - `authResult` (string)
  - `message` (string)
  - `token` (string)
  - `refreshToken` (string)
  - `expiresIn` (integer)
  - `refreshExpiresIn` (integer)
  - `accounts` (object[])
  - `accounts.ABHANumber` (string)
  - `accounts.name` (string)
  - `accounts.status` (string)

Example 200 response. The values are placeholders:

```json
{
  "txnId": "d21b3db9-478a-xxxx-xxxx-8f75e7f86b9f",
  "authResult": "success",
  "message": "… verified successfully",
  "token": "eyZhx….",
  "refreshToken": "eyZhx….",
  "expiresIn": 1800,
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "91-XXXX-XXXX-1234",
      "name": "…",
      "status": "ACTIVE"
    }
  ]
}
```
