---
id: uhi.flow.consultation-fulfilment
type: flow
gateway: uhi
milestone: n/a
version: uhi-v1
title: "Physical Consultation fulfilment: PIN check-in, on_update and status"
summary: The patient checks in with the PIN, the HSPA pushes each state change
  in on_update, and the EUA calls status only when an update never arrives.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/consultation.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/consultation.mdx#journey-3-fulfilment. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-status
    - uhi.endpoint.consultation-on-status-audit
    - uhi.endpoint.consultation-on-update-audit
  callbacks:
    - uhi.callback.consultation-on-status
    - uhi.callback.consultation-on-update-to-eua
    - uhi.callback.consultation-on-update-to-hspa
  concepts:
    - uhi.concept.consultation-reason-codes
    - uhi.concept.audit-copies
  flows:
    - uhi.flow.consultation-order
---

# Physical Consultation fulfilment: PIN check-in, on_update and status

## In plain words

The patient shows the PIN at the facility. The HSPA pushes each state change to
the EUA with `on_update`. The EUA calls `status` only when an expected update
never arrives.

```mermaid
sequenceDiagram
    autonumber
    participant P as Patient
    participant E as EUA
    participant G as UHI Gateway
    participant H as HSPA
    P->>H: Presents PIN at facility
    H->>E: on_update (APPOINTMENT_STARTED)
    H->>G: on_update_audit
    H->>E: on_update (COMPLETED)
    H->>G: on_update_audit
    opt An expected on_update never arrives
        E->>H: status
        H->>E: on_status
        H->>G: on_status_audit
    end
    opt The doctor does not appear
        E->>H: on_update (DOCTOR_NO_SHOW)
    end
```

The appointment moves through these states. Only `DOCTOR_NO_SHOW` starts from
the EUA. Every other state change comes from the HSPA.

```mermaid
stateDiagram-v2
    [*] --> CONFIRMED: on_confirm
    [*] --> FAILED: on_confirm
    CONFIRMED --> APPOINTMENT_STARTED: HSPA on_update
    APPOINTMENT_STARTED --> COMPLETED: HSPA on_update
    CONFIRMED --> CANCELLED: cancel / on_cancel
    CONFIRMED --> NO_SHOW: HSPA on_update
    CONFIRMED --> DOCTOR_NO_SHOW: EUA on_update
```

Start with the first call:
[status](/docs/uhi/v1/api/consultation/endpoints/uhi-consultation-fulfilment/01-uhi-consultation-status).

## Before you start

The order is `CONFIRMED` and you hold its `order.id`. The EUA exposes `/on_update` and `/on_status`. The HSPA exposes `/status` and `/on_update`.

## What happens

At check-in the PIN status moves from `GENERATED` to `VERIFIED`, or to `HSPAOVERRIDE` with an override reason code. The HSPA pushes `on_update` for `APPOINTMENT_STARTED`, then `COMPLETED`, or for `NO_SHOW`. It copies each one to `on_update_audit`. The EUA sends `status` only when an expected update never arrives, and the HSPA copies its `on_status` to `on_status_audit`.

## How you know it worked

An `on_update` with `COMPLETED` reaches the EUA, carrying `@abdm/gov.in/care_context_id`. Keep that id. With the doctor's `@abdm/gov.in/hip_id`, it lets the EUA fetch the records later.

## When it goes wrong

If no `on_update` arrives when expected, call `status`. The EUA sets one state only, `DOCTOR_NO_SHOW`, through `on_update`. Do not send or depend on `NOT_VERIFIED`. An HSPA sends every `on_update_audit`, because it is the copy that counts for DHIS.
