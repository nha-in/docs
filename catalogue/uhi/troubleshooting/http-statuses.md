---
id: uhi.troubleshooting.http-statuses
type: troubleshooting
gateway: uhi
milestone: n/a
version: uhi-v1
title: UHI HTTP statuses that arrive before any error object
summary: A 401 points to signing, a 403 to registration, and a 200 ACK with no
  callback to an unreachable callback URL or an endpoint that did not answer
  200.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/errors.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/errors.mdx#http-statuses-before-the-body. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.signature-construction
    - uhi.concept.ack-then-answer
    - uhi.concept.error-object
  troubleshooting:
    - uhi.troubleshooting.registry-lookup
---

# UHI HTTP statuses that arrive before any error object

## In plain words

Some failures stop a call before any error object is built. Read the status first.

| Status | Likely cause |
| --- | --- |
| `401` | The header was signed over a different body, reused, expired, or carries the wrong `keyId`. See [Signing](/docs/uhi/v1/concepts/signing) |
| `403` | Your public key is not registered, or your registration is not yet active |
| `200` with `ACK`, then no callback | Your `consumer_uri` is not publicly reachable over HTTPS, or your endpoint did not return `200` |

## What happens

A `401` or `403` stops the call before any error object is built. Branch on the status first, and parse `error` only when there is a body to parse.

## When it goes wrong

On `401`, fix the signature and send with a new header; the same header fails again. On `403`, finish or activate your registration before retrying. On `200` with `ACK` and no callback, call your `consumer_uri` from outside your network over HTTPS, and check that your endpoint returns `200` at once.
