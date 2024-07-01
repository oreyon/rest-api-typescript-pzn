# Address API Spec

## Create Address

**Endpoint:** `POST /api/v1/contact/:idContact/addresses`

**Request Header:**

- `X-API-TOKEN`: token

**Request Body:**

```json
{
  "street": "Jalan Apa",
  "city": "Kota Apa",
  "province": "Provinsi Apa",
  "country": "Negara Apa",
  "postalCode": "321720"
}
```

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Address created successfully",
  "data": {
    "id": "1",
    "street": "Jalan Apa",
    "city": "Kota Apa",
    "province": "Provinsi Apa",
    "country": "Negara Apa",
    "postalCode": "321720"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Invalid input data",
  "errors": "Postal code must be numeric"
}
```

## Get Address

**Endpoint:** `GET /api/v1/contact/:idContact/addresses/:id`

**Request Header:**

- `X-API-TOKEN`: token

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Address retrieved successfully",
  "data": {
    "id": "1",
    "street": "Jalan Apa",
    "city": "Kota Apa",
    "province": "Provinsi Apa",
    "country": "Negara Apa",
    "postalCode": "321720"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "404",
  "status": "Not Found",
  "message": "Address not found",
  "errors": "No address found with the given id"
}
```

## Update Address

**Endpoint:** `PUT /api/v1/contact/:idContact/addresses/:id`

**Request Header:**

- `X-API-TOKEN`: token

**Request Body:**

```json
{
  "street": "New Street", // Optional
  "city": "New City", // Optional
  "province": "New Province", // Optional
  "country": "New Country", // Optional
  "postalCode": "123456" // Optional
}
```

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Address updated successfully",
  "data": {
    "id": "1",
    "street": "New Street",
    "city": "New City",
    "province": "New Province",
    "country": "New Country",
    "postalCode": "123456"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Invalid input data",
  "errors": "Postal code must be numeric"
}
```

## Remove Address

**Endpoint:** `DELETE /api/v1/contact/:idContact/addresses/:id`

**Request Header:**

- `X-API-TOKEN`: token

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Address deleted successfully"
}
```

**Response Body (Failed):**

```json
{
  "code": "404",
  "status": "Not Found",
  "message": "Address not found",
  "errors": "No address found with the given id"
}
```

## List Addresses

**Endpoint:** `GET /api/v1/contact/:idContact/addresses`

**Request Header:**

- `X-API-TOKEN`: token

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "id": "1",
      "street": "Jalan Apa",
      "city": "Kota Apa",
      "province": "Provinsi Apa",
      "country": "Negara Apa",
      "postalCode": "321720"
    },
    {
      "id": "2",
      "street": "Another Street",
      "city": "Another City",
      "province": "Another Province",
      "country": "Another Country",
      "postalCode": "654321"
    }
  ]
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Failed to retrieve addresses",
  "errors": "Invalid contact id"
}
```
