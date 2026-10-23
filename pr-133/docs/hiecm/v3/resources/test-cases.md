# UI test cases

UI test cases are the checks your integration has to pass before it goes live. Each one is run on your own screens: the tester works through your application as a user would and compares what it shows with the expected result. An empanelled functional testing agency runs them against what you built, and its functional testing report quotes each case by its id. Run them yourself first, on the [sandbox](/docs/pr-133/docs/hiecm/v3/getting-started/sandbox), so nothing in that report is a surprise.

## UI test cases by module

Each module has its own set. Run the cases for every module you integrated.

| Module                                                                                                            | What the cases cover                                                                                   | Cases                                                            |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| [M1 Identity](/docs/pr-133/docs/hiecm/v3/milestones/m1)                                                           | ABHA creation, verification, profile update and profile sharing                                        | [100 cases](/docs/pr-133/docs/hiecm/v3/resources/test-cases/m1)  |
| [M2 Health Information Provider](/docs/pr-133/docs/hiecm/v3/milestones/m2)                                        | Linking care contexts, and sharing the records you hold                                                | [13 cases](/docs/pr-133/docs/hiecm/v3/resources/test-cases/m2)   |
| [M3 Health Information User](/docs/pr-133/docs/hiecm/v3/milestones/m3)                                            | Consent requests, and fetching records from other providers                                            | [16 cases](/docs/pr-133/docs/hiecm/v3/resources/test-cases/m3)   |
| [M4 Registry Integration](/docs/pr-133/docs/hiecm/v3/milestones/m4)                                               | Facility search, registration, update and linkage in the HFR, and professional profiles in the HPR     | [190 cases](/docs/pr-133/docs/hiecm/v3/resources/test-cases/m4)  |
| PHR application, [P1](/docs/pr-133/docs/hiecm/v3/milestones/p1) to [P4](/docs/pr-133/docs/hiecm/v3/milestones/p4) | Registration and login, linking and sharing records, consents and subscriptions, and the health locker | [200 cases](/docs/pr-133/docs/hiecm/v3/resources/test-cases/phr) |

## How to read a case

A module's cases are grouped by flow, such as ABHA creation through Aadhaar OTP. Each group opens with who it applies to, then lists one case per row.

| Column           | What it holds                                                                                                                                                                                                                                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Case and marking | The case id, such as `CRT_ABHA_101`, and under it whether the case applies to you. Quote the id when you report a result or ask about a case. Each id is also a link you can share. The PHR sheet carries no ids, so each PHR case has one built the same way from its PHR milestone and row, such as `PHR_ADDR_302` for row P1 3.2, with the row shown under it. |
| What is tested   | What your system has to do. Open **Steps** under it for how the tester checks it.                                                                                                                                                                                                                                                                                 |
| Pass when        | The result the tester has to see on screen.                                                                                                                                                                                                                                                                                                                       |
| APIs             | Every API behind the screen being tested. A path that is exactly one API links to its reference page. A case with none is checked on your screens or in your records alone.                                                                                                                                                                                       |

## Markings

| Marking                                   | What it means                                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Mandatory                                 | Every integrator has to pass it.                                                                                     |
| Optional                                  | Passing it is not required.                                                                                          |
| Mandatory for private, or for government  | Only integrators of that kind have to pass it.                                                                       |
| Government: one of two cases is mandatory | A government integrator has to pass at least one of the two cases named. For a private integrator both are optional. |

## Recording each result in the workbook

The cases are also published as workbooks on the [sandbox site's Test Cases page](https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=TestCases). The M1, M2 and M3 tables here are the revision of 21 October 2026, newer than the workbooks there. The M1, M2 and M3 workbooks carry four empty columns for the result of each case.

| Column                        | What goes in it                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Status(PASS/FAIL)             | `PASS` or `FAIL`                                                                    |
| Response of Request with Code | The response or error code your system or the gateway returned, such as `ABDM-1204` |
| Iterations                    | How many attempts the case took before it passed or was given up                    |
| Remarks                       | For a failure, the reason: the message on screen, the error code, or the exception  |

The HFR and HPR workbooks carry Status and Remarks only, and the PHR workbook carries none: add the columns you need beside the last one, and never write over a cell the workbook already fills.

## Cases that wait for a callback

Some calls answer at once, in the response. Others only acknowledge the request, and the answer arrives later as a POST to the callback URL you registered. A case that calls one of those needs that URL reachable from the public internet while the case runs. [Get your sandbox credentials](/docs/pr-133/docs/hiecm/v3/getting-started/sandbox) covers what the URL has to do.

## Next steps

- Start with the [M1 UI test cases](/docs/pr-133/docs/hiecm/v3/resources/test-cases/m1).
- Where functional testing fits in the route to production: [Go live](/docs/pr-133/docs/hiecm/v3/getting-started/going-live).
