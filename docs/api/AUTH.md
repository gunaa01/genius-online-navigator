# Authentication API

## POST /api/auth

Authenticates a user and returns JWT tokens

### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Responses

**Success (200 OK)**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Error (400 Bad Request)**
```json
{
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

**Authentication Error (401 Unauthorized)**
```json
{
  "error": "Invalid credentials"
}
```

**Server Error (500 Internal Server Error)**
```json
{
  "error": "Authentication failed"
}
```

### Requirements
- Email must be valid format
- Password must be at least 8 characters
