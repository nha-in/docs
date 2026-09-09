# Log in to the HPR with a username and password

`POST /v4/int/api/v1/auth/authPassword`

One of the five HPR login routes, and the only one with a published
path. Returns the
`hprToken` that the HFR create call carries in its header.

The password is encrypted with the ABDM public certificate before it goes
in the body. Not run against the ABDM sandbox, so the request and
response shapes are unconfirmed.

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v4/int/api/v1/auth/authPassword
```
