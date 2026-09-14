# https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/keydesign-consideration

Key Design Considerations
List of considerations to ensure adherence to the listed design principles
In order to fulfil architectural principles listed in
National Health Claims Exchange - Open Specifications,
the protocol needs to consider the following key design elements:
The protocol must be designed to support the asynchronous exchange of information to support the scale and asynchronous nature of processes in the industry
The protocol must support the federated deployment of multiple NHCX instances.
In order to ensure the security and privacy of sensitive data
The protocol must allow for separation of transport (and any other common information) from sensitive information in the respective flows.
The protocol must provide for encryption, signing, and auditing of relevant information.
The protocol should allow creating unique identifiers for each message exchange.
The protocol should allow related multiple messages that are part of a single business flow.
The protocol should allow using existing registries for key entities - beneficiary, provider, and payor with a facility to extend them for the specific use case.
The protocol should be designed to allow for the inclusion of the new types of use cases.
The protocol should be designed to allow extending a use case as per the need of the use case/program (for example, a particular government scheme or innovative health financing solution may need different information about the beneficiary, provider, or intervention)
