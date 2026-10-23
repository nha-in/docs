# Sandbox exit testing: test skills that fill NHA's workbook and write the report

Plan, 23 October 2026. Branch `feat/sandbox-exit-testing`.

## 1. What NHA asked for, 22 October 2026

- A skill that reads NHA's functional test case workbook and runs the cases as UI tests against the integrator's application.
- Results appended to the same sheet: status, the reason for a failure, the error code or unhandled exception (for example `NullPointerException`), and how many iterations each failure took.
- Once every mandatory case passes, a report skill that produces a final test report in the format of the sample reports from the empanelled agencies (Nangia, Avasure, Code Decode).

## 2. What main already has

| Piece | Where | What it does |
|---|---|---|
| Test case pages under Developer resources | `site/docs/hiecm/v3/resources/test-cases/` | One page per module, generated from NHA's sheets by `scripts/build-test-cases.py`, every case id an anchor |
| NHA's sheets | `catalogue/hiecm/openapi/.raw/nha-*-tests/` | Stored with a `MANIFEST.md` each |
| A test section per milestone | `skills-src/hiecm-<m1..m4,p1..p4>-test/SKILL.md`, folded into each module skill's `references/test.md` | Walks each case as a loop of at most 3 passes against the integrator's system and the sandbox. Four outcomes (`passed`, `failed`, `needs-human`, `not-run`), three kinds of evidence (`sandbox`, `screen`, `human`). Stops in the terminal for every OTP and approval. Logs to `abdm-ft/<module>-<time>.md`, resumes from the log, and writes a manifest of case ids to REQUEST-IDs |

What this branch adds (phase 0): NHA's revised M1, M2 and M3 sheets of 21 October 2026 under `.raw/nha-2026-10-22-m{1,2,3}-tests/`, the three pages regenerated from them, and the overview's case counts. The PHR sheet NHA sent is byte-identical to the one on main. The HFR and HPR sheets in the same zip are 2024 copies older than main's, so M4 stays on main's set.

## 3. The gap

| NHA's ask | Today | Missing |
|---|---|---|
| Read the Excel | Cases are written into each skill | Reading the user's workbook as the list to run |
| UI testing | `screen` cases are attested by the person (`passed? y/n`) | An agent that drives the application's screens |
| Append results to the sheet | Run log and manifest in `abdm-ft/` | Write-back into the workbook's own columns |
| Failure reason, error code, exception | Pasted response in the run record | The reason in the Remarks column, and the server log for exceptions that never reach the screen |
| Iterations per failure | Loop limit 3, passes in the run record | The count in the Iterations column |
| Final report | Manifest | A report sub-skill in the agencies' format, with screenshots |
| Current cases | Skills walk the September and early October sets | The M1, M2 and M3 skill sections updated to the 21 October sets |

## 4. Decisions

1. **One test skill per module, as today.** It stays the `test` section of each module skill. It refers to two shared sub-skills: run the workbook, and write the report.
2. **The user picks the run type.**
   - `ft`, API functional tests: what the test sections do today, the integrator's system driven against the sandbox and judged on calls and callbacks. No browser.
   - `ui`, UI tests: an agent drives the application's screens with Playwright, and a PHR app on an emulator with Maestro.
   - `all`: `ft` then `ui`, so a backend fault shows before the slow run starts.
   A case that has no meaning in a run type is recorded NA with the reason, such as a "Create ABHA option is visible" case in an `ft` run.
3. **Playwright ships with the plugin.** The integrators plugin declares the Playwright MCP server, and a `/abdm-test-setup` command installs Chromium and checks for an emulator and Maestro. Skill-only and MCP users get the same checks in the test section's opening block, which stops and prints the install commands. Setup asks the run type first and installs only what it needs.
4. **OTP steps pause and ask**, as the test sections already do, in both run types.
5. **An EMR or HMIS does not test the PHR app.** For M2 and M3 cases that pass through the PHR app, the integrator proves only that the consent was granted or the record is visible there, with one PHR screenshot per case, and the agent checks the application side.
6. **PHR cases get ids in the HMIS style** (section 7). The PHR app tester is asked to install the emulator the agent needs.
7. **The report follows one structure drawn from the agencies' reports** (section 8), with screenshots.

## 5. Sub-skill: run the workbook

1. **Set up.** Run type, workbook path, application URL (`ui`), client credentials and callback URL (`ft`), role (HIP, HIU, PHR app), entity type (government or private, which settles the conditional markings). Credentials come from the environment or a hidden prompt, as today, and never reach the workbook or the report.
2. **Read the workbook.** Find the header row by its text, carry groups down to each case, join merged step rows, the same rules `scripts/build-test-cases.py` already applies, moved into one shared reader both use. Show the plan: cases to run, NA in this run type, mandatory count, OTP steps, PHR proof steps. Wait for a go.
3. **Run each case**, as the loops already do, with `ui` adding a Playwright pass: a screenshot per step, a trace and a video.
4. **On a failure, find the reason.** `ft`: the HTTP status, the ABDM error code and message, or a missing callback. `ui`: the on-screen error, failed network responses (where ABDM codes appear), browser console errors, then one replay of the case's `ft` calls. Both: the integrator's server log for the case's window, if the user gave a command for it, which is the only place a backend `NullPointerException` usually shows.
5. **Write back after every case**, with a backup taken before the first write. Formatting and merged cells are kept.

| Outcome | Status column | Remarks |
|---|---|---|
| `passed` | PASS | What matched |
| `failed` | FAIL | Reason, error code or exception |
| `needs-human` | blank | "Needs tester: OTP" and what was left |
| `not-run` | NA | Why: entity type, optional capability, no published operation, or run type |

   - `ui` results go in NHA's columns: Response of Request with Code, Status(PASS/FAIL), Iterations, Remarks, and the header block (Application name, Test Executed by, Test Execution date). Where a sheet lacks a column (HFR and HPR have Status and Remarks only, PHR has none) it is appended.
   - `ft` results go in four appended columns, FT Status, FT Response with Code, FT Iterations, FT Remarks, so neither run type overwrites the other.
   - Iterations is the number of loop passes the case took, whether it ended PASS or FAIL.
6. **Resume** from the workbook: a rerun of a run type runs only the cases not PASS in that type's column. The `abdm-ft/` run log and manifest stay as they are.

## 6. Install

| User | Gets |
|---|---|
| Plugin, Claude Code | Playwright MCP declared beside abdm-docs in the plugin's `.mcp.json`, which the Codex manifest points at. `/abdm-test-setup` |
| Plugin, Codex and other Agent Plugins 1.0 hosts | The same, if the host reads an MCP declaration from the manifest. To confirm per host; otherwise the skill-only path |
| Skill or Docs MCP only | The opening block of `references/test.md` checks Node, Playwright and Chromium for `ui`, an emulator and Maestro for a PHR app, and prints what to install |

Playwright and Maestro are Apache 2.0; the workbook and report libraries are MIT. No Eka service and no paid service.

## 7. PHR case ids

Main names PHR cases by milestone and row, such as `P1 1.1`, because the sheet carries no ids. NHA's HMIS sheets use a prefix, a flow and a three digit number. Proposed, written into an inserted Test Case ID column and kept beside the current name so existing links hold:

| PHR tab or group | Prefix | Range |
|---|---|---|
| ABHA address creation | `PHR_ADDR_` | 101 to 163 |
| Facility records linking | `PHR_LINK_` | 201 to 212 |
| Health programme records linking | `PHR_PROG_` | 221 to 232 |
| HIP initiated linking | `PHR_HIPLINK_` | 241 |
| Sharing with consent to an HIU | `PHR_SHARE_` | 301 to 316 |
| Scan QR code | `PHR_QR_` | 401 to 406 |
| Profile, ABHA card, tabs | `PHR_PROFILE_`, `PHR_CARD_`, `PHR_TABS_` | 421, 431, 441 to 447 |
| Subscriptions and auto approval | `PHR_SUBS_` | 501 to 524 |
| HIU service for PHR | `PHR_HIU_` | 601 to 620 |
| Locker | `PHR_LOCKER_` | 701 to 755 |

The ranges were counted from a quick extraction of 218 PHR rows, while main's page counts 200 cases, so phase 6 reconciles the two before any id is fixed. The table goes to NHA to adopt into the sheet.

## 8. Sub-skill: the report

- **Gate.** Runs only when every mandatory case applicable to the run type is PASS, otherwise lists the cases in the way.
- **Type.** A `ui` report is the exit report NHA asked for. An `ft` report has the same structure with request and response excerpts in place of screenshots. Whether NHA accepts an `ft` report alone is question 9.
- **Structure**, the common ground of the nine sample reports:
  1. Cover: product, milestone, report type, release date
  2. Document control: document id (`FT-M1` and on), version, prepared, reviewed, approved, change history, distribution
  3. Executive summary
  4. ABDM table: entity, product, milestone, API version, test dates and days, executed by
  5. Scope: applications and URLs tested, role, entity type
  6. Test environment and tools: browser and version, Playwright, PHR app and version, emulator, model
  7. Approach: agent run, iteration rule, human steps, PHR proof rule
  8. Test data: ABHA numbers and addresses used, records per HI type, masked
  9. Results summary: one row per case, id, title, marking, status, iterations
  10. Evidence: one section per case, a one line finding and its screenshots
  11. Failures and iterations log, including cases that later passed
  12. Conclusion
  13. Annexures: recordings, the completed workbook
- The model writes only the findings and the executive summary; every table comes from the workbook and the run log. DOCX and PDF. No credential appears, and Aadhaar numbers are masked in text and blurred in screenshots. The sample reports print the integrator's login in plain text; this one does not.

## 9. Phases

| Phase | Work | Done when |
|---|---|---|
| 0 | NHA's 21 October M1, M2, M3 sheets stored, pages regenerated, this plan | `build-test-cases.py --check` current, site builds. This branch |
| 1 | M1, M2, M3 test sections updated to the 21 October sets | Every case id on the pages has a loop in its skill section, `validate:skills` passes |
| 2 | Shared workbook reader and writer, used by the page generator and the runner | A read then write of each sheet changes only result cells, tested in CI |
| 3 | Run type `ft` writes back: today's loops fill the FT columns | One M1 `ft` run fills its workbook |
| 4 | Run type `ui` and its install path | One M1 `ui` run fills NHA's columns, with screenshots, on a clean machine |
| 5 | Report sub-skill | Both report types for the M1 runs follow section 8 |
| 6 | M2, M3 (PHR proof), M4, then PHR ids and the emulator for P1 to P4 | Each workbook filled once |

Each phase ends with the `adversarial-reviewer` agent before it ships.

Status, 23 October 2026: every phase is built on this branch, and none has yet run against an integrator's system.

- Phases 0 and 1: NHA's 21 October M1 to M3 sheets, their pages, and the test sections that walk them.
- Phases 2 and 3: `shared.concept.test-workbook-write-back`, the writer every test section folds in, checked against all six sheets by `scripts/check-workbook-writeback.py`. The page generator still reads the sheets its own way; the check holds the two to the same case ids.
- Phase 4: `shared.concept.test-ui-run`, Playwright in the plugin's `.mcp.json`, `/abdm-test-setup`, and the run type question in every test section.
- Phase 5: `shared.concept.test-report`, checked by `scripts/check-test-report.py`. PDF needs LibreOffice on the machine; without it the DOCX is exported by hand.
- Phase 6: PHR cases carry `PHR_ADDR_`, `PHR_APP_`, `PHR_HIU_` and `PHR_LOCKER_` ids, the writer fills the PHR workbook, and the PHR proof rule is in the UI run section.
- CI installs openpyxl, Pillow and python-docx and runs both checks.

Not done: a real `ft` and `ui` run of M1 against a sandbox-connected system, which needs that system and a person with an Aadhaar linked mobile; and NHA's answers to section 10.

## 10. Questions for NHA

1. Which sample report is the reference format, and does a named auditor still fill Prepared, Reviewed and Approved?
2. Iterations: passes within one run, or test cycles across fixes?
3. Can integrators be required to give the runner their server log, for exceptions that never reach the screen?
4. Can the sandbox issue test Aadhaar and mobile numbers with fixed OTPs, so a run needs no person?
5. The 21 October M2 sheet drops `HIP_INTI_LINK_201` to `503`, which the Nangia M2 report still tests. Is the new sheet the one that counts?
6. M3 `HIU_FLOW_107` to `114` have no Functionality title, only the HI type in the Test Case column. Can the sheet give them titles?
7. Will NHA adopt the PHR ids in section 7?
8. Are recordings mandatory, and where are they hosted?
9. Is an `ft` report accepted for exit on its own, or only with the `ui` report?
10. The HFR and HPR sheets in the 22 October zip are dated March 2024 and older than the ones NHA sent on 2 October. Which is current?

## 11. Risks

- **Self-reported.** The integrator runs the tests, so the evidence is as strong as the screenshots, the recordings and the REQUEST-IDs. The REQUEST-IDs the manifest already carries are what a reviewer can check against the gateway.
- **Agent judgement.** An agent can call a screen passed when it is not. Every PASS carries its screenshot and a person reviews the report before it is submitted.
- **Run time and cost.** M1 is 100 cases with up to 3 passes each. Phases 3 and 4 measure both.
- **Personal data.** ABHA creation screens show Aadhaar details, so masking is part of the report sub-skill, not an option.
