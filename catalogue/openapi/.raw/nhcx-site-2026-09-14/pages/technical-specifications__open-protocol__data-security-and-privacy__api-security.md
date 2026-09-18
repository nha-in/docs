# https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/api-security

API Security
Details of API security to ensure authenticated and authorised access to APIs
The protocol defines an API key-based security for authentication and authorization of the API calls between the participating systems and the NHCX gateway. NHCX instances have to generate the API keys in the form of JWT tokens (
 RFC7519
) and shall mandatorily set an expiry time for all the generated tokens.
In future versions, NHCX instances may support JWTs issued by other system identity providers, e.g. Health Facility Registry's IDP.
Securing NHCX Gateway APIs
All participant systems (e.g.: providers, payers) should obtain an API key from the NHCX gateway with which it identifies itself to the gateway. When calling any API on the NHCX gateway, the participant system should pass the API key as part of the 'Authorization' http header.
Steps to obtain the API key:
After a successful verification and onboarding of a participant system onto the participant registry, the NHCX instance managing the registry shall share the following details via email, SMS, or both with the participant system:
client_id:
 this is the identifier of the participant in the participant registry.
client_secret:
 a unique secret is generated for the participant by the NHCX instance. The client_secret value shall be stored in the participant registry in an encrypted format and shall not be sent in the registry APIs.
The participant system follow the APIs to can call '/token/generate' API along with the client_id and client_secret they have received to obtain the API key.
POST https://dev.abdm.gov.in/gateway/v0.5/sessions
Content-Type: application/json
Request-Body:
{
"client_id": "client_id received by the participant",
"client_secret": "client_secret received by the participant"
}
NHCX instance would respond with the API token upon successful validation of the client_id and client_secret values:
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache, no-store
Response-Body:
{
"access_token": "the API key, a JWT access token",
"issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
"token_type": "Bearer",
"expires_in": 300
}
JWT Token Structure:
API keys are expected to be in JWT format and signed as per JSON web signature (RFC7515). The API key should have three elements separated by periods (.): BASE64URL(UTF8(JOSE Header)), BASE64URL(JWS Payload), and BASE64URL(JWS Signature).
JOSE Header should be a JSON with the following values:
{
"typ":"JWT",
"alg":"HS256"
}
JWS Payload should be a claim set containing the mandatory claims
 jti, iss, sub, iat
and
exp.
jti - unique identifier for the JWT
 iss - NHCX instance identifier
 sub - client_id of the participant
 iat - unix timestamp at which the JWT is issued
exp - the expiration time after which the JWT must not be accepted for processing
JWS Signature must be computed in the manner defined for HS256 algorithm over the input ASCII(BASE64URL(UTF8(JOSE Header)) || '.' || BASE64URL(JWS Payload)) using the client_secret value of the participant.
Revoking API Keys
NHCX instances can revoke the API key of a participant by generating a new client_secret and updating it in the participant registry. The participant system has to generate a new API key by calling the ‘/token/generate’ API with the new client_secret value.
Securing Participant System APIs
NHCX instances while making the calls to the participant system will use a self-generated JWT token with the following elements:
JOSE Header should be a JSON with the following values:
{
"typ":"JWT",
"alg":"RS256"
}
JWS Payload should be a claim set containing the mandatory claims j
 jti, iss, sub, iat
and
exp.
jti - unique identifier for the JWT
iss - NHCX instance identifier
sub - same as iss claim, NHCX instance identifier
iat - unix timestamp at which the JWT is issued
exp - the expiration time after which the JWT must not be accepted for processing
JWS Signature must be computed in the manner defined for RS256 algorithm over the input ASCII(BASE64URL(UTF8(JOSE Header)) || '.' || BASE64URL(JWS Payload)) using the private key of the NHCX instance.
Participant systems should validate the API key signature using the public key of the NHCX instance.


## Links on this page

- https://datatracker.ietf.org/doc/html/rfc7519
