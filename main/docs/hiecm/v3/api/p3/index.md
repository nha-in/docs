# P3 Subscription

Read, approve, deny, enable, disable and update the patient's subscriptions and subscription requests, and the subscription request and notifications they answer.

## Postman collection

11 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/main/postman/hiecm-p3.postman_collection.json)[Environment](/docs/main/postman/hiecm-sandbox.postman_environment.json)[Run in Postman](https://app.getpostman.com/run-collection/58494529-0458309b-11cc-4164-9bdf-9f88424d685b?action=collection%2Ffork\&collection-url=entityId%3D58494529-0458309b-11cc-4164-9bdf-9f88424d685b%26entityType%3Dcollection%26workspaceId%3D87d6429f-b4ee-4ec4-ac5d-5e6e5700b974)

`https://nha-in.github.io/docs/main/postman/hiecm-p3.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose            | Environment | Base URL                  |
| ------------------ | ----------- | ------------------------- |
| Subscription calls | Sandbox     | `https://dev.abdm.gov.in` |

The full operation list is in the [P3 Subscription API reference](/docs/main/reference/hiecm-p3).

New to this? Start with [P3 Consent and notifications](/docs/main/docs/hiecm/v3/milestones/p3).
