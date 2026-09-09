# Coverage eligibility request

The provider asks the payer whether a policy is live, what it covers, and what a package will need. One `CoverageEligibilityRequest` carries all of that, and `purpose` decides which question is being asked. It is the first exchange in a case, sent at registration or before treatment planning, and it is cheap enough to send three times in three minutes, which is exactly what the sandbox run did.

## In short

- One `CoverageEligibilityRequest` carries four different questions, and `purpose` decides which.
- Six entries, no `Composition`, no clinical evidence. This bundle is small on purpose.
- The provider is identified three different ways across one bundle and its sibling exchange.
- The `Coverage` you send is a stub. Take the policy terms from the response.

## The bundle

Six entries, in this order in the sample. There is no `Composition` and no clinical evidence; this bundle is small on purpose.

| # | Resource | What it is for |
| :---- | :---- | :---- |
| 1 | `CoverageEligibilityRequest` | The question. Carries `purpose`, `item[]` and the references below |
| 2 | `Patient` | The beneficiary, identified by PMJAY ID |
| 3 | `Organization` (`prov`) | The hospital, by HFR ID |
| 4 | `Organization` (`pay`) | The payer, by NIIP registry ID |
| 5 | `Coverage` | The policy the provider believes applies |
| 6 | `Practitioner` | Whoever entered the request, referenced from `enterer` |

Entries reference each other by absolute URL rather than by `urn:uuid:`, and each `fullUrl` repeats in the entry's `id`. Both forms are accepted, so match whichever your gateway partner emits rather than converting.

## The fields that matter

| Path | Value in the sample | Notes |
| :---- | :---- | :---- |
| `status` | `active` | The only value used |
| `purpose[]` | `validation`, `benefits`, `auth-requirements` | One value per request. `discovery` is defined but unsampled |
| `priority.coding` | `http://terminology.hl7.org/CodeSystem/processpriority`, `normal` | |
| `patient` | Reference to entry 2 | |
| `servicedDate` | `2026-02-26` | Date of service, not the date of asking |
| `created` | `2026-02-26T12:51:30+05:30` | Always `+05:30`. UTC fails validation |
| `insurer`, `provider`, `enterer` | References to entries 4, 3 and 6 | |
| `facility.identifier` | system `https://nhcx.pmjay.gov.in`, value `IN1910000151` | The HFR ID again, under a third system |
| `insurance[0].coverage` | Reference to entry 5 | `focal` is not sent |
| `item[].productOrService.coding` | system `https://payer.pmjay.nha.gov.in`, code `MG004A`, display `Dengue fever` | Package code and display, exactly as the plan has them |
| `item[].diagnosis[].diagnosisCodeableConcept.coding` | same system, code `A97.0` | An ICD-10 code under a payer system, not under an ICD system |

`item[]` is what makes a `benefits` or `auth-requirements` request answerable. A `validation` request does not need it, though the sample sends it anyway.

The identifiers are worth reading closely. The `Patient` carries three: `PMJAY` from the NRCeS identifier-type system, `JHN` and `PI` from HL7 v2-0203, all three under `https://bis.pmjay.gov.in` or `https://provider.pmjay.gov.in`. The `PI` value in the sample is the literal string `NA`, which is what a hospital sends when it has no internal MRN yet. The `Coverage` carries an `NH` identifier whose value is the policy code `PMJAY/HP/S/G` under system `https://payer.nha.gov.in`. The `Practitioner` carries `HPID` and `HPIN` with the same value, `1123`.

## The three purposes

The three request files are the same bundle sent three times. Diffed against each other they differ in exactly three places: `CoverageEligibilityRequest.purpose[0]`, `CoverageEligibilityRequest.created`, and `Bundle.timestamp`. Nothing else changes, not the item, not the diagnosis, not the identifiers. So the shape below is the whole contract.

| Purpose | Question | What the payer must return |
| :---- | :---- | :---- |
| `validation` | Is this policy in force, and what is left in the wallet? | Balance and used amount |
| `benefits` | Is this package covered for this beneficiary? | Per-item coverage or exclusion |
| `auth-requirements` | What does this package need before I can treat? | Authorisation flag and required documents |
| `discovery` | Which policies does this person hold? | One `insurance` entry per active coverage. No sample exists |

Build one request and switch `purpose`. Do not build three.

## What the sample shows

`coveragerequest_validation.txt` is 7,206 bytes; `coveragerequest_benefits.txt` 7,204; `coveragerequest_auth-requirement.txt` 7,213. All three are `Bundle.type = "collection"` from the same sandbox run on 26 February 2026, 12:51, 12:53 and 12:55.

The sample is unrepresentative in one respect worth knowing. It carries a single item with a single diagnosis. Real treatment planning asks about several packages at once, and the array is `0..*`.

## Traps

**The package code is bound to a different system in every exchange.** Here `MG004A` sits in `https://payer.pmjay.nha.gov.in`. In every preauthorisation and claim request the same code sits in `http://snomed.info/sct`. In the `InsurancePlan` it sits in `https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-productorservice` under `coverage`, and in `http://hl7.org/fhir/ValueSet/procedure-category` under `plan.specificCost`, in the same resource. One coverage response compounds it with `http://snomed.info/sct0`, a trailing zero. None of these codes are SNOMED concepts. Match on the code, never on the system, and emit whichever system the exchange you are building expects.

**The bundle is labelled as a preauthorisation.** `Bundle.id` is the literal string `PreAuth` and `Bundle.identifier.value` is `VB26AA2600001`, the preauthorisation case number, on a message sent before any preauthorisation exists. The payer does not object. Do not read the case number off an eligibility bundle and assume a case is open.

**`Bundle.meta.lastUpdated` is a frozen template value**, `2025-11-11T15:09:41.516+05:30`, on all three requests and on every other provider-generated bundle in the set. `Bundle.timestamp` holds the real date. Read `timestamp`.

**The provider is identified three ways in one bundle.** `Organization.identifier` uses `NPI` under `https://facility.abdm.gov.in`. `facility.identifier` uses no type code under `https://nhcx.pmjay.gov.in`. And the insurance plan request, a different exchange for the same hospital, sends the sandbox participant code `SBX_001205` instead. The value `IN1910000151` must equal the HFR ID on the sender's participant record whichever wrapper it sits in.

**Two identifier systems are HTML pages.** `Practitioner.qualification.code.coding.system` is `https://hl7.org/fhir/R4/v2/0360/2.7/index.html`, a documentation page, carrying the code `BSC NURSING`. `CoverageEligibilityRequest.identifier.system` is `https://hcx.pmjay.gov.in/v1/coverageeligibility/check`, an endpoint URL. Neither is a code system. Copy them anyway; the payer echoes them back unchanged.

**The `Coverage` you send is a stub.** The sample sets `period` to a five-day window around the service date. The payer's own `Coverage` in the response runs 2023-04-02 to 2026-04-01. Your `Coverage` states which policy you mean, not what its terms are. Take the terms from the response.
