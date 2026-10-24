# Errors, M1

Every error below is an OODA loop: observe the error code and last request id, orient against the matched code, decide the fix, act, and observe whether the original step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.

Loop limit: 5 passes per error.

Exit condition: the original call now succeeds. Applying a fix is not the exit.

## Every code in the specification

### Codes

| Code | HTTP | Message | Returned by |
| --- | --- | --- | --- |
| `404` | 404 | Runtime Error | `m1_post_v3_profile_login_verify_find_abha_face` |
| `900900` | 500 | Unclassified Authentication Failure | `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285` |
| `900901` | 401 | Invalid Credentials | `m1_post_v3_enrollment_request_otp_aadhaar_otp` |
| `900902` | 401 | Missing Credentials | `m1_post_v3_profile_benefit_search_xmluid` |
| `ABDM-1017` | 401 | Invalid Transaction Id | `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp` |
| `ABDM-1021` | 401 | Lack of required priviledges | `m1_post_v3_enrollment_enrol_byaadhaar_child_child_abha` |
| `ABDM-1094` | 401 | X-token expired | `m1_post_v3_enrollment_enrol_byaadhaar_child_child_abha` |
| `ABDM-1114` | 404 | User not found | `m1_patch_v3_profile_account_child_child_abha` |
| `ABDM-1124` | 422 | The mobile number provided by you is already linked to 6 ABHA Numbers. Please provide a different Mobile Numb… | `m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_create_ab_81107d` |
| `ABDM-1138` | 400 | The benefit record has already been de-linked | `m1_post_v3_profile_benefit_linkanddelink_x_token` |
| `ABDM-1140` | 400 | The benefit record has already been linked | `m1_post_v3_profile_benefit_linkanddelink_x_token` |
| `ABDM-1157` | 422 | Child ABHA’s account limit has been exceeded for the requested Abha ID number ‘<ABHA_NUMBER> | `m1_post_v3_enrollment_enrol_byaadhaar_child_child_abha` |
| `ABDM-1160` | 422 | Non KYC CHILD ABHA is allowed to update their profile only once | `m1_patch_v3_profile_account_child_child_abha` |
| `ABDM-1204` | 422 | UIDAI Error code : 400 : Invalid Aadhaar OTP value. | `m1_post_v3_enrollment_enrol_byaadhaar_otp` |
| `ABDM-1207` | 422 | The information you provided does not match the details on record with Aadhaar. Please verify and provide acc… | `m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_create_ab_81107d` |
| `ABDM-1211` | 400 | User not found. | `m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f` |
| `ABDM-1224` | 401 | Login via Biometric is not allowed. | `m1_post_v3_profile_login_request_otp_find_abha_face` |

A code you meet that is not above is one the specifications do not carry yet. Read the code together with the message: a code can appear twice with different meanings.
