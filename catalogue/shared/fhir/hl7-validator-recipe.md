---
id: shared.fhir.hl7-validator-recipe
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: Running the official HL7 validator, the tier 2 full conformance check
summary: >
  The agent-executable recipe for tier 2: download the pinned HL7
  validator_cli.jar, run it against the same NRCES IG version the
  catalogue pins, and read what its three commonest failure shapes mean.
sources:
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    hash: sha256:41fa99955adbd1983a235d7c7136b30f423ce34ff541d86b354d95b7704527d4
    fetched: 2026-08-31
    note: >
      The pinned NRCES/NDHM package this recipe validates against,
      ndhm.in 6.5.0 against FHIR 4.0.1. catalogue/openapi/nrces/PINNED
      records the pin.
  - url: https://nrces.in/ndhm/fhir/r4/package.tgz
    fetched: 2026-08-31
    status: reference
    note: >
      NRCeS's own download for the package above.
verified:
  status: unverified
related:
  fhir: [shared.fhir.document-bundles, shared.fhir.map-opconsultation, shared.fhir.map-prescription, shared.fhir.map-diagnosticreport]
  glossary: [shared.glossary.nrces]
---

# Running the official HL7 validator, the tier 2 full conformance check

## In plain words

`validate_fhir` (tier 1) is fast and structural. It does not check
terminology bindings, nested cardinalities, or section slice
discriminators. The official HL7 [FHIR](../glossary/fhir.md) validator
does, against the exact same [NRCES](../glossary/nrces.md)
implementation guide this catalogue pins. This atom is the runnable
recipe for that check: download the pinned jar once, then run it
against any bundle.

## Before you start

- Java 17 or newer. Check with `java -version`; if it is missing,
  install it through your platform's package manager.
- A document bundle to check, as a `.json` file on disk.
- Network access to GitHub for the one-time jar download, or the jar
  already downloaded, for the offline path below.

## What happens

Download the validator, pinned to a specific release. Update this pin
deliberately, never silently: a validator upgrade can change which
findings it reports, so bumping the version number is a decision, not
an accident.

```bash
curl -sSL -o validator_cli.jar https://github.com/hapifhir/org.hl7.fhir.core/releases/download/6.3.11/validator_cli.jar
```

This pins `validator_cli.jar` at HL7 core release 6.3.11.

Run it against the same IG version the catalogue pins (ndhm.in 6.5.0,
FHIR 4.0.1):

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0
```

`-ig ndhm.in#6.5.0` tells the validator to fetch the package by
its published id and version. For an air-gapped environment, point it
at the tgz already on disk instead:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig path/to/nrces-ndhm.in-6.5.0.tgz
```

Both forms check the same profiles; the second never touches the
network.

## How you know it worked

Exit code 0, and the validator's own report lists no errors. Warnings
are not the same as a pass: read them, and decide deliberately whether
each one is acceptable, rather than treating a warning-only run as
clean.

## When it goes wrong

Three message shapes account for most of what integrators hit first:

- **A profile-not-found message.** The validator could not resolve the
  IG or one of its profiles. This almost always means the `-ig` flag
  or the package id is wrong: a typo in `ndhm.in#6.5.0`, a stale tgz
  path, or a version that does not match what was downloaded. Fix the
  `-ig` argument before looking anywhere else.
- **A slice-matching error.** The validator names the Composition
  section that does not match its slice's discriminator, for example a
  section present in the bundle whose title or coding does not line up
  with what the profile's slicing rule expects. This is exactly the
  class of check tier 1 does not perform (tier 1 matches a section by
  title or `code.text` as a pragmatic proxy; tier 2 checks the real
  discriminator). Fix the section's coding to match the profile, not
  just its title.
- **A terminology server message.** The validator tried to reach a
  terminology server to check a code and could not, usually because the
  run is offline. Silence this for offline runs with `-tx n/a`, at the
  cost of code validation: any SNOMED, LOINC or other bound code in the
  bundle stops being checked, so treat an `-tx n/a` run as structural
  plus slicing, not full conformance.

A clean tier 1 run (`validate_fhir` with no findings) does not
substitute for this. Tier 1 is a fast pre-flight; this is the full
conformance check, and it is the one whose report actually
corresponds to what NRCES profile validation means.
