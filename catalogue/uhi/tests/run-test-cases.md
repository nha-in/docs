---
id: uhi.test.run-test-cases
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Run your UHI service's test cases
summary: Build against the sample payloads and the UHI API reference, then pass
  every test case for your service in the sandbox.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/going-live.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/going-live.mdx#1-build-and-run-your-services-test-cases.
      Edit the page, never this file.
related:
  tests:
    - uhi.test.every-service-checks
    - uhi.test.consultation-go-live-checklist
    - uhi.test.pmjay-hem-context
    - uhi.test.ambulance-context
  sandbox:
    - uhi.sandbox.demo-sign-off
---

# Run your UHI service's test cases

## In plain words

Build against the sample payloads on your service's page and the
[UHI API reference](/docs/uhi/v1/api). Then run every test case for that
service in the sandbox.

| Service | Test cases |
| --- | --- |
| [Physical Consultation](/docs/uhi/v1/services/consultation) | [Physical Consultation test cases](/docs/uhi/v1/resources/consultation) |
| [PM-JAY HEM](/docs/uhi/v1/services/pmjay-hem) | [PM-JAY HEM test cases](/docs/uhi/v1/resources/pmjay-hem) |
| [Blood Bank](/docs/uhi/v1/services/blood-bank) | [Blood Bank test cases](/docs/uhi/v1/resources/blood-bank) |
| [Ambulance Booking](/docs/uhi/v1/services/ambulance) | [Ambulance Booking test cases](/docs/uhi/v1/resources/ambulance) |
| [Jan Aushadhi](/docs/uhi/v1/services/jan-aushadhi) | [Jan Aushadhi test cases](/docs/uhi/v1/resources/jan-aushadhi) |
| [NOTTO](/docs/uhi/v1/services/notto) | [NOTTO test cases](/docs/uhi/v1/resources/notto) |

[Build it well](/docs/uhi/v1/getting-started/build-it-well#checked-for-every-service)
lists what every service is checked against.

**You get:** a passing sandbox integration.

## How you know it worked

Every test case on your service's test case page passes in the sandbox, along with the checks every service shares. Request sign-off only after that.
