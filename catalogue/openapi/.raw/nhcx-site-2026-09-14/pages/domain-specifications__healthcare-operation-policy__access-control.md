# https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/access-control

Access Controls
Participating systems in the Claims information exchange ecosystem may possess one or more of the following roles. These roles are based on the base set of organisation roles defined in hl7 specifications
here.
Namespaced coding is used to further qualify the role in the context of the claims exchange process.
 provider:
 Health Service Provider
 payer:
 Insurance service provider
 agency.tpa:
 Third party administrator acting on behalf of the payer. In the current version, this role is expected to behave like a payer from the data exchange perspective.
 agency.regulator:
 IRDAI and IIB like regulatory bodies.
 research:
 Research groups, etc.
 member.isnp:
 eCommerce platforms facilitating insurance adoption
 agency.sponsor:
 Scheme owners of specific programs, e.g. NHA for Ayushman Bharat
 HIE/HIO.NHCX:
 Other NHCXs
The following table further describes these roles for their corresponding access rights and scenarios for version 1 of the claims exchange process:
Role
Allowed actions
Comments
provider
Eligibility check
Send request
Receive response
Pre Auth
Send request
Receive response
Claims Request
Send request
Receive response
Payment
Receive Notice
Send Acknowledgement
Search/Status
Pre Auth
Claims Status
Providers can make search/status requests for multiple requests that originated from them.
payer/ agency.tpa
Eligibility check
Receive request
Send response
Pre Auth
Receive request
Send response
Claims Request
Receive request
Send response
Payment
Send Notice
Receive Acknowledgement
Search/Status
Payment confirmation
Payers can make search/status requests for multiple payment notices that originated from them.
agency.regulator
Search
Claims
Data exchange switch will forward the search request to all payers who are expected to return the claims data in the proposed FHIR structure as per regulator’s policies.
research
Eligibility check
Receive request
Send response
Search
Pre Auths - aggregate and/or anonymised
Claims - aggregate and/or anonymised
All data exhausts for these roles would only have aggregate and anonymised data. Key aggregations for eligibility requests, preauthentication, claims and payments information will need to be further defined.
member.isnp
Eligibility check
Receive request
Send response
Search
Pre Auths - aggregate and/or anonymised
Claims - aggregate and/or anonymised
Claims - Individual claims data as per beneficiary consent
As facilitators of insurance eCommerce, it is proposed to provide ISNPs access to the data available to research role as well as individual beneficiary queries (preauth, claims) based on beneficiary consent. This consent flow is expected to work with existing consent management infrastructure and ISNPs are expected to submit the acquired consent as part of the domain header.
agency.sponsor
As planners of the insurance schemes, sponsors are proposed to be given access equivalent to payer role.
HIE/HIO.NHCX
As an NHCX this participant is expected to play different roles as per the need of the use case. However, due to the data privacy and security measures prescribed in the Open Protocol, it will not be able to view the actual payload.


## Links on this page

- https://www.hl7.org/fhir/valueset-organization-role.html
