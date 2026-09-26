# Milestone 4 (M4): Register Healthcare Professionals and Facilities

Register a healthcare professional on the HPR, onboard a facility to the HFR, and link the facility to its bridges.

## Postman collection

87 requests in the order you build them, and a sandbox environment to fill in. Each step keeps the txnId and X-token it gets back for the steps after it.

[Collection](/docs/pr-50/postman/hiecm-m4.postman_collection.json)[Environment](/docs/pr-50/postman/hiecm-sandbox.postman_environment.json)[Run in Postman](https://app.getpostman.com/run-collection/58494529-0d03a8e1-0ca2-44c6-b831-4ee0d6533f4b?action=collection%2Ffork\&collection-url=entityId%3D58494529-0d03a8e1-0ca2-44c6-b831-4ee0d6533f4b%26entityType%3Dcollection%26workspaceId%3D87d6429f-b4ee-4ec4-ac5d-5e6e5700b974)

`https://nha-in.github.io/docs/pr-50/postman/hiecm-m4.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## Base URLs

| Purpose           | Environment | Base URL                                |
| ----------------- | ----------- | --------------------------------------- |
| HPR and HFR calls | Sandbox     | `https://apihspsbx.abdm.gov.in/v4/int/` |

The full operation list is in the [M4 API reference](/docs/pr-50/reference/hiecm-m4).

New to this? Start with [M4 Registry Integration](/docs/pr-50/docs/hiecm/v3/milestones/m4).
