**UHI-JanAushaduKendra (PMBI) integration**

**Search requests**

In all below search request we will use descriptor as JANAUSHADHI i.e., JANAUSHADHI in item object

1. **Search by Jan Aushadhi Kendra Code**

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

"category": {

"descriptor": {

"code": "Jan Aushadhi Kendra Code",

"name": "Jan Aushadhi Kendra Code"

}

},

"fulfillment": {

"type": "JANAUSHADHI",

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

"code": "JANAUSHADHI",

"name": "JANAUSHADHI"

}

}

}

}

}

1. **Search by State and District**

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

"type": "JANAUSHADHI",

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

"code": "JANAUSHADHI",

"name": "JANAUSHADHI"

}

},

"location": {

"district": {

"code": “466”,

"name": "Ahmednagar"

},

"state": {

"code": “27”,

"name": "Maharashtra"

}

}

}

}

}

1. **Search by PIN Code**

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

"type": "JANAUSHADHI",

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

"code": "JANAUSHADHI",

"name": "JANAUSHADHI"

}

},

"address": {

"area\_code": "413736"

}

}

}

}

1. **Search by GPS Location**

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

"type": "JANAUSHADHI",

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

"code": "JANAUSHADHI",

"name": "JANAUSHADHI"

}

},

"location": {

"gps": "19.7126974,74.4833288",

"radius": {

"type": "CONSTANT",

"value": "5",

"unit": "km"

}

}

}

}

}

1. **Search by all custom filters i.e. State, District, Pin code**

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

"type": "JANAUSHADHI",

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

"code": "JANAUSHADHI",

"name": "JANAUSHADHI"

}

},

"location": {

"district": {

"code": “466”,

"name": "Ahmednagar"

},

"state": {

"code": “27”,

"name": "Maharashtra"

},

},

"address": {

"area\_code": "413736"

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

"radius": {

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
