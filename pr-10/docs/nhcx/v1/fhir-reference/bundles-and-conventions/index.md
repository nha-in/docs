# Bundles and conventions

Everything that crosses the exchange is one FHIR R4 Bundle of type `collection`, built to the NRCeS profiles for NHCX. This chapter is the set of rules every bundle obeys before any use case is considered. Every chapter after it covers one exchange in one direction, because that is the unit you actually build. A request and its response are different bundles with different rules, and putting them in one chapter hides that.

## In short

- Everything crossing the exchange is one FHIR R4 Bundle of type `collection`, built to the NRCeS profiles.
- NRCeS is the authority and publishes no payloads; twenty-two PMJAY bundles are the only real evidence.
- The open-protocol page says `document` bundles with a `Composition`. Every sample uses `collection`. Build `collection`.
- Fourteen rules hold across every bundle, including element ids, which the live sandbox proved mandatory.
- Inline attachments in the samples are base64 encoded twice; `DocumentReference` attachments are encoded once.

## Where the payloads come from

Two names appear throughout this section and they do different jobs.

**NRCeS** is the authority. It publishes the profiles every resource declares and the code systems every coding binds to. It does not publish payloads. The one implementation guide it has issued for NHCX contains no machine-readable example at all; every worked example in it is a picture. So NRCeS tells you what shape a resource must have, and nothing more.

**PMJAY** is the evidence. Twenty-two complete bundles from one sandbox run are the only real payloads available, and they are what this section is built on. They cover one patient, one policy, one preauthorisation and one claim, from eligibility through to payment.

That pairing has a consequence. The samples are a record of what one implementation actually sent and received, not a curated specification, and they carry the defects of a real system. Where a sample contradicts the profile, or contradicts another sample, the chapters here say so and name both sides. Free-text values such as an adjudicator's name in a disposition field confirm what these are: hand-run transactions, captured as they happened.

Eight of the exchange directions this section covers have no sample at all. Those chapters are written from specification and labelled as such.

## The bundle

```json
{
  "resourceType": "Bundle",
  "id": "VB26AA2600001",
  "identifier": { "system": "https://payer.pmjay.nha.gov.in", "value": "VB26AA2600001" },
  "meta": { "lastUpdated": "2026-02-26T12:51:30+05:30" },
  "type": "collection",
  "timestamp": "2026-02-26T12:51:30+05:30",
  "entry": [
    { "fullUrl": "urn:uuid:…", "resource": { "resourceType": "Claim", "…": "…" } }
  ]
}
```

- `type` is always `collection`. Not `document`, not `transaction`.
- Entries are resources placed directly; no request or response elements.
- The bundle's identifier is the case number under PMJAY.

**The one contradiction you must settle before writing any code.** The open-protocol page on the portal states that all claim objects are modelled as bundles of type `document`, with a `Composition` as the first resource. Every one of the twenty-two PMJAY samples uses `collection`, with no root Composition. One teaching deck manages to show both, on different slides. Compositions do appear inside PMJAY bundles, but as nested clinical documents rather than as the bundle's own header. Build `collection`, because that is what the live exchange has been observed to accept, and know that you will meet the other reading in the written specification.

**A second trap in the same block.** All ten provider request samples carry `meta.lastUpdated` frozen at `2025-11-11T15:09:41.516+05:30`, a template value four months older than the transaction, while `Bundle.timestamp` holds the real date. Payer bundles set both correctly. Do not read `meta.lastUpdated` as meaning anything, and do set it correctly in what you send.

## Fourteen rules

1. **Profiles.** A resource declares its NRCeS profile in `meta.profile`, for example `https://nrces.in/ndhm/fhir/r4/StructureDefinition/Claim`, and the gateway and the payer validate against it. Declare one on everything you send. Do not assume one on everything you receive: ten of the twenty-two samples contain resources with no profile at all, including every payer-generated response.
2. **References.** Resources inside one bundle reference each other by `urn:uuid:` and each entry carries that UUID as its `fullUrl`. The samples on the portal use absolute URLs instead; both are accepted, `urn:uuid:` is the handbook's recommendation.
3. **Timestamps** are ISO 8601 with the Indian offset, `+05:30`. The handbook says UTC fails validation.
4. **Identifiers carry a type code, from one of two systems.** `PMJAY`, `ABHA`, `CLN` and `UTR` come from NRCeS at `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code`. `NPI` for a hospital's HFR ID, `NIIP` for a payer's registry ID, `NH` for a plan and `JHN` for a jurisdictional health number come from HL7 at `http://terminology.hl7.org/CodeSystem/v2-0203`. Take the system from the samples, not from the code.
5. **The HFR ID inside the bundle** must equal the registry ID on the sender's participant record.
6. **Sequences link things.** A `Claim.item` points at its diagnosis, procedure, care team and supporting information by their sequence numbers, not by reference.
7. **Documents arrive two ways, and the samples use both.** A supporting-info entry either carries the file inline in `valueAttachment`, or points with `valueReference` at something else in the same bundle. The specification says that something is a `DocumentReference`; in the real preauthorisation the reference points at a `Composition` instead, because the embedded clinical documents are flattened into the same collection rather than nested as attachments. Accept both when reading. One document per supporting-info entry, 2 MB each, 20 MB for the bundle.
8. **Category decides structured or not.** Supporting-info categories `DIA`, `HDS`, `CD`, `INF` take a reference to a structured document; `POI`, `POA`, `DOB`, `DEF`, `FIR`, `ATT`, `MB` take an attachment.
9. **Codes and displays match the plan** character for character. The payer rejects a package whose display differs from the plan's. This includes the plan's own misspellings, which are real and must be stored and echoed verbatim.
10. **Inline attachments in the samples are base64 twice over.** Every inline `valueAttachment.data` in the preauthorisation, enhancement and both claim submissions decodes to another base64 string, which then decodes to the actual PDF or image. The `DocumentReference` attachments in the very same bundles are encoded once. Nothing documents this, and it is the sort of defect that renders as a blank page at the payer and gets blamed on the wrong layer for a week. Decide deliberately which convention you follow, and check what the payer's system actually accepts before your first real submission.
11. **The same `Claim` serves preauthorisation and claim.** Only `Claim.use` changes. Build one and switch the field. Note that the sampled claim does not carry a `preAuthRef`, so nothing in the payload links a claim to the preauthorisation it followed.

12. **Every Claim bundle carries element ids, and the payer service reads by them.** The SHA HP sandbox refuses an item without an `id`, with `PAYR-1027`, "invalid item id". That is not a code lookup at all. Give the `Claim` its claim number as `id`, each `item` `Item/n`, each `procedure` `Procedure/n`, and each `supportingInfo` `SupportingInformation/n`. The resources take a serial: `1` for `Patient`, `Coverage` and the provider `Organization`, `2` for the payer `Organization`, and their sequence for `Practitioner` and `Procedure`. The NHA samples carry all of these; the reference set under `apps/reference/provider` now does too. Verified live, Building a Provider 10.
13. **A Practitioner carries the HPR id as `HPIN` as well as `HPID`.** The SHA looks the doctor up by the identifier typed `HPIN` (`PAYR-1083` without it), under `https://hpr.abdm.gov.in`. Keep `HPID` and the registration number typed `MD` beside it. Verified live.
14. **A PMJAY item is coded from the package master, not from the hospital's own categories.** `item.category` is the master's specialty code, `MG` rather than a generic `GEN`. The ward tier rides as `item.modifier` with the master's stratification code. A claim bills the package alone at the whole amount, because the rate is all-inclusive. Building a Provider 10 has the mapping.

## The focused resources

The domain specification names the resources NHCX profiles and expects. A use case uses a subset.

| Resource | Used by |
| :---- | :---- |
| `CoverageEligibilityRequest`, `CoverageEligibilityResponse` | Eligibility |
| `Claim`, `ClaimResponse` | Preauthorisation, claim, predetermination, and the answer to any Task |
| `InsurancePlan` | Plan |
| `Task` | Plan request, cancel, reprocess, search, payment notice, payment acknowledgement, communication |
| `PaymentNotice`, `PaymentReconciliation` | Payment |
| `Communication`, `CommunicationRequest` | Communication |
| `Patient`, `Organization`, `Practitioner`, `PractitionerRole`, `Coverage` | Every bundle |
| `Procedure`, `Condition`, `Encounter`, `Observation`, `DiagnosticReport`, `Composition`, `DocumentReference`, `Questionnaire`, `QuestionnaireResponse`, `Appointment`, `ChargeItem`, `Invoice`, `Medication`, `MedicationRequest`, `AllergyIntolerance` | Inside preauthorisation and claim bundles, as clinical and billing evidence |

The real PMJAY preauthorisation sample carries 31 entries; the claim sample 44; a query answer with a full clinical set 96. That is the scale to design for.

## Where the profiles live

- NHCX profiles: `https://nrces.in/ndhm/fhir/r4/hcx-profile.html`
- Bundle profiles: `StructureDefinition-CoverageEligibilityRequestBundle`, `ClaimBundle`, `ClaimResponseBundle`, `InsurancePlanBundle`, `PaymentNotice`, `Task`, under the same base
- Value sets: `ValueSet-ndhm-supportinginfo-category`, `ValueSet-ndhm-supportinginfo-code`, `ValueSet-ndhm-benefitcategory`
- Validation help: `nrc-help@cdac.in`
