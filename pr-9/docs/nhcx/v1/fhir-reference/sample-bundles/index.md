# Sample bundles

Twenty-two complete FHIR bundles exist. They are the only real payloads in the published material, and every chapter in this section is built on them. This chapter says where they are, what each one is, and what they do not cover.

## In short

- Twenty-two complete FHIR bundles are the only real payloads in the published material.
- Use the extracted files: nineteen of the markdown copies are truncated mid-token at four thousand characters.
- Eight exchange directions have no sample at all, concentrated in what an integrator reaches last.
- A second reference set in this repository is written to be sent rather than read, and all of it validates.

## Where they are

```
NHCX-site/doc/hmisdocuments/
  Sample FHIR bundles_extracted/FHIR_bundles_PMJAY_ext/
```

Use those extracted files. A second copy exists in the same folder, as a markdown document with the bundles in fenced blocks. Nineteen of the twenty-two are truncated there at exactly four thousand characters, stopping mid-token so they will not parse. The only reliable thing in that copy is a machine-generated inventory of entries per file.

## One transaction, end to end

All twenty-two come from a single sandbox run, which is what makes them useful. They are not twenty-two unrelated examples but one patient's journey, so the identifiers thread through the whole set and you can watch a number appear in a preauthorisation and come back in a payment.

| | |
| :---- | :---- |
| Patient | PMJAY ID `MD5SLS4X5` |
| Payer | SHA HP, registry ID `1518` |
| Policy | `PMJAY/HP/S/G` |
| Preauthorisation number | `VB26AA2600001` |
| Claim number | `EO26AA2700001` |
| Dates | 26 February to 3 March 2026 |

Every bundle is `type: collection` and parses cleanly. Free-text values in the payer's own fields, such as a disposition reading `approved by Sayantan`, confirm these are hand-run transactions captured as they happened rather than curated specification examples.

## The twenty-two

Sizes matter here. Six of these files are enormous, almost entirely because of base64 attachments and embedded clinical documents, and a naive read of one will fill your terminal or your context.

### Coverage eligibility

| File | Size | What it is |
| :---- | :---- | :---- |
| `coverageeligibility/coveragerequest_validation.txt` | 7 KB | Request, purpose `validation` |
| `coverageeligibility/coveragerequest_benefits.txt` | 7 KB | Request, purpose `benefits` |
| `coverageeligibility/coveragerequest_auth-requirement.txt` | 7 KB | Request, purpose `auth-requirements` |
| `coverageeligibility/coverageresponse_validation.txt` | 16 KB | Response, in force, with money |
| `coverageeligibility/coverageresponse_benefits.txt` | 16 KB | Response, package excluded |
| `coverageeligibility/coverageresponse_auth-requirement.txt` | 16 KB | Response, identical item to the one above |

The three requests differ only in the purpose and the timestamp. Two of the three responses are not actually differentiated: their response items are the same.

### Insurance plan

| File | Size | What it is |
| :---- | :---- | :---- |
| `insuranceplan/insuranceplan_request.txt` | 1 KB | A single Task |
| `insuranceplan/insuranceplan_response.txt` | 21 MB | One plan, one organisation, 2,215 questionnaires |

The response is the largest artefact in the set by three orders of magnitude. Extract the first entry and one or two questionnaires; do not open it whole.

### Preauthorisation

| File | Size | What it is |
| :---- | :---- | :---- |
| `preauth/preauth_request.txt` | 375 KB | The request, 31 entries |
| `preauth/preauthresponse_with_query.txt` | 7 KB | The payer's query |
| `preauth/Query/preauth_queryUpdate_req.txt` | 233 KB | The provider's answer, 96 entries |
| `preauth/Query/preauth_response_queryUpdate_App.txt` | 7 KB | Approval after the query |
| `preauth/enhancement/enhancement_req.txt` | 469 KB | Enhancement, 54 entries |
| `preauth/enhancement/enhancement_resp.txt` | 8 KB | Enhancement approved |
| `preauth/cancel/preauth_cancel_req.txt` | 3 KB | Cancellation request |
| `preauth/cancel/preauth_cancel_response.txt` | 7 KB | Cancellation response |

The query answer at 96 entries is the richest bundle in the set and the best single illustration of how much clinical evidence a real submission carries.

### Claim

| File | Size | What it is |
| :---- | :---- | :---- |
| `claim/claim_Request.txt` | 386 KB | The claim, 44 entries |
| `claim/claimresponse_withQuery.txt` | 7 KB | The payer's query |
| `claim/claim_queryUpdate_req.txt` | 376 KB | The provider's answer |
| `claim/claim_queryUpdate_response.txt` | 7 KB | Final adjudication with a deduction |

### Payment

| File | Size | What it is |
| :---- | :---- | :---- |
| `paymentNotice/payment_notice.txt` | 5 KB | Notice with the transaction reference |
| `paymentNotice/paymentNotice_ack.txt` | 3 KB | The provider's acknowledgement |

The payment reconciles exactly against the claim response, and that arithmetic is worth checking by hand once: the adjudicated amount equals the net paid plus the tax deducted.

## The reference set

Beside NHA's twenty-two there is a second set, written to be sent rather than read. Fourteen bundles under `apps/reference/provider` in this repository, one per exchange the provider side sends. Each carries a `bundle.log` from the HL7 validator against the NRCeS package, ndhm.in 6.5.0, and all pass.

```
apps/reference/provider/
  coverage/{discovery,validation,benefits,authrequirements}/bundle.json
  insurance/bundle.json
  preauth/{request,enhancement,queryupdate,cancel}/bundle.json
  claim/{request,queryupdate,release,reprocess}/bundle.json
  payment/notice-ack/bundle.json
```

They differ from NHA's samples on purpose. Every entry hangs off `https://nhcx.abdm.gov.in/<leg>/<flow>`, and there are no embedded clinical documents. Identifiers are the canonical NRCeS and HL7 systems, and the same Patient, Organization, Coverage and Practitioner shapes recur in every bundle. Since 6 September 2026 the Claim bundles carry the element ids and the `HPIN` identifier the SHA HP sandbox demands. Three applications in this repository, the provider, nanoemr and the IRDAI payer, are held to these files byte for byte by their test suites. A change to a reference file is a change to what every one of them sends. Coverage, plan and preauthorisation have been run against the live sandbox; the claim, task and payment bundles have passed the validator only.

## What has no sample

Eight exchange directions have nothing behind them, and the gaps are not random: they are concentrated in exactly the exchanges an integrator reaches last.

| Exchange | Status |
| :---- | :---- |
| Predetermination, both directions | No sample. The only bundle shape that mentions it leaves the claim use as an unfilled placeholder |
| Communication, both directions | No sample, though the PMJAY handbook specifies both field by field |
| Task, reprocess | No sample, and the archive carries an empty `reprocess` folder where one was scoped |
| Task, shortfall | No sample. The word appears once in the entire published material |
| Task, status and search | No sample |

There is a common cause. The sandbox request collection appears to carry payloads for predetermination, communication, status and search, but all eight of those entries share one identical block of ciphertext. It is filler. Nothing was ever captured for them.

The chapters covering these exchanges are written from the specification and say so.

## Also missing, inside exchanges that are covered

Two decisions have no sample even though their exchange does. There is no rejected preauthorisation and no rejected claim anywhere in the set, although the handbook documents rejected and partially approved responses in detail. Every response sample shows an approval. Anyone building the failure path is building it from prose.

## Two patterns that survive only as fragments

Cyclic treatment and the newborn case appear nowhere in the twenty-two. Both exist only as broken JSON inside a frequently-asked-questions document, with unbalanced braces, a missing quotation mark, a masked identifier and code comments inside the JSON. They are reconstructed in the Claim Request chapter and labelled as reconstructions. Do not copy them from the source.

## How to read one

Never print one of the large files. Load it and look at the shape first.

```python

b = json.load(open("preauth/preauth_request.txt"))
print(b["type"], len(b["entry"]))
for e in b["entry"]:
    print(e["resource"]["resourceType"])
```

Then take the resource you care about. The bulk in every large file is base64 sitting in attachments, so a bundle stripped of `attachment.data` is usually a few kilobytes and is far easier to read.

Diff two samples of the same exchange rather than reading either in isolation. The difference between the preauthorisation request and the enhancement request is a second item, and reading them side by side makes that obvious in a way that reading one of them does not.
