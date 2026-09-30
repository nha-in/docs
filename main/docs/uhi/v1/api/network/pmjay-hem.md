# PM-JAY HEM

Find hospitals empanelled under PM-JAY. The [EUA](/docs/main/docs/uhi/v1/getting-started/glossary#eua) sends one search through the [UHI Gateway](/docs/main/docs/uhi/v1/getting-started/glossary#uhi-gateway), and the PM-JAY HEM [HSPA](/docs/main/docs/uhi/v1/getting-started/glossary#hspa) answers with the hospitals in one `on_search`. Discovery only: the patient calls or visits the hospital.

## Postman collection

5 requests in the order you build them, and a sandbox environment to fill in. Sign each body with the Header Generation Utility and paste the header before you send.

[Collection](/docs/main/postman/uhi-pmjay-hem.postman_collection.json)[Environment](/docs/main/postman/uhi-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/main/postman/uhi-pmjay-hem.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## What it holds

| Call                         | Served by   | What it does                                      |
| ---------------------------- | ----------- | ------------------------------------------------- |
| `POST /api/v1/uhi/search`    | UHI Gateway | Takes the EUA's search and passes it to the HSPA  |
| `POST /search`               | HSPA        | Receives the search the Gateway forwards          |
| `POST /api/v1/uhi/on_search` | UHI Gateway | Takes the HSPA's catalog and passes it to the EUA |
| `POST /on_search`            | EUA         | Receives the catalog at its `consumer_uri`        |

Every PM-JAY HEM call uses `context.domain` `nic2004:85112`, `fulfillment.type` `PMJAYHEM` and item code `PMJAY`.

## Journey

| Journey                                                                                                                   | What it covers                                                                       |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [PM-JAY HEM hospital discovery](/docs/main/docs/uhi/v1/api/network/endpoints/uhi-pmjay-hem/01-uhi-network-gateway-search) | The Gateway search for empanelled hospitals, and the one `on_search` that answers it |

Sign every call first. See [Signing](/docs/main/docs/uhi/v1/concepts/signing).

## Pairs with

- [Look up a network participant](/docs/main/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) returns the public key you check the HSPA's signature with.
- [Routes](/docs/main/docs/uhi/v1/concepts/routes) shows which calls go through the Gateway.

New to this? Start with [PM-JAY HEM](/docs/main/docs/uhi/v1/services/pmjay-hem).
