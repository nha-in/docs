# Responses arrive against the wrong request

An answer lands on the wrong case in your system. Or the exchange refuses a request as a duplicate, or refuses a callback it cannot match. All three come from how your system sets and reads the [correlation ID](/docs/pr-47/docs/nhcx/v1/getting-started/glossary#messages) and the [API call ID](/docs/pr-47/docs/nhcx/v1/getting-started/glossary#messages).

## In short

- Open each cycle with a new correlation ID, equal to that request's API call ID.
- Every message in the cycle echoes it. Every call gets a new API call ID.
- A failed cycle's correlation ID is inactive, so start a new cycle.
- Match incoming messages on the correlation ID, never on arrival order.

## Prerequisites

- You log the `x-hcx-correlation_id` and `x-hcx-api_call_id` of every message you send and receive.

## Work through these in order

1. **Does each request cycle get its own correlation ID?** Generate a new random 36-character identifier for every request that opens a cycle. Set it equal to that request's API call ID. Never copy one from an example.
2. **Does every message in the cycle carry it unchanged?** The answer, any query and every callback echo the request's correlation ID. The answer's own API call ID is different.
3. **Is the API call ID new on every call?** Generate a fresh one for every call, retries included.
4. **Did you reuse a failed cycle's correlation ID?** After an error the correlation ID becomes inactive. A new request with it is refused with `NHCX-1006`. Start a fresh cycle with a new ID.
5. **Do you match answers by correlation ID?** Store the correlation ID against the case before you send. Match every incoming message on it, never on arrival order or time.
6. **If you are the payer, is the recipient right?** The recipient code of your answer is the sender code of the request you answer.

## What you see when it works

Every callback lands on the case whose request carried its correlation ID. New requests are accepted with `202`, and your logs show no `NHCX-1006` or `NHCX-1010`.

## When it goes wrong

If one case's answers keep landing elsewhere, compare the correlation ID in the misplaced callback with the one stored on each case. Two cases holding the same value point at a generator that repeats. A [status check](/docs/pr-47/docs/nhcx/v1/api/status/endpoints/status-v1-status) shows which request the exchange holds for an ID.

| Code        | What it means                                                              |
| ----------- | -------------------------------------------------------------------------- |
| `NHCX-1006` | A request with the same correlation ID already exists                      |
| `NHCX-1010` | No data for the correlation ID of a callback                               |
| `NHCX-1012` | No records for an API call ID                                              |
| `PAYR-1516` | No event found for the API call ID and correlation ID of an error response |

## Next steps

- [Envelope Fields](/docs/pr-47/docs/nhcx/v1/reference/envelope-fields): every identifier on the envelope, and when each one changes.
- [The JWE message format](/docs/pr-47/docs/nhcx/v1/getting-started/jwe-message-format): how a cycle threads from request to answer.
- [When something breaks](/docs/pr-47/docs/nhcx/v1/troubleshooting): the other symptoms.
