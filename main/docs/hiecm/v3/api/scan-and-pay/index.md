# Scan and Pay

Open orders, patient selection and payment status between a facility and a PHR app.

## Postman collection

10 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/main/postman/hiecm-scan-and-pay.postman_collection.json)[Environment](/docs/main/postman/hiecm-sandbox.postman_environment.json)[Run in Postman](https://app.getpostman.com/run-collection/58494529-0a952d0e-6672-42bc-aa0d-d8db1ae4a10b?action=collection%2Ffork\&collection-url=entityId%3D58494529-0a952d0e-6672-42bc-aa0d-d8db1ae4a10b%26entityType%3Dcollection%26workspaceId%3D87d6429f-b4ee-4ec4-ac5d-5e6e5700b974)

`https://nha-in.github.io/docs/main/postman/hiecm-scan-and-pay.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose            | Environment | Base URL                   |
| ------------------ | ----------- | -------------------------- |
| Scan and Pay calls | Sandbox     | `https://dev.abdm.gov.in`  |
| Scan and Pay calls | Production  | `https://apis.abdm.gov.in` |

The full operation list is in the [Scan and Pay API reference](/docs/main/reference/hiecm-scan-and-pay).

New to this? Start with [Scan and Pay](/docs/main/docs/hiecm/v3/use-cases/scan-and-pay).
