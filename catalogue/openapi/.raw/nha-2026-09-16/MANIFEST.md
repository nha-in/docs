# NHA final set, 16 September 2026

Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.

The M1 collection of 15 September sits beside the set because it supplies the order of M1 calls, and nothing else.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M4/M4-HFR.json` | `69729e97853c7ec991903f80807079305c978e24892e31f1fdaa76c759a5a075` | `26948ced727b5d372b3809ab8a41c562870bcda12bd0fa956e5d46b24ef77b11` | abha-address 5, email 3, abha-number 1, hpr-id 3 |
| `M4/M4-HPID.json` | `a439c18663297b665f636ed8ddae63dbf9cd3b67152c4e542522c26acb23574d` | `6608da5913b7b0327dd04bc3e9ae05c4fcd59508e697f30060bc9a862af9d4bc` | abha-address 7, email 7, hpr-id 5 |
| `M4/M4-HPR.json` | `e4cf07d50cf6798dd7cf948e92d73b1ebda9eb08e4ef50de142dc932ee39eb01` | `f91492230d57ac9c50d538e9127f505ab3b04dc845c95055f45a590660a4fed9` | abha-address 2, email 3, hpr-id 4, photo 1 |
| `abha/M1 ABHA Collection.json` | `8dc7ddcba6db4718dc4fcc2a1ddb9d55dedf0e5e2000caf038cc22510b955031` | `2dfc7a3a638d3f8ff51aabe6a4a71e436dafae9bd1c4857f77535c486497eb24` | token 71, abha-address 4, email 2, abha-number 20, mobile 9, internal-host 1, photo 6, pid-block 25 |
| `abha/M1 ABHA Swagger 1.yaml` | `867de34795761ba4d6bc29ad5ee2cd089200786daa3d089afc94968a0bd01308` | `2e226a8705ffbd82f39a9fe2072e1fc8fd10c8d1d429188ae5f8258278ee0f2d` | photo 26, token 58, abha-address 41, email 7, abha-number 8, mobile 2 |
| `hiecm/consent-management-data-flow.yaml` | `4b0af51af2e2b5bfbf08f5e8745a940f59c550f8a1e4600c970c526f27bc8718` | `78f8bc3102976944a630081e63cf34e046ee6cd337065c815473cf77b31bdbf2` | token 11, abha-address 16 |
| `hiecm/gateway.yaml` | `d3bc599054c2570a50818ca54906c44cf652ad6f813473e8ac243667da4e9300` | `e7ca9d3e54d6e6c864f3f1ef7b2422a322c38f6ef0bf64e421c57960b8851dc7` | token 2, third-party-url 1 |
| `hiecm/hip-initiated-linking.yaml` | `8c4036b49028e243d0687d5ddcde6fa025d21d63fdaf90826eb8159f8485382b` | `d1224af3e12ede109747d595721cb0f39b90dfe6b1319bf8742c4d6f4d046d16` | token 1, abha-address 5 |
| `hiecm/link-token.yaml` | `2e9cdca38bd2b2230ffcc70b53ae68b99aad68b9a526c96beeda4bf11dcb4273` | `0deb32fd67f3489d1ecc86c622ef066eaa6b545f81c62948669fc5235cbc37c8` | token 1, abha-address 2 |
| `hiecm/patient-share.yaml` | `91f2d41aee815825299d6e0fc65d0451dd2f67f17c4950d537e6d5867901f7b8` | `001806e1f180c8e738b82e598dc575cc53598f3c1efd10b7acc5096b83e00e37` | token 8, abha-address 5, email 2, abha-number 2, mobile 2 |
| `hiecm/scan-and-pay.yaml` | `fe6c61d73f40d1ceb5d5d3835a031521f4ab227a52830fdbe52ab5a549b5cc7e` | `3943b3b43b4f6e2e2730f5aa57aeaf2c06a8cf87172af00e8bc041b0e02a1d5e` | token 27, abha-address 24 |
| `hiecm/subscription.yaml` | `19e2be6557790fecf8f9b5e2374ee25bb5e432b6aa11a9f673d93a0228eb61b0` | `7697e2f1445968038f56a8795f73fd49e73cba74ce2bc30920572c602010f7bf` | token 12, abha-address 15, abha-number 1 |
| `hiecm/user-initiated-linking.yaml` | `ded35c0734defb54df45f1b274ce54c8e8c013a0ff33c34a5ceceabe6b635a13` | `8d500934ddd3e9c843446bd78a386473e5858167114c33987b355dead880ccea` | token 3, abha-address 9 |
| `phr/PHR and Locker Swagger.yaml` | `f958b8d065943503db85da430fe2a9df91dbf7edf30022ba7e36cbef45247d7e` | `678b9045b11d924983314c7b154ebe54a766a79701063e1f546cc03a44e7de33` | abha-address 122, email 11, abha-number 2, mobile 1, third-party-url 2, photo 33 |
| `phr/PHR and locker.postman_collection.json` | `afce9d03013d8fb9151ae6b9d293af4697bc6ac1b164a74f6448b09cdaa215f0` | `5a547ae2fedfcc6d24aac1156a9f86af45531a88341d8c1f3aa1c52e1bdc46cf` | token 107, abha-address 206, email 9, abha-number 43, mobile 18, internal-host 3, third-party-url 1, photo 51 |
