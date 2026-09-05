# Test M3, consent and fetching

Each case names the call it makes and what to see when it passes.

## Test cases

16 cases, from NHA's M3 matrix for Consent management and health record fetch. "Mandatory" is NHA's own marking.

### Consent request

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `CNS_01` | Core path | Raise a consent request for a patient's previous records | `null /api/hiecm/consent/v3/request/init` | You receive an on-init callback carrying a consent request id. |
| `CNS_02` | Core path | Poll the request status before the patient acts | `null /api/hiecm/consent/v3/request/status` | Status comes back `Requested`. |
| `CNS_03` | Edge path | Handle a consent request that produces no on-init callback at all | `null /api/hiecm/consent/v3/request/init` | The on-init callback arrives at your registered URL. Nothing arriving means the URL is not registered or not … |
| `CNS_04` | Coverage | Send one consent request per purpose of use code you will use in production | `null /api/hiecm/consent/v3/request/init` | Each code is accepted and reaches the patient's PHR app. |
| `CNS_05` | Coverage | Send one consent request per HI type you will display | `null /api/hiecm/consent/v3/request/init` | Each type is accepted, and your system renders what comes back for it. |

### Consent grant and denial

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `GRT_01` | Core path | Receive a grant and acknowledge the consent artefact ids | `null /api/hiecm/consent/v3/request/hiu/on-notify` | You receive a notify callback with one or more consent artefact ids and the request id. |
| `GRT_02` | Core path | Handle a denial on a second request | webhook `/api/v3/hiu/consent/request/notify` | You receive a notify callback with status `Denied` and no artefact ids. |
| `GRT_03` | Edge path | Handle a grant that produces more than one artefact | `null /api/hiecm/consent/v3/fetch` | Every artefact id in the notify callback is fetched and used, not only the first. |

### Consent artefact handling

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `ART_01` | Core path | Fetch a consent artefact by id | `null /api/hiecm/consent/v3/fetch` | You receive an on-fetch callback for the artefact id you quoted. |
| `ART_02` | Edge path | Stop fetching once the consent has expired | `null /api/hiecm/consent/v3/fetch` | The fetch fails and your code stops, rather than retrying forever. |

### Data fetch

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `DAT_01` | Core path | Request the health information under a granted consent | `null /api/hiecm/data-flow/v3/health-information/request` | You receive an on-request callback with a transaction id, request id and status. |
| `DAT_02` | Core path | Receive the encrypted records |  | Encrypted records arrive at the data push callback URL you supplied. |
| `DAT_03` | Core path | Decrypt the records and render them |  | The records read as FHIR content your system can display, as plain text or structured output. |
| `DAT_04` | Edge path | Render a partial result when only some requested HI types exist | `null /api/hiecm/data-flow/v3/health-information/request` | The types that exist render. Your system does not treat the missing ones as a failure. |
| `DAT_05` | Core path | Notify receipt and close the transaction | `null /api/hiecm/data-flow/v3/health-information/notify` | You call health information notify and the transaction closes. |

### Consent revocation

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `REV_01` | Edge path | Stop fetching once the patient revokes consent | `null /api/hiecm/consent/v3/fetch` | The fetch fails and your system stops. Access ends from the point of revocation. |
