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

Do not match a `PAYR` code on its number alone. The same number means different things from different payers. Read the code with the message text beside it, and log both. [Reading error codes](/docs/pr-19/docs/nhcx/v1/reference/error-code-guide) lists the collisions, and [error codes](/docs/pr-19/docs/nhcx/v1/reference/error-codes) lists every code.

## Match every answer on its correlation id

The acknowledgement and the decision share one correlation id. So does every redelivery. Route an inbound message by that id first, and by the claim number inside the bundle second.

| Mistake                                             | What happens                                                   |
| --------------------------------------------------- | -------------------------------------------------------------- |
| Closing a thread on its first reply                 | the decision arrives on the same id and is thrown away         |
| Matching by path or by arrival order                | an answer lands on the wrong case                              |
| Reusing a correlation id after an error             | the exchange has retired it, and refuses the next attempt      |
| Answering a scheme payer's query on the same thread | the answer is swallowed without a refusal. It goes on a new id |
| Sending an id that is not a UUID                    | a transport may replace it, and the thread is lost             |

Store the ids the transport returned, not the ones you meant to send. See [responses arrive against the wrong request](/docs/pr-19/docs/nhcx/v1/troubleshooting/responses-arrive-against-the-wrong-request).

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

[Receiving a callback](/docs/pr-19/docs/nhcx/v1/getting-started/receiving-a-callback) has the route and the receipt.

## When no answer comes

Silence is a finding. Check these in order.

1. The send landed although it reported failure. Look for a delivery on its correlation id.
2. The answer arrived and a settled-status guard discarded it.
3. The answer went out on the wrong thread and was swallowed.
4. The exchange could not deliver, and reported that to `/v1/error`. If you do not host that route, nothing told you.

Then ask for the status rather than sending again: [status and search](/docs/pr-19/docs/nhcx/v1/getting-started/status-and-search).

## How you know it holds

Replace your `send` with a stub and replay one case: an acknowledgement, the same acknowledgement again, then the decision. The case must end decided, with one row per message and no second send offered. Then fail a send after the write, deliver its answer, and check the leg revives.

## Let an agent hold these rules

Every NHCX skill carries these rules with the runs behind them, in `references/errors-and-debugging.md`. The claim skill is the one most integrations reach for first after coverage.

NHCX agent skill

The discharge and the claim, the claim query answer, and the decision.

[SKILL.md](/docs/pr-19/skills/nhcx-claim/SKILL.md "The router. Use the command below to take the references with it.")

- ScaffoldThe loop that builds the use case stage by stage, ending when a gate closes on evidence rather than on the work looking right.
- Integrate2 operations, with their hosts, headers and the rules that hold across them.
- Debug30 recorded error codes, each with its message and what to do about it.
- Test5 test matrix rows, from offline pins up to a live payer on the sandbox.

`mkdir -p .claude/skills && curl -fsSL https://nha-in.github.io/docs/pr-19/skills/nhcx-claim.tar.gz | tar -xzf - -C .claude/skills`

[Open in Claude](claude://code/new?q=Install%20the%20ABDM%20NHCX%20agent%20skill%20into%20this%20project%2C%20then%20help%20me%20use%20it.%0A%0ARun%20this%3A%0Amkdir%20-p%20.claude%2Fskills%20%26%26%20curl%20-fsSL%20https%3A%2F%2Fnha-in.github.io%2Fdocs%2Fpr-19%2Fskills%2Fnhcx-claim.tar.gz%20%7C%20tar%20-xzf%20-%20-C%20.claude%2Fskills%0A%0AIf%20this%20session%20did%20not%20open%20in%20the%20repository%20I%20am%20integrating%20ABDM%20into%2C%20ask%20me%20for%20the%20path%20before%20you%20write%20anything.)

Drops the skill into this project. Claude loads it when a task matches.

How to use it

1. Run the command above in the repository you are integrating.
2. Ask your agent for the job in your own words. "File the NHCX claim at discharge from this system". The skill loads when the task matches it.
3. Check what it writes against these pages. The skill names the cases it could not reach on the NHCX sandbox, and nothing in it is re-verified here.
4. Open in Claude needs that app installed. It fills the composer and waits: nothing runs until you read it and press Enter.

## Where to go next

- [Build with AI](/docs/pr-19/docs/nhcx/v1/getting-started/build-with-ai) sets an agent up with all seven skills and the documentation server.
- [Building and sending a JWE](/docs/pr-19/docs/nhcx/v1/getting-started/building-and-sending-a-jwe) is the seal every rule above assumes.
- [The provider checklist](/docs/pr-19/docs/nhcx/v1/roles/provider/provider-checklist) is what has to be in place before go live.
