# Building and sending a JWE

A message on the exchange is a JSON Web Encryption token: a readable protected header and an encrypted body, serialised as five base64url parts joined by dots. The body is a FHIR bundle. This chapter builds one with an empty bundle, so that what you are testing is the envelope and the plumbing, not the FHIR.

## In short

- A message is a JWE: a readable protected header and an encrypted FHIR bundle, compact serialised.
- Use `RSA-OAEP-256` with `A256GCM`. One protocol page says `RSA-OAEP`, and the samples outnumber it.
- The three IDs are fresh UUIDs; only `correlation_id` is reused, on the answer.
- A `202` back means the envelope was valid and the message queued. It is not the decision.

## The protected header

Every field the exchange needs to route and log the message. All the `x-hcx-` names are fixed.

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "x-hcx-sender_code": "1000004446@hcx",
  "x-hcx-recipient_code": "1000003538@hcx",
  "x-hcx-api_call_id": "a1b2c3d4-e5f6-4890-abcd-ef1234567890",
  "x-hcx-request_id": "f0e1d2c3-b4a5-4978-8fed-cba987654321",
  "x-hcx-correlation_id": "11223344-5566-4788-99aa-bbccddeeff00",
  "x-hcx-workflow_id": "12",
  "x-hcx-timestamp": "2026-09-04T11:46:34+05:30",
  "x-hcx-status": "request.initiated",
  "x-hcx-ben-abha-id": "91123456781234"
}
```

- `alg` and `enc` are the encryption. The protocol page says `RSA-OAEP`; the handbook, the code samples and every Postman body on the portal say `RSA-OAEP-256`. Use `-256`.
- The three IDs are fresh UUIDs. `api_call_id` is new per call, `request_id` per request, `correlation_id` per conversation and reused on the answer.
- `workflow_id` says which step this is. `12` is a new preauthorisation.
- `timestamp` is ISO 8601. Which zone is contested: the handbook says Indian time and that UTC will fail validation, the FAQ says UTC with a trailing `Z`. The sample bundles use `+05:30`. Confirm before building; it is a validated field.
- `status` is always `request.initiated` on something you initiate.
- `ben-abha-id` is the beneficiary's ABHA number without hyphens.

## The smallest possible bundle

```json
{
  "resourceType": "Bundle",
  "id": "smoke-test-001",
  "type": "collection",
  "timestamp": "2026-09-04T11:46:34+05:30",
  "entry": []
}
```

This is a valid FHIR Bundle with nothing in it. The exchange will accept it, because it only reads the header. The dummy payer will reject it, because there is no Claim inside. That rejection is what the next chapter catches.

## Sealing it

The recipe, from the message-security page. Base64url the header, generate a random content key, and encrypt that key with the recipient's public key using RSA-OAEP. Generate an IV, encrypt the bundle with AES-256-GCM using the header as additional authenticated data, and join the five parts. A JOSE library does all of it.

Python, with `jwcrypto` and `cryptography`:

```python

from datetime import datetime, timezone, timedelta
from cryptography import x509
from cryptography.hazmat.primitives import serialization
from jwcrypto import jwk, jwe

def public_key_from_pem(pem: bytes) -> jwk.JWK:
    """Accepts an X.509 certificate or a bare SPKI public key."""
    try:
        cert = x509.load_pem_x509_certificate(pem)
        pem = cert.public_key().public_bytes(
            serialization.Encoding.PEM,
            serialization.PublicFormat.SubjectPublicKeyInfo)
    except ValueError:
        pass  # already a bare public key
    return jwk.JWK.from_pem(pem)

def now_ist() -> str:
    return datetime.now(timezone(timedelta(hours=5, minutes=30))).isoformat(timespec="seconds")

def seal(bundle: dict, recipient_pem: bytes, sender: str, recipient: str,
         workflow: str, correlation_id: str, abha: str) -> str:
    header = {
        "alg": "RSA-OAEP-256", "enc": "A256GCM",
        "x-hcx-sender_code": sender,
        "x-hcx-recipient_code": recipient,
        "x-hcx-api_call_id": str(uuid.uuid4()),
        "x-hcx-request_id": str(uuid.uuid4()),
        "x-hcx-correlation_id": correlation_id,
        "x-hcx-workflow_id": workflow,
        "x-hcx-timestamp": now_ist(),
        "x-hcx-status": "request.initiated",
        "x-hcx-ben-abha-id": abha,
    }
    token = jwe.JWE(json.dumps(bundle).encode(), protected=json.dumps(header))
    token.add_recipient(public_key_from_pem(recipient_pem))
    return token.serialize(compact=True)
```

The result is one long string with four dots in it. That is the whole message.

Java users can take the portal's `JWEPayloadUtil` sample as-is; it does the same thing with Nimbus, `JWEAlgorithm.RSA_OAEP_256` and `EncryptionMethod.A256GCM`, passing the `x-hcx-` fields as custom header parameters.

## Sending it

The request body is a JSON object with one field.

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/v1/preauth/submit' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <access token>' \
  --data-raw '{ "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...." }'
```

## What comes straight back

`202 Accepted`. The receipt below is the shape the sources define for a *recipient* acknowledging a delivery, which is what your own callback must return in the next chapter. Treat it as the pattern rather than a guaranteed gateway body, and inspect a real response:

```json
{
  "timestamp": "04/09/2026 11:46:35:120",
  "api_call_id": "a1b2c3d4-e5f6-4890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-4788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1000003538@hcx",
    "entity_type": "preauth",
    "protocol_status": "request.queued"
  },
  "error": { "code": "", "message": "" }
}
```

This is not the decision. It says the envelope was valid and the message has been queued for the recipient. The decision, or in this case the rejection, comes later, on your callback.

If instead you get `400`, the envelope failed validation. If you get `401`, go back to the token chapter. Anything else about the bundle itself will not show up here at all; the exchange never opens it.
