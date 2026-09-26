# F6. Questionnaire

#### F6R. RESOURCE
`Questionnaire`. Direction: received, inside the InsurancePlan bundle (F5). No profile is required or checked. The application never sends a Questionnaire: the answers go out as F7, which names the form by its `url`.

#### F6D. DESCRIPTION
The payer's forms: policy forms (consent, admission details, discharge information and similar) and standard treatment guideline (STG) checklists per package. They are shipped as entries of the InsurancePlan bundle, keyed by `url` (the entry's `fullUrl` is the same url), and pointed at from two places:
- a `Claim-SupportingInfoRequirement` extension's `documentationUrl` in F5 (on the plan or on a package);
- an auth-requirements ruling's `authorizationSupporting[].text` of the form `fullUrl: <url>` (F3).

Rules:
- The payer repeats a form once per package that needs it [PAYER](../references/PAYERS.md#markers). Forms are collected by `url`: the first one wins. A resource without a `url` is skipped.
- The kind is read from the url: the path segment before the id. `https://payer.gov.in/policy/questionnaire/100005` is a policy form (`questionnaire`), `https://payer.gov.in/policy/stgquestionnaire/104974` a treatment guideline (`stgquestionnaire`). Only `stgquestionnaire` is treated as a guideline when answered (F7, F8) [PAYER](../references/PAYERS.md#markers). A Sandbox Payer guideline at `https://xyz.example/fhir/Questionnaire/PROC-KNEE-01` therefore counts as a policy form [SANDBOX](../references/PAYERS.md#markers).
- The question is on `item.prefix` far more often than on `item.text` (7423 against 81 in the live PMJAY master [PAYER](../references/PAYERS.md#markers)). Both are read, prefix first.
- Items nest. They are flattened depth first, each keeping its depth.
- Answer options are read from `answerOption[].valueString`, else a `valueCoding` display, else its code. An option marked `initialSelected: true` is the question's default answer (the first such option).
- Item types seen live: `attachment`, `choice`, `dateTime` [SANDBOX](../references/PAYERS.md#markers). The type decides the answer's value type in F7.
- Which forms a leg must carry: with an auth-requirements ruling, the forms it names as due at pre-authorisation (for the pre-authorisation leg), plus the policy-wide forms (on both legs). Without a ruling, the pre-authorisation leg takes every form the package master attaches to the quoted packages, plus the policy-wide forms. The claim leg takes the policy-wide forms only (a ruling marks every form as due at pre-authorisation, so it adds none to the claim). A form answered for the pre-authorisation is offered again for the claim with the earlier answers filled in.
- A referenced form the payer did not ship is shown as missing rather than skipped.

#### F6F. FIELDS
Into D12 `claim_plan_form`, one row per distinct url:

| Element read | Stored in | Notes |
|---|---|---|
| `url` | `url` | required; the key |
| `id` | `form_id` | |
| `title`, else `name`, else `url` | `title` | |
| second-to-last path segment of `url` | `kind` | `questionnaire`, `stgquestionnaire` (or whatever the payer's path says) |
| `item[]`, flattened | `items` (JSON list) | one entry per item at any depth |
| `item[].linkId` | `items[].linkId` | the key an answer is stored under in D17 `claim_form_answer.link_id` |
| `item[].type` | `items[].type` | |
| `item[].prefix`, else `item[].text`, else "" | `items[].text` | the question shown, and sent back as F7 `item.text` |
| `item[].required` | `items[].required` (boolean) | |
| nesting level | `items[].depth` | 0 at the top |
| `item[].answerOption[].valueString` (else `valueCoding` display, else code) | `items[].options` (list of strings) | |
| first `answerOption` with `initialSelected: true` | `items[].initial` | the payer's default answer |

#### F6U. USED BY
- Callbacks: [C4. Insurance Plan Reply](../callbacks/C4-insuranceplan-on-request.md)
- FHIR: [F1. Bundle](F1-bundle.md), [F5. InsurancePlan](F5-insuranceplan.md), [F7. QuestionnaireResponse](F7-questionnaireresponse.md)
