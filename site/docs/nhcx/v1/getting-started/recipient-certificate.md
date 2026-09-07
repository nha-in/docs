---
title: Fetching a recipient's certificate
sidebar_label: Recipient certificate
description: Fetching and caching the public key of the participant you are about to send a message to.
verification: unverified
source: "AWS Sandbox Participant Service APIs Postman collection; NHCX Integration Handbook §3.3, §5.5, §5.6; NHCX Code Snippets references for payload preparation; Common Mistakes while implementing through NHCX #7"
sidebar_position: 6
---

# Fetching a recipient's certificate
Before you can seal a message for anyone, you need their public key. The participant service hands it out against a participant code.

## In short

- The participant service hands out a public key against a participant code.
- You may get a full X.509 certificate or a bare SPKI public key. Handle both.
- Cache by participant code for 24 hours; keys change rarely.
- Fetch against the `processingid` from the policy lookup, not the insurer's `payerid`.

## The call

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'bearer_auth: Bearer <access token>' \
  --data-raw '{ "participantid": "1000003538@hcx" }'
```

That participant code is the sandbox dummy payer. For the smoke test at the end of this section it is the recipient.

## What comes back

Key material in PEM text. None of the source documents gives the JSON envelope it arrives in, only the material itself, so inspect one response before writing the parser. Usually a full X.509 certificate:

```
-----BEGIN CERTIFICATE-----
MIID0zCCArugAwIBAgIUax...
-----END CERTIFICATE-----
```

Sometimes, for a participant who registered a bare key, an SPKI public key:

```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEF...
-----END PUBLIC KEY-----
```

Handle both. Try to load it as a certificate and take the public key out of it; if that fails, load it as a public key directly. The handbook's rule of thumb is that anything under about 400 bytes is a bare key.

## Cache it

Keys change rarely. Fetching one before every message is a round trip that buys nothing, and the portal's own code sample says to store certificates locally rather than call this endpoint repeatedly. Cache by participant code for 24 hours, and refresh early if a decryption on the other side starts failing, which is the sign that they rotated.

## Whose certificate

The participant code to fetch is the `processingid` from the policy lookup in the previous chapter, not the insurer's `payerid`. For the smoke test it is the dummy payer's code, `1000003538@hcx`.
