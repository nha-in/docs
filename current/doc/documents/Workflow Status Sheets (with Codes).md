# Workflow Status Sheets (with Codes)

*Source: `documents/Workflow Status Sheets (with Codes).xlsx` — all sheets*


## Sheet: Sheet1

| Stage | Workflow Id | NHCX Header | Status / NRCeS Outcome |
|---|---|---|---|
| Patient Registered | 10 | request.initiated |  |
| Patient Admitted | 11 | request.initiated |  |
| Preauth  Request Initiated | 12 | request.initiated | NR |
| Discharge Submitted | 14 | request.initiated |  |
| Claim Request in process | 28 | response.partial |  |
| Claim Forwarded | 29 | response.partial |  |
| Payment Processed | 31 | request.initiated |  |
| Payment Settled | 33 | request.initiated |  |
| Discharge Query Response Submitted | 141 | response.complete |  |
| Claim Query Response Submitted | 151 | response.complete |  |
| Reprocess Request Approved | 252 | response.complete | NA |
| Reprocess Request Rejected | 253 | response.complete | NA |
| Reprocess Request Queried | 254 | request.initiated | NA |
| Discharge Request Approved | 261 | response.partial |  |
| Discharge Request Rejected | 262 | response.complete |  |
| Discharge Request Queried | 263 | request.initiated |  |
| PreAuth Reprocess(Resubmission) Initimation | 121 | request.initiated | NR |
| Enhancement Request Initiated | 13 | request.initiated | NR |
| Enhancement Query Ack Success | 131 | response.partial | This should be handled as protocal error |
| Enhancement Query Ack Failed | 131 | response.error | This should be handled as protocal error |
| Enhancement Query Response Submitted | 131 | response.complete |  |
| Final Bill Initimation | 45 | request.initiated | NR |
| Final Bill Ack Success | 45 | response.partial | queued This should be handled as protocal error |
| Final Bill Ack Failed | 45 | response.error | error This should be handled as protocal error |
| Claim Request Initiated | 15 | request.initiated | NR |
| Final Bill Query Response | 181 | response.complete |  |
| Claim Doc Query Response | 161 | response.complete |  |
| Payment Notice Recived | 17 | response.complete |  |
| PreAuth Query Ack Success | 18 | response.partial |  |
| PreAuth Query Ack Failed | 18 | response.error | This should be handled as protocal error |
| PreAuth Query Response Submitted | 19 | response.complete |  |
| PreAuth Ack Success | 20 | response.partial | queued |
| PreAuth Ack Failed | 20 | response.error | error |
| Preauth Request Approved | 21 | response.complete | partial |
| Enhancement Request Approved | 22 | response.complete | partial |
| PreAuth Request Rejected | 23 | response.complete | complete |
| Enhancement Deny | 231 | response.complete | complete |
| PreAuth Request Queried | 24 | request.initiated | NR |
| Enhancement Query Raise | 241 | request.initiated | NR |
| Claim Doc Ack Success | 25 | response.partial | queued |
| Claim Doc Ack Failed | 25 | response.error | error |
| PreAuth Reprocess Ack | 251 | response.complete |  |
| Final Bill Approve | 46 | response.complete | partial |
| Claim Request Approved | 26 | response.complete | complete |
| Final Bill Query Raise | 47 | request.initiated | NR |
| Final Bill Query Ack Success | 47 | response.partial | This should be handled as protocal error |
| Final Bill Query Ack Failed | 47 | response.error | This should be handled as protocal error |
| Claim Request Queried | 27 | request.initiated | NR |
| Claim Request Queried | 27 | response.partial/complete | This should be handled as protocal error |
| Final Bill Deny | 491 | response.complete | complete |
| Claim Doc Deny | 291 | response.complete | complete |
| Payment Notice Initmation | 30 | request.initiated |  |
| Payment Notice Ack Success | 30 | response.partial | This should be handled as protocal error |
| Payment Notice Ack Failed | 30 | response.error | This should be handled as protocal error |
| Reimburstment Claim Reprocess Requested | R122 | request.initiated |  |
| Reimburstment Claim Submitted | R15 | request.initiated |  |
| Reimburstment Claim Query Response Submitted | R151 | response.complete |  |
| Reimburstment Claim Reprocess Request Approved | R252 | response.complete |  |
| Reimburstment Claim Reprocess Request Rejected | R253 | response.complete |  |
| Reimburstment Claim Reprocess Request Queried | R254 | request.initiated |  |
| Reimburstment Claim Approved | R26 | response.complete |  |
| Reimburstment Claim Queried | R27 | request.initiated |  |
| Reimburstment Claim evaluation in process | R28 | response.partial |  |
| Reimburstment Claim Rejected | R291 | response.complete |  |
| Wallet Upgrade Intimation | 34 | request.initiated |  |
| Claim Arbitration Intimation | 36 | request.initiated |  |
| Fraud Alert | 38 | request.initiated |  |
| Wallet Upgrade Acknowledgement | 35 | response.complete |  |
| Claim Arbitration Acknowledgement | 37 | response.complete |  |
| Fraud Alert Acknowledgement | 39 | response.complete |  |
| Grievance Intimation | G11 | request.initiated |  |
| Grievance Acknowledment | G12 | response.complete |  |
| Grievance Intimation Failure | G13 | response.error |  |
| Preauth Arbitration Intimation | 41 | request.initiated |  |
| Preauth Arbitration Acknowledgement | 42 | response.complete |  |
| Return Payment Intimation | RP1 | request.initiated |  |
| Return Payment Acknowledgement | RP2 | response.complete |  |
| Return Payment Failure | RP3 | response.error |  |
| Notifications Intended to Payer | N01 | request.initiated |  |
| Notifications Intended to Provider | N02 | request.initiated |  |
| Notifications Intended to Beneficiary | N03 | request.initiated |  |
| Acknowledgement of the Notificaion | N04 | response.complete |  |
| Discharge Correction Intimation | DC01 | request.initiated |  |
| Acknowledgement for Discharge Correction | DC02 | response.complete |  |
| Preauthorization Cancellation | PC01 | request.initiated |  |
| Preauthorization Cancellation Accomplished | PC02 | response.complete |  |