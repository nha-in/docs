# Scan and Register

Receive the profile a patient shares by scanning the counter QR code, and hand back a queue token.

## Postman collection

1 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-50/postman/hiecm-scan-and-register.postman_collection.json)[Environment](/docs/pr-50/postman/hiecm-sandbox.postman_environment.json)[Run in Postman](https://app.getpostman.com/run-collection/58494529-d99fa36c-3466-4fdb-a386-08f2f9616573?action=collection%2Ffork\&collection-url=entityId%3D58494529-d99fa36c-3466-4fdb-a386-08f2f9616573%26entityType%3Dcollection%26workspaceId%3D87d6429f-b4ee-4ec4-ac5d-5e6e5700b974)

`https://nha-in.github.io/docs/pr-50/postman/hiecm-scan-and-register.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose                 | Environment | Base URL                   |
| ----------------------- | ----------- | -------------------------- |
| Scan and Register calls | Sandbox     | `https://dev.abdm.gov.in`  |
| Scan and Register calls | Production  | `https://apis.abdm.gov.in` |

The full operation list is in the [Scan and Register API reference](/docs/pr-50/reference/hiecm-scan-and-register).

New to this? Start with [Scan and Register](/docs/pr-50/docs/hiecm/v3/use-cases/scan-and-register).
