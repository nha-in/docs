# NHA final set, 16 September 2026

Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.

The M1 collection of 15 September sits beside the set because it supplies the order of M1 calls, and nothing else.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M4/M4-HFR.json` | `25291734dd3782857bc3e012c7fa1881a069b49fdb3701e1657c514f43b590f5` | `26948ced727b5d372b3809ab8a41c562870bcda12bd0fa956e5d46b24ef77b11` | abha-address 5, email 3, abha-number 1, hpr-id 3, pincode 5, dob 4, name 2, address 8 |
| `M4/M4-HPID.json` | `7e2eb837caa110f883dd56fb25ed606c942ac32324b9666d9a728b9a22582263` | `6608da5913b7b0327dd04bc3e9ae05c4fcd59508e697f30060bc9a862af9d4bc` | abha-address 7, email 7, hpr-id 8, pincode 3, dob 7, name 1, address 6 |
| `M4/M4-HPR.json` | `fe3e5b211cf9f1c0cf3af9830de9f3c28c6fbc52294bdc3bf24b76cfacf92cd0` | `f91492230d57ac9c50d538e9127f505ab3b04dc845c95055f45a590660a4fed9` | abha-address 2, email 3, hpr-id 6, photo 1, pincode 2, dob 6, name 1, address 4 |
| `abha/M1 ABHA Collection.json` | `ea48dc0600f8322c766bf59b17714ed80b94c01e4df02373a4cc248ac0118f5c` | `2dfc7a3a638d3f8ff51aabe6a4a71e436dafae9bd1c4857f77535c486497eb24` | token 71, abha-address 10, email 2, abha-number 21, mobile 9, internal-host 1, photo 7, pid-block 25, dob 16, name 13, address 2, pincode 2 |
| `abha/M1 ABHA Swagger 1.yaml` | `6ab5cfe77c29032fac5fbf25c8e28529f22951e459374fa618f570f15e25551b` | `2e226a8705ffbd82f39a9fe2072e1fc8fd10c8d1d429188ae5f8258278ee0f2d` | photo 27, token 58, abha-address 66, email 7, abha-number 69, mobile 2, dob 50, name 66, pincode 6, address 29 |
| `hiecm/consent-management-data-flow.yaml` | `4b0af51af2e2b5bfbf08f5e8745a940f59c550f8a1e4600c970c526f27bc8718` | `78f8bc3102976944a630081e63cf34e046ee6cd337065c815473cf77b31bdbf2` | token 11, abha-address 16 |
| `hiecm/gateway.yaml` | `d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300` | `e7ca9d3e54d6e6c864f3f1ef7b2422a322c38f6ef0bf64e421c57960b8851dc7` | token 2, third-party-url 1 |
| `hiecm/hip-initiated-linking.yaml` | `8c4036b49028e243d0687d5ddcde6fa025d21d63fdaf90826eb8159f8485382b` | `d1224af3e12ede109747d595721cb0f39b90dfe6b1319bf8742c4d6f4d046d16` | token 1, abha-address 5 |
| `hiecm/link-token.yaml` | `2e9cdca38bd2b2230ffcc70b53ae68b99aad68b9a526c96beeda4bf11dcb4273` | `0deb32fd67f3489d1ecc86c622ef066eaa6b545f81c62948669fc5235cbc37c8` | token 1, abha-address 2 |
| `hiecm/patient-share.yaml` | `8de274b417bbb860e87718adc299bf626c093cd91435fdcd095fa8748b28523a` | `001806e1f180c8e738b82e598dc575cc53598f3c1efd10b7acc5096b83e00e37` | token 8, abha-address 5, email 2, abha-number 2, mobile 2, name 2, dob 4, pincode 2 |
| `hiecm/scan-and-pay.yaml` | `fe6c61d73f40d1ceb5d5d3835a031521f4ab227a52830fdbe52ab5a549b5cc7e` | `3943b3b43b4f6e2e2730f5aa57aeaf2c06a8cf87172af00e8bc041b0e02a1d5e` | token 27, abha-address 24 |
| `hiecm/subscription.yaml` | `19e2be6557790fecf8f9b5e2374ee25bb5e432b6aa11a9f673d93a0228eb61b0` | `7697e2f1445968038f56a8795f73fd49e73cba74ce2bc30920572c602010f7bf` | token 12, abha-address 15, abha-number 1 |
| `hiecm/user-initiated-linking.yaml` | `848439c9e1fd123e706b7d42b7cc1db365a7d779ff65d298301dfb5fbf7a3e66` | `8d500934ddd3e9c843446bd78a386473e5858167114c33987b355dead880ccea` | token 3, abha-address 9, name 1 |
| `phr/PHR and Locker Swagger.yaml` | `a7e1b7e0b56b75297623057678cf307f21ecdbfbc9ebdb022dc67df78540f6d5` | `678b9045b11d924983314c7b154ebe54a766a79701063e1f546cc03a44e7de33` | abha-address 150, email 11, abha-number 52, mobile 1, third-party-url 2, photo 33, pincode 23, dob 88, name 10, address 72 |
| `phr/PHR and locker.postman_collection.json` | `8f503595767bc0809fb1acde1b02f22235c034076fa301442a580ffa39742b8f` | `5a547ae2fedfcc6d24aac1156a9f86af45531a88341d8c1f3aa1c52e1bdc46cf` | token 107, abha-address 295, email 9, abha-number 47, mobile 18, internal-host 3, third-party-url 1, photo 51, name 211, dob 169, address 91, pincode 39 |
