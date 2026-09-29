---
id: uhi.troubleshooting.first-search
type: troubleshooting
gateway: uhi
milestone: n/a
version: uhi-v1
title: When the first UHI search fails
summary: What a 401, a 403, an ACK with no callback, an unmatched callback or an
  empty provider list means on your first search.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/first-fifteen-minutes.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/first-fifteen-minutes.mdx#if-a-call-fails.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.signing-headers
    - uhi.concept.match-transaction-id
    - uhi.concept.error-object
  troubleshooting:
    - uhi.troubleshooting.http-statuses
  endpoints:
    - uhi.endpoint.network-gateway-search
---

# When the first UHI search fails

## In plain words

Step 4 carries the symptom table. A `200` whose `error` is not empty carries
the reason: [Errors on UHI](/docs/uhi/v1/concepts/errors) sets out the object
and what to log.

## What happens

The search is sent to the sandbox Gateway, which returns `200` with an `ACK` at once. The results arrive later as `on_search` on the callback at your `consumer_uri`, matched by `transaction_id`. A failure shows at one of those two points.

## When it goes wrong

Match the symptom, then fix its cause.
- A `401` on the send step: the header was signed over a different body, the signature was reused or has expired, or the key ID is wrong. Sign again and send the body byte for byte as signed.
- A `403` on the send step: the public key is not registered, or the registration is not yet active.
- An `ACK` but no callback: your `consumer_uri` is not publicly reachable over HTTPS, or your endpoint did not reply `200`.
- A callback arrives but is not matched: your code looked up the wrong `transaction_id`.
- An empty `providers` list: no empanelled hospital lies inside the radius. Widen the radius and search again.
