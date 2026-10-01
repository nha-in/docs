# NOTTO

Find hospitals registered with NOTTO for an organ or tissue. The [EUA](/docs/pr-95/docs/uhi/v1/getting-started/glossary#eua) sends one search through the [UHI Gateway](/docs/pr-95/docs/uhi/v1/getting-started/glossary#uhi-gateway), and the NOTTO [HSPA](/docs/pr-95/docs/uhi/v1/getting-started/glossary#hspa) answers with the hospitals in `on_search`. Discovery only: the patient contacts the hospital.

## Postman collection

5 requests in the order you build them, and a sandbox environment to fill in. Sign each body with the Header Generation Utility and paste the header before you send.

[Collection](/docs/pr-95/postman/uhi-notto.postman_collection.json)[Environment](/docs/pr-95/postman/uhi-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-95/postman/uhi-notto.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## What it holds

| Call                         | Served by   | What it does                                      |
| ---------------------------- | ----------- | ------------------------------------------------- |
| `POST /api/v1/uhi/search`    | UHI Gateway | Takes the EUA's search and passes it to the HSPA  |
| `POST /search`               | HSPA        | Receives the search the Gateway forwards          |
| `POST /api/v1/uhi/on_search` | UHI Gateway | Takes the HSPA's catalog and passes it to the EUA |
| `POST /on_search`            | EUA         | Receives the catalog at its `consumer_uri`        |

Every NOTTO call uses `context.domain` `nic2004:86100`, `fulfillment.type` `NOTTO_HOSPITAL` and item code `NOTTO`.

## Journey

| Journey                                                                                                           | What it covers                                                                 |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [NOTTO hospital discovery](/docs/pr-95/docs/uhi/v1/api/network/endpoints/uhi-notto/01-uhi-network-gateway-search) | The Gateway search for an organ or tissue, and the `on_search` that answers it |

Sign every call first. See [Signing](/docs/pr-95/docs/uhi/v1/concepts/signing).

## Pairs with

- [Look up a network participant](/docs/pr-95/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) returns the public key you check the HSPA's signature with.
- [Routes](/docs/pr-95/docs/uhi/v1/concepts/routes) shows which calls go through the Gateway.

New to this? Start with [NOTTO](/docs/pr-95/docs/uhi/v1/services/notto).
