# Communication errors

A Communication code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code                                                                               | What it means                                                         |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`PAYR-1037`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1037) | The communication has no identifier                                   |
| [`PAYR-1038`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1038) | The communication identifier has no type                              |
| [`PAYR-1039`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1039) | The communication has no payload                                      |
| [`PAYR-1516`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1516) | The payer cannot match your error response to any message             |
| [`PAYR-1517`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1517) | Your error was sent encrypted instead of as a protocol response       |
| [`PAYR-1518`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1518) | Your Task resource carries no input parameters                        |
| [`PAYR-1519`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1519) | A Task input parameter has no type                                    |
| [`PAYR-1520`](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes?code=PAYR-1520) | The communication reference does not lead to a Communication resource |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-47/docs/nhcx/v1/reference/pmjay-error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-47/docs/support)
