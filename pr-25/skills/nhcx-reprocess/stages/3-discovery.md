# Stage 3: discovery

Purpose: find the surface you will build on. In `integrate` mode that is the HMIS; in `standalone` mode it is the runtime, the storage and the deployment target the user has chosen. Every answer names the file, table or endpoint that proves it. An answer without proof is a gap.

`3-discovery.md` is shared by the seven skills: one row per concern, each naming the skill that answered it. This skill answers the rows its `SKILL.md` lists under "Host facts", and the framework and runtime rows if no skill has. A row an earlier skill answered with proof is reused; check it again only if the code changed since.

Stage 0 looked for NHCX capabilities. This stage looks at the host: where patients, admissions, doctors, documents and bills live.

## Inputs

- `nhcx-build/1-idea.md`, `nhcx-build/2-planning.md`, this skill's section of `nhcx-build/0-capability.md`
- This skill's `SKILL.md`, "Host facts"
- The target codebase (integrate) or the chosen runtime (standalone)
- `stages/7-write-code/7.2-storage.md` (the claim tables) and `stages/7-write-code/7.13-standalone-shell.md` (patient, encounter, practitioner, document), as the shape to compare against

## Do

Answer in writing every question below that this skill's host facts name, plus the framework and runtime questions when they are not yet answered. Reading only; change nothing.

### Framework and runtime

| Question | Why it matters |
| --- | --- |
| Language, web framework, ORM, database engine, migration tool | Where a new table goes and how it is created |
| How configuration is read (env, file, database) | Where the transport's settings live: the participant code, and the client id and secret and the private key (`own`), or the adapter URL and key (`adapter`) |
| How the app exposes an HTTP endpoint an outside process can POST to; which auth middleware must be exempted | The callback door, module 7.3 |
| Background worker or scheduler, or none | Whether polls run on the request path or in a worker |
| How the app serves a page and what the screen conventions are | Module 7.12 must match them |
| How tests are run and where they live | Stage 9 must match them |

### Patients

| Question | Why it matters |
| --- | --- |
| The patient table, its primary key, the unique identifier (MRN) | `claim.patient_id` |
| Where name, gender, date of birth, phone, ABHA number live | The Patient resource in every bundle |
| Where a scheme member id (PMJAY id) and a policy code can be stored, per patient or per visit | The Coverage resource; the policy search result |

### Admissions and encounters

| Question | Why it matters |
| --- | --- |
| The inpatient encounter table: admission time, discharge time, ward or bed, admitting doctor, status | `billablePeriod`, `ONS/ADDD`, the care team |
| How discharge is recorded, and whether it can carry a mode (normal, LAMA, DAMA, death) and a stage (before, during, after surgery) | `DIS` and `DSDE` on the claim; the LM100 collapse |
| Diagnoses: SNOMED, ICD-10 or free text | The payer needs ICD-10 with a display |
| Procedures or surgeries, and whether a surgery time is recorded | `ONS/PSP` |

### Billing

| Question | Why it matters |
| --- | --- |
| Billing lines: code, quantity, unit price, net; which charge master | Lines are quoted from the payer's plan, not the HMIS master, but the two must be reconcilable |
| Whether a line can be tagged with a payer package code and a category | `claim_line` |
| Invoices and receipts: where a settlement amount and a UTR go | Payment notices, module 7.10 |

### Documents

| Question | Why it matters |
| --- | --- |
| Where PDFs and images live (blob column, filesystem, object store) | `valueAttachment` needs the bytes and the content type |
| Whether a file can be tagged with a payer document code and a stage (pre-auth or claim) | The plan's requirement codes; never `ODN` for a file that was asked for by name |
| Accepted content types | The scheme takes pdf, jpg, jpeg, png only (PAYR-1008) |

### Doctors

| Question | Why it matters |
| --- | --- |
| The practitioner table; an HPR id (HPIN); a licence number; a qualification string | PMJAY refuses a pre-auth without an HPIN typed identifier (PAYR-1083) |

### Facility

| Question | Why it matters |
| --- | --- |
| The facility's HFR id, name, phone; its NHCX participant code | The provider Organization; the sender code |

### Standalone mode

The same questions, answered for the runtime the user chose. Where the answer is "nothing exists yet", write what module 7.13 will create: `patient`, `encounter`, `practitioner`, `document`, `settings`. A standalone app still has to hold every fact the questions ask for; it simply has to capture it itself.

## Write

`nhcx-build/3-discovery.md` from `templates/3-discovery.md`: one table, concern by concern, columns `Concern | Where it lives (proof) | Gap | Answered by`. A gap is what stage 4 fills. Add rows; do not rewrite another skill's rows.

## Gate

- [ ] Every host fact this skill's `SKILL.md` names has a row, and so does every framework and runtime question.
- [ ] Every row that is not a gap names a file path, a table, or an endpoint.
- [ ] When this skill builds or extends the callback door, the callback route is answered: which URL, which middleware to exempt, or "no inbound route, poll only".
- [ ] When this skill's bundles carry a Practitioner, the HPIN question is answered; if the practitioner table has no HPR id, the gap says so.
- [ ] When this skill attaches documents, the document store is answered with content-type handling.

## Common mistakes

- Answering from the framework's documentation instead of the codebase. The proof column is the codebase.
- Skipping the discharge-mode question. A death claim without `DTM` is refused (PAYR-1096); the HMIS must be able to say the patient died and when.
- Treating "no background worker" as a blocker. Without one, polls run on the request path; it is a design input, not a stop.
- Answering every concern for every skill. Answer the ones this skill needs; the next skill adds its own.
