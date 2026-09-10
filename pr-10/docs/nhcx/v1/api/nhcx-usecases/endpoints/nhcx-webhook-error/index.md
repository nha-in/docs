# The exchange reports a message it could not deliver

`POST error`

Every participant must host `/v1/error`. The exchange calls it to report a request that could not be delivered after five attempts. Without it, a sender never learns that its request died.

This is the one path that carries neither of the two usual shapes. It has no `payload` and no `x-hcx-` fields: what arrives is a plain JSON report whose field names are not published. Store it whole rather than parsing it against a fixed schema, and still answer `202`.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcxerror
```
