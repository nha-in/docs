# NHA review ledger: M1, getting started, glossary, registry, M1 API, resources

Repo: `/Users/samdennis/code/nha-in`, branch `fix/nha-review-abha-m1`, audited read-only on 2026-09-22.
Paths below are relative to `site/docs/` unless they start with `catalogue/` or `site/src/`.

Status conventions used here: APPLIED = every sentence of NHA's revision is on the page (punctuation, link markup, sentence splits and case allowed; any such difference is noted). PARTIAL = a word, clause or sentence of NHA's revision differs or is missing, or old text NHA replaced is still there. Fidelity to the instruction is judged, not style. Banned words in NHA's own wording (seamless, utilise/utilize, leverage, robust, em dash) are called out per row.

Sources:
- A = `raw15_Sandbox2.0_M1_getting_started_glossary_.md` (15 Sept; byte-identical to the 21 Sept resend `z21_...`)
- B = `zobs_ABHA_Updated_Content_Sbx_2.0.md` (21 Sept)
- C = `zobs_M1.md` (21 Sept, M1 API reference)

## Getting started (A, "Getting Started", URL /docs/hiecm/v3)

Target: `hiecm/v3/getting-started/index.mdx` (slug `/hiecm/v3`).

| ID | NHA doc + section | NHA instruction (<=25 words) | Target file:line | Status | Evidence/notes |
|---|---|---|---|---|---|
| GS-1 | A, Getting Started row 1 | Replace "The Ayushman Bharat Digital Mission is India's national health data network..." with "Ayushman Bharat Digital Mission (ABDM) is India's national digital health ecosystem..." | getting-started/index.mdx:20-26 | APPLIED | All words present. NHA's one sentence "...digital registries, while facilitating secure and consent-driven exchange..." is rendered as two: "...digital registries. It also facilitates secure and consent-driven exchange...". No banned words in NHA text. |
| GS-2 | A, Getting Started row 2 | Replace "There is no central store of health records..." with "ABDM does not maintain a centralized repository of health records..." | getting-started/index.mdx:28-37 | APPLIED | Verbatim, all five sentences. |

## M1 milestone page (A, "ABDM Milestone 1"; B items 1 and 2)

Target: `hiecm/v3/milestones/m1.mdx`.

| ID | NHA doc + section | NHA instruction (<=25 words) | Target file:line | Status | Evidence/notes |
|---|---|---|---|---|---|
| M1-1 | A, M1 table 1 row 1 | Rename title "M1 Create: ABHA identity" to "Milestone 1: ABHA Creation and Management" | m1.mdx:2, m1.mdx:16 | PARTIAL | Title is "M1 Identity: Create and verify ABHA" (frontmatter line 2, H1 line 16). Milestones index uses "M1 Identity: ABHA Creation and Verification" (`milestones/index.mdx:176`). NHA's exact title "ABHA Creation and Management" appears nowhere. |
| M1-2 | A, M1 table 1 row 2 | Replace intro "Milestone 1 is the identity milestone of ABDM..." with "Milestone 1 focuses on the creation and management of ABHA..." | m1.mdx:18-27 | APPLIED | Verbatim; glossary links added on ABHA and ABDM. |
| M1-3 | A, M1 table 2 row 1 | "In short" heading: revision column reads "Milestone 1: ABHA Creation and Management" | m1.mdx:31 | PARTIAL | Heading still "## In short". Read together with M1-1: NHA's title label was not adopted anywhere on the page. |
| M1-4 | A, M1 table 2 row 2 | Replace In short body with "Milestone 1 focuses on ABHA creation, authentication, and profile management functionalities..." (5 sentences) | m1.mdx:33-47 | APPLIED | All five sentences present, as a lead paragraph plus four bullets. NHA wrote "utilizes distinct gateway and user access tokens" and "should utilize token validity"; page has "uses" (line 39) and "should use" (line 42): banned word replaced. |
| M1-5 | A, M1 table 3 | Rename "What M1 gives you" to "Capabilities Enabled Under Milestone 1 (M1)" | m1.mdx:49 | APPLIED | "## Capabilities enabled under Milestone 1 (M1)" (sentence case). `LegacyAnchor what-m1-gives-you` retained at line 51 for old links. |
| M1-6 | A, capabilities table, Session and tokens | "Establish gateway sessions, manage access and refresh tokens, and retrieve public key certificates required for secure ABDM interactions." | m1.mdx:55 | APPLIED | Verbatim. |
| M1-7 | A, capabilities table, ABHA creation | "Support creation of ABHA and associated identifiers in accordance with ABDM onboarding and verification workflows." | m1.mdx:56 | APPLIED | Verbatim. |
| M1-8 | A, capabilities table, ABHA login | "Authenticate an ABHA holder using approved identifiers and authentication mechanisms, including mobile number, ABHA number, or ABHA address, as applicable." | m1.mdx:57 | APPLIED | Verbatim (NHA dropped "Aadhaar number" from the old list; page follows). |
| M1-9 | A, capabilities table, Profile management | "Retrieve and manage ABHA profile information, display ABHA credentials and QR codes, update eligible profile attributes, and support re-verification workflows where applicable." | m1.mdx:58 | APPLIED | Verbatim. |
| M1-10 | A, capabilities table, Scan and share | "Support patient registration through QR-based workflows and generate service or queue identifiers in accordance with organization-specific processes." | m1.mdx:59 | APPLIED | Description verbatim. Row label changed from NHA's "Scan and share" to a "Scan and Register" link (consistent with M1-41). |
| M1-11 | A, after capabilities table | Remove "M1 moves no health records. M2 Attach links them. M3 Retrieve fetches them with consent" | m1.mdx | REMOVED-OK | grep "M2 Attach": no match. |
| M1-12 | A | Remove heading "Who needs it" | m1.mdx | REMOVED-OK | grep: no match. |
| M1-13 | A | Remove "Everyone. A facility publishing as the HIP, an organisation fetching as the HIU, and a citizen using a PHR app..." | m1.mdx | REMOVED-OK | grep "Everyone. A facility": no match. |
| M1-14 | A | Remove "Aadhaar is not an ABDM building block. The ABHA service calls it for you." | m1.mdx | REMOVED-OK | grep: no match. |
| M1-15 | A, "Before you start" (3 items) | No mark from NHA (not "To be removed", no revision) | m1.mdx | NOT-APPLICABLE | NHA gave no instruction; the block is nonetheless gone from the page (grep "Before you start": no match). Removal beyond NHA's instruction; recorded for completeness. |
| M1-16 | A, "What you build, in order" (5 items) | No mark from NHA | m1.mdx | NOT-APPLICABLE | Same as M1-15: no instruction, block removed anyway (grep: no match). The mandatory/optional split it carried now lives only on the API reference. |
| M1-17 | A | Remove "Everything else in M1 is optional for both. Skip all of it... on the M1 API reference." | m1.mdx | REMOVED-OK | grep "Everything else in M1 is optional": no match. |
| M1-18 | A, "Certification" section | "(To be removed)" follows the Certification heading and paragraph | m1.mdx:344-345 | REMOVED-OK | No "Certification" section. One "Next" bullet remains: "Certification runs once, for the whole integration: Go live" (line 344). The removed paragraph's substance is not reproduced. |
| M1-19 | A, "Certification" section para 2 | Remove "Sandbox test data is in the data dictionary. Support lists the channels. The cases... M1 testing use cases." | m1.mdx | REMOVED-OK | grep "data dictionary": no match. |
| M1-20 | A, "This content is incorrect..." | Remove the ABHA-with-Aadhaar / ABHA-address-with-mobile comparison table | m1.mdx | REMOVED-OK | No comparison table on the page; grep "ABHA address with a mobile number": no match. |
| M1-21 | A | Column "ABHA with Aadhaar" is conversational, correct the language | m1.mdx | REMOVED-OK | Superseded: the whole table was removed (M1-20), so there is no column to reword. |
| M1-22 | A | Column "ABHA address with a mobile number" needs to be removed | m1.mdx | REMOVED-OK | Same as M1-20. |
| M1-23 | A (and B item 1) | Remove "A Self-Declared profile may transition to a KYC-verified profile... recommended sequence of steps for each implementation flow." | m1.mdx | REMOVED-OK | grep "Self-Declared": no match. |
| M1-24 | A | Remove "Which person is in front of you" | m1.mdx | REMOVED-OK | grep: no match. |
| M1-25 | A | Remove "This table is NHA's, from the proposed simplified M1 flow they supplied... 11 September 2026... not recommended..." | m1.mdx | REMOVED-OK | grep "This table is NHA": no match. |
| M1-26 | A, Aadhaar OTP sequence diagram | Remove the text "Communication mobile number, see below" | m1.mdx:112 | REMOVED-OK | Diagram step reads "OTP, and the mobile number for ABHA communication"; grep "see below": no match. |
| M1-27 | A, Aadhaar OTP section | Remove "Person Email verification sits between the mobile step and the address step. It is optional, so it is not drawn." | m1.mdx | REMOVED-OK | grep "Email verification": no match. |
| M1-28 | A, face authentication table | Replace "Some people cannot use the OTP route..." with "Individuals who are unable to use OTP-based authentication..." (4 sentences) | m1.mdx:132-144 | APPLIED | All four sentences present. NHA's "may utilize face authentication" is "may use face authentication" (line 134): banned word replaced. |
| M1-29 | A, after face table | Remove "The middle of this route happens on someone else's device... Show that state clearly instead of a spinner." | m1.mdx | REMOVED-OK | grep "someone else's device": no match. |
| M1-30 | A, "The PID block is encrypted by the capture device and it expires. Send it as soon as you receive it rather than storing it." | No mark from NHA | m1.mdx:171-187 | NOT-APPLICABLE | No instruction; the sentence is gone anyway. A new "ABHA creation by fingerprint or iris" section (lines 171-187) not in NHA's review was added; its text mentions the PID block once (line 177) in different words. |
| M1-31 | A, demographic authentication table | Replace "Government integrators build this route..." with "This onboarding pathway is intended for eligible government programme integrations..." (6 sentences) | m1.mdx:193-197, 214-222 | APPLIED | Sentences 1-2 before the diagram, sentences 3-6 after it. Verbatim; `enrol/byAadhaar` in code font. |
| M1-32 | A, child ABHA table | Replace "A parent or guardian can hold ABHA accounts..." with "ABDM supports guardian-based management of ABHA accounts for eligible children..." (3 sentences) | m1.mdx:228-234 | APPLIED | Verbatim. Heading "Create a child ABHA" (line 224) kept from old page; NHA gave no heading. |
| M1-33 | A | Remove section "Create an ABHA from a document, not recommended" | m1.mdx | REMOVED-OK | grep "from a document": no match. |
| M1-34 | A | Remove section "Attach a communication mobile number" | m1.mdx | REMOVED-OK | grep "communication mobile number" (section): no match; only the diagram step "mobile number for ABHA communication" remains (line 112), which NHA did not object to. |
| M1-35 | A, "ABHA login via mobile number" table | Replace "One mobile number can hold more than one ABHA... API reference lists which routes are mandatory." with the 3-sentence revision | m1.mdx:241-247, 267-269 | PARTIAL | NHA's three sentences are verbatim at 241-247. But two sentences of the replaced "Existing Statement" survive after the diagram (267-269): "Login by Aadhaar number, by ABHA number and by ABHA address follow the same two steps: request a challenge, then verify it. The M1 API reference lists which routes are mandatory." NHA's revision replaced the whole statement, so these are leftovers ("beats" became "steps"; the sentence "The challenge can be an Aadhaar OTP..." was dropped). |
| M1-36 | A | Rename header to "Find ABHA from mobile number" instead of "Find an ABHA the person has forgotten" | m1.mdx:271 | APPLIED | "## Find ABHA from mobile number"; legacy anchor kept (273). |
| M1-37 | A, Find ABHA table | Replace "People forget their ABHA..." with "This workflow enables discovery of an existing ABHA using a registered mobile number..." (4 sentences) | m1.mdx:276-280, 301-306 | APPLIED | Sentences 1-2 before the diagram, 3-4 after. One clause of the old text kept as a trailing link: "See encryption for how to do it locally." (line 305-306). Not in NHA's revision but not contradicted by it. |
| M1-38 | A | Rename header to "ABHA Profile Management" instead of "Profile, ABHA card and quick response (QR) code" | m1.mdx:308 | APPLIED | "## ABHA Profile Management"; legacy anchors kept (310-311). |
| M1-39 | A, Profile table | Replace "Once you hold a token for a person..." with "This functionality enables retrieval and management of an individual's ABHA profile..." (3 sentences) | m1.mdx:313-317, 333-336 | APPLIED | Sentences 1-2 before the diagram, sentence 3 after; NHA's missing final full stop added. |
| M1-40 | A, "Removed the below Sections" 1 | Remove section "ABHA address with a mobile number" | m1.mdx | REMOVED-OK | grep: no match (same removal as M1-22). |
| M1-41 | A, "Removed the below Sections" 2 | "A patient shares their profile at your counter" is the Scan & Register use case; separate it below M1 | m1.mdx:59, 61-67, 340-341; `hiecm/v3/use-cases/scan-and-register.mdx` | APPLIED | Section gone from m1.mdx (grep "shares their profile at your counter": no match). Standalone page `use-cases/scan-and-register.mdx` (title "Scan and Register") exists; m1.mdx links it from the capability row (59), a "Use cases" table (61-67) and "Next" (340). |
| M1-42 | B item 1 | Remove the "ABHA creation" intro paragraph "A Self-Declared profile may transition..." | m1.mdx:87 | REMOVED-OK | Paragraph gone; "## ABHA creation" survives only as a bare section heading over the four creation routes. |
| M1-43 | B item 1 | Remove "The Aadhaar-based pathways produce the 14-digit ABHA number... differ only in the Aadhaar authentication mechanism used." | m1.mdx | REMOVED-OK | grep "Aadhaar-based pathways": no match. |
| M1-44 | B item 1 | Remove the "Which creation route you must build" table (Private vs Government integrator) | m1.mdx | REMOVED-OK | grep "Which creation route": no match; no such table on the page. |
| M1-45 | B item 2 | Remove child ABHA "Create. ... Update. PATCH /v3/profile/account ... List. GET /v3/enrollment/profile/children ..." | m1.mdx | REMOVED-OK | grep "PATCH /v3/profile/account" and "enrollment/profile/children": no match. Only NHA's 3-sentence paragraph (M1-32) remains under "Create a child ABHA". |

## ABHA registry page (B item 3)

Target: `hiecm/v3/registries/abha.md`.

| ID | NHA doc + section | NHA instruction (<=25 words) | Target file:line | Status | Evidence/notes |
|---|---|---|---|---|---|
| REG-1 | B item 3, title | Replace whole page; title "ABHA Registry" + subtitle "ABHA (Ayushman Bharat Health Account): Identity Framework and Digital Health Access under ABDM" | abha.md:11-13 | APPLIED | H1 and H2 verbatim. |
| REG-2 | B item 3, intro paras | "The Ayushman Bharat Health Account (ABHA) is a unique health identifier..." + "ABHA facilitates seamless access to digital health services..." | abha.md:15-17 | APPLIED | Verbatim. NHA's word "seamless" was KEPT at line 17 (repo bans it; the only banned-word survivor in this audit). |
| REG-3 | B item 3, Components of ABHA / 1. ABHA Number | Intro sentence + definition + 5 Key Characteristics bullets | abha.md:19-33 | APPLIED | Verbatim. |
| REG-4 | B item 3, 2. ABHA Address | Definition "in the format: user@abdm" + 4 Key Characteristics bullets | abha.md:35-44 | APPLIED | Verbatim; `user@abdm` in code font. |
| REG-5 | B item 3, Identity Verification Mechanisms / Verification Modes | Intro + Aadhaar OTP, Face, Biometric, Demographic descriptions | abha.md:46-66 | APPLIED | Verbatim, all four modes. |
| REG-6 | B item 3, Child ABHA | Definition + 4 Key Features bullets | abha.md:68-77 | APPLIED | Verbatim. |
| REG-7 | B item 3, ABHA Address Guidelines | Permitted Characters (3) + Validation Rules (4) + "Organizations should rely on ABDM validation services..." | abha.md:79-96 | APPLIED | Verbatim. |
| REG-8 | B item 3, Information Associated with an ABHA | 5-row Field Category / Description table | abha.md:98-108 | APPLIED | Verbatim. |
| REG-9 | B item 3, Role of ABHA Across ABDM Milestones | M1 list (5 items) + Supported Login Options (4) + M2 + M3 paragraphs | abha.md:110-135 | APPLIED | Verbatim; NHA's hyphen headings ("Milestone 1 (M1) - ABHA Management") kept as hyphens, not em dashes. |
| REG-10 | B item 3, Importance of ABHA in ABDM | Intro + 5 bullets + closing sentence "Every ABDM health information exchange workflow begins with a valid ABHA identity..." | abha.md:137-147 | APPLIED | Verbatim. Note: frontmatter `source:` (line 5) still cites the old Postman/simplified-M1 sources rather than NHA's 21 Sept doc, and `description:` (line 4) is the old page's. Content is fully replaced. |

## M1 API reference asks (C)

Targets: `hiecm/v3/api/m1/**`, `site/src/data/api/*--m1-*.json`, `catalogue/openapi/hiecm/v3/hiecm-m1.yaml` (generated pages; the yaml is the source).

| ID | NHA doc + section | NHA instruction (<=25 words) | Target file:line | Status | Evidence/notes |
|---|---|---|---|---|---|
| API-1 | C ask 1 | Description of all body parameters should be there (post swagger updation) | site/src/data/api/*--m1-*.json | PARTIAL | 122 M1 operations, 496 body fields, 34 without a description. Missing: `txnId`, `abhaAddress`, `preferred` on `enrol/abha-address` in all four creation routes (aadhaar-otp-08, face-09, fingerprint-07, iris-07); `scope` on `enrol/auth/init` (face create 01, face login 01); `scope`, `txnId` on `enrol/capturePID` (face create 02, find-abha-face 03, face login 02); plus 14 more of the same shape. |
| API-2 | C ask 2 | Profile-fetch API must not sit under the Session heading; keep only Session API and Fetch Public Key API there | api/m1/endpoints/m1-access-tokens-encryption/ | APPLIED | Group contains exactly `01-gateway-post-gateway-v3-sessions.mdx` and `02-m1-get-v3-profile-public-certificate.mdx`; journey JSON says step 1 of 2. |
| API-3 | C ask 3 | Remove the Keycloak term; rename to Generate Access Token | api/m1/endpoints/m1-access-tokens-encryption/01-...sessions.mdx:3-4 | APPLIED | title/sidebar_label "1. Generate access token"; operation summary "This API is invoked to generate access token." grep -i keycloak across hiecm-m1.yaml, hiecm-gateway.yaml, api/m1, milestones/m1.mdx, getting-started, concepts: no match. |
| API-4 | C ask 4 | Inconsistent explanation of Client Id and Client secret | site/src/data/api/gateway-post-gateway-v3-sessions--m1-access-tokens-encryption-01.json (body) | APPLIED | One description each: clientId "The client ID issued to the integrator by ABDM at registration."; clientSecret "The client secret issued to the integrator by ABDM along with the client ID."; grantType "...e.g. client_credentials." NHA's screenshot is not in the markdown, so the original inconsistency cannot be quoted; no second, conflicting description exists in the operation. |
| API-5 | C ask 5 | Remove the mention of callback from the M1 Session API | same sessions JSON; hiecm-m1.yaml | REMOVED-OK | grep -ci callback in the sessions operation JSON: 0; in hiecm-m1.yaml: 0. |
| API-6 | C ask 6 | Correct the English: "This API is for fetching Public key used for encryption of Aadhar, OTP, Mobile and other fields which require encryption." | hiecm-m1.yaml:26523; 02-m1-get-v3-profile-public-certificate.mdx:6 | APPLIED | yaml: "This API is used to fetch the public key used for encryption of Aadhaar, OTP, mobile and other fields which require encryption." Page description: "Fetch the public key used for encryption of Aadhaar, OTP, mobile and other fields which require encryption." Summary "Get public certificate (RSA encryption key)". NHA's "Aadhar" spelled "Aadhaar". |
| API-7 | C ask 7 | In scope, search-abha should be there | hiecm-m1.yaml:16999-17010, 17165, 17202-17238, 17819-17830, 17985 | APPLIED | `POST /abha/api/v3/profile/account/abha/search` request body scope `["search-abha"]` (schema example and named example) on all five find-abha routes; the follow-on OTP step scope `["abha-login","search-abha","mobile-verify"]` (17165) and face step `["abha-login","search-abha","aadhaar-face-verify"]` (17985). NHA's screenshot is not in the markdown, so the exact API it pointed at is inferred. Line 17991 keeps a note that Postman sends `face-auth` where the spec says `aadhaar-face-verify`, "confirm with NHA". |

## Resources, test cases, support (A)

| ID | NHA doc + section | NHA instruction (<=25 words) | Target file:line | Status | Evidence/notes |
|---|---|---|---|---|---|
| RES-1 | A, M1 Test Cases row 1 | Replace "M1 is the identity milestone, so its cases are about..." with "Milestone 1 (M1) covers the creation of an ABHA and the verification of ABHA during patient registration..." | resources/testing/m1 (absent) | NOT-APPLICABLE | Page deleted in commit 6bed85a1a ("the testing pages come down until NHA's test cases arrive"). NHA's replacement sentence appears nowhere in site/docs. |
| RES-2 | A, M1 Test Cases row 2 | Replace "Four creation routes are covered end to end..." with "Milestone 1 (M1) includes the creation of ABHA through Aadhaar OTP, Aadhaar Biometric..., QR based scan and register." | resources/testing/m1 (absent) | NOT-APPLICABLE | As RES-1. |
| RES-3 | A, M1 Test Cases row 3 | Replace "Demographic authentication is open to trusted entities..." with "Demographic Authentication is applicable only to government entities as per ABDM guidelines." | resources/testing/m1 (absent) | NOT-APPLICABLE | As RES-1. |
| RES-4 | A, M1 Test Cases row 4 | Replace "One case is about your own system rather than ours." with "Detailed Test cases listing is given below." | resources/testing/m1 (absent) | NOT-APPLICABLE | As RES-1. |
| RES-5 | A, M1 Test Cases row 5 | Remove "One ABHA number resolves to one patient record in it." | resources/testing/m1 (absent) | REMOVED-OK | Page deleted; sentence absent from site/docs. |
| RES-6 | A, M1 Test Cases row 6 | Remove "66 are certification cases, and each keeps the id you will be asked about at certification." | resources/testing/m1 (absent) | REMOVED-OK | As RES-5. |
| RES-7 | A, M1 Test Cases row 7 | Remove "56 are Portal checks, which are suggestions rather than requirements." | resources/testing/m1 (absent) | REMOVED-OK | As RES-5. |
| RES-8 | A, M1 Test Cases row 8 | Remove "proving it belongs to the person in front of you" | resources/testing/m1 (absent) | REMOVED-OK | As RES-5. |
| RES-9 | A, M1 Test Cases row 9 | Remove "if you are one" | resources/testing/m1 (absent) | REMOVED-OK | As RES-5. |
| RES-10 | A, M1 Test Cases row 10 | Replace existing test cases with new test cases | resources/testing/m1 (absent) | MISSING | Old cases removed with the page; no new M1 test cases published. Depends on NHA supplying the cases (commit message: "the content session recreates them from NHA's test cases when those arrive"). |
| RES-11 | A, M2 Test Cases row 1 | Replace "M2 attaches the records you hold..." with "Milestone 2 (M2) enables the linking of health records and care contexts..." | resources/testing/m2 (absent) | NOT-APPLICABLE | Page deleted in 6bed85a1a; NHA sentence not on site. |
| RES-12 | A, M2 Test Cases row 2 | Replace "Whoever holds a record and publishes it is the HIP." with "The entity responsible for maintaining and providing health information is designated as the HIP..." | resources/testing/m2 (absent) | NOT-APPLICABLE | As RES-11. |
| RES-13 | A, M2 Test Cases row 3 | Replace the five-route/36-cases paragraph with "Milestone 2 (M2) primarily covers two key workflows: HIP-Initiated Linking and User-Initiated Linking..." | resources/testing/m2 (absent) | NOT-APPLICABLE | As RES-11. |
| RES-14 | A, M2 Test Cases row 4 | Replace existing test cases with new test cases | resources/testing/m2 (absent) | MISSING | As RES-10. |
| RES-15 | A, M3 Test Cases row 1 | Replace "M3 is about asking for records you did not create." with "Milestone 3 (M3) enables the access and retrieval of health information from participating HIPs..." | resources/testing/m3 (absent) | NOT-APPLICABLE | Page deleted in 6bed85a1a; NHA sentence not on site. |
| RES-16 | A, M3 Test Cases row 2 | Replace "Whoever asks is the HIU." with "The entity requesting access to health information is designated as the HIU..." | resources/testing/m3 (absent) | NOT-APPLICABLE | As RES-15. |
| RES-17 | A, M3 Test Cases row 3 | Replace the consent-lifecycle/16-cases paragraph with "This section covers the core consent lifecycle scenarios under Milestone 3 (M3)..." | resources/testing/m3 (absent) | NOT-APPLICABLE | As RES-15. |
| RES-18 | A, M3 Test Cases row 4 | Replace existing test cases with new test cases | resources/testing/m3 (absent) | MISSING | As RES-10. |
| RES-19 | A, Resources URL | Replace "What helps you build against HIE-CM..." with "This section contains the test scenarios applicable for ABDM integration and certification..." (3 sentences) | hiecm/v3/resources/index.mdx:12-16 | APPLIED | Verbatim. Note the page then says "The certification pack NHA issues names the cases each milestone is tested against." (line 20) with no test pages under it (see RES-10). |
| RES-20 | A, Support URL | Replace entire page: intro + "1. Support Ticketing Platform (Recommended)" with sandboxsupport.abdm.gov.in + "2. Integration Support Email" integration.support@nha.gov.in | support/index.md:11-24 | APPLIED | Both channels and both links present, as H2 sections rather than a numbered list. Wording lightly normalised: "raise a support request through the designated support channels" for NHA's "support requests may be raised through..."; "Queries may also be sent to" for NHA's "Queries may also submit to". An extra "Before you raise a request" section (26-30) was added. |

## ABDM landing page (A, "ABDM Landing Page", sbxai.abdm.gov.in)

The landing page NHA reviewed is `https://sbxai.abdm.gov.in/#paths`. Its source is not in this repository: `site/src/pages/index.tsx` carries none of the "Current New Website Content" strings (grep "Build on India's health data network", "Roles, not kinds of software": no match anywhere in the repo). Every row is therefore NOT-APPLICABLE here; where NHA's suggested copy was reused on a docs page, the reuse is noted so the parent can cross-check the landing repo separately.

| ID | NHA doc + section | NHA instruction (<=25 words) | Target file:line | Status | Evidence/notes |
|---|---|---|---|---|---|
| LP-1 | A, Landing, Title | "ABDM Sandbox Environment" | not in repo | NOT-APPLICABLE | Landing source elsewhere. |
| LP-2 | A, Landing, Title description | "The Ayushman Bharat Digital Mission has developed digital building blocks and APIs to enable a seamless digital healthcare experience..." | not in repo | NOT-APPLICABLE | NHA wording contains "seamless" (banned in repo). Not reused in docs. |
| LP-3 | A, Landing, Primary CTA | "Apply for Sandbox Integration" | getting-started/sandbox.mdx:46 (reuse) | NOT-APPLICABLE | Reused as the register button label in the docs sandbox page. |
| LP-4 | A, Landing, Secondary CTA | "Read Documentation" | not in repo | NOT-APPLICABLE | |
| LP-5 | A, Landing, Audience card Healthcare Facility | "Healthcare providers and facilities (hospital, clinic, lab or pharmacy.) that create, maintain and exchange digital health records." | not in repo | NOT-APPLICABLE | |
| LP-6 | A, Landing, Audience card Health Software Provider | "Technology providers (EMR, HMIS, LMIS or PMS) developing ABDM-enabled healthcare information systems..." | not in repo | NOT-APPLICABLE | |
| LP-7 | A, Landing, Audience card PHR Application | "Applications that enable individuals to access, manage and share their health records and provide consent..." | not in repo | NOT-APPLICABLE | |
| LP-8 | A, Landing, How it works heading | "How Sandbox Integration Works. Complete the integration process in 6 stages" | getting-started/sandbox.mdx (reuse) | NOT-APPLICABLE | "Complete the integration process in 6 stages" reused in sandbox.mdx. |
| LP-9 | A, Landing, Subheading | "Use a single workspace to manage the integration from account creation to production review..." | getting-started/sandbox.mdx (reuse) | NOT-APPLICABLE | "single workspace" reused in sandbox.mdx. |
| LP-10 | A, Landing, Step 1 | "01. Send Request: Submit a request to access the ABDM Sandbox APIs." | getting-started/sandbox.mdx:40 (reuse) | NOT-APPLICABLE | Reused verbatim as the opening of sandbox.mdx step 1. |
| LP-11 | A, Landing, Step 2 | "02. Get Access: Receive Sandbox access after approval by the Health Tech Committee." | getting-started/sandbox.mdx (reuse) | NOT-APPLICABLE | Reused. |
| LP-12 | A, Landing, Step 3 | "03. Integrate APIs: Integrate the applicable ABDM APIs with your software solution." | getting-started/sandbox.mdx (reuse) | NOT-APPLICABLE | Reused. |
| LP-13 | A, Landing, Step 4 | "04. Complete Functional Testing and Security Audit" | getting-started/sandbox.mdx (reuse) | NOT-APPLICABLE | Reused. |
| LP-14 | A, Landing, Step 5 | "05. Complete the Health Tech Committee Demonstration" | getting-started/sandbox.mdx (reuse) | NOT-APPLICABLE | Reused. |
| LP-15 | A, Landing, Step 6 | "06. Go Live: Move the approved integration to the production environment..." | getting-started/sandbox.mdx, going-live.mdx (reuse) | NOT-APPLICABLE | Reused. |
| LP-16 | A, Landing, Milestones heading | "ABDM Integration Milestones" | milestones/index.mdx (reuse) | NOT-APPLICABLE | Heading reused on the docs milestones index. |
| LP-17 | A, Landing, Milestones intro | "ABDM integration is divided into milestones. These cover creation and verification of ABHA..." | not verified | NOT-APPLICABLE | |
| LP-18 | A, Landing, Milestone 1 | "Milestone 1: ABHA Creation and Verification. Enable ABHA Number creation and verification... for seamless patient registration." | milestones/index.mdx:176 (reuse) | NOT-APPLICABLE | NHA wording contains "seamless". Docs reuse "ABHA Creation and Verification" as the M1 label. Note this conflicts with A's M1-page title "ABHA Creation and Management" (M1-1). |
| LP-19 | A, Landing, Milestone 2 | "Milestone 2: Health Information Provider Services..." | milestones/index.mdx (reuse) | NOT-APPLICABLE | Label reused. |
| LP-20 | A, Landing, Milestone 3 | "Milestone 3: Health Information User Services..." | milestones/index.mdx (reuse) | NOT-APPLICABLE | Label reused. |
| LP-21 | A, Landing, Milestone 4 | "Milestone 4: National Healthcare Providers Registry..." | milestones/index.mdx (reuse) | NOT-APPLICABLE | Label reused. |
| LP-22 | A, Landing, PHR track | "Building the patient's app (PHR)? Implement the applicable ABHA and PHR services..." | not verified | NOT-APPLICABLE | |
| LP-23 | A, Landing, Which milestones heading | "Select Milestones Based on the Requirement of Your Software" | not in repo | NOT-APPLICABLE | grep: no match in docs. |
| LP-24 | A, Landing, Which milestones intro | "The milestones required for integration depend on the role of the software..." | not verified | NOT-APPLICABLE | |
| LP-25 | A, Landing, Role card Health facility | "Health Facility or Health Facility Software: May create and verify ABHA, link and share..." | milestones/index.mdx (reuse) | NOT-APPLICABLE | Card title reused. |
| LP-26 | A, Landing, Role card Service using records | "Health Information User: May request and view health records held by another entity..." | not verified | NOT-APPLICABLE | |
| LP-27 | A, Landing, Role card PHR | "Personal Health Record Application: Enables individuals to manage their ABHA details..." | milestones/index.mdx (reuse) | NOT-APPLICABLE | Card title reused. |
| LP-28 | A, Landing, Other gateways | "Other ABDM Digital Gateways: Unified Health Interface ... National Health Claims Exchange ..." | getting-started/index.mdx:44-45 (reuse) | NOT-APPLICABLE | The UHI and NHCX descriptions are reused verbatim in the docs gateway table. |
| LP-29 | A, Landing, Build with AI heading | "Use ABDM Documentation with AI-assisted Development Tools" | not in repo | NOT-APPLICABLE | grep: no match. |
| LP-30 | A, Landing, Build with AI intro | "Developers may use supported AI-assisted tools to search ABDM integration guides..." | not verified | NOT-APPLICABLE | |
| LP-31 | A, Landing, AI tool 1 | "Search the Documentation (MCP server)..." | not in repo | NOT-APPLICABLE | grep: no match. |
| LP-32 | A, Landing, AI tool 2 | "Set Up Your Coding Assistant..." | not in repo | NOT-APPLICABLE | grep: no match. |
| LP-33 | A, Landing, AI tool 3 | "Use Milestone-specific Guidance..." | not in repo | NOT-APPLICABLE | grep: no match. |
| LP-34 | A, Landing, AI disclaimer | "Review all AI-generated code against the official ABDM documentation and test it in the Sandbox." | getting-started/build-with-ai.mdx (reuse) | NOT-APPLICABLE | Reused. |
| LP-35 | A, Landing, Milestone skills list | "M1 — ABHA Creation and Verification; M2 — Linking Health Records...; M3 — ...; M4 — NHPR Registration; PHR Services; FHIR Bundles" | site/src/components/docs/SkillPicker.tsx (partial reuse) | NOT-APPLICABLE | NHA wording uses em dashes (banned in repo). SkillPicker carries "ABHA Creation and Verification" without the dash. |
| LP-36 | A, Landing, Developer experience heading | "ABDM Integration Resources" | hiecm/v3/resources/index.mdx:22 (reuse) | NOT-APPLICABLE | Reused as an H2. |
| LP-37 | A, Landing, Developer experience intro | "Access the documentation, AI-assisted tools and reference projects required to support your ABDM integration." | hiecm/v3/resources/index.mdx:24-25 (reuse) | NOT-APPLICABLE | Reused verbatim. |
| LP-38 | A, Landing, Dev resource 1 | "ABDM Documentation: Access versioned guides, API references, milestone details, error information and change logs for HIE-CM, UHI and NHCX." | hiecm/v3/resources/index.mdx:28-29 (reuse) | NOT-APPLICABLE | Reused verbatim. |
| LP-39 | A, Landing, Dev resource 2 | "AI-assisted Integration Tools: Use milestone guidance, FHIR references and the documentation MCP server..." | hiecm/v3/resources/index.mdx:31-32 (reuse) | NOT-APPLICABLE | Reused verbatim. |
| LP-40 | A, Landing, Dev resource 3 | "National Health Claims Exchange: Understand how payers, third-party administrators and healthcare providers exchange health insurance claims through NHCX." | hiecm/v3/resources/index.mdx:34-35 (reuse) | NOT-APPLICABLE | Reused verbatim. |
| LP-41 | A, Landing, Dev resource 4 | "CARE Reference Environment: Explore planned reference workflows for ABDM integration and follow the progress of the open-source project." | hiecm/v3/resources/index.mdx:37-38 (reuse) | NOT-APPLICABLE | Reused verbatim; card has no href. |
| LP-42 | A, Landing, Final CTA heading | "Apply for ABDM Sandbox Integration" | not in repo | NOT-APPLICABLE | grep: no match. |
| LP-43 | A, Landing, Final CTA description | "Eligible entities may apply for access to the ABDM Sandbox to integrate and test their software with ABDM APIs. Provide the required organisation..." | getting-started/sandbox.mdx:40-43 (reuse) | NOT-APPLICABLE | Reused verbatim in sandbox.mdx step 1. |
| LP-44 | A, Landing, Final CTA buttons | "Apply for Sandbox Integration; Read Getting Started Guide" | getting-started/sandbox.mdx:46 (partial reuse) | NOT-APPLICABLE | First label reused; "Read Getting Started Guide" not found. |

## Glossary (A, "ABDM Glossary")

Targets: `hiecm/v3/getting-started/glossary.mdx` (wrapper), `_glossary/_shared.mdx` (ABDM-wide terms), `_glossary/_hiecm.mdx` (HIE-CM terms).

| ID | NHA doc + section | NHA instruction (<=25 words) | Target file:line | Status | Evidence/notes |
|---|---|---|---|---|---|
| GL-0 | A, Glossary intro | "The following terms are defined in accordance with the official terminology used by ABDM and NHA." | getting-started/glossary.mdx:15-17 | APPLIED | Verbatim, followed by a sentence pointing to the UHI and NHCX glossaries. |
| GL-1 | A, ABDM | Government of India initiative... common standards and core digital building blocks... | _shared.mdx:10 | APPLIED | Verbatim. |
| GL-2 | A, ABHA | Account used by an individual... ABHA Number for unique identification... ABHA Address for consent-based access | _shared.mdx:14 | APPLIED | Verbatim; cross-links added. |
| GL-3 | A, ABHA address | Unique, self-declared username that enables an individual to link, access and share health records | _shared.mdx:18 | APPLIED | Verbatim. |
| GL-4 | A, ABHA number | Unique 14-digit number... trusted identity... Creation and use are voluntary | _shared.mdx:22 | APPLIED | Verbatim. |
| GL-5 | A, FHIR | HL7 standard... ABDM adopts applicable FHIR R4 profiles published by NRCeS | _shared.mdx:26 | APPLIED | Verbatim. |
| GL-6 | A, Gateway | Enables secure routing and exchange... callback endpoints and authentication mechanisms | _shared.mdx:30 | APPLIED | Verbatim. |
| GL-7 | A, Health Tech Committee | HTC reviews eligible integrations as part of sandbox exit and production onboarding... | _shared.mdx:34 | APPLIED | Verbatim plus "See Go live." link. |
| GL-8 | A, HFR | Comprehensive repository of public and private health facilities... unique Facility ID | _shared.mdx:38 | APPLIED | Verbatim plus "See registries." link. |
| GL-9 | A, HIE-CM | Gateway under ABDM that manages consent... consent-based exchange of interoperable health information | _shared.mdx:42 | APPLIED | Verbatim plus link. |
| GL-10 | A, HPID | Unique identifier assigned to an eligible healthcare professional upon registration and verification in the HPR | _shared.mdx:46 | APPLIED | Verbatim plus "See M4." link. |
| GL-11 | A, HPR | "The Healthcare Professionals Registry (HPR) is a comprehensive repository of healthcare professionals across recognised systems of medicine and professional categories. Registration enables verified professionals to participate in the ABDM ecosystem and access applicable digital services." | _shared.mdx:50 | MISSING | Page text is different: "the national registry of doctors, nurses and pharmacists. Registering a professional on the HPR results in the issuance of an HPID. The HPR Token can also be used to onboard a facility to the HFR." Neither NHA sentence is present. |
| GL-12 | A, NHA | Under MoHFW... responsible for the implementation of ABDM & PMJAY... | _shared.mdx:58 | APPLIED | Verbatim except "ABDM & PMJAY" written "ABDM and PMJAY". |
| GL-13 | A, NHCX | Digital gateway under ABDM... health-insurance claims information among payers, providers... | _shared.mdx:62 | APPLIED | Verbatim plus link. |
| GL-14 | A, PHR | Application enables an individual to discover, link, view and manage personal health records and provide or withdraw consent | _shared.mdx:70 | APPLIED | Verbatim plus link. |
| GL-15 | A, Sandbox | Controlled test environment... demonstrate compliance before seeking production access | _shared.mdx:78 | APPLIED | Verbatim. |
| GL-16 | A, UHI | Open network for digital health-service discovery and delivery... appointment discovery and booking | _shared.mdx:86 | APPLIED | Verbatim plus link. |
| GL-17 | A, WASA | Security assessment by a CERT-In-empanelled auditor... required security documentation for production onboarding | _shared.mdx:90 | APPLIED | Verbatim plus "See Security audit." link. |
| GL-18 | A, "HIE-CM and Integration Terms" heading + intro | Section heading and "These terms describe the principal roles, consent objects and integration concepts used within the ABDM HIE-CM framework." | glossary.mdx:23, _hiecm.mdx:4 | APPLIED | Intro sentence verbatim; section heading rendered as "## On HIE-CM" rather than NHA's "HIE-CM and Integration Terms". |
| GL-19 | A, Bridge | Registered integration endpoint... callback-based messages with the ABDM Gateway... | _hiecm.mdx:10 | APPLIED | Verbatim; link added. |
| GL-20 | A, Care context | Logical grouping of an individual's health records maintained by a HIP... reference number and display name... | _hiecm.mdx:14 | APPLIED | Verbatim; links added. |
| GL-21 | A, Consent artefact | Machine-readable record of consent... purpose, HI types, data range, frequency, expiry and participating entities | _hiecm.mdx:18 | APPLIED | Verbatim. |
| GL-22 | A, Consent manager | Enables an individual to manage consent... HIE-CM framework supports consent management... | _hiecm.mdx:22 | APPLIED | Verbatim; link added. |
| GL-23 | A, Discovery | Process through which a PHR application requests a HIP to identify available care contexts... without disclosing clinical content | _hiecm.mdx:26 | APPLIED | Verbatim; links added. |
| GL-24 | A, ECDH | Elliptic Curve Diffie-Hellman key-agreement method... encryption, key-management and payload specifications | _hiecm.mdx:30 | APPLIED | Verbatim. |
| GL-25 | A, EMR, EHR | EMR digital record within an organisation; EHR broader longitudinal view; source records remain with data custodian | _hiecm.mdx:34 | APPLIED | Verbatim plus link. |
| GL-26 | A, HI type | Category of health record covered by a consent or data-exchange request... may include prescriptions... wellness records | _hiecm.mdx:38 | APPLIED | Verbatim. |
| GL-27 | A, HIP | Entity that creates or holds an individual's health information... shares only in accordance with a valid consent artefact | _hiecm.mdx:42 | APPLIED | Verbatim; links added. |
| GL-28 | A, HIU | Authorised entity that requests and uses an individual's health information... only after valid consent | _hiecm.mdx:46 | APPLIED | Verbatim. |
| GL-29 | A, HMIS, HIS, HIMS | Terms commonly used for software supporting a facility's administrative, operational and clinical workflows... | _hiecm.mdx:50 | APPLIED | Verbatim plus link. |
| GL-30 | A, HRP | Entity responsible for storing or maintaining health information on behalf of a provider... may also perform HIP function | _hiecm.mdx:54 | APPLIED | Verbatim. |
| GL-31 | A, IMS | Digital solution used by a facility or service provider... may integrate with ABDM building blocks | _hiecm.mdx:58 | APPLIED | Verbatim. |
| GL-32 | A, LIMS, LMIS | Laboratory Information Management System... link and share diagnostic records as a HIP, request as an HIU | _hiecm.mdx:62 | APPLIED | Verbatim plus link. |
| GL-33 | A, M1 | "Milestone 1 (M1) covers ABHA-related functions implemented within an integrated application, including creation of an ABHA Number..." | _hiecm.mdx:70 | PARTIAL | Reads "Milestone 1 (M1 Identity), ABHA Creation and Verification, covers ABHA-related functions..." The inserted "(M1 Identity), ABHA Creation and Verification," is not NHA's; the rest is verbatim. |
| GL-34 | A, M2 | "Milestone 2 (M2) covers linking health records with an individual's ABHA Address..." | _hiecm.mdx:74 | PARTIAL | Reads "Milestone 2 (M2 Health Information Provider), Health Information Provider Services, covers linking..." Same insertion pattern; rest verbatim. |
| GL-35 | A, M3 | "Milestone 3 (M3) covers consent-based exchange of health information..." | _hiecm.mdx:78 | PARTIAL | Reads "Milestone 3 (M3 Health Information User), Health Information User Services, covers consent-based exchange..." Same insertion; rest verbatim. |
| GL-36 | A, M4 | "Milestone 4 (M4), also referred to as National Healthcare Providers Registry (NHPR) native integration, covers..." | _hiecm.mdx:82 | PARTIAL | Reads "Milestone 4 (M4 Registry Integration), also referred to as..." Inserted "Registry Integration"; rest verbatim. |
| GL-37 | A, PMS | Pharmacy Management System... prescription processing, dispensing, inventory and billing... HIP or HIU functions | _hiecm.mdx:86 | APPLIED | Verbatim plus link. |

Glossary terms present on the page but not in NHA's list (from the 16 Sept swagger review per `glossary.mdx:5`): KYC (_shared.mdx:52-54), OTP (64-66), Safe to Host certificate (72-74), txnId (80-82), Link token (_hiecm.mdx:64-66), Purpose of use (88-90). Not an NHA instruction from these documents; recorded so the parent knows they are additions.

## Counts

| Status | Count |
|---|---|
| APPLIED | 68 |
| PARTIAL | 8 |
| MISSING | 4 |
| REMOVED-OK | 29 |
| STILL-PRESENT | 0 |
| NOT-APPLICABLE | 57 (44 landing-page rows not in this repo, 10 test-case rows on deleted pages, 3 unmarked blocks) |
| Total rows | 166 |

## Every MISSING / PARTIAL / STILL-PRESENT row

- M1-1 PARTIAL: page title is "M1 Identity: Create and verify ABHA", not NHA's "Milestone 1: ABHA Creation and Management" (`milestones/m1.mdx:2,16`).
- M1-3 PARTIAL: "In short" heading kept; NHA's title label not adopted (`m1.mdx:31`).
- M1-35 PARTIAL: two sentences of the replaced login text survive after the diagram: "Login by Aadhaar number, by ABHA number and by ABHA address follow the same two steps... The M1 API reference lists which routes are mandatory." (`m1.mdx:267-269`).
- API-1 PARTIAL: 34 of 496 M1 body fields have no description (`enrol/abha-address` txnId/abhaAddress/preferred in 4 routes; `enrol/auth/init` scope; `enrol/capturePID` scope/txnId; 14 more).
- GL-11 MISSING: HPR definition is not NHA's text (`_glossary/_shared.mdx:50`).
- GL-33, GL-34, GL-35, GL-36 PARTIAL: M1 to M4 entries carry inserted labels "(M1 Identity), ABHA Creation and Verification," etc. that NHA did not write (`_glossary/_hiecm.mdx:70,74,78,82`).
- RES-10, RES-14, RES-18 MISSING: "Replace them with new Test cases" for M1, M2, M3; the old pages were deleted (commit 6bed85a1a) and no new cases are published. The 12 intro-sentence rewrites NHA supplied for those three pages (RES-1..4, 11..13, 15..17) are consequently on no page.

## Banned words in NHA's own wording, and what the page did

- "utilizes" / "utilize" (A, In short revision): replaced with "uses" / "use" (`m1.mdx:39,42`).
- "utilize" (A, face authentication revision): replaced with "use" (`m1.mdx:134`).
- "seamless" (B, registry page intro): KEPT verbatim (`registries/abha.md:17`). Only survivor.
- "seamless" (A, landing hero and Milestone 1 card): landing page not in this repo; not reused in docs.
- Em dashes (A, landing "Milestone skills list", audience/role card labels): landing page not in this repo; SkillPicker reuse drops the dash.
- No "leverage" or "robust" in any NHA revision text. No em dash in any NHA revision applied to a docs page; none found in the target pages.

## Observations beyond NHA's instructions (not counted above)

- `m1.mdx:171-187` adds an "ABHA creation by fingerprint or iris" section not present in NHA's review (commit fc8669e0d).
- `m1.mdx:15-16`, `30` "Before you start" and "What you build, in order" were removed without an NHA mark (M1-15, M1-16).
- `registries/abha.md:4-5` frontmatter `description` and `source` still describe the pre-replacement page.
- `hiecm-m1.yaml:17991` keeps an unresolved note: Postman scope `face-auth` vs spec `aadhaar-face-verify`, "confirm with NHA".
- `resources/index.mdx:18-20` has a "Testing use cases" heading over no test pages.
