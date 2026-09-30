# Blood Bank

Find blood in stock by group and component. The [EUA](/docs/pr-88/docs/uhi/v1/getting-started/glossary#eua) sends one search through the [UHI Gateway](/docs/pr-88/docs/uhi/v1/getting-started/glossary#uhi-gateway), and every registered blood bank [HSPA](/docs/pr-88/docs/uhi/v1/getting-started/glossary#hspa) answers with its own `on_search`. Discovery only: the patient contacts the blood bank.

## Postman collection

5 requests in the order you build them, and a sandbox environment to fill in. Sign each body with the Header Generation Utility and paste the header before you send.

[Collection](/docs/pr-88/postman/uhi-blood-bank.postman_collection.json)[Environment](/docs/pr-88/postman/uhi-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-88/postman/uhi-blood-bank.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## What it holds

| Call                         | Served by   | What it does                                      |
| ---------------------------- | ----------- | ------------------------------------------------- |
| `POST /api/v1/uhi/search`    | UHI Gateway | Takes the EUA's search and passes it to the HSPA  |
| `POST /search`               | HSPA        | Receives the search the Gateway forwards          |
| `POST /api/v1/uhi/on_search` | UHI Gateway | Takes the HSPA's catalog and passes it to the EUA |
| `POST /on_search`            | EUA         | Receives the catalog at its `consumer_uri`        |

Every Blood Bank call uses `context.domain` `nic2008:86906` and `fulfillment.type` `BloodStock`.

## Journey

| Journey                                                                                                             | What it covers                                                                                |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Blood stock discovery](/docs/pr-88/docs/uhi/v1/api/network/endpoints/uhi-blood-bank/01-uhi-network-gateway-search) | The Gateway search for a blood group and component, and the `on_search` each blood bank sends |

Sign every call first. See [Signing](/docs/pr-88/docs/uhi/v1/concepts/signing).

## Pairs with

- [Look up a network participant](/docs/pr-88/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) returns the public key you check the HSPA's signature with.
- [Routes](/docs/pr-88/docs/uhi/v1/concepts/routes) shows which calls go through the Gateway.

New to this? Start with [Blood Bank](/docs/pr-88/docs/uhi/v1/services/blood-bank).
