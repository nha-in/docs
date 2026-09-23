# Submit the biometric auth init

`POST /hcx/abha/biometric/auth/init`

Starts a fingerprint or iris authentication of a PMJAY beneficiary against the ABHA registry and returns the `txnId` the verify call needs.

### Business purpose

PMJAY requires proof that the beneficiary was physically present. A hospital proves it by authenticating them against their ABHA, biometrically, and the user token that results rides on the eligibility check, the pre-authorisation and the claim. A request without it, and without the consent form that stands in for it, is refused by name. These are ABDM calls built for the PMJAY payer, not NHCX calls: no JWE and no callbacks.

### When to use

Use it at the desk while the beneficiary is present: at admission, at discharge and at every visit of a cyclic case. `scope` picks fingerprint or iris. Face has its own calls, starting with `Face auth init`.

### Preconditions

- The beneficiary's ABHA is linked to their PMJAY card.
- The ABDM session token is on `Authorization: Bearer`.
- `loginId` is the ABHA number with its hyphens.
- A capture device is ready.

### Postconditions

Returns a `txnId`. Send it with the capture to `Biometric auth verify`.

### Common mistakes

- Sending the token on `bearer_auth` only, which gets a `401`.
- Calling the face host instead of `/hcx/abha/biometric/`.
- Stripping the hyphens from `loginId`.
- Setting `lr` to `N` when building the capture.

### Best practices

- Implement fingerprint, iris and face. Each is mandatory, because any one of them may be the only one that works for a given patient.
- Set `process` from the stage of the case, not from a constant.
- Record the transaction ID, the method and the moment it succeeded against the case.

### Related scenario

A PMJAY beneficiary arrives for admission. The desk posts this request with `scope` `["ABHA-login", "Aadhaar-bio-verify"]`, `authMode` `FINGERPRINT`, the ABHA number with hyphens, `process` `Preauth` and the scheme payer's code, and gets a `txnId` back. The fingerprint is captured on the device and sent with that `txnId` to `Biometric auth verify`.

### Specification

Chapter [Biometric authentication](/docs/nhcx/v1/roles/provider/biometric-authentication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/init \
  --header 'process: Preauth' \
  --header 'payerid: <payer code>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "91-XXXX-XXXX-1234",
  "otpSystem": "aadhaar",
  "authMode": "FINGERPRINT"
}'
```

## Headers

- `process` (string, required): No source puts `process` or `payerid` on `faceauth/init` or `capture/pid`.
- `payerid` (string, required): `payerid` is the insurer's own participant code. Every insurer has one, even when it works through a TPA.

## Body

- `scope` (string[])
- `loginHint` (string)
- `loginId` (string)
- `otpSystem` (string)
- `authMode` (string)

## Responses

- `200`: Returns the `txnId` that `Biometric auth verify` quotes, with a message saying the authentication request was sent.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "8c8a12e3-xxxx-4278-xxxx-10acffa44f07",
  "authMode": null,
  "message": "FingerPrint authentication request successfully sent.",
  "status": null
}
```
