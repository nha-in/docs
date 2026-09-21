# Stage 1: the idea

Purpose: agree with the user what is being built before anything is designed. One page, shared by the seven skills. Wrong answers here cost the most later, so this is the one stage that always ends with a question to the user when it is first written.

The first skill to reach this stage writes `1-idea.md` whole: the mode, the payers, the constraints, and a scope row for every step of the flow, each naming the skill that owns it. A later skill reads the page, confirms that the mode and the payers still hold, and marks its own rows. It asks the user only when it would change a row or an answer.

## Inputs

- This skill's section of `nhcx-build/0-capability.md`: what the app already does. A leg found present is still in scope: it is validated and tested, not rebuilt. Say so in the scope table's reason column. A prerequisite the user chose to wait for makes this skill's live legs `later`.
- `flow/FLOW.md`, whole. The build walks this path; the scope table below marks its steps in, later or out, and nothing else. `flow/flow.json` names the skills of each step in `skills`.
- What the user said. If they pasted a brief, quote it in the artefact.
- `references/flow-knowledge.md` sections 1, 3 and 6: the legs, the two payer kinds, the use-case catalogue. Read them so the scope table below uses the catalogue's codes.

## Do

Decide five things, in this order. A later skill confirms the first two and the fourth, and does the third for its own rows.

### 1. Mode

| Signal | Mode |
| --- | --- |
| A codebase, a database, a running system is named | `integrate` |
| "from scratch", "standalone", "a claims app", no existing system | `standalone` |
| Unclear | Ask. Do not guess; the two modes diverge at stage 3. |

### 2. Payers

Which participant codes the software will talk to, and which kind each is:

| Payer | Participant code | Kind | Query mode |
| --- | --- | --- | --- |
| PMJAY (SHA Himachal Pradesh, sandbox) | `1518@hcx` | scheme | `resubmit` |
| A generic sandbox payer you can drive, for testing | from the participant registry | generic | `communication` |
| Any other insurer | from the registry | generic unless told otherwise | `communication` |

Both kinds are in scope by default. A build that targets only one still keeps the payer adapter switch (module 7.11), because the second is one config line away.

### 3. Scope of legs

Copy the steps of `flow/flow.json` (F1 to F13 with their branches) into a scope table, with the skill that owns each (`skills`), and mark each `in`, `later` or `out`, with a reason; add the catalogue code from `flow-knowledge.md` section 6 beside each. The default scope for a first release is every hospital-side leg in `flow-knowledge.md` section 1. Cutting a leg is the user's call; propose it, do not decide it. Legs that are commonly `later`: predetermination, status enquiry (PMJAY refuses it), release of a shortfall (out of reach on the sandbox).

A later skill changes only its own rows.

### 4. Constraints

Ask the codebase, not the user, where you can:

- Language and framework (integrate: whatever the HMIS uses; standalone: Python standard library unless the user names another, because the module files' pseudo code maps onto it directly).
- The transport (`references/transport-knowledge.md` section 1): `existing` when stage 0 found the app already speaks NHCX; else `own`, built into the app from NHA's protocol; `adapter` (nhcx-adapter) only when the user has asked for it, their words quoted. Never propose the adapter.
- The inbound path. For `own`: a public HTTPS domain in India, registered as the participant's `endpoint_url` and reachable from the exchange. For `existing`: the app's own callback. For `adapter`: whether the app can receive the adapter's POST; if not, polling the adapter's ledger is the only inbound path. Write it down now.
- What onboarding needs from the user: the ABDM sandbox client id and secret (Milestone 1), the facility's HFR id, and a participant record carrying the build's certificate and callback address.
- Document storage: blob, filesystem, object store.
- Whether a background worker exists. Without one, polls happen on the request path.
- Anything the user forbids: new dependencies, schema changes to existing tables, a build step.

### 5. Definition of done

Write the compliance points from `core/LADDER.md` as they apply to this build, and the highest rung of the test pyramid the user wants climbed before handover (`references/testing-knowledge.md` section 1). The offline rung is never optional.

## Write

`nhcx-build/1-idea.md` from `templates/1-idea.md`. Keep the headings. Under two pages. A later skill edits only its scope rows and adds a line under "Agreed".

## Gate

- [ ] Mode is `integrate` or `standalone`, and the reason is one sentence.
- [ ] Every payer has a participant code and a query mode.
- [ ] The scope table has every step of the flow and every catalogue row, each with its skill, marked in, later or out.
- [ ] Constraints name the language, the transport (existing, own, or nhcx-adapter because the user asked for it), the inbound path and the document store.
- [ ] Definition of done names the target rung.
- [ ] The user has read the page and agreed, or a written brief stands in for the user. A later skill that changed nothing records that it confirmed the page.

Record the gate in the Shared block of `nhcx-build/STATE.md`.

## Common mistakes

- Choosing `standalone` because the HMIS is unfamiliar. Unfamiliar is what stage 3 is for.
- Leaving PMJAY out because the user only named an insurer. PMJAY is the payer that refuses most; a build that handles it handles the rest.
- Dropping a leg from scope because stage 0 found it present. It stays in: present capabilities are validated and tested.
- Writing design here. Tables, screens and modules belong to stages 4 to 6.
