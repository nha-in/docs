# Design UHI Physical Consultation

What the service is on the network, what a search may carry, what the service will not do, and what the screens around the calls have to do.

## Physical Consultation service identity

Every call in this service carries these fixed values.

| Field | Value |
| --- | --- |
| `context.domain` | `nic2004:85111` |
| `context.core_version` | `0.7.1` |
| `message.intent.fulfillment.type` | `Physical`, case sensitive |
| `message.intent.item.descriptor.code` | `Consultation` |
| `message.intent.item.descriptor.name` | `Consultation` |

From `uhi.concept.consultation-service-identity`.

## Physical Consultation terms content

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

### What happens

These texts travel in the five terms of `on_init`, each with `termsState` set to `INITIATED`. The EUA shows every term before `confirm`, then returns all five unchanged with `termsState` set to `AGREED`.

From `uhi.concept.consultation-terms`.

## Physical Consultation cancellation and PIN override reason codes

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

### When it goes wrong

`OVERRIDE_MISMATCH` and `OVERRIDE_OTHER` share the number O6. Key your handling on the reason code string, never on the number.

From `uhi.concept.consultation-reason-codes`.

## Aggregating the on_search answers to one UHI search

The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) broadcasts
a search to every HSPA registered for the domain. Each matching HSPA replies
separately, so group them by the shared `transaction_id`.

| Service | What to expect |
| --- | --- |
| PM-JAY HEM, Jan Aushadhi, NOTTO | One HSPA, so one `on_search` per search |
| Blood Bank | Several HSPAs. Aggregate within a 10 to 15 second window |
| Physical Consultation | One catalog per HSPA with doctors, fees and `provider_uri` |
| Ambulance Booking | Only HSPAs that serve the pickup area answer. Silence means no coverage, not a network fault |

From `uhi.concept.aggregate-answers`.

## Timing out a UHI search and rendering results as they arrive

A search has no end signal. Nothing tells you the last answer has arrived.

- Set a timeout for each search, and keep it a configuration value.
- Render each `on_search` as it arrives. Do not wait for all of them.
- When the timeout passes with nothing received, stop waiting and offer a retry. Never leave the screen loading.
- An empty result is a result. Show a fallback message and suggest a wider search.

Blood Bank's window is 10 to 15 seconds. No figure is set for the other
services, so agree one at onboarding.

From `uhi.concept.render-as-results-arrive`.

## Paginating UHI search results on your side

`on_search` is not paginated. Handle a large payload without blocking the
screen, and page through it in your own UI.

From `uhi.concept.paginate-client-side`.

## What UHI app screens must do

The service pages carry each service's own rules. The rules below are checked
at sign-off or required of every app.

| Rule | Service |
| --- | --- |
| Reach the feature within 3 taps, under a health or insurance category | [PM-JAY HEM](/docs/uhi/v1/services/pmjay-hem#concepts-explored) |
| Show "Powered by UHI" with PM-JAY and [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) branding | PM-JAY HEM |
| Show a fallback message on empty results | PM-JAY HEM |
| Display "Please confirm the hospital location by calling ahead, as details may change." | PM-JAY HEM |
| Show the phone number and a "call to confirm" disclaimer, because counts are indicative | [Blood Bank](/docs/uhi/v1/services/blood-bank) |
| Show the terms from `on_init` before enabling any confirm action | [Physical Consultation](/docs/uhi/v1/services/consultation), [Ambulance Booking](/docs/uhi/v1/services/ambulance) |
| Keep the 4-digit PIN in memory only, never in a database or a log | Physical Consultation |
| Show no driver or vehicle details in Phase 1 | Ambulance Booking |
| Show the transplant coordinator's phone first | [NOTTO](/docs/uhi/v1/services/notto) |
| Scope the screen to discovery. Do not build booking where the service has none | PM-JAY HEM, Blood Bank, Jan Aushadhi, NOTTO |

From `uhi.concept.screen-requirements`.
