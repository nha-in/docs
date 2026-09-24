# NHCX support

Write to the team that owns the problem. A question sent to the wrong address waits in the wrong queue.

| For                                                                                            | Write to                                                                                               |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| NHCX integration, onboarding, participant records, certificates and failing calls              | `hcx.integration@nha.gov.in`                                                                           |
| FHIR bundle validation at sandbox exit, and the internal and Health Tech Committee (HTC) demos | `hcx.integration@nha.gov.in`                                                                           |
| Building a FHIR bundle, and the NRCeS profiles                                                 | `nrc-help@cdac.in`                                                                                     |
| ABDM Milestone 1 integration and sandbox credentials                                           | `integration.support@nha.gov.in`, or the [sandbox support portal](https://sandboxsupport.abdm.gov.in/) |
| Facility registration in the Health Facility Registry (HFR)                                    | `facility@nha.gov.in`                                                                                  |

Replies have no fixed turnaround time.

## Before you write

Most failures have a known cause. Check these first:

- [Troubleshooting](/docs/pr-45/docs/nhcx/v1/troubleshooting): what to do when something breaks, by symptom.
- [Troubleshooting by layer and code](/docs/pr-45/docs/nhcx/v1/reference/troubleshooting): every layer of a call, and what each error code means there.
- [Error codes](/docs/pr-45/docs/nhcx/v1/reference/error-codes): every code with its message.

## What to put in the message

A report without these cannot be traced:

- Your participant code and the recipient's.
- The environment, the use case and the path you called.
- The `x-hcx-correlation_id`, `x-hcx-api_call_id` and `x-hcx-timestamp` of the failing message.
- The workflow code and the status you sent.
- The raw sealed message as sent, and the raw response as received.
- The error code and message exactly as returned.

Never send a token, a client secret or a private key.
