# Stage 0: capability check

Purpose: before anything is planned, find out what the app already does. For this skill's own capabilities, for the foundation it stands on, and for what it needs from the use cases before it, write one verdict each with the evidence that decides it. The verdicts decide what the later stages reuse, extend, build or wait for. Nothing is built twice, and nothing is reused on faith.

## Inputs

- This skill's `SKILL.md`, section "Capability check": its own capabilities (what to look for, what makes each present), and its prerequisites with the check that proves each present. The skills that own the prerequisites do not need to be installed; their checks are in this skill's `SKILL.md`.
- `core/FOUNDATION.md`: the six foundation capabilities.
- `nhcx-build/capabilities.json` and `nhcx-build/0-capability.md`, if another NHCX skill already ran on this app.
- The target: the codebase (integrate), or the folder where the standalone app lives or will live.
- The pins and payer fixtures each check names, in `nhcx-package/`. If it is not beside `nhcx-build/`, fetch it now (`scripts/fetch-package.sh`); `references/material.md` names each pin's file.

## The verdicts

| Verdict | Means | What happens next |
| --- | --- | --- |
| `present` | Located, and its check was run and observed passing | Reuse. Stage 7 builds nothing for it. Stage 8 still runs its Validate rows; stage 9 still tests it. |
| `partial` | Located, but its check fails; or it covers some legs or branches and not others; or it was located and could not be run | Extend. Stage 7 builds the difference, in the existing code. |
| `absent` | Searched for as the skill says and not found | Build. Stage 7 builds it. |
| `unknown` | Could not be searched: no code is reachable | Planned as absent; stage 0 runs again when the code is reachable. |
| `not applicable` | The mode or the scope excludes it: 7.13 in integrate mode, a leg the user marked out | Nothing. |

For a prerequisite, a verdict of `absent` or `unknown` is a stop: see step 5.

Present is a claim about behaviour. Code that looks right is `partial` until its check has run.

## Do

### 1. Find the target

Integrate: the codebase root, its language and framework, enough to search and to run code offline (stage 3 does the full survey). Standalone: the app folder. If it is empty and no other NHCX skill has built anything there, every capability is `absent` and this stage is short. Write which in one line.

If `nhcx-build/capabilities.json` exists, read it. A verdict another skill recorded is a lead, not a result. If the code changed since its date (the version control log says), run its check again; otherwise carry it forward with its evidence and date.

### 2. Locate

For each capability in the three lists (own, foundation, prerequisites), search for the markers: NHCX paths such as `v1/preauth/submit`, resource names such as `CoverageEligibilityRequest`, workflow ids as strings, table and column names. `SKILL.md` lists them for its own capabilities; for a prerequisite, the marker is what its check names. Record every hit as `path:line`. A hit in a comment, a dead branch or a test fixture is not the capability; say so.

Look also for the same job done another way: a pre-auth sent to a TPA portal, an eligibility check recorded from a phone call, a payment keyed in from a bank statement. That is a host capability that stages 3 and 4 may link to. The NHCX capability is still `absent`.

### 3. Check

For every capability located, run the check `SKILL.md` names, offline:

- a builder: feed it the pin's own data and compare its output with the pin (canonical JSON, `created` excluded, and only the exclusions the module names);
- a reader: feed it the payer fixture and read the state it settles;
- a sender: call it with the 7.1 stub, or a stub of the app's own client, and read what it posted;
- the door: call the handler with an envelope;
- a screen: render it on a seeded state and read the text.

Use the app's own test runner where it can host the check, else a one-off script under `nhcx-build/0-capability/`. Nothing leaves the machine.

Where the existing code cannot be called without the network or a running service, record `partial` with `not run: <reason>`. Never `present`.

### 4. Decide

One verdict per capability, with where (the paths), how (the command), observed (the output, or the first lines of the diff), and the action: reuse, extend, build or wait. For `partial`, name the difference: which pin fails and at which element, which branch is missing (a PMJAY query answer on 19 but none on 131), which column is missing.

### 5. When a prerequisite is missing

A prerequisite is a capability another skill owns that this skill's legs cannot run without. `SKILL.md` lists them with their checks. If one is `absent` or `unknown`:

1. Stop and tell the user which capability is missing, which skill owns it, and what this skill cannot do without it.
2. Offer the two ways on: run the owning skill first (installing it if it is not beside this one; it is the default); or continue with this skill's offline work only (builders, readers and tests against seeded rows), with the live legs marked `later` in stage 1 and the dependency written in `NOTES.md`.
3. Never build another skill's capability inside this one. It would be built without that skill's checks.

A `partial` prerequisite does not stop the skill. Its gap goes into stage 2's risk table.

## Write

- `nhcx-build/capabilities.json` from `templates/capabilities.json`: one entry per capability, keyed by id, with `skill`, `module`, `verdict`, `located`, `how`, `observed`, `action`, `checked_by` and `date`. Update the entries this skill checked; leave the others.
- `nhcx-build/0-capability.md` from `templates/0-capability.md`: a section headed with this skill's name, holding the three tables (own, foundation, prerequisites) and the summary line.
- The scratch checks under `nhcx-build/0-capability/`, kept: stage 8 runs them again.
- This skill's block in `nhcx-build/STATE.md` (create the file from `templates/STATE.md` if it does not exist), with stage 0's row closed and its evidence.

## Gate

- [ ] Every capability in this skill's list, every foundation capability, and every prerequisite has a verdict.
- [ ] Every `present` names the command run and its observed output. None rests on reading alone.
- [ ] Every `partial` names the difference.
- [ ] Every `absent` names what was searched for, so a reader can repeat the search.
- [ ] A missing prerequisite was put to the user, and the answer is recorded.
- [ ] `capabilities.json` parses and holds this skill's entries.

## Common mistakes

- Marking a capability present because its endpoint name appears in the code. The pin decides.
- Rebuilding a working NHCX transport or callback door because this skill did not write it. An app that already seals, sends and receives NHCX messages keeps its own; the verdict says reuse.
- Proposing nhcx-adapter for an app that lacks a transport. The transport is then `own`; the adapter is used only when the user asks for it.
- Treating a legacy TPA workflow as the NHCX capability. It is a host capability; the NHCX one is absent.
- Checking against the live sandbox. Stage 0 is offline; the live rungs are stage 10's, and the user's.
- Carrying another skill's verdict forward after the code changed.
