# Build it well

Every call on this site can be made correctly and still leave a hospital with a claim it cannot find. NHCX answers later, on another connection, and sometimes not at all. These are the rules that decide whether your integration survives that, and each one was learnt from a build that got it wrong once.

## In short

- The family of an error code says who refused: the exchange, the payer, or your own receiving end.
- Match every answer on its correlation id, never on the path or the order it arrived in.
- A send that reports failure may still have landed. Look before you send again.
- Deduplicate deliveries, because the exchange redelivers up to five times.
- Silence has four causes, and one of them is a route you did not host.

## Read who refused before you read the code

Three places refuse a message. Which one it was decides what you fix.

| What you received                    | Who refused                                       | Where it arrives                                                           |
| ------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------- |
| HTTP `400` or `401` on your own send | the exchange, before the message went further     | the answer to your call. A `401` is an expired token or a missing `Bearer` |
| A delivery your key cannot open      | your own receiving end                            | the certificate on your participant record is not the key you hold         |
| `NHCX-*`                             | the exchange. The message never reached the payer | the answer to your call, or a `ProtocolResponse` on your callback later    |
| `PAYR-*`, `ERR-PYR-*`                | the payer. The message reached it                 | a `ProtocolResponse` on your callback, on the request's correlation id     |

A `ProtocolResponse` is plain JSON, not a bundle. It carries `x-hcx-status` as `response.error`, and the code and text in `x-hcx-error_details`.

Do not match a `PAYR` code on its number alone. The same number means different things from different payers. Read the code with the message text beside it, and log both. [Reading error codes](/docs/pr-48/docs/nhcx/v1/reference/error-code-guide) lists the collisions, and [error codes](/docs/pr-48/docs/nhcx/v1/reference/error-codes) lists every code.

## Match every answer on its correlation id

The acknowledgement and the decision share one correlation id. So does every redelivery. Route an inbound message by that id first, and by the claim number inside the bundle second.

| Mistake                                             | What happens                                                   |
| --------------------------------------------------- | -------------------------------------------------------------- |
| Closing a thread on its first reply                 | the decision arrives on the same id and is thrown away         |
| Matching by path or by arrival order                | an answer lands on the wrong case                              |
| Reusing a correlation id after an error             | the exchange has retired it, and refuses the next attempt      |
| Answering a scheme payer's query on the same thread | the answer is swallowed without a refusal. It goes on a new id |
| Sending an id that is not a UUID                    | a transport may replace it, and the thread is lost             |

Store the ids the transport returned, not the ones you meant to send. See [responses arrive against the wrong request](/docs/pr-48/docs/nhcx/v1/troubleshooting/responses-arrive-against-the-wrong-request).

## What is safe to send again

A send that reports failure can still have landed. A connection that drops after the request was written answers `502`, while the exchange has the message and the payer acknowledges it seconds later. A hospital that reads that `502` as "not sent" sends again. The payer refuses the duplicate, and a live case now stands at the payer that the hospital has no record of.

1. Store `txn_id`, `correlation_id` and `api_call_id` before the POST, so a failed POST still has a handle.
2. Record the failed leg under that correlation id, not as nothing.
3. When an answer arrives on a failed leg's correlation id, revive the leg rather than offering a second send.
4. After a real refusal, send again on a fresh correlation id.

## Receive as if every delivery comes twice

The exchange redelivers an unacknowledged message up to five times, then drops the correlation id. A payer may also redeliver a large answer on its own.

- Deduplicate on `x-hcx-api_call_id`.
- Deduplicate payment notices and communication requests on their correlation id, with a unique index.
- Answer `2xx` before doing slow work. The exchange allows 30 seconds for the receipt.
- If applying a delivery failed for a passing reason, such as a database being away, un-record it. Otherwise its redelivery is waved off as a duplicate.

[Receiving a callback](/docs/pr-48/docs/nhcx/v1/getting-started/receiving-a-callback) has the route and the receipt.

## When no answer comes

Silence is a finding. Check these in order.

1. The send landed although it reported failure. Look for a delivery on its correlation id.
2. The answer arrived and a settled-status guard discarded it.
3. The answer went out on the wrong thread and was swallowed.
4. The exchange could not deliver, and reported that to `/v1/error`. If you do not host that route, nothing told you.

Then ask for the status rather than sending again: [status and search](/docs/pr-48/docs/nhcx/v1/getting-started/status-and-search).

## How you know it holds

Replace your `send` with a stub and replay one case: an acknowledgement, the same acknowledgement again, then the decision. The case must end decided, with one row per message and no second send offered. Then fail a send after the write, deliver its answer, and check the leg revives.

## Where to go next

- [Build with AI](/docs/pr-48/docs/nhcx/v1/getting-started/build-with-ai) sets an agent up with all seven skills and the documentation server.
- [Building and sending a JWE](/docs/pr-48/docs/nhcx/v1/getting-started/building-and-sending-a-jwe) is the seal every rule above assumes.
- [The provider checklist](/docs/pr-48/docs/nhcx/v1/roles/provider/provider-checklist) is what has to be in place before go live.
