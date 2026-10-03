# Go live

Working in the sandbox is not the same as being live. Stages 4 to 6 of [sandbox integration](/docs/pr-108/docs/hiecm/v3/getting-started/sandbox#how-sandbox-integration-works) sit between the two, and you run them once, at the end.

## In short

- Sandbox integration has 6 stages. Stages 1 to 3 get you access and build the milestones; this page covers stages 4 to 6.
- There is no per milestone submission. Stages 4 to 6 cover your whole integration, once.
- Functional testing, an NHA review and demo, and the [security audit](/docs/pr-108/docs/hiecm/v3/getting-started/security-audit) come before the exit form.
- The Health Tech Committee demonstration obtains approval for production access.
- Production credentials are issued at the end, to your registered email address only. They are not your sandbox values.

## Prerequisites

Every milestone your integration needs works end to end. [Your integration path](/docs/pr-108/docs/hiecm/v3/milestones) says which ones apply to a citizen using a [PHR](/docs/pr-108/docs/hiecm/v3/getting-started/glossary#phr) application, and which to a facility publishing as the [HIP](/docs/pr-108/docs/hiecm/v3/getting-started/glossary#hip) or fetching as the [HIU](/docs/pr-108/docs/hiecm/v3/getting-started/glossary#hiu).

Start stage 4 once all of them are complete, not milestone by milestone.

## Stage 4: Test, review and audit

### Step 1: Complete functional testing

Functional testing validates the ABDM functions you integrated. An empanelled functional testing agency runs it.

The cases each module is tested against, with their ids: [testing use cases](/docs/pr-108/docs/hiecm/v3/resources/test-cases).

1. Contact an agency on the empanelled functional testing list.
2. Complete functional and non-functional testing of the integrated application.
3. Obtain the functional testing report.
4. Share the report with the ABDM integration team.

For support or a grievance about testing, contact the ABDM integration team.

### Step 2: Pass the NHA internal review and demo

The review confirms every mandatory scenario is implemented and tested.

1. Submit your functional testing reports to NHA.
2. The ABDM integration team reviews them.
3. Once they are approved, NHA schedules an internal demonstration.
4. At the demonstration, you show the milestones and workflows you implemented.

### Step 3: Complete the security audit

The Web Application Security Assessment, or WASA, is conducted by an STQC approved agency or a CERT-In empanelled agency. It produces the [Safe to Host certificate](/docs/pr-108/docs/hiecm/v3/getting-started/glossary#safe-to-host-certificate), which you submit to NHA. [Security audit](/docs/pr-108/docs/hiecm/v3/getting-started/security-audit) covers which URL is audited and how many audits your platforms need.

### Step 4: Submit the sandbox exit form

Before the Health Tech Committee reviews you, the exit form carries these documents:

| What you upload                           | Comes from                                       |
| ----------------------------------------- | ------------------------------------------------ |
| The functional testing report             | Your empanelled testing agency                   |
| The Safe to Host certificate              | Your STQC approved or CERT-In empanelled auditor |
| Your GSTIN certificate                    | You                                              |
| A signed undertaking                      | You                                              |
| Any supporting document a milestone needs | You, as the integration team asks                |

1. Log in with the credentials you created at sandbox registration.
2. Select the milestones you are seeking approval for.
3. Upload every document and certificate in the table.
4. Submit the exit form.
5. Wait for the NHA review.
6. Take part in the Health Tech Committee demonstration.

Also send the signed hard copy of the undertaking to NHA by Speed Post or courier.

## Stage 5: Complete the Health Tech Committee demonstration

Present your final implementation to the [Health Tech Committee](/docs/pr-108/docs/hiecm/v3/getting-started/glossary#health-tech-committee). The committee evaluates four things:

- Compliance with ABDM guidelines
- Successful implementation of each milestone
- Functional readiness
- Security compliance

The committee records its decision in four review stages, each carrying its own reviewer and date, so the outcome arrives as a sequence rather than a single answer. Approval makes you eligible for production access.

## Stage 6: Go live

Once the committee approves, NHA issues a production client id and client secret. They are sent only to your registered email address. Keep the production secret confidential and never share it.

Move the approved integration to the production environment and begin using ABDM services.

| What you call                                                                | Sandbox                                    | Production                 |
| ---------------------------------------------------------------------------- | ------------------------------------------ | -------------------------- |
| The gateway                                                                  | `https://dev.abdm.gov.in`, `X-CM-ID: sbx`  | `https://apis.abdm.gov.in` |
| The [ABHA](/docs/pr-108/docs/hiecm/v3/getting-started/glossary#abha) service | `https://abhasbx.abdm.gov.in/abha/api/v3/` |                            |

A production client id against a sandbox host, or the reverse, fails.

## What you see when it works

You hold a production client id and client secret, and a call that worked in the sandbox returns the same result against the production host.

## When it goes wrong

If a call that worked in the sandbox fails in production, check the base URL and the `X-CM-ID` header first. See [Everything returns 401](/docs/pr-108/docs/hiecm/v3/troubleshooting/everything-returns-401).

Questions about the exit process itself, including where to submit the form or what counts as a valid supporting document, go to [Support](/docs/pr-108/docs/support).

## Next steps

- Get the audit that feeds stage 4: [Security audit](/docs/pr-108/docs/hiecm/v3/getting-started/security-audit).
- Hand your integration to an agent: [Build with AI](/docs/pr-108/docs/hiecm/v3/getting-started/build-with-ai).
