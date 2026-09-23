# Authenticating with NHCX

*Source: `documents/Authenticating with NHCX.pdf` — extracted full text*

**Pages: 1**


---

## Page 1

Authenticating with NHCX
To access the NHCX APIs hosted on NHCX sandbox application, each provider or payer needs
to register themselves through ABDM sandbox entry process. Upon approval of the
application form, each entity will be provided with client id and secret key.
Using the credentials, health insurance provider or payer obtains a time-limited token, valid
for X number of seconds, with which it identifies itself to the HCX Gateway. When the
token's time limit elapses, the health insurance provider or payer should call sessions API to
renew the token. When calling any API, the provider or payer should pass the authentication
token as part of the 'Authorization' http header.
Following is the curl command the obtain the Authorization Token
curl --location --request POST 'https://dev.abdm.gov.in/gateway/v0.5/sessions' --header 'Content-Type: application/json'
- data-raw '
-
{
"clientId": "clientId-you-received",
"clientSecret": "secret-you-received"
}
Following the response
{
“accessToken”:”JWT token”,“expiresIn”:300,
“refreshTokenIn”:300,
“refreshToken”:”JWT token”,
“tokenType”:”bearer”
}
Note: Any provider who obtains the client id and secret key for ABDM ABHA integration, can
use the same credentials for accessing the NHCX gateway. No separate credentials required.

**Table 1.1**

| curl --location --request POST 'https://dev.abdm.gov.in/gateway/v0.5/sessions' --header 'Content-Type: application/json' |
|---|
| data-raw ' |


**Table 1.2**

| "clientId": "clientId-you-received", |
|---|
|  |
| "clientSecret": "secret-you-received" |
