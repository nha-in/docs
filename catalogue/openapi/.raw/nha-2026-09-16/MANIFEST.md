# NHA final set, 16 September 2026

Every file NHA supplied, with the sha256 of the bytes committed here. Two files carried personal data (sandbox tokens decoding to mobile numbers, ABHA numbers and addresses; internal hostnames) and are committed redacted. The sha256 of the original bytes is recorded so a reissued file can be matched, and the originals are held outside git.

The M1 collection of 15 September sits beside the set because it supplies the order of M1 calls, and nothing else.

| File | sha256 committed | sha256 original | Redactions |
| --- | --- | --- | --- |
| `M4/M4-HFR.json` | `26948ced727b5d372b3809ab8a41c562870bcda12bd0fa956e5d46b24ef77b11` | `26948ced727b5d372b3809ab8a41c562870bcda12bd0fa956e5d46b24ef77b11` | none |
| `M4/M4-HPID.json` | `6608da5913b7b0327dd04bc3e9ae05c4fcd59508e697f30060bc9a862af9d4bc` | `6608da5913b7b0327dd04bc3e9ae05c4fcd59508e697f30060bc9a862af9d4bc` | none |
| `M4/M4-HPR.json` | `f91492230d57ac9c50d538e9127f505ab3b04dc845c95055f45a590660a4fed9` | `f91492230d57ac9c50d538e9127f505ab3b04dc845c95055f45a590660a4fed9` | none |
| `abha/M1 ABHA Collection.json` | `8dc7ddcba6db4718dc4fcc2a1ddb9d55dedf0e5e2000caf038cc22510b955031` | `2dfc7a3a638d3f8ff51aabe6a4a71e436dafae9bd1c4857f77535c486497eb24` | token 71, abha-address 4, email 2, abha-number 20, mobile 9, internal-host 1, photo 6, pid-block 25 |
| `abha/M1 ABHA Swagger 1.yaml` | `867de34795761ba4d6bc29ad5ee2cd089200786daa3d089afc94968a0bd01308` | `2e226a8705ffbd82f39a9fe2072e1fc8fd10c8d1d429188ae5f8258278ee0f2d` | photo 26, token 58, abha-address 41, email 7, abha-number 8, mobile 2 |
| `hiecm/consent-management-data-flow.yaml` | `78f8bc3102976944a630081e63cf34e046ee6cd337065c815473cf77b31bdbf2` | `78f8bc3102976944a630081e63cf34e046ee6cd337065c815473cf77b31bdbf2` | none |
| `hiecm/gateway.yaml` | `e7ca9d3e54d6e6c864f3f1ef7b2422a322c38f6ef0bf64e421c57960b8851dc7` | `e7ca9d3e54d6e6c864f3f1ef7b2422a322c38f6ef0bf64e421c57960b8851dc7` | none |
| `hiecm/hip-initiated-linking.yaml` | `d1224af3e12ede109747d595721cb0f39b90dfe6b1319bf8742c4d6f4d046d16` | `d1224af3e12ede109747d595721cb0f39b90dfe6b1319bf8742c4d6f4d046d16` | none |
| `hiecm/link-token.yaml` | `0deb32fd67f3489d1ecc86c622ef066eaa6b545f81c62948669fc5235cbc37c8` | `0deb32fd67f3489d1ecc86c622ef066eaa6b545f81c62948669fc5235cbc37c8` | none |
| `hiecm/patient-share.yaml` | `001806e1f180c8e738b82e598dc575cc53598f3c1efd10b7acc5096b83e00e37` | `001806e1f180c8e738b82e598dc575cc53598f3c1efd10b7acc5096b83e00e37` | none |
| `hiecm/scan-and-pay.yaml` | `3943b3b43b4f6e2e2730f5aa57aeaf2c06a8cf87172af00e8bc041b0e02a1d5e` | `3943b3b43b4f6e2e2730f5aa57aeaf2c06a8cf87172af00e8bc041b0e02a1d5e` | none |
| `hiecm/subscription.yaml` | `7697e2f1445968038f56a8795f73fd49e73cba74ce2bc30920572c602010f7bf` | `7697e2f1445968038f56a8795f73fd49e73cba74ce2bc30920572c602010f7bf` | none |
| `hiecm/user-initiated-linking.yaml` | `8d500934ddd3e9c843446bd78a386473e5858167114c33987b355dead880ccea` | `8d500934ddd3e9c843446bd78a386473e5858167114c33987b355dead880ccea` | none |
| `phr/PHR and Locker Swagger.yaml` | `678b9045b11d924983314c7b154ebe54a766a79701063e1f546cc03a44e7de33` | `678b9045b11d924983314c7b154ebe54a766a79701063e1f546cc03a44e7de33` | none |
| `phr/PHR and locker.postman_collection.json` | `afce9d03013d8fb9151ae6b9d293af4697bc6ac1b164a74f6448b09cdaa215f0` | `5a547ae2fedfcc6d24aac1156a9f86af45531a88341d8c1f3aa1c52e1bdc46cf` | token 107, abha-address 206, email 9, abha-number 43, mobile 18, internal-host 3, third-party-url 1, photo 51 |
