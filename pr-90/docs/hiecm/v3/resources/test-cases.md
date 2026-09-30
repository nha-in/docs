# Test cases

Test cases are the checks your integration has to pass before it goes live. An empanelled functional testing agency runs them against what you built, and its functional testing report quotes each case by its id. Run them yourself first, on the [sandbox](/docs/pr-90/docs/hiecm/v3/getting-started/sandbox), so nothing in that report is a surprise.

## Test cases by module

Each module has its own set. Run the cases for every module you integrated.

| Module                                                                                                          | What the cases cover                                            | Cases                                                                   |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [M1 Identity](/docs/pr-90/docs/hiecm/v3/milestones/m1)                                                          | ABHA creation, verification, profile update and profile sharing | [66 cases](/docs/pr-90/docs/hiecm/v3/resources/test-cases/m1)           |
| [M2 Health Information Provider](/docs/pr-90/docs/hiecm/v3/milestones/m2)                                       | Linking care contexts, and sharing the records you hold         | [Not yet published](/docs/pr-90/docs/hiecm/v3/resources/test-cases/m2)  |
| [M3 Health Information User](/docs/pr-90/docs/hiecm/v3/milestones/m3)                                           | Consent requests, and fetching records from other providers     | [Not yet published](/docs/pr-90/docs/hiecm/v3/resources/test-cases/m3)  |
| [M4 Registry Integration](/docs/pr-90/docs/hiecm/v3/milestones/m4)                                              | Facility and professional registration                          | [Not yet published](/docs/pr-90/docs/hiecm/v3/resources/test-cases/m4)  |
| PHR application, [P1](/docs/pr-90/docs/hiecm/v3/milestones/p1) to [P4](/docs/pr-90/docs/hiecm/v3/milestones/p4) | The PHR application's own flows                                 | [Not yet published](/docs/pr-90/docs/hiecm/v3/resources/test-cases/phr) |

## How to read a case

A module's cases are grouped by flow, such as ABHA creation through Aadhaar OTP. Each group opens with who it applies to, then lists one case per row.

| Column           | What it holds                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Case and marking | The case id, such as `CRT_ABHA_101`, and under it whether the case applies to you. Quote the id when you report a result or ask about a case. Each id is also a link you can share. |
| What is tested   | What your system has to do. Open **Steps** under it for how the tester checks it.                                                                                                   |
| Pass when        | The result the tester has to see.                                                                                                                                                   |
| APIs             | Every API the case calls. A path that is exactly one API links to its reference page. A case with none is checked on your screens or in your records.                               |

## Markings

| Marking                                   | What it means                                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Mandatory                                 | Every integrator has to pass it.                                                                                     |
| Optional                                  | Passing it is not required.                                                                                          |
| Mandatory for private, or for government  | Only integrators of that kind have to pass it.                                                                       |
| Government: one of two cases is mandatory | A government integrator has to pass at least one of the two cases named. For a private integrator both are optional. |

## Cases that wait for a callback

Some calls answer at once, in the response. Others only acknowledge the request, and the answer arrives later as a POST to the callback URL you registered. A case that calls one of those needs that URL reachable from the public internet while the case runs. [Get your sandbox credentials](/docs/pr-90/docs/hiecm/v3/getting-started/sandbox) covers what the URL has to do.

## Next steps

- Start with the [M1 test cases](/docs/pr-90/docs/hiecm/v3/resources/test-cases/m1).
- Where functional testing fits in the route to production: [Go live](/docs/pr-90/docs/hiecm/v3/getting-started/going-live).
