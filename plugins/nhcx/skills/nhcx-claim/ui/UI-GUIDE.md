# UI guide: the screens of an NHCX claims desk

What the person at the desk sees, what they type, what they must not be able to type, and where every value on the screen comes from. Stage 5 plans against this; module 7.12 builds against it. The source is `nhcx-package/docs/03-Building a Provider/09-UI Guide.md`.

## The two rules, and the third that follows

1. Nothing the exchange already knows is typed. Payer names, policy numbers, package names, rates, add-on codes, document lists and questionnaire text come from the participant service, the policy lookup, the insurance plan or the eligibility answer. A field the user can edit is a field the payer can reject.
2. The screen never shows a decision the exchange has not sent. Submitting is not approval. Every status is derived from a message that was received and stored, never from the fact that a request went out.
3. Keep a record of what you sent. A case the payer has not answered exists nowhere in the inbox. Store, per request, the action, the headers, the bundle and the exchange's receipt, and build every case screen from the two halves together. "Sent, nothing back" is the waiting state, and it must render.

Address a case internally by its correlation id (fixed from the moment of submission). Show the payer's own number (`preAuthRef`) to the user once it arrives, because that is what they quote on the phone.

## Where every value comes from

| On screen | Comes from | Editable |
| --- | --- | --- |
| Payer name | The policy search answer (participant list) | Pick from a list |
| Policy, member id, product | Policy search | Pick from a list |
| Cover in force, balance remaining, the payer's sentence | `CoverageEligibilityResponse` (`validation`): `insurance[0].inforce`, `benefit[].allowedMoney` less `usedMoney`, `disposition` | No |
| Specialty, package, rate | The plan: `claim_plan_benefit.category`, `code`, `rate` | Pick from a list; rate locked |
| Add-ons (tiers, implants) and their caps | The plan's `extras` and conditions | Pick within limits |
| Required documents and questionnaires | The auth-requirements ruling, else the plan's requirements | No; answer, never edit |
| Case status and sub-status | `case_stage` over the leg rows and their answers | No |
| The payer's query text, decision, reason | `claim_query.questions_json`; `ClaimResponse.processNote`, `item[].adjudication[reason]` | No |
| Approved amount | `ClaimResponse.total[category=benefit]` (never `submitted`) | No |
| Pre-authorisation reference | `ClaimResponse.preAuthRef` | No |
| UTR, gross, deductions, net | `PaymentNotice.payment` identifier, `amount`, `PaymentReconciliation.detail[]` | No |
| Clinical findings, diagnosis, care team | The HMIS record | Yes, in the HMIS |
| Discharge type, dates, bill number, amount claimed | The desk | Yes, within the approved amount |
| The desk's reply to a query | The desk | Yes |

## The screens

Routes are yours; these are examples. Every screen is server-rendered; forms post and the page re-renders. No screen needs client-side rendering.

### 1. Cases list (`/claims`)

```
+------------------------------------------------------------------+
| Cases                                   [ New case ]  filter: [v] |
+------------------------------------------------------------------+
| Case        Patient        Payer   Stage / sub-stage   Waits for   |
| CL-26-0001  Sunita Devi    PMJAY   preauth / requested  payer 42m  |
| CL-26-0002  Ram Lal        Star    preauth / queried    Answer (1) |
| CL-26-0003  Meena K        PMJAY   claim / approved     payment    |
| CL-26-0004  Arun S         PMJAY   payment / paid       nothing    |
+------------------------------------------------------------------+
```

- Sortable by what needs action: open queries first, then oldest waiting, then unacknowledged notices.
- "Waits for" is `next_actions[0]`; for a waiting case it shows how long, never a guess at the outcome.
- Nothing on this screen is entered.

### 2. Find the patient and confirm cover (`/claims/new`)

```
+------------------------------------------------------------------+
| Find the patient                                                  |
| [ ABHA | PMJAY id | Mobile ]  [ 91718280654077     ] [ Search ]   |
+------------------------------------------------------------------+
| Policies found                                                    |
| ( ) PMJAY/HP/S/G   SHA Himachal Pradesh   member MD5SLS4X5        |
| ( ) STAR/FAM/2026  Star Health            member 4487212          |
+------------------------------------------------------------------+
| Cover                          checking cover ...                 |
|   In force: yes   Balance: 4,50,000 (allowed 5,00,000 less used   |
|   50,000)   Payer: "Policy is currently in-force"                 |
|                                          [ Register ] (disabled   |
|                                            until cover confirmed) |
+------------------------------------------------------------------+
```

- Try identifiers in order of strength and say which one matched.
- Show the subtraction, not the allowed amount alone. Indian digit grouping (4,50,000) with a word beside it.
- The register button is disabled while `claim.status` is `checking`, and when `not-eligible`, with the payer's `disposition` as the reason.
- States: searching, policies found, checking cover, cover confirmed, cover refused, registered.

### 3. Plan the treatment (`/claims/<id>` plan pane, `/claims/<id>/lines`)

```
+------------------------------------------------------------------+
| Plan  (PMJAY/HP/S/G, fetched 2026-09-10, 1,949 packages)          |
| Specialty [ General Medicine v ]   Search [ dengue        ]       |
| Code     Package                       Rate     Kind   Add        |
| MG004C   Dengue shock syndrome         8,500    Proc  [ Add ]     |
| MG0111A  Pleural effusion              3,300    Proc  [ Add ]     |
+------------------------------------------------------------------+
| Quoted lines                                       Total 11,800   |
| MG004C  Dengue shock syndrome   x1   8,500                         |
|    tier STRAT006c ICU without ventilator            (rides on it) |
| MG0111A Pleural effusion        x1   3,300         [ remove ]     |
| Balance remaining 4,50,000   within balance                       |
+------------------------------------------------------------------+
| Documents the plan wants        Forms the plan wants              |
| [x] MAND0408 Clinical notes     [ ] Authentication consent        |
| [ ] MAND0455 CXR PA view        [ ] STG: Dengue checklist         |
+------------------------------------------------------------------+
```

- The rate is text, never an input. Quantity is an integer input, capped.
- Tiers appear under their procedure and never as their own line on the wire.
- A standalone package clears other selections and says so; a package needing a parent will not stay selected without one.
- When the total exceeds the balance the submit path is closed, not warned.
- The checklist comes from the plan (the ruling adds to it when it arrives).

### 4. The case (`/claims/<id>`)

Tabs in the payer's order: cover, plan, lines, forms, documents, pre-auth, communication, claim, payments. Above the tabs, one status line and the actions open now.

```
+------------------------------------------------------------------+
| CL-26-0001     Sunita Devi  PMJAY 1518@hcx                        |
| [preauth] [requested]  waiting for the payer, 42 min              |
| Next: (nothing to do)              [ Cancel pre-auth ]            |
+------------------------------------------------------------------+
| Timeline                                                          |
| 10:30 out  v1/preauth/submit   wf 12   sent      txn 7UMV0007     |
| 10:31 in   on_submit           wf 20   received  "Submitted"      |
| 10:58 in   on_submit           wf 21   approved  ref 2026090810000140  benefit 2,070  |
|            payer: "Request acknowledged and accepted..."          |
+------------------------------------------------------------------+
```

- The status line is `case_stage`. Words: draft, checking, eligible, not-eligible, requested, resubmitted, answered, queried, approved, partial, rejected, cancelling, cancelled, refused, noticed, paid.
- The timeline is one row per archived message and one per leg row without an answer. A repeated api call id is shown as a repeat, not a second decision.
- A refusal at the door (a ProtocolResponse) is a flag beside the state, with the payer's code and text, never the state itself.
- Approved shows `preAuthRef`, the `benefit` total and every process note verbatim. `submitted` is what you asked for; showing it as the decision is the classic error.
- A queried case shows the payer's words with the item highlighted and a reply box. On a `resubmit` payer (PMJAY) the box is on this tab and posts a query answer (workflow 19 or 161), never a fresh pre-auth. On a `communication` payer the box is on the inbox item.
- Enhancement opens only on an approved case with no request in flight, offers only packages the plan marks enhanceable, and shows approved items greyed beside the new ones.
- Cancel: a reason picker (the documented reasons) plus free text required for Other; hidden once a claim is raised.
- After a rejection the action offered is a fresh pre-auth (12), never a resubmit (121).

### 5. Discharge and claim (claim tab)

```
+------------------------------------------------------------------+
| Discharge                                                         |
| Mode ( ) Normal ( ) LAMA ( ) DAMA ( ) Death                       |
| Stage (LAMA/DAMA) ( ) Before surgery ( ) During ( ) After         |
| Discharged at [2026-09-12 11:00]  Surgery at [2026-09-11 09:30]    |
| Death at [                ] (death only)                          |
+------------------------------------------------------------------+
| Claim                     approved 8,500 (ref 2026090810000140)   |
| Discharge summary [ upload ]   Consent form  [ answer ]           |
| Documents not yet sent: MAND0006 [ upload ]                        |
| Lines: MG004C 8,500            (LAMA before surgery: LM100 only)  |
|                                            [ Submit claim ]        |
+------------------------------------------------------------------+
```

- The discharge mode is chosen before the claim opens. Death needs a death time (the claim carries `ONS/DTM`).
- Amount claimed never above the approved amount; under PMJAY the package is billed whole.
- LAMA or DAMA before or during surgery replaces the lines with `LM100` and tells the user the approved packages are voided.
- States: draft, submitted, in process, forwarded, queried, approved, reduced, rejected. Rejected offers reprocess only.

### 6. Inbox (`/claims/inbox` or the communication tab)

```
+------------------------------------------------------------------+
| Inbox                              [ queries | notifications | notes ] |
| Case        From    Kind          Reason         Received  State  |
| CL-26-0002  Star    query         additionalinfo 09:12     open   |
|   "Please provide the angiography report to support your claim"  |
|   Reply [                                   ] [ attach ] [ Send ] |
| CL-26-0001  PMJAY   notification  information   08:40     acknowledged |
+------------------------------------------------------------------+
```

- Routed by kind (module 7.10's classification) and reason: queries to the desk, TAT alerts to claims, grievances to their desk, wallet or policy changes refresh the plan, arbitration acknowledgements to appeals.
- The question text is `CommunicationRequest.payload[].contentString`, verbatim.
- A notification shows as acknowledged once the acknowledgement went, and shows that it went.

### 7. Payments (`/claims/payments`, and the payments tab)

```
+------------------------------------------------------------------+
| Payments                                                          |
| Case        Notice   Status   Gross    Deductions  Net    UTR     |
| CL-26-0003  wf 30    paid     8,500    TDS 850     7,650  UTR20260912ABC  [copy] |
|             acknowledged 09:50 (wf 17)                            |
| CL-26-0005  wf 30    rejected  not paid                           |
+------------------------------------------------------------------+
```

- The UTR is text on the page (a copy control beside it is welcome), never only inside an input's value.
- Two acknowledgements exist: the transport 2xx the callback returned, and the business acknowledgement (Task, workflow 17 for PMJAY, the notice's id echoed for a generic payer). The second is what the screen shows: one indication per notice once it has gone, sent whether or not anyone clicks.
- A rejected notice reads "not paid", in red, with the case kept open.

### 8. The JSON state address (`/claims/<id>/state`)

Everything the case screen shows, as JSON, after the same polls: `stage`, `sub_stage`, `next_actions`, `legs` (one object per leg with status, ids, amounts, `preauth_ref`, the payer's words), `queries`, `payments`, `documents`. Test drivers read this; it must agree with the page.

## Two things that break a naive screen

- A delivery failure arriving on a case that already has an answer is about one message, not the case. Show it as a flag beside the state.
- The same answer delivered twice. Treat a repeated `x-hcx-api_call_id` as the message you already have.

## Errors the user should see

Show the payer's error as the payer wrote it, with the code, and one line on what the user can do. A ProtocolResponse (the message could not be opened) is a system problem for the integration team, shown as a flag, not a desk error.

## Pseudo code

### Deriving the status line

```
function status_line(case):
    (stage, sub) = case_stage(case)                      # module 7.11, never a stored choice
    first = next_actions(case)[0] if any else null
    if sub in (requested, answered, resubmitted, checking):
        waited = now - latest_send(case).sent_at
        return f"{stage} / {sub}: waiting for the payer, {humanise(waited)}"
    if first: return f"{stage} / {sub}: {first.label}"
    return f"{stage} / {sub}"
```

### Rendering the timeline

```
function timeline(case):
    rows = []
    for leg in case.legs:                                # every leg row, answered or not
        rows.append(row(leg.sent_at, "out", leg.path, leg.workflow_id, "sent", leg.txn_id))
        if not leg.answered_at: rows.append(row(leg.sent_at, "", "", "", "waiting", ""))
    for msg in archive(case):                            # every inbound message
        if msg.repeated: rows.append(row(msg.time, "in", msg.path, msg.workflow_id, "repeat of " + msg.api_call_id, ""))
        elif msg.kind == "protocol": rows.append(row(msg.time, "in", msg.path, "", "refused at the door", msg.error_details))
        else: rows.append(row(msg.time, "in", msg.path, msg.workflow_id, verdict_word(msg), payer_words(msg)))
    return sorted(rows by time)
```

### What a value renders as

```
function render_value(spec, case):                       # spec is one entry of screens.json values[]
    v = read(spec.source, case)                          # a stored message element, never a form field
    if v is missing:
        return spec.empty                                # "waiting" for a decision, "" for a fact
    return text(v)                                       # text, not an <input>, unless spec.typed
```

### Which actions to offer

```
function actions(case):
    out = []
    q = open_queries(case)
    if q: out.append(action("Answer the payer (n)", tab = inbox if payer.query_mode == communication else leg_tab))
    leg = current_leg(case)
    if leg.status == "rejected" and leg.kind == "preauth": out.append(action("Send a fresh pre-authorisation", sends = 12))
    if leg.status == "approved" and no_request_in_flight(case) and leg.kind == "preauth":
        out.append(action("Enhance", sends = 13)); out.append(action("Cancel", sends = PC01)); out.append(action("Discharge and claim", tab = claim))
    if leg.kind == "claim" and leg.status == "rejected": out.append(action("Ask for a reprocess", sends = 36))
    if payer.status_enquiry: out.append(action("Ask status", sends = task status))
    for notice in unacknowledged_notices(case): out.append(action("Acknowledge payment", sends = 17 or echo))
    return out
```

## Component vocabulary (suggested, for a standalone build)

A suggested set of helpers. Server-rendered HTML from Python functions returning strings, styled by the 0build kit 0.5.4 from jsDelivr. Components: `z-card`, `z-button`, `z-input`, `z-select`, `z-table`, `z-nav`, `z-tab` with `data-z-switcher`, `z-alert`, `z-badge`, `z-breadcrumb`. Utilities take values through custom properties (`class="display-grid gap" style="--gap: 4"`). Helpers a screen needs: `page`, `card`, `stack`, `table`, `grid`, `field`, `text_input`, `select`, `button`, `post_button`, `confirm_form`, `badge`, `when`, `muted`, `dl`, `tabs`, `stat`, `empty_state`. Tables cap at about eight columns; merge facts into a main line with a muted sub-line. Every state-changing action that is not a full form is a `post_button`; destructive ones confirm.

In `integrate` mode use the HMIS's own components and conventions; the layouts above are the content, not the markup.
