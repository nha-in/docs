---
title: Hospital, lab and pharmacy systems
sidebar_label: HIS, LIS and pharmacy
sidebar_position: 2
description: What a health information provider does in ABDM, and how care context linking fits into a clinical workflow.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_1.md
---

# Hospital, lab and pharmacy systems

If your software creates health records for patients,
[ABDM](/docs/overview/glossary#abdm) calls you a
[HIP](/docs/overview/glossary#hip), a health information provider. Hospital
information systems, lab systems and pharmacy systems are all HIPs. Your job has
two halves: identify the patient by their [ABHA](/docs/overview/glossary#abha)
address at registration, which is [M1](/docs/api/hie-cm/m1), and make the records
you create discoverable and shareable, which is
[M2](/docs/api/hie-cm/m2).

:::note[Documented, not verified]
This page follows NHA's published documents for Milestone 1 and Milestone 2.
Nothing here has been run against the ABDM sandbox from this repository, so treat
request and response shapes as unconfirmed.
:::

## Before you start

NHA's M2 document states one prerequisite. Your entity must have a valid facility
ID and be registered with the HIP role. That is what authorises you to create
health records and share them with [PHR](/docs/overview/glossary#phr) and
[HIU](/docs/overview/glossary#hiu) systems. Facility registration lives in the
[Health Facility Registry](/docs/overview/building-blocks/registries).

For discovery to reach you, your facility also has to be linked to an
[HRP](/docs/overview/glossary#hrp), a health repository provider. NHA's M2
document uses HRP and [HMIS](/docs/overview/glossary#hmis) or
[LMIS](/docs/overview/glossary#lmis) interchangeably, so in most cases the HRP is
your own software.

Base URLs from the two documents:

| Purpose | Sandbox | Production |
| --- | --- | --- |
| ABHA identity APIs (M1) | `https://abhasbx.abdm.gov.in/abha/api/v3/` | `https://abha.abdm.gov.in/api/abha/v3/` |
| Fingerprint and IRIS login via Aadhaar number | `https://abhasbx.abdm.gov.in/abha/api/v3.1/` | Not stated in the document |
| Gateway and record exchange (M2) | `https://dev.abdm.gov.in` | `https://apis.abdm.gov.in` |

## What you build in M1

M1 is what happens at the registration desk: create an ABHA for a patient who does
not have one, or verify the one they do have. NHA's M1 document marks each
capability as mandatory or optional, and the answer differs for private and
government integrators.

| Capability | Private integrators | Government integrators |
| --- | --- | --- |
| ABHA creation by Aadhaar OTP | Mandatory | Mandatory |
| ABHA creation by Aadhaar face authentication | Optional | Optional |
| ABHA creation by Aadhaar biometrics, fingerprint or IRIS | Optional | Optional |
| ABHA creation by Aadhaar demographic authentication | Not required | Mandatory |
| Child ABHA | Not available | Specific integrators, with NHA leadership approval |
| Login by mobile number, Aadhaar number, ABHA number, ABHA address | Mandatory | Mandatory |
| Fetch user profile | Mandatory | Mandatory |
| Download ABHA card | Mandatory | Mandatory |
| Mobile number management | Optional | Optional |
| Re-KYC | Optional | Optional |
| Benefit programme search, link and delink | Not available | Government only |
| Session and refresh token APIs | Mandatory | Mandatory |

Two practical notes from the M1 document. Face authentication runs through the
ABHA app and the Aadhaar RD service: your portal generates a QR code, the patient
scans it in the ABHA app, and you poll for the result before continuing. Biometric
creation needs an Aadhaar registered device, and UIDAI publishes the device list at
<https://uidai.gov.in/en/ecosystem/authentication-devices-documents/biometric-devices.html>.

The M1 document also names two validation algorithms worth implementing locally
before you spend an API call: Luhn for an ABHA number, Verhoeff for an Aadhaar
number.

## What you build in M2

M2 is the record side. Five things have to work.

### 1. Health records in the right format

Every record you share must be a [FHIR](/docs/overview/glossary#fhir) R4 bundle
following the profiles published by NRCES at <https://nrces.in/ndhm/fhir/r4/index.html>.
Each record type can be either a simple bundle with a PDF or image attachment, or a
structured bundle with coded information.

| Record type | What it is for |
| --- | --- |
| Diagnostic Report Record | Radiology and laboratory reports |
| Discharge Summary Record | The discharge summary, as an ABDM clinical document |
| Health Document Record | Unstructured historical records, typically uploaded by patients |
| Immunization Record | Immunisations, certificates and next dose recommendations |
| OP Consult Record | Outpatient notes: examination, procedures, medications, advice |
| Prescription Record | Medication advice, following Pharmacy Council of India guidelines |
| Wellness Record | Vitals, physical examination and general health data |
| Invoice Record | Pharmacy invoices, consultation invoices and other billing |

NHA's document states that implementing all of these is mandatory for an HMIS.

### 2. Care contexts

A care context is a logical group of a patient's records. It is the unit that gets
attached to an ABHA address.

The [HIE-CM](/docs/overview/glossary#hie-cm) is data blind. It never sees the
records. It only ever holds two fields per care context:

- **Reference ID.** Your internal identifier, which you use to retrieve the
  records later.
- **Display name.** A description the patient will recognise. It must not contain
  anything clinical: no results, no diagnoses. "OPD records (X-Ray, Prescription)
  from 3rd March 2023" is the shape NHA's document gives.

The recommended grouping is one care context per outpatient visit and one per
inpatient admission.

```json
{
  "patient": {
    "referenceNumber": "TMH-PUID-001",
    "display": "TMH records for Kiran Kumar",
    "careContexts": [
      {
        "referenceNumber": "2375639",
        "display": "OPD records for O3 Oct 2022"
      }
    ]
  }
}
```

### 3. Linking

There are three ways a record reaches a patient's ABHA address, and which one
applies depends on what the patient gave you at registration.

**HIP initiated linking**, when the patient shared their ABHA address. You decide
which care context a new record belongs to, then link that care context as soon as
the record is ready to share. Linking needs a **linking token**. Generate and
store it at registration. Its current validity is 6 months. Validate it before use,
for example by decoding the JWT. If you do not hold a valid one, regenerate it with
demographic authentication.

**Notification to mobile**, when the patient gave a mobile number, name, age and
gender but no ABHA address. Call the ABDM notification API once the record is
ready. ABDM sends the patient an SMS with a deep link, which opens or installs a
PHR app, where the patient can create an ABHA address, discover the record and
link it.

**Discovery**, when the patient goes looking for old records from their PHR app.
This one is a request you receive rather than one you send. Implementing the
discovery API is mandatory for every HIP.

Whenever a care context is linked, or an existing one is updated with new records,
the HIE-CM notifies every PHR application subscribed to that ABHA address. You do
not send those notifications yourself.

### 4. Answering discovery

A discovery request arrives from the gateway carrying verified identifiers: ABHA
address, mobile number, name, gender and year of birth. It may also carry
unverified information the patient typed, typically a patient ID or medical
registration number your facility issued.

Match on the verified identifiers first and weight them higher. Use the unverified
identifier to sharpen a match, not to make one. Return care contexts as reference
ID and display name pairs.

One compliance rule with no exceptions: the discovery response must contain no
clinical or sensitive information. Metadata only.

### 5. Health information request and data transfer

This is the actual record hand off, in three stages.

**Stage 1.** The HIU sends a request through the HIE-CM. It carries the consent
ID, a data push URL, which may differ from the HIU's registered gateway URL for
privacy, the date and time range requested, and the encryption material. The
HIE-CM generates a transaction ID and gives it to both sides.

**Stage 2.** You validate before you send anything:

- The consent ID is valid and active, not expired, paused or revoked.
- The requested date and time range falls inside the range the consent artefact
  permits.
- The encryption parameters are correct and compatible.

Then you retrieve the records, encrypt them with the HIU's key material, sign the
encrypted payload with your long term private key, and send it with the transaction
ID to the data push URL.

**Stage 3.** You notify the HIE-CM that the transfer happened, using
`health-information/notify`. The HIU notifies the HIE-CM whether it succeeded or
failed.

The current timeout is 20 minutes from the start of the request. For large data
such as CT or MRI images, split the transfer into multiple parts. NHA's document
recommends streaming rather than one large payload.

### Packaging and validating the bundle

The bundle is a FHIR `Bundle` of `type: document`. The first entry must be a
`Composition`. `Composition.type` carries the SNOMED CT code that tells the
receiving system what the document is, for example `440545006` for a prescription
record and `721981007` for a diagnostic report.

Rules from the document that are easy to get wrong:

- `id` must be unique per bundle and resolvable inside your own system.
- `timestamp` is the time the document was issued.
- `identifier` must trace the document back to your system.
- Every entry `fullUrl` is a logical URL of the form `resource-type/id`, resolvable
  within the bundle. Do not use absolute URLs for references.
- The attester party references an `Organization` whose identifier value is your
  HIP ID as registered in the facility registry.
- `section.entry[]` lists the top level resources only. Referenced resources such
  as Patient, Encounter and Practitioner belong in the bundle but not in the
  section entries.

Validate before you ship. With JDK 8 or higher installed, download
`validator_cli.jar` version 6.2.1 from
<https://github.com/hapifhir/org.hl7.fhir.core/releases/download/6.2.1/validator_cli.jar>
and run:

```shell
java -jar validator_cli.jar <YOUR_BUNDLE_FILENAME>.json -ig https://nrces.in/ndhm/fhir/r4
```

### Encryption

ABDM uses Elliptic Curve Diffie-Hellman key exchange on Curve25519, with AES-GCM
for the payload and HKDF to derive the session key. The design gives forward
secrecy: a key compromise later does not expose data exchanged earlier.

The HIU sends you a short term public key and a 32 byte nonce with the request. You
generate your own key pair and nonce in the same group, compute the shared key,
derive the salt and IV by XOR of the two nonces, using the first 20 bytes as salt
and the last 12 as IV, derive a 256 bit AES-GCM key, encrypt, and send back your
public key, your nonce and the encrypted data.

You do not have to write this yourself. NHA's document points at Fidelius,
<https://github.com/sukreet/fidelius>, and the Fidelius CLI, which has worked
examples for Node.js, Python, Ruby and PHP at
<https://github.com/mgrmtech/fidelius-cli/tree/main/examples>.

## How linking fits a clinical workflow

Mapped onto a day at a facility, the sequence is:

1. **Registration.** The patient gives an ABHA address, or scans your counter QR
   code and shares their profile, or gives only name, mobile, age and gender.
2. **Store the linking token** against that patient record. You will need it for
   every future visit for 6 months.
3. **Care happens.** Your system produces a prescription, a report, a discharge
   summary.
4. **Group the records.** Assign each new record to a care context: one per OPD
   visit, one per IPD admission.
5. **Link when the record is ready to share**, not when the visit opens. Linking
   is what makes the record visible to the patient.
6. **Wait.** The HIE-CM notifies the patient's PHR app. The app raises a consent
   request. When consent is granted, a health information request arrives.
7. **Validate, encrypt, push, notify.** Inside 20 minutes.

Steps 1 and 2 are M1 work in your registration module. Steps 4 to 7 are M2 work,
and most of it belongs in a background job rather than in the clinician's screen.

## Testing the loop in sandbox

NHA's M2 document gives a single end to end check:

1. Log in to a PHR app with a sandbox ABHA address.
2. Register a patient with that same ABHA address in your system.
3. Create a health record for that patient.
4. Link a care context for it using HIP initiated linking.
5. The PHR app requests the record with the appropriate consent.
6. Prepare, encrypt and transfer the record to the data push URL the app supplied.
7. The record appears in the PHR app.

We have not run this loop from this repository. These codes from NHA's M2 error
table cover the failures this loop can produce: `ABDM-1026` invalid link token,
`ABDM-1038` ABHA address and link token mismatch, `ABDM-1056` care context already
linked, `ABDM-1062` consent not granted and `ABDM-1063` invalid date range. Read
the code with the message the gateway returns, not on its own. NHA's table lists
`ABDM-1056`, `ABDM-1062` and `ABDM-1063` twice each, against two different
messages.

## What you do not need to build

- **Consent screens.** Consent is collected in the patient's PHR app, not in
  yours. You validate the consent artefact, you never gather consent for record
  sharing yourself.
- **Record storage for other facilities.** You share your own records. You do not
  hold anyone else's.
- **HIU behaviour**, unless you also want to pull records from other facilities.
  That is [M3](/docs/api/hie-cm/m3), and it is a separate integration.
- **[UHI](/docs/overview/glossary#uhi).** Appointments, ambulances and pharmacy
  ordering run on a different gateway, and that is Phase 2.
- **[NHCX](/docs/overview/glossary#nhcx).** Claims exchange is out of scope for
  V1.

## What to read next

- [M1 overview](/docs/api/hie-cm/m1) for ABHA creation and login at registration,
  and the [M1 API reference](/reference/hiecm-m1).
- [M2 overview](/docs/api/hie-cm/m2) for linking, discovery and data transfer, and
  the [M2 API reference](/reference/hiecm-m2).
- [M2 errors](/docs/api/hie-cm/m2/errors) for the full ABDM error code list.
- [M2 test cases](/docs/api/hie-cm/m2/test-cases) for what sandbox exit asks you to
  demonstrate.
- [PHR applications](/docs/overview/roles/phr) for what the patient's app is doing
  on the other side of every flow here.
