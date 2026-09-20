# Communication errors

A Communication code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                         | Arrives on                                                  |
| ----------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| `PAYR-1037` | The communication has no identifier                                   | `/v1/communication/on_request`, `/v1/communication/request` |
| `PAYR-1038` | The communication identifier has no type                              | `/v1/communication/on_request`, `/v1/communication/request` |
| `PAYR-1039` | The communication has no payload                                      | `/v1/communication/on_request`, `/v1/communication/request` |
| `PAYR-1516` | The payer cannot match your error response to any message             | `/v1/communication/on_request`, `/v1/communication/request` |
| `PAYR-1517` | Your error was sent encrypted instead of as a protocol response       | `/v1/communication/on_request`, `/v1/communication/request` |
| `PAYR-1518` | Your Task resource carries no input parameters                        | `/v1/communication/on_request`                              |
| `PAYR-1519` | A Task input parameter has no type                                    | `/v1/communication/on_request`                              |
| `PAYR-1520` | The communication reference does not lead to a Communication resource | `/v1/communication/on_request`, `/v1/communication/request` |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-19/docs/nhcx/v1/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-19/docs/support)
