# P4 Locker

Set up a health locker and list the lockers and requests on an ABHA address.

## Postman collection

5 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-46/postman/hiecm-p4.postman_collection.json)[Environment](/docs/pr-46/postman/hiecm-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-46/postman/hiecm-p4.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose             | Environment | Base URL                  |
| ------------------- | ----------- | ------------------------- |
| Health locker calls | Sandbox     | `https://dev.abdm.gov.in` |

The full operation list is in the [P4 Locker API reference](/docs/pr-46/reference/hiecm-p4).

New to this? Start with [Personal Health Record (PHR) Application](/docs/pr-46/docs/hiecm/v3/concepts/participants/phr).
