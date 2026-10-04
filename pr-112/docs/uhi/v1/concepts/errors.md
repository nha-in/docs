# Errors on UHI

A [UHI](/docs/pr-112/docs/uhi/v1/getting-started/glossary#uhi) error is described by one object with four fields. It travels in the `error` field beside the `ACK`, and in the body of an error response. After this page you will know its shape, what to send when you reject a call, and what to log.

## The error object

```json
{  "type": "<ERROR_TYPE>",  "code": "<ERROR_CODE>",  "path": "<JSON_PATH_THAT_FAILED_VALIDATION>",  "message": "<HUMAN_READABLE_MESSAGE>"}
```

| Field     | Required | What it holds                                                                             |
| --------- | -------- | ----------------------------------------------------------------------------------------- |
| `type`    | Yes      | The kind of error                                                                         |
| `code`    | Yes      | The error code                                                                            |
| `path`    | No       | The path in the JSON schema that caused the error. Used only for schema validation errors |
| `message` | No       | A human readable description                                                              |

## Where it appears

| Where                                                                                                     | When                                                                                            |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| The `error` field of a `200` response                                                                     | Beside `message.ack` in the receipt for any call. An accepted call carries an empty `error: {}` |
| The body of a `404` from the [network registry lookup](/docs/pr-112/docs/uhi/v1/concepts/registry-lookup) | No participant matches the lookup                                                               |

## HTTP statuses before the body

Some failures stop a call before any error object is built. Read the status first.

| Status                             | Likely cause                                                                                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `401`                              | The header was signed over a different body, reused, expired, or carries the wrong `keyId`. See [Signing](/docs/pr-112/docs/uhi/v1/concepts/signing) |
| `403`                              | Your public key is not registered, or your registration is not yet active                                                                            |
| `200` with `ACK`, then no callback | Your `consumer_uri` is not publicly reachable over HTTPS, or your endpoint did not return `200`                                                      |

Notes for AI agents

**What happens.** A `401` or `403` stops the call before any error object is built. Branch on the status first, and parse `error` only when there is a body to parse.

**When it goes wrong.** On `401`, fix the signature and send with a new header; the same header fails again. On `403`, finish or activate your registration before retrying. On `200` with `ACK` and no callback, call your `consumer_uri` from outside your network over HTTPS, and check that your endpoint returns `200` at once.

## Send and log

**When you reject a call**, send all four fields. Fill `path` whenever the failure is a schema validation failure, so the sender can find the field.

**When you receive an error**, log all four fields with the call's `transaction_id` and `message_id`. Those two values tie the error to the exchange. See [Messages and callbacks](/docs/pr-112/docs/uhi/v1/concepts/messages#match-on-transaction-id-and-message-id).

Notes for AI agents

**What happens.** Act on the HTTP status and on whether `error` is empty. Never branch on a `code` value, because no code list is published.

## Confirm at onboarding

- **The list of error codes.** No code list is published for UHI yet. Do not hard-code codes or branch on a code value. Send and log all four fields, and act on the HTTP status and on whether `error` is empty.

## Next steps

- [Signing](/docs/pr-112/docs/uhi/v1/concepts/signing): the cause of most `401` responses.
- [Network registry lookup](/docs/pr-112/docs/uhi/v1/concepts/registry-lookup): the `404` and how to avoid it.
- [Quickstart](/docs/pr-112/docs/uhi/v1/getting-started/first-fifteen-minutes): the full troubleshooting table for a first search.
