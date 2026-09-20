# Testing knowledge

Sources: the NHCX package, fetched by `scripts/fetch-package.sh` into `nhcx-package/` beside `nhcx-build/`. That means the pins and payer fixtures under `nhcx-package/fhir` (catalogued in `nhcx-package/fhir/index.yaml`), the use-case catalogue `nhcx-package/usecases.yaml`, and the chapters named below. Also what live runs on the NHCX sandbox taught.

## 1. The pyramid

| Rung | What it proves | Needs | How |
| --- | --- | --- | --- |
| 1. Offline | Every builder equals its pin (`created` excepted); every reader settles the right state from a payer fixture; the state machine refuses what it should | nothing running; a throwaway database; the transport's send stubbed; `nhcx-package/` | one suite in one process (sections 2 to 4) |
| 2. Validator | Every built bundle validates against the NRCeS profiles with no error you cannot explain | Java, the HL7 FHIR validator, the bundles your tests wrote | section 5 |
| 3. A generic payer on the sandbox | Every leg over the real exchange with a payer whose desk you can drive; queries as CommunicationRequests; payment released | the transport on the sandbox (your app's own, or nhcx-adapter when the user chose it), a generic payer you can drive, the sandbox reaching your callback | section 6 |
| 4. Live PMJAY sandbox | `1518@hcx`: the scheme's own refusals and rules, decisions taken on the payer service desk | the sandbox, a real beneficiary, patience | section 6 |

Climb in order. Rungs 1 and 2 need no service and no consent. Rungs 3 and 4 put traffic on the live NHCX sandbox, and only the user starts them.

## 2. Writing rung 1 for a new HMIS

Build one suite with this shape, whatever the language:

- One process, one seeded database under a temporary path, sections in the order the episode runs. `section(name)` starts a group; `check(label, condition, detail)` records one assertion and never raises. The run exits non-zero at the end if anything failed.
- The transport's `send` is one function, and the test replaces it. Every send goes through it; the test assigns a stub that records the path, recipient, workflow id, correlation id and bundle, and returns `{"txn_id": ..., "correlation_id": ..., "api_call_id": ...}`. Restore the real one in `finally`. The receiving end is tested apart from the door: for your own transport, seal a payer bundle with a test key pair, POST it, and check the 202 receipt and the envelope the door receives.
- Call the callback handler directly with an envelope, not over HTTP: `receive({"jwe_headers": {...}, "fhir": bundle}, "<type>", "<flow>", "fhir")`. The return value is one of `settled`, `unmatched`, `ignored`. Feed it the payer bundles under `nhcx-package/fhir/C3` to `nhcx-package/fhir/C11`, both the generic files and the `-pmjay` ones. The auth-requirements rulings are `C3/C3-response-generic.json` (one line, 10 supporting entries) and `C3/C3-response-pmjay.json` (two lines, 22 entries).
- The pin comparison builds each bundle from the pin's own data and compares canonical JSON (`json.dumps(bundle, sort_keys=True)`) against the pin. The data is all in `nhcx-package/fhir/B3/preauth-request.json`: member `MD5SLS4X5`, policy `PMJAY/HP/S/G`, provider `IN1910000151`, payer `1518@hcx`, package `MG0111A` with tier `STRAT006b`, the four `MAND` documents. Drop from both sides only `created`. The bundle id and every entry's `fullUrl` are fixed strings in the pins (`preauth-request-generic`, `https://nhcx.abdm.gov.in/preauth/request`), and the build produces them as they are.
- The single-item pins carry `factor 0.5`. That contradicts the rule their own enhancement follows (`nhcx-package/fhir/B3/preauth-enhancement.json`: the costlier line 1, the next 0.5), so compare those with `factor` removed. Compare the cancel and reprocess pins as they are; they carry `intimationNumber`, the spelling the build sends.
- Read every expected value in a reader check from the fixture you feed: `preAuthRef`, amounts, claim numbers, the UTR. The PMJAY captures have the beneficiary's identifiers replaced, and some fields are absent (`C5/C5-received-wf20-pmjay.json` carries no `preAuthRef`). A typed literal tests your memory, not the reader.
- Negative checks are half the value. A code the plan does not carry is refused. A send while the leg is with the payer is refused. A redelivered api call id is ignored. A claim refused at the door goes back to `queried` with the question restored. A cancel while the payer holds the case is accepted, and a cancel of a rejected one is refused.
- Put the regression sections near the bottom. Each is a defect that reached working code, named after what went wrong. Add one each time the sandbox teaches you something.

In a language whose JSON encoder does not sort keys, decode into a map and encode again before comparing, so key order cannot fail a check. Where a byte comparison is too strict, as with the wire captures, compare element by element.

## 3. The test-case matrix

One row per hospital-side use case. Preconditions are the state the HMIS must be in. The action is what the desk or the test does. The expected wire is what must go out and come back; the per-case archive shows it (and the adapter's ledger, when it is the transport). The expected state is what the HMIS must hold afterwards. Codes are those of `nhcx-package/usecases.yaml`. Workflow ids are the PMJAY table unless the row says generic.

| Use case | Preconditions | Action | Expected wire | Expected state |
| --- | --- | --- | --- | --- |
| A5 Get status (generic) | A pre-auth or claim leg with the payer; a generic payer | Ask status for the leg | `v1/task/submit`, Task `status` with `claimNumber`, workflow = the leg's correlation id; a Task back with `claimStatus` | An enquiry row `answered` with the status word; the leg unchanged |
| A5 Get status (PMJAY) | as above; PMJAY | Ask status | the same Task; a ProtocolResponse PAYR-1018 (no reason) or PAYR-1008 (with one) | The enquiry row `error` with the payer's words; nothing else changes |
| B1 Check coverage eligibility | A patient with a member id and policy from the policy search; facility HFR id and participant code set | Validate, then discover | `v1/coverageeligibility/check` twice, new correlation each, workflow = the case number; `on_check` with the request echoed and a `CoverageEligibilityResponse` | `claim.status eligible`, `inforce 1`, allowed and used amounts, the payer's Patient demographics |
| B2 Request insurance plan | Eligible; no master held for this facility and policy | Fetch the plan | `v1/insuranceplan/request`, a Task `poll` with `policyNumber` and `providerId`; `on_request` with the InsurancePlan and Questionnaires | `claim_plan.status ready`, benefits with rates, tiers, requirements, forms by url; a second episode on the same policy copies it without a send |
| B3 Submit pre-authorisation | Plan ready; lines quoted from it; dossier saved; admission linked; documents and forms for the pre-auth stage attached | Submit | `v1/coverageeligibility/check` purpose `auth-requirements` first (sent, not awaited), then `v1/preauth/submit` workflow 12 equal to the pin but for identifiers; `on_submit` 20 (`queued`, `response.partial`) then 21 | `claim_preauth.status submitting` after the 20 with `preauth_ref` kept, `approved` after the 21 with `approved_amount`; stage `preauth`, sub-stage `approved` |
| B3 Auth-requirements ruling | The check sent with the pre-auth; the payer answers it | Nothing; read on arrival | inbound `on_check`, a CoverageEligibilityResponse with purpose `auth-requirements`, one `insurance[0].item` per quoted line with `authorizationRequired`, `excluded` and `authorizationSupporting[]` (`C3/C3-response-generic.json`, `C3/C3-response-pmjay.json`) | each quoted line holds its ruling and what is due at pre-auth (a form always, a document only when its `Type` is `pre`); the pre-auth leg unchanged |
| B3 Enhancement | Approved; a line added since (`enhancement_lines` non-empty) | Submit again | `v1/preauth/submit` workflow 13, every line old and new, factors 1 and 0.5; 20 then 22 (generic); the SHA has answered 21 or 22 | `submission_kind enhancement`, `enhancement_no 1`, `preauth_ref` kept, then `approved`; stage `enhancement` |
| B4 Respond to a communication (generic) | A pre-auth or claim with the payer; the payer sends a CommunicationRequest on a new thread | The desk replies with text and a document | inbound `v1/communication/request` with Task `poll`, reason `additionalinfo`; outbound `v1/communication/on_request` with the request's correlation id and workflow id, a TaskBundle: Task `deliver`, Communication `basedOn` the request, the request echoed, the case entries | `claim_query` row `kind query`, `status open` then `answered` with `reply_json`; the leg row untouched; sub-stage `queried` while open |
| B4 Notification | Any leg; the payer sends a CommunicationRequest with intent `proposal` or reason `tatquery` | Nothing; it is acknowledged on arrival | outbound `v1/communication/on_request` at once, the payer's bundle with `Task.status completed`, provider Organization first | `claim_query` row `kind notification`, `status acknowledged`; the case's stage unchanged |
| B5 Submit claim | Approved pre-auth; discharge recorded with mode and stage; claim-stage documents and forms attached | Submit the claim | `v1/claim/submit` workflow 15, `use claim`, `preAuthRef`, the discharge scalars, the summary; 25 (`queued`) then 26 | `claim_submission.status submitting` then `approved` with amounts and item verdicts; stage `claim` |
| B7 Acknowledge payment notice (generic) | An approved claim; the payer's desk releases payment | Nothing; acknowledged on arrival | inbound `v1/paymentnotice/request` workflow 30 on a new thread; outbound `v1/paymentnotice/on_request` with the notice's correlation id and its own workflow id echoed, Task `status completed` with `paymentack` | `claim_payment` row with amount, UTR, `ack_status sent`; stage `payment`, sub-stage `paid`; a redelivery of the notice is `ignored` |
| B8 Cancel | A pre-auth `submitting`, `approved`, `partial` or `queried` | Cancel with a reason | `v1/task/submit` workflow PC01, Task `cancel`, inputs `claimNumber` and `intimationNumber`; `task/on_submit` PC02 with a ClaimResponse adjudicated `cancelled` | `claim_preauth.status cancelling` then `cancelled`; the episode gets a fresh claim number, the old one stays on `claim_ref`; a cancel of a `rejected` pre-auth is refused before sending |
| B8 Reprocess (generic) | A claim `rejected` or `partial` | Reprocess with reason `claimrejected` and a document | `v1/task/submit` workflow 36, Task `reprocess`, `intimationNumber`, `basedOn` CLN, `document` inputs, `for` the member; 37 (Task `accepted`, ClaimResponse `queued`); then 26 on the claim's thread | The enquiry row `answered` with `reopened`; `claim_submission` back to `submitting`, then `approved` |
| B9 Submit predetermination | Eligible; dossier saved | Ask for a quote | `v1/preauth/submit` workflow 12 with `use predetermination`; a ClaimResponse back | A `claim_predetermination` row `answered` with `allowed_amount`; the pre-auth row untouched |
| D1 Fetch the insurance plan | Eligible on PMJAY | Fetch | as B2; the answer on workflow 5, both `specificCost[]` and `coverage[]`, nested document requirements, `/questionnaire/` and `/stgquestionnaire/` forms | as B2, with `ProcedureType` conditions and the consent forms among the policy documents |
| D2 Authenticate the beneficiary | A policy from the BIS | Not NHCX; take the consent questionnaire path | none | The consent form answered for the pre-auth stage |
| D3 Check coverage eligibility | as B1 with member `MD5SLS4X5` style ids | Validate | as B1; the answer on workflow 5 with the wallet | as B1 |
| D4 Submit pre-authorisation | as B3, plus: HPIN on the doctor, `Item/n` ids, consent and STG forms answered, documents under the plan's `MAND` codes | Submit | `v1/preauth/submit` workflow 12; 20 with the path-form `preAuthRef` or none (flow-knowledge.md section 3), then 21 with the bare number | as B3; `preauth_ref` = the bare case number after the 21 |
| D5 Resubmit pre-authorisation | A pre-auth `rejected` | Submit again | a fresh 12, never 121 | a new `submitting` round; 121 would be PAYR-1214 |
| D6 Raise an enhancement | Approved; a medical package added (not conservative) | Submit | workflow 13; 20 without `preAuthRef` (keep the parent's); 241 arrives as a ClaimResponse `partial` on the case thread; the desk answers on 131 with a `CQD` reply; then approved | `enhancement_no 1`; `queried` then `answered` then `approved`; a second conservative package would be PAYR-1245 |
| D7 Answer a pre-authorisation query | The 24 arrived as a ClaimResponse `partial`, item status `Queried` | The desk writes a reply and submits again | `v1/preauth/submit` workflow 19, flow `queryupdate`, `NMI`/`CQD` carrying the words, a new correlation id; 20 then 21 | `submission_kind preauth_query_response`, `query_note` holding the payer's question, then `approved`; an empty reply is refused before sending |
| D8 Cancel pre-authorisation | as B8 on PMJAY | Cancel | as B8 | as B8 |
| D9 Submit claim | as B5, plus: the claim under the pre-auth's claim number, the package alone at the whole amount, Discharge Consent answered, PDF documents | Submit | `v1/claim/submit` workflow 15; 25 with `preAuthRef` as a path; then 26 | as B5; item verdicts with `eligible`, `status Approved` |
| D9 LAMA or DAMA before or during surgery | Discharge mode `lama` or `dama`, stage `Before Surgery` or `During Surgery` | Submit the claim | one item `LM100`, no tier, `DIS` = `LAMA` or `DAMA` with the stage | approved; the package would be PAYR-1362 |
| D9 Death | Discharge mode `death` with a date and time | Submit the claim | `ONS`/`DTM` and `DSDE` with the death instant, `DIS`/`DTM`, the death forms | approved; without `DTM` PAYR-1096 |
| D10 Answer a claim query | The 27 arrived as a ClaimResponse `partial` | The desk writes a reply and submits again | `v1/claim/submit` workflow 161, `NMI`/`CQD`, a new correlation id; 25 then 26 | `submission_kind claim_query_response`, then `approved`, possibly at zero |
| D11 Reprocess a rejected claim | A claim `rejected` | Reprocess | as B8 reprocess; on the sandbox a ProtocolResponse PAYR-1008 | the enquiry row `error` with the refusal; on a generic payer as B8 |
| D12 Claim a shortfall | A settled payment short of the approved amount | Release with `partialpayment` and the amount | `v1/task/submit` workflow 36, Task `release`, `valueMoney` | an enquiry row; out of reach on the sandbox |
| D13 Acknowledge the payment notice | An approved claim; the SHA's finance side sends 30 | Nothing; acknowledged on arrival | outbound `v1/paymentnotice/on_request` with workflow 17, the notice's correlation id, to the notice's sender | as B7 |

Cross-cutting rows every matrix needs:

| Case | Action | Expected |
| --- | --- | --- |
| Redelivery | Deliver the same envelope twice | the second returns `ignored`; state unchanged |
| Unmatched | Deliver an answer on an unknown correlation id | `unmatched`; archived under `unmatched`; nothing changes |
| Refusal at the door | Deliver a ProtocolResponse on a leg's thread | the leg `error` (or `queried` restored for a query answer, `approved` restored for an enhancement) with the payer's words; `correlation_id` restored to `thread_correlation_id` |
| Ledger reset (nhcx-adapter only) | The adapter answers 404 on `txn/related` | the leg `error` with "send again"; no spinning |
| Stage after every write | Any of the above | `stage` and `sub_stage` on the episode agree with `case_stage` recomputed from the legs |

## 4. A skeleton offline test

Replace the placeholders marked `<YOUR_...>` with your HMIS's own. Every pin and payer answer is loaded from the package.

```python
#!/usr/bin/env python3
"""Offline NHCX checks for <YOUR_HMIS_NAME>: builders against the package pins, readers against the payer fixtures.

    NHCX_PACKAGE=nhcx-package python3 nhcx_offline_test.py   # exit 0 when every check passes
"""
from __future__ import annotations

import copy
import json
import os
import tempfile

PKG = os.environ.get("NHCX_PACKAGE", "nhcx-package")
GENERIC_PAYER = "<YOUR_GENERIC_PAYER_CODE>"

os.environ["<YOUR_HMIS_DB_ENV_VAR>"] = os.path.join(tempfile.mkdtemp(prefix="nhcx-test-"), "t.db")

import <YOUR_HMIS_NHCX_MODULE> as nhcx  # noqa: E402  the module that owns transport, build_*, receive

failures = 0
current = "general"
tally: dict[str, list[int]] = {}


def section(name: str) -> None:
    global current
    current = name
    tally.setdefault(name, [0, 0])
    print(f"\n-- {name} " + "-" * max(3, 60 - len(name)))


def check(label: str, condition: bool, detail: str = "") -> None:
    global failures
    tally.setdefault(current, [0, 0])
    tally[current][0 if condition else 1] += 1
    if not condition:
        failures += 1
    print(f"[{'  ok  ' if condition else ' FAIL '}] {label}" + (f" ({detail})" if detail else ""))


def pin(rel: str) -> dict:
    """A bundle from the package by its path under fhir/, e.g. pin("B3/preauth-request.json")."""
    with open(os.path.join(PKG, "fhir", rel), encoding="utf-8") as fh:
        return json.load(fh)


def resource(bundle: dict, kind: str) -> dict:
    return next(e["resource"] for e in bundle["entry"] if e["resource"]["resourceType"] == kind)


def task_input(task: dict, code: str):
    return next(i.get("valueString") for i in task.get("input", []) if i["type"]["coding"][0]["code"] == code)


def total(claim_response: dict, category: str):
    return next((t["amount"].get("value") for t in claim_response.get("total", [])
                 if t["category"]["coding"][0]["code"] == category), None)


def normalised(bundle: dict, factor: bool = True) -> dict:
    """Drop only `created`, which a builder stamps when it sends; with factor=False, the Claim items' factor too."""
    out = copy.deepcopy(bundle)

    def walk(node):
        if isinstance(node, dict):
            node.pop("created", None)
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    walk(out)
    if not factor:
        for entry in out["entry"]:
            if entry["resource"]["resourceType"] == "Claim":
                for item in entry["resource"].get("item", []):
                    item.pop("factor", None)
    return out


def canonical(bundle: dict, factor: bool = True) -> str:
    return json.dumps(normalised(bundle, factor), sort_keys=True, ensure_ascii=False)


def same(label: str, ours: dict, want: dict, factor: bool = True) -> None:
    a, b = canonical(ours, factor), canonical(want, factor)
    check(label, a == b, "" if a == b else a[:300])


# The package pins' own data: nhcx-package/fhir/B3/preauth-request.json and B1/*.json.
# Every builder is fed this and must produce the pin.
REF = {
    "claim_no": "VB26AA2600001", "member_id": "MD5SLS4X5", "policy": "PMJAY/HP/S/G",
    "provider": {"id": "IN1910000151", "name": "Facility Name"},
    "payer": {"code": "1518@hcx", "id": "1518", "name": "Insurance Company"},
    "patient": {"name": "Patient Name", "gender": "male", "dob": "2004-09-18",
                "phone": "9999999999", "abha": "91718280654077", "member_id": "MD5SLS4X5"},
    "practitioner": {"name": "Practitioner Name", "hpr_id": "982374978-2343", "license_no": "MCI-12345",
                     "qualification": "Doctor of Medicine", "qualification_code": "MD",
                     "specialty": "General medicine", "specialty_code": "394802001"},
    "diagnosis": {"code": "A97", "display": "Dengue"},
    "item": {"code": "MG0111A", "display": "Pleural Effusion", "category_code": "MG",
             "category_display": "General Medicine", "quantity": 1, "unit_price": 3300, "net": 3300,
             "kind": "Procedure", "procedure_type": "conservative"},
    "tier": {"code": "STRAT006b", "display": "HDU", "kind": "Stratification", "parent_code": "MG0111A"},
    # The benefits and auth-requirements pins quote a different package.
    "coverage_item": {"code": "MG004C", "display": "Dengue shock syndrome (Dengue fever)",
                      "category_code": "MG", "category_display": "General Medicine", "quantity": 1,
                      "tier": {"code": "STRAT006c", "display": "ICU - Without Ventilator"}},
}


def main() -> int:
    section("coverage eligibility: ours is the pin")
    for purpose, rel in (("discovery", "B1/discovery.json"), ("validation", "B1/validation.json"),
                         ("benefits", "B1/benefits.json"), ("auth-requirements", "B1/auth-requirements.json")):
        want = pin(rel)
        ours = nhcx.build_coverage_request(<YOUR_COVERAGE_INPUT_FROM_REF>(purpose, want))
        same(f"coverage {purpose}", ours, want)

    section("insurance plan request: ours is the pin")
    same("plan request", nhcx.build_plan_request(REF["policy"], REF["provider"]["id"]),
         pin("B2/insurance-plan-request.json"))

    section("claim bundles: ours is the pin")
    ref_pa = pin("B3/preauth-request.json")
    ref_pdf = next(si["valueAttachment"]["data"] for si in resource(ref_pa, "Claim")["supportingInfo"]
                   if "valueAttachment" in si)
    dossier = <YOUR_DOSSIER_FROM_REF>(REF, ref_pdf, ref_pa)
    same("preauth request", nhcx.build_preauth_bundle(dossier, flow="request"), ref_pa, factor=False)
    ref_qu = pin("B3/preauth-queryupdate.json")
    reply = next(si["valueString"] for si in resource(ref_qu, "Claim")["supportingInfo"]
                 if si["category"]["coding"][0]["code"] == "NMI")
    same("preauth query update",
         nhcx.build_preauth_bundle(dossier, flow="queryupdate", query_response=reply),
         ref_qu, factor=False)
    ref_cancel = pin("B3/preauth-cancel.json")
    cancel = resource(ref_cancel, "Task")
    reason = cancel["reasonCode"]["coding"][0]
    same("preauth cancel",
         nhcx.build_cancel_task(task_input(cancel, "claimNumber"), (reason["code"], reason["display"]),
                                cancel["authoredOn"], REF["provider"], REF["payer"]),
         ref_cancel)
    ref_ack = pin("B7/payment-notice-ack.json")
    ack = resource(ref_ack, "Task")
    acked_claim = next(o["valueString"] for o in ack["output"] if "valueString" in o)
    same("payment acknowledgement",
         nhcx.build_payment_ack(acked_claim, ack["authoredOn"], REF["provider"], REF["payer"]),
         ref_ack)

    section("the transport is the one door, and it can be stubbed")
    posted: list[dict] = []
    real_send = nhcx.transport.send

    def submitted(payer: str, corr: str):
        def _send(path, bundle, recipient, workflow_id, correlation_id=None, **kw):
            posted.append({"path": path, "recipient": recipient, "workflow_id": workflow_id,
                           "correlation_id": correlation_id, "bundle": bundle})
            return {"txn_id": "01TEST", "correlation_id": corr, "api_call_id": "acid-" + corr}

        seeded = <YOUR_SEEDED_EPISODE>(payer)   # eligible, plan ready, lines quoted, dossier saved
        nhcx.transport.send = _send
        try:
            nhcx.submit_preauth(seeded)
        finally:
            nhcx.transport.send = real_send
        return seeded

    episode = submitted(REF["payer"]["code"], "corr-preauth-1")
    sent = posted[-1]
    leg = nhcx.preauth(episode)
    check("the pre-auth goes out on the preauth route under workflow 12",
          sent["path"] == "v1/preauth/submit" and str(sent["workflow_id"]) == "12")
    check("no correlation id is passed on a request", sent["correlation_id"] is None)
    check("the leg waits with the transport's ids",
          leg["status"] == "submitting" and leg["txn_id"] == "01TEST" and leg["correlation_id"] == "corr-preauth-1")

    section("readers: the payer answers settle the right state")

    def deliver(bundle: dict, acid: str, workflow: str, status: str = "response.complete",
                corr: str = "corr-preauth-1", sender: str = "1518@hcx") -> str:
        return nhcx.receive({"jwe_headers": {"x-hcx-correlation_id": corr,
                                             "x-hcx-api_call_id": acid,
                                             "x-hcx-sender_code": sender,
                                             "x-hcx-status": status, "x-hcx-workflow_id": workflow},
                             "fhir": bundle}, "preauth", "request", "fhir")

    received = pin("C5/C5-received-wf20-pmjay.json")
    before = nhcx.preauth(episode)["preauth_ref"]
    check("the PMJAY acknowledgement leaves the leg waiting",
          deliver(received, "acid-20", "20", "response.partial") == "settled"
          and nhcx.preauth(episode)["status"] == "submitting")
    check("an acknowledgement without preAuthRef overwrites nothing",
          not resource(received, "ClaimResponse").get("preAuthRef")
          and nhcx.preauth(episode)["preauth_ref"] == before)
    check("the same api call id delivered again is ignored",
          deliver(received, "acid-20", "20", "response.partial") == "ignored")
    approval = pin("C5/C5-approved-wf21-pmjay.json")
    approved = resource(approval, "ClaimResponse")
    check("the approval settles the leg on the same thread with the payer's case number",
          deliver(approval, "acid-21", "21") == "settled"
          and nhcx.preauth(episode)["status"] == "approved"
          and nhcx.preauth(episode)["approved_amount"] == total(approved, "benefit")
          and nhcx.preauth(episode)["preauth_ref"] == approved["preAuthRef"])
    stage, sub_stage = nhcx.case_stage(episode)
    check("the episode is stamped preauth / approved", (stage, sub_stage) == ("preauth", "approved"))

    other = submitted(GENERIC_PAYER, "corr-preauth-2")
    generic = pin("C5/C5-received-wf20.json")
    check("a generic payer's acknowledgement carries the case number, and it is kept",
          deliver(generic, "acid-20g", "20", "response.partial", corr="corr-preauth-2",
                  sender=GENERIC_PAYER) == "settled"
          and nhcx.preauth(other)["status"] == "submitting"
          and nhcx.preauth(other)["preauth_ref"] == resource(generic, "ClaimResponse")["preAuthRef"])

    section("auth requirements: the payer's ruling is read line by line")
    for rel in ("C3/C3-response-generic.json", "C3/C3-response-pmjay.json"):
        ruling = pin(rel)
        answer = [e["resource"] for e in ruling["entry"]
                  if e["resource"]["resourceType"] == "CoverageEligibilityResponse"][-1]
        want = {i["productOrService"]["coding"][0]["code"]: i.get("authorizationRequired")
                for i in answer["insurance"][0]["item"]}
        got = nhcx.parse_auth_bundle(ruling)   # {procedure code: {"required": bool, "supporting": [...]}}
        check(f"{rel}: one ruling per quoted line, required as the payer says",
              {code: line["required"] for code, line in got.items()} == want)

    section("the query loop")
    queried = pin("C5/C5-queried-wf24.json")
    check("a PMJAY query is the leg queried, with the payer's words and case number kept",
          deliver(queried, "acid-24", "24") == "settled"
          and nhcx.preauth(episode)["status"] == "queried"
          and bool(nhcx.preauth(episode)["query_note"])
          and nhcx.preauth(episode)["preauth_ref"] == resource(queried, "ClaimResponse")["preAuthRef"])
    try:
        nhcx.submit_preauth(episode, reply="")
        check("an empty reply is refused before sending", False)
    except ValueError:
        check("an empty reply is refused before sending", True)
    check("a generic payer's CommunicationRequest is classified a query",
          nhcx.classify_communication(nhcx.GENERIC_ADAPTER, "additionalinfo", "order") == "query"
          and nhcx.classify_communication(nhcx.PMJAY_ADAPTER, "additionalinfo", "order") == "notification"
          and nhcx.classify_communication(nhcx.GENERIC_ADAPTER, "tatquery", None) == "notification")

    section("refusal at the door")
    refusal = {"type": "ProtocolResponse", "x-hcx-status": "response.error",
               "x-hcx-correlation_id": "corr-preauth-1",
               "x-hcx-error_details": {"code": "PAYR-1238", "message": "Beneficiary is having an active preauthorization request"}}
    <YOUR_RESET_LEG_TO_SUBMITTING>(episode)
    check("a ProtocolResponse settles the leg as refused with the payer's words",
          nhcx.receive({"jwe_headers": {"x-hcx-correlation_id": "corr-preauth-1"}, "fhir": refusal},
                       "preauth", "request", "protocol") == "settled"
          and nhcx.preauth(episode)["status"] == "error"
          and "PAYR-1238" in (nhcx.preauth(episode)["error_message"] or ""))

    section("tasks and payment")
    cancelled = pin("C10/C10-cancelled-wfPC02-pmjay.json")
    verdict = resource(cancelled, "ClaimResponse")["adjudication"][0]["reason"]["coding"][0]["code"]
    check("PC02 is read as an accepted cancellation",
          nhcx.parse_task_response(cancelled)["adjudication"] == verdict == "cancelled")
    arbitration = pin("C10/C10-arbitration-wf37-pmjay.json")
    check("37 is read as the reprocess taken",
          nhcx.parse_task_response(arbitration)["task_status"] == resource(arbitration, "Task")["status"])
    paid = pin("C9/payment-notice.json")
    pn, pr = resource(paid, "PaymentNotice"), resource(paid, "PaymentReconciliation")
    notice = nhcx.parse_payment_notice(paid)
    check("the payment notice names the claim, the amount and the UTR",
          notice["claim_ref"] == pn["identifier"][0]["value"]
          and notice["amount"] == pn["amount"]["value"]
          and notice["utr"] == pr["paymentIdentifier"]["value"])

    print("\n" + "=" * 64)
    total_checks = sum(ok + bad for ok, bad in tally.values())
    for name, (ok, bad) in tally.items():
        print(f"  {name:44s} {ok:3d} passed  {bad:2d} failed  [{'FAIL' if bad else 'ok'}]")
    print("=" * 64)
    if failures:
        print(f"{failures} of {total_checks} check(s) FAILED")
        return 1
    print(f"all {total_checks} checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

What each placeholder must do:

- `<YOUR_HMIS_DB_ENV_VAR>` names the variable your HMIS reads its database path from, so the suite runs on a throwaway file.
- `<YOUR_HMIS_NHCX_MODULE>` is the module that owns `transport`, the builders and `receive`.
- `<YOUR_GENERIC_PAYER_CODE>` is the participant code of a generic payer (`<payer participant code>`) that your configuration maps to `query_mode: communication`.
- `<YOUR_COVERAGE_INPUT_FROM_REF>` returns the dict your coverage builder takes, filled from `REF`. The discovery pin carries policy `NONE`. The benefits and auth-requirements pins quote `REF["coverage_item"]`. Copy the Location and PractitionerRole from the pin it is given.
- `<YOUR_DOSSIER_FROM_REF>` returns whatever your claim builder takes. That is the claim number, the item, the tier, the program `AB-PMJAY` and factors `(1, 0.5, 0.25)`. Add the four `MAND` documents (`MAND0408`, `MAND0455`, `MAND0409`, `MAND0570`, each with the pin's PDF), and copy the stay and procedure dates from the pin it is given.
- `<YOUR_SEEDED_EPISODE>` takes a payer code and inserts an eligible episode for that payer, with the plan and lines seeded straight into the database.
- `<YOUR_RESET_LEG_TO_SUBMITTING>` puts the pre-auth row back to `submitting` on `corr-preauth-1`.

Run the suite from the folder that holds `nhcx-package/`, or set `NHCX_PACKAGE` to its path.

## 5. Running rung 2

Have your tests and live runs write every bundle they build into one archive folder. The package ships no validator. Run the HL7 FHIR validator with the NRCeS IG `ndhm.in` on the whole folder in one call, with the command and flags in `references/fhir-knowledge.md` section 11.

Read the results in three piles. "A code the profile does not define" is the scheme's vocabulary, and it is expected. "A required element is missing" and "an id or value the base rules refuse" are yours to fix. Warnings are advice; the sandbox accepted every pin as it stands. Skip the package master; it exhausts the validator's memory. A live PAYR-1004 or PAYR-1008 is the first reason to run this rung again (`nhcx-package/docs/06-Reference/02-Troubleshooting.md`).

## 6. Running rungs 3 and 4

Only the user runs these. Prepare what they start and the driver, then stop and ask.

What the user starts:

1. The transport. Your own or the app's existing one needs a participant record carrying its certificate and a public HTTPS `endpoint_url` the exchange can reach (`references/transport-knowledge.md` section 3). nhcx-adapter, only when the user chose it, comes from its release: `config.sample.json` filled in, started with `serve.sh`.
2. Your HMIS, reachable by the exchange through that transport.
3. For rung 3, a generic payer on the sandbox whose desk you can drive (`<payer participant code>`), mapped to `query_mode: communication`. For rung 4, nothing more: the PMJAY payer is `1518@hcx`, and its decisions are taken on the payer service desk.

The driver is a script or a browser spec. It walks the matrix rows through the app's JSON state address or its own screens, one episode per test, in series, with a 20 minute timeout per episode.

- Before a PMJAY run, sweep every live pre-auth for the beneficiaries the tests use. Cancel it on PC01, or have the desk reject it. Otherwise the first pre-auth is refused with PAYR-1238.
- One request at a time per case. Wait about 30 seconds after a decision before the next leg. On "Active instance found" (PAYR-1322), wait and resend, up to three times.
- Wait on the case's own state, never on a fixed sleep or a checklist.
- Log every verdict the sandbox gives, with its workflow id and words, so a refusal is a finding, not a mystery.
- Expect about four minutes for the rung 3 matrix and about ten minutes per episode on PMJAY.

After the run, package its bundles by correlation id from the per-case archive: every message sent and received, filed under its case. With nhcx-adapter as the transport, `nhcx-adapter ledger thread <correlation-id>` gives the same conversation, with bodies only while `ledger.storeBodies` is true (`nhcx-package/docs/02-Getting Started/10-NHCX Adapter.md`). File each thread under its use case.
