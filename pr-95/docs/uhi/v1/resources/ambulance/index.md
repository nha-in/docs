# Ambulance Booking test cases

Your [Ambulance Booking](/docs/pr-95/docs/uhi/v1/services/ambulance) integration is certified against these cases. Each one is stated twice: what it means in plain words, and the exact condition that passes it. Cases in categories A to D and F apply to the calls between an [EUA](/docs/pr-95/docs/uhi/v1/getting-started/glossary#eua) and an [HSPA](/docs/pr-95/docs/uhi/v1/getting-started/glossary#hspa). Category E applies to the EUA's screens.

## A. Context

| ID       | In plain words                                                 | Passes when                                                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AMB-A-01 | A search carries every context field the network needs.        | A `search` with `domain`, `country`, `action`, `core_version`, `consumer_id`, `consumer_uri`, `message_id`, `timestamp` and `transaction_id`, all correctly valued, gets an ACK from the Gateway and is forwarded to HSPAs. |
| AMB-A-02 | A search with no callback address is refused.                  | A `search` without `consumer_uri` gets a NACK from the Gateway with an error code.                                                                                                                                          |
| AMB-A-03 | The EUA catches a quote that belongs to another transaction.   | An `on_init` whose `transaction_id` differs from the originating `init` is rejected or flagged as mismatched by the EUA.                                                                                                    |
| AMB-A-04 | The EUA sends `init` to the provider that answered the search. | An `init` carrying `provider_id` and `provider_uri` from `on_search` reaches the HSPA, which returns ACK.                                                                                                                   |

## B. Search filters

| ID       | In plain words                                                                                                          | Passes when                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| AMB-B-01 | An emergency search with only a pickup location gets answers.                                                           | An `EMERGENCY` search with `SOURCE` and no `DESTINATION` gets an `on_search` catalog of type `EMERGENCY`.           |
| AMB-B-02 | A non-emergency search with pickup and drop-off gets answers. Applies once non-emergency search is part of the service. | A `NON_EMERGENCY` search with `SOURCE` and `DESTINATION` gets an `on_search` catalog of type `NON_EMERGENCY`.       |
| AMB-B-03 | A non-emergency search without a drop-off is refused. Applies once non-emergency search is part of the service.         | A `NON_EMERGENCY` search with `SOURCE` only gets a NACK from the Gateway or the HSPA for the missing `DESTINATION`. |
| AMB-B-04 | Asking for one class returns only that class.                                                                           | A search with category code `ALS` gets an `on_search` catalog holding only `ALS` fulfillments.                      |
| AMB-B-05 | Asking for all classes returns every class.                                                                             | A search with no category code, or `ALL`, gets an `on_search` catalog holding every available fulfillment type.     |
| AMB-B-06 | Requested extra services show up in the answer.                                                                         | A search with the `additional_services` tag gets fulfillments that include or acknowledge `additional_services`.    |

## C. on\_search response

| ID       | In plain words                                          | Passes when                                                                                                |
| -------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| AMB-C-01 | Every ambulance has its own id and the right case type. | Every fulfillment in `on_search` has a unique `id` and the correct `type`, `EMERGENCY` or `NON_EMERGENCY`. |
| AMB-C-02 | Every price points at a real ambulance.                 | Every `items[].fulfillment_id` matches a fulfillment `id` in the same provider block.                      |
| AMB-C-03 | The answer is for the case type that was asked.         | `fulfillment.type` in `on_search` equals the type sent in the `search`.                                    |
| AMB-C-04 | No driver or vehicle details come back with the search. | No `on_search` fulfillment contains an `agent` block.                                                      |
| AMB-C-05 | The answer belongs to the search that asked for it.     | `transaction_id` in `on_search` equals the one in the `search`.                                            |

## D. init and on\_init

| ID       | In plain words                                               | Passes when                                                                                                          |
| -------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| AMB-D-01 | The EUA can start an order for an ambulance the HSPA listed. | An `init` naming an `item.id` and `fulfillment_id` from the prior `on_search` gets an ACK, then an `on_init`.        |
| AMB-D-02 | The quote carries an order id.                               | `on_init` contains a non-empty, unique `order.id`.                                                                   |
| AMB-D-03 | The quote is itemised.                                       | `on_init` has a `quote.breakup` with at least one entry that has a title and a price.                                |
| AMB-D-04 | All five terms come back for review.                         | `on_init` carries Commercial, Settlement, Cancellation, Refund and Payment terms, each with `termsState: INITIATED`. |
| AMB-D-05 | No driver or vehicle details come back with the quote.       | `on_init` holds no driver name, vehicle number or agent phone.                                                       |
| AMB-D-06 | The quote keeps the locations the EUA sent.                  | The locations in `on_init` match the `SOURCE` and `DESTINATION` sent in `init`.                                      |
| AMB-D-07 | The HSPA accepts the patient identified by ABHA address.     | An `init` with `customer.id` as an ABHA address is accepted and processed, and `on_init` is returned.                |

## E. EUA screens

| ID       | In plain words                                   | Passes when                                                                                                             |
| -------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| AMB-E-01 | The user sees who runs each ambulance.           | The HSPA name and logo from `catalog.descriptor` appear in the search results whenever the response carries them.       |
| AMB-E-02 | The user sees when each ambulance should arrive. | Each ambulance shows its arrival window from `fulfillment.start` and `fulfillment.end`.                                 |
| AMB-E-03 | The user sees a price before choosing.           | Each listing shows `item.price.value` before the user selects an option.                                                |
| AMB-E-04 | The user reads the terms before going further.   | The full `on_init` terms, cancellation and payment, are on screen, and the confirm action is enabled only after review. |
| AMB-E-05 | The user never sees driver or vehicle details.   | No search, listing or `init` review screen shows driver or vehicle details.                                             |

## F. Edge cases

| ID       | In plain words                       | Passes when                                                                                                                    |
| -------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| AMB-F-01 | Nobody answers the search.           | When no HSPA responds within the expected window, the EUA shows the user an appropriate message for the empty result.          |
| AMB-F-02 | An HSPA answers with no ambulances.  | An `on_search` with an empty `providers` array causes no crash and no display error in the EUA.                                |
| AMB-F-03 | The same search is sent twice.       | A second `search` with the same `transaction_id` is deduplicated by the Gateway or ignored by the HSPA.                        |
| AMB-F-04 | The provider wants money in advance. | An `on_init` with `payment.type: PRE-ORDER` and a non-zero `minimum_Value` makes the EUA show the advance payment requirement. |

## Next steps

- [Ambulance Booking](/docs/pr-95/docs/uhi/v1/services/ambulance): the flow these test cases cover.
- [Errors on UHI](/docs/pr-95/docs/uhi/v1/concepts/errors): what to log when a test case fails.
- [Record a demo and request sign-off](/docs/pr-95/docs/uhi/v1/getting-started/going-live#2-record-a-demo-and-request-sign-off): the onboarding step that follows your test cases.
