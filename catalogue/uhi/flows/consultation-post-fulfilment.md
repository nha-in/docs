---
id: uhi.flow.consultation-post-fulfilment
type: flow
gateway: uhi
milestone: n/a
version: uhi-v1
title: "Physical Consultation post-fulfilment: cancel, on_cancel and on_message"
summary: The patient cancels through the EUA or the doctor through the HSPA,
  each with a reason code and who cancelled; either side can message the other.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/consultation.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/consultation.mdx#journey-4-post-fulfilment. Edit
      the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-cancel
    - uhi.endpoint.consultation-on-cancel-audit
  callbacks:
    - uhi.callback.consultation-on-cancel
    - uhi.callback.consultation-on-message-to-eua
    - uhi.callback.consultation-on-message-to-hspa
  concepts:
    - uhi.concept.consultation-reason-codes
    - uhi.concept.audit-copies
  flows:
    - uhi.flow.consultation-order
---

# Physical Consultation post-fulfilment: cancel, on_cancel and on_message

## In plain words

A cancellation takes the place of fulfilment. The patient cancels through the
EUA, or the doctor cancels through the HSPA. Either side sends the other a
message with `on_message`.

```mermaid
sequenceDiagram
    autonumber
    participant E as EUA
    participant G as UHI Gateway
    participant H as HSPA
    E->>H: cancel (reason code, cancelledby patient)
    H->>E: on_cancel (CANCELLED)
    H->>G: on_cancel_audit
    opt The doctor cancels
        H->>E: on_cancel (CANCELLED, cancelledby doctor)
        H->>G: on_cancel_audit
    end
    E->>H: on_message
    H->>E: on_message
```

Start with the first call:
[cancel](/docs/uhi/v1/api/consultation/endpoints/uhi-consultation-post-fulfilment/01-uhi-consultation-cancel).

## Before you start

Hold the order's `order.id`. Pick the reason code from the lists under Cancellation and override reason codes, and send it exactly as listed.

## What happens

A patient cancellation is a `cancel` from the EUA with `@abdm/gov.in/cancelledby: patient` and the reason in `@abdm/gov.in/cancel_reason`. The HSPA answers `on_cancel` with `CANCELLED` and copies it to `on_cancel_audit`. A doctor cancellation is an `on_cancel` the HSPA sends unprompted, with `@abdm/gov.in/cancelledby: doctor`. Either side can send `on_message`.

## How you know it worked

An `on_cancel` with `CANCELLED` reaches the EUA, and the HSPA has sent its copy to `on_cancel_audit`.

## When it goes wrong

`@abdm/gov.in/cancelledby` is mandatory, because it decides which terms apply. `PATIENT_OTHER` and `DOCTOR_OTHER` need free text. `/on_message` is mandatory for an EUA and optional for an HSPA.
