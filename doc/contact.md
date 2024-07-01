# Contact API Spec

## Create Contact

**Endpoint:** `POST /api/v1/contacts`

**Request Header:**
`X-API=TOKEN` : `token`

**Request Body:**

```json
{
  "firstName": "Oreyon",
  "lastName": "Atayon",
  "email": "john.doe@example.com",
  "phone": "123-456-7890"
}
```

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Contact created successfully",
  "data": {
    "id": "1",
    "firstName": "Oreyon",
    "lastName": "Atayon",
    "email": "john.doe@example.com",
    "phone": "123-456-7890"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Invalid input data",
  "errors": "Email is required"
}
```

## Get Contact

**Endpoint:** `GET /api/v1/contacts/:id`

**Request Header:**
`X-API=TOKEN` : `token`

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Contact retrieved successfully",
  "data": {
    "id": "1",
    "firstName": "Oreyon",
    "lastName": "Atayon",,
    "email": "john.doe@example.com",
    "phone": "123-456-7890"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "404",
  "status": "Not Found",
  "message": "Contact not found",
  "errors": "No contact found with the given id"
}
```

## Update Contact

**Endpoint:** `PUT /api/v1/contacts/:id`

**Request Header:**
`X-API=TOKEN` : `token`

**Request Body:**

```json
{
  "firstName": "Oreyon",
  "lastName": "Atayon",
  "email": "john.smith@example.com", // Optional
  "phone": "098-765-4321" // Optional
}
```

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Contact updated successfully",
  "data": {
    "id": "1",
    "firstName": "Oreyon",
    "lastName": "Atayon",
    "email": "john.smith@example.com",
    "phone": "098-765-4321"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Invalid input data",
  "errors": "Email must be a valid email address"
}
```

## Remove Contact

**Endpoint:** `DELETE /api/v1/contacts/:id`

**Request Header:**
`X-API=TOKEN` : `token`

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Contact deleted successfully"
}
```

**Response Body (Failed):**

```json
{
  "code": "404",
  "status": "Not Found",
  "message": "Contact not found",
  "errors": "No contact found with the given id"
}
```

## Search Contact

**Endpoint:** `GET /api/v1/contacts/search`

**Request Header:**
`X-API=TOKEN` : `token`

**Request Parameters:**

- `name`: string (optional)
- `email`: string (optional)
- `phone`: string (optional)
- `page`: number, default 1
- `size`: number, default 10

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Contacts retrieved successfully",
  "data": [
    {
      "id": "1",
      "firstName": "Oreyon",
      "lastName": "Atayon",
      "email": "john.doe@example.com",
      "phone": "123-456-7890"
    },
    {
      "id": "2",
      "firstName": "Eloler",
      "lastName": "Atayon",
      "email": "jane.smith@example.com",
      "phone": "987-654-3210"
    }
  ],
  "paging": {
    "currentPage":1,
    "totalPage":10,
    "size":10
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Invalid query parameters",
  "errors": "At least one search parameter must be provided"
}
```
