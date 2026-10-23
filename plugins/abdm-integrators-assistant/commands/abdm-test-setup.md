---
description: Check what a functional test run needs on this machine for the run type you pick, and print the install command for each missing piece.
argument-hint: '[ft|ui|all]'
---

Check this machine for a functional test run of type `$ARGUMENTS`. Install nothing. Print the exact install command for each missing piece and let the tester run it.

## 1. The run type

With no argument, ask one question and wait: `ft`, `ui` or `all`?

| Run type | What it runs | What it needs here |
|---|---|---|
| `ft` | Your system's calls against the sandbox, judged on calls and callbacks | Sections 2 and 3 |
| `ui` | Your application's screens, driven by an agent | Sections 2 to 4, and section 5 for a PHR app on Android |
| `all` | `ft` then `ui` | Everything `ui` needs |

Then ask one more question for `ui` and `all`: is the application under test a PHR app on Android? Section 5 runs only on a yes.

## 2. Node

| Check | Ready when | Install command when missing |
|---|---|---|
| `node --version` | Prints `v18` or higher | Install the LTS release from https://nodejs.org |

## 3. Python, for NHA's workbook and the test report

| Check | Ready when | Install command when missing |
|---|---|---|
| `python3 -c "import sys; print(sys.version_info >= (3, 9))"` | Prints `True` | Install Python 3.9 or later from https://www.python.org/downloads |
| `python3 -c "import openpyxl, PIL, docx; print('ok')"` | Prints `ok` | `pip install openpyxl pillow python-docx`. python-docx writes the final test report |

## 4. Playwright, for `ui`

| Check | Ready when | Install command when missing |
|---|---|---|
| Your tool list | It holds `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`, `browser_console_messages`, `browser_network_requests` and `browser_network_request`, under whatever prefix your agent gives the `playwright` server | This plugin declares the server in its `.mcp.json`. Restart Claude Code and check again. Without the plugin: `claude mcp add playwright npx @playwright/mcp@0.0.83` |
| `browser_navigate` to `about:blank` | Returns a page, not an error naming a missing browser | `npx playwright install chromium`. When the error names Chrome, `npx playwright install chrome` |

## 5. A PHR app on Android, for `ui`

| Check | Ready when | Install command when missing |
|---|---|---|
| `adb version` | Prints a version | Android platform tools from https://developer.android.com/tools/releases/platform-tools |
| `adb devices` | Lists one line ending in `device` | Start an emulator from Android Studio, https://developer.android.com/studio, or connect a phone with USB debugging on |
| `adb shell pm list packages <package>` | Prints `package:<package>` | `adb install <path to the APK>` |
| `maestro --version` | Prints a version | `curl -fsSL "https://get.maestro.mobile.dev" \| bash` |

An HMIS, EMR or HIU run skips this section. It never drives the PHR app: the tester sends one PHR app screenshot per case instead.

## Output

One line per check: the command run, the output observed, and `ready`, `missing` or `not needed`. Paste the output. A check with no pasted output is `missing`.

For every `missing` line, print its install command exactly as above, then stop and wait for the tester to say it is done. Run that check again. After 3 checks of the same line still `missing`, stop and ask one question about it.

When every line is `ready` or `not needed`, say so and suggest the prompt that starts the run, such as "Run the M1 test cases as UI tests against my app and fill NHA's workbook."
