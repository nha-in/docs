# P1 Registration and login

Create an ABHA address in a PHR app and log in to it.

## Postman collection

42 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-46/postman/hiecm-p1.postman_collection.json)[Environment](/docs/pr-46/postman/hiecm-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-46/postman/hiecm-p1.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose                               | Environment | Base URL                                          |
| ------------------------------------- | ----------- | ------------------------------------------------- |
| PHR application calls                 | Sandbox     | `https://abhasbx.abdm.gov.in/abha/api/v3/phr/app` |
| Aadhaar flow, creating an ABHA number | Sandbox     | `https://abhasbx.abdm.gov.in/abha/api/v3/`        |
| Session token                         | Sandbox     | `https://dev.abdm.gov.in`                         |

The full operation list is in the [P1 Registration and login API reference](/docs/pr-46/reference/hiecm-p1).

New to this? Start with [P1 Identity and login](/docs/pr-46/docs/hiecm/v3/milestones/p1).
