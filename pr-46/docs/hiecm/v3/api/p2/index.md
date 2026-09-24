# P2 Consents Management

Manage the PHR profile, link an ABHA number, switch profiles, and handle linking, sharing and consent for the patient.

## Postman collection

42 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-46/postman/hiecm-p2.postman_collection.json)[Environment](/docs/pr-46/postman/hiecm-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-46/postman/hiecm-p2.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose                            | Environment | Base URL                                          |
| ---------------------------------- | ----------- | ------------------------------------------------- |
| Profile and link ABHA number calls | Sandbox     | `https://abhasbx.abdm.gov.in/abha/api/v3/phr/app` |
| Linking, sharing and consent calls | Sandbox     | `https://dev.abdm.gov.in`                         |

The full operation list is in the [P2 Consents Management API reference](/docs/pr-46/reference/hiecm-p2).

New to this? Start with [P2 Linking and records](/docs/pr-46/docs/hiecm/v3/milestones/p2).
