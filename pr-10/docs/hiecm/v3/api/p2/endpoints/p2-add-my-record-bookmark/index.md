# Add My Record Bookmark

`POST /api/care-context-link/my-record/bookmark`

Bookmarks a self-uploaded record by its care context reference.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/my-record/bookmark \
  --header 'Content-Type: application/json' \
  --data '{
  "careContextReference": "care-context-ref-001",
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```
