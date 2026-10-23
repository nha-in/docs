---
id: shared.concept.test-ui-run
type: concept
gateway: shared
milestone: n/a
version: abdm-v3
title: Run a functional test case as a UI test
summary: >
  A `ui` run drives your application's screens the way a tester would,
  with the Playwright MCP server for a web application and Maestro for a
  PHR app on Android, saves a screenshot for every step, and writes the
  outcome into NHA's own columns of the module's workbook.
sources:
  - url: https://github.com/nha-in/docs/blob/main/catalogue/hiecm/openapi/.raw/nha-2026-10-22-m1-tests/MANIFEST.md
    status: reference
    note: >
      NHA's request of 22 October 2026: run the cases in its workbook as UI
      tests against the integrator's application and append the results to
      the same sheet, with the reason for a failure, the error code or
      unhandled exception, and the number of iterations.
  - url: https://github.com/microsoft/playwright-mcp
    status: reference
    note: >
      The Playwright MCP server, package @playwright/mcp, Apache 2.0, pinned
      at 0.0.83 in the integrators plugin. Needs Node 18 or later. Publishes
      browser_navigate, browser_snapshot, browser_click, browser_type,
      browser_take_screenshot, browser_console_messages,
      browser_network_requests and browser_network_request among its tools.
      Its README says a relative filename resolves against the workspace
      root, and browser_network_request returns one request's headers and
      body.
  - url: https://maestro.mobile.dev
    status: reference
    note: >
      Maestro, Apache 2.0, drives an Android app on an emulator or a device
      over adb from a YAML flow.
related:
  concepts:
    - shared.concept.test-workbook-write-back
---

# Run a functional test case as a UI test

## In plain words

A test section runs each case in one of three run types. The tester picks one at the start.

| Run type | What it drives | Judged on |
|---|---|---|
| `ft` | Your system's calls against the sandbox. No browser | Calls, responses and callbacks |
| `ui` | Your application's screens: a web application through the Playwright MCP server, a PHR app on Android through Maestro | What the screen shows at each step of the sheet |
| `all` | `ft` for every chosen case first, then `ui` for the same cases | Each type on its own, in its own columns |

`all` runs `ft` first so a backend fault shows before the slower `ui` run starts. A case that has no meaning in a run type, such as a "Create ABHA option is visible" case in an `ft` run, is recorded `not-run` with the run type as the reason.

One rule above changes in a `ui` run, and only this one. In an `ft` run a `screen` case is attested: the tester answers `passed? y/n` and names the screenshot. In a `ui` run the agent observes the screen itself, and its screenshot plus the literal on-screen text it matched replace the tester's attestation. Every other rule above still holds in a `ui` run.

## Before you start

The `ui` readiness check runs before the first case. Check every row the chosen cases need, in order. Record each as `ready`, `missing` or `not needed`, never the value itself.

| Need | Ready when | Install command to print when missing |
|---|---|---|
| Node 18 or later | `node --version` prints `v18` or higher | Install the LTS release from https://nodejs.org |
| The Playwright MCP server, connected | Your tool list holds `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`, `browser_console_messages`, `browser_network_requests` and `browser_network_request`. These are the names the server publishes. Read your own tool list for the exact names, which some agents prefix with the server name | Claude Code with the integrators plugin: restart Claude Code. The plugin starts `@playwright/mcp@0.0.83`, and the first start downloads that version with `npx`. Claude Code without it: `claude mcp add playwright npx @playwright/mcp@0.0.83`. Any other agent: an MCP server with command `npx` and argument `@playwright/mcp@0.0.83` |
| A browser | `browser_navigate` to the application URL returns a page, not an error naming a missing browser | Install the browser the server's error names, and only that one: `npx playwright install chrome` when it names Chrome, `npx playwright install chromium` when it names Chromium |
| The application URL | `browser_navigate` to it and `browser_snapshot` shows your application's first screen | Ask the tester for it |
| A tester login | Read from an environment variable the tester names, or typed at a hidden prompt, and the login screen accepts it | Ask the tester for it |
| The server log command, optional | The tester gave a command that prints your server's log for a time window, such as `docker logs --since <start> --until <end> <container>` | `not needed` when none is given |
| For a PHR app on Android: a device | `adb devices` lists one line ending in `device` | Android Studio's emulator from https://developer.android.com/studio, or a phone with USB debugging on |
| For a PHR app on Android: the app | `adb shell pm list packages <package>` prints `package:<package>` | `adb install <path to the APK>` |
| For a PHR app on Android: Maestro | `maestro --version` prints a version | `curl -fsSL "https://get.maestro.mobile.dev" \| bash` |

When a row is `missing`: stop, print its install command exactly as above, and wait for the tester to say it is done. Then check the row again. Never install anything yourself. After 3 checks of the same row still `missing`, stop the run and ask one question about that row.

## What happens

For each chosen case, at most 3 passes. Record the number of passes the case took, whether it ended passed or failed.

1. Read the case's Steps and Expected Result from its workbook row, and its exit condition from the skill's case.
2. Follow the Steps in order, on the surface the step names: the web application, or the PHR app.
   - Web: `browser_navigate`, `browser_click`, `browser_type`, reading `browser_snapshot` before each action to find the element.
   - PHR app: write the steps as a Maestro flow at `abdm-ft/maestro/<case id>.yaml` and run `maestro test abdm-ft/maestro/<case id>.yaml`.
3. After step `n`, save one screenshot and the screen's text:

   | Surface | Screenshot | Screen text |
   |---|---|---|
   | Web | `browser_take_screenshot` with `filename` `abdm-ft/evidence/<case id>/<n>.png`. The server resolves that name against its workspace root, which need not be your repository, so save or move the file to `abdm-ft/evidence/<case id>/<n>.png` and check that the file exists there | `browser_snapshot` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |
   | PHR app | `- takeScreenshot: abdm-ft/evidence/<case id>/<n>` in the flow | `maestro hierarchy` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |

   The screen text shows what was typed into each field. Before saving it, replace the value of every field you typed an OTP, a password or an Aadhaar number into with `[redacted]`. For an OTP step, take the screenshot only after the field is submitted or cleared. Never save a snapshot or screenshot that shows an OTP, password or full Aadhaar number.

4. An OTP, a password, a captcha or an approval stops the case and asks the tester in the terminal, as in every run type. Read it with input hidden, type it with `browser_type`, and hold it only for that step. The tool's reply repeats what was typed. Never paste that reply into the run log, the evidence or the workbook. Write `<OTP typed>` or `<password typed>` in its place.
5. Judge the case. The pass condition is the case's exit condition and screen check in this skill, not the sheet's prose. The case is `passed` when the screen holds both. Paste into the run record the exact on-screen text or element you matched for each. When one holds and the other does not, the pass failed: say which one is missing. When the skill's case gives no literal for the screen, quote the on-screen text you believe satisfies the sheet's Expected Result, and record the case `needs-human` with `tester to confirm` in Remarks. Never record such a case `passed`.
6. Write the result into the workbook, as `shared.concept.test-workbook-write-back` sets out, with `--run ui`. A `ui` run fills NHA's own columns:

   ```bash
   python3 abdm-ft/abdm_workbook.py write <workbook> --run ui --results abdm-ft/<workbook name>-ui-results.json --executed-by "<tester>" --application "<your application>"
   ```

#### The PHR proof rule

When the run is for an HMIS, an EMR or another HIP, or for an HIU, and a step happens in the PHR app (logging in, approving or denying a consent, pulling records), do not drive the PHR app.

1. Ask the tester for one PHR app screenshot that shows the consent granted or the record visible.
2. Save it as `abdm-ft/evidence/<case id>/phr.png`.
3. Check your application's side of the same step on screen, as in step 3 above.

The case passes only when the PHR screenshot shows the step and your application's screen holds the exit condition. No screenshot from the tester is `needs-human`, with `Needs tester: PHR screenshot` in Remarks.

#### Finding the reason for a failure

Collect the reason in this order, and stop at the first one that names it. The Remarks value carries the reason and the code or exception.

| Order | Look at | How | What it gives |
|---|---|---|---|
| 1 | The error on screen | `browser_snapshot` | The message your application shows |
| 2 | Failed network responses | `browser_network_requests` lists the requests. For each with a status of 400 or above, `browser_network_request` with its number shows the body. When it shows no body, take the error code from the on-screen message or from the `ft` replay at order 4 | The HTTP status and an ABDM error code such as `ABDM-1204` |
| 3 | Browser console errors | `browser_console_messages` | A script error that stopped the screen |
| 4 | One replay of the case's `ft` calls | The same skill's case, run once as `ft`, when the sandbox credentials are ready | The ABDM error code. Diagnosis only: the `ui` outcome stays as observed |
| 5 | Your server log for the case's time window | The command from the readiness check, with the case's start and end times | A backend exception such as `NullPointerException`, which usually appears nowhere else |

```json
{"id": "CRT_ABHA_105", "outcome": "failed", "response": "Screen: Invalid OTP. POST /v3/enrollment/request/otp HTTP 400 ABDM-1204", "iterations": 3, "remarks": "OTP field sent empty; server log: NullPointerException in OtpService.verify"}
```

## How you know it worked

- `abdm-ft/evidence/<case id>/` holds one `<n>.png` and one `<n>.txt` for every step run, and `phr.png` for a case under the PHR proof rule.
- The run log pastes, for every `passed` case, the exact on-screen text or element that matched the exit condition and the screen check.
- A case whose screen check has no literal in the skill is `needs-human` with `tester to confirm`, never `passed`.
- `write` exits `0`, and the workbook row shows `PASS`, `FAIL`, `NA` or blank in `Status(PASS/FAIL)`, a number from 1 to 3 in `Iterations`, and the reason in `Remarks`.
- No OTP, password, token or full Aadhaar number appears in the run log, a screenshot, the evidence text, the results file or the workbook. Every typed OTP, password or Aadhaar field in a `.txt` file reads `[redacted]`.

## When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| No `browser_navigate` in the tool list | The Playwright MCP server is not connected | Print the install command from the readiness table, wait, check again |
| `browser_navigate` fails naming a browser that is not installed | No browser installed | Print the install command from the readiness table, wait, check again |
| The screenshot shows the login screen mid case | The tester's session expired | Log in again, count it as a new pass |
| `adb devices` lists nothing, or `unauthorized` | No emulator running, or the phone has not accepted the computer | Start the emulator, or accept the prompt on the phone |
| `maestro: command not found` | Maestro is not installed or not on the path | Print its install command, wait, check again |
| A step's element is not in the snapshot | The screen differs from the sheet's Steps | Record the pass as failed with the snapshot line nearest to it. Never invent a step |
| The reason is still unknown after all five sources | The fault leaves no trace a `ui` run can see | Record `failed` with what each source showed, and ask the tester for the server log command |
