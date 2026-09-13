# Get All Care Context Links for ABHA Address

`POST /api/care-context-link/my-records/fetch/all`

Lists the care context links for an ABHA address with paging and filters: HIP, record type, bookmarked, self-uploaded and date range.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/my-records/fetch/all \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "limit": 10,
  "offset": 0,
  "hipId": "",
  "hiType": "",
  "bookmarked": null,
  "selfUploaded": null,
  "dateRange": null,
  "sortHipName": null
}'
```
