# SpicePop API Documentation

## Authentication

### POST /api/auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "isAdmin": "boolean"
}
```

### GET /api/auth/check
Check current authentication status.

**Response:**
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "isAdmin": "boolean"
}
```

## Categories

### GET /api/categories
Get all categories.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "description": "string"
  }
]
```

### GET /api/categories/:slug
Get category by slug.

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "description": "string"
}
```

## Products

### GET /api/products
Get all products.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "description": "string",
    "price": "number",
    "categoryId": "uuid"
  }
]
```

### GET /api/products/:slug
Get product by slug.

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "description": "string",
  "price": "number",
  "categoryId": "uuid"
}
```

### GET /api/categories/:categoryId/products
Get products by category.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "slug": "string",
    "description": "string",
    "price": "number",
    "categoryId": "uuid"
  }
]
```

## Blog Posts

### GET /api/blog
Get all published blog posts.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "slug": "string",
    "content": "string",
    "published": "boolean",
    "authorId": "uuid"
  }
]
```

### GET /api/blog/:slug
Get blog post by slug.

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "slug": "string",
  "content": "string",
  "published": "boolean",
  "authorId": "uuid"
}
```

## Settings

### GET /api/settings
Get all settings.

**Response:**
```json
[
  {
    "key": "string",
    "value": "string"
  }
]
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error",
  "error": "Detailed error message (only in development)"
}
``` 