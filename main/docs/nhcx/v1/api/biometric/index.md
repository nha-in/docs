# ABHA biometric authentication

PMJAY requires proof that the beneficiary was physically present.

## APIs

| Call                                                                                                                                 | Called by | Method and path                                              | What it does                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Biometric auth init](/docs/main/docs/nhcx/v1/api/biometric/endpoints/biometric-hcx-abha-biometric-auth-init)                        | Provider  | `POST /hcx/abha/biometric/auth/init`                         | Starts a fingerprint or iris authentication of a PMJAY beneficiary against the ABHA registry and returns the `txnId` the verify call needs.                |
| [Biometric auth verify](/docs/main/docs/nhcx/v1/api/biometric/endpoints/biometric-hcx-abha-biometric-auth-verify)                    | Provider  | `POST /hcx/abha/biometric/auth/verify`                       | Completes the authentication started by `Biometric auth init` with the captured PID block, and returns the beneficiary's user token, valid thirty minutes. |
| [Biometric auth refresh token](/docs/main/docs/nhcx/v1/api/biometric/endpoints/biometric-hcx-abha-biometric-auth-refresh-token)      | Provider  | `GET /hcx/abha/biometric/auth/refresh/token`                 | Exchanges the refresh token from `Biometric auth verify` for a new thirty-minute user token without a fresh capture.                                       |
| [Face auth init](/docs/main/docs/nhcx/v1/api/biometric/endpoints/biometric-pmjay-sbxhcx-abdmproxy-abha-biometric-faceauth-init)      | Provider  | `POST /pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init`  | Starts a face authentication on the ABDM proxy host and returns the `txnId` the rest of the face flow quotes.                                              |
| [Face auth capture PID](/docs/main/docs/nhcx/v1/api/biometric/endpoints/biometric-pmjay-sbxhcx-abdmproxy-abha-biometric-capture-pid) | Provider  | `POST /pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid`    | Polls for the face capture the patient completes in the ABHA app after scanning the QR code for the `txnId` from `Face auth init`.                         |
| [Face auth verify](/docs/main/docs/nhcx/v1/api/biometric/endpoints/biometric-pmjay-sbxhcx-abdmproxy-abha-biometric-v2-auth-verify)   | Provider  | `POST /pmjay/sbxhcx/abdmproxy/abha/biometric/v2/auth/verify` | Completes a face authentication with the encrypted Aadhaar number, the Aadhaar-linked mobile and the `txnId`, and returns the beneficiary's user token.    |

## Base URLs

| Environment | Base URL                     |
| ----------- | ---------------------------- |
| Sandbox.    | `https://apisbx.abdm.gov.in` |

The six calls share a hostname and split across two bases under it. A client configured with one base reaches only half of them.

| Modality                            | Base, sandbox                                                       |
| ----------------------------------- | ------------------------------------------------------------------- |
| Fingerprint, iris and token refresh | `https://apisbx.abdm.gov.in/hcx/abha/biometric/`                    |
| Face                                | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/` |

If fingerprint works and every face call fails, check the base before you check the face flow. [Biometric authentication](/docs/main/docs/nhcx/v1/roles/provider/biometric-authentication#two-hosts-and-this-is-the-first-thing-to-get-right) sets out both.

## Guides that use these calls

- [Biometric authentication](/docs/main/docs/nhcx/v1/roles/provider/biometric-authentication)

The whole specification, with a request you can send from the page, is the [ABHA biometric authentication API reference](/docs/main/reference/nhcx-biometric).
