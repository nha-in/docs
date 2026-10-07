# Bharat Health Terminology Service

The Bharat Health Terminology Service, BHTS, is the national terminology service NRCeS runs at C-DAC Pune for the Ministry of Health and Family Welfare. It lets your system look up, validate, expand and translate codes over FHIR R4. Read [About BHTS](https://www.nrces.in/bhts/resources/documentation/).

## In short

- One FHIR R4 terminology server for SNOMED CT with the India extensions, LOINC, ICD-10 and the ABDM code systems.
- The APIs are public, need no key, and are rate limited.
- Use it to build, test and validate. Production or high-volume use needs NRCeS's authorization or a local instance.

## What it holds

BHTS serves these code systems:

- SNOMED CT, with the India national extensions
- LOINC
- ICD-10 and ICD-10-CM
- The ABDM FHIR code systems and value sets

It is also the national repository for the code sets NRCeS maintains:

- Common Drug Codes for India
- The India AYUSH terminology for Ayurveda, Siddha and Unani
- Patient instructions in several Indian languages
- Common Lab Codes for India
- Geographical location codes, harmonised with Local Government Directory codes

## The five components

| Component          | Use it for                                                          | Link                                                     |
| ------------------ | ------------------------------------------------------------------- | -------------------------------------------------------- |
| Terminology Server | FHIR R4 code systems, value sets and concept maps, from your system | [termserv](https://www.nrces.in/bhts/termserv/)          |
| CSNOServ           | SNOMED CT search, lookup, validation and mapping over REST          | [csnoserv](https://www.nrces.in/bhts/api/v1/csnoserv/)   |
| LOINCServ          | LOINC search, lookup and panels over REST                           | [loincserv](https://www.nrces.in/bhts/api/v1/loincserv/) |
| CSNOFinder         | Browsing SNOMED CT and the India extensions, with ECL queries       | [browser](https://www.nrces.in/bhts/browser/)            |
| Aarogyawali        | Searching medical terms in Indian languages                         | [aarogyawali](https://www.nrces.in/bhts/aarogyawali/)    |

## Call the terminology server

The base URL is `https://www.nrces.in/bhts/api/v1/ts/fhir`. Read the [Terminology Server Overview](https://www.nrces.in/bhts/resources/documentation/terminology-service-about-terminology-server) for every API.

| Operation        | What it answers                                                                             | Path                                                     |
| ---------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `$lookup`        | The display, properties and status of one code                                              | `/CodeSystem/$lookup`                                    |
| `$validate-code` | Whether a code is valid in a code system or value set                                       | `/CodeSystem/$validate-code`, `/ValueSet/$validate-code` |
| `$subsumes`      | Whether one code is a kind of another                                                       | `/CodeSystem/$subsumes`                                  |
| `$expand`        | Every code in a value set                                                                   | `/ValueSet/$expand`                                      |
| `$translate`     | The matching code in another system, such as SNOMED CT to ICD-10                            | `/ConceptMap/$translate`                                 |
| Read             | A SNOMED CT clinical drug as a FHIR `Medication`, with ingredients, strengths and dose form | `/Medication/{id}`                                       |

Look up the SNOMED CT code for a prescription record:

```bash
curl 'https://www.nrces.in/bhts/api/v1/ts/fhir/CodeSystem/$lookup?system=http://snomed.info/sct&code=440545006'
```

The answer is a FHIR `Parameters` resource. Its `display` is `Prescription record`, and its `version` names the SNOMED CT release it came from.

## Limits on use

The [BHTS Terms of Service](https://www.nrces.in/bhts/terms-of-service/) set these limits.

| Use                                                        | Allowed                                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Lookup and validation while you build, test and evaluate   | Yes, within the rate limits                                                                 |
| Continuous, large-scale or production use through the APIs | Only with NRCeS's prior authorization. Ask NRCeS for a local setup or a dedicated instance. |
| Use from outside India                                     | May be restricted or blocked without notice                                                 |
| SNOMED CT content in your own system                       | Still needs your SNOMED CT Affiliate Licence                                                |

Verify any code, relationship or mapping before you put it in a production or clinical system.

## How you know it worked

A `$lookup` returns `Parameters` with the code's `display`. A `$validate-code` returns `result` as `true` for a valid code.

## When it goes wrong

- **Requests are throttled or refused.** You are over the rate limit. Cache what you look up, and ask NRCeS for a local instance if you need volume.
- **A code is reported as not found.** Check that the `system` URI matches the code system exactly, such as `http://snomed.info/sct`.
- **A term, translation or mapping is wrong or missing.** Report it to NRCeS.
- **Anything else.** Read the [BHTS FAQs](https://www.nrces.in/bhts/resources/faqs/).

## Next steps

- [SNOMED CT](/docs/main/docs/hiecm/v3/resources/standards/snomed-ct): the licence BHTS's SNOMED CT content still needs.
- [LOINC](/docs/main/docs/hiecm/v3/resources/standards/loinc): Common Lab Codes for India, which BHTS also serves.
- [Standards and terminologies](/docs/main/docs/hiecm/v3/resources/standards): every code system in one table.
