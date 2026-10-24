# Test run findings, 24 October 2026: what failed, and building each functionality as one loop that ends in its test

The M1 UI run on SMART HMS (Alphanova, private integrator) on 24 October 2026, session `cccdc3d7`, 11:04 to 11:55 UTC. Evidence: the session transcript, the filled workbook and the 107 page draft report it produced.

## 1. What actually happened

The run never used the test skill. It started in the docs repository, without the integrators plugin loaded, read a memory note that pointed at the merged branch `feat/sandbox-exit-testing`, read 60 to 80 lines of the skill and the UI run atom with `git show`, dumped the raw workbook and improvised the rest. So none of the skill's rules governed it: no case plan from the workbook, no run log or manifest in `abdm-ft/`, its own judgement on every case. The report was built with the real report script, copied from the atom, which is why the format held while the content did not.

Everything below follows from that, but each problem would also survive a run that did load the skill, because the skill has the same gaps.

## 2. Findings

### The run

| # | Finding | Evidence | Root cause |
|---|---|---|---|
| R1 | The skill was not loaded; the run improvised | Transcript 11:04 to 11:06: memory note, `git show feat/sandbox-exit-testing:...`, raw workbook dump | No single entry point that loads the test skill; a stale memory note pointed at a merged branch (corrected 24 Oct) |
| R2 | SHARE_PATIENT_PROFILE_701 and 702 were left out, then run only when you asked | 11:46: "I wrongly left them out of the mandatory set when I planned" | The case list is chosen by the agent, not produced by the workbook script, so a mandatory case can be dropped |
| R3 | Creation cases 108, 109, 112, 113 and 114 not run because the Aadhaar already had an ABHA | Workbook remarks: "Not run: the holder's Aadhaar already has an ABHA" | The skill never says an existing ABHA is not a stop. The M1 specification's `enrol/byAadhaar` answers an existing account with `200`, "This account already exist", a `txnId`, user `tokens`, the full `ABHAProfile` and `isNew: false`, so the profile, the card and the address step are all reachable. You report up to 6 ABHA addresses per ABHA; that limit is not in the specification and needs a source before the skill states it |
| R4 | CRT_ABHA_301 to 308 recorded "Not run: needs the holder" | Workbook remarks | Those cases sit in a group marked Applicable To: Government. For a private integrator they are not applicable, and must say so, not ask for a person |
| R5 | VRFY_ABHA_202, 402 not run though the holder was present | Workbook remarks | No coverage check before the tester leaves: nothing lists the mandatory cases still open while the person is in the room |
| R6 | Test data needs were discovered mid-run | 108, 109, 303, 403 waiting on "an Aadhaar with no ABHA", "a second mobile", "a mobile with no ABHA" | The skill has no test data plan up front, and does not use one case's output for another (a new address from 112 is the second address 702 step 2 needs) |
| R7 | Python, openpyxl and reportlab were missing and patched by hand | 11:05 to 11:06 venv attempts; 11:41 `reportlab<5` | The setup check was never run |
| R8 | The workbook carries an unmasked ABHA number and ABHA address in Remarks | "verify returned code ABHA_ALREADY_EXISTS, 91-...", "sam.dennis@sbx" | The writer writes remarks as given; only the report masks |
| R9 | Screenshots were blurred with ad hoc scripts after the fact | `blur.py`, `blur2.py` in the run's folder | No rule or helper to hide identity fields before the screenshot is taken |
| R10 | The agent typed the holder's ABHA address into the app itself | 11:25:36, "Types the holder's ABHA address" | The skill was not loaded; its first rule forbids this. A run through the skill would have stopped and asked |
| R11 | The agent repeated ABHA numbers and an ABHA address back to the tester in chat, including another patient's name and ABHA number from the app's patient list | 4 ABHA numbers and 1 ABHA address in its messages; 11:19:56 names the patient on UHID 0018 with his ABHA number | A gap in the skill as written: its rules cover the run log, evidence and workbook, not what the agent says. Reading a page or a network response puts the value in front of the agent; nothing tells it not to repeat it. No full Aadhaar number appears anywhere in the transcript |

### Judging

| # | Finding | Evidence | Root cause |
|---|---|---|---|
| J1 | 701 marked FAIL although its Expected Result was observed | Sheet Expected Result: "The patient receives a token valid for 60 minutes, which successfully shares their details with the HIP". Observed: token #1 issued, profile shared, "ABDM: sent" | FAIL was decided on the sheet's Suggestions for the Functional Tester column ("should automatically save ... without requiring any manual data entry"), and even that was met: the run itself notes "No data entry is needed, but it isn't automatic" |
| J2 | 702 marked FAIL with steps 3 and 4 passing and step 2 not run | 11:55 summary table | A multi step case collapses to one status; no step results, and no outcome for "some steps not run" |
| J3 | Small gaps beside a met Expected Result read as failures or vanish | CRT_ABHA_104 PASS with "wording differs"; 404 PASS with "masked mobile not shown" | No outcome between PASS and FAIL for "met, with an observation", and no rule on wording that differs but means the same |

### The report

| # | Finding | Evidence | Root cause |
|---|---|---|---|
| P1 | 107 pages, 79 of them evidence, for 23 tested cases and 35 screenshots; 20 pages hold one image and a caption | Page analysis of `draft-report-m1-smarthms.pdf` | Every screenshot is drawn at page width; evidence, scope and the failures log list all 100 cases, including 77 nobody ran |
| P2 | The summary does not say plainly how many were tested, passed and failed | Your review | "No result" mixes three things: not applicable, not tested, and blocked waiting for a person or device |
| P3 | NHA finds the wording verbose | NHA's review | Fixed paragraphs (approach, scope, methodology) and long generated sentences where a table or one line would do |

### The integration skills

SMART HMS was built almost entirely with the skills, so its failures are a measure of the build skills. Each one checked against what the M1 build sections (`SKILL.md`, `scaffold.md`, `integrate.md`, `design.md`) and the scan and register skill say today:

| # | What failed in SMART HMS | Case | What the build skills say |
|---|---|---|---|
| I1 | Name, gender and date of birth stay editable after an ABHA fill | VRFY_ABHA_101, 102, 306 | Nothing |
| I2 | A wrong OTP drops the transaction; the right OTP then fails | VRFY_ABHA_201 | Nothing about keeping `txnId` across a retry |
| I3 | ABDM's error message replaced by the app's own text | CRT_ABHA_107 | "Display the text verbatim" is said of the consent text only, never of an error |
| I4 | Resend link silent; resend limit not shown | CRT_ABHA_106, VRFY_ABHA_405 | Design explains why resend locks a transaction, not NHA's rule: after 60 seconds, at most 2, then the limit message. Only the Resend control counts toward the limit; a second press of Send OTP is not a resend (user, 24 October 2026) |
| I5 | OTP sent before the profile list on find by mobile | VRFY_ABHA_302, 304 | The scaffold calls search before OTP, but nothing says the screen must not send an OTP before a profile is chosen |
| I6 | Login methods hard coded instead of taken from the address search | VRFY_ABHA_102 | `authMethods` named once, as a field, never as a screen rule |
| I7 | ABHA number login offers no Aadhaar OTP | VRFY_ABHA_101 | The journey exists in the scaffold, but the build interview decides which journeys to build from deployment questions, so a journey NHA marks mandatory can be left out |
| I8 | No comparison screen when an ABHA is already linked | VRFY_ABHA_308 | Nothing |
| I9 | Creation stops when the Aadhaar already holds an ABHA | CRT_ABHA_112 | Nothing about `isNew: false` |
| I10 | Scan and share needs an operator to confirm each registration | 701, 702 | The scan and register skill has no design section and never says to register from the shared profile without data entry, to match on name, mobile, gender, ABHA number and address, or the queue rules of 702. Only the test skill says it |
| I11 | Masked mobile from the OTP response not shown | VRFY_ABHA_404 | Nothing |
| I12 | The consent screen is not NHA's published consent, and has no language choice | CRT_ABHA_102 (mandatory), 103, 203, 303, 103_FA (optional) | `design.md` gives one paragraph ("I, hereby declare that I am voluntarily sharing my Aadhaar number ... with National Health Authority (NHA) for the sole purpose of creation of ABHA number") and says other languages are optional. NHA's approved consent (sandbox site, Milestone 1, Creation of ABHA Number, Consent Language, image `Consent_Language_ABDM_1_25c394153b.png`) is five declarations with a checkbox each: Aadhaar based authentication; creation with a document other than Aadhaar, left unchecked in an Aadhaar flow; linking past records; sharing for this encounter; anonymised public health use. Then a confirmation by the healthcare worker, named from the logged in user, and by the beneficiary, named dynamically. Private entities remove the word "government". Facilities are advised to show it on a patient facing screen and in the local language. NHA publishes no translations there, so the skill cannot supply them: it requires a language choice that uses the facility's approved translation |

Ten of the eleven have no rule in the build skills; the eleventh (I7) has the journey but no guarantee it is built. I12, found after the run, is worse than a missing rule: the skill teaches the wrong consent text for a mandatory case. The pattern is structural:

- **The build skills describe the API, not the screen.** They are compiled from the specifications and journeys: which calls, in which order, with which headers. NHA's test cases are mostly screen requirements: what is editable, what message shows, when a button is enabled, what a returning patient sees. That knowledge lives only in the workbooks, which feed the test skill and the pages, never the build.
- **Scope is chosen by deployment, not by test.** The build interview asks yes or no questions about the deployment and builds the routes each yes adds. Nothing makes the journeys NHA's mandatory cases need non optional for the integrator's entity type.
- **The build ends before the test starts.** A journey is done when its calls succeed. Nothing walks the screens against the cases that will be run on them, so the first time the integrator meets NHA's requirements is the test run.
- **Failures do not flow back.** The test run finds the gap; nothing turns it into a rule in the build skill for the next integrator.
- **The same holds beyond M1.** M2, M3, M4 and the PHR modules are compiled the same way, so they carry the same gap.

## 3. The plan

### 3.1 The model: one functionality, one loop, ending in its own test

The unit of work changes from the job (scaffold, design, integrate, debug, test, each a separate reference file read on its own) to the **functionality**: one thing a person does in the integrator's product, such as "Create ABHA by Aadhaar OTP", "Find ABHA by mobile", "Log in by ABHA number" or "Scan and share at a counter". NHA's sheets already group their cases this way, and the groups line up with the journeys under `catalogue/openapi/hiecm/v3/journeys/`.

For each functionality the agent runs one loop, in one place, with everything it needs loaded at once:

| Phase | What happens | Exit |
|---|---|---|
| Design | The screen requirements this functionality's NHA cases impose, and how they land in the integrator's product | Each mandatory case's Expected Result is mapped to a screen or route in `INTEGRATION-PLAN.md` |
| Scaffold | The calls, in order, with the exact bodies | Each call's exit condition observed against the sandbox |
| Integrate | Into the integrator's codebase, on their screens | The functionality works end to end on the integrator's screen |
| Debug | A failing call or screen to a named fix | The original step succeeds |
| Test | This functionality's NHA cases, as a `ui` run, the tester entering every identity | Each case PASS, Conditional pass, FAIL, needs-human or NA, recorded in the workbook |
| Record | The workbook row per case, the draft report rebuilt, the tracker updated | The draft report shows this functionality's results |

A FAIL sends the loop back to design or integrate for this functionality only. The loop ends when every mandatory case of the functionality, for the integrator's entity type, is PASS or Conditional pass, or is needs-human with the need named. Loop limit: 3 passes through test per functionality, then an escalation naming the case, what was observed and one question.

An integration that already exists, such as SMART HMS, enters each loop at Test and goes back to Design or Integrate only where a case fails.

### 3.2 The mapping from NHA case to functionality

1. One file per module, `catalogue/hiecm/tests/<module>.yaml`: every NHA case id, its functionality, the journey and steps it exercises, the screen it is judged on, and what it needs from the tester (Aadhaar holder, OTP, second mobile, mobile with no ABHA, second ABHA address, device, PHR app, counter QR).
2. Generated where the sheet's APIs column and the journey files decide it; reviewed by hand where they do not, with the reason recorded beside the entry.
3. CI fails when a case in the shipped workbook has no functionality or is mapped twice, a journey or operation does not exist, a need is outside the allowed list, or a functionality has no journey and none of its cases is screen only with a reason. A mandatory case may be screen only (TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER calls no ABDM API) when its reason says so.
4. The marking per entity type is not copied into the mapping. It is read from the shipped workbook (the Mandatory/Optional column and the group's Applicable To) by `abdm_report.py plan`, so the two cannot drift.

### 3.3 The skill is built per functionality

Each module skill is rebuilt by `scripts/build-skills.mjs` around its functionalities, from the same sources as today (specifications, journeys, atoms, the workbook and the mapping):

| File | Holds | Loaded |
|---|---|---|
| `SKILL.md` | The router: the functionalities in build order, each with its mandatory cases for each entity type, and the two commands | First |
| `references/functionalities/<id>.md` | Everything one loop needs: its NHA cases (id, marking, Steps, Expected Result), the screen requirements (the design rules, each citing its cases), the calls in order (scaffold), the integrate notes, the error codes its calls return (debug), and how its cases are run | One per loop |
| `references/run.md` | The rules every run follows: the human entry rule, identity never repeated, the UI run, the judging rules, the workbook writer, the report | Once per session |
| `references/errors.md` | Every error code in the module, for a lookup from any code | On a code not in the functionality file |
| `workbook/` | NHA's workbook for the module | Copied into `abdm-ft/` at the start |

The five job files (`scaffold.md`, `design.md`, `integrate.md`, `debug.md`, `test.md`) are replaced, not kept beside the new ones, so no rule lives in two places. The design rules that are not about one functionality (the codebase survey, practices that hold across calls) go in `run.md` or a short `references/foundations.md`.

The eleven findings in section 2 are the first screen requirements, each in the functionality file it belongs to and citing its case ids. The rest come from walking every mandatory case's Expected Result. Scan and register gets the same treatment: its functionality file carries the registration rules 701 and 702 test.

### 3.4 Scope follows the mandatory cases

The first question of a build is the entity type. Every functionality that holds a mandatory case for that entity type is in scope, whatever the deployment answers. The deployment questions add only optional functionalities. A government only group (CRT_ABHA_301 to 309) is out of scope for a private integrator and is recorded NA with its group named.

### 3.5 The running record

1. `abdm-ft/` holds NHA's workbook, the run log, the manifest, the evidence and the draft report, and is updated after every functionality's test, so the draft always shows where the integration stands.
2. `INTEGRATION-PLAN.md` is the tracker: one row per functionality with its mandatory cases, the screen or route that satisfies each, the state (not started, building, built and waiting for the tester, passed, failing), the date and the build it was tested on.
3. **The tester.** A functionality whose test needs a person can be marked built and waiting for the tester, and its cases batched into one session with the tester present. Batching is the default; testing each functionality as it is built is allowed when the tester is on call.
4. **The final run.** Results gathered while building come from different builds on different days. The report to submit is built only from a full run of every mandatory case on one final build, through `/abdm-test <module>`, which reuses everything above. The draft carries results from the loops; the final report carries only the final run's.

### 3.6 Commands

| Command | Does |
|---|---|
| `/abdm-build <module>` | Starts or resumes the loop: reads the tracker, picks the next functionality, runs it |
| `/abdm-test <module>` | The full final run: readiness, the case plan from the script, every mandatory case, the final report or the draft |
| `/abdm-test-setup` | Kept: checks Python, the libraries, the browser, the emulator; installs nothing |

Both `/abdm-build` and `/abdm-test` load the module skill and `run.md` before anything else and refuse to start without the workbook in `abdm-ft/` and the setup check passing, so a run cannot be improvised from a branch or a raw workbook again.

### 3.7 The case plan comes from the script

`abdm_workbook.py plan <workbook> --entity <type> --run ui` prints every case with its functionality, applicability, marking, outcome so far and what it needs from the tester. The run log is created from it, so no case can be dropped: a case that cannot run is needs-human with the need named, or NA with the rule. Before the tester leaves, `abdm_workbook.py open` lists every case still waiting for them.

### 3.8 Coverage rules

NHA's observations on the run (24 October 2026, "Observations UI Test case run") add two rules, folded in below: say upfront that the full creation journey needs a fresh Aadhaar, and how to free one; and ask for every missing input before a case is ever left untested.

1. **A fresh Aadhaar, said upfront.** The readiness check tells the tester before the run that the full ABHA creation journey needs an Aadhaar with no ABHA, and that an existing ABHA can be deleted on the ABHA sandbox portal (https://abhasbx.abdm.gov.in/abha/v3) to free it, as NHA recommends. If the tester keeps the existing ABHA, an existing ABHA is still not a stop: on `isNew: false` the profile (113), the card (114) and the address step (112, with the same `txnId`) run on that response, and only the cases that need a new ABHA wait for a fresh Aadhaar. More than one ABHA address can be created for the same ABHA number; the skill states no limit.
2. **Ask before not tested.** Every input a case needs (from the mapping's `needs`) is asked for in the readiness check, and asked again when the run reaches the case. A case is recorded needs-human only after the tester has said they cannot provide it at this run, and Remarks name what was asked and when.
3. The test data plan is part of readiness: the identities the mandatory cases need, which one Aadhaar holder covers, and the order that reuses outputs (the address created in 112 is the second address for 702 step 2).
4. SHARE_PATIENT_PROFILE_701 and 702 are always planned, with what they need: the ABHA app, a counter QR, the bridge callback reaching the product.

### 3.9 Judging rules

1. The Expected Result column decides. The Steps say what to do. The Suggestions for the Functional Tester column is guidance: a gap against it makes a Conditional pass, never on its own a FAIL.
2. Multi step cases record a result per step, shown in the report. The case is FAIL only when a step's expected result fails; when the run steps pass and a step could not be run, the case is needs-human naming the step.
3. **Conditional pass**: the Expected Result is met with a gap beside it. The condition goes in Remarks, and the report lists every conditional pass with its condition.
4. A message that means the same as the one the sheet quotes is a PASS.

### 3.10 The report

1. The summary answers, in order, with each term defined under the table: cases in NHA's sheet; applicable to this integrator; tested; passed; conditional pass; failed; blocked, waiting for a tester or device; not tested; not applicable. The same counts for mandatory cases alone, then one line: ready for sandbox exit, or the number of mandatory cases still open. "No result" is gone.
2. Results grouped by functionality, which is also how the integration was built.
3. Evidence only for cases that were tested; untested and not applicable cases appear once, in a compact table.
4. Screenshots are shown large enough to read, embedded at their full resolution: a desktop screenshot takes the full text width, phone screenshots sit side by side at a readable height. A case's heading and result line stay with its first screenshot. Decided 24 October 2026: readable screenshots matter more than page count.
5. The failures log lists only FAIL, blocked and conditional pass cases.
6. Plain wording: the fixed paragraphs become one line or a table, one line findings, no sentence that restates a table. One sample goes to NHA before the wording is frozen.
7. The check enforces it: screenshots embedded at full resolution and printed at a readable size, no heading left alone at a page foot, the counts table present and adding up. There is no page limit.

### 3.11 Privacy

1. The workbook writer masks Response and Remarks with the report's `mask()`.
2. Identity fields are hidden on the page before a screenshot, by a short script in `run.md`, instead of blurring images afterwards.
3. The human entry rule gains: never repeat an Aadhaar number, mobile, ABHA number, ABHA address or name read from a page or a response, in chat, the run log, Remarks or a command. Refer to the tester's identity by its last four characters, never quote another patient's data, and when asking the tester to enter a value, name the field, never the value.

### 3.12 Failures feed the skills

At the end of every loop and every run, a findings file beside the report lists each FAIL and Conditional pass, its case, and whether the functionality file has a screen requirement for it. A missing requirement becomes a Catalogue issue against that functionality, so the next integrator does not hit it.

## 4. Decisions

Settled on 24 October 2026:

| Question | Decision |
|---|---|
| The third outcome | Named Conditional pass |
| Message wording | Same meaning is enough |
| Shape of the work | One loop per functionality, from design to test, with a running workbook and draft report |
| The report to submit | Only from a full run on one final build |
| The tester | Batched by default; per loop when on call |
| ABHA addresses | A person can create more than one ABHA address for the same ABHA number. The skill states no number |
| Registration from scan and share (701, 702) | A new patient registers automatically from the shared profile, with no click, and gets a token. A returning patient is matched on name, mobile, gender, ABHA number and ABHA address; a certain match registers automatically, an uncertain one may take one confirmation, never any typing. Agreed by the user on 24 October 2026 |

## 5. Order

Each step is its own branch and pull request, ends with the `adversarial-reviewer` agent, and keeps every existing check green.

| Step | Work | Done when |
|---|---|---|
| 1 | Run rules that do not wait for the restructure: writer masking, identity never repeated, judging rules and Conditional pass in the writer and report, existing ABHA rule, coverage gate and `plan` subcommand | The writer check proves no identity reaches the sheet; `plan` lists all 100 M1 cases with applicability and needs; the report gate and counts handle Conditional pass |
| 2 | The report: summary counts, grouping by functionality, evidence filtering, image grid, page checks, plain wording | The SMART HMS workbook rebuilds with the counts table and readable full resolution screenshots; the check enforces the layout rules |
| 3 | The M1 mapping, `catalogue/hiecm/tests/m1.yaml`, and its CI check | Every M1 case maps to a functionality; CI fails on an unmapped case |
| 4 | The per functionality M1 skill: `build-skills.mjs` writes `SKILL.md`, `functionalities/`, `run.md`, `errors.md`; the five job files go; the eleven screen requirements land in their functionality files | `validate:skills` passes; each M1 functionality file holds its cases, screen requirements, calls and errors; no rule appears in two files |
| 5 | `/abdm-build` and `/abdm-test`, the tracker in `INTEGRATION-PLAN.md`, entity type first scope, findings file | A dry run on SMART HMS's recorded results places each functionality in the tracker, lists its failing cases and the screen requirement each lacks |
| 6 | The same for M2, M3, M4 and P1 to P4 | Every module's cases are mapped and every module skill is built per functionality |
| 7 | A full run on SMART HMS through `/abdm-test m1`, the holder present, the test data plan prepared | Every mandatory case is run, NA or needs-human with its need; the report is final, or a draft listing only what is truly open |

## 6. Proving it

1. The SMART HMS run replayed under the new rules on paper: every case's outcome recomputed from its recorded observations, each change explained. Expected, to be confirmed: 701 Conditional pass; 702 needs-human on step 2; 108 to 114 runnable with this holder; 301 to 308 NA.
2. The report rebuilt from that workbook in the new format, with its page count.
3. A first day check of the new skill: a fresh session given only the plugin and a functionality name builds and tests that functionality on a sample app without reading anything outside the skill folder.
