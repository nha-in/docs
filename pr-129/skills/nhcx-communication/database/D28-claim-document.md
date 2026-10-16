# D28. claim_document

#### D28T. TABLE
One row is one supporting file (PDF or image) attached to a claim for one leg, stored inline with the payer requirement it answers. Primary key `id`. Parent table: `claim` (D9).

#### D28D. DESCRIPTION
**Created.** Every path goes through one insert that checks the file:

- The claim must exist.
- The content type (lower-cased, parameters dropped) must be `application/pdf`, `image/jpeg`, `image/png` or `image/webp`.
- The file must not be empty and must be at most 10 MB (10 * 1024 * 1024 bytes) [REF](../references/PAYERS.md#markers).
- `filename` defaults to `document`; blank `label`, `code` and `category` are stored as null; `stage` defaults to `preauth`; `size` is the byte count; `uploaded_at` is now; `source` is `upload` for a chosen file and `record` for a health record picked from the HMIS, with `record_ref` naming it.

**From the HMIS's health records, not only from a file.** An HMIS with an ABDM module ([SCAFFOLDING.md](../references/SCAFFOLDING.md) section 4a) already holds, or can build, the patient's health records as ABDM M2 document bundles: the discharge summary, diagnostic reports, prescriptions, OP consultation notes, the invoice (the eight `hiType`s, read with the `abdm-m2` prompt and the atoms named in [KNOWLEDGE.md](../references/KNOWLEDGE.md)). Every place a file is chosen (S9, S10, S11 and a form's file question, D17) also offers "From records": the picker lists the linked admission's records first, then the patient's other encounters', then the patient-level ones (invoices, files on the patient), each with its `hiType`, title, date and author, and the desk ticks the ones to attach. The list is read from the HMIS's own record tables, whether or not the module has staged or linked the record to ABDM yet: at least OPConsultation (an outpatient visit), Prescription, DiagnosticReport, DischargeSummary, HealthDocumentRecord (a file on the admission or the patient) and Invoice (the billing module's invoice). Where the module has no bundle builder for a type, the application builds that type's bundle itself with the module's helpers (the NRCES profile's Composition around the record and its files; see the `abdm-m2` atoms), so every listed record can go as structured data. What is stored is the record's **M2 document bundle itself**, as JSON (`content_type` `application/fhir+json`): a picked record is the payer's structured data, not a scan, and it rides in the claim bundle as a `DocumentReference` entry that the supportingInfo row points at (F8, F19). This is how the live PMJAY provider sends the hospital's own records and PMJAY adjudicates them [PAYER](../references/PAYERS.md#markers). Only for a payer whose adapter does not take records as FHIR ([PAYERS.md](../references/PAYERS.md) "Health records as FHIR") is the record's own attachment stored instead (a `DocumentReference` or `Binary` with a PDF or image inside the bundle, as a discharge summary or a scanned report has), else the HMIS's own rendering of the record to PDF (its print or report facility for that record); a record with neither is listed but not attachable. The row is a full D28 row (the bytes are copied, so a later edit of the record does not change what the payer saw), `source = 'record'`, `record_ref` = `<hiType>:<the module's record or care-context id>`, `filename` the record's title, `label` the requirement's display or the record's title, and `code` the requirement's code when attached against one, else the default below. Default `code` by `hiType` [REF](../references/PAYERS.md#markers): DischargeSummary `HDS`, DiagnosticReport `DIA` (`RAD` when the report's category is imaging), Prescription `PRE`, Invoice `MB`, OPConsultation `CD`, ImmunizationRecord `CER`, HealthDocumentRecord and WellnessRecord `ODN`. A record attached twice to one leg is refused ("<title> is already attached to this leg.").

The paths that create rows:

| Path | Screen | code | category | stage | Replaces |
|---|---|---|---|---|---|
| Pick health records from the HMIS ("From records") | S9, S10, S11 | the requirement's code when picked against one, else the hiType default above | `INV` against a requirement, else null | the leg's | against a requirement, every other row with the same `code` |
| Attach any files under a chosen code | S9 (or S11 with `stage` `claim`) | the code chosen (the payer's, or one of the common codes below) | null | `preauth` or `claim` | nothing |
| Attach against a payer requirement | S9 | the requirement's code | `INV` | `preauth` | every other row on the claim with the same `code` |
| Attach claim-stage requirements | S11 | the requirement's code | `INV` | `claim` | every other row on the claim with the same `code` |
| Discharge summary | S11 | `HDS` | `HDS` | `claim` | every other `HDS` row on the claim |
| File answer to a form question | S9, S11 | null | null | the form's leg | nothing (D17 holds the id) |
| New file on a query reply | S10 | the requirement's or chosen code | null | the queried leg (D23 `stage`) | nothing |

A requirement must be one the payer named for that leg, from the auth-requirements ruling (D15) when there is one, else the package master (D11). The replace step deletes by `claim_id` and `code` only, whatever the stage.

Common codes offered on every upload: `CD` Clinical document (the default), `HDS` Hospital discharge summary, `DIA` Diagnostic and laboratory reports, `RAD` Radiology / scan reports, `PRE` Doctor's prescription notes, `CER` Medical certificate / referral, `EST` Cost estimate, `MB` Medical and pharmacy bills, `INV` Final hospital invoice, `OTR` Operation theatre notes, `ICU` ICU chart, `IMP` Implant invoice and sticker, `POI` Proof of identity, `KYC` KYC / bank proof, `FCF` Filled claim form, `PAU` Pre-authorisation approval letter, `ODN` Other document [PAYER](../references/PAYERS.md#markers).

**Read.**

- A leg's bundle (pre-authorisation, enhancement, query answer, predetermination on `preauth`; claim on `claim`) carries the rows of its own `stage`, except rows used as a form's file answer (those ride inside the QuestionnaireResponse). Each goes with its `code` (else `ODN`), its `category` (else `INV`) [REF](../references/PAYERS.md#markers), its `label` (else `filename`), content type and base64 data.
- On the claim, the discharge summary is the claim-stage row whose code the payer named as a discharge summary, else the newest `HDS` row. It is sent under the `HDS` category and left out of the ordinary attachments.
- Without a ruling, a document required for the claim is no longer asked for when a `preauth` row already carries its code.
- A query reply (D23) and a reprocess request (D29) may attach any rows of the claim, by id.
- Viewing a row serves `data` inline under `content_type`.

**Deleted.** "Remove" on S9 or S11 (the claim-stage documents card) deletes one row and returns to S9. Rows are also replaced as in the table above, removed by cascade with the claim, or cleared with the transactional store. A D17 answer or D23 / D29 id list that pointed at a deleted row is left as it is. There is no status column.

#### D28C. COLUMNS
| Column | Type | Null / default | Meaning |
|---|---|---|---|
| id | INTEGER | primary key | Row id |
| claim_id | INTEGER | NOT NULL | The claim (D9) |
| filename | TEXT | NOT NULL | Uploaded file name (default `document`) |
| content_type | TEXT | NOT NULL | `application/pdf`, `image/jpeg`, `image/png`, `image/webp` |
| label | TEXT | null | Title shown and sent; a requirement's display, a form question's text, `Hospital discharge summary`, or what was typed |
| code | TEXT | null | Payer requirement code it answers (for example `MAND0671` [PAYER](../references/PAYERS.md#markers)), a common code, or `HDS`. Migration also adds it |
| category | TEXT | null | Supporting-info category: `INV`, `HDS`, or null (sent as `INV`). Migration also adds it |
| stage | TEXT | NOT NULL, default `preauth` | Leg it was attached for: `preauth` or `claim`. Migration also adds it |
| size | INTEGER | NOT NULL, default 0 | Size in bytes |
| data | BLOB | NOT NULL | The file |
| uploaded_at | TEXT | NOT NULL | When it was attached |
| source | TEXT | NOT NULL, default `upload` | `upload` (a chosen file) or `record` (a health record of the HMIS, through its ABDM module). Added by migration |
| record_ref | TEXT | null | `<hiType>:<record or care-context id>` of the module's record the bytes were taken from; null for an upload. Added by migration |

A `source = record` row whose `content_type` is `application/fhir+json` holds the record's bundle; its `filename` ends `.json`. The screens show it as "From records · <hiType>" and open it in the HMIS's record viewer, never as a file download (S9).

#### D28K. KEYS AND INDEXES
- Primary key `id` (integer).
- Foreign key `claim_id` references `claim (id)` (D9), `ON DELETE CASCADE`.
- Index `ix_claim_doc` on `(claim_id, id)`.
- Referenced without a foreign key by D17 (`answer` of a file question), D23 (`reply_documents`) and D29 (`document_ids`).

#### D28U. USED BY
- Screens: [S10. Communication](../screens/S10-communication.md)
- APIs: [A7. Communication Reply](../apis/A7-communication-on-request.md), [A17. Claim State](../apis/A17-claim-state.md)
- FHIR: [F8. Claim](../fhir/F8-claim.md), [F10. Task (claim actions)](../fhir/F10-task-claim-actions.md), [F12. Communication](../fhir/F12-communication.md)
- Database: [D9. claim](D9-claim.md), [D15. claim_auth_requirement](D15-claim-auth-requirement.md), [D23. claim_query](D23-claim-query.md)
