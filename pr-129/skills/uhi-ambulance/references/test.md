# Test UHI Ambulance Booking

The checks this service is held to before go-live, then the steps to production. The full test case list is at /docs/uhi/v1/resources/ambulance.

## Ambulance Booking test cases for the context block

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-A-01 | A search carries every context field the network needs. | A `search` with `domain`, `country`, `action`, `core_version`, `consumer_id`, `consumer_uri`, `message_id`, `timestamp` and `transaction_id`, all correctly valued, gets an ACK from the Gateway and is forwarded to HSPAs. |
| AMB-A-02 | A search with no callback address is refused. | A `search` without `consumer_uri` gets a NACK from the Gateway with an error code. |
| AMB-A-03 | The EUA catches a quote that belongs to another transaction. | An `on_init` whose `transaction_id` differs from the originating `init` is rejected or flagged as mismatched by the EUA. |
| AMB-A-04 | The EUA sends `init` to the provider that answered the search. | An `init` carrying `provider_id` and `provider_uri` from `on_search` reaches the HSPA, which returns ACK. |

From `uhi.test.ambulance-context`.

## Ambulance Booking test cases for search filters

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-B-01 | An emergency search with only a pickup location gets answers. | An `EMERGENCY` search with `SOURCE` and no `DESTINATION` gets an `on_search` catalog of type `EMERGENCY`. |
| AMB-B-02 | A non-emergency search with pickup and drop-off gets answers. Applies once non-emergency search is part of the service. | A `NON_EMERGENCY` search with `SOURCE` and `DESTINATION` gets an `on_search` catalog of type `NON_EMERGENCY`. |
| AMB-B-03 | A non-emergency search without a drop-off is refused. Applies once non-emergency search is part of the service. | A `NON_EMERGENCY` search with `SOURCE` only gets a NACK from the Gateway or the HSPA for the missing `DESTINATION`. |
| AMB-B-04 | Asking for one class returns only that class. | A search with category code `ALS` gets an `on_search` catalog holding only `ALS` fulfillments. |
| AMB-B-05 | Asking for all classes returns every class. | A search with no category code, or `ALL`, gets an `on_search` catalog holding every available fulfillment type. |
| AMB-B-06 | Requested extra services show up in the answer. | A search with the `additional_services` tag gets fulfillments that include or acknowledge `additional_services`. |

From `uhi.test.ambulance-search-filters`.

## Ambulance Booking test cases for on_search

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-C-01 | Every ambulance has its own id and the right case type. | Every fulfillment in `on_search` has a unique `id` and the correct `type`, `EMERGENCY` or `NON_EMERGENCY`. |
| AMB-C-02 | Every price points at a real ambulance. | Every `items[].fulfillment_id` matches a fulfillment `id` in the same provider block. |
| AMB-C-03 | The answer is for the case type that was asked. | `fulfillment.type` in `on_search` equals the type sent in the `search`. |
| AMB-C-04 | No driver or vehicle details come back with the search. | No `on_search` fulfillment contains an `agent` block. |
| AMB-C-05 | The answer belongs to the search that asked for it. | `transaction_id` in `on_search` equals the one in the `search`. |

From `uhi.test.ambulance-on-search`.

## Ambulance Booking test cases for init and on_init

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-D-01 | The EUA can start an order for an ambulance the HSPA listed. | An `init` naming an `item.id` and `fulfillment_id` from the prior `on_search` gets an ACK, then an `on_init`. |
| AMB-D-02 | The quote carries an order id. | `on_init` contains a non-empty, unique `order.id`. |
| AMB-D-03 | The quote is itemised. | `on_init` has a `quote.breakup` with at least one entry that has a title and a price. |
| AMB-D-04 | All five terms come back for review. | `on_init` carries Commercial, Settlement, Cancellation, Refund and Payment terms, each with `termsState: INITIATED`. |
| AMB-D-05 | No driver or vehicle details come back with the quote. | `on_init` holds no driver name, vehicle number or agent phone. |
| AMB-D-06 | The quote keeps the locations the EUA sent. | The locations in `on_init` match the `SOURCE` and `DESTINATION` sent in `init`. |
| AMB-D-07 | The HSPA accepts the patient identified by ABHA address. | An `init` with `customer.id` as an ABHA address is accepted and processed, and `on_init` is returned. |

From `uhi.test.ambulance-init`.

## Ambulance Booking test cases for EUA screens

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-E-01 | The user sees who runs each ambulance. | The HSPA name and logo from `catalog.descriptor` appear in the search results whenever the response carries them. |
| AMB-E-02 | The user sees when each ambulance should arrive. | Each ambulance shows its arrival window from `fulfillment.start` and `fulfillment.end`. |
| AMB-E-03 | The user sees a price before choosing. | Each listing shows `item.price.value` before the user selects an option. |
| AMB-E-04 | The user reads the terms before going further. | The full `on_init` terms, cancellation and payment, are on screen, and the confirm action is enabled only after review. |
| AMB-E-05 | The user never sees driver or vehicle details. | No search, listing or `init` review screen shows driver or vehicle details. |

From `uhi.test.ambulance-eua-screens`.

## Ambulance Booking test cases for edge cases

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-F-01 | Nobody answers the search. | When no HSPA responds within the expected window, the EUA shows the user an appropriate message for the empty result. |
| AMB-F-02 | An HSPA answers with no ambulances. | An `on_search` with an empty `providers` array causes no crash and no display error in the EUA. |
| AMB-F-03 | The same search is sent twice. | A second `search` with the same `transaction_id` is deduplicated by the Gateway or ignored by the HSPA. |
| AMB-F-04 | The provider wants money in advance. | An `on_init` with `payment.type: PRE-ORDER` and a non-zero `minimum_Value` makes the EUA show the advance payment requirement. |

From `uhi.test.ambulance-edge-cases`.

## Go-live checks every UHI service carries

Each service's go-live checklist carries these items. Work through them before
you request sign-off.

| # | Item |
| --- | --- |
| 1 | For an [EUA](/docs/uhi/v1/getting-started/glossary#eua), [Milestone 2](/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) completed |
| 2 | Ed25519 key pair generated with the Header Generation Utility; public key submitted |
| 3 | Sandbox registration form completed and sandbox access received |
| 4 | HTTPS callback URL live and reachable from the public internet |
| 5 | Request signing implemented: Ed25519 and BLAKE-512 |
| 6 | Asynchronous answers handled. Nothing blocks on a synchronous reply to `search` |
| 7 | Every test case for your service passed in sandbox |
| 8 | Sign-off requested with sandbox test evidence |

[Physical Consultation](/docs/uhi/v1/services/consultation#go-live-checklist)
carries its full twenty item checklist.

### Before you start

Your service page, with its own test cases and go-live checklist, and your role for that service.

### What happens

Treat each row as a pass or fail item that needs evidence. Items 1 to 4 are set up before you build. Items 5 and 6 live in your code. Items 7 and 8 close the list.

### How you know it worked

Each row has evidence: the Milestone 2 completion, the submitted public key, the sandbox access, a callback received on your public HTTPS URL, a signed call that is not refused, and every test case passed.

### When it goes wrong

An EUA without Milestone 2 cannot be onboarded onto any service, so item 1 blocks the rest. A callback URL reachable only inside your network fails item 4. A handler that waits on the reply to `search` for results fails item 6. For Physical Consultation, pass its twenty item list as well.

From `uhi.test.every-service-checks`.

## Run your UHI service's test cases

Build against the sample payloads on your service's page and the
[UHI API reference](/docs/uhi/v1/api). Then run every test case for that
service in the sandbox.

| Service | Test cases |
| --- | --- |
| [Physical Consultation](/docs/uhi/v1/services/consultation) | [Physical Consultation test cases](/docs/uhi/v1/resources/consultation) |
| [PM-JAY HEM](/docs/uhi/v1/services/pmjay-hem) | [PM-JAY HEM test cases](/docs/uhi/v1/resources/pmjay-hem) |
| [Blood Bank](/docs/uhi/v1/services/blood-bank) | [Blood Bank test cases](/docs/uhi/v1/resources/blood-bank) |
| [Ambulance Booking](/docs/uhi/v1/services/ambulance) | [Ambulance Booking test cases](/docs/uhi/v1/resources/ambulance) |
| [Jan Aushadhi](/docs/uhi/v1/services/jan-aushadhi) | [Jan Aushadhi test cases](/docs/uhi/v1/resources/jan-aushadhi) |
| [NOTTO](/docs/uhi/v1/services/notto) | [NOTTO test cases](/docs/uhi/v1/resources/notto) |

[Build it well](/docs/uhi/v1/getting-started/build-it-well#checked-for-every-service)
lists what every service is checked against.

**You get:** a passing sandbox integration.

### How you know it worked

Every test case on your service's test case page passes in the sandbox, along with the checks every service shares. Request sign-off only after that.

From `uhi.test.run-test-cases`.

## Record a demo and request UHI sign-off

Record your app running the service's flow, and send it to your
[NHA](/docs/uhi/v1/getting-started/glossary#nha) point of contact with a
request for sign-off.

The [recorded walkthroughs of UHI services in Aarogya Setu](https://drive.google.com/drive/folders/1JvlWPouPNlyfLT3RmsjuUzeAVkdhlKrD?usp=drive_link)
show each service running end to end. Watch the one for your service before
you build your [EUA](/docs/uhi/v1/getting-started/glossary#eua) screens. Your
sign-off demo follows the same flow.

**You get:** written sign-off.

### Before you start

Every test case for your service passes in the sandbox, and you have watched the recorded walkthrough for your service.

### How you know it worked

You hold written sign-off from your NHA point of contact. Do not switch to production values without it.

From `uhi.sandbox.demo-sign-off`.

## Switch your UHI integration to production

Change the IDs and callback URL your calls carry.

| Your role | Switch to production values |
| --- | --- |
| EUA | `consumer_id` and [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | `provider_id` and [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri) |

Then point your calls at the production
[UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway).

| Environment | UHI Gateway base URL |
| --- | --- |
| Sandbox | `https://uhigatewaysandbox.abdm.gov.in` |
| Production | `https://uhigateway.abdm.gov.in` |

In production you use your own endpoints, not the sandbox reference apps.

**You get:** a live integration on the production network.

### Before you start

You hold written sign-off from step 2.

### How you know it worked

A search sent to `https://uhigateway.abdm.gov.in` returns `200` with an `ACK`, and the answer arrives on your production callback URL, matched by `transaction_id`.

From `uhi.sandbox.production-switch`.

## When a UHI search fails after the switch to production

If a search that worked in the sandbox fails in production, check the Gateway
host first, then `consumer_id` and `consumer_uri` or their HSPA equivalents. A
`401` or `403` comes before any body: see
[Errors on UHI](/docs/uhi/v1/concepts/errors#http-statuses-before-the-body).

### What happens

A search that worked in the sandbox fails after the switch to production. Either a value still points at the sandbox, or the Gateway rejects the signature or the registration before it reads the body.

### When it goes wrong

Check in this order and stop at the first that fails. The host is `https://uhigateway.abdm.gov.in`, not `https://uhigatewaysandbox.abdm.gov.in`. An EUA sends production values in `consumer_id` and `consumer_uri`; an HSPA in `provider_id` and `provider_uri`. A `401` means the signature does not match the body sent, is reused or expired, or names the wrong key. A `403` means the public key is not registered or the registration is not yet active.

From `uhi.troubleshooting.go-live`.
