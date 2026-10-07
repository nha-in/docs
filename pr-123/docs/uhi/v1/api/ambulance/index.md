# Ambulance Booking

Send a patient's details to the chosen ambulance provider and get a quote and terms back. Phase 1 covers discovery and the quote. The [EUA](/docs/pr-123/docs/uhi/v1/getting-started/glossary#eua) sends `init` directly to the [HSPA](/docs/pr-123/docs/uhi/v1/getting-started/glossary#hspa), and the HSPA answers with `on_init`.

## Postman collection

7 requests in the order you build them, and a sandbox environment to fill in. Sign each body with the Header Generation Utility and paste the header before you send.

[Collection](/docs/pr-123/postman/uhi-ambulance.postman_collection.json)[Environment](/docs/pr-123/postman/uhi-sandbox.postman_environment.json)

`https://nha-in.github.io/docs/pr-123/postman/uhi-ambulance.postman_collection.json`

Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.

## What it holds

| Call            | Served by | What it does                            |
| --------------- | --------- | --------------------------------------- |
| `POST /init`    | HSPA      | Takes the patient's details for a quote |
| `POST /on_init` | EUA       | Receives the quote and terms            |

Every Ambulance Booking call uses `context.domain` `nic2008:86909`.

## Journeys

| Journey                                                                                                             | What it covers                                           |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Discovery](/docs/pr-123/docs/uhi/v1/api/ambulance/endpoints/uhi-ambulance-discovery/01-uhi-network-gateway-search) | The Gateway search for ambulances near a pickup location |
| [Order](/docs/pr-123/docs/uhi/v1/api/ambulance/endpoints/uhi-ambulance-order/01-uhi-ambulance-init)                 | `init` and `on_init`, direct between EUA and HSPA        |

Sign every call first. See [Signing](/docs/pr-123/docs/uhi/v1/concepts/signing).

## Pairs with

- [Look up a network participant](/docs/pr-123/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) returns the HSPA's public key, which you need before `init`.
- [Routes](/docs/pr-123/docs/uhi/v1/concepts/routes) shows which calls go through the Gateway and which go direct.

New to this? Start with [Ambulance Booking](/docs/pr-123/docs/uhi/v1/services/ambulance).
