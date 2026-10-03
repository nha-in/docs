---
id: hiecm.concept.scan-and-register-qr
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: The counter QR code for scan and register
summary: The URL a facility's counter QR code holds, hip-id and counter-id on
  the PHR share-profile page, and how each comes back in the share.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/use-cases/scan-and-register.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/use-cases/scan-and-register.mdx#scan-and-register-qr.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m1-receive-patient-share
  flows:
    - hiecm.flow.scan-and-register-share
    - hiecm.flow.p2-scan-and-share
  glossary:
    - shared.glossary.hfr
    - hiecm.glossary.hip
  troubleshooting:
    - hiecm.troubleshooting.callback-never-arrives
---

# The counter QR code for scan and register

## In plain words

The QR code at each counter holds this URL. Your system can generate it and
print one per counter:

```text
https://phrsbx.abdm.gov.in/share-profile?hip-id=<HIP_ID>&counter-id=<COUNTER_ID>
```

| Parameter | What it holds |
| --- | --- |
| `hip-id` | Your facility's HIP id, the facility ID it holds in the [HFR](/docs/hiecm/v3/getting-started/glossary#hfr). The share arrives with the same value in `X-HIP-ID` and `metaData.hipId`. |
| `counter-id` | The counter, such as `OPD1`: 1 to 20 alphanumeric characters that you choose. It arrives as `metaData.context`. Never use the facility ID, the HIP id or the HIP name. |

`phrsbx.abdm.gov.in` is the sandbox host. Use one code per counter, so the
token you hand back belongs to that counter's queue.

## Before you start

A facility ID linked to your bridge, and a callback URL registered for that bridge and reachable from the public internet.

## What happens

Build the URL from the facility ID and a counter id of your own, render it as a QR code, and print or display it at the counter. Keep the counter id stable: a reprinted code with a new counter id starts a new queue. `phrsbx.abdm.gov.in` is the sandbox host; confirm the production host at onboarding.

## How you know it worked

A PHR app scans the code, the patient agrees to share, and a POST arrives on your bridge at `/api/v3/hip/patient/share` whose `metaData.context` is the counter id in the code.

## When it goes wrong

The app scans the code but nothing arrives: the bridge URL for that facility points somewhere else. See [the callback never arrives](/docs/hiecm/v3/troubleshooting/callback-never-arrives).
