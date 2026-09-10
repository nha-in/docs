# call-back on-init

`POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-init`

Callback the gateway sends after a link is initiated: the link reference and how the person will authenticate, or the error that stopped it.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/on-init
```
