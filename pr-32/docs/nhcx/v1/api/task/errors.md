# Reprocess, cancel and shortfall errors

A Reprocess, cancel and shortfall code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                                      |
| ----------- | ---------------------------------------------------------------------------------- |
| `PAYR-1017` | The amount calculations are not correct, or the Task resource has no task code     |
| `PAYR-1018` | The time limit for submission has expired, or the Task resource has no reason code |
| `PAYR-1252` | Case is not in a state that can be cancelled                                       |
| `PAYR-1253` | Case is already cancelled                                                          |
| `PAYR-1257` | Payment already initiated for the case                                             |
| `PAYR-1258` | Payment already cleared for the case                                               |
| `PAYR-1510` | A parameter code in your request is not valid                                      |
| `PAYR-1511` | A parameter value in your request is not valid                                     |
| `PAYR-1518` | Your Task resource carries no input parameters                                     |
| `PAYR-1519` | A Task input parameter has no type                                                 |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-32/docs/nhcx/v1/reference/pmjay-error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-32/docs/support)
