# UHI source precedence, 28 September 2026

The UHI set under `catalogue/uhi/openapi/.raw/nha-2026-09-28-uhi/` holds two
kinds of source.

- **The authorities.** These are the developer guide as of 22 September 2026, `UHI Documentation Requirements.md`, and the Gateway spec v2.0.2 in its two shapes.
- **The onboarding documents** of 3 August 2026, under `onboarding/`.

Where they disagree, the authority wins, and the portal uses the value in the last column. An onboarding document is used only where the authorities are silent.

Each row was checked against the redacted files on 28 September 2026. A section number is the onboarding document's own.

| Service | Fact | Onboarding says | Guide or spec says | Portal uses |
|---|---|---|---|---|
| Physical Consultation | PIN override status | `HSPA_OVERRIDE`, and a `NOT_VERIFIED` value (Physical Consultation v2.0) | `HSPAOVERRIDE` (guide, settled points; spec examples) | `HSPAOVERRIDE`. `NOT_VERIFIED` is left for NHA to confirm |
| Physical Consultation | Where `order.id` comes from | "from on_init or on_confirm" (7.6) | on_init (guide 2.1) | on_init |
| Physical Consultation | Who sets CANCELLED | "HSPA or EUA (on_update)" (7.3.2) | The EUA sets only DOCTOR_NO_SHOW; cancellation goes through cancel and on_cancel (guide 2.1) | The guide |
| Physical Consultation | Slot hold | "typically", "e.g. 15 minutes" (7.2.1) | 15 minutes (guide 2.1) | 15 minutes |
| Physical Consultation | select and on_select | Not mentioned | In the spec; the guide says not to implement them | Not implemented |
| Physical Consultation | Unpaid status | Enum `NOT-PAID`, samples `NOT_PAID` (7.6) | `NOT_PAID` (spec) | `NOT_PAID` |
| Physical Consultation | Audit path | `on_update_audi` (7.5.3), a typo | `on_update_audit` (spec) | `on_update_audit` |
| PM-JAY HEM | Spec version | Swagger v2.0.1 (11) | v2.0.2 | v2.0.2 |
| PM-JAY HEM | GPS search | Paired with a state (7.6, TC-B06) | No state needed (guide, settled points; spec example) | No state. TC-B06 is reworded to match |
| PM-JAY HEM | Numeric field types | Integers (6.5) | The guide's open point says the onboarding document uses strings | Integers, as the spec examples send. The guide's open point misreads the onboarding document |
| PM-JAY HEM | provider `short_desc` | "State-level empanelment context" (6.6) | Spec tag: ownership; spec example: "State." | Left for NHA to confirm |
| Blood Bank | State and district codes | DELHI and SOUTH with 83 in the search sample (7.3) | Maharashtra 311, Pune 022 in the search (guide, settled points; spec). The spec's on_search examples return Pune as 521, as the onboarding response sample (7.4) does | Search with the spec's codes; show what on_search returns |
| Blood Bank | HSPA path | `.../api/v1/bloodbank` (7.4) | `.../api/v1/hspa/bloodbank` (spec) | The spec's path |
| Blood Bank | Whole blood component name | `WholeBlood` | `Whole Blood` (spec search examples) | `Whole Blood` |
| Ambulance | PTA and MVA categories | "IGNORE ANY RESPONSE FOR PTA, NOT IN SCOPE" (7.3) | Render any category code (guide 2.4) | Render any code, noting PTA is out of Phase 1 scope |
| Ambulance | Terms in on_init | Three in the sample and in AMB-D-04 | Five (guide, settled points; spec) | Five. AMB-D-04 checks five |
| Ambulance | Pickup and drop for EMERGENCY | "SOURCE only" (6.4) | DESTINATION optional (guide 2.4; spec second search example) | DESTINATION optional |
| Ambulance | Signing section | Copied from the Jan Aushadhi document; names the PMBI HSPA (6.2) | Not applicable | Not used |
| Jan Aushadhi | HSPA id | `Janaushadhi-hspa` in the v0.3 drafts | `pmbi.hspa` (guide, settled points; spec) | `pmbi.hspa` |
| Jan Aushadhi | Kendra code value | The literal "Jan Aushadhi Kendra Code" (v0.3) | The code itself, for example PMBJK02129 (guide; spec) | The code |
| Jan Aushadhi | Gateway base URL | Ends in `/api/v1/uhi/search`, then "Append /search" (v1.0) | Gateway host, with `/api/v1/uhi/search` as the endpoint (guide 1.2) | The guide |
| All | Separate `Digest` header | Not sent; `digest` is signed inside Authorization | The guide sends `Digest: BLAKE-512=`; the spec declares only Authorization | Generated samples follow the spec. The guide's header is left for NHA to confirm |
| AMRIT Pharmacy | The whole service | Domain `nic2025:477201`, HSPA `amrit-hspa`, discovery only | Absent from the guide and the spec | Not published until NHA confirms it is live |
