---
id: shared.fhir.profile-and-example-together
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
order: 1
title: Read the profile and the example together, because each omits what the other carries
summary: >
  A NRCeS profile gives the cardinalities and a NRCeS example gives the shape,
  and a generator written from either one alone is wrong in a different way.
sources:
  - url: https://nrces.in/ndhm/fhir/r4/StructureDefinition-Patient.html
    status: read-from-package-2026-09-20
    note: >
      Read from the pinned NRCeS package, ABDM Implementation Guide 6.5.0.
      Patient.identifier.type is 1..1 and Patient.identifier.system is 0..1
      with no fixed value, and the ndhm-identifier-type-code code system
      carries both HIN and ABHA.
  - url: https://nrces.in/ndhm/fhir/r4/Bundle-HealthDocumentRecord-example-01.html
    status: read-from-package-2026-09-20
    note: >
      Across all 144 examples in the same package, no Patient identifier uses
      HIN or ABHA. Twelve use code MR from HL7's v2-0203 code system with
      system https://healthid.ndhm.gov.in, and twenty use ADN from the NDHM
      code system with system https://uidai.gov.in/.
related:
  fhir:
    - shared.fhir.conditional-cardinality
    - shared.fhir.abha-identifiers
    - shared.fhir.document-bundle
---

# Read the profile and the example together, because each omits what the other carries

## In plain words

NRCeS publishes two things about every record type, and they answer different
questions. The profile gives the required elements and their cardinalities. The
example gives the shape, including values the profile never mentions.

Read alone, each one misleads. A generator written from the profile omits what
the example fills in. One written from the example hardcodes values the profile
never fixed. The only safe reading is both.

## Before you start

- A profile digest for the record type you are producing.
- The matching NRCeS example, which the catalogue serves alongside the digest.

## What happens

Two places where the gap has teeth.

**The profile carries values a digest may not show you.** NRCeS fixes the
SNOMED CT code that types a Composition at `Composition.type.coding.code`,
three levels below the top of the resource:

| Element | Fixed value |
|---|---|
| `Composition.type.coding.system` | `http://snomed.info/sct` |
| `Composition.type.coding.code` | `419891008` |
| `Composition.type.coding.display` | `Record artifact` |

A summary that reports only the top two levels of a profile shows none of them,
and a reader concludes the code exists only in the example and is therefore
optional. It is fixed by the profile. Check the depth of whatever summary you
are reading before concluding something is absent.

**The example may use a shape the profile merely permits.** NRCeS requires
`Patient.identifier.type` and leaves `Patient.identifier.system` optional with
nothing prescribed, and its own code system carries `HIN` for the ABHA number
and `ABHA` for the ABHA address. No example uses either code. Every Patient in
the package instead carries:

| Identifier | `type.coding.code` | `type.coding.system` | `identifier.system` |
|---|---|---|---|
| ABHA number | `MR` | `http://terminology.hl7.org/CodeSystem/v2-0203` | `https://healthid.ndhm.gov.in` |
| Aadhaar | `ADN` | the NDHM identifier type code system | `https://uidai.gov.in/` |

Both satisfy the profile, because the binding on `identifier.type` is
extensible and `identifier.system` is free. They are not interchangeable to a
receiver reading by code. This catalogue documents the type code approach in
[carrying an ABHA number and an ABHA address](abha-identifiers.md); what the
examples do is recorded here because the two differ and no source reconciles
them.

Neither reading has been confirmed against an ABDM receiver. Until one is,
carry both codes rather than choosing, and expect a receiver to select on
`type.coding.code`.

## How you know it worked

Take the record type you are producing. Open its digest and its example side by
side, and list every value in the example that the digest does not mention.
For a document Composition that list includes the SNOMED code, and each entry
is either a value the profile fixes at a depth your summary truncated, or a
convention the example is demonstrating.

Then generate a bundle and diff it against the example structurally: same
resource types, same nesting, same fixed values. A difference is either a
deliberate choice you can name, or a gap.

## When it goes wrong

- **A generated Composition has no `type.coding`.** It was written from a
  summary that truncated the profile before the fixed code.
- **A receiver cannot find the patient's ABHA number.** It selected on a code
  or a system your bundle does not carry. Carry both codes.
- **A value is hardcoded that the profile never fixed.** It came from the
  example alone. Check the profile before treating any example value as
  mandatory.
