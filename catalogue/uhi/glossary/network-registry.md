---
id: uhi.glossary.network-registry
type: glossary
gateway: uhi
milestone: n/a
version: uhi-v1
title: Network registry, the register of UHI participants and their keys
summary: The register of UHI participants and their public keys. Its lookup
  returns another participant's key so you can check its signature.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_uhi.mdx
    status: page
    note: Generated from site/docs/_glossary/_uhi.mdx#network-registry. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-registry-lookup
  concepts:
    - uhi.concept.registry-lookup
    - uhi.concept.verifying-signatures
---

# Network registry, the register of UHI participants and their keys

## In plain words

The register of UHI participants and their public keys. `POST /api/v1/networkregistry/lookup` returns another participant's public key and details, so you can check its signature. See [Network registry lookup](/docs/uhi/v1/concepts/registry-lookup).
