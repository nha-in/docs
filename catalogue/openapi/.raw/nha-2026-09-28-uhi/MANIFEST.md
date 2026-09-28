# NHA UHI set, 28 September 2026

Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.

The UHI developer guide as of 22 September 2026, the Gateway spec v2.0.2 in two shapes, and eight per-service onboarding documents of 3 August 2026. `UHI Documentation Requirements.yaml` is the Gateway spec itself, despite its name, and the contract comes from it. `UHI Gateway Service.yaml` is NHA's service-grouped copy of the same spec and is used only to assign examples to services. The guide and the onboarding documents are committed as redacted text conversions (DOCX with markitdown, PDF with pdftotext -layout, images dropped); their originals are held outside git and listed here by sha256. In this set a `name` is redacted only under a person-shaped parent, because Beckn messages use `name` for services, places, codes and headers, and people named elsewhere were removed by a run-time list that is not stored. Where an onboarding document and the guide or spec disagree, the resolution is in `catalogue/openapi/corrections/2026-09-28-uhi-sources.md`.

| Original held outside git | sha256 |
| --- | --- |
| `UHI Documentation Requirements.docx` | `c58a5a95690f0a3a38993c535b554fab6ec9ac89b460ebcdaff7e4c9ab0f89d5` |
| `ABDM Sandbox Sept 28 2026.zip` | `66e0315d94b0c86e1def69d3c19aa72023318508bc18de6ca053d44f6b110dba` |
| `UHI Physical Consultation v2.0 - Onboarding Document.docx` | `87cee26657fbe7b9982ae64f5a34890c60148fc69b321e6f2e3fa347adc065ef` |
| `UHI_PMJAY_HEM_Onboarding_v1.4.docx` | `86ad4d13abaf969def4c85537de5a675715753b4b059a5e29be4288f47806866` |
| `UHI_BloodBank_Onboarding_v1.0.pdf` | `13746a3ab6afa4b48809cc4d7533dfb208e08de9510230cd12120404455da0e7` |
| `UHI_AmbulanceBooking_Onboarding_v1.1-July2026.pdf` | `0ce1e08262ad9cb785ff0cab363af98ad155f65dfd4843da60653d5f2568dd03` |
| `UHI_JanAushadhiKendra_OnboardingDoc_v1.0.docx` | `b660d77d8815ae496a76618d64ce25acee89e43ac441eb5880d7387ad50a5d9d` |
| `UHI_JanAushadhiKendra_search_v0.3.docx` | `b00dcdea371a0fb41083f38c776321a89c741de4bc5c5b65719885fce53221f1` |
| `JanAushadhiKendra_medicineSearch_v0.3.docx` | `0ae0b693e8b461897fed69c187fe2229d21512870a7732520938ebf5505b9585` |
| `UHI_AMRIT_Pharmacy_OnboardingDoc_v1.0.docx` | `36cf2806e851d50505b70d8a6cafd2d3de4676c85137bf97b83a3c38a1198732` |

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `UHI Documentation Requirements.md` | `2a4d7e8179fa813edbb32df45da8c9611775ef061584b2769946a230f4f1ac35` | `7d1dbf4255fef114d70889ab98c9362341c11ec15fc58940747cd2aeb8b4512a` | abha-address 1, mobile 2 |
| `UHI Documentation Requirements.yaml` | `af065b1acc1032286c5b10ba43a39c048bfd8ce8afe1017b92e11b783a43d158` | `6b7f23d39aca3948598c18af9b72716c167ded52d14462b8986d9746182e15b6` | photo 8, abha-address 66, hpr-address 164, email 97, abha-number 24, hpr-id 188, mobile 91, name 227, address 42, dob 248 |
| `UHI Gateway Service.yaml` | `a04a7a18f19f9fb448f747d84b19aa10908b9118ac32a4bf84cf330440984d47` | `a9ef602bc011d0dc9e61ae06da00d647ff8e394c8ff87911d841e9b87deb7af2` | photo 8, abha-address 66, hpr-address 164, email 97, abha-number 24, hpr-id 188, mobile 91, name 227, address 42, dob 248 |
| `onboarding/JanAushadhiKendra_medicineSearch_v0.3.md` | `aa0c625fd670af904feb307dd75de46737a5629b0d7be97972e5d20d01911304` | `1ec3d9c47f2b2eefc756d2fd512f3a5eb15d58c3a6c816addc529dd81c288a5a` | mobile 2, name 2, address 2 |
| `onboarding/UHI Physical Consultation v2.0 - Onboarding Document.md` | `2c5d3739b2a57790a912be4e253722c5f5bdd8035a070c2dabcdc1b2bf8f73f1` | `7cc350eae035eb424d3b62ddb4add14f333225644acf45fb675fe7c5888bded3` | abha-address 9, hpr-address 19, email 5, hpr-id 6, mobile 4, name 24, address 4, dob 12 |
| `onboarding/UHI_AMRIT_Pharmacy_OnboardingDoc_v1.0.md` | `ff1b09593478dbc2fb5b7506de4b81e8992bb49bb243b8d2e80d1675d41dac74` | `9f34415b5d08067aa2ae7a474a6e80552755cb23a802f3edc075f5b0c7b0e4eb` | abha-address 1, email 3 |
| `onboarding/UHI_AmbulanceBooking_Onboarding_v1.1-July2026.md` | `dcde87b1daa5de40d7f94453df95dd9a82e68b3d33aa6063e07882f56e0069a5` | `a1f3e90cb9bb32be7a71959aa8d44e1aa70d88b3880a9173f6df385566f49fd0` | abha-address 1, email 2, address 9, name 2, dob 8 |
| `onboarding/UHI_BloodBank_Onboarding_v1.0.md` | `721cbe9d50ecedde0f58fb40bbd2edec8a7ea406f66b4b8141d76674c93435b1` | `4a981786742d5ccd0d4cac40bca30c9ad91e844b02ea2a235deb2f914df63846` | email 4, mobile 1 |
| `onboarding/UHI_JanAushadhiKendra_OnboardingDoc_v1.0.md` | `3f0467734d3107251f130d3139683943bb807b7494ff97ce968beb0136956656` | `b959f617c35a715e97c4bdb2d28fd85ac7eebff43b166244131358883a385d25` | email 5, mobile 2, name 2, address 2 |
| `onboarding/UHI_JanAushadhiKendra_search_v0.3.md` | `2f2b5d5cf3d99af0a9fc51d6318e22c655b9ce451aa9a48ea8a5de6fb8c43c4a` | `774f8d684a415a2ea7b5dd0639b16eba6b92a40d71be3560005a8de2cceb973e` | mobile 2, name 2, address 2 |
| `onboarding/UHI_PMJAY_HEM_Onboarding_v1.4.md` | `d1ec2ef8a79933292ce1d49ed28d1f507a0ab6fcd30af2c81f300221d2d5a815` | `4f0fdbabeb8bcd40ad673902fc573a7d4683b28db0f228b8f4557d528821cc78` | email 3, mobile 2, name 2 |
