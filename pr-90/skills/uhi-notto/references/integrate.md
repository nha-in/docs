# Integrate UHI NOTTO hospital discovery

The calls themselves: where they live, what they need in their headers, one request written out in full, and how every call is signed and matched.

## Hosts

- `https://uhigatewaysandbox.abdm.gov.in` Sandbox
- `https://uhigateway.abdm.gov.in` Production
- `https://uhigatewaybeta.abdm.gov.in` Beta. Use it only when NHA asks you to.
- `https://<provider_uri>` The HSPA's provider_uri, taken from context.provider_uri in its on_search.
- `https://<consumer_uri>` The EUA's consumer_uri, taken from context.consumer_uri in the request.

## Endpoints

| Method | Path | What it does | Direction |
| --- | --- | --- | --- |
| `POST` | `/api/v1/uhi/search` | Search through the Gateway |  |
| `POST` | `/search` | Search an HSPA | Gateway / EUA → HSPA |
| `POST` | `/api/v1/uhi/on_search` | Send a catalog through the Gateway |  |
| `POST` | `/on_search` | Send a catalog to the EUA | Gateway / HSPA → EUA |
| `POST` | `/api/v1/networkregistry/lookup` | Look up a network participant |  |

## Headers

| Header | What it is |
| --- | --- |
| `Authorization` | UHI Auth header |

## A request, in full

```bash
curl --request POST \
  --url https://uhigatewaysandbox.abdm.gov.in/api/v1/uhi/search \
  --header 'Authorization: <SIGNED_AUTHORIZATION_HEADER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:86100",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "nha.eua",
    "consumer_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",
    "message_id": "e9a19230-f951-11ec-b135-53aea776f66b",
    "timestamp": "2026-07-15T15:24:35",
    "transaction_id": "e9a19230-f951-11ec-b135-53aea776f66b"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "3",
          "name": "Kidney"
        }
      },
      "fulfillment": {
        "type": "NOTTO_HOSPITAL",
        "start": {
          "time": {
            "timestamp": "2026-07-15T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-07-15T23:59:59"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "NOTTO",
          "name": "NOTTO"
        }
      }
    }
  }
}'
```

## What each call is for

### Search through the Gateway (`uhi_network_gateway_search`)

The [EUA](/docs/uhi/v1/getting-started/glossary#eua) sends a patient's search to the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway). The Gateway checks the signature, replies at once with an `ACK`, and passes the search to every [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) registered for the `context.domain` you send. Results never come back on this call. Each HSPA's catalog arrives later as an `on_search` at your `consumer_uri`.

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

From `uhi.endpoint.network-gateway-search`.

### Search an HSPA (`uhi_network_search`)

Every [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) exposes this endpoint to receive searches. The first search of an exchange comes from the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway), signed with `X-Gateway-Authorization`. In Physical Consultation, a second search for the chosen doctor's slots comes [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) from the [EUA](/docs/uhi/v1/getting-started/glossary#eua), signed with `Authorization`. Reply with an `ACK` at once, then answer with `on_search`.

From `uhi.endpoint.network-search`.

### Send a catalog through the Gateway (`uhi_network_gateway_on_search`)

An [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends its catalog here in answer to a search the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) forwarded to it. The Gateway replies with an `ACK` and relays the catalog to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) as `on_search`. Echo the `transaction_id` and `message_id` of the search you received, and put your `provider_id` and `provider_uri` in the `context`.

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

From `uhi.callback.network-gateway-on-search`.

### Send a catalog to the EUA (`uhi_network_on_search`)

Every [EUA](/docs/uhi/v1/getting-started/glossary#eua) exposes this endpoint at its [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) to receive catalogs. The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) relays the answer to a broadcast search, signed with `X-Gateway-Authorization`. An [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) answering a direct search sends it itself, signed with `Authorization`. Reply with an `ACK` at once. Several HSPAs can answer one search, each with its own `on_search`.

From `uhi.callback.network-on-search`.

### Look up a network participant (`uhi_network_registry_lookup`)

An [EUA](/docs/uhi/v1/getting-started/glossary#eua) or an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) calls the [network registry](/docs/uhi/v1/getting-started/glossary#network-registry) to fetch another participant's public key and details. Call it before your first direct call to a participant, and before you act on a direct call you receive. Name the participant in the body, taking `subscriber_id` and `pub_key_id` from the sender's `keyId`. A `keyId` has the form `<subscriber-id>|<pub-key-id>|ed25519`. See [Registry lookup](/docs/uhi/v1/concepts/registry-lookup).

Sign the request with your own fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

From `uhi.endpoint.network-registry-lookup`.

## Signing, the context block and the registry lookup

### The context block every UHI call carries

Every call, in both directions, starts with the same block. Build a fresh one for each request.

```json
{
  "context": {
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_SUBSCRIBER_ID_FROM_SANDBOX_REGISTRATION>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_BASE_URL>",
    "message_id": "<NEW_UUID>",
    "transaction_id": "<NEW_UUID_FOR_A_NEW_EXCHANGE>",
    "timestamp": "<NOW_IN_UTC_RFC3339>"
  }
}
```

| Field | Required | What it holds |
| --- | --- | --- |
| `domain` | Yes | The service, such as `nic2004:85112` for PM-JAY HEM. The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) routes a search to every [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) registered for it. [Each service's value](/docs/uhi/v1/services) |
| `country` | Yes | `IND` |
| `city` | Yes | `std:011` |
| `action` | Yes | The name of this call, such as `search` or `on_search` |
| `core_version` | Yes | `0.7.1` |
| `consumer_id` | Yes | The [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s subscriber ID |
| `consumer_uri` | Yes | The EUA's callback base URL. It must share a domain name with `consumer_id` |
| `provider_id` | No | The HSPA's subscriber ID |
| `provider_uri` | No | The HSPA's base URL for direct calls |
| `message_id` | Yes | Unique for one request and its callback |
| `transaction_id` | Yes | Unique for one exchange, and the same on every call from `search` through `confirm` |
| `timestamp` | Yes | When the request was generated, in RFC 3339 format |
| `key` | No | The sender's encryption public key |
| `ttl` | No | How long after `timestamp` the message stays valid, as an ISO 8601 duration |

Times inside `message`, such as a fulfillment's start and end, follow ISO 8601 without a time zone: `2022-07-15T00:00:00`.

#### Before you start

A subscriber ID from sandbox registration, and a public HTTPS callback base URL that shares a domain name with it.

#### What happens

Build a new `context` for every request, with a new `message_id` and a current `timestamp`. Create a new `transaction_id` only when an exchange starts at `search`, and reuse it on every call through `confirm`. Set `action` to the call you are making and `domain` to the value on the service page.

#### How you know it worked

The `on_search` for your request echoes your `transaction_id` and `message_id`, and arrives on your `consumer_uri`.

#### When it goes wrong

No callback arrives: check that `consumer_uri` is public over HTTPS and shares a domain name with `consumer_id`. A `transaction_id` reused across two exchanges mixes their callbacks, so neither can be matched.

From `uhi.concept.context-block`.

### The signature headers on a UHI call

| Header | Sent by | Contents |
| --- | --- | --- |
| `Authorization` | The [EUA](/docs/uhi/v1/getting-started/glossary#eua) and the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa), on every outbound call | An Ed25519 signature over `(created) (expires) digest`, with `keyId` set to `<subscriber-id>\|<pub-key-id>\|ed25519` |
| `X-Gateway-Authorization` | The UHI Gateway, on everything it forwards | The same format, with a `keyId` starting `gateway-nha` |

An EUA's `Authorization` header looks like this:

```text
Authorization: {"headers":"(created) (expires) digest","expires":"1682340844","signature":"PEYK1W+xsuBuyaNbO0BaECKndTEQ9wjQXjkS1CgvuZUZ/mmUCUcqBNCzi2590GeLD4s2bqvv8dCopS9yomMZDA==","created":"1682340834","keyId":"eua-nha|nha.eua.k1|ed25519","algorithm":"ed25519"}
```

The Gateway's header has the same shape, with `"keyId":"gateway-nha|uhi_gateway_pubkeyid|ed25519"`.

From `uhi.concept.signing-headers`.

### How a UHI request signature is built

| Part | Algorithm | Covers |
| --- | --- | --- |
| Digest | BLAKE-512 | The exact bytes of the request body |
| Signature | Ed25519 | The signing string `(created) (expires) digest` |

1. Serialise the request body once, and keep those bytes.
2. Compute the BLAKE-512 digest of the bytes.
3. Set `created` to now and `expires` a few seconds later.
4. Sign `(created) (expires) digest` with your private key.
5. Send the body byte for byte as you signed it.

Changing one byte of the body after signing breaks the digest, and the call is refused with a `401`. So is a header whose `expires` has passed, which is why every request needs a new one.

#### What happens

Sign the exact byte string your HTTP client sends. Do not let a client library serialise the body again after you sign it. Build a new header on every send, retries included.

#### How you know it worked

The receiver answers `200` with `ACK`, not `401`.

#### When it goes wrong

A `401` has three usual causes. Compare the bytes sent with the bytes hashed. Check that `expires` had not passed when the call arrived. Check that `keyId` names your subscriber ID and the key ID you registered.

From `uhi.concept.signature-construction`.

### Generating UHI signing keys and headers

Use the [Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility). It generates your Ed25519 key pair and signs each payload, so you do not implement Ed25519 and BLAKE-512 yourself.

- Share only the public key, at [sandbox registration](/docs/uhi/v1/getting-started/sandbox#3-submit-the-sandbox-registration-form). Keep the private key on your server.
- The signing code the Gateway runs is [Crypt.java](https://github.com/NHA-ABDM/UHI/blob/sandbox/src/gateway/Discovery/src/main/java/in/gov/abdm/uhi/discovery/security/Crypt.java). The [UHI header signing document](https://github.com/NHA-ABDM/UHI/blob/main/docs/Signing%20UHI%20APIs_Final%20(1).docx) describes the scheme in full.

#### What happens

Generate the key pair once with the Header Generation Utility. Submit the public key at sandbox registration. Keep the private key in server-side secret storage, never in a mobile or browser build, a repository or a log.

From `uhi.concept.key-generation`.

### Checking the signature on a UHI call you receive

- **A call forwarded by the Gateway**, such as the first search reaching an HSPA, carries `X-Gateway-Authorization`. Check it against the Gateway's public key.
- **A direct call**, such as the second search or any call from `init` onwards, carries the sender's `Authorization`. Look up that sender with the [network registry lookup](/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup), then check the signature against the public key it returns.

#### What happens

Pick the header by route. On a forwarded call, check `X-Gateway-Authorization`, or `Proxy-Authorization` if it is absent. On a direct call, split the sender's `keyId` into subscriber ID and key ID, look the sender up, and check `Authorization`. Check against the raw bytes you received, before you parse the body.

#### How you know it worked

A call with a valid signature and an unexpired `expires` passes. The same body with one byte changed fails.

#### When it goes wrong

Reject a call whose signature fails or whose `expires` has passed, and do not act on it. A lookup that returns `404` means no participant matches, so the call is not trusted.

From `uhi.concept.verifying-signatures`.

### When to call the UHI network registry lookup

| You are | Call it before | To get |
| --- | --- | --- |
| An [EUA](/docs/uhi/v1/getting-started/glossary#eua) | Your first direct call to an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa), such as `init` | The HSPA's public key, to check the signature on its direct callbacks |
| An EUA or an HSPA | Acting on any direct call you receive | The sender's public key, to check its `Authorization` header |

A call the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) forwards carries the Gateway's own `X-Gateway-Authorization` header instead. Check that one against the Gateway's key. See [Signing](/docs/uhi/v1/concepts/signing#checking-a-signature-you-receive).

#### What happens

Take `subscriber_id` and `pub_key_id` from the sender's `keyId`, and send the lookup. Trust the key only while `status` is `SUBSCRIBED` and the current time falls between `valid_from` and `valid_until`.

#### How you know it worked

A `200` returns a record whose `subscriber_id` and `pub_key_id` match the sender's `keyId`.

From `uhi.concept.registry-lookup`.

### Calls routed through the UHI Gateway

Discovery is the only stage the Gateway routes.

1. The EUA signs a `search` and sends it to `POST /api/v1/uhi/search`.
2. The Gateway checks the signature and replies with an `ACK`.
3. The Gateway adds its own `X-Gateway-Authorization` signature and sends the search to every HSPA registered for the `context.domain`.
4. Each HSPA sends its catalog to `POST /api/v1/uhi/on_search`.
5. The Gateway relays each `on_search` to the EUA's `consumer_uri`.

Several HSPAs can answer one search. See [Messages and callbacks](/docs/uhi/v1/concepts/messages#timeouts) for how long to wait.

#### What happens

An EUA sends `search` to `POST /api/v1/uhi/search` and receives every `on_search` on its `consumer_uri`. An HSPA answers a forwarded `search` with an `ACK`, then sends its catalog to `POST /api/v1/uhi/on_search`, never to the EUA.

#### When it goes wrong

An HSPA that checks `Authorization` on a forwarded search finds the Gateway's `X-Gateway-Authorization` instead. Check the header the route carries.

From `uhi.concept.gateway-routes`.

### Timeouts for a UHI search with no end signal

A search has no end signal. The Gateway broadcasts it to every HSPA registered for the domain, and each one answers separately. Nothing tells you the last answer has arrived.

- Set a timeout for each search.
- Render each `on_search` as it arrives. Do not wait for all of them.
- Paginate on your side.
- When the timeout passes with nothing received, stop waiting and offer a retry.

Blood Bank's figure is 10 to 15 seconds. Aggregate its answers by `transaction_id` within that window.

#### What happens

Read the timeout from configuration and start it when `search` is sent. Render each `on_search` for that `transaction_id` as it arrives. When the timeout passes, stop waiting on that exchange.

#### How you know it worked

The first result shows before the timeout ends, and a search that gets no answer ends in a retry offer, not a loading screen.

#### When it goes wrong

A screen that waits for a final answer never finishes, because no final answer is sent. A timeout fixed in code cannot take your service's figure once it is agreed at onboarding.

From `uhi.concept.timeouts`.
