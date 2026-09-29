**UHI-JanAushaduKendra (PMBI) integration**

**Medicine Search requests**

In all below search request we will use descriptor as JANAUSHADHI i.e., JANAUSHADHI in item object

1. **Search medicine using medicine name**

{

"context": {

"domain": "nic2008:47721",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"fulfillment": {

"type": "JANAUSHADHI\_MEDICINE",

"start": {

"time": {

"timestamp": "2026-06-09T00:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-09T23:59:59"

}

}

},

"item": {

"descriptor": {

"code": "MedicineName (without space)",

"name": "MedicineName"

}

}

}

}

}

**on\_search response expected from Jan Aushadhi Kendra HSPA**

{

"context": {

"domain": "nic2008:47721",

"country": "IND",

"city": "std:011",

"action": "on\_search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "janaushadhi-hspa",

"provider\_uri": "https://janaushadhi.gov.in:8443/api/v1/admin/kendra/",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"catalog": {

"descriptor": {

"name": "JAN AUSHADHI KENDRA HSPA",

"images": "JAN AUSHADHI KENDRA HSPA logo IMAGE",

"short\_desc": "Short description of Jan Aushadhi Kendra HSPA",

"long\_desc": "Long description if available"

},

"providers": [

{

"id": "medicineId - 78299",

"descriptor": {

"name": "generic\_Name - 3-way stopcock with 10 cm extension line",

"code": "itemCode – 8150.0",

"symbol": "",

"short\_desc": "",

"long\_desc": ""

},

"items": [

{

"id": "0",

"price": {

"currency": "INR",

"value": "mrp - 20.0"

},

"quantity": {

"measure": {

"value": 10, //unitSize

"unit": "s/ml/sachet/drops/mg tetra pack"

}

}

}

]

}

]

}

}

}

**Search Jan Aushadhi Kendra for selected medicine**

Here rest all search parameters will be as same as used in Kendra Search. Only type and item descriptor will get change

{

"context": {

"domain": "nic2008:47721",

"country": "IND",

"city": "std:011",

"action": "search",

"core\_version": "0.7.1",

"consumer\_id": "nha.eua",

"consumer\_uri": "https://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-19T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"intent": {

"fulfillment": {

"type": "JANAUSHADHI\_KENDRA",

"start": {

"time": {

"timestamp": "2026-06-19T00:00:00"

}

},

"end": {

"time": {

"timestamp": "2026-06-19T23:59:59"

}

}

},

"item": {

"descriptor": {

"code": "medicineId - 78299",

"name": " medicineId - 78299"

}

},

"location": {

"district": {

"code": "507",

"name": "HYDERABAD"

},

"state": {

"code": "36",

"name": "Telangana"

}

}

}

}

}

**On search response for with medicine stock details**

{

"context": {

"domain": "nic2008:47721",

"country": "IND",

"city": "std:011",

"action": "on\_search",

"core\_version": "0.7.1",

"consumer\_id": "eua-nha",

"consumer\_uri": "http://uhieuasandbox.abdm.gov.in/api/v1/euaService",

"provider\_id": "janaushadhi-hspa",

"provider\_uri": "https://janaushadhi.gov.in:8443/api/v1/admin/kendra/",

"message\_id": "e9a19230-f951-11ec-b135-53aea776f66b",

"timestamp": "2026-06-09T18:24:35",

"transaction\_id": "e9a19230-f951-11ec-b135-53aea776f66b"

},

"message": {

"catalog": {

"descriptor": {

"name": "JAN AUSHADHI KENDRA HSPA",

"images": "JAN AUSHADHI KENDRA HSPA logo IMAGE",

"short\_desc": "Short description of Jan Aushadhi Kendra HSPA",

"long\_desc": "Long description if available"

},

"providers": [

{

"id": "kendraCode - PMBJK01460",

"descriptor": {

"name": "kendraName - Jan Aushadhi Kendra",

"code": "ownership – PP | PG | GG etc",

"symbol": "serialNumber - 1",

"short\_desc": "",

"long\_desc": ""

},

"fulfillments": [

{

"id": "0",

"type": "contact",

"agent": {

"name": "contactPerson - <NAME>"

},

"start": {

"time": {

"timestamp": "kendraEnrolmentDate 2022-06-09T10:00:00"

}

}

}

],

"items": [

{

"id": "medicineId - 78299",

"descriptor": {

"name": "generic\_Name - 3-way stopcock with 10 cm extension line",

"code": "itemCode – 8150.0",

"symbol": "",

"short\_desc": "",

"flag": **false** //used to send flag for in stock or out of stock ],

"location": {

"id": "1",

"descriptor": {

"name": "Jan Aushadhi Kendra"

},

"city": {

"name": "",

"code": ""

},

"district": {

"name": "Ahmednagar",

"code": "466"

},

"state": {

"name": "Maharashtra",

"code": "27"

},

"country": {

"name": "INDIA",

"code": "+91"

},

"gps": "19.7126974,74.4833288",

"address": "<ADDRESS>",

"radius": { // object only came if search request contains user gps cordinates to provide the distace between kendra and user

"type": "CONSTANT",

"value": "12",

"unit": "km"

}

},

"contact": {

"phone": "contactNumber - <MOBILE_NUMBER>",

"email": "contactEmail - "

}

},

{

"id": "PMBJK01472",

"descriptor": {

"name": "Jan Aushadhi Kendra2",

"code": "PP",

"symbol": "2",

"short\_desc": "",

"long\_desc": ""

},

"fulfillments": [

{

"id": "0",

"type": "contact",

"agent": {

"name": "<NAME>"

},

"start": {

"time": {

"timestamp": "2018-03-22T12:00:00"

}

}

}

],

"items": [

{

"id": "78299",

"descriptor": {

"name": "3-way stopcock with 10 cm extension line",

"code": "8150.0",

"symbol": "",

"short\_desc": "",

"flag": **false**

},

"quantity": {

"measure": {

"value": 10,

"unit": "s"

}

}

}

],

"location": {

"id": "1",

"descriptor": {

"name": "Jan Aushadhi Kendra2"

},

"city": {

"name": "",

"code": ""

},

"district": {

"name": "Akola",

"code": "467"

},

"state": {

"name": "Maharashtra",

"code": "27"

},

"country": {

"name": "INDIA",

"code": "+91"

},

"gps": "20.6838699,77.02622334",

"address": "<ADDRESS>",

"radius": {

"type": "CONSTANT",

"value": "0.4",

"unit": "km"

}

},

"contact": {

"phone": "<MOBILE_NUMBER>",

"email": ""

}

}

]

}

}

}
