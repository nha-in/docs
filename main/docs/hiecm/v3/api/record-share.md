# Patient scan and record share

The patient or end-user can log in to the PHR application and use the "Scan and Record share" feature by scanning the facility's QR code.

This process shares the patient's health records with the Health Information User (HIU) system. It ensures secure authentication and consent before sharing sensitive health information. Patients can easily control and transmit their health data to the intended HIU.

## Base URL and X-CM-ID

| Environment | Base URL                   | X-CM-ID |
| ----------- | -------------------------- | ------- |
| Sandbox     | `https://dev.abdm.gov.in`  | `sbx`   |
| Production  | `https://apis.abdm.gov.in` | `abdm`  |

## Terminology

- **Bridge ID** is the client ID provided by NHA to the HIP. It is alphanumeric, for example `SBX_00XXXX`.
- **Service ID** is the facility ID generated from the NHPR application. It is alphanumeric, for example `IN02100000XX`.

## The calls

Each side makes its calls in this order. A callback is a POST from the HIE-CM to the URL registered for your bridge.

| Step | PHR app                                                                                                     | HIU                                                                                                   |
| ---- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1    | `POST /api/hiecm/patient-record/v3/share` after scanning the QR code                                        | Receives the share request on `/api/v3/patient-record/share`                                          |
| 2    | Receives the data push URL and key on `/api/v3/patient-record/on-share`                                     | `POST /api/hiecm/patient-record/v3/on-share` with the data push URL and key                           |
| 3    | Posts the encrypted records to the data push URL                                                            | Receives the encrypted records at the data push URL                                                   |
| 4    | `POST /api/hiecm/patient-record/v3/notify`, session status `TRANSFERRED`, `PARTIAL_TRANSFERRED` or `FAILED` | `POST /api/hiecm/patient-record/v3/notify`, session status `RECEIVED`, `PARTIAL_RECEIVED` or `FAILED` |
| 5    | Receives the other side's status on `/api/v3/patient-record/on-notify`                                      | Receives the other side's status on `/api/v3/patient-record/on-notify`                                |
| 6    | `GET /api/hiecm/patient-record/v3/audit-history` for the sharing history                                    |                                                                                                       |

The full operation list is in the [record share API reference](/docs/main/reference/hiecm-record-share).
