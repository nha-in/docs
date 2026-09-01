# NRCES FHIR implementation guide

The pinned NRCES/NDHM FHIR R4 package the FHIR capability is built on.
The raw tgz lives in ../.raw/ untouched; PINNED names the version, source
and sha256. Three consumers read this pin: the indexer's digest
extraction, the tier 1 validator's responses, and the tier 2 validator
recipe atom. To move to a new IG release, update the tgz, PINNED, and the
recipe atom together, and rerun the digest golden tests; never let the
three drift apart.

The version also sits hardcoded, as `#6.5.0` in a `-ig` example, in five
other places: the two FHIR skills
(plugins/abdm/skills/fhir-generate/SKILL.md,
plugins/abdm/skills/fhir-audit/SKILL.md) and three deep map atoms
(catalogue/shared/fhir/map-opconsultation.md,
catalogue/shared/fhir/map-prescription.md,
catalogue/shared/fhir/map-diagnosticreport.md). An IG bump must update
these too, or grep for the old version string across catalogue/ and
plugins/ to find what was missed.
