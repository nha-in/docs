# Pre-authorisation errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/nhcx/v1/troubleshooting/).

Codes any exchange call can meet are recorded once, in the [Other](/docs/nhcx/v1/api/other) specification: the gateway's NHCX- codes, the standard payer codes, and the reference payer's structure and transport codes. The reference payer's other codes sit with the exchange they reject: coverage eligibility, preauthorisation, claim and insurance plan. [Reading error codes](/docs/nhcx/v1/reference/error-code-guide) explains the code spaces.

## Reference Payer codes

Reference payer codes, PAYR-1001 to PAYR-1520. Sent by the PMJAY reference implementation; they arrive inside the sealed response.

| Code | Message | What to do |
| --- | --- | --- |
| `PAYR-1201` | Invalid claimed amount received for case number %s. Please try again with a valid claim amount. Claimed amount should be greater than INR 0 and less than equals to balance wallet amount of the beneficiary. |  |
| `PAYR-1202` | Invalid speciality code received as %s for item %s for case number %s. Please try again with valid data. Speciality code is available as the code of the category for specific cost of plan in isurance plan. |  |
| `PAYR-1203` | Invalid speciality description received as %s for procedure %s for case number %s. Please try again with valid data. Speciality description is available as the display of the category for specific cost of plan in isurance plan. |  |
| `PAYR-1204` | Invalid procedure code received as %s for case number %s. Please try again with valid data. Procedure code is available as the code of the type for benefit component, of specific cost, of plan in isurance plan. |  |
| `PAYR-1205` | Invalid procedure description received as %s for procedure %s for case number %s. Please try again with valid data. Procedure description is available as the display of the type for benefit component, of specific cost, of plan in isurance plan. |  |
| `PAYR-1206` | Invalid procedure type received as %s for procedure %s for case number %s. Please try again with valid data. |  |
| `PAYR-1207` | Invalid procedure factor received as %s for procedure %s for case number %s. Please try again with valid data. |  |
| `PAYR-1208` | Invalid procedure quantity received as %s for item %s for case number %s. Please try again with valid data. Item quantity should be greater than 1. |  |
| `PAYR-1209` | Invalid net amount received as INR %s for item %s for case number %s. Please try again with valid data. Item net amount should be greater than INR 0. |  |
| `PAYR-1210` | Invalid procedure status received as %s for procedure %s for case number %s. Please try again with valid data. |  |
| `PAYR-1211` | Requested beneficary details and careplan details does not match any criteria for processing the case at this hospital. Please try again with valid data. |  |
| `PAYR-1212` | No previous preauthorization approved record found for the enhancement request for case number %s. Hence request will not be processed further. Please initiate a new preauthorization. |  |
| `PAYR-1213` | Existing case in progress found for case number %s. Hence enhancement request will not be accepted. Please try after the adjudication is completed for the current case. |  |
| `PAYR-1214` | No previous preauthorization approved record found for the resubmission request for case number %s. Hence request will not be processed further. Please initiate a new preauthorization. |  |
| `PAYR-1215` | Existing case in progress found for case number %s. Hence resubmission request will not be accepted. Please try after the adjudication is completed for the current case. |  |
| `PAYR-1216` | Existing case in progress found for case number %s. Hence new preauthorization request will not be accepted. |  |
| `PAYR-1217` | Previous preauthorization approved record found for the new preauthorization request for case number %s. Hence request will not be processed further. Please initiate enhancement/resubmission. |  |
| `PAYR-1218` | No queried preauthorization record found for the query update request for case number %s. Hence request will not be processed further. |  |
| `PAYR-1219` | Case number %s is not queried. Hence query updation request will not be processed further. |  |
| `PAYR-1220` | Invalid investigation description received as %s for investigation code %s for case number %s. Please try again with valid data. |  |
| `PAYR-1221` | Invalid investigation code received as %s for case number %s. Please try again with valid data. |  |
| `PAYR-1222` | Invalid investigation status received as %s for investigation %s for case number %s. Please try again with valid data. |  |
| `PAYR-1223` | Invalid investigation attachment received for investigation %s for case number %s. Please try again with valid data. |  |
| `PAYR-1224` | Invalid implant description received as %s for implant code %s for case number %s. Please try again with valid data. |  |
| `PAYR-1225` | Invalid implant code received as %s for case number %s. Please try again with valid data. |  |
| `PAYR-1226` | Invalid implant status received as %s for investigation %s for case number %s. Please try again with valid data. |  |
| `PAYR-1227` | Invalid implant attachment received for investigation %s for case number %s. Please try again with valid data. |  |
| `PAYR-1228` | Invalid implant quantity received as %s for implant %s for case number %s. Please try again with valid data. |  |
| `PAYR-1229` | Invalid implant net amount received as INR %s for implant %s for case number %s. Please try again with valid data. |  |
| `PAYR-1230` | Invalid implant unit price received as INR %s for implant %s for case number %s. Please try again with valid data. |  |
| `PAYR-1231` | Claim has already been raised for case number %s. Hence preauthorization request will not be accepted. |  |
| `PAYR-1232` | No investigation found for case number %s. Investigation details are mandatory for private hospitals. |  |
| `PAYR-1233` | Patient liability is not aplicable for the hospital and beneficiary do not have enough wallet balance with deficit amount INR %s for the requested preauthorization for case number %s. |  |
| `PAYR-1234` | No preauthorization record found for case number %s. Hence the request will not be processed. |  |
| `PAYR-1235` | Insufficient wallet balance. Hence the request will not be processed. |  |
| `PAYR-1236` | Invalid claim type (in-patient/out-patient) received. Hence the request will not be processed. |  |
| `PAYR-1237` | Beneficiary is having an active preauthorization request at %s. Hence the request will not be processed. Kindly inform %s to cancel the active preauthorization request or raise a claim to proceed with current preauthorization. |  |
| `PAYR-1238` | Beneficiary is having an active preauthorization request at this hospital with reference number %s. Hence the request will not be processed. Kindly cancel the active preauthorization request or raise a claim to proceed with current preauthorization. |  |
| `PAYR-1239` | Hospital configuration not found. Please contact support team. |  |
| `PAYR-1240` | No details found for the requested procedures in the system. |  |
| `PAYR-1241` | Invalid registration date received for case number %s. Hence the request will not be processed. |  |
| `PAYR-1242` | Invalid registration date format received for case number %s. Hence the request will not be processed. |  |
| `PAYR-1243` | Invalid admission date received for case number %s. Hence the request will not be processed. |  |
| `PAYR-1244` | Invalid admission date format received for case number %s. Hence the request will not be processed. |  |
| `PAYR-1245` | Rule failure. | The SHA HP sandbox sent this code as "Only one conservative procedure can be booked for a case", on an enhancement that added a second Conservative package. |
| `PAYR-1246` | Invalid payer id received as %s. Please try again with valid payer id. |  |
| `PAYR-1247` | Payer details for payer id %s is not received from HCX for the request. Hence the request will not be processed. |  |
| `PAYR-1248` | Invalid item code received as %s for item sequence %s case number %s. Please try again with valid data. |  |
| `PAYR-1249` | Invalid item sequence received as %s for case number %s. Please try again with valid data. |  |
| `PAYR-1250` | Requested policy %s is not listed. Please try again with valid policy code. |  |
| `PAYR-1251` | No billable treatment plan received for case number %s. Please try again with valid treatment plan data. |  |
| `PAYR-1252` | Case number %s is not in active preauthorization state with the current status of the case with the payer system is %s. Hence the preauthorization can not be cancelled. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled. |  |
| `PAYR-1253` | Case number %s is already cancelled. Hence the preauthorization can not be cancelled again. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled. |  |
| `PAYR-1254` | Response for STG Questionnaire id %s is mandatory for procedure code %s. Hence the preauthorization request will not be processed as the questionnaire response is not received for procedure code. |  |
| `PAYR-1255` | Case number %s is already cancelled. Hence no preauthorization request will be accepted for this case number. New preauthorization request needs to be raised with new case/reference number to proceed further. |  |
| `PAYR-1256` | Response for Authentication Consent Questionnaire is missing for case number %s. This must be sent if the biometric authentication for patient is not available. For new preauthorization request, either biometric authentication for patient or response for Authentication Consent questionnaire must be sent. Please check/update the insurance plan for the policy for the details of the questionnaire. Please adhere to the response of the coverage eligibility for auth-requirements purpose to check the mandatory documents to be attached with the request |  |
| `PAYR-1257` | Payment is initiated for case number %s. Hence the preauthorization can not be cancelled again. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled |  |
| `PAYR-1258` | Payment is accomplished/cleared for case number %s. Hence the preauthorization can not be cancelled again. Only the cases with current status as preauthorization submitted or preauthorization approved can be cancelled |  |
| `PAYR-1259` | DOB is missing for new born for the case number (%s) with correlation id as (%s) at (%s) |  |
| `PAYR-1260` | DOB cannot be a future date for the case number (%s) with correlation id as (%s) at (%s) |  |
| `PAYR-1261` | Invalid new born details for the case number (%s) with correlation id as (%s) at (%s) |  |
| `PAYR-1262` | Gender is mandatory for the new born beneficiary |  |
| `PAYR-1263` | Documents are mandatory for the new born beneficiary |  |
| `PAYR-1264` | Documents are mandatory for the new born beneficiary |  |
| `PAYR-1265` | Documents are mandatory for the new born beneficiary |  |
| `PAYR-1266` | Documents are mandatory for the new born beneficiary |  |
| `PAYR-1267` | Beneficiary is having an active preauthorization request for new born case at this hospital with reference number %s. Hence the request will not be processed. Kindly cancel the active preauthorization request or raise a claim to proceed with current preauthorization |  |
| `PAYR-1268` | Beneficiary is having an active preauthorization request for new born case at %s. Hence the request will not be processed. Kindly inform %s to cancel the active preauthorization request or raise a claim to proceed with current preauthorization |  |
| `PAYR-1269` | Date of birth received for new born beneficiary exceeds 6 years before the current date. New born cases can be raised only for the beneficiary whose date of birth is within 6 years of current date |  |
| `PAYR-1270` | Item LM100 is not applicable for preauthorization request. This item is expected/mandated only during claim submission if the patient is discharged after/during surgery under LAMA/DAMA category for PMJAY cases. |  |
| `PAYR-1271` | No value received for link id %s for Authentication Consent Questionnaire for preauthorization request. This must be sent if the biometric authentication for patient is not available. For new preauthorization request, either biometric authentication for patient or response for Authentication Consent questionnaire must be sent. Please check/update the insurance plan for the policy for the details of the questionnaire. Please adhere to the response of the coverage eligibility for auth-requirements purpose to check the mandatory documents to be attached with the request. |  |
| `PAYR-1272` | Invalid biometric user token received. Please try again with valid valid biometric details of the beneficiary. For any issues with biometric, please try with Authentication Consent Questionnaire, details for which has been received in response for coverage eligibliity auth-requirements. |  |
| `PAYR-1273` | No questionnaire found for the received selection. Please validate the questionnaire url from insurance plan/coverage auth-requirements response. |  |

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/nhcx/v1/reference/error-codes).

<a class="next-step" href="/docs/support">
<span class="next-step__eyebrow">Next</span>
<span class="next-step__label">Still stuck? Ask for help</span>
<span class="next-step__detail">Where to file what you hit, so the answer lands back in these pages.</span>
</a>
