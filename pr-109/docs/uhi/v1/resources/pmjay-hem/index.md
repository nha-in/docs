# PM-JAY HEM test cases

Run these test cases against the [UHI](/docs/pr-109/docs/uhi/v1/getting-started/glossary#uhi) sandbox before you request production sign-off for [PM-JAY HEM](/docs/pr-109/docs/uhi/v1/services/pmjay-hem). Each one says what it checks in plain words, then the exact condition that makes it pass.

Every case is a positive, happy path case. Categories D and E check your app's behaviour as well as the calls.

## A. The context block

| ID     | What it checks                                         | Passes when                                                                                                                         |
| ------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| TC-A01 | Your search is well formed and the Gateway accepts it. | You send a `search` with every `context` field populated. The Gateway returns HTTP 200 with an ACK and no error.                    |
| TC-A02 | The results you receive belong to the search you sent. | `context.transaction_id` in the `on_search` at your `consumer_uri` equals the `transaction_id` of the originating `search` exactly. |
| TC-A03 | The response is for PM-JAY HEM.                        | `context.domain` in the `on_search` is present and equals `nic2004:85112`.                                                          |

## B. Search filters

| ID     | What it checks                                                          | Passes when                                                                                                                                                                           |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-B01 | Searching a state returns hospitals in that state.                      | A `search` with `location.state.name` and `location.state.code` returns provider records, all in the specified state.                                                                 |
| TC-B02 | Adding a district narrows the results to that district.                 | A state `search` with `location.district.name` and `location.district.code` returns only hospitals in the specified district.                                                         |
| TC-B03 | Adding a speciality returns hospitals that offer it.                    | A state `search` with `category.descriptor.name` and `category.descriptor.code` returns providers whose `categories[]` each contain the matching speciality.                          |
| TC-B04 | Searching by hospital name finds that hospital.                         | A state `search` with `provider.descriptor.name` set to a known hospital returns hospitals whose name matches the input.                                                              |
| TC-B05 | Adding a pincode returns hospitals in that area.                        | A state `search` with a valid 6 digit `address.area_code` returns results geographically consistent with the pincode.                                                                 |
| TC-B06 | Searching near a location returns hospitals within the chosen distance. | A `search` with `location.gps`, `radius.type: CONSTANT`, `radius.value` and `radius.unit: km`, and no state, returns hospitals whose GPS coordinates fall within the declared radius. |

## C. The on\_search response

| ID     | What it checks                                           | Passes when                                                                                                                             |
| ------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| TC-C01 | The results reach your app.                              | After a valid `search`, the `on_search` payload arrives at your `consumer_uri` within your timeout window.                              |
| TC-C02 | Every hospital has an ID.                                | Each `catalog.providers[].id` is a non-null string, for example `HOSP27G13867`.                                                         |
| TC-C03 | Every hospital has its core details.                     | `id`, `descriptor.name`, `location.gps` and `contact.phone` are present on each provider, and none is null or empty.                    |
| TC-C04 | Every hospital has its empanelment date.                 | Each provider has a `fulfillments[]` entry with `type: Empaneled Date` whose `start.time.timestamp` is a non-null string.               |
| TC-C05 | Every hospital has its establishment date.               | Each provider has a `fulfillments[]` entry with `type: Establishment Date` whose `start.time.timestamp` is a non-null string.           |
| TC-C06 | Every hospital's location can be placed on a map.        | Each `location.gps` is a comma separated `lat,long` string that parses as two valid decimal numbers.                                    |
| TC-C07 | Every hospital has a PM-JAY nodal officer to call.       | `contact.tags.nodalOfficerNumber` is a non-null numeric string on each provider.                                                        |
| TC-C08 | Every hospital lists its specialities.                   | Each provider has at least one `categories[]` entry with both `descriptor.name` and `descriptor.code`, and the code is a valid integer. |
| TC-C09 | Every hospital says whether it is government or private. | `descriptor.code` on each provider is a non-null, single character string, for example `G` or `P`.                                      |

## D. User experience

Check these by walking through your app on a test device and inspecting the screens.

| ID     | What it checks                                     | Passes when                                                                                                                                            |
| ------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-D01 | A beneficiary finds the feature quickly.           | PM-JAY hospital search is reachable from the home screen in 3 taps or fewer.                                                                           |
| TC-D02 | The feature's name says what it does.              | The entry point label clearly communicates PM-JAY empanelment, for example "PMJAY Hospital Search" or "Find PMJAY Hospitals".                          |
| TC-D03 | The search screen shows where the data comes from. | UHI, PM-JAY and [ABDM](/docs/pr-109/docs/uhi/v1/getting-started/glossary#abdm) branding all appear in the footer of the search screen, unobtrusively.  |
| TC-D04 | Searching by the phone's location works.           | A search using the device GPS returns results geographically consistent with the device location.                                                      |
| TC-D05 | Typing in a location works.                        | A search with a manually entered state, district or pincode returns results matching the entered location.                                             |
| TC-D06 | An empty result is explained.                      | A valid search that yields no hospitals shows a message suggesting next steps, such as a wider radius or a nearby district. The screen is never blank. |
| TC-D07 | The results carry the disclaimer.                  | The results screen shows "Please confirm the hospital location by calling ahead, as details may change."                                               |
| TC-D08 | The feature sits with health features.             | PM-JAY hospital search appears under a health, hospital or insurance module, not under wellness, offers or lifestyle.                                  |

## E. Edge cases

| ID     | What it checks                                      | Passes when                                                                                                                                                                       |
| ------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E01 | A very long list still works.                       | A state only search for a high density state, such as Andhra Pradesh or Maharashtra, renders the full list without a crash or timeout. Scroll and filter work across all records. |
| TC-E02 | No matching hospitals is handled.                   | A state and district search that matches nothing returns an `on_search` with an empty `providers[]`. Your app shows a fallback message, with no crash and no unhandled state.     |
| TC-E03 | A missing response does not leave the user waiting. | When no `on_search` arrives, your app shows a timeout message after its configured window and lets the user retry. It never stays loading indefinitely.                           |

## Next steps

- [PM-JAY HEM Hospital Discovery](/docs/pr-109/docs/uhi/v1/services/pmjay-hem): the flow these test cases cover.
- [Errors on UHI](/docs/pr-109/docs/uhi/v1/concepts/errors): what to log when a test case fails.
- [Record a demo and request sign-off](/docs/pr-109/docs/uhi/v1/getting-started/going-live#2-record-a-demo-and-request-sign-off): the onboarding step that follows your test cases.
