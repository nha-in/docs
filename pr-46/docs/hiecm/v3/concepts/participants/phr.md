# Personal Health Record (PHR) Application

The Personal Health Record ([PHR](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#phr)) application functions as the primary digital interface for the citizen within the Ayushman Bharat Digital Mission ([ABDM](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#abdm)) ecosystem. It facilitates digital identity management, provides access to longitudinal health records, and serves as the centralized node for consent artifact management.

## Role and positioning within the ABDM architecture

The PHR application operates on behalf of the citizen and securely connects with healthcare facilities through the [HIE-CM](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#hie-cm). Health data is routed using the citizen's [ABHA address](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#abha-address). The PHR application acts as an [HIU](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#hiu) for fetching clinical records and as a [HIP](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#hip) for sharing user-uploaded health documents and facility linked health documents. It must be listed in the ABDM Application Directory after Sandbox exit with its official name and marketplace URLs.

## Authorized capabilities and milestones

| Integration phase                                             | Functional capabilities                                                                                                                                                                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Phase 1 (P1)](/docs/pr-46/docs/hiecm/v3/milestones/p1)       | Facilitation of ABHA number and address creation, multiple authentication (four mandated login routes).                                                                                                                            |
| [Phase 2 (P2)](/docs/pr-46/docs/hiecm/v3/milestones/p2)       | Execution of facility-level Scan & Share, profile management, ABHA card and QR code generation, legacy record discovery, and standardized [Care Context](/docs/pr-46/docs/hiecm/v3/getting-started/glossary#care-context) linkage. |
| [Phase 3 (P3)](/docs/pr-46/docs/hiecm/v3/milestones/p3)       | Management of user locker subscriptions and system notifications, execution of consent decisions (approval/rejection), configuration of auto-approval policies, and the secure retrieval and storage of health records.            |
| Health Locker ([M2](/docs/pr-46/docs/hiecm/v3/milestones/m2)) | Processing direct document uploads necessitates certification as a Health Locker (Health Repository Provider), which requires the successful completion of Milestone 2 (M2) integration.                                           |

## Significance and ecosystem value

The PHR application platform empowers citizens by providing a central interface for consent management and control over their health information. Through HIE-CM, users receive notifications on the creation or modification of Care Contexts linked to their ABHA address, enabling aggregation of longitudinal health records based on approved consent policies. In addition, PHR applications and Health Lockers provide secure, long-term, user-managed storage of health records, complementing the statutory record-retention responsibilities of healthcare establishments.

## Next steps

- [P1 Identity and login](/docs/pr-46/docs/hiecm/v3/milestones/p1): creating an ABHA address and the login routes, with the [P1 API reference](/docs/pr-46/reference/hiecm-p1).
- [P2 Linking and records](/docs/pr-46/docs/hiecm/v3/milestones/p2): scan and share, discovery, the profile and the card, with the [P2 API reference](/docs/pr-46/reference/hiecm-p2).
- [P3 Consent and notifications](/docs/pr-46/docs/hiecm/v3/milestones/p3): subscriptions, auto approval, consent and fetching records. The subscription calls are in the [P3 API reference](/docs/pr-46/reference/hiecm-p3), the auto approval and consent calls in the [P2 API reference](/docs/pr-46/reference/hiecm-p2), and the health locker calls in the [P4 API reference](/docs/pr-46/reference/hiecm-p4).
- [Get started](/docs/pr-46/docs/hiecm/v3/getting-started/sandbox) for sandbox signup and your first call.
