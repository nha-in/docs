# Payment notice and acknowledgement

The payment notice arrives unasked. The payer sends it once money moves against an approved claim, on `/v1/paymentnotice/request`. It can arrive three times for one case: workflow **30** when the payer initiates, **31** when the banking system processes, **33** when the transfer settles. The provider replies with an acknowledgement `Task`, workflow **17**. This is the only exchange in the reference that carries actual money rather than an adjudicated figure.

## In short

- The only exchange carrying real money rather than an adjudicated figure.
- Three notices can arrive for one case: 30 initiated, 31 processed, 33 settled.
- The UTR rides on the `PaymentReconciliation`, whose detail lines itemise the money by type.
- The provider replies with an acknowledgement `Task` on workflow 17.

## The notice bundle

Five entries, in this order. Every resource carries a `SUBSETTED` meta tag.

| # | Resource | What it is for |
| :---- | :---- | :---- |
| 1 | `Task` | The delivery instruction. Its single input references the `PaymentNotice` |
| 2 | `PaymentNotice` | The headline: net amount, currency, payment status, recipient |
| 3 | `PaymentReconciliation` | The breakdown: payment date, payment identifier, one detail line per component |
| 4 | `Organization` | The provider, `NPI` `IN1910000151` |
| 5 | `Organization` | The payer, `NIIP` `1518`, with no `name` at all |

### The fields that matter

| Path | Value in the sample |
| :---- | :---- |
| `Task.status`, `Task.intent` | `requested`, `order` |
| `Task.code.coding.system` | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-codes` |
| `Task.code.coding.code` | `deliver` |
| `Task.description` | "Payment initiated" |
| `Task.input[0].type.coding` | `status`, system `http://terminology.hl7.org/CodeSystem/financialtaskinputtype` |
| `Task.input[0].valueReference` | The `PaymentNotice` |
| `PaymentNotice.identifier[0]` | Type `CLN`, value `EO26AA2700001` |
| `PaymentNotice.status` | `active` |
| `PaymentNotice.payment` | Reference to the `PaymentReconciliation` |
| `PaymentNotice.amount` | `2187`, `INR` |
| `PaymentNotice.paymentStatus.coding` | `paid`, system `http://terminology.hl7.org/CodeSystem/paymentstatus` |
| `PaymentReconciliation.paymentDate` | `2026-02-27`, a date with no time |
| `PaymentReconciliation.paymentAmount` | `2187`, `INR` |
| `PaymentReconciliation.disposition` | "Payment initiated" |
| `PaymentReconciliation.paymentIdentifier.type.coding` | `UTR`, system `.../ndhm-identifier-type-code` |
| `PaymentReconciliation.paymentIdentifier.value` | `PMJAY/HP/S/2024/R2/10000009/Normal` |

`PaymentNotice.amount` is the net figure that reaches the hospital's account. It is not the approved amount. Take the approved amount from the claim response and keep both.

### The detail lines

| `detail[].type.coding.code` | `amount.value` | `detail[].id` |
| :---- | :---- | :---- |
| `TDS` | 243 | `PMJAY/HP/S/2024/R2/10000009/TDS` |
| `Payment` | 2187 | `PMJAY/HP/S/2024/R2/10000009/Normal` |

The full value set for `detail[].type` also defines `approvedamount`, `claimedamount`, `servicetax`, `advance`, `recovered` and `penality`. None of those appear in the sample. Sum every line whose type is a deduction and add the `Payment` line before you compare against anything.

Both `detail[].type.coding.system` values are `http://hl7.org/fhir/ValueSet/payment-type`, a ValueSet URL used where a CodeSystem URL belongs.

## The arithmetic that ties it together

The payment notice reconciles against the claim response for the same case, `EO26AA2700001`. That response reported three totals: `submitted` 2700.00, `eligible` 2430.00 and `benefit` 2430.00. The notice pays 2187 and deducts 243.

```
adjudicated benefit   2430
  minus TDS            243
  equals net paid     2187
```

That is the check to run on every notice. Net plus the sum of deductions must equal the adjudicated benefit. If it does not, the payer has applied a component you are not parsing, and the case should be flagged rather than closed. Note the direction of the identity: the handbook's implementation note says net plus TDS should equal the gross claim amount, but 2187 plus 243 is 2430, the benefit, not 2700, the submitted amount. Reconcile against `benefit`, not against what you claimed.

## The acknowledgement bundle

Three entries. The provider builds this one, so it uses `urn:uuid:` on the `Task` and absolute URLs on the two `Organization`s, exactly like the cancel request.

| # | Resource | What it is for |
| :---- | :---- | :---- |
| 1 | `Task` | The acknowledgement. Two outputs, no inputs |
| 2 | `Organization` | The provider, `IN1910000151`, "Usha Kiron" |
| 3 | `Organization` | The payer, `1518`, "SHA HP" |

| Path | Value in the sample |
| :---- | :---- |
| `Task.status`, `Task.intent` | `completed`, `order` |
| `Task.code.coding.system` | `http://terminology.hl7.org/CodeSystem/financialtaskcode` |
| `Task.code.coding.code` | `status` |
| `Task.description` | "Recived the payment EO26AA2700001", misspelled in the live payload |
| `Task.output[0].type.coding` | `status`, system `.../ndhm-task-output-type` |
| `Task.output[0].valueCodeableConcept.coding` | `paymentack`, system `.../ndhm-task-output-value`, display "Payment is acknowledged" |
| `Task.output[1].type.coding` | `claimNumber`, system `.../ndhm-task-input-type-code` |
| `Task.output[1].valueString` | `EO26AA2700001` |

`paymentack` is the value the payer looks for. The other output values in the same code system are `claimcancelled`, `claimreinitiated`, `claimsuspended`, `taskak` and `taskdelivered`.

## What the samples show

`paymentNotice/payment_notice.txt`, 5,334 bytes, five entries, timestamped 2026-02-27T15:36:08+05:30. `paymentNotice/paymentNotice_ack.txt`, 3,164 bytes, three entries, timestamped 2026-02-27T10:06:18+05:30.

Both files describe workflow 30 only, the initiation. There is no sample of workflow 31 or 33, so the settled notice that actually carries a bank reference has never been observed. Neither is there a sample where more than two detail lines appear.

## Traps

- **Input and output systems are mixed inside one resource.** `output[1].type` in the acknowledgement is coded in `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-task-input-type-code`, an input system used for an output, while `output[0].type` correctly uses `ndhm-task-output-type`. Emit it the way the sample does. If you validate strictly against the output system, this entry will fail.
- **Three `Task` code systems across four `Task` exchanges.** The notice is `ndhm-task-codes|deliver`, the acknowledgement is `financialtaskcode|status`, the cancel request is `financialtaskcode|cancel` and the cancel response is `task-code|approve`. Never switch on the code without the system.
- **The UTR is not a bank reference.** `PaymentReconciliation.paymentIdentifier` is typed `UTR`, but the value is `PMJAY/HP/S/2024/R2/10000009/Normal`, a structured scheme reference built from the plan class, an internal number and the payment type. Reconciliation staff cannot match that against a bank statement. Display it, store it, and expect a real transaction reference only on workflow 33, which has no sample.
- **The acknowledgement predates the notice.** The acknowledgement is stamped 10:06 and the notice 15:36 on the same day. The sandbox files were assembled out of order. Do not derive lifecycle ordering from timestamps.
- **The payer identifier system is misspelled.** The notice bundle identifier uses `https://payer.pmajy.nha.gov.in`. The provider's acknowledgement uses the correct `https://payer.pmjay.nha.gov.in`. Match on value.
- **`Bundle.meta.lastUpdated` on the acknowledgement is frozen** at the template value `2025-11-11T15:09:41.516+05:30`, shared with every other provider request bundle. `Bundle.timestamp` holds the real time.
- **Where the acknowledgement is posted is stated two ways.** The Payment document and the sandbox exit checklist say `/v1/paymentnotice/on_request`. The handbook says `/v1/task/submit` in its resource table and `/v1/paymentnotice/on_request` in its implementation note. Build to `on_request` and make the path configurable per payer.
- **The payer `Organization` in the notice has no name.** Fall back to the `NIIP` value for display.
