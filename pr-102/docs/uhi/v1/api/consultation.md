# Physical Consultation

Book, fulfil and cancel a physical consultation. After discovery, the [EUA](/docs/pr-102/docs/uhi/v1/getting-started/glossary#eua) and the [HSPA](/docs/pr-102/docs/uhi/v1/getting-started/glossary#hspa) call each other directly. The HSPA sends the [UHI Gateway](/docs/pr-102/docs/uhi/v1/getting-started/glossary#uhi-gateway) an [audit copy](/docs/pr-102/docs/uhi/v1/getting-started/glossary#audit-copy) of each callback that changes an order.

## Postman collection

23 requests in the order you build them, and a sandbox environment to fill in. Sign each body with the Header Generation Utility and paste the header before you send.

[Collection](/docs/pr-102/postman/uhi-consultation.postman_collection.json)[Environment](/docs/pr-102/postman/uhi-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-102/postman/uhi-consultation.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## What it holds

| Stage           | Calls                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Order           | `init`, `on_init`, `confirm`, `on_confirm`                                                      |
| Fulfilment      | `status`, `on_status`, `on_update` in both directions                                           |
| Post-fulfilment | `cancel`, `on_cancel`, `on_message` in both directions                                          |
| Audit copies    | `on_confirm_audit`, `on_status_audit`, `on_update_audit`, `on_cancel_audit`, all at the Gateway |

The reference also carries `select` and `on_select`. They are not part of the Physical Consultation flow. Do not implement them: go from the second `on_search` straight to `init`.

## Journeys

| Journey                                                                                                                            | What it covers                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [Discovery](/docs/pr-102/docs/uhi/v1/api/consultation/endpoints/uhi-consultation-discovery/01-uhi-network-gateway-search)          | The Gateway search for doctors, then a direct second search to the chosen HSPA for slots |
| [Order](/docs/pr-102/docs/uhi/v1/api/consultation/endpoints/uhi-consultation-order/01-uhi-consultation-init)                       | `init` to `on_confirm`, and its audit copy                                               |
| [Fulfilment](/docs/pr-102/docs/uhi/v1/api/consultation/endpoints/uhi-consultation-fulfilment/01-uhi-consultation-status)           | Status and updates, and their audit copies                                               |
| [Post-fulfilment](/docs/pr-102/docs/uhi/v1/api/consultation/endpoints/uhi-consultation-post-fulfilment/01-uhi-consultation-cancel) | Cancellation and messages                                                                |

Sign every call first. See [Signing](/docs/pr-102/docs/uhi/v1/concepts/signing).

## Pairs with

- [Look up a network participant](/docs/pr-102/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) returns the HSPA's public key, which you need before `init`.
- [Routes](/docs/pr-102/docs/uhi/v1/concepts/routes) shows which calls go direct and where the audit copies go.

New to this? Start with [Physical Consultation](/docs/pr-102/docs/uhi/v1/services/consultation).
