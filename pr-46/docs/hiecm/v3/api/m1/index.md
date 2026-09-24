# M1 Identity: Create and verify ABHA

Create an ABHA, authenticate a holder, and read or update the profile, QR code and linked mobile number.

## Postman collection

122 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-46/postman/hiecm-m1.postman_collection.json)[Environment](/docs/pr-46/postman/hiecm-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-46/postman/hiecm-m1.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Environment | Base URL                                   |
| ----------- | ------------------------------------------ |
| Sandbox     | `https://abhasbx.abdm.gov.in/abha/api/v3/` |

Login by fingerprint or iris uses the same base URL, through `profile/login/verify` with a `bio` or `iris` block.

[See the user journeyWhat the person experiences, screen by screen, before you write any code.](/docs/pr-46/docs/hiecm/v3/milestones/m1)[When it goes wrongThe recorded error shapes and codes, and what to do about each.](/docs/pr-46/docs/hiecm/v3/api/m1/errors)

New to this? Start with [M1 Identity](/docs/pr-46/docs/hiecm/v3/milestones/m1).
