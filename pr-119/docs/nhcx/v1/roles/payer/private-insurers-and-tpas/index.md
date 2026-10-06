# Private insurers and TPAs

An IRDAI-regulated insurer or a third-party administrator (TPA) integrates on the private insurance and TPA track. It runs the same fifteen exchanges as a scheme payer, listed in [Payer checklist](/docs/pr-119/docs/nhcx/v1/roles/payer/payer-checklist), with commercial products, attachments in place of a package master, and no scheme adjudication rules. This page is what differs on that track, and the rules that hold whatever you build behind the endpoints.

## In short

- One cashless case is five conversations: plan, eligibility, preauthorisation, claim and payment notice.
- The network enforces the contract on the wire. How you split listeners, queues and adjudication is your own decision.
- Fields the network does not read are dropped. Extra FHIR content does not make up for a missing identifier type.
- Only benefit type `30` reaches the hospital's wallet display, and only `ClaimResponse.outcome` reaches its case screen.
- A checkpoint is done only against a recording: the request, the 202 within 30 seconds, the callback, and the hospital screen.

## One case, five conversations

A cashless case on the private track is five conversations between the hospital and you. Each is a request and a callback on its own correlation id.

1. Plan. The hospital fetches your insurance plan and builds its screens from it.
2. Eligibility. The hospital asks whether the policy is in force and what is left.
3. Preauthorisation. The hospital asks permission to treat, and you decide.
4. Claim. The hospital sends the bill, and you decide again.
5. Payment notice. You tell the hospital the money has moved.

Discharge is usually a distinct hospital step before the claim, not an exchange of its own. Documents are typically attachments and questionnaires: the hospital sends files under the codes your plan names and answers the questionnaires your plan carries. A scheme payer drives documents from a package master instead; [PMJAY on NHCX](/docs/pr-119/docs/nhcx/v1/concepts/pmjay-on-nhcx) has that shape.

Accident and emergency (AAE) variants of preauthorisation and claim exist on some stacks. They are not among the fifteen sandbox exit checkpoints, so treat them as out of scope here.

## The contract the network enforces

The exchange checks the envelope, the four validations on every response in [Payer overview](/docs/pr-119/docs/nhcx/v1/roles/payer/), and the FHIR profile. It does not look at how you are built. How a payer splits listeners, queues and adjudication is entirely its own decision. What the network does hold you to:

- **Fields the network does not read are dropped.** A boolean such as `authorizationRequired` does not appear on the hospital screen. Adding extra FHIR content will not compensate for a payload that is missing the identifier types below.
- **Capacity is sized for every hospital on the network, not a single partner.** A closed two-party integration misreads NHCX: it is a network, not a bilateral link. Every hospital on the network can reach you the day you go live.
- **`processingid` and `payerid` are two codes.** An insurer that adjudicates its own claims carries the same value in both. A TPA-mediated book carries the TPA's code as `processingid`. Get the pair right for both kinds of book; the [Policy registry](/docs/pr-119/docs/nhcx/v1/registries/policy) explains the split.
- **Only your backend obtains the session token.** Never a browser application. The client secret stays on the server that hosts your callbacks.

## The identifier types a payload must carry

Your own intake and the hospital's mapper both key on `identifier.type`. A payload missing one of these is not rescued by anything else in the bundle.

| Type   | Where                                           | What it is                                                              |
| ------ | ----------------------------------------------- | ----------------------------------------------------------------------- |
| `PI`   | `Patient.identifier`                            | The case reference. Generate one if the request has none; do not reject |
| `ADN`  | `Patient.identifier`                            | The Aadhaar number                                                      |
| `NPI`  | `Organization` (prov)                           | The provider's HFR id                                                   |
| `NIIP` | `Organization` (pay)                            | The payer's registry id                                                 |
| `CLN`  | `Claim`, `ClaimResponse`, `Task`                | The claim number                                                        |
| `OIN`  | `ServiceRequest.identifier` on a claim          | The referral number, when present                                       |
| `SNO`  | `Procedure.identifier` in a Communication reply | The item sequence, when the hospital answers line by line               |

One benefit type matters on the hospital side: `30` is the wallet, and it is the only benefit type the hospital keeps. The hospital shows `allowedMoney` plus `usedMoney` on benefit type `30` only. Wallet figures on any other benefit type never reach the screen.

## What reaches the hospital screen

Hospital systems built on the reference mapper show a fixed set of fields and drop the rest. Build your answers for what is shown.

| Exchange                           | What the hospital shows                                                                                                                                                            | What its mapper drops                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Eligibility                        | The wallet on benefit type `30`, and the items                                                                                                                                     | `purpose`, `outcome`, `inforce`, `status`, `disposition`, `period` and `authorizationRequired`  |
| Preauthorisation and claim answers | `ClaimResponse.outcome` with the adjudication reason, the benefit amounts, `processNote` and `disposition`                                                                         | `x-hcx-status`. Omitted, it defaults to `response.complete`, which is not what the screen shows |
| Task answer                        | `outcome` `complete` takes the preauthorisation-cancelled path, anything else the claim path. A `disposition` starting "Erroneous claim is rejected" shows as "Erroneous Rejected" | `Task.status`. A Task answer without `ClaimResponse.outcome` does not display at all            |
| Payment notice                     | Initiated as paid, Paid as cleared, Recovered as adjusted, Re-Initiated as itself, and any error as Rejected                                                                       |                                                                                                 |

[Eligibility response](/docs/pr-119/docs/nhcx/v1/roles/payer/eligibility-response), [Adjudicating preauthorisation](/docs/pr-119/docs/nhcx/v1/roles/payer/adjudicating-preauthorisation), [Adjudicating claims](/docs/pr-119/docs/nhcx/v1/roles/payer/adjudicating-claims) and [Payment notice and communication](/docs/pr-119/docs/nhcx/v1/roles/payer/payment-notice-and-communication) carry the detail behind each row.

## When a checkpoint is done

Tick a checkpoint as done only against a sandbox or staging recording that shows four things: the request, the 202 acknowledgement within 30 seconds, the callback, and the hospital screen. [Sandbox exit evidence](/docs/pr-119/docs/nhcx/v1/roles/payer/sandbox-exit-evidence) lists what that recording has to show for each checkpoint, and the evidence pack the demonstration is scored on.
