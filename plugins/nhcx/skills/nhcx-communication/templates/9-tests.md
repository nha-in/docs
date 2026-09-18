# 9. Tests

Run: `<command>`

One suite for the build. Each skill adds its tests and fills its own rows below.

## Pins

| Pin | Skill | Test |
| --- | --- | --- |
| coverage/discovery | nhcx-coverage | |
| coverage/validation | nhcx-coverage | |
| coverage/benefits | nhcx-coverage | |
| insurance | nhcx-insurance | |
| coverage/authrequirements | nhcx-preauth | |
| preauth/request | nhcx-preauth | |
| preauth/enhancement | nhcx-preauth | |
| preauth/queryupdate | nhcx-preauth | |
| preauth/cancel | nhcx-preauth | |
| claim/request | nhcx-claim | |
| claim/queryupdate | nhcx-claim | |
| communication/response | nhcx-communication | |
| (communication/request is a payer pin; the reader test) | nhcx-communication | |
| payment/notice-ack | nhcx-payment | |
| claim/reprocess | nhcx-reprocess | |
| claim/release | nhcx-reprocess | |

## Readers

| Fixture family | Skill | Test |
| --- | --- | --- |
| | | |

## The matrix

| Use case | Skill | Preconditions | Action | Expected wire | Expected state | Test or reason |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Cross-cutting

| Case | Leg | Skill | Test |
| --- | --- | --- | --- |
| Redelivery | | | |
| Unmatched | | | |
| Refusal at the door | | | |
| Ledger reset | | | |
| Stage after every write | | | |

## Screens

| Screen | Skill | Test |
| --- | --- | --- |
| | | |
