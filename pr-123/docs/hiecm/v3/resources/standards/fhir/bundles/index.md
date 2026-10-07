# FHIR bundles and validation

Build a record as a FHIR R4 document bundle, then validate it before you send it. The packaging detail is in the [M2 guide](/docs/pr-123/docs/hiecm/v3/api/m2), and the eight record types are on the [FHIR overview](/docs/pr-123/docs/hiecm/v3/resources/standards/fhir).

## In short

- Every record is a `Bundle` of `type: document` that conforms to the [ABDM FHIR implementation guide](/docs/pr-123/docs/hiecm/v3/resources/standards/fhir/nrces), version 6.5.0.
- The first entry is always a `Composition`, whose SNOMED CT type says what the record is.
- Build it simple, around a PDF or image, or structured, with coded resources.
- Validate every bundle against the guide before you send it.

## Two ways to build any record

| Shape             | What it is                                                             | When you use it                                          |
| ----------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| Simple bundle     | A FHIR bundle wrapping a PDF or image attachment that holds the detail | Your source document is a scan, a signed PDF or an image |
| Structured bundle | A FHIR bundle with coded health information in FHIR resources          | Your system holds the data as fields, and can code it    |

Both are compliant. A structured bundle is more useful to the receiver, because it can be searched rather than only displayed.

## Which resources a record carries

The reference service on the [HIU](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#hiu) side supports these resources inside a bundle.

- **Clinical content:** `Observation`, `Condition`, `MedicationRequest`, `DocumentReference`, `DiagnosticReport`, `Procedure`.
- **Context and reference entities:** `Medication`, `Practitioner`, `Patient`, `Organization`, `Encounter`.

That is the union across record types, not a mapping. Which resources belong to which record type is not documented here. The NRCeS profile for each type is the authority.

## The bundle shape

Every record is a `Bundle` of `type: document`, and the first entry must be a `Composition`.

```json
{  "resourceType": "Bundle",  "id": "bundle01",  "timestamp": "2020-01-01T15:32:26.605+05:30",  "type": "document",  "entry": [    {      "fullUrl": "Composition/1",      "resource": {        "resourceType": "Composition",        "id": "1",        "status": "final",        "type": {          "coding": [            {              "system": "https://ndhm.gov.in/sct",              "code": "440545006",              "display": "Prescription record"            }          ]        }      }    }  ]}
```

That is the skeleton.

### Why the Composition comes first

A bundle on its own is a bag of resources. The Composition turns it into a document: what this is, who it is about, who wrote it, who attests to it, and which resources make up its sections. Without it, a receiving system has a `MedicationRequest` and no idea whether it belongs to a prescription, a discharge summary or a draft.

`Composition.type` carries the SNOMED CT code that answers "what is this". Two are documented: `440545006` for a prescription record and `721981007` for a diagnostic report. The rest have their own codes in the NRCeS profiles.

### The rules that fail validation

| Field                         | Rule                                                                                                                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                          | Unique per bundle, and resolvable inside your own system for traceability                                                                                                                             |
| `timestamp`                   | The time the document was issued                                                                                                                                                                      |
| `identifier`                  | Traces the document back to your system                                                                                                                                                               |
| `type`                        | Must be `document`                                                                                                                                                                                    |
| `meta.versionId`              | Set it on the bundle, so updates can be checked against the latest version                                                                                                                            |
| `entry[].fullUrl`             | A logical URL of the form `resource-type/id`, resolvable inside the bundle. Never an absolute URL.                                                                                                    |
| `Composition.attester.party`  | References an `Organization` whose `identifier.value` is the facility's [HIP](/docs/pr-123/docs/hiecm/v3/getting-started/glossary#hip) id as registered in the facility registry. Mode is `official`. |
| `Composition.section.entry[]` | Top level resources only. Referenced resources such as Patient, Encounter and Practitioner belong in the bundle, not in the section entries.                                                          |

The attester rule has an environment trap. The organization identifier system is the ABDM facility registry at [nhpr.abdm.gov.in](https://nhpr.abdm.gov.in/nhpr/v4/home) for production and [hspsbx.abdm.gov.in](https://hspsbx.abdm.gov.in/nhpr/v4/home) for sandbox. A bundle that passes in sandbox with the sandbox value is not right in production.

One more thing to watch. `Composition.type.coding.system` is `https://ndhm.gov.in/sct` in the sample above, while `section.code.coding.system` in the same sample is `https://affinitydomain.in/sct`. The two differ in the sample itself. Take the system values from the NRCeS profile, not from the sample.

## Validate before you ship

Run this procedure locally. You need JDK 8 or higher.

1. Create a folder and download the FHIR validator CLI, version 6.2.1, from [the HAPI FHIR core release](https://github.com/hapifhir/org.hl7.fhir.core/releases/download/6.2.1/validator_cli.jar). Save `validator_cli.jar` into it.
2. Get a bundle to test: one your own system produced, or an NRCeS example from [nrces.in/ndhm/fhir/r4](https://nrces.in/ndhm/fhir/r4/index.html), switching to the JSON tab to download it.
3. Run the validator from that folder:

```shell
java -jar validator_cli.jar <YOUR_BUNDLE_FILENAME>.json -ig https://nrces.in/ndhm/fhir/r4
```

It checks structural correctness, conformance to the NRCeS profiles, and required fields and constraints. Editing an NRCeS example that already validates towards your own data is faster than starting from an empty file.

### Other ways to validate

The [Implementation Guide for Adoption of FHIR in ABDM and NHCX](https://www.nrces.in/download/files/pdf/Implementation_Guide_for_Adoption_of_FHIR_in_ABDM_and_NHCX.pdf) gives three ways to validate.

| Way          | How                                                                                  |
| ------------ | ------------------------------------------------------------------------------------ |
| Command line | `java -jar validator_cli.jar <file_name> -ig ndhm.in#6.5.0`                          |
| Browser      | Open [validator.fhir.org](https://validator.fhir.org) and select the `ndhm.in` guide |
| In your code | Load `package.tgz` into the HAPI FHIR validator from your classpath                  |

The validator checks structure, profile conformance and coding. Every coding must carry the correct system URL, code and display.

## How you know it worked

The validator reports no errors for your bundle against `ndhm.in#6.5.0`.

## When it goes wrong

- **A coding fails validation.** The system URI differs from the one the profile fixes. Copy it from the profile, not from an older sample.
- **Anything else.** Read the [FHIR questions in the NRCeS FAQ](https://www.nrces.in/faqs#fhir).

## Where this is implemented

- [M2 use cases](/docs/pr-123/reference/hiecm-m2), the transfer call that carries the encrypted bundle.
- [How a record travels](/docs/pr-123/docs/hiecm/v3/concepts/data-flow), what happens to the bundle after you build it.
- [Care contexts and linking](/docs/pr-123/docs/hiecm/v3/concepts/linking), how records are grouped and made findable.
- [Consent](/docs/pr-123/docs/hiecm/v3/concepts/consent), where the [HI type codes](/docs/pr-123/docs/hiecm/v3/resources/standards/fhir#the-record-types) are chosen and read.
- [Standards and terminologies](/docs/pr-123/docs/hiecm/v3/resources/standards), the code systems a structured bundle codes its content with.
