---
id: uhi.concept.consultation-terms
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Physical Consultation terms content
summary: What each of the five terms in on_init must say to the patient before
  confirm, with the clauses every EUA and HSPA keeps.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/consultation.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/consultation.mdx#terms-content.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.consultation-order
  callbacks:
    - uhi.callback.consultation-on-init
  endpoints:
    - uhi.endpoint.consultation-confirm
---

# Physical Consultation terms content

## In plain words

`on_init` carries the text the patient reads before confirming. Keep it plain
and patient friendly. You may add detail, but keep the substance of every
clause below. Replace each value in brackets with your own.

| Term | What it must say |
| --- | --- |
| Commercial | UHI is a technology gateway only. It does not control or supervise any provider, and carries no liability for the availability, quality, safety, timeliness or outcome of the service. It does not collect, hold or route any payment. This clause is mandatory. |
| Commercial | Every payment, billing arrangement, refund, cancellation charge and pricing dispute is between the patient and the provider. UHI and [EUA name] carry no liability for them. |
| Commercial | The consultation is with [doctor's name, qualifications and HPR ID] at [facility], on [date and slot]. If the doctor has an emergency, the facility may offer a substitute or a reschedule. |
| Commercial | Expect up to 30 minutes of waiting beyond the booked slot. If a doctor's emergency causes a longer delay, the patient may wait, accept a substitute or reschedule. |
| Cancellation | Rescheduling, cancellation, refund and compensation follow the provider's own policies. UHI and [EUA name] are not liable for them. |
| Cancellation | Cancel at least 4 hours before the appointment starts. The facility aims to notify the patient at least 2 hours before the start, with a reason. |
| Payment | The patient pays at the facility on the day of the visit, by the modes it accepts. The fee is set by the facility. UHI and [EUA name] do not collect, hold, settle or refund it. |
| Payment | [Total payable, GST included.] This is the final amount and does not change at the desk. Any change is the facility's responsibility. |
| Settlement | Your own text. Online payment is not part of the flow today. |
| Refund | Your own text. Refunds are not part of the flow today. |

## What happens

These texts travel in the five terms of `on_init`, each with `termsState` set to `INITIATED`. The EUA shows every term before `confirm`, then returns all five unchanged with `termsState` set to `AGREED`.
