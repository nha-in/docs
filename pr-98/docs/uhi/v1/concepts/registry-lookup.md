# Network registry lookup

The [network registry](/docs/pr-98/docs/uhi/v1/getting-started/glossary#network-registry) holds every [UHI](/docs/pr-98/docs/uhi/v1/getting-started/glossary#uhi) participant's public key. Call `POST /api/v1/networkregistry/lookup` to fetch another participant's key and details, so you can check its signature. After this page you will know when to call it, what to send and what comes back.

## When to call it

| You are                                                        | Call it before                                                                                             | To get                                                                |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| An [EUA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#eua) | Your first direct call to an [HSPA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#hspa), such as `init` | The HSPA's public key, to check the signature on its direct callbacks |
| An EUA or an HSPA                                              | Acting on any direct call you receive                                                                      | The sender's public key, to check its `Authorization` header          |

A call the [UHI Gateway](/docs/pr-98/docs/uhi/v1/getting-started/glossary#uhi-gateway) forwards carries the Gateway's own `X-Gateway-Authorization` header instead. Check that one against the Gateway's key. See [Signing](/docs/pr-98/docs/uhi/v1/concepts/signing#checking-a-signature-you-receive).

Notes for AI agents

**What happens.** Take `subscriber_id` and `pub_key_id` from the sender's `keyId`, and send the lookup. Trust the key only while `status` is `SUBSCRIBED` and the current time falls between `valid_from` and `valid_until`.

**How you know it worked.** A `200` returns a record whose `subscriber_id` and `pub_key_id` match the sender's `keyId`.

## Send the lookup

Sign the request with your own key, as you sign every UHI call. The body names the participant you want.

```bash
curl -X POST https://uhigatewaysandbox.abdm.gov.in/api/v1/networkregistry/lookup \  -H "Content-Type: application/json" \  -H 'Authorization: <SIGNED_HEADER_FROM_THE_HEADER_GENERATION_UTILITY>' \  -H 'Digest: BLAKE-512=<DIGEST_FROM_THE_HEADER_GENERATION_UTILITY>' \  --data-binary @lookup.json
```

`lookup.json`:

```json
{  "subscriber_id": "<SUBSCRIBER_ID_FROM_THE_SENDER_KEYID>",  "type": "<EUA_OR_HSPA>",  "domain": "<CONTEXT_DOMAIN_OF_THE_SERVICE>",  "country": "IND",  "city": "std:011",  "pub_key_id": "<PUB_KEY_ID_FROM_THE_SENDER_KEYID>"}
```

A sender's `keyId` has the form `<subscriber-id>|<pub-key-id>|ed25519`. Take `subscriber_id` and `pub_key_id` from it. Send the body byte for byte as you signed it.

The full request and response schema is on the [lookup reference page](/docs/pr-98/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup).

## What comes back

A `200` returns the participant's subscriber record.

| Field                       | What it holds                                                   |
| --------------------------- | --------------------------------------------------------------- |
| `subscriber_id`             | The participant's registered domain name                        |
| `participant_id`            | A unique ID for the participant on the network                  |
| `pub_key_id`                | The ID of the key, which matches the middle part of its `keyId` |
| `encr_public_key`           | The participant's encryption public key                         |
| `subscriber_url`            | The participant's callback URL                                  |
| `type`                      | `consumer`, `provider` or `gateway`                             |
| `domain`, `country`, `city` | Where the participant is registered                             |
| `status`                    | `INITIATED`, `SUBSCRIBED` or `UNSUBSCRIBED`                     |
| `valid_from`, `valid_until` | When the key is valid                                           |

## When it goes wrong

| Response | Likely cause                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| `401`    | Your own header is wrong: signed over a different body, reused, expired, or with the wrong `keyId`               |
| `403`    | Your public key is not registered, or your registration is not yet active                                        |
| `404`    | No participant matches the body. The response carries an [error object](/docs/pr-98/docs/uhi/v1/concepts/errors) |

Notes for AI agents

**What happens.** A failed lookup returns a status and no subscriber record. Read the status before the body.

**When it goes wrong.** On `401`, build a fresh header over the exact bytes you send, and check your `keyId`. On `403`, confirm your registration is complete and uses the public key you sign with; a retry does not help. On `404`, check that `subscriber_id` and `pub_key_id` came from the right parts of the sender's `keyId`. Log the error object, and do not trust the call you were checking.

## Next steps

- [Signing](/docs/pr-98/docs/uhi/v1/concepts/signing): build your header and check the ones you receive.
- [Routes](/docs/pr-98/docs/uhi/v1/concepts/routes): which calls are direct, and so need a lookup.
- [Lookup reference](/docs/pr-98/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup): try the call.
