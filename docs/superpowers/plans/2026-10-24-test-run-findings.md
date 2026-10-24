# Test run findings, 24 October 2026: what failed and the plan to fix it

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
| I4 | Send OTP bypasses the resend limit; Resend link silent | CRT_ABHA_106, VRFY_ABHA_405 | Design explains why resend locks a transaction, not NHA's rule: after 60 seconds, at most 2, then the limit message |
| I5 | OTP sent before the profile list on find by mobile | VRFY_ABHA_302, 304 | The scaffold calls search before OTP, but nothing says the screen must not send an OTP before a profile is chosen |
| I6 | Login methods hard coded instead of taken from the address search | VRFY_ABHA_102 | `authMethods` named once, as a field, never as a screen rule |
| I7 | ABHA number login offers no Aadhaar OTP | VRFY_ABHA_101 | The journey exists in the scaffold, but the build interview decides which journeys to build from deployment questions, so a journey NHA marks mandatory can be left out |
| I8 | No comparison screen when an ABHA is already linked | VRFY_ABHA_308 | Nothing |
| I9 | Creation stops when the Aadhaar already holds an ABHA | CRT_ABHA_112 | Nothing about `isNew: false` |
| I10 | Scan and share needs an operator to confirm each registration | 701, 702 | The scan and register skill has no design section and never says to register from the shared profile without data entry, to match on name, mobile, gender, ABHA number and address, or the queue rules of 702. Only the test skill says it |
| I11 | Masked mobile from the OTP response not shown | VRFY_ABHA_404 | Nothing |

Ten of the eleven have no rule in the build skills; the eleventh (I7) has the journey but no guarantee it is built. The pattern is structural:

- **The build skills describe the API, not the screen.** They are compiled from the specifications and journeys: which calls, in which order, with which headers. NHA's test cases are mostly screen requirements: what is editable, what message shows, when a button is enabled, what a returning patient sees. That knowledge lives only in the workbooks, which feed the test skill and the pages, never the build.
- **Scope is chosen by deployment, not by test.** The build interview asks yes or no questions about the deployment and builds the routes each yes adds. Nothing makes the journeys NHA's mandatory cases need non optional for the integrator's entity type.
- **The build ends before the test starts.** A journey is done when its calls succeed. Nothing walks the screens against the cases that will be run on them, so the first time the integrator meets NHA's requirements is the test run.
- **Failures do not flow back.** The test run finds the gap; nothing turns it into a rule in the build skill for the next integrator.
- **The same holds beyond M1.** M2, M3, M4 and the PHR modules are compiled the same way, so they carry the same gap.

## 3. The plan

### A. A run can only be the skill's run

1. A `/abdm-test <module>` command in the integrators plugin that loads that module's test section in full, runs the readiness check, and refuses to start without the workbook, the run folder and the setup check passing.
2. The case plan comes from the script, not the agent: `abdm_workbook.py plan <workbook> --entity private --run ui` prints every case with its outcome so far, applicability (Applicable To and marking), and what it needs (OTP, second mobile, mobile with no ABHA, device, PHR app). The run log is created from that list. The agent may not drop a case: a case it cannot run is `needs-human` with the need named, or NA with the rule that makes it so.
3. A coverage gate before the tester leaves: `abdm_workbook.py open` plus a "still needs the tester" list, read out while the person is present.
4. `/abdm-test-setup` runs first, every time, and installs nothing but says exactly what is missing.
5. The run folder is fixed: `abdm-ft/` holding the workbook copy, run log, manifest, evidence and report.

### B. Coverage rules in the skill

1. An existing ABHA is not a stop: on `isNew: false`, run 113 and 114 on the returned profile and 112 on the address step with the same `txnId`. State the address limit only once it has a source.
2. A test data plan in the readiness check, per module: which identities the mandatory cases need, which ones one Aadhaar holder covers, and the order that reuses outputs (the address created in 112 is the second address for 702 step 2).
3. Group applicability from the sheet decides NA, with the group named, as the report gate already does.
4. SHARE_PATIENT_PROFILE_701 and 702 are listed with what they need (the ABHA app, a counter QR, the bridge callback reaching the app), never left out.

### C. Judging rules

1. The Expected Result column decides PASS or FAIL. The Steps say what to do. The Suggestions for the Functional Tester column is guidance: a gap against it is an observation, never on its own a FAIL.
2. Multi step cases carry a result per step, shown in the report. The case is FAIL only when a step's expected result fails; when every run step passes but a step could not be run, the case is `needs-human` naming the step.
3. A third recorded result, **Conditional pass**, for an Expected Result met with a gap beside it (a recommended but not required behaviour, a tester suggestion not met). The condition goes in Remarks and the report lists every conditional pass with its condition.
4. Message wording: a message that means the same as the one the sheet quotes is a PASS. Decided 24 October 2026.

### D. The report

1. A summary table that answers the questions in this order, with each term defined under it:

   | | Count | This run, as recorded |
   |---|---|---|
   | Cases in NHA's sheet | n | 100 |
   | Applicable to this integrator | n | not computed by the run |
   | Tested | n | 23 |
   | Passed | n | 12 |
   | Conditional pass | n | none recorded; a new outcome |
   | Failed | n | 11 |
   | Blocked, waiting for a tester or device | n | not separated from not tested |
   | Not tested | n | 77, mixed with blocked and not applicable |
   | Not applicable (entity type, optional not offered) | n | not separated |

   Then the same counts for mandatory cases alone, and one line: ready for sandbox exit, or the number of mandatory cases still open. "No result" disappears.
2. Evidence only for cases that were tested. Untested and not applicable cases appear once, in a compact table.
3. Screenshots at a fixed size: two desktop or three phone screenshots per row, each a fixed height, with the full size images in the annexure bundle, not the PDF. No page may hold only an image and its caption.
4. The failures log lists only FAIL, blocked and conditional pass cases.
5. Plain wording: the fixed paragraphs cut to one line each or a table, one line findings, no sentence that restates a table. NHA reviews one sample before the wording is frozen.
6. The check enforces it: a page budget (M1 with every case tested under 40 pages), no page with fewer than four lines except the cover, and the counts table present and adding up.

### E. Privacy

1. The workbook writer masks Response and Remarks with the report's own `mask()`, so no ABHA number, ABHA address, mobile, Aadhaar or token reaches NHA's sheet.
2. The UI run hides identity fields before a screenshot, with a short script that blurs input fields and known identity text on the page, instead of blurring images afterwards.
3. A rule in the human entry section: the agent never repeats an Aadhaar number, mobile, ABHA number, ABHA address or name it reads from a page or a response, in chat, the run log, the remarks or a command. It refers to the tester's identity by its last four characters ("ABHA ending 8219") and never quotes another patient's data at all. Asking the tester to enter their own value names the field, never the value.

### F. The build skills build to the test

1. **One mapping from test case to build.** Each NHA case is mapped to the journey, the step and the screen it tests, from the sheet's APIs column and the journey files, with its marking per entity type. It lives in the Catalogue (`catalogue/hiecm/tests/<module>.yaml`), is generated where the APIs column decides it and reviewed by hand where it does not, and CI fails when a mandatory case maps to nothing.
2. **Screen requirements as design rules.** Each module's `design.md` gains a section, Screen requirements from NHA's test cases, grouped by screen (Aadhaar entry, OTP entry and resend, the profile and patient form, find by mobile, login by ABHA number and address, already linked, scan and share registration), each rule one line with the case ids it satisfies. The eleven findings above are the first rules. The rest come from walking every mandatory case's Expected Result.
3. **Every build step names its tests.** `scaffold.md` lists, under each journey step, "Tested by" with the case ids and their Expected Result in one line, and the step's exit condition includes the screen check, not only the call.
4. **Scope follows the mandatory cases.** The build interview asks the entity type first. Every journey a mandatory case needs for that entity type is built whatever the deployment answers; the yes or no questions add only the optional routes.
5. **The integration plan carries the coverage.** `INTEGRATION-PLAN.md` gains a table: each mandatory case, the screen or route that satisfies it, the file, and its state. The build cannot be called done while a mandatory row is empty.
6. **A pre-check before the test.** A `/abdm-precheck <module>` command walks the mandatory cases' Expected Results against the built screens and code, and lists every gap with its case id, so the integrator fixes them before the functional test, not during it.
7. **Scan and register gets its design.** A design section with the registration rules 701 and 702 test: register from the shared profile with no data entry, match on name, mobile, gender, ABHA number and address, update the address on an existing beneficiary, one queue entry per counter.
8. **Test failures feed the skills.** At the end of every run the test skill writes, beside the report, a findings file: each FAIL and conditional pass, its case id, and whether the build skills have a rule for it. A missing rule becomes a Catalogue issue against the design section, so the next integrator does not hit it. This run's eleven are the first batch.
9. **All modules, not only M1.** The mapping, design rules, interview scope and pre-check are built for M1 first, then M2, M3, M4 and P1 to P4 from their workbooks.

### G. Proving it

1. The SMART HMS run replayed against the new rules on paper: every case's outcome recomputed from its recorded observations. Expected, to be confirmed by the replay: 701 Conditional pass; 702 needs-human on step 2; 108 to 114 runnable with this holder; 301 to 308 NA for a private integrator.
2. The report rebuilt from that run's workbook under the new format, with its page count.
3. One full rerun on SMART HMS through `/abdm-test m1`, with the holder present and the test data plan prepared.

## 4. Decisions needed

1. The ABHA address limit per ABHA (you said 6): the source to cite.
2. Does an operator clicking to confirm a match, with no data entry, count as "automatically" registering, for 701 and 702?
3. Decided 24 October 2026: the outcome is named Conditional pass.
4. Decided 24 October 2026: same meaning is enough.

## 5. Order

| Step | Work | Done when |
|---|---|---|
| 1 | A and E: entry command, case plan script, coverage gate, writer masking | A run of the plan script on the SMART HMS workbook lists all 100 cases with applicability and needs; the writer check proves no identity reaches the sheet |
| 2 | B and C: coverage and judging rules, step results, Conditional pass | The SMART HMS replay recomputes every case under the new rules, and each change from the recorded outcome is explained |
| 3 | D: report summary, evidence filtering, image grid, wording, page checks | The SMART HMS report rebuilds under 40 pages with the counts table |
| 4 | F for M1: mapping, screen requirements, scaffold Tested by, interview scope, plan coverage table, pre-check, scan and register design, findings file | CI fails on an unmapped mandatory case; the eleven rules are in `design.md` with their case ids; `/abdm-precheck m1` run against SMART HMS lists the eleven gaps |
| 4b | F for M2, M3, M4, P1 to P4 | Every module's mandatory cases are mapped and every module's pre-check runs |
| 5 | G3: full rerun with the holder | The run log shows every mandatory case run, NA or needs-human with its need, and the report is final or a draft listing only what is truly open |
