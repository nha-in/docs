# When something breaks

Find the symptom you are seeing, not the error code. Each chapter here walks the checks in order, so you can start without knowing which code applies. They run in the order a message travels: your token, your address, delivery, encryption, the bundle, then the identifiers that tie a cycle together.

- [Every NHCX call returns 401](/docs/pr-30/docs/nhcx/v1/troubleshooting/every-call-returns-401): every endpoint fails the same way, not one call.
- [Your callback URL is rejected or never called](/docs/pr-30/docs/nhcx/v1/troubleshooting/your-callback-url-is-rejected): the endpoint update is refused, or nothing ever reaches your server.
- [Accepted with 202, and no callback arrives](/docs/pr-30/docs/nhcx/v1/troubleshooting/accepted-then-no-callback): the exchange took your request and nothing followed.
- [The recipient cannot decrypt your message](/docs/pr-30/docs/nhcx/v1/troubleshooting/the-recipient-cannot-decrypt): the answer is a `ProtocolResponse` carrying `PAYR-1001`.
- [The payer rejects your FHIR bundle](/docs/pr-30/docs/nhcx/v1/troubleshooting/the-payer-rejects-your-bundle): the answer names a bundle fault such as `PAYR-1004` or `PAYR-1008`.
- [Responses arrive against the wrong request](/docs/pr-30/docs/nhcx/v1/troubleshooting/responses-arrive-against-the-wrong-request): answers land on the wrong case, or the exchange refuses a duplicate.

If you already hold an error code, [Troubleshooting](/docs/pr-30/docs/nhcx/v1/reference/troubleshooting) in the Reference is organised the other way, by layer and by code. [Error Codes](/docs/pr-30/docs/nhcx/v1/reference/error-code-guide) lists every code either side can send.

## A service name you do not recognise

The name in a log line or a URL does not always match the exchange. Reprocess is served by `taskhcxservice`, notifications by `subscriptionhcxservice`, payment by `servicehcxpayment`.

| Service name in a log or URL    | Exchange it serves                                            |
| ------------------------------- | ------------------------------------------------------------- |
| `coverageeligibilityhcxservice` | Coverage eligibility                                          |
| `insuranceplanhcxservice`       | Insurance plan                                                |
| `preauthhcxservice`             | Preauthorisation                                              |
| `claimhcxservice`               | Claim                                                         |
| `communicationhcxservice`       | Communication, including a request for additional attachments |
| `servicehcxpayment`             | Payment notice                                                |
| `statushcxservice`              | Status check                                                  |
| `taskhcxservice`                | Task: reprocess and cancel                                    |
| `searchhcxservice`              | Search                                                        |
| `participanthcxservice`         | Participant service: registry, certificates and policies      |
| `subscriptionhcxservice`        | Notifications                                                 |
| `abdmproxy`                     | Face authentication for PMJAY biometrics                      |
| `nhcxpayerservice`              | PMJAY payer service: the role lookup and acting on a case     |
| `dummyhcxpayer`                 | The sandbox dummy payer's test hooks                          |

[Environments and addresses](/docs/pr-30/docs/nhcx/v1/reference/environments-and-addresses) has the full address of each.

## Next steps

- [Troubleshooting](/docs/pr-30/docs/nhcx/v1/reference/troubleshooting): the five layers and the symptom table.
- [Get your sandbox credentials](/docs/pr-30/docs/nhcx/v1/getting-started/get-your-sandbox-credentials): where to write, and what to put in the message.
