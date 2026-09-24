# M2 Health Information Provider: Create and link records

Link care contexts to a patient's ABHA address, answer discovery requests, and share encrypted health records with consent.

## Postman collection

10 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-46/postman/hiecm-m2.postman_collection.json)[Environment](/docs/pr-46/postman/hiecm-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-46/postman/hiecm-m2.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Environment | Base URL                   |
| ----------- | -------------------------- |
| Sandbox     | `https://dev.abdm.gov.in`  |
| Production  | `https://apis.abdm.gov.in` |

The full operation list is in the [M2 API reference](/docs/pr-46/reference/hiecm-m2).

New to this? Start with [M2 Health Information Provider](/docs/pr-46/docs/hiecm/v3/milestones/m2).
