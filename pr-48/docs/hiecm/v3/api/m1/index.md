# M1 Identity: Create and verify ABHA

Create an ABHA, authenticate a holder, and read or update the profile, QR code and linked mobile number.

## Postman collection

122 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-48/postman/hiecm-m1.postman_collection.json)[Environment](/docs/pr-48/postman/hiecm-sandbox.postman_environment.json)[Run in Postman](https://app.getpostman.com/run-collection/58494529-812374a9-3b91-42a0-8cbc-f86a31e0e688?action=collection%2Ffork\&collection-url=entityId%3D58494529-812374a9-3b91-42a0-8cbc-f86a31e0e688%26entityType%3Dcollection%26workspaceId%3D87d6429f-b4ee-4ec4-ac5d-5e6e5700b974)

`https://nha-in.github.io/docs/pr-48/postman/hiecm-m1.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Environment | Base URL                                   |
| ----------- | ------------------------------------------ |
| Sandbox     | `https://abhasbx.abdm.gov.in/abha/api/v3/` |

Login by fingerprint or iris uses the v3.1 path, `/abha/api/v3.1/profile/login/verify`, with a `bio` or `iris` block.

[See the user journeyWhat the person experiences, screen by screen, before you write any code.](/docs/pr-48/docs/hiecm/v3/milestones/m1)[When it goes wrongThe recorded error shapes and codes, and what to do about each.](/docs/pr-48/docs/hiecm/v3/api/m1/errors)

New to this? Start with [M1 Identity](/docs/pr-48/docs/hiecm/v3/milestones/m1).
