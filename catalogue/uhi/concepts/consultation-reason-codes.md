---
id: uhi.concept.consultation-reason-codes
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Physical Consultation cancellation and PIN override reason codes
summary: The fixed patient, doctor and override reason codes for cancel,
  on_cancel and PIN override, sent exactly as listed with labels of your own.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/consultation.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/consultation.mdx#cancellation-and-override-reason-codes.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.consultation-post-fulfilment
    - uhi.flow.consultation-fulfilment
  endpoints:
    - uhi.endpoint.consultation-cancel
  callbacks:
    - uhi.callback.consultation-on-cancel
---

# Physical Consultation cancellation and PIN override reason codes

## In plain words

Send the reason codes exactly as listed. The labels are yours to choose.

Patient cancellations are sent in `cancel` with `@abdm/gov.in/cancelledby: patient`.

| # | Reason code | Label |
| --- | --- | --- |
| P1 | `PATIENT_PERSONAL_EMERGENCY` | Personal or family emergency |
| P2 | `PATIENT_HEALTH_IMPROVED` | Condition resolved, no longer required |
| P3 | `PATIENT_UNABLE_TO_VISIT_PHYSICALLY` | Scheduling conflict or unable to visit |
| P4 | `DOCTOR_ASKED_TO_CANCEL` | Doctor requested cancellation |
| P5 | `PATIENT_BOOKED_IN_ERROR` | Booked by mistake |
| P6 | `PATIENT_SEEKING_ALTERNATIVE` | Seeking another doctor or provider |
| P7 | `PATIENT_OTHER` | Other. The EUA must capture free text |

Doctor and facility cancellations are sent in `on_cancel` with
`@abdm/gov.in/cancelledby: doctor`.

| # | Reason code | Label |
| --- | --- | --- |
| D1 | `DOCTOR_PERSONAL_EMERGENCY` | Doctor personal emergency |
| D2 | `DOCTOR_UNAVAILABLE` | Doctor unavailable, or a patient medical emergency |
| D3 | `DOCTOR_SCHEDULE_CHANGE` | Schedule or slot change |
| D4 | `FACILITY_CLOSURE` | Facility or clinic closure |
| D5 | `TECHNICAL_SYSTEM_ISSUE` | Technical or system issue |
| D6 | `DOCTOR_OTHER` | Other. The HSPA must provide free text |

Facility staff use an override reason when a confirmed patient cannot check in
with the PIN.

| # | Reason code | Label |
| --- | --- | --- |
| O1 | `OVERRIDE_EMERGENCY_CONSULTATION` | Medical emergency at the facility |
| O2 | `OVERRIDE_PIN_TECH_FAILURE` | The app cannot show the PIN. Identity checked another way |
| O3 | `OVERRIDE_PIN_DELIVERY_FAILURE` | The PIN never reached the patient |
| O4 | `OVERRIDE_VULNERABLE_PATIENT` | Elderly, differently abled or low digital literacy patient |
| O5 | `OVERRIDE_EUA_OUTAGE` | The EUA platform is down |
| O6 | `OVERRIDE_MISMATCH` | PIN mismatch after 3 attempts |
| O6 | `OVERRIDE_OTHER` | Other. The HSPA must provide free text |

## When it goes wrong

`OVERRIDE_MISMATCH` and `OVERRIDE_OTHER` share the number O6. Key your handling on the reason code string, never on the number.
