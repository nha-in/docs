# Record share ingest, 21 September 2026

NHA supplied the Patient Scan and Record Share module as a Word document and
a Postman collection, not as a swagger file. Both are stored untouched under
`catalogue/openapi/.raw/nha-2026-09-21-record-share/` with their hashes in
its `MANIFEST.md`. The specification `hiecm/v3/hiecm-record-share.yaml` is
written from them by hand. Where the two sources disagree, or the document
disagrees with itself, the choice made is recorded here.

| Module | Operation | Change |
| --- | --- | --- |
| record-share | `POST /api/hiecm/patient-record/v3/share` | The document's body parameter table names the first property `metadata`; its request body, the callback body and every Postman request write `metaData`. The specification uses `metaData`. |
| record-share | `POST /api/hiecm/patient-record/v3/share` | The document's header table writes `X-AUTH -TOKEN` with a space; the Postman request writes `X-AUTH-TOKEN`. The specification uses `X-AUTH-TOKEN`. |
| record-share | every callback | The document gives the callback response as "202 OK" and the calls' as "202 ACCEPTED" or "202 Accepted". HTTP 202 is Accepted; the specification says Accepted throughout. |
| record-share | `POST {dataPushUrl}/health-information/transfer` | Not in the document's list of APIs. The Postman collection carries it as "03_Health-information_Transfer" in the PHR-APP folder, posting to the `dataPushUrl` the HIU supplied, so the specification declares it as a webhook hosted by the HIU at that URL. The body shape is the collection's placeholder body, unverified. |
| record-share | `POST /api/hiecm/patient-record/v3/notify` | The document lists the session and care context statuses each side sends. The Postman examples send the PHR app's `TRANSFERRED` with `DELIVERED`, and the HIU's `RECEIVED` with `DELIVERED`, which the document reserves for the PHR app. The specification carries the document's lists as the enums and the collection's bodies as examples. |
| record-share | `GET /api/hiecm/patient-record/v3/audit-history` | The document's query parameter table capitalises `Limit` and `Offset`; the Postman URL sends `limit` and `offset`. The specification uses the lower case names. |
| record-share | all | The document gives no error responses, only the success code. No error response is invented; the module's errors page will say the specification records none. |
