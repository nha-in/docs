# Session

The token does not come from NHCX.

## Calls

| Call                                                                                  | Method and path                       | What it does                                                                                                             |
| ------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Session token](/docs/pr-10/docs/nhcx/v1/api/session/endpoints/session-session-token) | `POST /api/hiecm/gateway/v3/sessions` | Mints the ABDM gateway session token that every NHCX call carries, from the client ID and secret issued for Milestone 1. |

## Base URLs

| Environment                                                                            | Base URL                   |
| -------------------------------------------------------------------------------------- | -------------------------- |
| Sandbox, ABDM session token.                                                           | `https://dev.abdm.gov.in`  |
| Production. ABDM's published production gateway. Confirm it in your onboarding letter. | `https://apis.abdm.gov.in` |

## Guides that use these calls

- [Session token](/docs/pr-10/docs/nhcx/v1/getting-started/session-token)
- [Quickstart](/docs/pr-10/docs/nhcx/v1/getting-started/quickstart)

The whole specification, with a request you can send from the page, is the [Session API reference](/docs/pr-10/reference/nhcx-session).
