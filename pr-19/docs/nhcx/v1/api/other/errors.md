# Other errors

A Other code arrives sealed inside the callback, not in the response to your call. These are the codes the Catalogue records on this module's paths.

## Codes

| Code        | What it means                                                                      | Arrives on                              |
| ----------- | ---------------------------------------------------------------------------------- | --------------------------------------- |
| `NHCX-401`  | The exchange does not accept your authorisation for this call                      | `/v1/error`                             |
| `NHCX-1001` | The recipient's system is not reachable                                            | `/v1/error`                             |
| `NHCX-1002` | The sender is not a registered participant                                         | `/v1/error`                             |
| `NHCX-1003` | The recipient is not a registered participant                                      | `/v1/error`                             |
| `NHCX-1004` | No recipient is registered for the scheme you asked for                            | `/v1/error`                             |
| `NHCX-1005` | A request header is missing or not valid                                           | `/v1/error`                             |
| `NHCX-1006` | The correlation id has already been used                                           | `/v1/error`                             |
| `NHCX-1007` | The exchange could not process the request's structure or values                   | `/v1/error`                             |
| `NHCX-1008` | The exchange had a temporary failure                                               | `/v1/error`                             |
| `NHCX-1009` | The exchange failed and recorded the cause in its own logs                         | `/v1/error`                             |
| `NHCX-1010` | No request matches the correlation id on your answer                               | `/v1/error`                             |
| `NHCX-1011` | The x-hcx-status value is not valid                                                | `/v1/error`                             |
| `NHCX-1012` | No message matches the api\_call\_id you gave                                      | `/v1/error`, `/v1/on_status`            |
| `NHCX-1013` | The request body is empty or not valid                                             | `/v1/error`                             |
| `NHCX-1014` | The exchange could not deliver the response to its sender                          | `/v1/error`                             |
| `NHCX-1015` | The recipient answered a delivery in a form the exchange does not accept           | `/v1/error`                             |
| `NHCX-1016` | The call does not fit the exchange open on this correlation id                     | `/v1/error`                             |
| `NHCX-1017` | The recipient answered a delivery in a form the exchange does not accept           | `/v1/error`                             |
| `NHCX-1018` | The ABHA number is not in the XX-XXXX-XXXX-XXXX form                               | `/v1/error`                             |
| `PAYR-1017` | The amount calculations are not correct, or the Task resource has no task code     | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1018` | The time limit for submission has expired, or the Task resource has no reason code | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1252` | Case is not in a state that can be cancelled                                       | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1253` | Case is already cancelled                                                          | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1257` | Payment already initiated for the case                                             | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1258` | Payment already cleared for the case                                               | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1510` | A parameter code in your request is not valid                                      | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1511` | A parameter value in your request is not valid                                     | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1516` | The payer cannot match your error response to any message                          | `/v1/error`                             |
| `PAYR-1517` | Your error was sent encrypted instead of as a protocol response                    | `/v1/error`                             |
| `PAYR-1518` | Your Task resource carries no input parameters                                     | `/v1/task/on_submit`, `/v1/task/submit` |
| `PAYR-1519` | A Task input parameter has no type                                                 | `/v1/task/on_submit`, `/v1/task/submit` |

Every code above is recorded in the Catalogue. The aggregated list across modules is at [error codes](/docs/pr-19/docs/nhcx/v1/reference/error-codes).

[Next Still stuck? Ask for help Where to file what you hit, so the answer lands back in these pages.](/docs/pr-19/docs/support)
