# User API Spec

## Register User

**Endpoint:**
`POST /api/v1/users/register`

**Request Body:**

```json
{
 "username": "Oreyon",
 "password": "secret",
 "name": "Oreyon Atayon"
}
```

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Registration Success",
  "data": {
    "username": "Oreyon",
    "name": "Oreyon Atayon"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Data input is not as desired",
  "errors": "Username must not be blank"
}
```

## Login User

**Endpoint:** `POST /api/v1/users/login`

**Request Body:**

```json
{
 "username": "Oreyon",
 "password": "secret"
}
```

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Login Success",
  "data": {
    "username": "Oreyon",
    "name": "Oreyon Atayon",
    "token": "uuid"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Failed to request data",
  "errors": "Username or password wrong"
}
```

## Get User

**Endpoint:** `GET /api/v1/users/current`

**Request Header:**

- `X-API-TOKEN`: token

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Success request data",
  "data": {
    "username": "Oreyon",
    "name": "Oreyon Atayon"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "400",
  "status": "Bad Request",
  "message": "Failed to request data",
  "errors": "Token is invalid"
}
```

## Update User

**Endpoint:** `PATCH /api/v1/users/current`

**Request Header:**

- `X-API-TOKEN`: token

**Request Body:**

```json
{
 "name": "Oreyon", // Optional
 "password": "new_secret" // Optional
}
```

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Update Success",
  "data": {
    "username": "Oreyon",
    "name": "Oreyon Atayon"
  }
}
```

**Response Body (Failed):**

```json
{
  "code": "403",
  "status": "Unauthorized",
  "message": "You have no access to this request",
  "errors": "Failed to access request"
}
```

## Logout User

**Endpoint:** `DELETE /api/v1/users/current`

**Request Header:**

- `X-API-TOKEN`: token

**Response Body (Success):**

```json
{
  "code": "200",
  "status": "Success",
  "message": "Logout Success"
}
```

**Response Body (Failed):**

```json
{
  "code": "403",
  "status": "Unauthorized",
  "message": "You have no access to this request",
  "errors": "Failed to access request"
}
```
