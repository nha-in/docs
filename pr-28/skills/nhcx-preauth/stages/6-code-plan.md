# Stage 6: code plan

Purpose: turn the mapping, the screen plan and the capability verdicts into a list of modules with files, dependencies, the pin each is held to, and what this skill does to each. Stage 7 builds this list in order; stage 8 validates it in order.

The transport's shape, the configuration, the archive and the test placement (sections 2 to 5) are the episode's: the first skill to run this stage writes them, and later skills use them.

## Inputs

- `nhcx-build/3-discovery.md`, `nhcx-build/4-flow-data-mapping.md`, `mapping.json`, `nhcx-build/5-screen-plan.md`, `screens.json`
- This skill's section of `nhcx-build/0-capability.md` and `nhcx-build/2-planning.md` (the action per module)
- `stages/7-write-code/README.md` and every `7.N-*.md` this skill touches: the module ladder is fixed; the plan decides the files
- `references/fhir-knowledge.md` section 1: where the pins live
- `fhir/FHIR.md`: the builders and readers the modules 7.4 to 7.10 implement, so the plan names them

## Do

### 1. Place each module

For each module this skill touches (its `SKILL.md` lists them) and each foundation module it builds or extends, write:

| Field | Meaning |
| --- | --- |
| `skills` | A map from skill to action: `build`, `extend` or `reuse`. A module another skill already placed keeps its entry; add this skill and its action |
| `files` | The files it creates or changes, in the target's layout and naming (from stage 3). For a reused or extended module, the files that exist |
| `depends_on` | The modules that must exist first; the ladder's order is the floor, the plan may add more |
| `held_to` | The pin in `nhcx-package/fhir` (its file, from `references/material.md`), the payer fixture, or the rule (for modules with no bundle) |
| `copy_from` | What the module follows: its own Pseudo code section and the `fhir/FHIR.md` section it names |
| `tables` | The tables from `mapping.json` it reads and writes |
| `screens` | The screens from `screens.json` it serves (7.12 and 7.13 only) |

`modules.json` holds one entry per module, in ladder order (7.1 to 7.13), whichever skill adds it.

### 2. The transport's shape

Decide once, and every module uses it: the transport kind from stage 1, and the functions of the contract in `references/transport-knowledge.md` section 2: `send`, the receiving end that hands the door a normalised envelope, `policies`, `participants`, `token`, and `thread` and `fetch_missed` where the kind has them. Name them here so 7.4 to 7.10 call the same thing. A stub of `send`, recording the path, recipient, workflow id, correlation id and bundle and returning `{"txn_id", "correlation_id", "api_call_id"}`, is what stage 9 injects. When stage 0 found an existing transport, name its functions and what wraps them.

### 3. Configuration

List every setting and where it lives (from stage 3): the transport kind, participant code, facility HFR id and name, cases directory, per-payer overrides for workflow ids, and the transport's own. For `own`: the ABDM client id and secret, the private key, the sessions, NHCX and registry addresses, and the NHCX signing key once onboarding gives it. For `adapter`: its URL, API key and callback secret. For `existing`: whatever its client reads. Name the environment variables or config keys in the target's convention.

### 4. The archive

The per-case archive path from stage 4, and which module writes it (7.3 for inbound, 7.1 for outbound).

### 5. Test placement

Where the offline test lives (from stage 3's "how tests are run"), and how the pin comparison is wired: canonical JSON, `created` excluded, one comparison per pin.

## Write

- `nhcx-build/6-code-plan.md` from `templates/6-code-plan.md`: the episode sections once, the modules table, and this skill's section.
- `nhcx-build/modules.json` in the shape of `templates/modules.json`.

## Gate

- [ ] `modules.json` has an entry, in ladder order, for every module this skill touches and every foundation module (7.13 in standalone mode).
- [ ] Every entry this skill touches has non-empty `files`, `depends_on` (7.1 may be empty), `held_to` and `copy_from`, and this skill in `skills` with its action.
- [ ] Every pin this skill owns appears in some module's `held_to`.
- [ ] The transport kind and its functions are named.
- [ ] The configuration list includes the transport kind, the participant code, the cases directory, and every setting the chosen transport needs.
- [ ] The test file's location and the pin comparison rule are written.

## Common mistakes

- Splitting the claim bundle builder across modules by leg, or by skill. One builder, one `leg` and `flow` argument, is what the pins expect; `nhcx-claim` extends what `nhcx-preauth` built.
- Planning a second transport for the reply legs. Same function; the reply legs add `x-hcx-correlation_id` to the headers.
- Planning new files for a module stage 0 found present.
- Planning the screens before the readers exist in the dependency list.
