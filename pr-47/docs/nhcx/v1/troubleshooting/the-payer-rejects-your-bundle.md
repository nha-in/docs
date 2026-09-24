# The payer rejects your FHIR bundle

The payer opened your message and could not accept the Fast Healthcare Interoperability Resources (FHIR) bundle inside it. The answer names the fault with a code.

| Code        | What it means                                      |
| ----------- | -------------------------------------------------- |
| `PAYR-1004` | The bundle is malformed, followed by error details |
| `PAYR-1008` | The bundle is invalid or cannot be parsed          |
| `PAYR-1009` | No identifier for the patient                      |
| `PAYR-1013` | No identifier for the provider organisation        |

## In short

- Read the message with the code. `PAYR-1004` has two meanings.
- Run the [NRCeS](/docs/pr-47/docs/nhcx/v1/getting-started/glossary#organisations-and-programmes) validator on the exact bundle you sealed, and fix what it reports first.
- Every resource declares its NRCeS profile. The patient, both organisations and the claim each carry an identifier with a type.
- Attachments are Base64, named, and of an allowed content type.

## Prerequisites

- You have the full answer, including the message and any details after the code.
- You can run the NRCeS validator on the exact bundle you sealed.

## Work through these in order

Read the message with the code first. `PAYR-1004` also means "Provider is not registered with the payer for requested policy" on the standard payer sheet. The message text tells you which fault you have, and [Error Codes](/docs/pr-47/docs/nhcx/v1/reference/error-code-guide) explains the two sheets.

1. **Does the bundle pass the NRCeS validator?** Run it on the exact bundle you sealed, and fix what it reports first.
2. **Is the bundle shaped right?** It is a `Bundle` of type `collection`. Every resource declares its NRCeS profile in `meta.profile`. Resources reference each other as `urn:uuid:` identifiers, not relative paths.
3. **Does every resource carry its identifier and type?** The patient, both organisations and the claim each need an identifier with a type.
4. **Is your hospital identified correctly?** Send the [HFR](/docs/pr-47/docs/nhcx/v1/getting-started/glossary#identity-and-registration) ID as an identifier typed `NPI` in the provider `Organization`. It must match the registry ID recorded for you as sender.
5. **Are the attachments valid?** Each has Base64 data and a name that is not empty. Its content type is one of `application/pdf`, `application/jpg`, `application/jpeg`, `application/png` or `application/fhir+json`.
6. **Are the values clean?** Trim leading and trailing spaces. Codes are case sensitive and must match the expected values exactly.

## What you see when it works

The validator passes the bundle. The payer's answer is an adjudication, a claim response or an eligibility response with an outcome, not a bundle error.

## When it goes wrong

If the validator passes and the payer still refuses the bundle, send the bundle to `hcx.integration@nha.gov.in` for review by the NRCeS team. Include the payer's full error message, and replace personal data with test values first.

## Next steps

- [Bundles and Conventions](/docs/pr-47/docs/nhcx/v1/reference/fhir): the rules every bundle follows.
- [Codes and Value Sets](/docs/pr-47/docs/nhcx/v1/reference/fhir/codes-and-value-sets): the exact codes each element takes.
- [Troubleshooting](/docs/pr-47/docs/nhcx/v1/reference/troubleshooting): every bundle code, in the layer 4 rows.
