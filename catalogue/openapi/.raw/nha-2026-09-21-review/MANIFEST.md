# NHA review, 21 September 2026

The documents NHA returned on 21 September 2026 with its AI sandbox observations, stored as received, except the PHR V3 document, whose sandbox ABHA numbers and mobile numbers are replaced by placeholders under the rules the 16 September set uses. The four 15 September review files resent in the same zip are byte-identical to `nha-2026-09-15-review/` and are not repeated here. The patient record share document and Postman collection are in `nha-2026-09-21-record-share/`. The M1 swagger reissued on 22 September is in `nha-2026-09-22/`.

| File | sha256 | What it holds |
| --- | --- | --- |
| `ABHA PHR V3 Updated.docx` | `cae2fa98280ab993510d8fe700d31d5481c8650511b68ea0730d6e7db13d7e19` (original `3c7251acfdc8520952a8eff0075672c053bed517ac9c11fabfb057bb42a27edb`) | The PHR application services document, the final source for P1 to P4: 45 PHR calls, the gateway, scan and profile share, consent, data flow, subscription, both linking flows, and the error code list. Redacted: mobile 5, abha-number 28, email 4; the original is held outside git |
| `ABHA Updated Content Sbx 2.0.docx` | `4e179e0236d998353b8c5ebaae00d43fb2489e0f54e06b57cc9ea181d3bea030` | Two blocks to remove from the M1 milestone page and the replacement text for the ABHA registry page |
| `M1.docx` | `85c9ce99997aaf9f184762f360bb8e3a5673d8b814b0b65e6bf17cb5439a6614` | Seven asks on the M1 API reference: body parameter descriptions, the session group, the access token name, the client credential descriptions, no callback on the session call, the public key description, the search-abha scope |
| `Milestone 4 Document.docx` | `da4ca201a038c05a78a5eabb8bf38d712c5f00715a08ca9487b99dfe15ae55dd` | The M4 milestone page revision, the HPR glossary entry, and the note that the M4 API document and test cases were shared |
| `PHR - Sandbox (2).docx` | `49de847290e31ef8a2dd22f1eb85d52013817c639d66ee4cb9522b0aaa2972bd` | The replacement text for the PHR application participant page |
| `Sandbox2.0 M2 and M3 API review v2.docx` | `1598720e3dc683a6736b726585f24f2c0be142449375f0be550ef46a98b25370` | The 15 September API review with three rows marked Not Found or Missing, two suggestions on call order and a callbacks section, and the custom error code table for M2 |
| `Sandbox2.0 M3 flow review-21-09-2026.docx` | `0416df132bc190b6f2e582b9f61edd7db28ff3d393a100cf08de8cfd16374210` | The M3 milestone page revision, superseding the 15 September one |
