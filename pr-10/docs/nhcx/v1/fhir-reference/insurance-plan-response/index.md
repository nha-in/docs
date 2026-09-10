# Insurance plan response

The payer's answer to the poll, and the largest message in NHCX by a wide margin. It is the policy as data: what the hospital may bill, at what rate, under what rules, with which documents, and on which forms. Everything on a treatment-planning screen should come from here.

## In short

- Two shapes exist, and which one arrives depends on whether the payer is a scheme or a private insurer.
- They are not layout variants: they answer different questions and need different code paths.
- The bundle, the plan header and the caching rules are the same for both.
- Package-based is fully sampled at 21 MB. Coverage-based has no sample in the corpus at all.

## Two shapes, and a payer picks one

The Insurance Plan implementation guide defines two ways to structure the same resource, and which one arrives depends on who the payer is. They are not variants of a layout. They answer different questions, and a hospital system that handles one will not read the other.

| | Package-based | Coverage-based |
| :---- | :---- | :---- |
| Sent by | Government schemes. PMJAY throughout | Private insurers and their TPAs |
| Path to a billable thing | `plan[0].specificCost[] → category → benefit[] → cost[]`, with the rules on `coverage[]` alongside | `coverage[] → benefit[] → limit[]` |
| The unit | A named package at a fixed all-inclusive rate, for example `MG004A` "Dengue fever" | A benefit with a money limit, for example ICU charges or room rent |
| What decides the amount | The package rate, plus stratification and implant lines the flags allow | The benefit's limit, against the bill the hospital actually raises |
| Rules carried | Sixteen `Claim-Condition` flags per package | `benefit.requirement` strings such as "Pre-authorisation required" |
| Sample in the corpus | Yes. One 21 MB payload, fully worked | None |
| Written up in | The next chapter | The chapter after it |

Both arrive on `/v1/insuranceplan/on_request` in a `collection` bundle, in answer to the same one-`Task` request. The next two chapters take each shape in turn. What follows here is what they share.

## The bundle

2,217 entries. Three resource types.

| # | Resource | Count | What it is |
| :---- | :---- | :---- | :---- |
| 1 | `InsurancePlan` | 1 | The whole policy. 21 MB of the 21 MB file |
| 2 | `Organization` | 1 | The payer, `SHA HP`, NIIP `1518` |
| 3 onwards | `Questionnaire` | 2,215 | The payer's data-requirement forms |

There is no provider `Organization`. `ownedBy` and `administeredBy` both point at entry 2. There is no `Patient`, because a plan is not about a person.

`Bundle.identifier` is `100155-1000003614` under system `https://payer.pmjay.nha.gov.in`, correctly spelled here. `Bundle.type` is `collection`, `Bundle.timestamp` and `meta.lastUpdated` are both `2026-03-03T12:56:48.159+05:30`.

## The plan header

| Path | Value |
| :---- | :---- |
| `id` | `100155-1000003614` |
| `status` | `active` |
| `name` | `PMJAY - Universal Health Policy` |
| `type.coding` | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-insuranceplan-type`, code `07`, `Universal Health Policy` |
| `period` | 2023-04-01 to 2026-03-31 |
| `identifier[0]` | system `https://hcx.pmjay.gov.in/v1/InsurancePlan`, value `100155-1000003614` |
| `identifier[1]` | type `NH`, system `https://payer.nha.gov.in`, value `PMJAY/HP/S/G`, element id `100155` |
| `identifier[2]` | type `XV`, system `https://payer.nha.gov.in`, value `PMJAY/HP/S/2024/R2`, element id `100185` |
| `plan[0].type.coding` | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-plan-type`, code `03`, `Group` |
| `plan[0].generalCost[0].cost` | 500,000 INR |

There are two type codes and they answer different questions. `InsurancePlan.type` `07` is what kind of insurance this is. `plan.type` `03` is how the product is sold, in this case as a group policy. `generalCost` of 500,000 INR is the family wallet, and it reconciles exactly with the eligibility response's 463,730 allowed plus 36,270 used.

`identifier[1].value` is the string you sent as `policyNumber`. `identifier[2]` is the scheme revision, `R2` of the 2024 Himachal Pradesh plan, and it is what your cache should be stamped with.

## What the sample shows

`insuranceplan_response.txt` is 21,163,674 bytes, received 3 March 2026 at 12:56, forty-two minutes after the request. It cannot be opened in an editor and it cannot be handled by a naive JSON parser inside a request-response cycle. Stream it, or parse it once on a worker and store the result.

The sample is a state scheme plan and therefore entirely package-based. A private insurer's plan uses the coverage-and-limit shape with benefit types like `ICU` and room rent and `benefit.requirement` strings such as "Pre-authorisation required". There is no sample of that shape in the corpus.

## How the plan is meant to be used

Fetch it once per policy, not once per patient, and cache it. Stamp the cache with `identifier[2].value`, the scheme revision, and record on every preauthorisation and claim which revision it was built against. A rate that changed on the payer's side without a refresh on yours is the commonest cause of a reduced approval. The revision stamp is what turns that into a diagnosable event rather than a mystery.

Refresh when a `Communication` arrives with reason `policychange`, and on whatever periodic schedule your operations team accepts. A 21 MB fetch is not something to do per admission.

From the cache, build the treatment-planning screen. The specialty list is `coverage[].type`. The package list under a specialty is its `benefit[]`, filtered by `GovtReserved` against your facility type. The price shown is the `Procedure` cost line, or the `Stratification` line once a bed category is chosen. The document checklist is the package's `Claim-SupportingInfoRequirement` entries plus the sixteen at plan level. The forms are the `Questionnaire` resources the requirements point at, rendered from the plan rather than hard-coded, because they change when the scheme changes.

Then use the same cache as the first line of validation, on the server and not only in the browser. Codes and displays character for character as the plan has them, including the misspellings. Amounts within the benefit's limit. Quantity within `QuantityAllowed`. Implant and stratification counts within their maxima. Every mandatory document attached before submit is enabled. Nothing on that screen should be typed in by hand if the plan already knows it.
