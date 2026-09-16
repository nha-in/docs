# Security audit

Every National Health Claims Exchange (NHCX) participant passes the functional and security tests for its role before it leaves the sandbox. Production onboarding then asks for the certificates those tests produce. This chapter covers the security half and where it sits in the order.

## In short

- Security tests are part of sandbox certification for every participant, beside the functional use cases.
- A provider completes the [Web Application Security Assessment (WASA)](/docs/main/docs/nhcx/v1/getting-started/glossary#identity-and-registration) for [ABDM](/docs/main/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) Milestone 1. NHCX production runs on that same production client.
- Sandbox certification can require additional security testing, such as an STQC or CERT-In review.
- Production onboarding reviews your functional and security testing certificates before credentials are issued.

## Prerequisites

- Your integration runs every use case on the exit list for your side: the [Provider Checklist](/docs/main/docs/nhcx/v1/roles/provider/provider-checklist) or the [Payer Checklist](/docs/main/docs/nhcx/v1/roles/payer/payer-checklist).

## What applies to you

| Review                                      | When it applies                                                                                                                                                                                       | What it gives you                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Functional and security tests for your role | Every participant, before sandbox sign-off                                                                                                                                                            | The test results you submit for review |
| WASA security audit                         | ABDM Milestone 1 production access, which NHCX production builds on. Under [PMJAY](/docs/main/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) it is also on the sandbox exit list | Clearance for ABDM production access   |
| STQC or CERT-In review                      | When NHCX policy requires it                                                                                                                                                                          | An additional security clearance       |

## 1. Pass the security tests for your role

Run the security tests and flows that apply to your role alongside the functional use cases. Submit your test results for review. Include how your application uses and interacts with the exchange APIs.

## 2. Complete the WASA audit

Milestone 1 production credentials follow Milestone 1 functional testing, the WASA security audit and the [Health Tech Committee (HTC)](/docs/main/docs/nhcx/v1/getting-started/glossary#identity-and-registration) demo. For a hospital, the provider role is then assigned to that Milestone 1 production client ID. The same client ID gives you NHCX production access, so the audit comes before NHCX production.

Under PMJAY, the sandbox exit adds the PMJAY team demo, the WASA audit and the NHCX sandbox exit form. [PMJAY on NHCX](/docs/main/docs/nhcx/v1/concepts/pmjay-on-nhcx) has the scheme's full order.

## 3. Plan for STQC or CERT-In review

Sandbox certification can require additional security testing, such as an STQC or CERT-In review. Plan for it until your onboarding confirms whether it applies. Request your demos and bundle review by email to `hcx.integration@nha.gov.in`.

## 4. Keep the certificates for production onboarding

On approval, the sandbox issues a completion certificate, valid for a configured period. When you apply for production, a final approval reviews it. You share the functional and security testing certificates issued in the sandbox, and production credentials follow.

## What you see when it works

- You hold the email confirming your successful integration on the NHCX sandbox.
- You hold the security testing certificates that apply to you, ready to share at production onboarding.

## Confirm at onboarding

- **Whether STQC or CERT-In review applies to you.** Plan for it until you are told otherwise.
- **The validity period of your sandbox completion certificate.** Apply for production within it.

## Next steps

- [Going Live](/docs/main/docs/nhcx/v1/go-live): the production credentials, registration and switch that follow.
- [Governance and Audit](/docs/main/docs/nhcx/v1/reference/governance-and-audit): the security obligations that continue in production, and the full onboarding question list.
