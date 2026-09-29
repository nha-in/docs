---
description: Prove your UHI request signature against the sandbox Gateway before you build a flow on it.
argument-hint: '[path to the signing module]'
---

Prove the signing path in `$ARGUMENTS` with one signed PM-JAY HEM search before any flow is built on it. With no argument, find the code that builds the `Authorization` header.

Every UHI call is signed, so a wrong signature stops you on your first request. PM-JAY HEM is the smallest exchange on the network: one search through the Gateway and one callback, with no direct calls.

## What this runs

`POST /api/v1/uhi/search` on `https://uhigatewaysandbox.abdm.gov.in`, carrying a PM-JAY HEM search: `context.domain` `nic2004:85112`, `action` `search`, `fulfillment.type` `PMJAYHEM`, a state in capitals with its numeric code, your `consumer_id` and `consumer_uri`, a fresh `message_id` and a fresh `transaction_id`.

Load the `uhi-pmjay-hem` skill for the full body. Its `references/integrate.md` carries the request and the headers.

## Sign it

1. Serialise the body once, and keep those bytes.
2. Build the `Authorization` header over them, through the app's own signing function, not a copy of it. The signing string is `(created) (expires) digest`, the digest is BLAKE-512 over the body, the signature is Ed25519, and `keyId` is `<subscriber-id>|<pub-key-id>|ed25519`.
3. Send the body byte for byte as you signed it.

The specification declares `Authorization` as the one signature header, with the digest signed inside it. Whether a separate `Digest` header is also expected is confirmed at onboarding. Prove `Authorization` here.

The [Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) generates the key pair and signs a payload. Use it as the reference to compare your header against.

## Passing

HTTP 200 whose body carries `ACK` with an empty `error`. Then an `on_search` arrives at `<consumer_uri>/on_search` carrying your `transaction_id` and `message_id`. Expect one `on_search` for this search. Report the `keyId`, the body length you signed and the `on_search` you received, then stop.

## Make it disagree with you

A signature check that cannot fail proves nothing. After the pass, send twice more:

1. The same signed header with one byte of the body changed. It must fail with `401`.
2. The same header and body again, unchanged, after `expires` has passed. It must fail with `401`.

If either is accepted, your header is not what the Gateway is checking. Stop and find out why.

## Failing

A `401` has three usual causes. Check them in this order.

- **The body changed after signing.** Compare the bytes sent with the bytes hashed. A client library that serialises the body again after you sign it breaks the digest.
- **The header was reused or has expired.** Build a new header for every send, retries included. `expires` must not have passed when the call arrived.
- **The wrong `keyId`.** It names your subscriber ID and the key ID you registered, separated by `|`, ending in `ed25519`.

A `403` is not a signing fault. Your public key is not registered, or your registration is not yet active. A retry does not help.

A `200` with `ACK` and no `on_search` is not a signing fault either. Your `consumer_uri` is not public over HTTPS, or your endpoint did not answer `200`. Run `/uhi-decode-response`.

Report the failing case and what you changed. Do not move on to a flow until this passes.
