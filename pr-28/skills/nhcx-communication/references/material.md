# Material: where the pins, fixtures and docs live

The stage and module files cite pins, payer fixtures and chapters. All of them come from one source, the NHCX package. This file says how to get it, what it holds, and which package file each citation means.

## The package

| Source | Has | Get it |
| --- | --- | --- |
| The NHCX package (`nhcx-package/`) | The docs, every API as a request, the FHIR bundles (the fifteen hospital pins, the payer answers, the live PMJAY captures with identifiers replaced), the field mappings per use case, `workflow.yaml`, `usecases.yaml`, `nhcx-error.yaml`, `baseurl.yaml`, a `MANIFEST` with a sha256 per file | `scripts/fetch-package.sh`, or by hand (below) |
| nhcx-adapter (optional: only when the user asks for it) | The binary, `config.sample.json`, `serve.sh`, `README.md` | The latest release of https://github.com/nha-in/nhcx-adapter, downloaded only when the user chose it (`references/transport-knowledge.md` section 5). Its contract is in `references/api-knowledge.md`. |

By default `scripts/fetch-package.sh` takes the build attached to the latest GitHub release of `nha-in/nhcx-package`. It checks the download against the sha256 the release records. To use a different build, pass a link or a local path: `scripts/fetch-package.sh <url-or-path>`.

By hand: download the `nhcx-package-v<version>.zip` asset from https://github.com/nha-in/nhcx-package/releases/latest. Unzip it beside `nhcx-build/`. It unpacks to `nhcx-package/`.

Where the web is off, copy the package in. Do not try to fetch it.

After unpacking, check it. `nhcx-package/MANIFEST` names the version and lists every file with its size and sha256. Verify at least the pins you will be held to.

What the package holds:

| Path | What it is |
| --- | --- |
| `nhcx-package/fhir/B1` to `B9` | Hospital bundles. Lower-case files (`preauth-request.json`) are the pins, written to the specification with placeholders. Capitalised files (`B3-request.json`) are live captures. |
| `nhcx-package/fhir/C3` to `C11` | Payer answers. A generic file and, where one exists, its `-pmjay` twin. |
| `nhcx-package/fhir/D1` to `D13` | Live PMJAY hospital captures, identifiers replaced |
| `nhcx-package/fhir/index.yaml` | The catalogue: for each file its direction, side, scheme (`generic` or `pmjay`), workflow id, focal resource, origin (`wire` or `example`) |
| `nhcx-package/docs/` | The chapters, `01-Overview` to `07-Go Live` |
| `nhcx-package/mappings/<use case>.yaml` | Field mappings per bundle; `A1.yaml` is the master dictionary |
| `nhcx-package/apis/` | Every API as a request (a Bruno collection) |
| `nhcx-package/workflow.yaml`, `usecases.yaml`, `nhcx-error.yaml`, `baseurl.yaml` | Workflow ids, use cases, error codes, base URLs |
| `nhcx-package/MANIFEST` | Version, and a size and sha256 per file |

## The pin map

Every hospital-side pin, and its file in the package. The fifteen hospital-built pins are the bytes a build is held to (canonical JSON). The last row is a payer's message, the reader's input.

| Pin | Package | Module |
| --- | --- | --- |
| `coverage/discovery` | `nhcx-package/fhir/B1/discovery.json` | 7.4 |
| `coverage/validation` | `nhcx-package/fhir/B1/validation.json` | 7.4 |
| `coverage/benefits` | `nhcx-package/fhir/B1/benefits.json` | 7.4 |
| `coverage/authrequirements` | `nhcx-package/fhir/B1/auth-requirements.json` | 7.6 |
| `insurance` | `nhcx-package/fhir/B2/insurance-plan-request.json` | 7.5 |
| `preauth/request` | `nhcx-package/fhir/B3/preauth-request.json` | 7.7 |
| `preauth/enhancement` | `nhcx-package/fhir/B3/preauth-enhancement.json` | 7.7 |
| `preauth/queryupdate` | `nhcx-package/fhir/B3/preauth-queryupdate.json` | 7.7 |
| `preauth/cancel` | `nhcx-package/fhir/B3/preauth-cancel.json` | 7.9 |
| `claim/request` | `nhcx-package/fhir/B5/claim-request.json` | 7.7 |
| `claim/queryupdate` | `nhcx-package/fhir/B5/claim-queryupdate.json` | 7.7 |
| `claim/reprocess` | `nhcx-package/fhir/B5/claim-reprocess.json` | 7.9 |
| `claim/release` | `nhcx-package/fhir/B5/claim-release.json` | 7.9 |
| `communication/response` | `nhcx-package/fhir/B4/communication-response.json` | 7.10 |
| `payment/notice-ack` | `nhcx-package/fhir/B7/payment-notice-ack.json` | 7.10 |
| `communication/request` (a payer's message, the reader's input) | `nhcx-package/fhir/B4/communication-request.json`. It is the NRCeS IG's own example, with the Patient's name, identifier, birth date and phone replaced. | 7.10 |

## The payer fixtures

What the readers are fed. `generic` is what any payer on the exchange sends, IRDAI-regulated insurers and TPAs included. `pmjay` is the SHA's own message, a live capture with the beneficiary's identifiers replaced. Some identifiers are absent from the PMJAY files: `C5-received-wf20-pmjay.json` carries no `preAuthRef`. Read a value from the file before you assert it. Paths are under `nhcx-package/fhir/`.

| Answer | Generic | PMJAY | Reader |
| --- | --- | --- | --- |
| Coverage, validation | `C3/validation-response.json` | `C3/coverage-eligibility.json` | 7.4 |
| Coverage, discovery | `C3/discovery-response.json` | none | 7.4 |
| Coverage, benefits | `C3/benefits-response.json` | `C3/C3-benefits-pmjay.json` | 7.4 |
| Coverage, auth-requirements | `C3/C3-response-generic.json` | `C3/C3-response-pmjay.json` (workflow 5) | 7.6 |
| Insurance plan | `C4/C4-response-generic.json` (coverage-based) | `C4/C4-response-pmjay.json` (package-based) | 7.5 |
| Pre-auth received 20 | `C5/C5-received-wf20.json` | `C5/C5-received-wf20-pmjay.json` | 7.8 |
| Pre-auth approved 21 | `C5/C5-approved-wf21.json` | `C5/C5-approved-wf21-pmjay.json` | 7.8 |
| Enhancement approved 22 | `C5/C5-enhancement-approved-wf22.json` | `C5/C5-enhancement-approved-wf22-pmjay.json` | 7.8 |
| Pre-auth rejected 23 | `C5/C5-rejected-wf23.json` | `C5/C5-rejected-wf23-pmjay.json` | 7.8 |
| Pre-auth queried 24 | `C5/preauth-queried.json` | `C5/C5-queried-wf24.json` | 7.8 |
| Claim received 25 | `C7/C7-received-wf25.json` | `C7/C7-received-wf25-pmjay.json` | 7.8 |
| Claim approved 26 | `C7/C7-approved-wf26.json` | `C7/C7-approved-wf26-pmjay.json`, `C7/C7-approved-deduction-wf26-pmjay.json` | 7.8 |
| Claim queried 27 | `C7/claim-queried.json` | `C7/C7-queried-wf27.json` | 7.8 |
| Claim rejected 291 | `C7/C7-rejected-wf291.json` | `C7/C7-rejected-wf291-pmjay.json` | 7.8 |
| Cancellation done PC02 | `C10/C10-cancelled-wfPC02.json` | `C10/C10-cancelled-wfPC02-pmjay.json` | 7.9 |
| Arbitration acknowledged 37 | `C10/C10-arbitration-wf37.json` | `C10/C10-arbitration-wf37-pmjay.json` | 7.9 |
| Query on the communication API, 24 and 27 | `C6/C6-preauth-query-wf24.json`, `C6/C6-claim-query-wf27.json` | none | 7.10 |
| Notification N02 | none | `C6/C6-notification-wfN02.json` | 7.10 |
| The query the reply answers | `B4/communication-request.json` (the IG's example) | none | 7.10 |
| Payment notice 30 | `C9/C9-notice-wf30.json` | `C9/payment-notice.json`, `C9/C9-notice-tds-wf30-pmjay.json` | 7.10 |
| Predetermination | `B9/predetermination-request.json` (the request), `C11/predetermination-response.json` | none | 7.7, 7.8 |

`nhcx-package/fhir/index.yaml` catalogues every file: direction, side, scheme, workflow id, focal resource, origin (`wire` or `example`). An `example` file is placeholders written to the specification, not a payload.

## The live hospital captures

What a hospital actually sent, as the payer accepted it. The module files quote these shapes. Paths are under `nhcx-package/fhir/`.

| Scheme | Files |
| --- | --- |
| PMJAY | `D1/D1-request.json` (plan), `D3/D3-check.json` (auth-requirements), `D4/D4-request.json` (pre-auth 12), `D6/D6-enhancement.json` (13), `D6/D6-enhancement-query-answer.json` (131), `D7/D7-query-answer.json` (19), `D8/D8-cancel.json` (PC01), `D9/D9-request.json` (claim 15), `D10/D10-query-answer.json` (161), `D11/D11-reprocess.json` (36), `D13/D13-acknowledgement.json` (17) |
| Generic | `B1/B1-check.json`, `B2/B2-request.json`, `B3/B3-request.json`, `B3/B3-enhancement.json`, `B4/B4-preauth-query-answer.json`, `B4/B4-claim-query-answer.json`, `B5/B5-request.json`, `B7/B7-acknowledgement.json`, `B8/B8-cancel.json`, `B8/B8-reprocess.json` |

## The docs and the data files

| Cited | Package |
| --- | --- |
| a chapter | `nhcx-package/docs/<chapter>`, from `01-Overview` to `07-Go Live` |
| workflow ids (`references/flow-knowledge.md` section 2) | `nhcx-package/workflow.yaml`, the maintained source; rendered as `nhcx-package/docs/01-Overview/06-Workflow Codes.md` |
| use cases (`flow-knowledge.md` section 6) | `nhcx-package/usecases.yaml`; rendered as `nhcx-package/docs/01-Overview/05-NHCX Use Cases.md` |
| PAYR and ERR codes (`references/errors-and-debugging.md`) | `nhcx-package/nhcx-error.yaml` |
| field mappings per bundle (stage 4) | `nhcx-package/mappings/<use case>.yaml`; `A1.yaml` is the master dictionary |
| base URLs, sandbox and production | `nhcx-package/baseurl.yaml` |
| every API as a request | `nhcx-package/apis/` (a Bruno collection) |
| the bundle catalogue | `nhcx-package/fhir/index.yaml` |

## What the package does not hold

| Missing | Without it |
| --- | --- |
| A status-enquiry answer | None captured. The published status call carries no bundle either way (`nhcx-package/docs/05-FHIR Reference/18-Predetermination, Status and Search.md`). |
| A validator wrapper | Run the HL7 FHIR validator directly, as `references/fhir-knowledge.md` section 11 describes |
| Reference application source | The decisions are written into the module files and the references. Build from them. Record in `NOTES.md` where you would have wanted more. |
| End-to-end drivers and checkers | Write the stage 10 driver against your own build's state address |

## Which is newer

Where the references and the package disagree, the package is newer for the published facts (workflow ids, error text, base URLs). The references are newer for what was seen live (which ids a payer actually sent, which refusals mean what). Say which you followed in `NOTES.md`.
