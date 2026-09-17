# Integrate M4, facility and professional registries

The calls themselves: where they live, what they need in their headers, and one request written out in full.

## Hosts

- `https://apihspsbx.abdm.gov.in/v4/int` NHPR, sandbox
- `https://dev.abdm.gov.in` ABDM gateway, sandbox
- `https://apis.abdm.gov.in` ABDM gateway, production
## Endpoints

228 operations, grouped by the journey they belong to.

### Other operations

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/aadhaar/generateLink` | Generate Aadhaar Link |
| `POST` | `/aadhaar/generateLink` | Generate Aadhaar Link |
| `POST` | `/aadhaar/isAuthenticated` | Is Aadhaar Authenticated |
| `POST` | `/aadhaar/isAuthenticated` | Is Aadhaar Authenticated |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open id configuration. |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | This API is invoked to get the open id configuration. |
| `PUT` | `/api/hiecm/gateway/v3/bridge-service` | v3/gateway/bridge-service |
| `PUT` | `/api/hiecm/gateway/v3/bridge-service` | v3/gateway/bridge-service |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{service-id}` | This API is invoked to fetch the details of a service id. |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{service-id}` | This API is invoked to fetch the details of a service id. |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | This API will fetch the service ids registered against a bridge. |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | This API will fetch the service ids registered against a bridge. |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | This API is invoked to update the bridge URL. |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | This API is invoked to update the bridge URL. |
| `GET` | `/api/hiecm/gateway/v3/certs` | This API is invoked to get the certificate information. |
| `GET` | `/api/hiecm/gateway/v3/certs` | This API is invoked to get the certificate information. |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | This API is invoked to fetch the list of govt programs. |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | This API is invoked to fetch the list of govt programs. |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | This API is invoked to fetch the record with health locker enabled provider det… |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | This API is invoked to fetch the record with health locker enabled provider det… |
| `GET` | `/api/hiecm/gateway/v3/providers` | This API is invoked to fetch the list of providers filtered by name. |
| `GET` | `/api/hiecm/gateway/v3/providers` | This API is invoked to fetch the list of providers filtered by name. |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | This API is invoked to fetch the record for provider details for requested prov… |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | This API is invoked to fetch the record for provider details for requested prov… |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/hiecm/gateway/v3/sessions` | This API is invoked to generate keycloak token/access token. |
| `POST` | `/api/v1/auth/authPassword` | Login Via Password |
| `POST` | `/api/v1/auth/authPassword` | Login Via Password |
| `GET` | `/api/v1/auth/cert` | Get Public Certificate |
| `GET` | `/api/v1/auth/cert` | Get Public Certificate |
| `POST` | `/api/v1/auth/confirmWithAadhaarOtp` | Verify Aadhaar OTP 1 |
| `POST` | `/api/v1/auth/confirmWithAadhaarOtp` | Verify Aadhaar OTP 1 |
| `POST` | `/api/v1/auth/init` | Send Via Aadhaar OTP |
| `POST` | `/api/v1/auth/init` | Send Via Aadhaar OTP |
| `POST` | `/api/v2/auth/loginViaMobileSendOTP` | Send Verify OTP |
| `POST` | `/api/v2/auth/loginViaMobileSendOTP` | Send Verify OTP |
| `POST` | `/apis/v1/doctors/fetch-documents-list` | Fetch Documents |
| `POST` | `/apis/v1/doctors/fetch-documents-list` | Fetch Documents |
| `POST` | `/apis/v1/doctors/fetch-professional-info` | Get Professional Info |
| `POST` | `/apis/v1/doctors/fetch-professional-info` | Get Professional Info |
| `POST` | `/apis/v1/doctors/generate-mobile-otp` | Generate Mobile OTP 2 |
| `POST` | `/apis/v1/doctors/generate-mobile-otp` | Generate Mobile OTP 2 |
| `POST` | `/apis/v1/doctors/generate-verification-email` | Send Verification Email |
| `POST` | `/apis/v1/doctors/generate-verification-email` | Send Verification Email |
| `POST` | `/apis/v1/doctors/regenerate-mobile-otp` | Regenerate Mobile OTP |
| `POST` | `/apis/v1/doctors/regenerate-mobile-otp` | Regenerate Mobile OTP |
| `POST` | `/apis/v1/doctors/register-professional-new` | Register Professtional |
| `POST` | `/apis/v1/doctors/register-professional-new` | Register Professtional |
| `POST` | `/apis/v1/doctors/resent-verify-email` | Resent Verification Email |
| `POST` | `/apis/v1/doctors/resent-verify-email` | Resent Verification Email |
| `POST` | `/apis/v1/doctors/update-professional-new` | Update Professtional |
| `POST` | `/apis/v1/doctors/update-professional-new` | Update Professtional |
| `POST` | `/apis/v1/doctors/verify-email-otp` | Verify Email OTP |
| `POST` | `/apis/v1/doctors/verify-email-otp` | Verify Email OTP |
| `POST` | `/apis/v1/doctors/verify-mobile-otp` | Verify Mobile Otp |
| `POST` | `/apis/v1/doctors/verify-mobile-otp` | Verify Mobile Otp |
| `GET` | `/apis/v1/masters/affiliated-board` | Get All Affiliated Board |
| `GET` | `/apis/v1/masters/affiliated-board` | Get All Affiliated Board |
| `GET` | `/apis/v1/masters/affiliated-board/{id}` | Get Affiliated Board By Id |
| `GET` | `/apis/v1/masters/affiliated-board/{id}` | Get Affiliated Board By Id |
| `GET` | `/apis/v1/masters/affiliated-board/states/{id}` | Get Affiliated Board By State Id |
| `GET` | `/apis/v1/masters/affiliated-board/states/{id}` | Get Affiliated Board By State Id |
| `GET` | `/apis/v1/masters/colleges/{id}` | Get College By State |
| `GET` | `/apis/v1/masters/colleges/{id}` | Get College By State |
| `GET` | `/apis/v1/masters/colleges/{stateId}/{medicineId}` | Get College By State And Medicine Id |
| `GET` | `/apis/v1/masters/colleges/{stateId}/{medicineId}` | Get College By State And Medicine Id |
| `GET` | `/apis/v1/masters/countries` | Get All Countries |
| `GET` | `/apis/v1/masters/countries` | Get All Countries |
| `GET` | `/apis/v1/masters/countries/{id}` | Get Countries By Id |
| `GET` | `/apis/v1/masters/countries/{id}` | Get Countries By Id |
| `POST` | `/apis/v1/masters/courses` | List Courses |
| `POST` | `/apis/v1/masters/courses` | List Courses |
| `GET` | `/apis/v1/masters/district` | Get All Districts |
| `GET` | `/apis/v1/masters/district` | Get All Districts |
| `GET` | `/apis/v1/masters/district/{id}` | Get Districts By State |
| `GET` | `/apis/v1/masters/district/{id}` | Get Districts By State |
| `GET` | `/apis/v1/masters/languages` | List Government Health Programmes |
| `GET` | `/apis/v1/masters/languages` | List Government Health Programmes |
| `GET` | `/apis/v1/masters/languages/{id}` | Get Pi Languages By Id |
| `GET` | `/apis/v1/masters/languages/{id}` | Get Pi Languages By Id |
| `GET` | `/apis/v1/masters/medical-councils` | Get All Medical Council |
| `GET` | `/apis/v1/masters/medical-councils` | Get All Medical Council |
| `GET` | `/apis/v1/masters/medical-councils/name` | Get Medical Council By System Of Medicine Name |
| `GET` | `/apis/v1/masters/medical-councils/name` | Get Medical Council By System Of Medicine Name |
| `GET` | `/apis/v1/masters/nurse-councils` | Get All Nurse Councils |
| `GET` | `/apis/v1/masters/nurse-councils` | Get All Nurse Councils |
| `GET` | `/apis/v1/masters/states` | Get All States |
| `GET` | `/apis/v1/masters/states` | Get All States |
| `GET` | `/apis/v1/masters/states/{id}` | Get Status |
| `GET` | `/apis/v1/masters/states/{id}` | Get Status |
| `GET` | `/apis/v1/masters/sub-districts` | Get All Sub Districts |
| `GET` | `/apis/v1/masters/sub-districts` | Get All Sub Districts |
| `GET` | `/apis/v1/masters/sub-districts/{id}` | Get All Sub Districts 1 |
| `GET` | `/apis/v1/masters/sub-districts/{id}` | Get All Sub Districts 1 |
| `GET` | `/apis/v1/masters/system-of-medicines` | Get All Medical System |
| `GET` | `/apis/v1/masters/system-of-medicines` | Get All Medical System |
| `GET` | `/apis/v1/masters/universites` | List All University |
| `GET` | `/apis/v1/masters/universites` | List All University |
| `GET` | `/apis/v1/masters/universites/{id}` | Get University By College |
| `GET` | `/apis/v1/masters/universites/{id}` | Get University By College |
| `POST` | `/apis/v1/uploads/upload-document` | Upload Documents |
| `POST` | `/apis/v1/uploads/upload-document` | Upload Documents |
| `POST` | `/FacilityManagement/v1.5/facility/bygeoLocation/searchFacilityAndInfrastructureWithinRadiusWithFilter` | Get Facility And Infrastructure Within Radius With Filter |
| `POST` | `/FacilityManagement/v1.5/facility/bygeoLocation/searchFacilityAndInfrastructureWithinRadiusWithFilter` | Get Facility And Infrastructure Within Radius With Filter |
| `POST` | `/FacilityManagement/v1.5/facility/search` | Search Facility |
| `POST` | `/FacilityManagement/v1.5/facility/search` | Search Facility |
| `POST` | `/fetchProfessionalFacility` | Fetch Professional Facility |
| `POST` | `/fetchProfessionalFacility` | Fetch Professional Facility |
| `POST` | `/getFacilityCreatedByHprId` | Get Facilities Created By Hpr Id |
| `POST` | `/getFacilityCreatedByHprId` | Get Facilities Created By Hpr Id |
| `POST` | `/getFacilityDeclaredByHprId` | Get Facilities Declared By Hpr Id |
| `POST` | `/getFacilityDeclaredByHprId` | Get Facilities Declared By Hpr Id |
| `POST` | `/getManagementToken` | Get Admin Token |
| `POST` | `/getManagementToken` | Get Admin Token |
| `GET` | `/getPsuDetailsByMinistry` | Get Psu Data |
| `GET` | `/getPsuDetailsByMinistry` | Get Psu Data |
| `POST` | `/healdthloginwithmobile` | Healdthloginwithmobile |
| `POST` | `/healdthloginwithmobile` | Healdthloginwithmobile |
| `GET` | `/hpid/get/categories` | Fetch Hp Id Categories |
| `GET` | `/hpid/get/categories` | Fetch Hp Id Categories |
| `GET` | `/hpid/get/subCategories` | Fetch Hp Id Sub Categories From Category |
| `GET` | `/hpid/get/subCategories` | Fetch Hp Id Sub Categories From Category |
| `POST` | `/hprFacilitySuggestions` | Create Facility Suggestion |
| `POST` | `/hprFacilitySuggestions` | Create Facility Suggestion |
| `PUT` | `/hprWorkDetails/status` | Update Status |
| `PUT` | `/hprWorkDetails/status` | Update Status |
| `POST` | `/password/change/byPassword` | Change Password |
| `POST` | `/password/change/byPassword` | Change Password |
| `POST` | `/password/recover/byAadhaar` | Recover Password Via Aadhaar |
| `POST` | `/password/recover/byAadhaar` | Recover Password Via Aadhaar |
| `POST` | `/password/recover/byMobile/sendMobileOTP` | Generate Mobile OTP 1 |
| `POST` | `/password/recover/byMobile/sendMobileOTP` | Generate Mobile OTP 1 |
| `POST` | `/password/recover/byMobile/verifyMobileOTP` | Verify Mobile OTP 1 |
| `POST` | `/password/recover/byMobile/verifyMobileOTP` | Verify Mobile OTP 1 |
| `POST` | `/password/recover/confirmByAadhaar` | Recover Password Confirm By Aadhaar |
| `POST` | `/password/recover/confirmByAadhaar` | Recover Password Confirm By Aadhaar |
| `POST` | `/password/reset/password` | Reset Password And Session |
| `POST` | `/password/reset/password` | Reset Password And Session |
| `POST` | `/password/resetPassword` | Reset Password |
| `POST` | `/password/resetPassword` | Reset Password |
| `POST` | `/profile/updateRole` | Update Role And Category |
| `POST` | `/profile/updateRole` | Update Role And Category |
| `POST` | `/relinkOrDelinkProfessionalFromFacility` | Link Delink Existing Facility |
| `POST` | `/relinkOrDelinkProfessionalFromFacility` | Link Delink Existing Facility |
| `POST` | `/search/address/filter/deduplicate` | Get Filtered Address Post |
| `POST` | `/search/address/filter/deduplicate` | Get Filtered Address Post |
| `POST` | `/v1.5/facility/additional-information` | V15Facility Additional Information |
| `POST` | `/v1.5/facility/additional-information` | V15Facility Additional Information |
| `POST` | `/v1.5/facility/basic-information` | V15Basic Facility Information |
| `POST` | `/v1.5/facility/basic-information` | V15Basic Facility Information |
| `POST` | `/v1.5/facility/detailed-information` | V15Facility Detailed Information |
| `POST` | `/v1.5/facility/detailed-information` | V15Facility Detailed Information |
| `POST` | `/v1.5/facility/fetch-facility-Sub-type` | Get All Facility Sub Type By Facility Type |
| `POST` | `/v1.5/facility/fetch-facility-Sub-type` | Get All Facility Sub Type By Facility Type |
| `POST` | `/v1.5/facility/fetch-facility-type` | Get All Facility Type By Ownership And Sys Of Med |
| `POST` | `/v1.5/facility/fetch-facility-type` | Get All Facility Type By Ownership And Sys Of Med |
| `GET` | `/v1.5/facility/get-master-data` | Get Master Data |
| `GET` | `/v1.5/facility/get-master-data` | Get Master Data |
| `GET` | `/v1.5/facility/get-master-types` | Get All Master Type |
| `GET` | `/v1.5/facility/get-master-types` | Get All Master Type |
| `POST` | `/v1.5/facility/get-owner-subtype` | Get All Sub Types By Owner Ship Type And Sub Type |
| `POST` | `/v1.5/facility/get-owner-subtype` | Get All Sub Types By Owner Ship Type And Sub Type |
| `POST` | `/v1.5/facility/get-specialities` | Get All Specialities By System Of Medicine Code |
| `POST` | `/v1.5/facility/get-specialities` | Get All Specialities By System Of Medicine Code |
| `GET` | `/v1.5/facility/lgd/districts` | Get All District By State Id |
| `GET` | `/v1.5/facility/lgd/districts` | Get All District By State Id |
| `GET` | `/v1.5/facility/lgd/states` | Get All States By LGD |
| `GET` | `/v1.5/facility/lgd/states` | Get All States By LGD |
| `GET` | `/v1.5/facility/lgd/subdistricts` | Get All Sub District By District Code |
| `GET` | `/v1.5/facility/lgd/subdistricts` | Get All Sub District By District Code |
| `POST` | `/v1.5/facility/sendOtpToContact` | Send Otp To Contact |
| `POST` | `/v1.5/facility/sendOtpToContact` | Send Otp To Contact |
| `POST` | `/v1.5/facility/submit-facility` | V15Submit Facility Details |
| `POST` | `/v1.5/facility/submit-facility` | V15Submit Facility Details |
| `POST` | `/v1.5/facility/validateOtp` | Validate Otp |
| `POST` | `/v1.5/facility/validateOtp` | Validate Otp |
| `GET` | `/v1/account/getIdCard` | Get Account Png Card |
| `GET` | `/v1/account/getIdCard` | Get Account Png Card |
| `GET` | `/v1/account/information` | Get User Profile By Jwt |
| `GET` | `/v1/account/information` | Get User Profile By Jwt |
| `POST` | `/v1/account/reKYC/generateAadhaarOTP` | Generate Aadhaar OTPFor Re KYC |
| `POST` | `/v1/account/reKYC/generateAadhaarOTP` | Generate Aadhaar OTPFor Re KYC |
| `POST` | `/v1/account/reKYC/verifyAadhaarOTP` | Verify Aadhaar OTP |
| `POST` | `/v1/account/reKYC/verifyAadhaarOTP` | Verify Aadhaar OTP |
| `POST` | `/v1/account/reKYC/verifyAadhaarOTPGetDetails` | Verify Aadhaar OTPGet Details |
| `POST` | `/v1/account/reKYC/verifyAadhaarOTPGetDetails` | Verify Aadhaar OTPGet Details |
| `GET` | `/v1/account/user-details/{hprId}` | Get User Details |
| `GET` | `/v1/account/user-details/{hprId}` | Get User Details |
| `POST` | `/v1/bridges/MutipleHRPAddUpdateServices` | Facility Add And Update |
| `POST` | `/v1/bridges/MutipleHRPAddUpdateServices` | Facility Add And Update |
| `POST` | `/v1/forgot/hprId/aadhaar` | Retrieval Health Id By Aadhaar |
| `POST` | `/v1/forgot/hprId/aadhaar` | Retrieval Health Id By Aadhaar |
| `POST` | `/v1/forgot/hprId/mobile` | Retrieval Health Id By Mobile |
| `POST` | `/v1/forgot/hprId/mobile` | Retrieval Health Id By Mobile |
| `POST` | `/v1/forgot/hprId/mobile/generateOtp` | Generate Mobile OTP |
| `POST` | `/v1/forgot/hprId/mobile/generateOtp` | Generate Mobile OTP |
| `POST` | `/v1/registration/aadhaar/checkHpIdAccountExist` | Account Exist |
| `POST` | `/v1/registration/aadhaar/checkHpIdAccountExist` | Account Exist |
| `POST` | `/v1/registration/aadhaar/generateMobileOTP` | Generate Mobile Otp |
| `POST` | `/v1/registration/aadhaar/generateMobileOTP` | Generate Mobile Otp |
| `POST` | `/v1/registration/aadhaar/hpid/suggestion` | Get Suggesstion |
| `POST` | `/v1/registration/aadhaar/hpid/suggestion` | Get Suggesstion |
| `POST` | `/v1/registration/aadhaar/verifyMobileOTP` | Verify Mobile OTP |
| `POST` | `/v1/registration/aadhaar/verifyMobileOTP` | Verify Mobile OTP |
| `GET` | `/v1/search/existsByHprId/{hprId}` | Exists By Hpr Id |
| `GET` | `/v1/search/existsByHprId/{hprId}` | Exists By Hpr Id |
| `GET` | `/v1/search/searchByHprId/{hprId}` | Search User By Hpr Id |
| `GET` | `/v1/search/searchByHprId/{hprId}` | Search User By Hpr Id |
| `GET` | `/v1/search/searchByMobile/{mobile}` | Search User By Mobile No |
| `GET` | `/v1/search/searchByMobile/{mobile}` | Search User By Mobile No |
| `POST` | `/v1/sendOtpIfDoctorVerified` | Send Otp If Doctor Verified |
| `POST` | `/v1/sendOtpIfDoctorVerified` | Send Otp If Doctor Verified |
| `POST` | `/v1/verifyDoctorVerificationOtp` | Verify Doctor Verification Otp |
| `POST` | `/v1/verifyDoctorVerificationOtp` | Verify Doctor Verification Otp |
| `POST` | `/v2/registration/aadhaar/createHprIdWithPreVerified` | Create Hpr Id V2 |
| `POST` | `/v2/registration/aadhaar/createHprIdWithPreVerified` | Create Hpr Id V2 |
| `POST` | `/v2/registration/aadhaar/demographicAuthViaMobile` | Demographic Auth Via Mobile |
| `POST` | `/v2/registration/aadhaar/demographicAuthViaMobile` | Demographic Auth Via Mobile |
| `POST` | `/v2/registration/aadhaar/verifyOTP` | Verify Otp |
| `POST` | `/v2/registration/aadhaar/verifyOTP` | Verify Otp |
| `GET` | `/v4/auth/logout` | Logout |
| `GET` | `/v4/auth/logout` | Logout |
## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | Unique UUID for track the end to end request transaction |
| `TIMESTAMP` | Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, follow… |
| `X-CM-ID` | Suffix of the consent manager to which the request was intended |
| `x-hprid-auth` |  |
| `x-hprid-auth-verifier` |  |
| `X-Token` |  |
## A request, in full

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/aadhaar/generateLink \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scopes": [
    "nhpr-register"
  ],
  "source": "NHPR"
}'
```
