---
id: hiecm.decision.encrypt-locally
type: decision
gateway: hiecm
milestone: M1
version: abdm-v3
title: Encrypting identifiers locally rather than through a hosted helper
summary: Encrypt identifiers inside your own system against the published key,
  never through a remote helper.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/encryption.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/concepts/encryption.mdx#encrypt-locally.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.encrypted-identifiers
---

# Encrypting identifiers locally rather than through a hosted helper

## In plain words

**Encrypt inside your own system, against the published ABDM public key.** This is the production path.

| | Encrypt locally | Call a remote helper |
| --- | --- | --- |
| Where the raw value goes | Your process only | Over the network to that host |
| Depends on | The public key | A live third party service |
| Suitable for production | Yes | No |

Sending an Aadhaar number to a remote service so that it can be encrypted defeats the purpose of encrypting it.

## What happens

Fetch the public certificate and encrypt in process. There is no migration from a remote helper, only a change of where one function runs.

## How you know it worked

The raw Aadhaar or mobile number never leaves your process and never reaches your logs. Search your logging for the field names before you call it done.

## When it goes wrong

If a remote helper has already been used in a production path, treat every value that passed through it as disclosed, and move encryption in process before the next release.
