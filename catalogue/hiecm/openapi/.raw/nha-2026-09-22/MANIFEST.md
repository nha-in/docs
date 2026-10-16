# NHA M1 swagger, use-case split, 22 September 2026

Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.

One file: the M1 swagger NHA reissued with one operation per use case, tags following the M1 Postman collection, and the real URL of each operation in x-actual-path. It replaces abha/M1 ABHA Swagger 1.yaml of the 16 September set as the M1 source.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `abha/ABHA Swagger split.yaml` | `f635eaf1411d96dcf427773d45d3e6d67a57748612ca4b3217b101118620609c` | `110ea5ff59235e48819d8a6fd27017f606f822a85845ffd5f9c2d962e0f3fe82` | photo 55, token 124, abha-address 203, email 23, abha-number 153, mobile 5, pincode 13, dob 129, name 184, address 69 |

## M2 review, 22 September 2026

| File | sha256 committed | sha256 original | What it holds |
| --- | --- | --- | --- |
| `M2 Sandbox 2.0 Update Sept 22 2026.docx` | `fc68fa94bef004e21dbaf6704b9d25f79a787dff8c8199516e7c1a2fe8e413dd` | `2188108c959082efe8ad3a2db9780050de6a19fd38b1e7c305cdc37f54183aa3` | NHA's final feedback on the M2 milestone page: which 21 September suggestive content to apply, what to remove, the HI type table, the M2 error code list, and three flowcharts (HIP initiated linking, discovery and link, data transfer) whose every step the page writes out. Author fields in the file properties are cleared (3 fields); the text is as received |
| `M3 Flow Review Sept 22 2026.docx` | `f5cc48d3087b40e50c3e3e8c4a8936b04f17516de17d5aa86a5b5ab22bee5c86` | `db8db01937615df4043fbc007fb706ff727f3e8d09e3b3fed24ca9999fe8a50d` | NHA's final feedback on the M3 milestone page, received as "Orbi Health Flow Review Sept 22 2026": the lead, In short, the three M3 functionalities, the consent management flow with its diagram, and the workflow overview struck. Author fields in the file properties are cleared (3 fields); the text is as received |
