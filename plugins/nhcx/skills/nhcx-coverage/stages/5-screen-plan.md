# Stage 5: screen plan

Purpose: decide the screens, and for every value on every screen, the received message it is derived from. The two honesty rules are the whole point of this stage, and a reviewer tests them before anything else.

The case screen is the episode's (`foundation.screens`): its eight tabs, the status line and actions, the JSON state address and the cases list. The first skill to run this stage lays them out whole, every tab present with its opening condition. Each skill then plans the values and actions of its own tabs and screens, which its `SKILL.md` lists.

## Inputs

- `nhcx-build/1-idea.md`, `nhcx-build/3-discovery.md` (screen conventions), `nhcx-build/4-flow-data-mapping.md`
- This skill's `SKILL.md`: its tabs, its screens, its next actions
- `flow/FLOW.md` ("The shape", "The status line and the actions", every step's Screen line) and `flow/flow.json`: the screens are put on these steps, not invented.
- `references/flow-knowledge.md` section 4 (stage, sub-stage, next actions)
- `ui/UI-GUIDE.md`: the screens, a layout per screen, where every value comes from, the state words. Read it whole before planning.
- `nhcx-package/docs/03-Building a Provider/09-UI Guide.md` (the published source of the guide)

## The two rules

1. No screen shows a decision the exchange has not sent. Every state on every screen is derived from a stored message. A case with a request sent and no answer back reads as waiting, never approved, never rejected. That case exists only because module 7.3 kept a record of what was sent, so the screen must be able to render a leg with a request and no response.
2. Nothing the exchange already knows is typed. Payer names, policies, balances, package rates, the payer's own wording, `preAuthRef`, the approved amount, the UTR are rendered from the message that carried them. A package rate is never an editable field.

## Do

### 1. The screen list

The case screen carries the eight tabs of `flow.json` `tabs`, in that order, with those labels, opening under those conditions. The status line and the action list above the tabs use the labels of `flow.json` `next_actions` verbatim. Then, minimum, once every skill has run:

| Screen | Who | Shows | Derived from | Planned by |
| --- | --- | --- | --- | --- |
| Cases list | billing clerk | every episode, its stage and sub-stage, what it waits for | `claim.stage`, `sub_stage`, `next_actions` | the first skill |
| Case | everyone | the timeline of legs, the payer's answer verbatim, the actions open now | every leg row and its archived messages | the first skill; each skill its tabs |
| Inbox | desk | payer messages routed by kind: query, notification, note | `claim_query` | `nhcx-communication` |
| Payments | accounts | notices, deductions, UTR, reconciliation | `claim_payment`, `claim_payment_detail` | `nhcx-payment` |
| Find and cover | registration clerk | policy search, eligibility verdict, register or link | the policy search answer and the `on_check` bundle | `nhcx-coverage` |
| Plan | doctor | specialty, package, add-ons, tiers, the documents and forms the plan wants | `claim_plan_*`, `claim_auth_*` | `nhcx-insurance`, with the ruling from `nhcx-preauth` |

`integrate` mode adds a panel to the HMIS's own admission screen linking the admission to its episode. `standalone` mode adds the capture screens module 7.13 describes (patient, admission, discharge, documents, settings).

Where stage 0 found a screen present, plan what it shows today against the rules, and list every value that breaks one as a gap.

### 2. Per screen, per value

For every value on this skill's screens, one row: `Value | Message and element | Empty state`. The empty state is what the screen shows before the message arrives (for a decision: "waiting"; for a rate: nothing, the field does not exist yet). A value whose source is "the user types it" is allowed only for things the exchange cannot know: the discharge mode and dates, the desk's reply to a query, the documents, the questionnaire answers, the chosen lines.

### 3. Actions

Every action is one step of `flow.json` and carries its id in `step`. For every action this skill's screens offer, the leg it sends, the sub-stage that must hold for it to be offered, and the sub-stage it moves to. Take the offered-when rules from `next_actions` in flow-knowledge section 4: an unanswered query always leads; the reply box is offered only to a `resubmit` payer; after a rejection the pre-auth offers a fresh 12, not 121.

### 4. Addresses and conventions

Write the route for each screen in the HMIS's own style (from stage 3). The state of a case must also be readable as JSON at one address, because stage 10 drives the screens through it (for example `GET /claims/<id>/state`). Each skill adds its legs to what the address returns.

## Write

- `nhcx-build/5-screen-plan.md` from `templates/5-screen-plan.md`: the shell at the top (first skill), then a section per skill.
- `nhcx-build/screens.json` in the shape of `templates/screens.json`: the first skill writes `rules`, `tabs`, `state_address`, the cases list and the case screen; each skill adds its screens and actions.

## Gate

- [ ] `screens.json` `tabs` lists the eight tabs of `flow.json` in order with the same keys and labels.
- [ ] Every user-driven step this skill owns (its steps among F1 to F13, except F9a, F12 and F12b, which the payer starts) appears as an action with its `step` id, and every action's `label` is one of `flow.json` `next_actions` or the step's own button.
- [ ] `screens.json` holds the cases list, the case screen, and every screen this skill plans, each with a route (plus 7.13's in standalone mode).
- [ ] Every screen this skill plans has a `values` list and every value names a message element or is marked `typed` with a reason from the allowed list.
- [ ] Every decision-bearing value has an empty state of waiting.
- [ ] No `values` entry marks a rate, a payer name, a `preAuthRef` or a UTR as typed.
- [ ] Every action names its leg, its offered-when sub-stage and its resulting sub-stage.
- [ ] A JSON state address exists for a case.

## Common mistakes

- A status dropdown on the case. Status is derived; there is no dropdown.
- Showing `preAuthRef` from the pre-auth's own claim number. It comes from the ClaimResponse.
- Designing the desk's reply box for a `communication` payer on the leg. It belongs on the inbox item.
- Laying out only this skill's tab when it is the first to run the stage. The shell has all eight.
- Screens that need JavaScript. Forms post and the page re-renders; that is enough.
