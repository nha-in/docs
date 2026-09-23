# https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/audit-and-reporting

Audit and Reporting
Overview of audit requirements
NHCX instances are expected to log each API call received along with the non encrypted details (domain headers, sig/enc algorithm details, sender & recipient details) and status of signature verification.
Key Requirements: 
NHCX instances should provide reports against the audit logs for different actors - payors, providers, beneficiaries, regulators, observers. Each NHCX instance shall publish the list of reports supported by that instance and also define the level/details of information in each report.
The audit information stored should be made available through an API, so that the participating systems can query the audit log related to them.
Each NHCX instance shall define an archival policy for retention & deletion of audit logs. The policy shall also define the process for accessing the logs after archival, if the NHCX instance has support for it.
It is recommended for NHCX instances to have a configuration to control the amount of information that gets stored in the audit logs.
