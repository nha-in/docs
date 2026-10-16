---
name: uhi-blood-bank-debug
description: "Use when a UHI Blood Bank discovery call fails, a callback never arrives, or a callback never matches: walks the symptom to a fix, verified by the original step succeeding."
---
# UHI Blood Bank discovery debug

UHI publishes no error code list. A failure shows as an HTTP status before any body, an error object beside the `ACK`, or a silence after it. Read those, never a code value.

**The UHI error object**

```json
{
  "type": "<ERROR_TYPE>",
  "code": "<ERROR_CODE>",
  "path": "<JSON_PATH_THAT_FAILED_VALIDATION>",
  "message": "<HUMAN_READABLE_MESSAGE>"
}
```

| Field | Required | What it holds |
| --- | --- | --- |
| `type` | Yes | The kind of error |
| `code` | Yes | The error code |
| `path` | No | The path in the JSON schema that caused the error. Used only for schema validation errors |
| `message` | No | A human readable description |

From `uhi.concept.error-object`.

**What to send and log when a UHI call fails**

**When you reject a call**, send all four fields. Fill `path` whenever the failure is a schema validation failure, so the sender can find the field.

**When you receive an error**, log all four fields with the call's `transaction_id` and `message_id`. Those two values tie the error to the exchange. See [Messages and callbacks](/docs/uhi/v1/concepts/messages#match-on-transaction-id-and-message-id).

From `uhi.concept.error-send-and-log`.

Every symptom below is an OODA loop: observe the status, the error object and the `transaction_id`, orient against the matched symptom, decide the fix, act, and observe whether the original step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per symptom.

## Symptoms

### When the first UHI search fails

Step 4 carries the symptom table. A `200` whose `error` is not empty carries
the reason: [Errors on UHI](/docs/uhi/v1/concepts/errors) sets out the object
and what to log.

The search is sent to the sandbox Gateway, which returns `200` with an `ACK` at once. The results arrive later as `on_search` on the callback at your `consumer_uri`, matched by `transaction_id`. A failure shows at one of those two points.

Match the symptom, then fix its cause.
- A `401` on the send step: the header was signed over a different body, the signature was reused or has expired, or the key ID is wrong. Sign again and send the body byte for byte as signed.
- A `403` on the send step: the public key is not registered, or the registration is not yet active.
- An `ACK` but no callback: your `consumer_uri` is not publicly reachable over HTTPS, or your endpoint did not reply `200`.
- A callback arrives but is not matched: your code looked up the wrong `transaction_id`.
- An empty `providers` list: no empanelled hospital lies inside the radius. Widen the radius and search again.

From `uhi.troubleshooting.first-search`.

**Exit condition: the original step now succeeds.**

### UHI HTTP statuses that arrive before any error object

Some failures stop a call before any error object is built. Read the status first.

| Status | Likely cause |
| --- | --- |
| `401` | The header was signed over a different body, reused, expired, or carries the wrong `keyId`. See [Signing](/docs/uhi/v1/concepts/signing) |
| `403` | Your public key is not registered, or your registration is not yet active |
| `200` with `ACK`, then no callback | Your `consumer_uri` is not publicly reachable over HTTPS, or your endpoint did not return `200` |

A `401` or `403` stops the call before any error object is built. Branch on the status first, and parse `error` only when there is a body to parse.

On `401`, fix the signature and send with a new header; the same header fails again. On `403`, finish or activate your registration before retrying. On `200` with `ACK` and no callback, call your `consumer_uri` from outside your network over HTTPS, and check that your endpoint returns `200` at once.

From `uhi.troubleshooting.http-statuses`.

**Exit condition: the original step now succeeds.**

### When the UHI network registry lookup fails

| Response | Likely cause |
| --- | --- |
| `401` | Your own header is wrong: signed over a different body, reused, expired, or with the wrong `keyId` |
| `403` | Your public key is not registered, or your registration is not yet active |
| `404` | No participant matches the body. The response carries an [error object](/docs/uhi/v1/concepts/errors) |

A failed lookup returns a status and no subscriber record. Read the status before the body.

On `401`, build a fresh header over the exact bytes you send, and check your `keyId`. On `403`, confirm your registration is complete and uses the public key you sign with; a retry does not help. On `404`, check that `subscriber_id` and `pub_key_id` came from the right parts of the sender's `keyId`. Log the error object, and do not trust the call you were checking.

From `uhi.troubleshooting.registry-lookup`.

**Exit condition: the original step now succeeds.**

### Blood Bank discovery: search to on_search from every Blood Bank HSPA

A wrong `domain` means no HSPA responds. No end signal arrives, so close the window after 10 to 15 seconds. The unavailable status arrives as `NotAvailable` or `Not Available`, so match both. Counts are indicative: show the phone number and a call to confirm.

From `uhi.flow.blood-bank-discovery`.

**Exit condition: the original step now succeeds.**

## Where the detail is

- Errors on UHI: /docs/uhi/v1/concepts/errors
- Signing: /docs/uhi/v1/concepts/signing
