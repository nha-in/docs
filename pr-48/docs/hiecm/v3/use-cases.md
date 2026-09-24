# Use cases

A use case is one thing a patient does at your counter, and the calls your system makes to answer it. Each one belongs to a [milestone](/docs/pr-48/docs/hiecm/v3/milestones). Build that milestone first, then add the use case.

| Use case                                                                         | Milestone                                                                 | What the patient does                                                                                                         |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [Scan and Register](/docs/pr-48/docs/hiecm/v3/use-cases/scan-and-register)       | [M1 Identity](/docs/pr-48/docs/hiecm/v3/milestones/m1)                    | Scans your counter QR code and shares their ABHA profile, so registration needs no typing and they get a queue token.         |
| [Patient record share](/docs/pr-48/docs/hiecm/v3/use-cases/patient-record-share) | [M3 Health Information User](/docs/pr-48/docs/hiecm/v3/milestones/m3)     | Scans your counter QR code and pushes records from their PHR app straight to your system, without a consent request from you. |
| [Scan and Pay](/docs/pr-48/docs/hiecm/v3/use-cases/scan-and-pay)                 | [M2 Health Information Provider](/docs/pr-48/docs/hiecm/v3/milestones/m2) | Scans your counter QR code, sees their open orders in their PHR app, pays there, and your system learns the payment status.   |

All three start with the same QR code at the counter. What differs is what moves: Scan and Register sends the patient's profile to you, Patient record share sends their health records, and Scan and Pay sends their payment.
