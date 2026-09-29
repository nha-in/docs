---
id: uhi.concept.signing-headers
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: The signature headers on a UHI call
summary: The EUA and HSPA sign every outbound call in Authorization; the UHI
  Gateway adds X-Gateway-Authorization to everything it forwards.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/signing.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/signing.mdx#the-headers. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.signature-construction
    - uhi.concept.verifying-signatures
  endpoints:
    - uhi.endpoint.network-registry-lookup
---

# The signature headers on a UHI call

## In plain words

| Header | Sent by | Contents |
| --- | --- | --- |
| `Authorization` | The [EUA](/docs/uhi/v1/getting-started/glossary#eua) and the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa), on every outbound call | An Ed25519 signature over `(created) (expires) digest`, with `keyId` set to `<subscriber-id>\|<pub-key-id>\|ed25519` |
| `X-Gateway-Authorization` | The UHI Gateway, on everything it forwards | The same format, with a `keyId` starting `gateway-nha` |

An EUA's `Authorization` header looks like this:

```text
Authorization: {"headers":"(created) (expires) digest","expires":"1682340844","signature":"PEYK1W+xsuBuyaNbO0BaECKndTEQ9wjQXjkS1CgvuZUZ/mmUCUcqBNCzi2590GeLD4s2bqvv8dCopS9yomMZDA==","created":"1682340834","keyId":"eua-nha|nha.eua.k1|ed25519","algorithm":"ed25519"}
```

The Gateway's header has the same shape, with `"keyId":"gateway-nha|uhi_gateway_pubkeyid|ed25519"`.
