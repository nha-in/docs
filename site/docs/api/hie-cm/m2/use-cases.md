---
title: M2 use cases
sidebar_label: Use cases
sidebar_position: 3
description: Care contexts, the three linking routes, data transfer, FHIR packaging, bundle validation and encryption.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md
---

# M2 use cases

Milestone 2 (M2) of [ABDM](/docs/overview/glossary#abdm) is nine pieces of work. Three of them are ways to link a record to a person. One is sending records out. The other five are the record formats, care contexts, the packaging, the validation and the encryption that the first four depend on. This page takes them one at a time, in the order [NHA](/docs/overview/glossary#nha)'s document sets them out.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 2. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## Health record formats

You can link eight types of health record to an [ABHA address](/docs/overview/glossary#abha-address). All of them are [FHIR](/docs/overview/glossary#fhir) R4. The profiles ABDM uses are published by the National Resource Centre for EHR Standards at [nrces.in](https://nrces.in/ndhm/fhir/r4/index.html).

Every record type works in two shapes.

- A simple FHIR bundle wrapping a PDF or image attachment that holds the detail.
- A structured FHIR bundle with coded clinical data.

The eight types are listed on the [M2 overview](/docs/api/hie-cm/m2). NHA's document marks implementing all [HI types](/docs/overview/glossary#hi-type) as mandatory for an [HMIS](/docs/overview/glossary#hmis).

## Understanding care contexts

A [care context](/docs/overview/glossary#care-context) is a logical grouping of a patient's health records. It is the unit that gets attached to an ABHA address. Your HMIS or [LMIS](/docs/overview/glossary#lmis) decides how to group records, and NHA asks you to do it the same way every time.

The [HIE-CM](/docs/overview/glossary#hie-cm) is data blind by design. It does not read or store the content of a health record. It holds identifiers and metadata about care contexts, nothing more.

A care context carries two fields.

| Field | What it is |
|---|---|
| Reference ID | A unique internal identifier you assign. You use it to retrieve the records behind the care context. |
| Display name | A description a patient can recognise. It must not carry anything sensitive: no test result, no diagnosis. |

NHA's example of an acceptable display name: "OPD records (X-Ray, Prescription) from 3rd March 2023".

NHA recommends one care context per outpatient visit and one per inpatient admission. That gives an event based grouping the patient can reason about.

The structure looks like this.

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

## HIP initiated linking

Use this when the patient gave you their ABHA address at registration. NHA's document breaks it into five obligations.

1. **Assign every new record to a care context.** Decide which context a record belongs to at the moment you create it, so records stay grouped per visit or admission.
2. **Link as soon as the record is shareable.** Linking is what lets the patient reach the record from a [PHR](/docs/overview/glossary#phr) app. An unlinked record is invisible to them.
3. **Carry a [link token](/docs/overview/glossary#link-token).** The token is generated and stored when the patient registers with you. It is the authorisation for linking.
4. **Validate the token before you use it.** Current validity is six months. NHA's document suggests decoding it with a tool such as jwt.io. Do not attempt a link with an expired or invalid token.
5. **Regenerate when you have none.** If no valid token exists for that patient, regenerate it through demographic authentication. NHA links the swagger for that route from its own linking page.

Once a care context is linked, or an existing one gains new records, NHA sends a notification to every PHR application subscribed to that ABHA address. You do not send that notification yourself.

## Notification to mobile

Use this when the patient did not give you an ABHA address, and you hold only basic demographics: mobile number, name, age and gender.

You cannot link, because there is nothing to link to. Instead you tell NHA the record exists. NHA sends the patient an SMS with a secure deep link. The link opens their PHR app if one is installed, and otherwise sends them to install one. In the app the patient can create an ABHA address if they do not have one, find the record, and link it themselves.

Your part is one call, made once the record is ready to share. The rest happens between the patient and NHA.

## Discovery and link

[Discovery](/docs/overview/glossary#discovery) is the patient searching for their own records at a facility they visited. They start it in a PHR app and pick your facility. NHA routes the request to you. Implementing the discovery API correctly is mandatory for every [HIP](/docs/overview/glossary#hip).

### What you are given

| Group | Fields |
|---|---|
| Verified identifiers | ABHA address, mobile number, name, gender, year of birth |
| Unverified, user declared | Facility issued identifiers such as a medical registration number or patient ID |

### What you have to do

Write a matching algorithm you can defend. Weight the verified identifiers higher and treat the user declared ones as supporting evidence. NHA's document points at its own matching flowchart, labelled Flow99, as the workflow to follow. That flowchart is one of the images that did not convert, so we cannot reproduce its branches here.

The aim is stated as accuracy plus a low false match rate. A false match hands one patient another patient's records, so a near miss should return nothing rather than a guess.

### What you return

A list of care contexts for the matched patient, each one a reference ID and a display name.

One compliance rule sits on top of the response. No clinical or sensitive information goes in it. Not a diagnosis, not a test result, not a report. Care context metadata only.

## Request for health records and data transfer

This is the flow where records actually move. An [HIU](/docs/overview/glossary#hiu) asks for a patient's records under a [consent artefact](/docs/overview/glossary#consent-artefact), and you answer. NHA splits it into three stages.

### Stage 1: the request arrives

The HIU sends the request to the HIE-CM, which forwards it to you. The HIE-CM generates a transaction ID for the whole exchange and shares it with both sides, so the request can be tracked end to end.

The request carries three things worth naming.

| Element | Why it matters |
|---|---|
| Consent ID | Identifies the consent artefact that authorises this request |
| Data push URL | Where you send the data. It can differ from the HIU's registered gateway URL, which keeps the requester harder to identify. |
| Request parameters | The date and time range being asked for, and the encryption key material |

### Stage 2: you validate, then transfer

Run three checks before you touch any record.

- The consent ID is valid and active. Not expired, not paused, not revoked.
- The requested date and time range falls inside the range the consent permits.
- The encryption parameters are correct and usable.

Then retrieve the records, encrypt them with the [ECDH](/docs/overview/glossary#ecdh) parameters supplied, and sign the encrypted payload with your long term private key. Send the encrypted data and the transaction ID to the data push URL.

Four constraints apply to the push.

- **20 minutes.** That is the current timeout, measured from the start of the request. Beyond it, expect failure or timeout handling.
- **Split large datasets.** CT scans, MRI images and files in the hundreds of megabytes can go across multiple parts.
- **Stream very large files.** NHA recommends streaming over one large payload.
- **Then notify.** After a successful push, call `health-information/notify` to tell the HIE-CM the transfer is done.

### Stage 3: notifications close the exchange

You notify the HIE-CM that the data went out. The HIU notifies the HIE-CM of the outcome on its side, either success, meaning the data was received and processed, or failure.

## Packaging health data

Everything you send is a FHIR Bundle. The bundle is the envelope for all the data in one transfer, and it can package several types of information or act as a document. You can send more than one bundle through the data transfer API. The bundle itself is what gets encrypted.

NHA's sample structure, trimmed to the parts that carry the rules:

```json
{
  "resourceType": "Bundle",
  "id": "bundle01",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2020-01-01T15:32:26.605+05:30"
  },
  "timestamp": "2020-01-01T15:32:26.605+05:30",
  "identifier": {
    "system": "https://example.hospital.com/pr",
    "value": "bundle01"
  },
  "type": "document",
  "entry": [
    {
      "fullUrl": "Composition/1",
      "resource": {
        "resourceType": "Composition",
        "id": "1",
        "date": "2020-01-01T15:32:26.605+05:30",
        "status": "final",
        "type": {
          "coding": [
            {
              "system": "https://ndhm.gov.in/sct",
              "code": "440545006",
              "display": "Prescription record"
            }
          ],
          "text": "Prescription Record"
        },
        "subject": { "reference": "Patient/1", "display": "Hina Patel" },
        "author": [
          { "reference": "Practitioner/1", "display": "Dr. Manju Sengar" }
        ],
        "title": "Prescription record",
        "encounter": {
          "reference": "Encounter/7fce6ec8-5013-4a27-b0a6-c43232608cda",
          "display": "OP Visit"
        },
        "attester": [
          {
            "mode": "official",
            "time": "2019-01-04T09:10:14Z",
            "party": {
              "reference": "Organization/MaxSaket01",
              "display": "Max Super Speciality Hospital, Saket"
            }
          }
        ],
        "section": [
          {
            "title": "Prescription record",
            "code": {
              "coding": [
                {
                  "system": "https://affinitydomain.in/sct",
                  "code": "440545006",
                  "display": "Prescription record"
                }
              ]
            },
            "entry": [{ "reference": "MedicationRequest/1" }]
          }
        ]
      }
    },
    {
      "fullUrl": "Organization/MaxSaket01",
      "resource": {
        "resourceType": "Organization",
        "id": "MaxSaket01",
        "name": "Max Super Speciality Hospital, Saket",
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "PRN",
                  "display": "Provider number"
                }
              ]
            },
            "system": "https://facility.ndhm.gov.in",
            "value": "10000005"
          }
        ]
      }
    },
    {
      "fullUrl": "Encounter/7fce6ec8-5013-4a27-b0a6-c43232608cda",
      "resource": {
        "resourceType": "Encounter",
        "id": "7fce6ec8-5013-4a27-b0a6-c43232608cda",
        "status": "finished",
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB",
          "display": "Outpatient visit"
        }
      }
    },
    {
      "fullUrl": "MedicationRequest/1",
      "resource": {
        "id": "1",
        "resourceType": "MedicationRequest"
      }
    }
  ]
}
```

NHA's own note applies to that sample: it leaves out the full Practitioner, Patient and Organization detail for readability. Your bundle must include those resources, and every reference must resolve inside the bundle.

### Bundle fields

| Field | Rule |
|---|---|
| `resourceType` | Must be `Bundle` |
| `id` | Unique per bundle. Give every resource an id you can resolve back inside your own system. |
| `timestamp` | The time the document was issued |
| `identifier` | Something that traces the document back to your system |
| `type` | Must be `document`. The first entry must be a Composition. |
| `entry` | An array of FHIR resources |
| `meta.versionId` | Stated in `bundle.meta`. It lets a consumer check it is working from the latest version. |

The reference HIU service supports top level HI types Prescription, Diagnostic Report, Discharge Summary and OP Consultation. Those can contain resources such as Observation, Condition, MedicationRequest, DocumentReference, DiagnosticReport and Procedure, alongside reference entities like Medication, Practitioner, Patient and Organization.

### Composition fields

The Composition is the first resource in the bundle. On its own it means nothing. With its sections and entries it groups and packages every other resource.

| Field | Rule |
|---|---|
| `title` | Must be present and must describe what the composition is about |
| `type` | The document type. `440545006` in SNOMED CT means Prescription Record. |
| `encounter` | The visit or clinical encounter this sits in |
| `subject` | The patient reference. Minimal information is fine. Include a `display`, usually the name. |
| `author` | The practitioner who authored the document. Sometimes an organization reference. Include a `display`. |
| `attester` | The practitioner or organization attesting to accuracy. `mode` is `official`. `party` references an Organization resource that is present in the same bundle. |
| `section` | Lists the top level resources the document is composed of |

Two rules about `attester.party`. The Organization must carry an identifier registered with the ABDM facility registry, and `Organization.identifier.value` must be a HIP ID registered there. The identifier system differs by environment: the [ABDM facility registry](https://nhpr.abdm.gov.in/nhpr/v4/home) in production, the [sandbox facility registry](https://hspsbx.abdm.gov.in/nhpr/v4/home) in [sandbox](/docs/overview/glossary#sandbox).

One rule about `section.entry`. List the top level resources there, for example the MedicationRequest entries. Do not list the resources they reference, such as Patient, Encounter or Practitioner. Those must exist in the bundle, but they do not belong in the section entries.

### References

Each bundle entry has a `fullUrl`. Write it as `resource-type/id`, a logical URL that resolves inside the bundle, and give every resource an id to match. Every entry must resolve within the bundle. Never use an absolute URL for a reference.

### Document types

`Composition.type` tells the receiver what the document is. Send the right code, or the HIU and patient applications cannot interpret what you sent. For a Diagnostic Report Record, for example:

```json
{
  "type": {
    "coding": [
      {
        "system": "https://ndhm.gov.in/sct",
        "code": "721981007",
        "display": "Diagnostic Report"
      }
    ],
    "text": "Diagnostic Report Record"
  }
}
```

## Validation of the FHIR bundle

Validate your bundle against the NRCeS implementation guide before you send it anywhere. You need a Java Development Kit, version 8 or higher, and a command line.

1. Make a folder and download the FHIR validator command line tool, version 6.2.1, from the [HAPI FHIR release](https://github.com/hapifhir/org.hl7.fhir.core/releases/download/6.2.1/validator_cli.jar). Save `validator_cli.jar` in that folder.
2. Put a bundle JSON file next to it. Use one of your own, or download a sample from the NRCeS examples: open an example, switch to the JSON tab, and download.
3. Run the validator from that folder.

```shell
java -jar validator_cli.jar <YOUR_BUNDLE_FILENAME>.json -ig https://nrces.in/ndhm/fhir/r4
```

For example:

```shell
java -jar validator_cli.jar sample-bundle.json -ig https://nrces.in/ndhm/fhir/r4
```

The validator checks structural correctness, compliance with the NRCeS FHIR profiles, and required fields and constraints.

## Encryption of the health data

The goal is narrow. Only the HIU that holds the patient's consent can read the data. Encryption is what enforces that between you and them.

ABDM uses ECDH on the Curve25519 elliptic curve, with AES-GCM for the encryption itself. The property this buys is forward secrecy: if key material held by a HIP, an HIU or the HIE-CM is later compromised, data already exchanged stays protected.

### The flow, at a glance

1. The HIU holds a key pair, keeps the private key, and shares its public key and a nonce.
2. The HIU sends its public key and nonce with the data request.
3. You validate the patient's consent for that request.
4. You derive a shared key and encrypt the records with it.
5. You send the encrypted data back with your own public key, your nonce, and the metadata the HIU needs to decrypt.
6. The HIU derives the same shared key from its private key and your public key, and decrypts.

### The steps on your side

NHA's terminology: `DHPK` is an ECDH public key, `DHSK` an ECDH private key, `RAND` a random string, `HKDF` a hash based key derivation function, and `U` and `P` are the HIU and the HIP.

The HIU generates its material first: a set of ECDH parameters, a short term key pair `DHSK(U)` and `DHPK(U)`, and a 32 byte random value `RAND(U)`, the nonce. The consent artefact, the public key and the nonce reach you through a digitally signed call to the HIE-CM.

Once you have validated consent and built the FHIR bundle, you do six things.

1. Generate a new ECDH key pair, `DHSK(P)` and `DHPK(P)`, in the group the HIU specified.
2. Generate a 32 byte random value, `RAND(P)`, your nonce.
3. Compute the ECDH shared key `DHK(U, P)` from `DHPK(U)` and `DHSK(P)`.
4. XOR `RAND(P)` and `RAND(U)`. Take the first 20 bytes as the HKDF salt. Take the last 12 bytes as the initialisation vector.
5. Derive a 256 bit AES-GCM session key `SK(U, P)` with HKDF, using the ECDH shared key and that salt.
6. Encrypt the data with that key and that initialisation vector.

Then send `DHPK(P)`, `RAND(P)` and the encrypted data to the HIU.

### Reference implementations

NHA points at two.

- [Fidelius](https://github.com/sukreet/fidelius), a Java implementation.
- The [Fidelius CLI](https://github.com/mgrmtech/fidelius-cli), which other languages call as a subprocess. Its [examples folder](https://github.com/mgrmtech/fidelius-cli/tree/main/examples) covers [Node.js](https://github.com/mgrmtech/fidelius-cli/blob/main/examples/node/index.js), [Python](https://github.com/mgrmtech/fidelius-cli/blob/main/examples/python/main.py), [Ruby](https://github.com/mgrmtech/fidelius-cli/blob/main/examples/ruby/main.rb) and [PHP](https://github.com/mgrmtech/fidelius-cli/blob/main/examples/php/index.php).

NHA also points at a [webinar recording](https://youtu.be/rSir2gbkEmk?t=9232), from 2:33:52, that walks through Fidelius CLI from both the HIP and HIU sides.
