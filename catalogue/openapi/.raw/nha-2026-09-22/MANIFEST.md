# NHA M1 swagger, use-case split, 22 September 2026

Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.

One file: the M1 swagger NHA reissued with one operation per use case, tags following the M1 Postman collection, and the real URL of each operation in x-actual-path. It replaces abha/M1 ABHA Swagger 1.yaml of the 16 September set as the M1 source.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `abha/ABHA Swagger split.yaml` | `f635eaf1411d96dcf427773d45d3e6d67a57748612ca4b3217b101118620609c` | `110ea5ff59235e48819d8a6fd27017f606f822a85845ffd5f9c2d962e0f3fe82` | photo 55, token 124, abha-address 203, email 23, abha-number 153, mobile 5, pincode 13, dob 129, name 184, address 69 |
