# 2026-09-05: four operations shared two titles

Three operation summaries were used by two pages each, which made them
indistinguishable in search results and in the sidebar. A reader searching
"consent notification" got two identical rows and no way to tell which was
theirs.

| Was | Now | Why they differ |
| --- | --- | --- |
| Acknowledge a consent notification (m2) | Acknowledge a consent notification, as the HIP | `/consent/v3/request/hip/on-notify` |
| Acknowledge a consent notification (m3) | Acknowledge a consent notification, as the HIU | `/consent/v3/request/hiu/on-notify` |
| 1. Request OTP (p1) | 1. Request OTP for a PHR registration | `/api/registration/phr/request/otp` |
| 1. Request OTP (p1) | 1. Request OTP for an ABHA registration | `/api/registration/abha/request/otp` |

Each new summary states what its own path already states, so nothing was
decided here that the file did not already say.

## Left alone

`hiecm-phr-services.yaml` has two operations both called "Search Facilities
Within Radius", at `/health/service/facility/geo-location/search-within-radius`
and `/api/health/service/facility/geo-location/search-within-radius`. They
differ only by an `/api` prefix, which reads like a duplicate carried in from
the Postman collection these were derived from rather than two real endpoints.
Which of the two answers has not been checked against a sandbox, so neither
was renamed and neither was removed. Resolving it needs one request to each.
