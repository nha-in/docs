# Authentication

Generated from the specifications. Every scheme and header below is declared in one of them.

## Session

**bearerAuth**, `http` `bearer`. On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. NHCX reads `bearer_auth`, not `Authorization`.

| Header       | Required | What it is                                                                                                                                                                                                                                                                                                 |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUEST-ID` | yes      | `REQUEST-ID` is a fresh UUID that you generate for every call. Sending the same one twice is the mistake to avoid; generate it, do not copy it from an example.                                                                                                                                            |
| `TIMESTAMP`  | yes      | `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z`, as in `2026-09-04T06:15:51.975Z`. A clock that has drifted will be refused, so take the time from the system rather than constructing it by hand. How to produce it in each language is at the end of this chapter. |
| `X-CM-ID`    | yes      | `X-CM-ID` names the environment. It is `sbx` on the sandbox. The mirror and the adapter both use lowercase.                                                                                                                                                                                                |

## Participant registry

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |
| `Accept`      | yes      | Always `application/json` on the participant service.              |

## Coverage eligibility

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Insurance plan

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Pre-authorisation

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Claim

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Reprocess, cancel and shortfall

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Payment notice

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Communication

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Status and search

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |

## Onboarding

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |
| `Accept`      | yes      | Always `application/json` on the participant service.              |
| `source`      | yes      | Sent on this call, as the package's request carries it.            |

## PMJAY adjudicator

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |
| `Accept`      | yes      | Always `application/json` on the payer service.                    |

## ABHA biometric authentication

**bearerAuth**, `http` `bearer`. The biometric calls go to the ABDM gateway, not to NHCX, so they carry the ABDM session token on `Authorization` as `Bearer <token>`. NHCX's own calls use `bearer_auth` instead.

| Header       | Required | What it is                                                                                                                                                                                                                                                                                                 |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `process`    | yes      | No source puts `process` or `payerid` on `faceauth/init` or `capture/pid`.                                                                                                                                                                                                                                 |
| `payerid`    | yes      | `payerid` is the insurer's own participant code. Every insurer has one, even when it works through a TPA.                                                                                                                                                                                                  |
| `R-token`    | yes      | Sent on this call, as the package's request carries it.                                                                                                                                                                                                                                                    |
| `REQUEST-ID` | yes      | `REQUEST-ID` is a fresh UUID that you generate for every call. Sending the same one twice is the mistake to avoid; generate it, do not copy it from an example.                                                                                                                                            |
| `TIMESTAMP`  | yes      | `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z`, as in `2026-09-04T06:15:51.975Z`. A clock that has drifted will be refused, so take the time from the system rather than constructing it by hand. How to produce it in each language is at the end of this chapter. |

## Other

**bearerAuth**, `apiKey`. Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

| Header        | Required | What it is                                                         |
| ------------- | -------- | ------------------------------------------------------------------ |
| `bearer_auth` | yes      | It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints. |
