# M2 Health Information Provider: Creation, Linking and Sharing of Health Records

Link care contexts to a patient's ABHA address, answer discovery requests, and share encrypted health records with consent.

## Postman collection

10 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-122/postman/hiecm-m2.postman_collection.json)[Environment](/docs/pr-122/postman/hiecm-sandbox.postman_environment.json)[Run in Postman](https://app.getpostman.com/run-collection/58494529-3172beba-9db5-48e7-bb04-4a35d797447a?action=collection%2Ffork\&collection-url=entityId%3D58494529-3172beba-9db5-48e7-bb04-4a35d797447a%26entityType%3Dcollection%26workspaceId%3D87d6429f-b4ee-4ec4-ac5d-5e6e5700b974)

`https://nha-in.github.io/docs/pr-122/postman/hiecm-m2.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Environment | Base URL                   |
| ----------- | -------------------------- |
| Sandbox     | `https://dev.abdm.gov.in`  |
| Production  | `https://apis.abdm.gov.in` |

New to this? Start with [M2 Health Information Provider](/docs/pr-122/docs/hiecm/v3/milestones/m2).

The cases M2 is tested against: [M2 test cases](/docs/pr-122/docs/hiecm/v3/resources/test-cases/m2).
