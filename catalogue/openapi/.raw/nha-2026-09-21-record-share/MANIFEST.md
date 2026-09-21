# NHA Patient Scan and Record Share, 21 September 2026

The two files NHA supplied with its AI sandbox observations, stored as
received. They are the only source for the record share module: NHA has
published no swagger for `/api/hiecm/patient-record/v3/*`.

| File | sha256 | What it holds |
| --- | --- | --- |
| `Patient Scan and Record Share.docx` | `2d3ba3761a8a4b0a9b1b21d945a54797956f0ece683c85bfaa2af2bfbbb8df52` | Base URLs, terminology, the overview, and one section per call and callback with headers, body parameters, a request body and the response code |
| `Record_Share_19_03_2026.postman_collection.json` | `a3a8d786cc35e6859c0d640eaf8be37f72e7eb8b65c27ec24f35ce1a3fb3f70c` | The same calls as two folders, PHR-APP and HIU, in the order each side makes them, plus the health information transfer to the data push URL |

Personal data in these files is already placeholder text or masked by NHA
(names such as "String", mobile numbers ending in X). The sandbox ABHA
addresses and the webhook.site data push URL are NHA's own test values and
are kept.
