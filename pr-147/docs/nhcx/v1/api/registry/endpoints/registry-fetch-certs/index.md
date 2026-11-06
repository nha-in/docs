# Fetch certificate

`POST /fetch/certs`

Returns a participant's public encryption certificate (PEM X.509 or SPKI key) by participantid; cache it for 24 hours and use it to build the JWE.

### Business purpose

Every NHCX payload is encrypted end-to-end for exactly one recipient so that even the exchange cannot read the clinical and financial content it routes. That guarantee rests on each participant publishing a public certificate in the registry at onboarding. This call is how a sender obtains a counterparty's certificate before encrypting a request or a callback for it. It is item 3 of both sandbox-exit checklists and the endpoint the Integration Handbook names in its encryption steps.

### When to use

Call it before you encrypt the first message to a recipient, then cache the certificate for 24 hours. Fetch it again if encryption or decryption with that recipient fails.

### Preconditions

- You have a valid access token in the `bearer_auth` header.
- You send the recipient's code as `participantid`.
- The recipient has registered a certificate.

### Postconditions

You get the recipient's certificate or public key. Use it to encrypt messages to that recipient.

### Common mistakes

- Fetching the certificate before every request instead of caching it.
- Encrypting with your own certificate instead of the recipient's.
- Assuming the answer is always a full certificate. It may be a bare public key.
- Keeping a cached certificate after the recipient changed it.

### Best practices

- Cache per participantid with a 24-hour TTL, plus a negative path that evicts and re-fetches on encrypt or decrypt failures.
- Implement the import routine as X.509 first, SPKI fallback, treating the 400-byte size hint as diagnostic rather than a hard branch.
- Use the documented algorithm pair RSA-OAEP-256 and A256GCM.
- Re-fetch from the production registry at go-live; sandbox certificates do not carry over.
- Expect annual key rotation by counterparties; the 24-hour cache bounds exposure to a rotation you were not told about.

### Related scenario

A hospital is about to send its first pre-authorisation to a payer. The engine checks its certificate cache, finds no entry, and calls /fetch/certs with the payer's participant code and a Bearer token. The response is a PEM X.509 certificate, which is parsed and cached for 24 hours. The engine builds the JWE protected header with x-hcx-sender_code, x-hcx-recipient_code set to that code and the other x-hcx headers, encrypts the FHIR bundle with RSA-OAEP-256 and A256GCM using the fetched key, and POSTs to /v1/preauth/submit. Later that week the payer rotates its certificate; a PAYR-1001 on the next submission triggers eviction and a fresh fetch.

### Specification

Chapter [Finding participants and policies](/docs/nhcx/v1/getting-started/finding-participants-and-policies) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "participantid": "<payer participant code>"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Headers

- `Accept` (string, required): Always `application/json` on the participant service.

## Body

- `participantid` (string)

## Responses

- `200`: HTTP 200 with a string body containing a PEM-encoded X.509 certificate or an SPKI public key, as uploaded by that participant.
  - `_contentType` (string)
  - `_body` (string)

Example 200 response. The values are placeholders:

```json
{
  "_contentType": "string",
  "_body": "-----BEGIN CERTIFICATE-----\nMIIDdzCCAl+gAwIBAgIEbXq...\n-----END CERTIFICATE-----"
}
```
