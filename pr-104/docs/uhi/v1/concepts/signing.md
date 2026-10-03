# Signing UHI requests

Every request on the [UHI](/docs/pr-104/docs/uhi/v1/getting-started/glossary#uhi) network is signed by the participant that sends it. The receiver checks the signature against the sender's public key before it acts on the request. After this page you will know which headers to send, how to build them, and how to check the ones you receive.

## In short

- Sign every outbound call, from your first search to your last callback, with your Ed25519 private key.
- The signature covers `(created) (expires) digest`, where the digest is BLAKE-512 over the exact request body.
- Build a fresh header for every request. A reused or expired header is refused.
- The UHI Gateway adds its own signature, `X-Gateway-Authorization`, to everything it forwards.
- Look up the sender's public key with the [network registry lookup](/docs/pr-104/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) before you trust a signature.

## The headers

| Header                    | Sent by                                                                                                                                                         | Contents                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Authorization`           | The [EUA](/docs/pr-104/docs/uhi/v1/getting-started/glossary#eua) and the [HSPA](/docs/pr-104/docs/uhi/v1/getting-started/glossary#hspa), on every outbound call | An Ed25519 signature over `(created) (expires) digest`, with `keyId` set to `<subscriber-id>\|<pub-key-id>\|ed25519` |
| `X-Gateway-Authorization` | The UHI Gateway, on everything it forwards                                                                                                                      | The same format, with a `keyId` starting `gateway-nha`                                                               |

An EUA's `Authorization` header looks like this:

```text
Authorization: {"headers":"(created) (expires) digest","expires":"1682340844","signature":"PEYK1W+xsuBuyaNbO0BaECKndTEQ9wjQXjkS1CgvuZUZ/mmUCUcqBNCzi2590GeLD4s2bqvv8dCopS9yomMZDA==","created":"1682340834","keyId":"eua-nha|nha.eua.k1|ed25519","algorithm":"ed25519"}
```

The Gateway's header has the same shape, with `"keyId":"gateway-nha|uhi_gateway_pubkeyid|ed25519"`.

## How the signature is built

| Part      | Algorithm | Covers                                          |
| --------- | --------- | ----------------------------------------------- |
| Digest    | BLAKE-512 | The exact bytes of the request body             |
| Signature | Ed25519   | The signing string `(created) (expires) digest` |

1. Serialise the request body once, and keep those bytes.
2. Compute the BLAKE-512 digest of the bytes.
3. Set `created` to now and `expires` a few seconds later.
4. Sign `(created) (expires) digest` with your private key.
5. Send the body byte for byte as you signed it.

Changing one byte of the body after signing breaks the digest, and the call is refused with a `401`. So is a header whose `expires` has passed, which is why every request needs a new one.

Notes for AI agents

**What happens.** Sign the exact byte string your HTTP client sends. Do not let a client library serialise the body again after you sign it. Build a new header on every send, retries included.

**How you know it worked.** The receiver answers `200` with `ACK`, not `401`.

**When it goes wrong.** A `401` has three usual causes. Compare the bytes sent with the bytes hashed. Check that `expires` had not passed when the call arrived. Check that `keyId` names your subscriber ID and the key ID you registered.

## Generate your keys and headers

Use the [Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility). It generates your Ed25519 key pair and signs each payload, so you do not implement Ed25519 and BLAKE-512 yourself.

- Share only the public key, at [sandbox registration](/docs/pr-104/docs/uhi/v1/getting-started/sandbox#3-submit-the-sandbox-registration-form). Keep the private key on your server.
- The signing code the Gateway runs is [Crypt.java](https://github.com/NHA-ABDM/UHI/blob/sandbox/src/gateway/Discovery/src/main/java/in/gov/abdm/uhi/discovery/security/Crypt.java). The [UHI header signing document](https://github.com/NHA-ABDM/UHI/blob/main/docs/Signing%20UHI%20APIs_Final%20\(1\).docx) describes the scheme in full.

Notes for AI agents

**What happens.** Generate the key pair once with the Header Generation Utility. Submit the public key at sandbox registration. Keep the private key in server-side secret storage, never in a mobile or browser build, a repository or a log.

## Checking a signature you receive

- **A call forwarded by the Gateway**, such as the first search reaching an HSPA, carries `X-Gateway-Authorization`. Check it against the Gateway's public key.
- **A direct call**, such as the second search or any call from `init` onwards, carries the sender's `Authorization`. Look up that sender with the [network registry lookup](/docs/pr-104/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup), then check the signature against the public key it returns.

Notes for AI agents

**What happens.** Pick the header by route. On a forwarded call, check `X-Gateway-Authorization`, or `Proxy-Authorization` if it is absent. On a direct call, split the sender's `keyId` into subscriber ID and key ID, look the sender up, and check `Authorization`. Check against the raw bytes you received, before you parse the body.

**How you know it worked.** A call with a valid signature and an unexpired `expires` passes. The same body with one byte changed fails.

**When it goes wrong.** Reject a call whose signature fails or whose `expires` has passed, and do not act on it. A lookup that returns `404` means no participant matches, so the call is not trusted.

## Confirm at onboarding

- **The separate `Digest` header.** Send `Digest: BLAKE-512=<base64 digest of the body>` beside `Authorization`. The digest is also inside the signed string, so a receiver that does not read the header still checks the body.
- **The name of the Gateway's header.** Read `X-Gateway-Authorization`, and fall back to `Proxy-Authorization` if it is absent.

## Next steps

- [Register in the sandbox](/docs/pr-104/docs/uhi/v1/getting-started/sandbox#3-submit-the-sandbox-registration-form) with your public key.
- [Look up a network participant](/docs/pr-104/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup) to check a signature.
- [Browse the UHI API reference](/docs/pr-104/docs/uhi/v1/api).
