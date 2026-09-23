# NHCX Sandbox Site Mirror — https://hcxsbx.abdm.gov.in

Fetched on 2026-09-01 from the NHCX (National Health Claims Exchange) sandbox portal.
The site is a React SPA; all files and page text were extracted from its `main.js` bundle
and downloaded directly from `https://hcxsbx.abdm.gov.in/images/<hash>.<ext>`.

## Layout

- `documents/` — all 27 files from https://hcxsbx.abdm.gov.in/#/documents (named as on the page)
- `hmisdocuments/` — all 12 files from https://hcxsbx.abdm.gov.in/#/hmisdocuments (NHCX-PMJAY-HMIS Integration)
- `media/` — NHCX Brochure and Guide for Providers (from the Media Center page)
- `pages/` — extracted text of every content page, one markdown file per route
  (`__` in a filename = `/` in the route). Covers /introduction-NHCX,
  /technical-specifications (+ all open-protocol & data-security sub-pages),
  /domain-specifications (+ all sub-pages), /documents, /hmisdocuments.
- `images/` — all 86 image assets from the site bundle. Three content diagrams are
  renamed descriptively; the rest keep their bundle hash names (mostly UI icons,
  logos, and media-center thumbnails).
- `doc/` — **full extraction of every file**: PDFs/DOCX → markdown text + tables +
  embedded images, XLSX → markdown tables per sheet, ZIPs → unpacked with Postman
  collections and FHIR bundles decoded, plus an image catalog. Start at `doc/INDEX.md`.

## Last-updated notes shown on the site

- "Workflow Status Sheets (with Codes)" — last updated 18 Aug 2026
- "Standard Error Codes" — last updated 11 Aug 2026
- "NHCX PMJAY Integration Handbook" — last updated 14 Aug 2026

## Live API specifications (Swagger, from /technical-specifications/api-specifications)

| Use Case | Endpoint |
|---|---|
| Coverage Eligibility | https://hcxsbx.abdm.gov.in/coverageeligibilityhcxservice/swagger-ui-custom.html |
| Preauthorisation | https://hcxsbx.abdm.gov.in/preauthhcxservice/swagger-ui-custom.html |
| Claim | https://hcxsbx.abdm.gov.in/claimhcxservice/swagger-ui-custom.html |
| Request Additional Attachments | https://hcxsbx.abdm.gov.in/communicationhcxservice/swagger-ui-custom.html |
| Payment | https://hcxsbx.abdm.gov.in/servicehcxpayment/swagger-ui-custom.html |
| Status Check | https://hcxsbx.abdm.gov.in/statushcxservice/swagger-ui-custom.html |
| Reprocess | https://hcxsbx.abdm.gov.in/taskhcxservice/swagger-ui-custom.html |
| Search | https://hcxsbx.abdm.gov.in/searchhcxservice/swagger-ui-custom.html |
| Insurance Plan | https://hcxsbx.abdm.gov.in/insuranceplanhcxservice/swagger-ui/index.html |
| Communication | https://hcxsbx.abdm.gov.in/communicationhcxservice/swagger-ui/index.html |
| Participant | https://hcxsbx.abdm.gov.in/participanthcxservice/swagger-ui/index.html |
| Notifications | https://hcxsbx.abdm.gov.in/subscriptionhcxservice/swagger-ui/index.html |

## Key external references linked from the site

- FHIR profiles (NRCeS): https://nrces.in/ndhm/fhir/r4/hcx-profile.html
- NHCX Strategy Note ("NHCX: Transforming Claims Processing in India"):
  https://drive.google.com/file/d/1VsYNmeaLtTxabKbRn-SMwlOjdnGg5Epn/view?usp=sharing
- NDHB report: https://main.mohfw.gov.in/sites/default/files/Final%20NDHB%20report_0.pdf
- NDHM Secure Application Development: https://sandbox.abdm.gov.in/documents/NDHM_Secure_Application_Development-Reference_Document.pdf
- IRDAI Grievance Redressal Guidelines: https://www.policyholder.gov.in/uploads/CEDocuments/Guidelines%20on%20Grievance%20Redressal.pdf

## Webinars (Media Center)

- NHCX NRCeS Webinar — FHIR IG v6.5 (23 Jul 2025): https://www.youtube.com/embed/V8bplJU9oFE
- Webinar on NHCX (7 Aug 2025): https://www.youtube.com/embed/fQFiJt1lmEE
- Module 12 Health Claims Exchange (14 Oct 2025): https://www.youtube.com/embed/iMiI4V22_WI
