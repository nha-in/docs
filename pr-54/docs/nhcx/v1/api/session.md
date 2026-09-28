# Session

The token does not come from NHCX.

## APIs

| Call                                                                                                  | Called by       | Method and path                       | What it does                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Session token](/docs/pr-54/docs/nhcx/v1/api/session/endpoints/session-api-hiecm-gateway-v3-sessions) | Any participant | `POST /api/hiecm/gateway/v3/sessions` | Mints the ABDM gateway session token that every NHCX call carries, from the client ID and secret you received when you registered on the ABDM sandbox. |

## Base URLs

| Environment                  | Base URL                   |
| ---------------------------- | -------------------------- |
| Sandbox, ABDM session token. | `https://dev.abdm.gov.in`  |
| Production.                  | `https://apis.abdm.gov.in` |

## Guides that use these calls

- [Session token](/docs/pr-54/docs/nhcx/v1/getting-started/session-token)
- [Quickstart](/docs/pr-54/docs/nhcx/v1/getting-started/quickstart)

Each call has its own page in the sidebar, with a request you can send from it. The whole specification downloads as [YAML](/docs/pr-54/assets/files/nhcx-session-702f53fa555ca9955bcd5efa6079a34e.yaml) or [JSON](/docs/pr-54/assets/files/nhcx-session-904294a020f6b1f7f61b90ab3c511201.json).
