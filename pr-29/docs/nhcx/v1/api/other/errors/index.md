# Other errors

A Other code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                            |
| ----------- | ------------------------------------------------------------------------ |
| `NHCX-401`  | The exchange does not accept your authorisation for this call            |
| `NHCX-1001` | The recipient's system is not reachable                                  |
| `NHCX-1002` | The sender is not a registered participant                               |
| `NHCX-1003` | The recipient is not a registered participant                            |
| `NHCX-1004` | No recipient is registered for the scheme you asked for                  |
| `NHCX-1005` | A request header is missing or not valid                                 |
| `NHCX-1006` | The correlation id has already been used                                 |
| `NHCX-1007` | The exchange could not process the request's structure or values         |
| `NHCX-1008` | The exchange had a temporary failure                                     |
| `NHCX-1009` | The exchange failed and recorded the cause in its own logs               |
| `NHCX-1010` | No request matches the correlation id on your answer                     |
| `NHCX-1011` | The x-hcx-status value is not valid                                      |
| `NHCX-1012` | No message matches the api\_call\_id you gave                            |
| `NHCX-1013` | The request body is empty or not valid                                   |
| `NHCX-1014` | The exchange could not deliver the response to its sender                |
| `NHCX-1016` | The call does not fit the exchange open on this correlation id           |
| `NHCX-1017` | The recipient answered a delivery in a form the exchange does not accept |
| `NHCX-1018` | The ABHA number is not in the XX-XXXX-XXXX-XXXX form                     |
| `PAYR-1516` | The payer cannot match your error response to any message                |
| `PAYR-1517` | Your error was sent encrypted instead of as a protocol response          |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-29/docs/nhcx/v1/reference/pmjay-error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-29/docs/support)
