# Jan Aushadhi

Find Jan Aushadhi Kendras and generic medicines. The [EUA](/docs/pr-90/docs/uhi/v1/getting-started/glossary#eua) searches through the [UHI Gateway](/docs/pr-90/docs/uhi/v1/getting-started/glossary#uhi-gateway), and the PMBI [HSPA](/docs/pr-90/docs/uhi/v1/getting-started/glossary#hspa) answers with `on_search`. Three flows share one domain: find a Kendra, find a medicine, then find the Kendras that stock it.

## Postman collection

13 requests in the order you build them, and a sandbox environment to fill in. Sign each body with the Header Generation Utility and paste the header before you send.

[Collection](/docs/pr-90/postman/uhi-jan-aushadhi.postman_collection.json)[Environment](/docs/pr-90/postman/uhi-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-90/postman/uhi-jan-aushadhi.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## What it holds

| Call                         | Served by   | What it does                                      |
| ---------------------------- | ----------- | ------------------------------------------------- |
| `POST /api/v1/uhi/search`    | UHI Gateway | Takes the EUA's search and passes it to the HSPA  |
| `POST /search`               | HSPA        | Receives the search the Gateway forwards          |
| `POST /api/v1/uhi/on_search` | UHI Gateway | Takes the HSPA's catalog and passes it to the EUA |
| `POST /on_search`            | EUA         | Receives the catalog at its `consumer_uri`        |

Every Jan Aushadhi call uses `context.domain` `nic2008:47721`. The flow is set by `fulfillment.type`: `JANAUSHADHI`, `JANAUSHADHI_MEDICINE` or `JANAUSHADHI_KENDRA`.

## Journeys

| Journey                                                                                                                                        | What it covers                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Kendra search](/docs/pr-90/docs/uhi/v1/api/network/endpoints/uhi-jan-aushadhi-kendra-search/01-uhi-network-gateway-search)                    | Find Kendras near a location or in a district                          |
| [Medicine search](/docs/pr-90/docs/uhi/v1/api/network/endpoints/uhi-jan-aushadhi-medicine-search/01-uhi-network-gateway-search)                | Find a generic medicine by name                                        |
| [Kendras for a selected medicine](/docs/pr-90/docs/uhi/v1/api/network/endpoints/uhi-jan-aushadhi-medicine-stock/01-uhi-network-gateway-search) | Find the Kendras that stock the medicine chosen in the medicine search |

Sign every call first. See [Signing](/docs/pr-90/docs/uhi/v1/concepts/signing).

## Pairs with

- [Look up a network participant](/docs/pr-90/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) returns the public key you check the HSPA's signature with.
- [Routes](/docs/pr-90/docs/uhi/v1/concepts/routes) shows which calls go through the Gateway.

New to this? Start with [Jan Aushadhi](/docs/pr-90/docs/uhi/v1/services/jan-aushadhi).
