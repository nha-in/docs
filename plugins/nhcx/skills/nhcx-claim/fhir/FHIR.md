# NHCX FHIR: the bundles a hospital sends and reads

Every bundle here is held to a pin in the NHCX package, under `nhcx-package/fhir/B*`. Read `../references/fhir-knowledge.md` for the why; this file is the how. The pseudo code is language-neutral: a `dict` is a JSON object, a `list` is a JSON array, and `ref(url)` is `{"reference": url}`.

## 1. Conventions every bundle follows

"Validator" below is the HL7 FHIR validator with the NRCeS `ndhm.in` IG, run as `../references/fhir-knowledge.md` section 11 describes.

| Rule | Detail | Refusal if broken |
| --- | --- | --- |
| Bundle | `resourceType Bundle`, `type collection`, `id` fixed per shape, `meta.profile` = the NRCES bundle profile | validator error |
| Entries | Every entry has an absolute `fullUrl` under `https://nhcx.abdm.gov.in/...`; every `reference` resolves to a `fullUrl` in the same bundle | validator error, PAYR-10xx |
| Profiles | Every resource carries `meta.profile` = `https://nrces.in/ndhm/fhir/r4/StructureDefinition/<Type>` | validator warning |
| No timestamps on requests | No `meta.versionId`, `meta.lastUpdated`, bundle `timestamp` (the communication reply is the exception) | none, but the pin differs |
| Money | `{"value": n, "currency": "INR"}`; whole numbers as integers, never `3300.0` | pin differs |
| Instants | IST with `+05:30`, seconds precision | PAYR on dates |
| Identifiers | Typed with a `type.coding` from the NDHM identifier-type system or HL7 v2-0203, `system` where the pin has one | PAYR-1083 and kin |

### Code systems, named once

```
NDHM      = "https://nrces.in/ndhm/fhir/r4/CodeSystem/"
PROFILE   = "https://nrces.in/ndhm/fhir/r4/StructureDefinition/"
BASE      = "https://nhcx.abdm.gov.in"
HL7       = "http://terminology.hl7.org/CodeSystem/"
SNOMED    = "http://snomed.info/sct"
ICD10     = "http://hl7.org/fhir/sid/icd-10"
HPR       = "https://hpr.abdm.gov.in"

ID_TYPE   = NDHM + "ndhm-identifier-type-code"     # PMJAY, ABHA, HPID, HPIN, CLN
V2_0203   = HL7 + "v2-0203"                        # MB, MD, NH, NPI, NIIP
V2_0360   = HL7 + "v2-0360"                        # qualification degrees
ORG_TYPE  = HL7 + "organization-type"              # prov, pay
ACT_CODE  = HL7 + "v3-ActCode"                     # HIP
REL       = HL7 + "subscriber-relationship"        # self
PRIORITY  = HL7 + "processpriority"                # normal
CARE_ROLE = HL7 + "claimcareteamrole"              # primary, assist
DX_TYPE   = HL7 + "ex-diagnosistype"               # admitting
DX_ONADM  = HL7 + "ex-diagnosis-on-admission"      # yes
FIN_TASK  = HL7 + "financialtaskcode"              # poll, cancel, reprocess, release, status
FIN_INPUT = HL7 + "financialtaskinputtype"         # include
COMM_CAT  = HL7 + "communication-category"         # notification

BENEFIT_CAT   = NDHM + "ndhm-benefit-category"        # Claim.item.category (specialty)
PROC_CODE     = NDHM + "ndhm-procedure-code"          # Claim.item.productOrService (package)
PROGRAM       = NDHM + "ndhm-program-code"            # AB-PMJAY
SI_CATEGORY   = NDHM + "ndhm-supportinginfo-category" # INV, ONS, OTH, HDS, DIS, NMI, INF, STG
SI_CODE       = NDHM + "ndhm-supportinginfo-code"     # ADDD, EDT, PSP, DSDE, DTM, DTH, LAMA, DAMA, CQD, ODN
DOC_CODE      = BASE + "/document-code"               # the plan's MANDxxxx codes, else ODN
TASK_INPUT    = NDHM + "ndhm-task-input-type-code"    # policyNumber, providerId, claimNumber, intimationNumber, document
TASK_INPUT_X  = BASE + "/task-input-type"             # amount
TASK_OUTPUT   = NDHM + "ndhm-task-output-type"        # status
TASK_OUTVAL   = NDHM + "ndhm-task-output-value"       # paymentack
TASK_CODES    = NDHM + "ndhm-task-codes"              # deliver
REASON        = NDHM + "ndhm-reason-code"             # treatmentplanchanged, claimrejected, partialpayment, rejectiondisputed
CAT_CODE      = BASE + "/category-code"               # CoverageEligibilityRequest.item.category
PRODUCT_CODE  = BASE + "/product-code"                # CoverageEligibilityRequest.item.productOrService
PROC_TYPE     = BASE + "/procedure-type"              # conservative, medical, surgical
DOC_TYPE_EXT  = settings.document_type_extension_url   # on a Communication attachment; participant-defined (nhcx-package/docs/05-FHIR Reference/17-Communication.md).
                                                       # The communication/response pin carries its author's own url: the pin comparison sets this from the pin.
```

### Shared helpers

```
function cc(system, code, display=null):      # CodeableConcept
    coding = {"code": code}; if system: coding.system = system; if display: coding.display = display
    return {"coding": [coding]}

function typed_id(type_system, type_code, type_display, value, system=null):
    out = {"type": cc(type_system, type_code, type_display), "value": value}
    if system: out.system = system            # put "system" before "value" as the pins do; canonical JSON sorts anyway
    return out

function entry(url, resource): return {"fullUrl": url, "resource": resource}

function profile(name): return {"profile": [PROFILE + name]}

function bundle(id, profile_name, entries):          # profile_name: "ClaimBundle", "TaskBundle", "CoverageEligibilityRequestBundle"
    return {"resourceType": "Bundle", "id": id, "meta": profile(profile_name), "type": "collection", "entry": entries}

function organization(role, identifier_code, identifier_display, id_value, name, res_id=null):
    o = {"resourceType": "Organization", "meta": profile("Organization"),
         "identifier": [typed_id(V2_0203, identifier_code, identifier_display, id_value, BASE)],
         "type": [cc(ORG_TYPE, role, "Healthcare Provider" if role == "prov" else "Payer")], "name": name}
    if res_id: o.id = res_id
    return o

function provider_org(facility, res_id=null):  return organization("prov", "NPI", "National provider identifier", facility.hfr_id, facility.name, res_id)
function payer_org(payer, res_id=null):        return organization("pay", "NIIP", "National Insurance Payor Identifier (Payor)", strip_hcx(payer.participant_code), payer.name, res_id)
function strip_hcx(code): return code.split("@")[0]

function money(v): return {"value": int(v) if v == int(v) else round(v, 2), "currency": "INR"}
```

## 2. Coverage eligibility request

Pins: `coverage/{discovery,validation,benefits,authrequirements}`. Sent on `v1/coverageeligibility/check`, workflow id = the case number. Purposes: `discovery` (who covers this person), `validation` (is the policy in force), `benefits` (balances), `auth-requirements` (rule on the quoted items).

Entries, in order: CoverageEligibilityRequest, Patient, provider Organization, payer Organization, Location, Coverage, PractitionerRole.

```
function build_coverage_request(d):
    # d: purpose, member_id, policy_code (null on discovery), facility{hfr_id,name}, payer{participant_code,name}, created, items[] (benefits, auth-requirements only)
    U = BASE
    cer = {"resourceType": "CoverageEligibilityRequest", "meta": profile("CoverageEligibilityRequest"),
           "identifier": [{"system": BASE}], "status": "active",
           "priority": cc(PRIORITY, "normal", "Normal"), "purpose": [d.purpose],
           "patient": ref(U + "/patient"), "created": d.created,
           "enterer": ref(U + "/practitioner-role"), "provider": ref(U + "/provider"),
           "insurer": ref(U + "/payer"), "facility": ref(U + "/location"),
           "insurance": [{"focal": true, "coverage": ref(U + "/coverage")}]}
    if d.purpose in ("benefits", "auth-requirements"):
        cer.item = [eligibility_item(i) for i in d.items]
    patient = {"resourceType": "Patient", "meta": profile("Patient"),
               "identifier": [typed_id(ID_TYPE, "PMJAY", "Pradhan Mantri Jan Aarogya Yojana (PMJAY) ID", d.member_id),
                              typed_id(V2_0203, "MB", "Member Number", d.member_id)]}     # no name, no demographics
    coverage = {"resourceType": "Coverage", "meta": profile("Coverage"),
                "identifier": [typed_id(V2_0203, "NH", "National Health Plan Identifier", d.policy_code or "NONE")],
                "status": "active", "type": cc(ACT_CODE, "HIP", "health insurance plan policy"),
                "subscriber": ref(U + "/patient"), "subscriberId": d.member_id, "beneficiary": ref(U + "/patient"),
                "relationship": cc(REL, "self"), "payor": [ref(U + "/payer")]}
    location = {"resourceType": "Location", "name": d.facility.name, "managingOrganization": ref(U + "/provider")}
    role = {"resourceType": "PractitionerRole", "meta": profile("PractitionerRole"),
            "code": [cc(SNOMED, "307988006", "Medical technician")]}
    return bundle("coverage-" + d.purpose.replace("-", "") + "-request-generic", "CoverageEligibilityRequestBundle", [
        entry(U + "/coverage-eligibility/request", cer), entry(U + "/patient", patient),
        entry(U + "/provider", provider_org(d.facility)), entry(U + "/payer", payer_org(d.payer)),
        entry(U + "/location", location), entry(U + "/coverage", coverage), entry(U + "/practitioner-role", role)])

function eligibility_item(i):
    # i: category{code,display}, code, display, quantity (integer), tiers[] {code, display}
    out = {"category": cc(CAT_CODE, i.category.code, i.category.display),
           "productOrService": cc(PRODUCT_CODE, i.code, i.display),
           "quantity": {"value": int(i.quantity)}}
    if i.tiers: out.modifier = [cc(null, t.code, t.display) for t in i.tiers]     # no system on a tier
    return out
```

Bundle ids: `coverage-discovery-request-generic`, `coverage-validation-request-generic`, `coverage-benefits-request-generic`, `coverage-authrequirements-request-generic`.

### Reader: CoverageEligibilityResponse

The payer echoes the request's entries and appends its own; take the last of each type.

```
function parse_validation_bundle(b):
    resp = last(b, "CoverageEligibilityResponse"); pat = last(b, "Patient"); cov = last(b, "Coverage")
    out = {"outcome": resp.outcome, "disposition": resp.disposition, "inforce": resp.insurance[0].inforce,
           "auth_required": any(item.authorizationRequired for item in resp.insurance[0].item or []),
           "allowed": null, "used": null}
    for item in resp.insurance[0].item or []:
        for ben in item.benefit or []:
            if ben.allowedMoney and (out.allowed is null or ben.allowedMoney.value > out.allowed):
                out.allowed = ben.allowedMoney.value; out.used = (ben.usedMoney or {}).value or 0
    out.patient = {"name": pat.name[0].text, "gender": pat.gender, "birthDate": pat.birthDate,
                   "abha": first_identifier(pat, "ABHA"), "photo": pat.photo[0].data if pat.photo else null}
    out.coverage = {"class": cov.class[0].name if cov.class else null, "period": cov.period}
    return out
# status: eligible if inforce else not-eligible; balance shown = allowed - used
```

### Reader: the auth-requirements ruling

```
function parse_auth_bundle(b):
    resp = last(b, "CoverageEligibilityResponse"); items = []; requirements = []
    for item in resp.insurance[0].item or []:
        items.append({"code": item.productOrService.coding[0].code, "authorised": item.authorizationRequired,
                      "excluded": item.excluded, "benefit": item.benefit[0] if item.benefit else null})
        for sup in item.authorizationSupporting or []:
            text = sup.text or ""                       # the scheme overloads free text
            r = {"line": item.productOrService.coding[0].code, "code": sup.coding[0].code if sup.coding else null,
                 "display": sup.coding[0].display if sup.coding else text}
            if "fullUrl:" in text: r.kind = "form"; r.url = after("fullUrl:", text).strip(); r.stage = "pre"
            else:                  r.kind = "document"; r.stage = "post" if "Type: post" in text else "pre"
            r.at_preauth = (r.kind == "form") or (r.stage == "pre")
            requirements.append(r)
    return {"items": items, "requirements": requirements}
```

## 3. Insurance plan request

Pin: `insurance`. Sent on `v1/insuranceplan/request`, workflow id = the case number. One entry.

```
function build_plan_request(policy_code, provider_id):
    task = {"resourceType": "Task", "meta": profile("Task"), "status": "requested", "intent": "order",
            "code": cc(FIN_TASK, "poll"),
            "input": [{"type": cc(TASK_INPUT, "policyNumber"), "valueString": policy_code},
                      {"type": cc(TASK_INPUT, "providerId"),   "valueString": provider_id}]}
    return bundle("insurance-request-generic", "TaskBundle", [entry(BASE + "/insurance/request", task)])
# no id, no authoredOn, no requester; at least one input is mandatory
```

### Reader: the plan

```
function parse_plan_bundle(b):
    plan = first(b, "InsurancePlan"); forms = {q.url: q for q in all(b, "Questionnaire")}
    benefits = {}                                            # keyed by package code
    for p in plan.plan or []:                                # shape 1: package-based
        for sc in p.specificCost or []:
            specialty = sc.category.coding[0]
            for ben in sc.benefit or []:
                code = ben.type.coding[0].code; row = benefits.setdefault(code, new_benefit(code, ben.type.coding[0].display, specialty))
                for cost in ben.cost or []:
                    kind = cost.type.coding[0].code          # Procedure | Implant | Stratification
                    if kind == "Procedure": row.rate = cost.value.value; row.kind = "Procedure"
                    else: row.extras.append({"kind": kind, "code": cost.qualifiers[0].coding[0].code, "display": cost.qualifiers[0].coding[0].display, "amount": cost.value.value})
                row.conditions.update(read_conditions(ben.extension)); row.requirements += read_requirements(ben.extension)
    for cov in plan.coverage or []:                          # shape 2: coverage-based
        for ben in cov.benefit or []:
            code = ben.type.coding[0].code; row = benefits.setdefault(code, new_benefit(code, ben.type.coding[0].display, cov.type.coding[0]))
            for lim in ben.limit or []:
                if lim.code.coding[0].code == code: row.rate = lim.value.value
                else: row.extras.append({"kind": "Stratification", "code": lim.code.coding[0].code, "display": lim.code.coding[0].display, "amount": lim.value.value})
            row.conditions.update(read_conditions(ben.extension)); row.requirements += read_requirements(ben.extension)
    policy_requirements = read_requirements(plan.extension)  # policy-wide: identity proof, consent forms
    return {"plan": {"id": plan.id, "name": plan.name}, "benefits": list(benefits.values()),
            "policy_requirements": policy_requirements,
            "forms": [{"url": u, "title": q.title, "kind": "stg" if "/stgquestionnaire/" in u else "policy",
                       "questions": [{"linkId": it.linkId, "text": it.prefix or it.text, "type": it.type,
                                      "options": [o.valueString or o.valueCoding.display for o in it.answerOption or []],
                                      "default": first_selected(it)} for it in q.item]} for u, q in forms.items()]}

function read_conditions(exts):     # extension url family "...Claim-Condition": children named by their url tail
    out = {}
    for e in exts or []:
        if "Claim-Condition" in e.url:
            for child in e.extension or []: out[tail(child.url)] = child.valueString or child.valueBoolean or child.valueCodeableConcept.coding[0].code
    return out

function read_requirements(exts):   # "...Claim-SupportingInfoRequirement": one nested requirement per document
    out = []
    for e in exts or []:
        if "Claim-SupportingInfoRequirement" in e.url:
            for req in e.extension or []:
                r = {}
                for f in req.extension or []:
                    if tail(f.url) == "category": r.category = f.valueCodeableConcept.coding[0].code
                    if tail(f.url) == "code":     r.code = f.valueCodeableConcept.coding[0].code; r.display = f.valueCodeableConcept.coding[0].display
                    if tail(f.url) == "documentationUrl": r.url = f.valueUri or f.valueString
                out.append(r)
    return out
```

## 4. The Claim bundle

Pins: `preauth/request`, `preauth/enhancement`, `preauth/queryupdate`, `claim/request`, `claim/queryupdate`. One builder, three switches: `leg` (`preauth`, `claim`, `predetermination`), `flow` (`request`, `enhancement`, `queryupdate`), `use` (`preauthorization`, `claim`, `predetermination`).

Entries, in order: Claim, Patient, provider Organization (id 1), payer Organization (id 2), Coverage (id 1), Practitioner (one per care team member), Procedure (one per package line), QuestionnaireResponse (one per answered form).

```
function claim_bundle(leg, use, d):
    # d: flow, claim_no, created, admission{admitted_at, discharged_at, surgery_at, death_at, mode, stage},
    #    patient{member_id, abha, name, phone, gender, birthDate}, facility, payer, policy_code,
    #    care_team[] {hpid, licence, hpin, name, qualification_code, qualification_display, specialty_snomed, specialty_display},
    #    diagnoses[] {code, display}, lines[] (procedures and implants, each with tiers[]), documents[] {code, category, content_type, bytes, title},
    #    forms[] {url, answers[] {linkId, type, value}}, program_code (AB-PMJAY or null), factor_rule (pmjay or null),
    #    preauth_ref (claim leg), summary{code, content_type, bytes, title} (claim leg), query_reply (queryupdate)
    U = BASE; anchor = U + "/" + leg + "/" + d.flow
    practitioners = [practitioner_resource(m, n + 1) for n, m in enumerate(d.care_team)]
    procedures    = [procedure_resource(line, n + 1, completed = (leg == "claim"), when = d.admission.surgery_at or d.admission.admitted_at) for n, line in enumerate(package_lines(d.lines))]
    (qrs, form_refs) = questionnaire_responses(d.forms, d.created)
    (si, si_refs)    = supporting_info(d, leg, form_refs)
    claim = {"resourceType": "Claim", "id": d.claim_no, "meta": profile("Claim"),
             "identifier": [typed_id(ID_TYPE, "CLN", "Claim number", d.claim_no, BASE)],
             "status": "active", "type": cc(SNOMED, "737481003", "Inpatient care management (procedure)"), "use": use,
             "patient": ref(U + "/patient"),
             "billablePeriod": {"start": d.admission.admitted_at, "end": d.admission.discharged_at or planned_end(d)},
             "created": d.created, "insurer": ref(U + "/payer"), "provider": ref(U + "/provider"),
             "priority": cc(PRIORITY, "normal", "Normal"),
             "careTeam": [{"sequence": n + 1, "provider": ref(practitioner_url(n)),
                           "role": cc(CARE_ROLE, "primary" if n == 0 else "assist", "Primary provider" if n == 0 else "Assisting Provider"),
                           "qualification": cc(SNOMED, m.specialty_snomed, m.specialty_display)} for n, m in enumerate(d.care_team)],
             "supportingInfo": si,
             "diagnosis": [{"sequence": n + 1, "diagnosisCodeableConcept": cc(ICD10, dx.code, dx.display),
                            "type": [cc(DX_TYPE, "admitting", "Admitting Diagnosis")], "onAdmission": cc(DX_ONADM, "yes", "Yes")} for n, dx in enumerate(d.diagnoses)],
             "procedure": [{"id": "Procedure/" + str(n + 1), "sequence": n + 1,
                            "type": [cc(PROC_TYPE, line.procedure_type.lower(), line.procedure_type)],   # from the plan's ProcedureType condition
                            "date": d.admission.surgery_at or d.admission.admitted_at,
                            "procedureReference": {"reference": U + "/procedure/" + str(n + 1), "display": line.display}} for n, line in enumerate(package_lines(d.lines))],
             "insurance": [{"sequence": 1, "focal": true, "coverage": ref(U + "/coverage")}],
             "item": claim_items(d, si_refs),
             "total": money(sum(item.net.value for item in items))}
    if leg == "claim": claim.insurance[0].preAuthRef = [d.preauth_ref]        # the payer's ClaimResponse.preAuthRef
    entries = [entry(anchor, claim), entry(U + "/patient", patient_resource(d.patient)),
               entry(U + "/provider", provider_org(d.facility, "1")), entry(U + "/payer", payer_org(d.payer, "2")),
               entry(U + "/coverage", coverage_resource(d.policy_code, d.patient.member_id))]
    entries += [entry(practitioner_url(n), p) for n, p in enumerate(practitioners)]
    entries += [entry(U + "/procedure/" + str(n + 1), p) for n, p in enumerate(procedures)]
    entries += [entry(U + "/questionnaireresponse/" + str(n + 1), q) for n, q in enumerate(qrs)]
    return bundle(leg + "-" + d.flow + "-request-generic", "ClaimBundle", entries)
    # preauth-request-generic, preauth-enhancement-request-generic, preauth-queryupdate-request-generic, claim-request-generic, claim-queryupdate-request-generic

function practitioner_url(n): return BASE + "/practitioner" + ("" if n == 0 else "/" + str(n + 1))

function patient_resource(p):
    ids = [typed_id(ID_TYPE, "PMJAY", "Pradhan Mantri Jan Aarogya Yojana (PMJAY) ID", p.member_id)]
    if p.abha: ids.append(typed_id(ID_TYPE, "ABHA", "Ayushman Bharat Health Account (ABHA) ID", p.abha))
    ids.append(typed_id(V2_0203, "MB", "Member Number", p.member_id))
    return {"resourceType": "Patient", "id": "1", "meta": profile("Patient"), "identifier": ids,
            "name": [{"text": p.name}], "telecom": [{"system": "phone", "value": p.phone}], "gender": p.gender, "birthDate": p.birthDate}

function practitioner_resource(m, n):
    ids = [typed_id(ID_TYPE, "HPID", "Healthcare Professional ID (HPID)", m.hpid or m.hpin, BASE)]
    if m.licence: ids.append(typed_id(V2_0203, "MD", "Medical License number", m.licence, BASE))
    ids.append(typed_id(ID_TYPE, "HPIN", "Health Practitioner ID issued by NDHM", m.hpin, HPR))   # PAYR-1083 without it
    return {"resourceType": "Practitioner", "id": str(n), "meta": profile("Practitioner"), "identifier": ids,
            "name": [{"text": m.name}], "qualification": [{"code": cc(V2_0360, m.qualification_code, m.qualification_display)}]}

function coverage_resource(policy_code, member_id):
    return {"resourceType": "Coverage", "id": "1", "meta": profile("Coverage"),
            "identifier": [typed_id(V2_0203, "NH", "National Health Plan Identifier", policy_code)],
            "status": "active", "type": cc(ACT_CODE, "HIP", "health insurance plan policy"),
            "subscriber": ref(BASE + "/patient"), "subscriberId": member_id, "beneficiary": ref(BASE + "/patient"),
            "relationship": cc(REL, "self"), "payor": [ref(BASE + "/payer")]}

function procedure_resource(line, n, completed, when):
    return {"resourceType": "Procedure", "id": str(n), "meta": profile("Procedure"),
            "status": "completed" if completed else "preparation",
            "code": {"coding": [{"system": SNOMED, "code": "71388002", "display": "Procedure"}], "text": line.display},
            "subject": ref(BASE + "/patient"), "performedDateTime": when}
```

### Items: one per procedure or implant, never per tier

```
function package_lines(lines): return [l for l in lines if l.kind in ("procedure", "implant")]     # tiers ride on their parent

function claim_items(d, si_refs):
    groups = package_lines(d.lines); factors = procedure_factors(groups, d.factor_rule)
    items = []
    for n, line in enumerate(groups):
        tiers = [t for t in d.lines if t.kind == "tier" and t.parent_code == line.code]
        net = line.amount + sum(t.amount for t in tiers)
        item = {"id": "Item/" + str(n + 1), "sequence": n + 1, "careTeamSequence": [1], "diagnosisSequence": [1],
                "procedureSequence": [n + 1], "informationSequence": si_refs,             # every supportingInfo sequence
                "category": cc(BENEFIT_CAT, line.category.code, line.category.display),
                "productOrService": cc(PROC_CODE, line.code, line.display)}
        if tiers: item.modifier = [cc(null, t.code, t.display) for t in tiers]
        if d.program_code: item.programCode = [cc(PROGRAM, d.program_code, "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)")]
        item.servicedPeriod = {"start": day(d.admission.admitted_at), "end": day(d.admission.discharged_at or planned_end(d))}
        item.quantity = {"value": int(line.quantity)}
        item.unitPrice = money(net / line.quantity)
        if factors: item.factor = factors[n]
        item.net = money(net)
        items.append(item)
    return items

function procedure_factors(groups, rule):
    # PMJAY multiple-procedure rule: by cost rank, 1, 0.5, 0.25; a generic payer sends no factor
    if rule != "pmjay" or len(groups) < 2: return null      # the single-item pins carry factor 0.5 (their own contradiction); compare without it
    ranked = sorted(range(len(groups)), key = lambda i: -groups[i].amount)
    return {i: [1, 0.5, 0.25][min(rank, 2)] for rank, i in enumerate(ranked)}
```

### supportingInfo: the table, then the numbering

```
function supporting_info(d, leg, form_refs):
    si = []
    for doc in d.documents:                                       # one per attached file; never drop one
        si.append({"category": cc(SI_CATEGORY, doc.category or "INV", display_for(doc.category or "INV")),
                   "code": cc(DOC_CODE, doc.code or "ODN", doc.title),          # the plan's code, else ODN
                   "valueAttachment": {"contentType": doc.content_type, "data": base64(doc.bytes), "title": doc.title}})
    if leg == "claim":
        si.append({"category": cc(SI_CATEGORY, "HDS", "Discharge summary"), "code": cc(DOC_CODE, d.summary.code or "HDS", d.summary.title),
                   "valueAttachment": {"contentType": d.summary.content_type, "data": base64(d.summary.bytes), "title": d.summary.title}})
    si.append(scalar("ONS", "ADDD", "Admission date -Discharge date", d.admission.admitted_at))
    si.append(scalar("OTH", "EDT", "EncounterDateTime", d.admission.admitted_at))
    if leg == "claim":
        if d.admission.surgery_at: si.append(scalar("ONS", "PSP", "Procedure start", d.admission.surgery_at))
        si.append(scalar("ONS", "DSDE", "Discharge date", d.admission.death_at or d.admission.discharged_at))
        if d.admission.mode == "death": si.append(scalar("ONS", "DTM", "Date and time of death", d.admission.death_at))   # PAYR-1096 without it
        code = {"normal": "DTH", "lama": "LAMA", "dama": "DAMA", "death": "DTM"}[d.admission.mode]
        si.append(scalar("DIS", code, display_for(code), stage_words(d.admission.stage)))   # "Before Surgery" | "During Surgery" | "After Surgery"
    if d.flow == "queryupdate":
        si.append(scalar("NMI", "CQD", "Claim query detail", d.query_reply))    # the desk's words; PMJAY reads its answer from here
    for (form, url) in form_refs:                                  # one per answered form
        cat = "STG" if form.kind == "stg" else "INF"; code = "STG" if form.kind == "stg" else "ODN"
        si.append({"category": cc(SI_CATEGORY, cat, display_for(cat)), "code": cc(SI_CODE, code, display_for(code)), "valueReference": ref(url)})
    for n, s in enumerate(si):                                     # number once, after assembly: PAYR-1019 without sequence
        s.id = "SupportingInformation/" + str(n + 1); s.sequence = n + 1
        reorder(s, ["id", "sequence", "category", "code", "value*"])
    return (si, [s.sequence for s in si])

function scalar(cat, code, display, value):
    return {"category": cc(SI_CATEGORY, cat, display_for(cat)), "code": cc(SI_CODE, code, display), "valueString": value}
```

### Questionnaire responses

```
function questionnaire_responses(forms, authored):
    qrs = []; refs = []
    for n, form in enumerate(forms):
        url = BASE + "/questionnaireresponse/" + str(n + 1)
        qr = {"resourceType": "QuestionnaireResponse", "id": str(n + 1), "meta": profile("QuestionnaireResponse"),
              "questionnaire": form.url, "status": "completed", "subject": ref(BASE + "/patient"), "authored": authored,
              "item": [{"linkId": a.linkId, "answer": [typed_answer(a)]} for a in form.answers]}
        qrs.append(qr); refs.append((form, url))
    return (qrs, refs)

function typed_answer(a):
    switch a.type:
        "string", "text", "choice": return {"valueString": a.value}
        "date", "dateTime":          return {"valueDateTime": a.value}
        "boolean":                   return {"valueBoolean": a.value}
        "integer":                   return {"valueInteger": int(a.value)}
        "decimal":                   return {"valueDecimal": a.value}
        "attachment":                return {"valueAttachment": {"contentType": a.content_type, "data": base64(a.bytes), "title": a.title}}
```

### Which forms and documents ride

```
function required_forms(case, stage):                       # stage: preauth | claim
    if case.ruling: forms = [r for r in case.ruling.requirements if r.kind == "form" and (stage == "preauth" or r.stage != "pre")]
    else:           forms = plan_stg_forms(case.plan, case.lines) if stage == "preauth" else []
    return forms + policy_forms(case.plan)                    # consent every leg: PAYR-1256 / PAYR-1363; STG: PAYR-1254 / PAYR-1365

function required_documents(case, stage):
    if case.ruling: return [r for r in case.ruling.requirements if r.kind == "document" and (r.stage == "pre") == (stage == "preauth")]
    wanted = plan_documents(case.plan, case.lines)
    return wanted if stage == "preauth" else [w for w in wanted if not attached_at_preauth(case, w.code)]
```

### The legs, and the LAMA collapse

```
function lines_for(case, leg):
    if leg == "claim" and case.admission.mode in ("lama", "dama") and case.admission.stage in ("before", "during"):
        return [{"kind": "procedure", "code": "LM100", "display": "Left against medical advice", "quantity": 1,
                 "amount": plan_rate(case.plan, "LM100") or 0, "category": lm100_category(case.plan)}]   # PAYR-1362 if the package stays
    return case.lines                                          # LM100 never on a pre-auth: PAYR-1270
```

| Leg | flow | use | Procedure status | Workflow | Extra |
| --- | --- | --- | --- | --- | --- |
| Pre-auth | `request` | `preauthorization` | `preparation` | 12 | fresh 12 after a rejection too (PAYR-1214 on 121) |
| Enhancement | `enhancement` | `preauthorization` | `preparation` | 13 | every line, old and new, same claim number; factors 1 and 0.5 |
| Query answer | `queryupdate` | `preauthorization` | `preparation` | 19 (131 after an enhancement query) | `NMI/CQD`; new correlation id |
| Claim | `request` | `claim` | `completed` | 15 | discharge scalars, `HDS`, `preAuthRef`, under the pre-auth's number (ERR-PYR-CLM-007) |
| Claim query answer | `queryupdate` | `claim` | `completed` | 161 (PMJAY), 151 (generic) | as the claim plus `NMI/CQD` |
| Predetermination | `request` | `predetermination` | `preparation` | 12 on `v1/preauth/submit` | no state effects |

## 5. Reader: ClaimResponse

Fed by every answer on a pre-auth, enhancement, claim or predetermination thread. Entries: ClaimResponse, Patient, two Organizations, Coverage.

```
function parse_claim_response(b):
    r = first(b, "ClaimResponse")
    status_adj = first(a for a in r.adjudication or [] if a.category.coding[0].code == "status")
    out = {"use": r.use, "outcome": r.outcome, "disposition": r.disposition,
           "status_reason": status_adj.reason.coding[0].code.lower() if status_adj else null,   # submitted|approved|queried|rejected|cancelled
           "preauth_ref": r.preAuthRef if is_string(r.preAuthRef) else (r.preAuthRef[0] if r.preAuthRef else null),
           "claim_no": r.identifier[0].value if r.identifier else null,
           "totals": {t.category.coding[0].code: t.amount.value for t in r.total or []},            # by category, never by position
           "items": [], "notes": [n.text for n in r.processNote or []]}
    for it in r.item or []:
        adj = {a.category.coding[0].code: a for a in it.adjudication or []}
        out.items.append({"sequence": it.itemSequence,
                          "status": adj.status.reason.coding[0].code.lower() if adj.status else null,
                          "eligible": adj.eligible.amount.value if adj.eligible else null,
                          "submitted": adj.submitted.amount.value if adj.submitted else null,
                          "reason": adj.reason.reason.coding[0].display if adj.reason else "",            # verbatim, pipe-delimited USER~datetime~type~comment~trust
                          "eligpercent": adj.eligpercent.value if adj.eligpercent else null,
                          "deductible": adj.deductible.amount.value if adj.deductible else null})
    return out

function verdict_status(p):                              # copy exactly; never read outcome alone
    if p.outcome == "queued" or p.status_reason == "submitted": return "submitting"
    if p.status_reason == "cancelled": return "rejected"
    if p.status_reason == "queried":   return "queried"
    if p.outcome == "error":           return "rejected"
    if p.outcome == "partial":         return "partial" if p.status_reason == "approved" else "queried"
    if p.outcome == "complete":        return "approved" if p.status_reason in ("approved", null) else "queried"
    return "queried"

function apply_claim_response(leg, p, envelope):
    leg.status = verdict_status(p)
    if p.preauth_ref: leg.preauth_ref = p.preauth_ref             # never overwrite a value with an empty one
    leg.eligible_amount = p.totals.get("eligible") or p.totals.get("benefit")
    leg.submitted_amount = p.totals.get("submitted")
    leg.approved_amount = p.totals.get("benefit")                  # what the screen shows as the decision
    leg.items_json = p.items; leg.query_note = join(p.notes + [i.reason for i in p.items if i.reason])
    leg.thread_correlation_id = envelope.jwe_headers["x-hcx-correlation_id"]
    leg.answered_at = now() if leg.status != "submitting" else leg.answered_at
```

Payer workflow ids are labels for the timeline only: 20 received, 21 approved, 22 enhancement approved, 23 rejected, 24 queried, 25 claim received, 26 approved, 27 queried, 291 rejected. The bundle decides the state.

## 6. Task bundles the hospital sends

Pins: `preauth/cancel`, `claim/reprocess`, `claim/release`, `payment/notice-ack`. Sent on `v1/task/submit` (the payment acknowledgement on `v1/paymentnotice/on_request`). Entries: Task, provider Organization, payer Organization.

```
function task_bundle(id, anchor, task, facility, payer):
    return bundle(id, "TaskBundle", [entry(BASE + anchor, task), entry(BASE + "/provider", provider_org(facility)), entry(BASE + "/payer", payer_org(payer))])

function base_task(code, status, authored_on, description):
    return {"resourceType": "Task", "meta": profile("Task"), "status": status, "intent": "order",
            "code": cc(FIN_TASK, code), "description": description, "authoredOn": authored_on,
            "requester": ref(BASE + "/provider"), "owner": ref(BASE + "/payer")}

function task_input(code, display, value):  return {"type": cc(TASK_INPUT, code, display), "valueString": value}
function based_on(claim_no):                return [{"identifier": typed_id(ID_TYPE, "CLN", "Claim number", claim_no, BASE), "display": "Claim " + claim_no}]

function cancel_task(claim_no, reason, authored_on, facility, payer):        # workflow PC01
    t = base_task("cancel", "requested", authored_on, "Cancel the preauthorization " + claim_no)
    t.reasonCode = cc(REASON, reason.code, reason.display)                   # treatmentplanchanged, ...
    t.input = [task_input("claimNumber", "ClaimNumber", claim_no), task_input("intimationNumber", "IntimationNumber", claim_no)]
    return task_bundle("preauth-cancel-request-generic", "/preauth/cancel", t, facility, payer)

function reprocess_task(claim_no, member_id, reason, description, documents, authored_on, facility, payer):   # workflow 36
    t = base_task("reprocess", "requested", authored_on, description)
    t.reasonCode = cc(REASON, reason.code, reason.display)                   # claimrejected | partialpayment | rejectiondisputed
    t.basedOn = based_on(claim_no)
    t.input = [task_input("claimNumber", "ClaimNumber", claim_no), task_input("intimationNumber", "IntimationNumber", claim_no)]
    t.input += [{"type": cc(TASK_INPUT, "document", "Document"), "valueAttachment": {"contentType": d.content_type, "data": base64(d.bytes), "title": d.title}} for d in documents]
    t.for = {"identifier": typed_id(ID_TYPE, "PMJAY", "Pradhan Mantri Jan Aarogya Yojana (PMJAY) ID", member_id)}   # MB on a generic payer
    return task_bundle("claim-reprocess-request-generic", "/claim/reprocess", t, facility, payer)

function release_task(claim_no, amount, authored_on, facility, payer):       # workflow 36
    t = base_task("release", "requested", authored_on, "Release the balance amount for claim " + claim_no)
    t.reasonCode = cc(REASON, "partialpayment", "Reprocess request due to partial payment by payer")
    t.basedOn = based_on(claim_no)
    t.input = [task_input("claimNumber", "ClaimNumber", claim_no), {"type": cc(TASK_INPUT_X, "amount", "Amount"), "valueMoney": money(amount)}]
    return task_bundle("claim-release-request-generic", "/claim/release", t, facility, payer)

function status_task(claim_no, authored_on, facility, payer):                # workflow = the leg's correlation id; PMJAY refuses (PAYR-1018)
    t = base_task("status", "requested", authored_on, "Status of " + claim_no)
    t.input = [task_input("claimNumber", "ClaimNumber", claim_no)]
    return task_bundle("claim-status-request-generic", "/claim/status", t, facility, payer)

function payment_ack(claim_no, authored_on, facility, payer):                # workflow 17 (PMJAY) or the notice's own id; x-hcx-correlation_id = the notice's
    t = base_task("status", "completed", authored_on, "Received the payment for claim " + claim_no)
    t.output = [{"type": cc(TASK_OUTPUT, "status", "Status"), "valueCodeableConcept": cc(TASK_OUTVAL, "paymentack", "Payment is acknowledged")},
                {"type": cc(TASK_INPUT, "claimNumber", "ClaimNumber"), "valueString": claim_no}]
    return task_bundle("payment-notice-ack-generic", "/payment/notice-ack", t, facility, payer)
```

The pins and the build both carry `intimationNumber`, so the offline comparison diffs the pins unchanged.

### Readers: PC02, 37, status

```
function parse_task_answer(b):
    t = first(b, "Task"); cr = first(b, "ClaimResponse")           # a 37 may carry a ClaimResponse queued
    outputs = {o.type.coding[0].code: o for o in t.output or []}
    return {"status": t.status, "code": t.code.coding[0].code,
            "claim_status": (outputs.get("claimStatus") or outputs.get("status") or {}).valueCodeableConcept.coding[0].code if outputs else null,
            "description": t.description, "queued": cr is not null and cr.outcome == "queued"}
# PC02: pre-auth -> cancelled, episode gets a fresh claim number, the withdrawn one stays on the leg
# 37: enquiry row -> answered; a fresh verdict follows on the claim's own thread
```

## 7. Communication

Pins: `communication/request` (the payer's TaskBundle, the reader's input) and `communication/response` (the hospital's reply). On `v1/communication/request` in, `v1/communication/on_request` out, with the request's correlation id and workflow id echoed.

```
function parse_communication_request(b):
    t = first(b, "Task"); cr = first(b, "CommunicationRequest")
    return {"task_status": t.status, "intent": t.intent, "reason": t.reasonCode.coding[0].code.lower() if t.reasonCode else null,
            "request_id": cr.id, "request_url": fullurl_of(b, cr),
            "questions": [p.contentString for p in cr.payload or [] if p.contentString],
            "about_claim": (cr.basedOn or [{}])[0].display, "claim_no": claim_no_in(b)}

function classify_communication(adapter, reason, intent):
    if adapter.query_mode == "resubmit": return "notification"
    if intent == "proposal": return "notification"
    if intent == "order":    return "query"
    if reason in (null, "additionalinfo", "questionnaire", "query"): return "query"
    return "notification"                                          # tatquery, grievance, walletupdate, policychange, claimarbitration

function build_acknowledgement_bundle(request_bundle, facility):    # a notification, sent back at once
    b = deepcopy(request_bundle); t = first(b, "Task"); t.status = "completed"
    move_first(b, "Organization", where = provider)                # provider Organization first
    return b

function build_communication_bundle(q, text, documents, sent_leg_bundle, facility, payer, now):
    # q: the parsed request; sent_leg_bundle: the pre-auth or claim bundle as sent (its Claim, Patient, Organizations, Practitioner, Coverage are lifted)
    task_id = uuid(); comm_id = uuid()
    comm = {"resourceType": "Communication", "id": comm_id, "meta": profile("Communication"),
            "identifier": [{"value": q.request_identifier}], "basedOn": [{"reference": q.request_url, "display": "CommunicationRequest"}],   # never inResponseTo
            "status": "completed", "category": [cc(COMM_CAT, "notification")], "priority": "routine",
            "about": [{"reference": claim_anchor(sent_leg_bundle), "display": "Claim " + claim_no}],
            "sender": {"reference": BASE + "/provider", "display": "Organization"}, "recipient": [{"reference": BASE + "/payer", "display": "Organization"}],
            "payload": [{"contentString": text}] + [{"contentAttachment": {"contentType": d.content_type, "data": base64(d.bytes), "title": d.title},
                                                     "extension": [{"url": DOC_TYPE_EXT, "valueString": d.code}]} for d in documents]}
    task = {"resourceType": "Task", "id": task_id, "meta": profile("Task"), "status": "completed", "intent": "order",
            "code": cc(TASK_CODES, "deliver"), "reasonCode": cc(null, q.reason or "additionalinfo", "Additional information requested"),
            "authoredOn": now, "requester": {"reference": BASE + "/provider", "display": "Organization"}, "owner": {"reference": BASE + "/payer", "display": "Organization"},
            "input": [{"type": cc(FIN_INPUT, "include"), "valueReference": {"reference": "urn:uuid:" + comm_id, "display": "Communication"}}]}
    entries = [entry("urn:uuid:" + task_id, task), entry("urn:uuid:" + comm_id, comm), entry(q.request_url, q.request_resource)]
    entries += [entry(e.fullUrl, e.resource) for e in sent_leg_bundle.entry if e.resource.resourceType in ("Claim", "Patient", "Organization", "Practitioner", "Coverage")]
    b = bundle("communication-response-generic", "TaskBundle", entries)
    b.meta.lastUpdated = now; b.timestamp = now                   # the IG example carries both; the only request that does
    return b
```

Excluded from the byte comparison of the reply: `meta.lastUpdated`, `timestamp`, `authoredOn`, the two generated uuids.

## 8. Payment notice

Read on `v1/paymentnotice/request`. Entries: Task, PaymentNotice, PaymentReconciliation, two Organizations.

```
function parse_payment_notice(b):
    pn = first(b, "PaymentNotice"); pr = first(b, "PaymentReconciliation"); t = first(b, "Task")
    out = {"claim_no": pn.identifier[0].value if pn.identifier else claim_no_in(b),
           "amount": pn.amount.value, "payment_status": pn.paymentStatus.coding[0].code,    # paid | cleared | ...
           "payment_date": pn.paymentDate, "utr": null, "details": []}
    if pr:
        out.utr = pr.paymentIdentifier.value if pr.paymentIdentifier else null
        out.gross = pr.paymentAmount.value if pr.paymentAmount else null
        out.details = [{"type": d.type.coding[0].code, "amount": d.amount.value if d.amount else null} for d in pr.detail or []]   # deductions, TDS
    if not out.utr and pn.payment and pn.payment.identifier: out.utr = pn.payment.identifier.value
    return out
# record: one claim_payment row keyed on the message's correlation id (unique), matched by claim_no; then acknowledge with payment_ack()
```

## 9. Validate before you send

```
function validate_bundle(b, pin):                          # the offline gate, module 7.7 Validate
    assert canonical(strip(b, ["created"])) == canonical(strip(pin, ["created"]))       # plus the per-shape exclusions above
    urls = {e.fullUrl for e in b.entry}
    for r in all_references(b): assert r in urls or r.startswith("urn:uuid:")
    c = first(b, "Claim")
    if c:
        for it in c.item:          assert it.id and it.sequence
        for p in c.procedure:      assert p.id and p.sequence
        for n, s in enumerate(c.supportingInfo): assert s.id and s.sequence == n + 1
        for pr in all(b, "Practitioner"): assert any(i.type.coding[0].code == "HPIN" and i.system == HPR for i in pr.identifier)
        assert c.total.value == sum(it.net.value for it in c.item)
        assert not any(it.productOrService.coding[0].code == "LM100" for it in c.item) or c.use == "claim"
    assert no literal in the builder matches r"MAND\d+|MG\d+|/questionnaire/"
```

| Symptom | Refusal |
| --- | --- |
| an item without `id` | PAYR-1027 |
| a supportingInfo without `sequence` | PAYR-1019 |
| a Practitioner without `HPIN` | PAYR-1083 |
| a death claim without `ONS/DTM` | PAYR-1096, PAYR-1503 |
| a LAMA claim before surgery still carrying the package | PAYR-1362 |
| `LM100` on a pre-auth | PAYR-1270 |
| the consent form unanswered | PAYR-1256 (pre-auth), PAYR-1363 (claim) |
| a package's STG form unanswered | PAYR-1254, PAYR-1365 |
| a claim under its own number | ERR-PYR-CLM-007 |
| 121 after a rejection | PAYR-1214 |
| 151, 19 or 16 on `v1/claim/submit` to PMJAY | PAYR-1321 |
| a document outside pdf, jpg, jpeg, png; a Task the sandbox does not take; a misspelt intimation input on a reprocess | PAYR-1008 |
