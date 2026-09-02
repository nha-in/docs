# 2026-09-01: Postman export duplicates and a misspelling

NHA's Aarogya Setu Postman export contains seven operations whose names end
in " Copy", plus one operationId misspelled "preffered". Each of the seven
was compared against the operation it was expected to duplicate before any
change was made.

The comparison found that none of the seven is a byte-identical duplicate of
another operation already present in the curated spec. Every one was
retitled to drop "Copy" rather than deleted. Details below.

## The seven " Copy" operations

### hiecm-p1.yaml: ENCRYPTION Copy (line 72)

The raw Postman collection has two requests named "ENCRYPTION Copy", one in
the "AS Login service" folder and one in "As profile service" folder, both
posting to `/abha/api/v3/phr/app/enrollment/encrypt`. Neither raw entry is
named "ENCRYPTION" without "Copy". Because OpenAPI paths are unique keys,
the curated spec can only carry one operation for that path, and the ingest
kept the "AS Login service" copy. There is no sibling operation in
`hiecm-p1.yaml` to diff against and nothing to remove. The name was
misleading, since it called the operation a copy of something that does not
exist in this file. Retitled: `operationId` `p1_encryption_copy` to
`p1_encryption`, `summary` "ENCRYPTION Copy" to "ENCRYPTION", `x-abdm-atom`
`hiecm.endpoint.p1-encryption-copy` to `hiecm.endpoint.p1-encryption`.

### hiecm-p1.yaml: Send AADHAAR Otp - Link-DeLink Copy (line 3288)

Same situation. The raw collection has both "Send AADHAAR Otp - Link-DeLink"
and "... Copy" entries across several folders, but the curated `hiecm-p1.yaml`
only carries the "Copy" name at `/login/profile/request/otp`. No non-Copy
sibling exists in the curated file. Retitled: `operationId`
`p1_send_aadhaar_otp_link_delink_copy` to `p1_send_aadhaar_otp_link_delink`,
`summary` to "Send AADHAAR Otp - Link-DeLink", `x-abdm-atom` to
`hiecm.endpoint.p1-send-aadhaar-otp-link-delink`.

### hiecm-p1.yaml: Verify AADHAAR Otp - Link-DeLink Copy (line 3358)

Same situation as above, at `/login/profile/verify`. No non-Copy sibling
exists in the curated file. Retitled: `operationId`
`p1_verify_aadhaar_otp_link_delink_copy` to
`p1_verify_aadhaar_otp_link_delink`, `summary` to "Verify AADHAAR Otp -
Link-DeLink", `x-abdm-atom` to
`hiecm.endpoint.p1-verify-aadhaar-otp-link-delink`.

### hiecm-p2.yaml: Public -Get-Subscribed-Lockers-By-PatientId Copy (line 3240)

Only one operation exists in `hiecm-p2.yaml` for
`/health-locker/subscription-requests/patients/lockers`, carrying the
"Copy" name. No sibling to diff against. Retitled: `operationId`
`p2_public_get_subscribed_lockers_by_patientid_copy` to
`p2_public_get_subscribed_lockers_by_patientid`, `summary` to
"Public -Get-Subscribed-Lockers-By-PatientId", `x-abdm-atom` to
`hiecm.endpoint.p2-public-get-subscribed-lockers-by-patientid`.

### hiecm-p3.yaml: Get all notification details Copy (line 4410)

Only one operation exists in `hiecm-p3.yaml` for
`/api/notification/get-notification`, carrying the "Copy" name. No sibling
to diff against. Retitled: `operationId`
`p3_get_all_notification_details_copy` to
`p3_get_all_notification_details`, `summary` to "Get all notification
details", `x-abdm-atom` to `hiecm.endpoint.p3-get-all-notification-details`.

### hiecm-phr-services.yaml: Search Facilities Within Radius Copy (line 12244)

This is the one pair in the batch where a non-Copy sibling actually exists
in the curated spec, at line 1274, path
`/api/health/service/facility/geo-location/search-within-radius`. The
request and response bodies are identical line for line. The path is not:
the base operation's path carries an `/api/` prefix, the "Copy" operation's
does not. Checking the raw collection explains why: the base request uses
Postman variable `{{baseurl-AS-internal}}` and the "Copy" request uses
`{{base-url-AS-prod-internal}}`, a different environment variable, so the
two requests point at different routes even though everything else about
them matches. Because the path differs, this is not a byte-identical
duplicate and was not removed. Retitled instead, and since the two
operations do the same thing, the summary states that plainly rather than
naming the host; the route distinction goes in the operation `description`
instead, where a reader who lands on this operation can see why it exists
alongside the other one: `operationId`
`phr_services_search_facilities_within_radius_copy` to
`phr_services_search_facilities_within_radius_alt`, `summary` stays "Search
Facilities Within Radius" (unchanged, matching the operation it duplicates
in behaviour), `x-abdm-atom` to
`hiecm.endpoint.phr-services-search-facilities-within-radius-alt`, and a new
`description` explaining that this is the same search reached through a
second route recorded separately in NHA's collection, without the `/api`
prefix the other route carries.

### hiecm-phr-services.yaml: Get Facility Details By Search ID Copy (line 58345)

A non-Copy sibling exists at line 15573, path
`/health/service/facility/search/IN3310027864`, part of the
"Nearby-health-Service-search service" folder. The "Copy" operation's path
is `/v4/hfr/facility/search/searchFacility/IN2710002401`. This is not a
naming accident: the raw collection shows the base request goes to
`{{base-url-AS-prod-internal}}`, the PHR nearby-health-service host, while
the "Copy" request has a hardcoded absolute URL,
`https://apinhpr.abdm.gov.in/v4/hfr/facility/search/searchFacility/...`,
the Health Facility Registry v4 host. Same Postman folder, completely
different API. Request bodies, response schemas, and the whole shape of the
two operations differ beyond the name. This was not removed. Retitled to
describe what it actually does: `operationId`
`phr_services_get_facility_details_by_search_id_copy` to
`phr_services_hfr_facility_search_by_id`, `summary` to "Get HFR Facility
Details By Search ID", `x-abdm-atom` to
`hiecm.endpoint.phr-services-hfr-facility-search-by-id`. A new `description`
states plainly that this queries the Health Facility Registry, a separate
NHA system from the nearby-health-service facility search elsewhere in this
file, not an alternate route to the same data.

## Removed

None. All seven were retitled, not deleted. Step 1's comparison found that
five of the seven have no sibling operation in the curated spec to be a
duplicate of, and the remaining two siblings differ in path and, in one
case, in the target host and body shape as well. Deleting any of them would
have removed a real, reachable endpoint from the curated reference.

## The misspelling

`hiecm-p1.yaml`, path `/profile/phr/set-preferred/abha-address` (the path
itself was already spelled correctly). Renamed `operationId`
`p1_set_preffered_abha_address` to `p1_set_preferred_abha_address`,
`summary` "set-preffered/abha-address" to "Set the preferred ABHA address",
`x-abdm-atom` `hiecm.endpoint.p1-set-preffered-abha-address` to
`hiecm.endpoint.p1-set-preferred-abha-address`.

No atom file matched either the "-copy" ids or the misspelled
"preffered" id under `catalogue/hiecm/endpoints/`, so there was nothing to
rename or move there.

The raw export under `.raw/` is untouched. All changes are in the curated
files under `catalogue/openapi/hiecm/v3/`.
