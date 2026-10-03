---
id: hiecm.troubleshooting.linked-but-patient-sees-no-record
type: troubleshooting
gateway: hiecm
milestone: M2
version: abdm-v3
title: Care contexts were accepted for linking but the patient does not see the record
summary: >
  The hospital's linking call was accepted and the patient's app shows
  nothing. Either the link did not complete, or the link is there and the
  record itself has not been fetched yet.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_link_on_carecontext.mdx
    fetched: 2026-10-03
    hash: sha256:3982cb5a8a022bd0fc23ee5ff1a583187a1835287c5be1fe1430785c885a4ecc
    note: >
      site/docs/_notes/hiecm/m2_post_v3_link_on_carecontext.mdx. The callback
      that says whether the records linked, its two status values and its
      codes.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_hip_v3_link_carecontext.mdx
    fetched: 2026-10-03
    hash: sha256:01a1c0836c891715d6ff1ed49d3a3b1da175e1f310c79b81f259567a6313863e
    note: >
      site/docs/_notes/hiecm/m2_post_hip_v3_link_carecontext.mdx. The 202 on
      the link call is not the outcome.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_hip_v3_link_patient_links.mdx
    fetched: 2026-10-03
    hash: sha256:a45ae36a8ba4bf3b3b1f9b9be0d6a0825abf48ae8fe6fe8c9ba313bdf18af3e0
    note: >
      site/docs/_notes/hiecm/p2_get_hip_v3_link_patient_links.mdx. The call a
      PHR app makes to list every linked care context.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p3.mdx
    fetched: 2026-10-03
    hash: sha256:c196a376b3937da6154b60c56956b941c9ff8306a91757bc2cc027b35912ebd6
    note: >
      site/docs/hiecm/v3/milestones/p3.mdx. A subscription tells an app a
      record exists, and fetching it is a consent request followed by a
      health information request.
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/hip-hiu.md
    fetched: 2026-10-03
    hash: sha256:217a8565c096fa08554b2692b350c798261effe34a7a98315f38184df471d363
    note: >
      site/docs/hiecm/v3/concepts/hip-hiu.md. The end to end sandbox check,
      and the 20 minute limit on the transfer.
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/hiecm/hip-initiated-linking.yaml
    hash: sha256:8c4036b49028e243d0687d5ddcde6fa025d21d63fdaf90826eb8159f8485382b
    note: The link care context operation, its callback and the patient links operation.
related:
  flows:
    - hiecm.flow.journey-hip-initiated-linking
    - hiecm.flow.journey-consent-to-records
    - hiecm.flow.p3-fetch-records
    - hiecm.flow.m2-link-care-context
  callbacks:
    - hiecm.callback.m2-on-carecontext-result
    - hiecm.callback.m2-linking-care-context-call-back
    - hiecm.callback.m2-on-health-information-request
  endpoints:
    - hiecm.endpoint.m2-hip-link-care-context
    - hiecm.endpoint.m2-get-all-link-records
  troubleshooting:
    - hiecm.troubleshooting.no-callback-on-my-server
    - hiecm.troubleshooting.accepted-then-nothing
  concepts:
    - hiecm.concept.care-context
    - hiecm.concept.phr-subscriptions
  errors:
    - hiecm.error.abdm-1056
  glossary:
    - hiecm.glossary.hip
    - shared.glossary.phr
---

# Care contexts were accepted for linking but the patient does not see the record

## In plain words

A hospital told ABDM that it holds a visit for a patient, and ABDM replied
"accepted". The patient opens their health app and the record is not there.

Two different things can be missing, and they need different fixes.

- **The link.** "Accepted" only means the request was received. Whether the
  visit was attached to the patient's account is reported afterwards, in a
  separate message to the hospital.
- **The record.** A link is a pointer: it says a record exists at this
  hospital. The contents appear in the app only after the app asks for them,
  the patient agrees, and the hospital sends them.

So first find out whether the link completed. If it did, the gap is in
fetching the record.

In ABDM's terms the hospital is the
[HIP](/docs/hiecm/v3/getting-started/glossary#hip), the pointer is a
[care context](/docs/hiecm/v3/getting-started/glossary#care-context) and the
app is a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) application.

## What happens

### The check that separates the causes

Look for the callback to your bridge at `/api/v3/link/on_carecontext` whose
`response.requestId` equals the `REQUEST-ID` of your
`POST /api/hiecm/hip/v3/link/carecontext` call. Read its `status`.

| What you find | Cause | Fix |
| --- | --- | --- |
| No such callback | The link result never reached you, so you do not know the outcome | See [no callback reaches my server](no-callback-on-my-server.md) |
| `Failed to link care context` with an `error` | The link was refused. `ABDM-1038`: the ABHA address does not match the link token. `ABDM-1037`: `count` does not match the care contexts sent. `ABDM-1024`: a dependent service was unavailable | Correct what the code names, then link again. For `ABDM-1038`, generate a link token for this address. Do not retry the same call unchanged |
| `Successfully Linked care context`, and the patient's app does not list the care context | The link went to an ABHA address the patient is not signed in with. A person can hold several ABHA addresses | Compare the `abhaAddress` in the callback with the address the patient uses in the app. A PHR app lists linked care contexts with `GET /api/hiecm/hip/v3/link/patient/links` |
| `Successfully Linked care context`, the app lists the care context, and the record's contents do not open | The record has not been fetched. The app has to raise a consent request, and after the grant a health information request, and your system has to answer it | Check your bridge for `/api/v3/hip/health-information/request`. If it arrived, follow [consent request to records received](../flows/journey-consent-to-records.md) from the HIP's side: acknowledge, encrypt, push to the `dataPushUrl`, notify |
| The health information request never arrived | No consent has been granted for that care context yet. The app raises the consent request when it is notified of the link, and a third party PHR app is notified only when it holds an approved subscription | Nothing on the HIP's side. In the app, the person approves the request, or the app's auto approval policy grants it |

The transfer has 20 minutes from the start of the request.

## How you know it worked

The full loop, on the sandbox: sign in to a PHR app with a sandbox ABHA
address, register a patient with that same address in your system, link a
care context, and let the app request it with consent. Your system transfers
the record to the `dataPushUrl`, and the record appears in the app.

## When it goes wrong

- `ABDM-1056`, "This care contexts has been already linked": treat it as
  done once you have confirmed the care context is linked. Do not retry.
- Linking and then waiting on the response body for the result. The result
  never comes there.

If the callback says `Successfully Linked care context`, the address matches,
and the app still lists nothing, raise a request through
[Support](/docs/support). Report the `REQUEST-ID` and `TIMESTAMP` of the link
call, your HIP ID and the callback body, with patient identifiers replaced by
placeholders.

## Questions this answers

- I linked care contexts and got 202 but the patient does not see the record, why?
- How do I know a care context was linked successfully?
- The care context shows in the PHR app but the report does not open, why?
- Is the record sent to the patient's app when I link a care context?
- How can I test that a linked record appears in a PHR app?
