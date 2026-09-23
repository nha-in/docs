# Image Catalog — NHCX Sandbox Site Assets

All 86 image assets from `https://hcxsbx.abdm.gov.in/images/`, stored in `../images/`.
Identified by visual inspection and by mapping each file to the variable that references it
in the site's `main.js` bundle. Grouped by what they are.

## Content diagrams (used on documentation pages)

| File | Size | What it shows |
|---|---|---|
| `NHCX_Diagram-2 (Visualization of NHCX across Provider-Payer Apps).png` | 2640×1404 | Intro page hero diagram: NHCX as the hub between multiple provider apps and payer apps |
| `NHCX_Benefits.png` | 1765×903 | Benefits-of-NHCX infographic (intro page) |
| `NHCX Relay Example (appendix).png` | 649×970 | Appendix: NHCX message relay example (technical specifications) |
| `344d28522d6ac1e82fcb.png` | 1769×2834 | **Sequence diagram: Claims flow + Payment flow** — Provider ↔ NHCX ↔ Payer, 12 steps (eligibility/pre-auth/claims request routing, payment notification & acknowledgement) |
| `c990d57fa5acde019c5a.png` | 3076×1957 | **Sequence diagram: Coverage Eligibility flow with Forwards** — Provider → NHCX → Payer 1 forwarding request parts to Payer 2/Payer 3, 14 steps (multi-payer forwarding protocol) |
| `72bab2e782524ba9edb8.png` | 2335×1957 | **Sequence diagram: Preauth/Claim with additional-document communication** — /preauthorisations/submit, /claim/submit, communication/request & on_request, final adjudicated response |
| `2e8f77446f275d528eef.png` | 679×981 | **Sequence diagram (compact/mermaid-style): Claims flow + Payment flow** — Provider ↔ HCX ↔ Payor (older HCX naming) |
| `b0448f9214e8dc2bde7a.png` | 1440×1130 | Isometric illustration: NHCX cloud connecting PROVIDER and PAYER server stacks (transparent bg) |
| `652a27d5a6f3bfe63910.jpg` | 1440×1513 | Same isometric NHCX/Provider/Payer illustration on lavender dotted background (home page hero) |
| `75afe250c7a48064c6b4.png` | 3367×1723 | **Provider onboarding flow diagram**: Hospital Nodal Officer → HFR/ABDM enrolment → Register Participant → NHCX → NHCX Registry (with client-credentials loop) |
| `44033a5b2eb92988b0ff.png` | 2454×1402 | **Payer onboarding flow diagram**: Insurance/TPA Nodal Officer → IRDA/NHA Portal → Health Claims Platform → HCX Registry (Payer/TPA registry optional) |
| `c4d92bd6b1a687b835be.png` | 2607×1177 | **Onboarding journey chevron flow (5 stages)**: Create HFR ID / ABDM M1 compliance → NHCX Sandbox → Functional testing → Access to Production → Go Live, with checklist under each stage |
| `75afe250…` note | | the two flow diagrams above also appear inside the onboarding PDFs |
| `624e86b9036344cb82f7.png` | 2607×1177 | (duplicate style of the 5-stage onboarding journey — provider variant with HTC Demo/WASA checklists) |
| `b3d70747e18496d74840.png` | 1708×738 | **NHCX-PMJAY-HMIS benefits table**: Elimination of mandatory TMS dependency, single-source PMJAY data capture, choice of PMJAY-compliant systems, scalable operations (hmisdocuments page) |
| `0d700b69720cea269a57.png` | 1644×401 | **Problem-statement icon strip**: multiple follow-ups/lack of visibility, long receivable cycles, high processing costs, poor scalability, unpleasant patient experience |
| `c990d57…/72bab2…` note | | these sequence diagrams are shown on /technical-specifications open-protocol pages |

*(The 4-stage NHCX-PMJAY-HMIS journey chevron — ABDM M1 compliance → NHCX Sandbox Registration → NHCX-PMJAY-HMIS integration → Sandbox Exit Testing, with yellow "THIS JOURNEY IS TENTATIVE AND NOT FINAL" disclaimer — is `75afe250c7a48064c6b4.png`'s sibling `c4d92bd6…`; both chevron variants appear on the hmisdocuments accordion.)*

## Photos / media-center images

| File | Size | What it is |
|---|---|---|
| `1f4f2049782000b522bd.png` | 1280×719 | Photo: NHA auditorium event — official addressing audience over video conference (National Conclave for ABDM Integrators) |
| `19ecfb2be3d113203396.jpg` | 626×417 | Photo: hospital waiting room (LiveMint article thumbnail) |
| `42e339e581a2ea461a5e.png` | 1440×757 | Family photo with purple overlay (home page banner background) |
| `045dc54804181815dee6.png` | 1423×560 | Same family photo with blue-green gradient overlay (banner variant) |
| `63b8fffde3587124b28f.png` | 785×1032 | Purple decorative background with circles (card background) |
| `cb50975c8c2815deea73.png` | 1440×526 | Purple decorative banner background with circles |

## Logos

| File | Size | What it is |
|---|---|---|
| `08e42e24071c083b876e.png` | 512×512 | Ayushman Bharat **PM-JAY** round logo |
| `5b1d513563215885f500.png` | 800×341 | **International Year of Cooperatives 2025** logo |
| `17813b9e803a6fa44e53.png` | 142×62 | **NHA (Ayushman/National Health Authority)** small logo — used as thumbnail for NHA/PIB media items |
| `805d4bf49b80bc32f7ee.png` | 511×194 | White-on-transparent logo (footer NHCX/NHA wordmark; appears blank on white) |
| `1eed324ccdf3eec897e0.png` | 378×133 | Livemint logo |
| `52c2c75f57e15f33a453.png` | 300×98 | eHealth logo |
| `6c72644533b0070f7beb.png` | 182×70 | BFSI Economic Times logo |
| `cf133927a4c935e77f52.jpg` | 225×97 | Life Insurance International logo |
| `9f9f0ff91a4aaa2fa5fe.jpg` | 200×200 | Digital Health News logo |
| `f47a3d06701958a1d69f.png` | 469×107 | DataQuest India logo |
| `d54e5558ea0760d35915.jpg` | 350×146 | Economic Times logo |
| `67031e2594c4c68efba0.png` | 204×192 | CNBC-TV18 logo |

## Icons (UI)

| File | What it is |
|---|---|
| `97ef84d977b39c5a25c9.png` | Checklist-with-gears icon (claims processing) |
| `708177fb2f00ff41b27e.png` | Document-with-X icon (claim rejection) |
| `128352df35cd56d2002a.png` | Person-carrying-document icon |
| `c7b8d930ebd12dac7cb0.png` | 554×554 icon (dashboard stat) |
| `330366288a5198286781.png`, `6432ec77f64425bad944.png`, `b5761d563c1e739e4995.png` | 176px dashboard/stat icons |
| `fb5df45a60a2515f45de.png`, `56fde92c34e43754f008.png`, `b3b4e5ea256e4423796d.png`, `b6f083ebe532dfac6c3d.png`, `3c88fd36b93d6d5435ed.png`, `7a7af0ae951077714402.png`, `9a2912402401c01f36cb.png` | small UI icons/decorations |

## SVG icons (37 files, identified from internal ids)

- Social: `a4b1072c74ea8f098d19.svg` (Facebook), `d22caedad67545e349e3.svg` (YouTube), `c60cd8675b0a70be524c.svg` (Twitter/X), `cdf33ffc70a513976ab1.svg` (Instagram), `6d16cff8879442fda2a9.svg` (LinkedIn)
- Dashboard stats: `2d05fbe8fdf9f5e9a052.svg` (Health ID generated), `c30e81fcb69dbcf2dea8.svg` (Health Facilities), `c5577b7e000dace5f67f.svg` (Doctor Registered), `c20e7d998466e1554ac0.svg` (New Patient), `da77792e1c8c02f9233b.svg` (successfully integrated integrators)
- UI: `061ea40fdd24487f141f.svg` / `e5c65867ecc78ed79e54.svg` (delete), `5833867bf9d9528f214a.svg` (search), `77240e046c23db677533.svg` (hide password), `1aca6c4ed22670e73b47.svg` (upload cloud), `1149e2e1578ae251a9e3.svg` (chevron down), `2630a3e3eab21c607e21.svg` (slick carousel arrows), `8320031100ef7d1d2041.svg` (large decorative graphic)
- The remaining unnamed SVGs are arrows, dividers, bullets and small decorations (all < 6 KB).
