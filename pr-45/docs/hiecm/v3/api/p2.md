# P2 Consents Management

Manage the PHR profile, link an ABHA number, switch profiles, and handle linking, sharing and consent for the patient.

## Postman collection

42 requests in the order you build them, and a sandbox environment to fill in.

[Collection](/docs/pr-45/postman/hiecm-p2.postman_collection.json)[Environment](/docs/pr-45/postman/hiecm-sandbox.postman_environment.json)[Run in Postman](https://app.getpostman.com/run-collection/58494529-de92c2ee-a243-4dda-8c32-52d76fe8087d?action=collection%2Ffork\&collection-url=entityId%3D58494529-de92c2ee-a243-4dda-8c32-52d76fe8087d%26entityType%3Dcollection%26workspaceId%3D87d6429f-b4ee-4ec4-ac5d-5e6e5700b974)

`https://nha-in.github.io/docs/pr-45/postman/hiecm-p2.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose                            | Environment | Base URL                                          |
| ---------------------------------- | ----------- | ------------------------------------------------- |
| Profile and link ABHA number calls | Sandbox     | `https://abhasbx.abdm.gov.in/abha/api/v3/phr/app` |
| Linking, sharing and consent calls | Sandbox     | `https://dev.abdm.gov.in`                         |

The full operation list is in the [P2 Consents Management API reference](/docs/pr-45/reference/hiecm-p2).

New to this? Start with [P2 Linking and records](/docs/pr-45/docs/hiecm/v3/milestones/p2).
