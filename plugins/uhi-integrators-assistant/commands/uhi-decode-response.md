---
description: Turn a UHI response, or a silence after one, into its most likely cause and the next check.
argument-hint: '<pasted status and body, or "no callback" with the transaction_id>'
---

Decode `$ARGUMENTS` into where the exchange stopped and the check that clears it.

UHI publishes no error code list. You decode by the HTTP status, by `ACK` or NACK, by the error object's four fields, and by what did not arrive. Never by a code value.

## Read the status first

Some failures stop a call before any error object is built.

| Status | Likely cause | Atom |
|---|---|---|
| `401` | The header was signed over a different body, reused, expired, or carries the wrong `keyId` | `uhi.troubleshooting.http-statuses` |
| `403` | Your public key is not registered, or your registration is not yet active | `uhi.troubleshooting.http-statuses` |
| `404` from the network registry lookup | No participant matches the `subscriber_id` and `pub_key_id` you sent | `uhi.troubleshooting.registry-lookup` |
| `200` | The call was received. Read the body | Below |

On `401`, fix the signature and send with a new header; the same header fails again. On `403`, a retry does not help. Run `/uhi-prove-signing` for either.

## Then the receipt

| Body | What it means |
|---|---|
| `ACK` with `error: {}` | Accepted. The answer comes later, as its own call |
| NACK, or `ACK` with a non-empty `error` | Refused or flagged. Read the error object |

## The error object

Four fields: `type`, `code`, `path` and `message`. Only `type` and `code` are always present. `path` is filled for a schema validation failure and names the field in the request that failed.

- Log all four, with the call's `transaction_id` and `message_id`.
- Act on the status and on whether `error` is empty. Never branch on the value of `code`.
- When `path` is filled, fix that field first and send with a fresh header.

The shape is `uhi.concept.error-object`. What to send and log is `uhi.concept.error-send-and-log`.

## Silence after an ACK

A `200` with `ACK` and then nothing is the most common UHI failure. Check in this order.

1. **Your callback URL.** Call your `consumer_uri`, or `provider_uri` for an HSPA, from outside your network over HTTPS. It shares a domain name with `consumer_id`, and it answers `200` with the `ACK` body at once. `uhi.troubleshooting.http-statuses`.
2. **The match.** A callback arrived and your code looked up the wrong `transaction_id`. Look each callback up by `transaction_id` first, then `message_id`. `uhi.concept.match-transaction-id`.
3. **The fixed identifiers.** A wrong case in a fixed value such as `fulfillment.type` means no HSPA answers at all. The service skill's integrate reference holds the values.
4. **What silence means for the service.** A search has no end signal. Set a timeout and render results as they arrive. `uhi.concept.timeouts`. For ambulance, only HSPAs that serve the pickup area answer, so silence means no coverage, not a network fault. `uhi.concept.aggregate-answers`.
5. **The host, after a switch to production.** `https://uhigateway.abdm.gov.in`, and production values in the IDs and callback URL. `uhi.troubleshooting.go-live`.

An `on_search` that arrives with an empty `providers` list is a result, not a failure. For PM-JAY HEM, widen the search. `uhi.troubleshooting.first-search`.

## Output

1. Where it stopped: the status, the receipt, the error object, or the silence
2. The four error fields verbatim, where there were any, with the `transaction_id` and `message_id`
3. The most likely cause, the second hypothesis it has to be separated from, and the atom that carries each
4. The exit condition: the original call answering `ACK` and its callback arriving and matching, not the fix being applied

Where nothing above matches, say so and name the two most likely causes rather than picking one. Do not invent a code.
