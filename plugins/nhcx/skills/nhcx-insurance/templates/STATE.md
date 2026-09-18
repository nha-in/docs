# Build state

Mode: <integrate | standalone>
Target: <the HMIS or the runtime>
Started: <date>

One row per gate. Status is `open`, `closed`, `reopened` or `not applicable`. Evidence is a path, a line, or a command and its output; a row with no evidence is open whatever the status says.

## Shared

| Stage | Status | Evidence | Date |
| --- | --- | --- | --- |
| 1 idea | open | | |

## Foundation

A foundation module is built once, by the first skill that finds it absent, or found present. `Built by` names that skill, or `existing`.

| Module | Status | Built by | Evidence | Date |
| --- | --- | --- | --- | --- |
| 7.1 config and NHCX transport | open | | | |
| 7.2 storage | open | | | |
| 7.3 callback and archive | open | | | |
| 7.11 state and payer adapters | open | | | |
| 7.12 screens (the case screen shell) | open | | | |
| 7.13 standalone shell | open (not applicable in integrate mode) | | | |

## nhcx-<skill>

Copy this block once per skill, when the skill starts its stage 0. The module rows are the ones the skill's `SKILL.md` names, each with its action from stage 0: reuse, extend or build.

| Stage | Status | Evidence | Date |
| --- | --- | --- | --- |
| 0 capability check | open | | |
| 2 planning | open | | |
| 3 discovery | open | | |
| 4 flow and data mapping | open | | |
| 5 screen plan | open | | |
| 6 code plan | open | | |
| 7.N <module> (<action>) | open | | |
| 7.12 screens (<this skill's tabs>) | open | | |
| 8 validation | open | | |
| 9 tests | open | | |
| 10 test run | open | | |
| 11 report | open | | |

## Log

One line per gate change: date, skill, stage, from, to, why.
