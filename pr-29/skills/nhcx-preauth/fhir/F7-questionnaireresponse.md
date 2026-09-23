# F7. QuestionnaireResponse

#### F7R. RESOURCE
`QuestionnaireResponse`, profile `https://nrces.in/ndhm/fhir/r4/StructureDefinition/QuestionnaireResponse`. Direction: sent, as entries of the pre-authorisation and claim bundles (F8).

#### F7D. DESCRIPTION
One QuestionnaireResponse per payer form (F6) answered for the leg being sent. The Claim points at each from a `supportingInfo` element (F8), and that is how the payer finds the answers.

Rules:
- Sent on the pre-authorisation (request, enhancement, query answer) and claim (request, query answer) bundles. **Not** on a predetermination.
- Which forms: those the leg requires (see F6 for the rule), in the order they are listed (the ruling's or package's forms by title, then the policy-wide forms). Only answers saved for that leg are used (D17 `claim_form_answer.stage`, where a row with no stage counts as `preauth`).
- A question with no answer is left out. A form with no answered question is left out entirely: a blank response is a different statement to the payer than no response.
- Entries are numbered from 1 in the order written: `fullUrl` `https://nhcx.abdm.gov.in/questionnaireresponse/<n>`, `id` `"<n>"`.
- `questionnaire` is the payer's own form url (F6 `url`). The Questionnaire itself is not sent.
- The answer's value type follows the question's `type` in the stored form:

| Question `type` | Answer sent | From the stored answer |
|---|---|---|
| `attachment` | `valueAttachment {contentType, title, data}` | the answer holds a D28 `claim_document.id`; its `content_type`, `label` (else `filename`) and base64 of `data`. If no such document, `valueString` of the stored text |
| `dateTime`, `date`, `instant` | `valueDateTime` | the stored value as an instant with `+05:30`, else as stored |
| `time` | `valueTime` | as stored |
| `boolean` | `valueBoolean` | true for `yes`, `true` or `1` (any case) |
| `integer` | `valueInteger` | a whole number, else `valueString` |
| `decimal`, `quantity` | `valueDecimal` | a number, else `valueString` |
| anything else (`choice`, `string`, `text`, ...) | `valueString` | as stored (for a choice, the option label) |

- A file given as the answer to an attachment question rides only inside the QuestionnaireResponse. It is not repeated as a document on the Claim's `supportingInfo`.

The Claim's pointer (F8 `supportingInfo`), one per QuestionnaireResponse, after all other supporting information:

| Form kind (F6) | `category` (`ndhm-supportinginfo-category`) | `code` (`ndhm-supportinginfo-code`) |
|---|---|---|
| `stgquestionnaire` | `STG` "Standard Treatment Guidelines" | `STG` "Standard Treatment Guidelines" |
| any other | `INF` "Information" | `ODN` "Other document" |

with `valueReference {reference: <the QuestionnaireResponse fullUrl>, display: <form title, else "Questionnaire">}`.

#### F7F. FIELDS

| Element | Value or source | Card / notes |
|---|---|---|
| `resourceType` | `QuestionnaireResponse` | |
| `id` | `"<n>"`, the entry's serial in the bundle | 1..1 |
| `meta.profile[0]` | `https://nrces.in/ndhm/fhir/r4/StructureDefinition/QuestionnaireResponse` | |
| `questionnaire` | D12 `claim_plan_form.url` | 1..1 |
| `status` | `completed` | |
| `subject.reference` | `https://nhcx.abdm.gov.in/patient` (F15) | |
| `authored` | the Claim's `created` (now, `+05:30`) | |
| `item[]` | one per answered question, in the form's question order (D12 `items`) | 1..* |
| `item[].linkId` | D17 `claim_form_answer.link_id` (= D12 `items[].linkId`) | |
| `item[].answer[0]` | value from D17 `claim_form_answer.answer`, typed as in the table above | exactly one answer |
| `item[].text` | D12 `items[].text` (the question, prefix first) | left out when empty |

Pointer on the Claim (F8):

| Element | Value | Notes |
|---|---|---|
| `supportingInfo[].category` | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-category` `INF` "Information" or `STG` "Standard Treatment Guidelines" | |
| `supportingInfo[].code` | `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code` `ODN` "Other document" or `STG` "Standard Treatment Guidelines" | |
| `supportingInfo[].valueReference.reference` | `https://nhcx.abdm.gov.in/questionnaireresponse/<n>` | |
| `supportingInfo[].valueReference.display` | D12 `claim_plan_form.title`, else `Questionnaire` | |

#### F7U. USED BY
- APIs: [A4. Pre-auth Submit](../apis/A4-preauth-submit.md)
- FHIR: [F6. Questionnaire](F6-questionnaire.md), [F8. Claim](F8-claim.md)
