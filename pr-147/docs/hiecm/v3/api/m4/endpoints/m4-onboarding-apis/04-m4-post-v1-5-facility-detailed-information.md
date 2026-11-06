# Submit the v15Facility detailed information

`POST /v1.5/facility/detailed-information`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/detailed-information \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "trackingId": "80266",
  "specialities": [
    {
      "systemOfMedicineCode": "M",
      "isSpecializationAvalaible": "Y",
      "specialities": [
        "S29",
        "S30",
        "S31"
      ]
    },
    {
      "systemOfMedicineCode": "D",
      "isSpecializationAvalaible": "Y",
      "specialities": [
        "S50",
        "S51",
        "S46"
      ]
    },
    {
      "systemOfMedicineCode": "UN",
      "isSpecializationAvalaible": "Y",
      "specialities": [
        "S68",
        "S168",
        "S100"
      ]
    }
  ],
  "medicalInfrastructure": {
    "countIPDBedsWithoutOxygen": 2,
    "countIPDBedsWithOxygen": 3,
    "countICUBedsWithVentilators": 4,
    "countICUBedsWithoutVentilators": 1,
    "countHDUBedsWithVentilators": 5,
    "countHDUBedsWithoutVentilators": 6,
    "totalNumberOfVentilators": 7,
    "countDayCareBedsWithoutOxygen": 8,
    "countDayCareBedsWithOxygen": 9,
    "countDentalChairs": 1,
    "totalNumberOfBeds": 4
  },
  "pharmacyDetails": {
    "isJanAushadhiKendra": "Y",
    "janAushadhiKendraId": "jan-id",
    "drugLicenseNumber": "test1234",
    "pharmacyGstinNumber": "testg1234",
    "pharmacistRegistrationNumber": "reg1234"
  },
  "bloodBankDetails": {
    "isFacilityRegisteredInERaktkosh": "N",
    "eRaktoshId": "Y",
    "bloodBankLicenseNumber": "345-test-regno",
    "bloodStorageCenters": "Y",
    "storageCentersCount": 7,
    "bloodCollectedPerAnnum": "5",
    "bloodRequiredPerAnnum": "6"
  },
  "imagingServices": [
    {
      "service": "S136",
      "count": 77
    },
    {
      "service": "S139",
      "count": 99
    },
    {
      "service": "S138",
      "count": 76
    }
  ],
  "diagnosticServices": [
    ""
  ]
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `trackingId` (string, required): Unique identification number for your facility. Tracking id generated from basic information API.
- `specialities` (object[]): Section to capture specializations/services Details. Note: Specialities are not required for the facility types: Blood Bank, Cath Laboratory, Diagnostic Laboratory, Dialysis Centre, Imaging Centre, and Pharmacy. Required based on the facility type and if specializations/services are offered for this system of medicine.
- `specialities.systemOfMedicineCode` (string, required): System of medicine codes as saved in Basic-Information API. Accepted codes as specified in get-master-data API with type='MEDICINE'. See `GET /v1.5/facility/get-master-data`.
- `specialities.isSpecializationAvalaible` (string, required): If the facility offers any specializations or services for this system of medicine. Y / N as accepted value.
- `specialities.specialities` (string[], required): List of specialities for each system of medicine offered by the facility. Accepted codes as specified in the get-specialities API with respect to a system of medicine. See `POST /v1.5/facility/get-specialities`.
- `medicalInfrastructure` (object): Section to capture medicalInfrastructure Details. Required based on the Type of Service, Facility Type and System of Medicine values.
- `medicalInfrastructure.countLevel1IcuBedWithOutVentilators` (integer)
- `medicalInfrastructure.countIPDBedsWithoutOxygen` (integer): Number of IPD Beds (except ICU beds) without oxygen facility. Numeric Value.
- `medicalInfrastructure.countIPDBedsWithOxygen` (integer): Number of IPD Beds (except ICU beds) with oxygen facility. Numeric Value.
- `medicalInfrastructure.countICUBedsWithVentilators` (integer): Number of ICU beds with Ventilators. Numeric Value.
- `medicalInfrastructure.countICUBedsWithoutVentilators` (integer): Number of ICU beds without Ventilators. Numeric Value.
- `medicalInfrastructure.countHDUBedsWithVentilators` (integer): Number of HDU beds with Ventilators. Numeric Value.
- `medicalInfrastructure.countHDUBedsWithoutVentilators` (integer): Number of HDU beds without Ventilators. Numeric Value.
- `medicalInfrastructure.totalNumberOfVentilators` (integer): Total Number of Ventilators. Numeric Value.
- `medicalInfrastructure.countDayCareBedsWithoutOxygen` (integer): Number of Daycare beds without oxygen facility. Numeric Value.
- `medicalInfrastructure.countDayCareBedsWithOxygen` (integer): Number of Daycare beds with oxygen facility. Numeric Value.
- `medicalInfrastructure.countDentalChairs` (integer): Number of Dental Chairs. Numeric Value. Required if the system of medicine is Dentistry.
- `medicalInfrastructure.totalNumberOfBeds` (integer, required): Total count which should be equal to or greater than sum of all the above components with beds. Numeric value.
- `medicalInfrastructure.hasIcuBeds` (string)
- `medicalInfrastructure.countLevel1IcuBedWithVentilators` (integer)
- `medicalInfrastructure.CountLevel1IcuBedWithOutVentilators` (integer)
- `medicalInfrastructure.countLevel2IcuBeds` (integer)
- `medicalInfrastructure.countLevel3IcuBeds` (integer)
- `medicalInfrastructure.isIcuContactSameAsManager` (string)
- `medicalInfrastructure.cmoMoIcuControlMobile` (string)
- `pharmacyDetails` (object): Section to capture Pharmacy Details. Required if facility type is Pharmacy.
- `pharmacyDetails.isJanAushadhiKendra` (string): Is your facility a Jan Aushadhi Kendra?. Y / N as accepted value.
- `pharmacyDetails.janAushadhiKendraId` (string): Provide jan Aushadhi Kendra Id. Accepted Alphanumeric value and special characters (- and _). Required if facility is Jan Aushadhi Kendra.
- `pharmacyDetails.drugLicenseNumber` (string): Mention your Drug License Number. Accepted Alphanumeric value and special characters (- and _). Required if facility type is Pharmacy.
- `pharmacyDetails.pharmacyGstinNumber` (string): Mention GSTIN Number. Accepted Alphanumeric value and special characters (- and _).
- `pharmacyDetails.pharmacistRegistrationNumber` (string): Mention Pharmacist registration number. Accepted Alphanumeric value and special characters (- and _).
- `bloodBankDetails` (object): Section to capture blood bank details. Required if facility type is blood bank.
- `bloodBankDetails.isFacilityRegisteredInERaktkosh` (string, required): Is your facility registered in e-Raktkosh. Y / N as accepted value.
- `bloodBankDetails.eRaktoshId` (string): Provide e-Raktkosh Id. Accepted Alphanumeric value with special characters (- and _). Required if facility is registered in e-Raktkosh.
- `bloodBankDetails.bloodBankLicenseNumber` (string, required): Mention your Blood Bank Registration Number. Alphanumeric value.
- `bloodBankDetails.bloodStorageCenters` (string): Is there any Blood Storage Centres associated with your Blood Bank. Y or N as accepted value.
- `bloodBankDetails.storageCentersCount` (integer): Count of Blood Storage Centres. Numeric Value greater than 0. Required if storage centers are associated with your blood bank.
- `bloodBankDetails.bloodCollectedPerAnnum` (string): Please indicate the number of blood units collected per annum. Numeric value.
- `bloodBankDetails.bloodRequiredPerAnnum` (string): Please mention existing requirement of Blood per annum. Numeric value.
- `imagingServices` (object[]): Section to capture Imaging Services details. Required if facility type is Imaging center.
- `imagingServices.service` (string, required): Code of imaging service that is offered by the facility. Accepted codes as specified in get-master-data API with type='IMAGING'. See `GET /v1.5/facility/get-master-data`.
- `imagingServices.count` (integer): Count of equipment available. Number greater than 0. Required if a service is offered.
- `diagnosticServices` (string[]): Codes of diagnostic services available at your facility. Comma separated list of Strings. Accepted codes as specified in get-master-data API with type='DIAGNOSTIC'. See `GET /v1.5/facility/get-master-data`. Required if facility type is Diagnostic Lab.

## Responses

- `200`: OK
  - `trackingId` (string)
  - `status` (string)
  - `message` (string)
  - `errorStatus` (object[])
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "trackingId": "<TRACKING_ID>",
  "status": "<STATUS>",
  "message": "<MESSAGE>",
  "errorStatus": []
}
```
