# DICOM

DICOM, Digital Imaging and Communications in Medicine, is the standard for medical images and the data that travels with them. A CT scan, an X-ray or an MRI is stored and exchanged as DICOM. It is managed by the Medical Imaging and Technology Alliance, a division of NEMA. Read [DICOM at NRCeS](https://www.nrces.in/standards/dicom).

## In short

- DICOM is the standard for medical images and their data.
- Every record system that holds imaging needs it.
- An imaging report references a DICOM study through an `ImagingStudy` resource.

## Who needs it

Every health record system that holds imaging as part of the patient record needs DICOM. The [EHR Standards for India](https://www.nrces.in/standards/ehr-standards-for-india) notify DICOM PS3.0-2015, using DIMSE services and Part 10 files.

## Where a record uses it

The [ABDM FHIR implementation guide](https://nrces.in/ndhm/fhir/r4/index.html) has an `ImagingStudy` profile for a DICOM study. The study is referenced from an imaging diagnostic report.

The guide's [imaging report example](https://nrces.in/ndhm/fhir/r4/Bundle-DiagnosticReport-Imaging-DCM-example-01.html) shows the shape. Its SOP class is a DICOM UID, written as `urn:oid:1.2.840.10008.5.1.4.1.1.2`.

## The licence

The DICOM standard documents are free of charge, from the [DICOM standard site](http://dicom.nema.org/standard.html).

## Tools

The C-DAC DICOM SDK, version 3.5 for PS3.0-2015, is listed on [DICOM at NRCeS](https://www.nrces.in/standards/dicom).

## How you know it worked

- Your imaging system stores and sends studies as DICOM Part 10 files.
- Your imaging report bundle validates against the ABDM FHIR implementation guide, with its `ImagingStudy` resource present.

## When it goes wrong

- **Anything else.** Read the [DICOM questions in the NRCeS FAQ](https://www.nrces.in/faqs#dicom).

## Next steps

- [FHIR](/docs/pr-122/docs/hiecm/v3/resources/standards/fhir): the imaging report profile.
- [LOINC](/docs/pr-122/docs/hiecm/v3/resources/standards/loinc): the codes imaging reports carry.
- [Standards and terminologies](/docs/pr-122/docs/hiecm/v3/resources/standards): every code system in one table.
