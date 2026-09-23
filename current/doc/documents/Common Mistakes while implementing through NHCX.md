# Common Mistakes while implementing through NHCX

*Source: `documents/Common Mistakes while implementing through NHCX.pdf` — extracted full text*

**Pages: 2**


---

## Page 1

Common Mistakes while passing through NHCX:
1. Improper usage of status:
Solution: Please refer to the status codes from website (Initial Request Trigger Status->
request.initiated. Response Statuses-> response.complete, response.partial, response.error)
Link: https://nhcx.abdm.gov.in/#/technical-specifications
2. Not Handling the error scenarios:
Solution: v1/error implementation (sender gets update regarding the request if it failed to reach
recipient) provided in document : API Response Handling to avoid Failures
3. Improper implementation of the Protocol Response: Invalid response code and response body
Solution: For any request http response code should be 202 Accepted with body which provided in
Acceptance scenario in document : API Response Handling to avoid Failures
4. Not following the proper Protocol Headers
Solution: Please pass the proper protocol Headers listed in the link below:
https://nhcx.abdm.gov.in/#/technical-specifications (Message Structure)
e.g. {"alg":"RSA-OAEP-256","enc":"A256GCM","x-hcx-api_call_id":"961b29bc-72fa-45fe-8735-
xxxxxxbc3e3b","x-hcx-workflow_id":"33","x-hcx-request_id":"eb1b2d8c-xxxx-438b-xxxx-
8313875da3c9","x-hcx-status":"request.initiate","x-hcx-timestamp":"1723529473885","x-hcx-
sender_code":"PYRxx@hcx","x-hcx-recipient_code":"INxxx@hcx","x-hcx-correlation_id":"17301a2d-
fb34-4bf1-xxxx-bfxxxxxxx310","x-hcx-ben-abha-id":""}
5. In PROD when passing the registry ID
Solution: For Providers, use the HFR ID as the registry ID.
For Payers the IRDAI registry ID should be passed as the Registry ID (e.g. 125 pass 125, if 0123 then
pass 123).
6. Missing the Accept parameter in the API call header
Solution: Pass the headers listed below:

---

## Page 2

Accept:application/json
Content-Type:application/json
bearer_auth:Bearer ###
7. Providers pointing to the PayerID of getPolicy API response
Solution: Providers should use the processingID from the response of the get/Policies to pass in the
receiver code.
8. Use of improper Correlation ID
Solution: The Correlation ID is a UUID, and it has to be unique for each request cycle.
Note: In case of error/failure the CorrelationID is made inactive in our system and a fresh request
has to be triggered.
9. 401/Unauthorized error for API call – Invalid token
Solution: The token is validated from the ABDM and must be renewed, in case of 401 error for
Unauthorized, first generate a new token and try with that.
10. Policy Linking/Delinking auth restriction- Not everyone can perform the activity
Solution: Only those listed in the payerID & PolicyID during the linking are authorized.
Note: The client ID used to generate token during participant creation for these entities should be
used to generate the token to perform these tasks, in case of mismatch please confirm over email.