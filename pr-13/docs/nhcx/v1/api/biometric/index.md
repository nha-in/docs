# ABHA biometric authentication

PMJAY requires proof that the beneficiary was physically present.

## Calls

| Call                                                                                                          | Method and path                                              | What it does                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Biometric auth init](/docs/pr-13/docs/nhcx/v1/api/biometric/endpoints/biometric-auth-init)                   | `POST /hcx/abha/biometric/auth/init`                         | Starts a fingerprint or iris authentication of a PMJAY beneficiary against the ABHA registry and returns the `txnId` the verify call needs.                |
| [Biometric auth verify](/docs/pr-13/docs/nhcx/v1/api/biometric/endpoints/biometric-auth-verify)               | `POST /hcx/abha/biometric/auth/verify`                       | Completes the authentication started by `Biometric auth init` with the captured PID block, and returns the beneficiary's user token, valid thirty minutes. |
| [Biometric auth refresh token](/docs/pr-13/docs/nhcx/v1/api/biometric/endpoints/biometric-auth-refresh-token) | `GET /hcx/abha/biometric/auth/refresh/token`                 | Exchanges the refresh token from `Biometric auth verify` for a new thirty-minute user token without a fresh capture.                                       |
| [Face auth init](/docs/pr-13/docs/nhcx/v1/api/biometric/endpoints/biometric-faceauth-init)                    | `POST /pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init`  | Starts a face authentication on the ABDM proxy host and returns the `txnId` the rest of the face flow quotes.                                              |
| [Face auth capture PID](/docs/pr-13/docs/nhcx/v1/api/biometric/endpoints/biometric-faceauth-capture-pid)      | `POST /pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid`    | Polls for the face capture the patient completes in the ABHA app after scanning the QR code for the `txnId` from `Face auth init`.                         |
| [Face auth verify](/docs/pr-13/docs/nhcx/v1/api/biometric/endpoints/biometric-faceauth-v2-auth-verify)        | `POST /pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify` | Completes a face authentication with the encrypted Aadhaar number, the Aadhaar-linked mobile and the `txnId`, and returns the beneficiary's user token.    |

## Base URLs

| Environment | Base URL                     |
| ----------- | ---------------------------- |
| Sandbox.    | `https://apisbx.abdm.gov.in` |

## Guides that use these calls

- [Biometric authentication](/docs/pr-13/docs/nhcx/v1/roles/provider/biometric-authentication)

The whole specification, with a request you can send from the page, is the [ABHA biometric authentication API reference](/docs/pr-13/reference/nhcx-biometric).
