# Scan and Pay

Open orders, patient selection and payment status between a facility and a PHR app.

## Postman collection

10 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-46/postman/hiecm-scan-and-pay.postman_collection.json)[Environment](/docs/pr-46/postman/hiecm-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-46/postman/hiecm-scan-and-pay.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose            | Environment | Base URL                   |
| ------------------ | ----------- | -------------------------- |
| Scan and Pay calls | Sandbox     | `https://dev.abdm.gov.in`  |
| Scan and Pay calls | Production  | `https://apis.abdm.gov.in` |

The full operation list is in the [Scan and Pay API reference](/docs/pr-46/reference/hiecm-scan-and-pay).

New to this? Start with [Scan and Pay](/docs/pr-46/docs/hiecm/v3/use-cases/scan-and-pay).
