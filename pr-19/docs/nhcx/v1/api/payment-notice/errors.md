# Payment notice errors

A Payment notice code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                                                       | Arrives on                  |
| ----------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| `PAYR-1020` | The payer holds no valid bank details for your facility, or a supporting info category is not valid | `/v1/paymentnotice/request` |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-19/docs/nhcx/v1/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-19/docs/support)
