# Accepted with 202, and no callback arrives

Your call returned `202` and no answer has come. The `202` only means the exchange accepted the request. The answer travels three more legs, and any of them can stop it, so find which one.

## In short

- Check `/v1/error` first. An undeliverable request is reported there.
- Then check that the exchange can reach your endpoint, and that you answer `202` in time.
- A status check with the request's API call ID says where the request stands.
- Never resubmit on the same correlation ID. Start a new cycle.

## Prerequisites

- You have the request's `x-hcx-api_call_id`, `x-hcx-correlation_id` and `x-hcx-timestamp`.
- You host `/v1/error`, where the exchange reports a request it cannot deliver.

## Work through these in order

1. **Did `/v1/error` receive anything?** When the exchange cannot deliver your request, the failure comes back to your [error endpoint](/docs/pr-11/docs/nhcx/v1/api/other/endpoints/other-v1-error). Check its log first.
2. **Can the exchange reach your callback endpoint at all?** Domain name, hosting in India, allowed addresses and routing all matter. See [Your callback URL is rejected or never called](/docs/pr-11/docs/nhcx/v1/troubleshooting/your-callback-url-is-rejected).
3. **Does your endpoint answer `202` within 30 seconds, with the receipt body?** A slow or malformed receipt counts as a failed delivery. The exchange retries five times, then deletes the request.
4. **Did you address the right recipient?** When a [TPA](/docs/pr-11/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) processes the policy, `x-hcx-recipient_code` is the `processingid` from the policy lookup, not the payer's code.
5. **Where does the request stand?** Send one [status check](/docs/pr-11/docs/nhcx/v1/api/status/endpoints/status-v1-status), with the request's API call ID as its correlation ID. `request.queued` means it is still inside the exchange. `request.dispatched` means the recipient holds it, and a `/v1/on_status` callback follows.
6. **Did the recipient reject it?** A recipient that cannot process your request answers with a clear-text `ProtocolResponse` instead of a sealed payload. Its `x-hcx-status` is `response.error`. A handler that accepts only sealed bodies drops it, so read `x-hcx-error_details`.

## What you see when it works

The callback reaches your endpoint carrying the correlation ID you sent. Your endpoint answers it `202` within 30 seconds, with the receipt body. The next request of the same kind completes the same way.

## When it goes wrong

Do not resubmit with the same correlation ID. The exchange refuses it as a duplicate, `NHCX-1006`. Once you know the old cycle failed, start a new one with a new correlation ID.

If every check passes and nothing arrives, write to `hcx.integration@nha.gov.in`. Include the API call ID, the correlation ID, the timestamp and the `202` body.

| Code        | What it means                                         |
| ----------- | ----------------------------------------------------- |
| `NHCX-1001` | The receiver system is not reachable                  |
| `NHCX-1006` | A request with the same correlation ID already exists |
| `NHCX-1010` | No data for the correlation ID of a callback          |
| `NHCX-1012` | No records for the API call ID of a status check      |

## Next steps

- [Status and Search](/docs/pr-11/docs/nhcx/v1/getting-started/status-and-search): the status check in full.
- [The recipient cannot decrypt your message](/docs/pr-11/docs/nhcx/v1/troubleshooting/the-recipient-cannot-decrypt): when the rejection carries `PAYR-1001`.
- [The payer rejects your FHIR bundle](/docs/pr-11/docs/nhcx/v1/troubleshooting/the-payer-rejects-your-bundle): when it names a bundle fault.
