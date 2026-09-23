# NHCX Site — Extracted Documentation Index

Every file downloaded from https://hcxsbx.abdm.gov.in has been decompiled/extracted here:
PDFs → full text + tables + embedded images, DOCX → full text + tables + embedded images,
XLSX → every sheet as markdown tables, ZIPs → unpacked + Postman/FHIR JSON decoded.
Web page text is in `../pages/` (28 routes). Site images are cataloged in [images-catalog.md](images-catalog.md).

## documents/ (from #/documents)

| Extracted doc | Original | Contents |
|---|---|---|
| [NHCX Usecases](documents/NHCX%20Usecases.md) | pdf, 2p | What NHCX is; list of supported use cases (eligibility, preauth, claim, payment, reprocess) |
| [Standards for NHCX](documents/Standards%20for%20NHCX.md) | pdf, 41p + 205 imgs | Slide deck on NHCX standards (image-heavy; see `_images/`) |
| [Authenticating with NHCX](documents/Authenticating%20with%20NHCX.md) | pdf, 1p | ABDM sessions API, client id/secret, bearer-token flow, curl example |
| [Onboarding providers and payers in Sandbox](documents/Onboarding%20providers%20and%20payers%20in%20Sandbox.md) | pdf, 3p | Participant registry, sandbox onboarding steps and APIs |
| [Onboarding providers and payers in Production](documents/Onboarding%20providers%20and%20payers%20in%20Production.md) | pdf, 4p | Production onboarding: participant create/verify APIs on apisprod.nha.gov.in |
| [Policy Linking and De-Linking Process](documents/Policy%20Linking%20and%20De-Linking%20Process.md) | pdf, 2p | Payer participant codes, ABHA↔policy link/de-link flows |
| [Coverage Eligibility](documents/Coverage%20Eligibility.md) | pdf, 5p | coverageeligibility request/on_request API spec: headers, payload, workflow |
| [Preauthorization](documents/Preauthorization.md) | pdf, 5p | preauth submit/on_submit API spec |
| [Claim](documents/Claim.md) | pdf, 5p | claim submit/on_submit API spec |
| [Payment](documents/Payment.md) | pdf, 5p | payment notice request/on_request API spec |
| [NHCX Provider Side Use Cases - Sandbox Exit Process](documents/NHCX%20Provider%20Side%20Use%20Cases%20-%20Sandbox%20Exit%20Process.md) | pdf, 7p | Provider exit-testing checklist: per-use-case APIs to demonstrate |
| [NHCX Payer Side Use Cases - Sandbox Exit Process](documents/NHCX%20Payer%20Side%20Use%20Cases%20-%20Sandbox%20Exit%20Process.md) | pdf, 7p | Payer exit-testing checklist |
| [NHCX Requests and Responses for UseCases](documents/NHCX%20Requests%20and%20Responses%20for%20UseCases.md) | xlsx, 10 sheets | Status codes + per-use-case request/response payload reference |
| [Workflow Status Sheets (with Codes)](documents/Workflow%20Status%20Sheets%20(with%20Codes).md) | xlsx, 1 sheet | Workflow status ↔ code ↔ x-hcx-status mapping (updated 18 Aug 2026) |
| [NHCX Notification Integration](documents/NHCX%20Notification%20Integration.md) | docx | Notification integration for PHR apps, NHCX V1.0 protocol |
| [NHCX Code Snippets references for payload preparation](documents/NHCX%20Code%20Snippets%20references%20for%20payload%20preparation.md) | pdf, 4p | FHIR resource prep, JWE encryption code snippets |
| [Implementation Guide for Adoption of FHIR in ABDM and NHCX](documents/Implementation%20Guide%20for%20Adoption%20of%20FHIR%20in%20ABDM%20and%20NHCX.md) | pdf, 21p + 36 imgs | FHIR adoption guide (NRCeS) |
| [API Response Handling to avoid Failures](documents/API%20Response%20Handling%20to%20avoid%20Failures.md) | pdf, 2p | Acceptance vs error scenarios, expected return types |
| [Standard Error Codes](documents/Standard%20Error%20Codes.md) | xlsx, 7 sheets | PAYR-/provider/gateway error codes with descriptions (updated 11 Aug 2026) |
| [FAQs](documents/FAQs.md) | pdf, 19p + 38 imgs | Integrator guide: frequently asked technical queries |
| [Common Mistakes while implementing through NHCX](documents/Common%20Mistakes%20while%20implementing%20through%20NHCX.md) | pdf, 2p | Status misuse and other integration pitfalls |
| [NHCX Dummy Payer Implementation](documents/NHCX%20Dummy%20Payer%20Implementation.md) | pdf, 3p | Dummy payer `1000003538@hcx`: testable use cases |
| [Steps to generate encryption Certificate](documents/Steps%20to%20generate%20encryption%20Certificate.md) | pdf, 3p | X.509 RSA cert generation (openssl commands) |
| [AWS(Sandbox) NHCX-OnBoarding APIs Postman Collection](documents/AWS(Sandbox)%20NHCX-OnBoarding%20APIs%20Postman%20Collection.md) | zip→json | Sandbox onboarding endpoints decoded |
| [AWS(PROD) NHCX-OnBoarding APIs Postman Collection](documents/AWS(PROD)%20NHCX-OnBoarding%20APIs%20Postman%20Collection.md) | zip→json | Production onboarding endpoints decoded |
| [AWS(Sandbox) PARTICIPANT SERVICE APIs Postman Collection](documents/AWS(Sandbox)%20PARTICIPANT%20SERVICE%20APIs%20Postman%20Collection.md) | zip→json | Participant service endpoints decoded |
| [AWS(Sandbox) NHCX USECASE Postman Collection](documents/AWS(Sandbox)%20NHCX%20USECASE%20Postman%20Collection.md) | zip→json (790 KB) | All use-case endpoints with JWE payload examples |

## hmisdocuments/ (from #/hmisdocuments — NHCX-PMJAY-HMIS Integration)

| Extracted doc | Original | Contents |
|---|---|---|
| [NHCX-PMJAY-HMIS Integration Overview](hmisdocuments/NHCX-PMJAY-HMIS%20Integration%20Overview.md) | pdf, 9p + 16 imgs | Program overview deck |
| [NHCX-PMJAY-HMIS Integration Guide](hmisdocuments/NHCX-PMJAY-HMIS%20Integration%20Guide.md) | pdf, 38p + 7 imgs | Functional Requirement Document (work-in-progress) |
| [NHCX PMJAY Integration Handbook](hmisdocuments/NHCX%20PMJAY%20Integration%20Handbook.md) | docx (8 MB) + 13 imgs | V1.0 handbook based on NRCeS FHIR R4 (updated 14 Aug 2026) |
| [PMJAY Hospital Migration to HMIS via NHCX](hmisdocuments/PMJAY%20Hospital%20Migration%20to%20HMIS%20via%20NHCX.md) | docx | Migration rationale: from TMS 2.0 portal to hospital HMIS |
| [Insurance Plan IG](hmisdocuments/Insurance%20Plan%20IG.md) | docx | InsurancePlan implementation guide (provider↔payer↔TPA comms) |
| [Sample FHIR bundles](hmisdocuments/Sample%20FHIR%20bundles.md) | zip, 22 files | Claim/coverage/preauth/payment/insuranceplan sample bundles, each summarized by resource composition; unpacked in `Sample FHIR bundles_extracted/` |
| [NHCX APIs to be called based on scenario](hmisdocuments/NHCX%20APIs%20to%20be%20called%20based%20on%20scenario.md) | xlsx, 1 sheet | Scenario → API endpoint → prerequisites mapping |
| [NHCX Services - Request and Response](hmisdocuments/NHCX%20Services%20-%20Request%20and%20Response.md) | xlsx, 10 sheets | Status codes + per-service request/response reference (PMJAY variant) |
| [NHCX-PMJAY-HMIS Test Cases](hmisdocuments/NHCX-PMJAY-HMIS%20Test%20Cases.md) | xlsx, 2 sheets | TC-ABHA-…: test case matrix with inputs and expected results |
| [Biometric Authentication Implementation Steps](hmisdocuments/Biometric%20Authentication%20Implementation%20Steps.md) | docx + 4 imgs | ABHA biometric auth at registration/preauth |
| [Biometric Authentication APIs Postman Collection](hmisdocuments/Biometric%20Authentication%20APIs%20Postman%20Collection.md) | zip→json | ABHA-proxy biometric endpoints decoded |
| [FaceAuth Postman Collection](hmisdocuments/FaceAuth%20Postman%20Collection.md) | zip→json | Face authentication endpoints decoded |

## media/

| Extracted doc | Original | Contents |
|---|---|---|
| [NHCX - Guide for Providers](media/NHCX%20-%20Guide%20for%20Providers.md) | pdf, 16p + 24 imgs | Provider-facing guide: "the next step in digital health interoperability" |
| [NHCX Brochure](media/NHCX%20Brochure.md) | pdf, 1p + 2 imgs | One-page brochure (visual; see `NHCX Brochure_images/`) |

## Also in this doc dir

- [images-catalog.md](images-catalog.md) — all 86 site images identified and described
- `*_images/` folders — embedded images pulled out of PDFs/DOCX (≈370 files)
- `*_extracted/` folders — unpacked zip archives (Postman JSON, FHIR bundle .txt files)
