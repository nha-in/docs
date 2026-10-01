# Messages and callbacks

Every [UHI](/docs/pr-98/docs/uhi/v1/getting-started/glossary#uhi) call is asynchronous. You send a request, you get an immediate receipt, and the real answer arrives later as a separate call to your callback URL. After this page you will know what every message carries, how to match an answer to your request, and how long to wait.

## In short

- Every call carries a `context` block. `context.domain` names the service.
- The synchronous reply is only an `ACK`. The answer arrives later on your [`consumer_uri`](/docs/pr-98/docs/uhi/v1/getting-started/glossary#consumer-uri) or [`provider_uri`](/docs/pr-98/docs/uhi/v1/getting-started/glossary#provider-uri).
- Match every callback to its request on `transaction_id`, then `message_id`.
- A search has no end signal. Set a timeout, render results as they arrive, and paginate on your side.

## The context block

Every call, in both directions, starts with the same block. Build a fresh one for each request.

```json
{  "context": {    "domain": "nic2004:85112",    "country": "IND",    "city": "std:011",    "action": "search",    "core_version": "0.7.1",    "consumer_id": "<YOUR_SUBSCRIBER_ID_FROM_SANDBOX_REGISTRATION>",    "consumer_uri": "<YOUR_HTTPS_CALLBACK_BASE_URL>",    "message_id": "<NEW_UUID>",    "transaction_id": "<NEW_UUID_FOR_A_NEW_EXCHANGE>",    "timestamp": "<NOW_IN_UTC_RFC3339>"  }}
```

| Field            | Required | What it holds                                                                                                                                                                                                                                                                                           |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`         | Yes      | The service, such as `nic2004:85112` for PM-JAY HEM. The [UHI Gateway](/docs/pr-98/docs/uhi/v1/getting-started/glossary#uhi-gateway) routes a search to every [HSPA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#hspa) registered for it. [Each service's value](/docs/pr-98/docs/uhi/v1/services) |
| `country`        | Yes      | `IND`                                                                                                                                                                                                                                                                                                   |
| `city`           | Yes      | `std:011`                                                                                                                                                                                                                                                                                               |
| `action`         | Yes      | The name of this call, such as `search` or `on_search`                                                                                                                                                                                                                                                  |
| `core_version`   | Yes      | `0.7.1`                                                                                                                                                                                                                                                                                                 |
| `consumer_id`    | Yes      | The [EUA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#eua)'s subscriber ID                                                                                                                                                                                                                         |
| `consumer_uri`   | Yes      | The EUA's callback base URL. It must share a domain name with `consumer_id`                                                                                                                                                                                                                             |
| `provider_id`    | No       | The HSPA's subscriber ID                                                                                                                                                                                                                                                                                |
| `provider_uri`   | No       | The HSPA's base URL for direct calls                                                                                                                                                                                                                                                                    |
| `message_id`     | Yes      | Unique for one request and its callback                                                                                                                                                                                                                                                                 |
| `transaction_id` | Yes      | Unique for one exchange, and the same on every call from `search` through `confirm`                                                                                                                                                                                                                     |
| `timestamp`      | Yes      | When the request was generated, in RFC 3339 format                                                                                                                                                                                                                                                      |
| `key`            | No       | The sender's encryption public key                                                                                                                                                                                                                                                                      |
| `ttl`            | No       | How long after `timestamp` the message stays valid, as an ISO 8601 duration                                                                                                                                                                                                                             |

Times inside `message`, such as a fulfillment's start and end, follow ISO 8601 without a time zone: `2022-07-15T00:00:00`.

Notes for AI agents

**Before you start.** A subscriber ID from sandbox registration, and a public HTTPS callback base URL that shares a domain name with it.

**What happens.** Build a new `context` for every request, with a new `message_id` and a current `timestamp`. Create a new `transaction_id` only when an exchange starts at `search`, and reuse it on every call through `confirm`. Set `action` to the call you are making and `domain` to the value on the service page.

**How you know it worked.** The `on_search` for your request echoes your `transaction_id` and `message_id`, and arrives on your `consumer_uri`.

**When it goes wrong.** No callback arrives: check that `consumer_uri` is public over HTTPS and shares a domain name with `consumer_id`. A `transaction_id` reused across two exchanges mixes their callbacks, so neither can be matched.

## ACK now, answer later

The HTTP response to any UHI call is a receipt, not a result. The receiver returns `200` with this body as soon as the request is accepted:

```json
{ "message": { "ack": { "status": "ACK" } }, "error": {} }
```

Your own callback endpoints must do the same. Return `200` and the `ACK` body at once, then process the request. The business answer goes back as a new call, such as `on_search` in reply to `search`.

- **An EUA** receives answers on its `consumer_uri`, for example at `<consumer_uri>/on_search`.
- **An HSPA** receives direct calls on its `provider_uri`.

Both URLs must be public and reachable over HTTPS.

Notes for AI agents

**What happens.** On every endpoint you serve, return `200` with the `ACK` body before any processing. Then send the business answer as a new call. Never wait for a result in the HTTP response of a call you sent.

**How you know it worked.** Your endpoint answers `200` with `ACK` at once, and the answer reaches the other side later as its own call, such as `on_search`.

**When it goes wrong.** Code that reads results from the response to `search` finds only the receipt and shows nothing. An endpoint that does not return `200` at once can leave the sender with an `ACK` and no callback.

## Match on transaction\_id and message\_id

| Field            | Scope                                         | Use it to                                                             |
| ---------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| `transaction_id` | One exchange, from `search` through `confirm` | Group every callback that belongs to one patient's search and booking |
| `message_id`     | One request and its callback                  | Tie one callback to the request that caused it                        |

An HSPA echoes both values in its `on_search`. A mismatch is the most common reason an EUA never sees results. Store both before you send, and look each callback up by `transaction_id` first.

Notes for AI agents

**What happens.** Store `transaction_id` and `message_id` against the patient's request before the call leaves. On each callback, find the exchange by `transaction_id`, then the request by `message_id`.

**How you know it worked.** Every `on_search` your app receives resolves to a stored exchange, and its results render on that patient's screen.

**When it goes wrong.** Results never render: compare the callback's `transaction_id` with the one you stored. A callback whose `transaction_id` matches no stored exchange is logged with its `message_id` and never attached to another exchange.

## Timeouts

A search has no end signal. The Gateway broadcasts it to every HSPA registered for the domain, and each one answers separately. Nothing tells you the last answer has arrived.

- Set a timeout for each search.
- Render each `on_search` as it arrives. Do not wait for all of them.
- Paginate on your side.
- When the timeout passes with nothing received, stop waiting and offer a retry.

Blood Bank's figure is 10 to 15 seconds. Aggregate its answers by `transaction_id` within that window.

Notes for AI agents

**What happens.** Read the timeout from configuration and start it when `search` is sent. Render each `on_search` for that `transaction_id` as it arrives. When the timeout passes, stop waiting on that exchange.

**How you know it worked.** The first result shows before the timeout ends, and a search that gets no answer ends in a retry offer, not a loading screen.

**When it goes wrong.** A screen that waits for a final answer never finishes, because no final answer is sent. A timeout fixed in code cannot take your service's figure once it is agreed at onboarding.

## Confirm at onboarding

- **The `on_search` timeout for each service except Blood Bank.** No figure is set for Physical Consultation, PM-JAY HEM, Ambulance Booking, Jan Aushadhi or NOTTO. Ask for your service's figure. Until you have it, keep the timeout a configuration value, not a constant.

## Next steps

- [Routes](/docs/pr-98/docs/uhi/v1/concepts/routes): which calls go through the Gateway and which go direct.
- [Signing](/docs/pr-98/docs/uhi/v1/concepts/signing): the header every call needs.
- [Errors](/docs/pr-98/docs/uhi/v1/concepts/errors): the `error` object beside the `ACK`.
- [Quickstart](/docs/pr-98/docs/uhi/v1/getting-started/first-fifteen-minutes): send one search and read the callback.
