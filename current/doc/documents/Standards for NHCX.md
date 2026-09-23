# Standards for NHCX

*Source: `documents/Standards for NHCX.pdf` — extracted full text*

**Pages: 41**


---

## Page 1

Click to edit Master title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
Standards for National Health Claim Exchange (NHCX)
National Resource Centre for EHR Standards (NRCeS)
C-DAC Pune

---

## Page 2

CAlgicekn dtoa edit Master title style
• • C Ba li c c k k g t r o o u e n d d it o M n a In s t t e e r r o t p e e x r t a b st il y it le y s Standards implementation in ABDM
• About FHIR Standard
– Second level
• FHIR Interoperability Paradigm
• Third level
• Adoption of FHIR in ABDM
– Fourth level
• Adoption o»f FFHiftIhR l efvoerl NHCX
• Key Use cases
- Profiling Requirements for NHCX
- NHCX Standardization Approach
- FHIR Resource Under Consideration for NHCX
- Design Approach for NHCX
- NHCX Profiles
- Understanding the Structure of the Claim Bundle

---

## Page 3

CBlaicckk gtroo eudnidt M- Haesateltrh t iItnlefo srtmylaetion sharing over ABDM
• ABDM Implementation is based on the guidelines laid in the National Digital Health Blueprint
• Click to edit Master text styles
(NDHB)
• C–onSteencto&nidn tleervoepel rability standards – FHIR, DICOM, SNOMED CT, LOINC, ICD
• A set of 8 essential and minimum class of health record artefacts for data capture in NDHB were
• Third level
recommended
– Fourth level
» Fifth level

---

## Page 4

CFalisctk H toe aeldthitc aMrea sItnetre rtoitplee sratyblielity Resource (FHIR)
•• CHeliaclkth t Doa tead eixtc hManagset estra ntedaxrtd s dteyvleelsoped and nurtured by
HL7 International
– Second level
• Internet-based approach to connecting different discrete
• Third level
elements
– Fourth level
• Aims to build a set of bae resources that, either by
» Fifth level
themselves or when combined, satisfy the majority of
common use cases
• FHIR has around 150 resource types covering several
categories including Entities, Clinical, and Financial types
• Representable in XML, JSON, or RDF formats
• Provides Restful CRUD specifications for common operations
• Extensible by design - allows usecase specific customization
• Terminology binding to popular code sets
Scope

---

## Page 5

CWlihcyk FtoH IeRdit Master title style
• Click to edit Master text styles
Easy to develop: shallow learning curve and minimal custom tooling
requirements
– Second level
•E
T
as
h
y
ir
to
d
i
l
m
e
p
v
l
e
e
l
ment
– Fourth level
Semantically Robust: can be mapped back to other standards
» Fifth level
Implementer friendly: uses common tools and formats, and web-based
technologies for the specification (HTTP, XML, JSON, etc.)
The artifacts/records can be validated electronically
Open specification, multiple open-source implementations, vibrant community
Support human-readable serialization formats

---

## Page 6

CFHlicIRk tUos aegdeit SMceanstaerrio tsitle style
• Click to edit Master text styles
– Second level
A2
A1
• Third level
App
– Fourth level FHIR
» Fifth level
FHIR
Common API
Comm
Interface
PHR
FHIR
DB
FHIR object sharing FHIR exchange FHIR objects storage
6

---

## Page 7

CFHlicIRk tInot eedroitp Meraasbtielirt yt iPtlaer astdyilgems
• Click to edFitH MIRa sstuepr pteoxrtt sst yinletseroperability via 4 paradigms
– Second level
• Third level
– Fourth level
» Fifth level
Rest Documents
Messaging Services

---

## Page 8

CFHlicIRk tRoe seoduitr cMeaster title style
•• CReliscoku troce esdreitp Mresaesntet ra tuenxitt ostfy elxecshange of data that can be justifiable in
interoperability
– Second level
• A resource is made up of elements, each of which is a particular data type
• Third level
• A resource has a known identity (a URL) by which it can be addressed
– Fourth level
• Resources c»omFifbthin leev ebloth computer processable and human-understandable data
– Metadata to aid in searches and cataloging
– Structural specification
– Defined value sets for any enumerators
– A display element for direct print or display of simplified text
– Links to other resources
• Example of resources: Patient; Practitioner; Observation; Organization

---

## Page 9

CKelicyk P taor tesd oitf Ma Raestseoru trictele style
• Click to edit Master text styles
Resource Identity
& Metadata
– Second level
• Third level
Human Readable Text
– Fourth level
Extension with URL to Definition
» Fifth level
Standard & Structured Data:
• Identifier
• Name
• Telecom
• Gender
• DOB

**Table 9.1**

| Click to edit Master text styles<br>– Second level |
|---|
| • Third level |
| – Fourth level |
| » Fifth level |


---

## Page 10

CRelicsok utorc eed liist tM ina sFtHeIrR title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
Resource FHIR R 4.0.1 List : http://hl7.org/fhir/R4/resourcelist.html

---

## Page 11

CDlaictak tToy peedsit Master title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level

---

## Page 12

CBluicnkd tleos edit Master title style
•• CAl ilcakb troe peodritt Min aFsHteIRr tceaxnt bstey rleespresented as a set of related resources:
patient, requesting physician, observations, report in PDF format, order.
– Second level
• Third level
– Fourth level
» Fifth level
Multiple resources bundled for a logical
Individual resources can be transmitted
purpose as a transaction
as multiple transactions

---

## Page 13

Click to edit Master title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
FHIR WITH OTHER STANDARDS

---

## Page 14

CDligicitka lt oIm eadgiitn gM aansdt eCro tmitmleu snticyaletions in Medicine (DICOM)
• Standard by National Electrical Manufacturers
• Click to edit Master text styles
Association (NEMA)
– Second level
• Global specification for exchanging medical images in
• Third level
radiology, pathology, cardiology and related disciplines
– Fourth level
• Majorly used to standardize output of medical imaging
» Fifth level
hardware (X-Ray, CT, MRI machines) and software
(PACS, Radiological Reporting)
• DICOM is hierarchical information structure, has a
Client-Server service architecture, and also provides
File/DIR specifications
• Using DICOM with FHIR
– The DiagnosticReport FHIR Resource can carry a DICOM
ImagingStudy while exchanging information

---

## Page 15

CSNlicOkM toE Ded CitT Master title style
• Click to edit Master text styles
• Maintained and distributed by SNOMED International (also known as
– Second level
IHTSDO), a SDO with about 47 countries as members/owners.
• Third level
• Structured vocabulary used in clinical practice to accurately describe the
– Fourth level
care and treatment of patients
» Fifth level
• Purpose
– Semantic Interoperability
– To support clinical care:
• Recording statements about the health and health care of an individual patient
• Express meaning at various levels of abstraction for clinicians, patients,
researchers or organisations

---

## Page 16

CSNlicOkM toE Ded CitT MCoavsteerra gtietle style
Diagnosis
• •CoCmlipckre thoe nesdiviet ,M mauslttielinr gtueaxlt c lsitnyiclaels
Symptoms/Chief Complaints
healthcare terminology
Laboratory
– Second level
• Covers 18 major healthcare domains with
Procedure/ Treatment
• Third level
several sub-domains
Orders, Results
– Fourth level
• Contains 3,60,940 unique concepts
Medications
» Fifth level
relevant in healthcare, with more than 1.4
Body Structure
million descriptions and more than two
Nursing
and a half million relationships between
Substance
them
Medical Devices
• Extendible for National Requirements
Medical History
– AYUSH medicine
Organisms
– Drug codes
Specimen
– Any other specific to India
Events
• Useful in research, data analytics, CDSS, etc.
Environment / Geographical location
Record artifacts

---

## Page 17

CSNlicOkM toE Ded CitT MDaatsate Mr toitdlee lstyle
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level

---

## Page 18

CSNlicOkM toE Ded CitT Mina Hsteearl tthit lRee sctoyrleds
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level

---

## Page 19

CSNlicOkM toE Ded CitT Mina FsHteIRr title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level

---

## Page 20

CLoligcikca tlo O ebdseitr vMataiosnte Idr etnittliefi esrtsy lNeames and Codes (LOINC)
•• CUlnicikv teor seadli ts Mtaansdtearr dte xfot rs tiydleesntifying (coding) medical and
la–bSoecroantdo lreyveol bservations
• Third level
• Created and is maintained by the Regenstrief Institute, a US
– Fourth level
nonprofit medical research organization.
» Fifth level
• Essentially a laboratory coding system
• Details the method, components, system, etc. used for doing a
particular test / observation
– 9156-0 Glucose [Moles/volume] in Urine by Automated test strip
– Glucose:SCnc:Pt:Urine:Qn:Test strip

**Table 20.1**

|  | Glucose | : | SCnc | : | Pt | : | Urine | : | Qn | : | Test |  | strip |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|


---

## Page 21

CLOlicINk Cto w eitdhit F MHIaRster title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
Individual LOINC Test Code
LOINC Panel (Logical group of LOINC test observations)

---

## Page 22

CInlitcekr ntoat eiodnita Ml Calastsesirf itcitaltei osnty olef Diseases (ICD)
•• CCrliecakt etod aenddit MMaainstteairn teedx tb ysttyhlee sWorld Health Organization (WHO)
• D–esSiegcnoendd alesv ae lhealth care classification system, providing a system of diagnostic
codes for classifying diseases
• Third level
• Support–edFo culritnh ilceavel lcare use cases:
» Fifth level
– Monitoring of the incidence and prevalence of a disease
– Observing reimbursements and resource allocation trends
– Keeping track of safety and quality guidelines
• Enable aggregation of data to support their decisions and policies
• Allows government bodies to conduct epidemiological research of health trends
• Allows health data comparisons in the same location across different time
periods

---

## Page 23

CICliDc k– t1o0 e Edxita mMpalsetes r title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level

---

## Page 24

CICliDc-k1 t0o w eidtiht OMtahsetre rS ttaitnled astrydlse
•• CICliDc-k1 t0o weidtiht SMNaOstMerE Dte xCtT styles
–– STehceo gnrda nleuvlaerl data entry happens in SNOMED CT
– St•anTdhairrdd l eSNveOlMED CT to ICD-10 mapping is available
– ICD-1–0 Fcooudrteh bleavseel d classification is reported for epidemiology, insurance, etc.
» Fifth level
• ICD-10 with FHIR
– The Claims Resource links to ICD-10 code

---

## Page 25

Click to edit Master title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
ADOPTION OF FHIR IN ABDM

---

## Page 26

CAlpicpkr otoa cehd uits Meda fsoter rD taittlae sshtyalreing in NDHM
Fast Healthcare Interoperability Resource (FHIR) standard based data sharing
• Click to edit Master text styles
for all HI Types supporting data in 03 formats -
– Second level
• Scanned Documents
• Third level
– Helps uploading historic data
– Fourth level
– Allows quick on-boarding
• Structured da»taF wiftihth leovuetl standard terminology
– Structured data sharing with flexibility to include free text
– Better understanding of context
– Tools like Natural Language Processing can be used for
analytics in future
• Fully structured data with Coding / Terminology
(SNOMED CT / LOINC/ ICD)
– Better understanding of data (interoperable and
processable data)
– Data accuracy is guaranteed to the maximum
– Data ready for analytics which can help in real time
decision support
• DICOM for medical images
26

---

## Page 27

CFHlicIRk tImo pedleimt Menatsatteiro tni tGleu sidtyel eBuild 3.0.0
•• CFHliIRc kIm tpole medenitta Mtiona sGtueidre t(eIGx) tfo srt AyBlDeMs :
https://nrces.in/ndhm
– Second level
• Describes requirements for ABDM FHIR implementation
• Third level
– HL7 FHIR, DICOM, ICD-10, SNOMED CT, LOINC
– Fourth level
• 50 FHIR profiles include 07 Clinical Artifacts (HI
» Fifth level
Types); and 39 core profiles
1. OP Consultation Note 5. Wellness Record
6. Immunization Record
2. Discharge Summary
7. Health Record Document
3. Prescription
4. Diagnostic Report
• 04 Code Systems and 26 Value sets from
standard clinical terminologies to support their
use in profiles
www.nrces.in/ndhm

---

## Page 28

CPrliocfki ltinog edit Master title style
•• CFHlicIRk tsop eecdifitic Mataiosnte sra tteisxfty s tthylee smajority of common use cases
–– SPerocvoindde sle fvleexlibility to extend and adapt it according to local needs
– A•lmTohsitr de vleevreyl element in the base FHIR specification is optional
• The con – foForumrtha nlevceel on content of the data and operations is needed
» Fifth level
• FHIR profiling is a way to build consensus on content, operations & search
parameters supported
– Defining required and optional resource elements
– Defining additional resource elements are needed
– Binding terminology and value sets to be used
– Deciding which API features are used, and how

---

## Page 29

CFHlicIRk t- oP reodfiitl iMnga Rsteesro tuitrlcee sstyle
• Click to edit Master text styles
Required
– Second level
Must Support
• Third level
– Fourth level
Optional
» Fifth level
- Define what is required, optional, etc.
- Allow building light weight objects
- Enable Minimal Data sharing
- Provision for maximum data sharing (as
needed in different contexts)
- Reuse standard defined data structures
- Productive time investment
Patient Resource

---

## Page 30

CRelicakd itnog e FdHitI RM Parsotfeilre tsi tfloer s AtyBleDM
•• CTelixctk tSou medmit aMrya:stperro tveidxte sstyhluems an-readable summary of changes that we
have made. It refers to the Differential View of a profile.
– Second level
• Diffe•rTehnirtdia lel vVeilew: mentions the elements that are changed while profiling
– Fourth level
• Mandatory Element: Element with cardinality 1..1, 1..*
» Fifth level
• : element that must be supported.
• MUST Support: implementations that produce or consume resources
SHALL provide "support" for the element in some meaningful way
• MUST Support for ABDM: The Receiver (HIU) MUST have the capacity to
read the element though it is optional. The Sender (HIP) may opt not to fill
the element while sending (when data is not available)

---

## Page 31

UnCdliecrks ttaon eddinitg M thaest Setrr utictlteu rsety olef ABDM HI Types in FHIR
subject: Patient (Ref)
• Click to edit Master text styles Syntactic encounter: Encounter (Ref)
OP Consult Note
Interoperability author: Patient | Practitioner |
– Second level PractitionerRole| Organization (Ref)
resourceType: Bundle "type" : {
Id: OPCo•nsTulhtNirodte -leexvameplle-05 "coding" : [
{
type: document
– Fourth level "system" : "http://snomed.info/sct",
"code" : "371530004",
» Fifth level "display" : "Clinical consultation report"
Entry [0]: Composition
}
],
title: “Consultation Report”
section: Chief complaints [Condition (Ref)]
Entry [1]: Patient
PhysicalExamination[Observation(Ref)]
FamilyHistory[FamilyMemberHistory(Ref)]
"code":
Procedure [Procedure(Ref)]
{
Entry [2]: Condition .
"coding": [
.
{
.
"system": "http://snomed.info/sct",
Entry [3]: Procedur.e
"code": "297142003",
.
"display": "Foot swelling"
Semantic
.
}
Interoperability
. ],
"text": "Foot swelling"
}

**Table 31.1**

|  |  |  |
|---|---|---|
|  |  |  |
|  |  |  |


---

## Page 32

Click to edit Master title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
ADOPTION OF FHIR IN NHCX

---

## Page 33

CKelicyk U tsoe e cdaist eMs aster title style
• Click to edit Master text styles
Get provider/payer details.
– Second level
• Third level
Eligibility check for a beneficiary – Check can be for Coverage eligibility / Package or procedure eligibility.
– Fourth level
Pre a»utFhifrtehq uleevste al nd approval flow – Claim Type as Pre-determination, Pre-authorization
Claims request and Approval flow – Claim Type as Claim
Payment notification
Reprocessing claims – In case of partial approval or rejection of the claim
Search/fetch claims data for status checks, regulatory compliance, etc..
33

---

## Page 34

CPrliocfki ltinog e Rdeitq Muiarestmere ntittsle f osrt yNleHCX
•- ECnliscukr teo t hede itc yMclaes stpere cteifxict rsetysoleusrces are being shared
- Ea–sSee ocof nuds lee,v evlalidation and processing
• Third level
- FHIR resource structures to be adopted over NHCX APIs
– Fourth level
- The profiling should be generic enough to support any insurance workflow
» Fifth level
(including PMJAY)
- Value sets from Indian context are to be defined
- Ensure the practical scenarios of insurance processing are covered from
Indian context (Proof of Presence, Proof of Identity, etc.)
- Leverage the ABDM profiles & Resources and extend the same IG for NHCX

---

## Page 35

CNlHicCkX t oS teadnidt aMrda sDteerv etiltolep msteynlet Approach
• Collaborative approach
• Click to edit Master text styles
– End-user driven
– Second level
– Include Public & Private communities/users Relevant Standards: SNOMED CT,
• Third level
LOINC, ICD, FHIR
– Consultation and feedback from national
– Fourth level
agencies (NHA, IRDIA, etc.)
» Fifth level
• Focus on implementing best suitable design Profile Designing
– Use-case driven
• Re-use existing efforts (ABDM profiles)
Implementation Guide
• Leverage the existing/community work
• NRCeS to be the SPC and Maintainer for ABDM
Value Sets
Profiles, NHCX Profiles like CDCI, AYUSH
standards and other initiatives of MoHFW

---

## Page 36

FHIR Resource Under Consideration for NHCX
Click to edit Master title style
• InsurancePlan: InsurancePlan represents the product
• Click to edit Master text styles
that can be offered to the customer. It describes a
health insurance offering comprised of a list of covered
– Second level
CLAIM
benefits, costs associated with those, and additional
• Third level INSURANCE CLAIM
information about the offering.
PLAN RESPONSE
• Claim: Claims are used to exchange financial and clinical
– Fourth level
information between healthcare providers, payors
» Fifth level
/insurers.
COVERAGE
• Claim Response: Claim Response resource provides
TASK ELIGIBILITY
application-level adjudication results or errors after
REQUEST
processing a submitted Claim. FHIR RESOURCE FOR NHCX
• Coverage Eligibility Request: The Coverage Eligibility
Request asks the insurer for a CoverageEligibility
COVERAGE
Response with information about valid coverage,
PAYMENT
ELIGIBILITY
available coverages, provided benefits, and pre-auth RECONCILATI
RESPONSE
ON
requirements.
• Coverage Eligibility Response: Coverage Eligibility
PAYMENT
Response provides eligibility and plan details from a COVERAGE
NOTICE
Coverage Eligibility Request.

---

## Page 37

CNlHicCkX t oP reodfiitle Ms aster title style
•• CFHlicIRk tpor oefdiliets M NaHsCteXr text styles
– Second level
• Third level
– Fourth level
» Fifth level
• Relevant Value sets
Preview - https://nrces.in/preview/ndhm/fhir/r4/hcx-profile.html

---

## Page 38

Understanding the Structure of Claim Bundle
Click to edit Master title style
Syntactic Claim
Interoperability
• Click to edit Master text styles "resourceType" : "Claim", Claim Type as Pre-
Claim Bundle
determination, Pre-
"status" : "active",
authorization, Claim
"use" : "claim | pre-auth |pre-det,
– Second level
"patient" : {"reference" : "Patient/1“},
resourceType: Bundle
“insurer”: {"reference" : organization/1}
Id: Claim•-01
Third level “diagnosis”:{“reference”: ”condition”}
type: collection “procedure”:{“reference”: “procedure”}
– Fourth level
Entry [0]: Claim
Patient Organization
» Fifth level
"resourceType" : "Patient", "resourceType" : "Organization",
Entry [1]: Patient "name" : { "text" : "AyushSharma" }, "name" : "XYZ Insurance Pvt.Ltd.",
"gender" : "male", "telecom" : [ { "system" : phone",
"birthDate" : "1981-01-12" "value" : "+91 243 2634 1234",
"use" : "work" }
Entry [2]: Insurer
Practitioner
Entry [3]: Provider "resourceType" : "Practitioner",
"name" : [{ "text" : "Dr. Aysush" } ]
Procedure
Entry [4]: Procedure "resourceType" : "Procedure",
Condition "status" : "completed",
"code" : { "coding" : [ {
. "resourceType" : “Condition",
Entry [5]: Condition "system" : "http://snomed.info/sct",
"status" : "completed",
. "code" : "36969009",
"code" : { "coding" : [ {
"display“: "Placement of stent in coronary artery"
.
"system" : "http://snomed.info/sct",
"code" : "53741008 ",
"display“: “Coronary arteriosclerosis “}}}

**Table 38.1**

|  |
|---|
|  |
|  |
|  |


---

## Page 39

CNlHicCkX t oF oecduits eMda FsHteIRr tRiteleso sutyrclees
•• CFHliIRc kIm tpole medenitta Mtiona sGtueidre t(eIGx) tfo srt AyBlDeMs : https://nrces.in/ndhm
• Describes requirements for ABDM FHIR implementation • Claim
– Second level
– HL7 FHIR, DICOM, ICD-10, SNOMED CT, LOINC
• Claim Response
• Third level
• 50 FHIR profiles include 07 Clinical Artifacts (HI Types);
– Fourth level • Eligibility Request
04 Health Claim Exchange (HCX) profiles and 39 core
» Fifth level
• Eligibility Response
profiles
• Insurance Plan
1. Claim Bundle
• Coverage
2. Claim Response Bundle
3. Coverage Eligibility Request Bundle • Payment Notice
4. Coverage Eligibility Response Bundle
• Payment Reconscillation
• Task
www.nrces.in/ndhm

---

## Page 40

CExliacmk tpole esdit Master title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
CoverageEligibilityRequest with purpose: ’auth-requirements’
Claim with use: ‘claim’

---

## Page 41

Click to edit Master title style
• Click to edit Master text styles
– Second level
• Third level
– Fourth level
» Fifth level
Thank You
nrc-help@cdac.in
manishar@cdac.in

---

*205 embedded image(s) extracted to `Standards for NHCX_images/`*