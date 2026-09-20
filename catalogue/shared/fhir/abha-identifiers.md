---
id: shared.fhir.abha-identifiers
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: Carrying an ABHA number and an ABHA address on a FHIR Patient
summary: >
  NRCeS tells you apart the two health identifiers a person has by the
  identifier type code, not by a namespace URI, and it publishes no
  namespace URI for either of them.
sources:
  - url: https://nrces.in/ndhm/fhir/r4/StructureDefinition-Patient.html
    status: docs-only
    note: >
      The NRCeS Patient profile, ABDM Implementation Guide 6.5.0. The
      cardinalities and the bindings below are read from its element
      table.
  - url: https://nrces.in/ndhm/fhir/r4/ValueSet-ndhm-identifier-type-code.html
    status: docs-only
    note: >
      The Identifier Type value set, which carries the HIN and ABHA
      codes and the wording of their definitions.
related:
  fhir: [shared.fhir.document-bundle, shared.fhir.hl7-validator-recipe, shared.fhir.profile-and-example-together]
  glossary: [shared.glossary.abha]
---

# Carrying an ABHA number and an ABHA address on a FHIR Patient

## In plain words

A hospital system holds two ABDM identifiers for the same person: the
14 digit [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number)
and the
[ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address),
which reads like an email local part. When you write that person into a
[FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) Patient, both go in
`Patient.identifier`, and something has to say which is which.

The usual FHIR answer is `identifier.system`, a namespace URI that names
the authority the value belongs to.
[NRCeS](/docs/hiecm/v3/getting-started/glossary#nrces) does not use it
that way. It leaves `system` optional and unspecified, and makes
`identifier.type` mandatory instead. The type code is what tells the two
apart.

This matters because a namespace you invent is a namespace only you
understand. Another system reading your bundle has no way to learn what
`https://your-hospital.example/abha` means, and NRCeS publishes nothing
for it to compare against.

## Before you start

- You can build a bundle at all. The envelope and its Composition are in
  [DocumentBundle](/docs/hiecm/v3/reference/fhir/document-bundle).
- You have the person's identifiers from ABDM rather than from a form.
  The profile and card calls in M1 return them.
- You can run the validator, because that is the only check that tells
  you the Patient is right. The setup is in
  [the HL7 validator recipe](/docs/hiecm/v3/reference/fhir/hl7-validator-recipe).

## What happens

The NRCeS Patient profile constrains `Patient.identifier` like this.

| Element | Cardinality | Binding |
| --- | --- | --- |
| `Patient.identifier` | 1..* | none |
| `Patient.identifier.type` | 1..1, must support | `ndhm-identifier-type-code`, extensible |
| `Patient.identifier.system` | 0..1, must support | none, and no example beyond the generic FHIR one |

So at least one identifier is required, its type is required, and its
system is optional with nothing prescribed to put in it.

Two codes in
`https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code`
cover the pair.

| Code | NRCeS display | What it actually identifies |
| --- | --- | --- |
| `HIN` | Health ID issued by NDHM | The 14 digit ABHA number |
| `ABHA` | Ayushman Bharat Health Account (ABHA) ID | The ABHA address |

Read that table twice before you use it. The code named `ABHA` is the
address, not the number, and the number is `HIN`. NRCeS's own definition
for `ABHA` describes a self declared username, which is the address. The
naming invites exactly the wrong guess.

A Patient carrying both:

```json
{
  "resourceType": "Patient",
  "meta": {
    "profile": ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient"]
  },
  "identifier": [
    {
      "type": {
        "coding": [{
            "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "HIN", "display": "Health ID issued by NDHM"
          }]
      },
      "value": "<ABHA_NUMBER_14_DIGITS>"
    },
    {
      "type": {
        "coding": [{
            "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code", "code": "ABHA", "display": "Ayushman Bharat Health Account (ABHA) ID"
          }]
      },
      "value": "<ABHA_ADDRESS>"
    }
  ],
  "name": [{ "text": "<PATIENT_NAME>" }],
  "gender": "<GENDER>"
}
```

The only `system` in that block is the one naming the code system the
type code comes from. Neither identifier carries a `system` of its own,
because NRCeS prescribes none.

NRCeS's own examples do something different, and you should know it
before a receiver surprises you. Across all 144 examples in the pinned
package, no Patient identifier uses `HIN` or `ABHA` at all. Twelve carry
the ABHA number under HL7's generic `MR` code with
`identifier.system` set to `https://healthid.ndhm.gov.in`, and twenty
carry an Aadhaar under `ADN` with `https://uidai.gov.in/`. Both shapes
satisfy the profile, because the binding is extensible and `system` is
free, and neither has been confirmed against an ABDM receiver. Carry
both codes rather than choosing, and expect a receiver to select on
`type.coding.code`.
[Reading the profile and the example together](profile-and-example-together.md)
records the measurement.

If your database schema needs a namespace URI, that is a local decision
and it stays local. Record it as yours, keep the type code alongside it,
and never let a reader infer that the URI came from NRCeS.

## How you know it worked

Run the validator against the same Implementation Guide version this
catalogue pins.

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0
```

You see `Success: 0 errors` for the Patient resource, and no message
mentioning `Patient.identifier.type`. A bundle that omits the type
fails on cardinality, so the validator passing on a Patient that carries
both identifiers is the observation that the pair is recorded correctly.

Then read it back the way a receiver would: select the identifier whose
`type.coding.code` is `HIN` and confirm you get 14 digits, and the one
whose code is `ABHA` and confirm you get the address. If either selector
returns nothing, the codes are the wrong way round.

## When it goes wrong

- **The validator fails on `Patient.identifier.type`.** The type is
  1..1, not optional. Every identifier in the array needs one, including
  your hospital's own MRN.
- **A receiver cannot tell the two identifiers apart.** You distinguished
  them by `system` rather than by `type.coding.code`. Nothing outside
  your own estate can read that.
- **The 14 digit value comes back under the `ABHA` code.** The codes are
  swapped. `HIN` is the number.
- **The validator rejects the code.** The `type.coding.system` must be
  `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code`.
  The binding is extensible, so a code from elsewhere is allowed only
  when nothing in the value set fits, and both of these fit.
