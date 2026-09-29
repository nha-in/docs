---
id: uhi.test.pmjay-hem-user-experience
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM test cases for your app's screens
summary: TC-D01 to TC-D08 check how a beneficiary reaches the search, the label,
  branding, location search, empty results and the disclaimer.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/pmjay-hem.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/pmjay-hem.md#d-user-experience.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.screen-requirements
  tests:
    - uhi.test.every-service-checks
  flows:
    - uhi.flow.pmjay-hem-discovery
---

# PM-JAY HEM test cases for your app's screens

## In plain words

Check these by walking through your app on a test device and inspecting the
screens.

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-D01 | A beneficiary finds the feature quickly. | PM-JAY hospital search is reachable from the home screen in 3 taps or fewer. |
| TC-D02 | The feature's name says what it does. | The entry point label clearly communicates PM-JAY empanelment, for example "PMJAY Hospital Search" or "Find PMJAY Hospitals". |
| TC-D03 | The search screen shows where the data comes from. | UHI, PM-JAY and [ABDM](/docs/uhi/v1/getting-started/glossary#abdm) branding all appear in the footer of the search screen, unobtrusively. |
| TC-D04 | Searching by the phone's location works. | A search using the device GPS returns results geographically consistent with the device location. |
| TC-D05 | Typing in a location works. | A search with a manually entered state, district or pincode returns results matching the entered location. |
| TC-D06 | An empty result is explained. | A valid search that yields no hospitals shows a message suggesting next steps, such as a wider radius or a nearby district. The screen is never blank. |
| TC-D07 | The results carry the disclaimer. | The results screen shows "Please confirm the hospital location by calling ahead, as details may change." |
| TC-D08 | The feature sits with health features. | PM-JAY hospital search appears under a health, hospital or insurance module, not under wellness, offers or lifestyle. |
