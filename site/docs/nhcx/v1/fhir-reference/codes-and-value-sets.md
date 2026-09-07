---
title: Codes and value sets
sidebar_label: Codes and value sets
description: Every code an NHCX bundle uses with the system it belongs to, and the bindings the published samples get wrong.
verification: unverified
source: NHCX Integration Handbook Appendix A; NHCX Requests and Responses for UseCases, value sets; Domain Specifications page, terminologies; NHCX FAQs v1.2 §24, §25
sidebar_position: 19
---

# Codes and value sets

Every code an NHCX bundle uses, in one place, with the system it belongs to. The workflow codes are in the Overview's Workflow Codes chapter and are not repeated here.

## In short

- Every code an NHCX bundle uses, with the system it belongs to.
- Supporting-info categories and codes come in two competing forms; the samples and the error messages disagree.
- Several declared systems are HTML documentation pages rather than code systems. Copy them anyway.
- The workflow codes are not repeated here; they have a page of their own.

## Supporting-Info categories

System `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category`.

| Code | Display | Takes |
| :---- | :---- | :---- |
| `ONS` | Period, start or end dates | date-time string |
| `OTH` | Other | date-time string |
| `INV` | Investigation | reference |
| `ATT` | Attachment | attachment |
| `HDS` | Hospital discharge summary | reference |
| `DGN` | Diagnosis | reference |
| `LAB` | Lab test | reference |
| `AOB` | Onset of current symptoms | value |
| `MB` | Medical bill | attachment |
| `DIA` | Diagnostic report | reference |
| `CD` | Clinical document | reference |
| `INF` | Information | reference |
| `DIS` | Discharge status | string |
| `NMI` | Query remarks | string |
| `POI`, `POA`, `DOB`, `DEF`, `FIR`, `EMP` | Proof of identity, address, birth; declaration; FIR; employment | attachment |
| `STG` | Standard treatment guideline questionnaire | reference |
| `ADMD` | Admission date | date-time string |
| `SURD` | Surgery date | date-time string |
| `DSCHD` | Discharge date | date-time string |

The last three are the categories the functional requirements document prescribes for the admission, surgery and discharge dates, and they are what the sample bundles actually carry. The payer's own rejection messages instead name `ONS` for all three. Both are in the corpus; confirm with the payer.

## Supporting-Info codes

System `https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-supportinginfo-code` in the sample bundles; the handbook writes it as `CodeSystem/`. Follow the samples.

| Code | Display |
| :---- | :---- |
| `EDT` | EncounterDateTime |
| `ADDD` | Admission date - Discharge date |
| `PSP` | PatientSurgeryPerformed |
| `DSDE` | Discharge Date |
| `DTH` | DischargeToHome |
| `DTM` | DischargetoMortuary; also the death date under `ONS` |
| `LAMA` | Discharge with LAMA |
| `DAMA` | Discharge with DAMA |
| `DIS` | Discharge Summary |
| `100008` | General Findings |
| `100009` | Visual Acuity Report |
| `AT` | Questionnaire answers under `INF` |
| `ODN` | Policy-level questionnaire under `INF` |
| `CQD` | Case remarks for a query answer under `NMI` |
| `BCF` | Birth certificate |
| `DCB` | Discharge card for birth of a child |
| `MAND0006`, `MAND0062`, `MAND0409`, `MAND0455`, … | The mandatory-document family. The insurance plan defines several hundred of these, and the eligibility response with purpose auth-requirements returns the ones a given procedure needs. The code returned there is the code sent back on the supporting-info entry that satisfies it. |

## Identifier types

| Code | Meaning |
| :---- | :---- |
| `PMJAY` | Member ID |
| `ABHA` | ABHA number, no hyphens |
| `CLN` | Claim number |
| `NPI` | Provider's HFR ID |
| `NIIP` | Payer's registry ID |
| `NH` | Plan identifier |
| `MD` | Medical registration number |
| `MR` | Medical record number, used on a Communication |
| `ADN`, `HPID`, `HPIN`, `MCD` | Other identifier types the sample bundles carry |

`HPIN` is not optional under PMJAY: the SHA HP sandbox looks the practitioner up by it and refuses a bundle without it with `PAYR-1083`. Send the HPR id as both `HPID` and `HPIN` (Building a Provider 10).
| `JHN` | Jurisdictional health number, used for ABHA in samples |
| `UTR` | Bank transaction reference |

## Adjudication

Categories: `submitted`, `eligible`, `copay`, `benefit`, `eligpercent`, `eligquant`, `reason`, `status`; totals add `tax`, `incentive`, `copayment`.

Claim-level reasons: `approved`, `queried`, `cancelled`.

Deduction reasons: `Non-CoveredService`, `ExceededCoverageLimit`, `DuplicateClaim`, `Coordination-of-Benefits`, `IncompleteDocumentation`, `PolicyDeductible`, `Co-Payment`, `FraudulentClaim`, `MedicalNecessity`, `BenefitLimitReached`, `MissedFilingDeadline`, `PaymentAlreadyMade`.

Denial codes run `ClaimError-1` to `ClaimError-28`, and `PreauthError-1` to `PreauthError-13` plus `PreauthError-15`, with no 14 defined. Each is a sentence, such as "Claim has been rejected due to less than 24 hours of hospitalisation" or "Pre-Auth has been rejected as the Surgery was done before Pre auth approval". The full list is on the value-sets sheet.

Letter form codes: `preauthapproval`, `preauthdenial`, `claimapproval`, `claimdenial`, `dischargeapproval`, `feedbackletter`, `policydocument`.

## Task

Codes: `reprocess`, `cancel`, `nullify`, `suspend`, `release`, `approve`, `search`, `poll`, `status`, `deliver`.

Reasons: `partialpayment`, `erroneousclaim`, `claimrejected`, `rejectiondisputed`, `referred`, `erroneousregistration`, `wrongdiagnosis`, `treatmentplanchanged`, `patientrequest`, `financialconstraints`, `alternativetreatment`, `duplicateclaim`, `administrativeerror`, `other`; and for communication `tatquery`, `grievance`, `walletupdate`, `policychange`, `additionalinfo`, `claimArbitration`.

Input types, at `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code`: `PayerId`, `ProviderId`, `PolicyNumber`, `ProductNumber`, `ClaimNumber`, `InitimationNumber`, `FromDate`, `ToDate`, `FinanceYear`, `ServiceCode`. The `include` input on a communication uses HL7's `http://terminology.hl7.org/CodeSystem/financialtaskinputtype` instead.

Output values: `paymentack`, `claimcancelled`, `claimreinitiated`, `claimsuspended`, `taskak`, `taskdelivered`.

## Money types on a reconciliation

`approvedamount`, `claimedamount`, `tds`, `servicetax`, `advance`, `recovered`, `penality`, and `Payment` for the net line.

## Item categories

Procedure types: `Procedure`, `Investigation`, `Implant`, `Drug`, `Package`, `Room`, `Stratifications`, `Consultation`.

PMJAY specialties, system `https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-benefitcategory`.

| Code | Specialty | Code | Specialty |
| :---- | :---- | :---- | :---- |
| `BM` | Burns | `PM` | Palliative medicine |
| `DL` | Diagnostic laboratory | `SB` | Orthopaedics |
| `ER` | Emergency | `SC` | Surgical oncology |
| `HD` | High-end diagnostics | `SE` | Ophthalmology |
| `HM` | High-end medicine | `SG` | General surgery |
| `HP` | High-end procedures | `SL` | Otorhinolaryngology |
| `ID` | Infectious diseases | `SM` | Oral and maxillofacial |
| `IN` | Interventional neuroradiology | `SN` | Neurosurgery |
| `MC` | Cardiology | `SO` | Obstetrics and gynaecology |
| `MG` | General medicine | `SP` | Plastic surgery |
| `MM` | Mental disorders | `SS` | Paediatric surgery |
| `MN` | Neonatal | `ST` | Polytrauma |
| `MO` | Medical oncology | `SU` | Urology |
| `MP` | Paediatric medical | `SV` | CTVS |
| `MR` | Radiation oncology | `US` | Unspecified surgical |
| `OT` | Transplant | | |

The actual specialties and packages for a hospital come from its InsurancePlan; this list is the value set they draw from. Each specialty's unspecified package is its prefix plus `215`; the unspecified item code on a claim is `U100`; the LAMA/DAMA stay is `LM100`.

## Diagnosis and composition

Diagnosis types: `admitting`, `clinical`, `discharge`, `final`. Diagnoses are ICD-10, system `http://hl7.org/fhir/sid/icd-10`.

Composition types, SNOMED: `721981007` diagnostic studies report, `373942005` discharge summary, `4241000179101` laboratory report, `4261000179100` diagnostic imaging report, `422843007` chief complaint section.

## Other terminologies the domain spec binds

| Attribute | Value set |
| :---- | :---- |
| `coverageeligibilityrequest.insurer` | Insurance company owners |
| `claim.procedure.type` | Procedure type |
| `claim.procedure.procedure` | Procedure code, the scheme's package master |
| `claimresponse.item.adjudication.reason` | Denial codes |
| `claim.item.modifier` | Procedure modifiers |
| `claim.item.category` | Service categories |
| `claim.item.productOrService` | Service codes |
| `practitionerRole.speciality` | Medical specialty |
| `claim.careTeam.role` | Health service provider role |

## Where the systems are wrong

The code is usually right in these samples. The system it is bound to often is not, and a payer that validates bindings will reject what a payer that does not will accept. These are the ones observed across the twenty-two bundles.

| What | The problem |
| :---- | :---- |
| Package codes | The same code appears in five different systems depending on the exchange: the payer's own host in an eligibility request, SNOMED in every preauthorisation and claim item, the payer's host again in the matching `Procedure` inside the same bundle, and two separate ValueSet URLs inside the plan |
| `http://snomed.info/sct0` | One coverage response binds to SNOMED with a trailing zero |
| Supporting-info category | Document entries bind `category` to the supporting-info **code** system rather than the category system. In the plan, the same error runs the other way, with a code bound to the category system |
| `Claim.type` | Binds to a ValueSet URL where a CodeSystem URL belongs |
| Adjudication categories | Bind to `https://hl7.org/fhir/R4/valueset-adjudication.html`, an HTML documentation page used as a code system URI |
| `cost.type` in the plan | Binds to the plan-type system, with a host spelling seen nowhere else, carrying values that are not plan types |
| Some categories | `deductible` and the claim-level status adjudication carry no `system` at all, as does the package coding in two coverage responses |

Take the system from the sample for the exchange you are building, not from the code and not from another exchange. Where a payer rejects on a binding, that rejection is the authority.

## Identifiers and displays that are wrong but required

Three defects are load-bearing, meaning the correct value is the wrong one.

- **The cancellation Task input is spelled `initimationNumber`.** Send the misspelling. It is what the payer reads.
- **Plan displays carry typos**, including misspelled specialty names. Store and echo them verbatim, because the payer rejects on a display mismatch.
- **The payer's own host is spelled four ways** across the set, including a transposition in five bundles. When echoing an identifier back, echo the spelling that arrived rather than the one you believe is correct.

One more that is wrong and not required: entry identifiers in the coverage bundles repeat the full absolute URL, which exceeds what the specification permits for that field. Do not copy the pattern.
