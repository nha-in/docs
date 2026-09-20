# Submit the biometric auth init

`POST /hcx/abha/biometric/auth/init`

Starts a fingerprint or iris authentication of a PMJAY beneficiary against the ABHA registry and returns the `txnId` the verify call needs.

### Business purpose

PMJAY requires proof that the beneficiary was physically present. A hospital proves it by authenticating them against their ABHA, biometrically, and the user token that results rides on the eligibility check, the pre-authorisation and the claim. A request without it, and without the consent form that stands in for it, is refused by name. These are ABDM calls built for the PMJAY payer, not NHCX calls: no JWE and no callbacks.

### When to use

At the desk with the beneficiary present: at admission with `process` `Preauth`, and at discharge, and at every visit of a cyclic case, with `process` `Discharge`. `scope` selects the modality, `Aadhaar-bio-verify` for fingerprint and `Aadhaar-iris-verify` for iris. `authMode` is `FINGERPRINT` or `IRIS`. The NHCX-PMJAY-HMIS Integration Guide and the Biometric Authentication APIs Postman collection also list face on this call, `Aadhaar-face-verify` with `FACE_AUTH`, but show no face request made this way; the face path documented end to end is `Face auth init` on the ABDM proxy host. `payerid` names the scheme payer the authentication is performed for.

### Preconditions

- The beneficiary's ABHA is linked to their PMJAY card. Where it is not, biometric authentication does not apply and the scheme's existing KYC protocols are followed.
- The ABDM session token on `Authorization: Bearer`, not on `bearer_auth`.
- `loginId` is the ABHA number with hyphens, the opposite of the envelope convention.
- A capture device, whose capture needs the wrapped Aadhaar data hash built with `lr` set to `Y`.

### Postconditions

Returns the `txnId` that `Biometric auth verify` quotes, with a message saying the authentication request was sent.

### Common mistakes

- Sending the token on `bearer_auth` only, which gets a `401` that looks like an expired token.
- Calling it on the face-authentication host. Fingerprint and iris sit under `/hcx/abha/biometric/`, face under `/pmjay/sbxhcx/abdmproxy/abha/biometric/`.
- Stripping the hyphens from `loginId`.
- Building the wrapped Aadhaar data hash with `lr` as `N`, which the biometric APIs answer with `K-547`.

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
