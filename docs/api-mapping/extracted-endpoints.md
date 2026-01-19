# REISift API Endpoints - Extracted from HAR

> Generated: 2026-01-19T12:57:40.442Z

> Total unique endpoints: 8

## /notification/unread_count

### `GET /notification/unread_count/`

- **Status:** 200
- **Content-Type:** application/json
- **Headers:**
```json
{
  "x-reisift-ui-version": "2022.02.01.7"
}
```

---

## /properties/search-autocomplete

### `POST /properties/search-autocomplete/`

- **Status:** 200
- **Content-Type:** application/json
- **Headers:**
```json
{
  "content-type": "application/json",
  "x-reisift-ui-version": "2022.02.01.7"
}
```
- **Request Body:**
```json
{
  "search": "\"70 Arvida Road, Wolcott, CT\""
}
```

---

### `OPTIONS /properties/search-autocomplete/`

- **Status:** 200
- **Content-Type:** text/html

---

## /checkNPSShow

### `GET /checkNPSShow`

- **Status:** 200
- **Content-Type:** application/json
- **Query Params:**
```json
{
  "url": "https://app.reisift.io/records/properties",
  "productId": "rEziIThj32080",
  "userId": "1752b70e-44e9-4491-b1e5-4b24f10055c6",
  "customUserId": "1991b808-59aa-4efa-8723-b75d0427a9b5",
  "email": "danicanod@gmail.com",
  "createdAt": "1739296826430",
  "multiUser": "true",
  "mobile": "false"
}
```

---

## /npsWidget

### `GET /npsWidget`

- **Status:** 200
- **Content-Type:** text/html
- **Query Params:**
```json
{
  "productId": "rEziIThj32080",
  "userId": "1752b70e-44e9-4491-b1e5-4b24f10055c6",
  "customUserId": "1991b808-59aa-4efa-8723-b75d0427a9b5",
  "lastname": "Sánchez",
  "firstname": "Daniel",
  "email": "danicanod@gmail.com",
  "multiUser": "true",
  "url": "https://app.reisift.io/records/properties"
}
```

---

## /g/collect

### `POST /g/collect`

- **Status:** 204
- **Content-Type:** text/plain
- **Query Params:**
```json
{
  "v": "2",
  "tid": "G-SBWFSZ23T2",
  "gtm": "45je61e1v9126262676za20gzb812229068zd812229068",
  "_p": "1768827260687",
  "gcd": "13l3l3l3l1l1",
  "npa": "0",
  "dma": "0",
  "cid": "1049864667.1762534482",
  "ul": "es-us",
  "sr": "1728x1117",
  "ir": "1",
  "uaa": "arm",
  "uab": "64",
  "uafvl": "Google%20Chrome;143.0.7499.194|Chromium;143.0.7499.194|Not%20A(Brand;24.0.0.0",
  "uamb": "0",
  "uam": "",
  "uap": "macOS",
  "uapv": "26.3.0",
  "uaw": "0",
  "are": "1",
  "frm": "0",
  "pscdl": "noapi",
  "_eu": "EEEAAGQ",
  "_s": "4",
  "tag_exp": "103116026~103200004~104527906~104528501~104684208~104684211~105391252~115495939~115938466~115938468~115985661~116744866~117041587",
  "sid": "1768827255",
  "sct": "132",
  "seg": "1",
  "dl": "https://app.reisift.io/records/properties",
  "dr": "https://www.reisift.io/",
  "dt": "Records - REISift",
  "en": "form_start",
  "ep.form_id": "add-property__property-address",
  "ep.form_name": "",
  "ep.form_destination": "https://app.reisift.io/records/properties",
  "epn.form_length": "5",
  "ep.first_field_id": "",
  "ep.first_field_name": "",
  "ep.first_field_type": "text",
  "epn.first_field_position": "1",
  "_et": "22639",
  "tfd": "55794"
}
```
- **Headers:**
```json
{
  "x-browser-channel": "stable",
  "x-browser-copyright": "Copyright 2026 Google LLC. All Rights reserved.",
  "x-browser-validation": "AUXUCdutEJ+6gl6bYtz7E2kgIT4=",
  "x-browser-year": "2026",
  "x-client-data": "CJS2yQEIpbbJAQipncoBCJz+ygEIlKHLAQiGoM0BCJSkzwE="
}
```

---

## /api/internal

### `OPTIONS /api/internal/property/address-info-from-map-id/`

- **Status:** 200
- **Content-Type:** text/html

---

### `POST /api/internal/property/address-info-from-map-id/`

- **Status:** 200
- **Content-Type:** application/json
- **Headers:**
```json
{
  "content-type": "application/json",
  "x-reisift-ui-version": "2022.02.01.7"
}
```
- **Request Body:**
```json
{
  "map_id": "26000041"
}
```

---

