---
id: uhi.sandbox.registration-form
type: sandbox
gateway: uhi
milestone: n/a
version: uhi-v1
title: Register in the UHI sandbox
summary: The sandbox registration form takes your role, callback URL and public
  key, and returns a subscriber ID, a public key ID and sandbox access.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/sandbox.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/sandbox.mdx#3-submit-the-sandbox-registration-form.
      Edit the page, never this file.
related:
  sandbox:
    - uhi.sandbox.key-pair
    - uhi.sandbox.base-urls
  glossary:
    - uhi.glossary.consumer-uri
  concepts:
    - uhi.concept.ack-then-answer
---

# Register in the UHI sandbox

## In plain words

Submit the sandbox registration form with three things:

| Field | What to give |
| --- | --- |
| Role | EUA or HSPA |
| Callback URL | Your public HTTPS `consumer_uri`, or `provider_uri` for an HSPA |
| Public key | The public half of the key pair from step 2 |

**You get:** a subscriber ID, a public key ID and sandbox access. The utility
signs with both IDs, so keep them.
