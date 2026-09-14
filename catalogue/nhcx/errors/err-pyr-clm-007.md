---
id: nhcx.error.err-pyr-clm-007
type: error
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'ERR-PYR-CLM-007: no preauthorisation or claim exists for the claim''s case
  number'
summary: >-
  The national scheme's reference payer found no earlier preauthorisation or claim
  under the case number on your claim, so raise the claim under the preauthorisation's
  case number.
sources:
- file: catalogue/openapi/.raw/nhcx-package-2026-09-15/nhcx-error.yaml
  hash: sha256:d24ac927ed4dd722e60d7bd1d6fed15de370cc29f750d68999ee56fac93c941b
  note: Recorded from a sandbox run. On none of the NHA error sheets.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.error-code-spaces
  - nhcx.concept.claim-cycle
  - nhcx.concept.pmjay-on-nhcx
  flows:
  - nhcx.flow.claim-submit
  - nhcx.flow.preauth-submit
  - nhcx.flow.pmjay-patient-to-cashless
  endpoints:
  - nhcx.endpoint.claim-submit
  callbacks:
  - nhcx.callback.claim-on-submit
  errors:
  - nhcx.error.payr-1302
---

# ERR-PYR-CLM-007: no preauthorisation or claim exists for the claim's case number

## In plain words

The [PMJAY](../glossary/pmjay.md) payer refused your claim because it found no preauthorisation or claim under the case number you sent.

It returns this code when a claim carries a case number of its own instead of the preauthorisation's.

## Before you start

You sent a request through [NHCX](../../shared/glossary/nhcx.md), and the payer answered it with an error. The answer arrives on the `on_` path paired with your request, such as `/v1/claim/on_submit`. `x-hcx-status` marks it as an error. `x-hcx-error_details` carries the code in `code` and the text in `message`.

Read these fields from the protected header once you open the [JWE](../glossary/jwe.md). Some payers send the same fields in a plain `ProtocolResponse` body instead. Handle both.

The code sits outside the PAYR- ranges. Match it by its full text: `No prior preauthorization or claim record found for case number`.

## What happens

The PMJAY payer raises this code when:

- The claim uses a new case number instead of the one the preauthorisation was raised under.
- The case number has a typo.
- No preauthorisation was raised for the case.

The case number travels as an identifier of the parent resource, the Claim.

## How you know it worked

Send the corrected request. The step is done when the payer answers without this code:

- For a claim, `/v1/claim/on_submit` arrives with no `x-hcx-error_details`, and its bundle carries a `ClaimResponse`.

## When it goes wrong

1. Raise the claim under the case number the preauthorisation used. Carry it in the Claim resource's identifier.
2. Keep the case number with the case in your system from preauthorisation onwards.
3. If no preauthorisation exists, submit one first. See [Submit a preauthorisation](../flows/preauth-submit.md).
4. Send the request again with a fresh `x-hcx-correlation_id`. Reusing the old one returns [NHCX-1006](nhcx-1006.md).
