# Insurance plan errors

A Insurance plan code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                          | Arrives on                                                  |
| ----------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| `PAYR-1035` | The policy code is invalid                                             | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1401` | The policy is not allowed for your hospital                            | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1402` | The payer has no policy with the code you requested                    | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1403` | The renewal does not belong to the requested policy                    | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1404` | No treatment is configured for the policy under any speciality         | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1405` | The payer has no enrolled hospital for your HFR id or sender code      | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1406` | An earlier insurance plan request for the same policy is still running | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1510` | A parameter code in your request is not valid                          | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1511` | A parameter value in your request is not valid                         | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1518` | Your Task resource carries no input parameters                         | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |
| `PAYR-1519` | A Task input parameter has no type                                     | `/v1/insuranceplan/on_request`, `/v1/insuranceplan/request` |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-19/docs/nhcx/v1/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-19/docs/support)
