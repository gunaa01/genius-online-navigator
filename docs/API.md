# API Documentation

This document provides comprehensive documentation for the Genius Online Navigator API. It covers all available endpoints, request/response formats, authentication, error handling, and rate limiting.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.geniusonlinenavigator.com/api/v1
```

For local development, the base URL is:

```
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. All protected endpoints require a valid JWT token in the Authorization header.

### Authentication Headers

```
Authorization: Bearer <token>
```

### Obtaining a Token

To obtain a token, use the login endpoint:

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Token Refresh

To refresh an expired token:

```
POST /auth/refresh-token
```

Headers:
```
Authorization: Bearer <expired-token>
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request. In case of an error, the response body will contain an error message and additional details when available.

### Error Response Format

```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Error details for specific field"
  }
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - The request was malformed or contains invalid parameters |
| 401 | Unauthorized - Authentication is required or has failed |
| 403 | Forbidden - The authenticated user doesn't have permission |
| 404 | Not Found - The requested resource doesn't exist |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Something went wrong on the server |

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are applied per API key or IP address.

### Rate Limit Headers

The following headers are included in all API responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1619897260
```

- `X-RateLimit-Limit`: The maximum number of requests allowed in the current time window
- `X-RateLimit-Remaining`: The number of requests remaining in the current time window
- `X-RateLimit-Reset`: The time at which the current rate limit window resets (Unix timestamp)

### Rate Limit Exceeded

When the rate limit is exceeded, the API will return a 429 Too Many Requests response:

```json
{
  "status": "error",
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

## API Endpoints

### Authentication

#### Register

```
POST /auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "your-password",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Logout

```
POST /auth/logout
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "status": "success",
  "message": "Successfully logged out"
}
```

#### Get User Profile

```
GET /auth/me
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "id": "1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Update User Profile

```
PUT /auth/profile
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

Response:
```json
{
  "id": "1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Change Password

```
POST /auth/change-password
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "currentPassword": "your-current-password",
  "newPassword": "your-new-password"
}
```

Response:
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

#### Request Password Reset

```
POST /auth/forgot-password
```

Request body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "status": "success",
  "message": "Password reset email sent"
}
```

#### Reset Password

```
POST /auth/reset-password
```

Request body:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "your-new-password"
}
```

Response:
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

### Ad Campaigns

#### Get All Campaigns

```
GET /campaigns
```

Headers:
```
Authorization: Bearer <token>
```

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `status` (optional): Filter by status (active, paused, completed)
- `platform` (optional): Filter by platform
- `search` (optional): Search term for campaign name

Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Summer Sale Campaign",
      "budget": 1000,
      "spent": 250,
      "status": "active",
      "startDate": "2023-06-01T00:00:00Z",
      "endDate": "2023-06-30T00:00:00Z",
      "platforms": ["facebook", "instagram"],
      "objective": "conversions",
      "createdAt": "2023-05-15T00:00:00Z",
      "updatedAt": "2023-05-15T00:00:00Z"
    },
    // More campaigns...
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "page": 1,
    "limit": 10
  }
}
```

#### Get Campaign by ID

```
GET /campaigns/{id}
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "id": "1",
  "name": "Summer Sale Campaign",
  "budget": 1000,
  "spent": 250,
  "status": "active",
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-06-30T00:00:00Z",
  "platforms": ["facebook", "instagram"],
  "objective": "conversions",
  "targeting": {
    "age": [18, 65],
    "gender": ["male", "female"],
    "locations": ["US", "CA"],
    "interests": ["fashion", "shopping"]
  },
  "ads": [
    {
      "id": "101",
      "name": "Summer Sale Ad 1",
      "status": "active",
      "impressions": 10000,
      "clicks": 500,
      "conversions": 50
    }
  ],
  "performance": {
    "impressions": 10000,
    "clicks": 500,
    "conversions": 50,
    "ctr": 5,
    "cpc": 0.5,
    "roas": 3.2
  },
  "createdAt": "2023-05-15T00:00:00Z",
  "updatedAt": "2023-05-15T00:00:00Z"
}
```

#### Create Campaign

```
POST /campaigns
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Summer Sale Campaign",
  "budget": 1000,
  "status": "active",
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-06-30T00:00:00Z",
  "platforms": ["facebook", "instagram"],
  "objective": "conversions",
  "targeting": {
    "age": [18, 65],
    "gender": ["male", "female"],
    "locations": ["US", "CA"],
    "interests": ["fashion", "shopping"]
  }
}
```

Response:
```json
{
  "id": "1",
  "name": "Summer Sale Campaign",
  "budget": 1000,
  "spent": 0,
  "status": "active",
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-06-30T00:00:00Z",
  "platforms": ["facebook", "instagram"],
  "objective": "conversions",
  "targeting": {
    "age": [18, 65],
    "gender": ["male", "female"],
    "locations": ["US", "CA"],
    "interests": ["fashion", "shopping"]
  },
  "createdAt": "2023-05-15T00:00:00Z",
  "updatedAt": "2023-05-15T00:00:00Z"
}
```

#### Update Campaign

```
PUT /campaigns/{id}
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Updated Campaign Name",
  "budget": 1500,
  "status": "paused"
}
```

Response:
```json
{
  "id": "1",
  "name": "Updated Campaign Name",
  "budget": 1500,
  "spent": 250,
  "status": "paused",
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-06-30T00:00:00Z",
  "platforms": ["facebook", "instagram"],
  "objective": "conversions",
  "targeting": {
    "age": [18, 65],
    "gender": ["male", "female"],
    "locations": ["US", "CA"],
    "interests": ["fashion", "shopping"]
  },
  "createdAt": "2023-05-15T00:00:00Z",
  "updatedAt": "2023-05-16T00:00:00Z"
}
```

#### Delete Campaign

```
DELETE /campaigns/{id}
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "status": "success",
  "message": "Campaign deleted successfully"
}
```

### Social Media

#### Get All Social Media Accounts

```
GET /social/accounts
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "data": [
    {
      "id": "1",
      "platform": "facebook",
      "name": "Brand Page",
      "profileUrl": "https://facebook.com/brandpage",
      "profileImage": "https://example.com/profile.jpg",
      "isConnected": true,
      "lastSynced": "2023-05-15T00:00:00Z"
    },
    {
      "id": "2",
      "platform": "instagram",
      "name": "brand_official",
      "profileUrl": "https://instagram.com/brand_official",
      "profileImage": "https://example.com/profile.jpg",
      "isConnected": true,
      "lastSynced": "2023-05-15T00:00:00Z"
    }
  ]
}
```

#### Connect Social Media Account

```
POST /social/accounts/connect
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "platform": "twitter",
  "authCode": "oauth-code-from-platform"
}
```

Response:
```json
{
  "id": "3",
  "platform": "twitter",
  "name": "BrandOfficial",
  "profileUrl": "https://twitter.com/BrandOfficial",
  "profileImage": "https://example.com/profile.jpg",
  "isConnected": true,
  "lastSynced": "2023-05-16T00:00:00Z"
}
```

#### Disconnect Social Media Account

```
POST /social/accounts/{id}/disconnect
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "status": "success",
  "message": "Account disconnected successfully"
}
```

#### Get All Social Media Posts

```
GET /social/posts
```

Headers:
```
Authorization: Bearer <token>
```

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `status` (optional): Filter by status (draft, scheduled, published)
- `platform` (optional): Filter by platform
- `search` (optional): Search term for post content

Response:
```json
{
  "data": [
    {
      "id": "1",
      "content": "Check out our summer sale!",
      "platforms": ["facebook", "instagram"],
      "media": [
        {
          "type": "image",
          "url": "https://example.com/image.jpg"
        }
      ],
      "scheduledDate": "2023-06-01T12:00:00Z",
      "publishedDate": null,
      "status": "scheduled",
      "tags": ["sale", "summer"],
      "createdAt": "2023-05-15T00:00:00Z",
      "updatedAt": "2023-05-15T00:00:00Z"
    },
    // More posts...
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "page": 1,
    "limit": 10
  }
}
```

#### Create Social Media Post

```
POST /social/posts
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "content": "Check out our summer sale!",
  "platforms": ["facebook", "instagram"],
  "media": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ],
  "scheduledDate": "2023-06-01T12:00:00Z",
  "status": "scheduled",
  "tags": ["sale", "summer"]
}
```

Response:
```json
{
  "id": "1",
  "content": "Check out our summer sale!",
  "platforms": ["facebook", "instagram"],
  "media": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ],
  "scheduledDate": "2023-06-01T12:00:00Z",
  "publishedDate": null,
  "status": "scheduled",
  "tags": ["sale", "summer"],
  "createdAt": "2023-05-15T00:00:00Z",
  "updatedAt": "2023-05-15T00:00:00Z"
}
```

### AI Content

#### Get All Content Templates

```
GET /ai/templates
```

Headers:
```
Authorization: Bearer <token>
```

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `type` (optional): Filter by template type (blog, social, ad, email)
- `search` (optional): Search term for template name or description

Response:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Blog Post",
      "description": "Generate a blog post",
      "type": "blog",
      "prompt": "Write a blog post about [topic]",
      "parameters": [
        {
          "name": "topic",
          "type": "string",
          "required": true,
          "description": "The topic of the blog post"
        },
        {
          "name": "tone",
          "type": "string",
          "required": false,
          "description": "The tone of the blog post",
          "options": ["professional", "casual", "humorous"]
        },
        {
          "name": "length",
          "type": "string",
          "required": false,
          "description": "The length of the blog post",
          "options": ["short", "medium", "long"]
        }
      ],
      "createdAt": "2023-05-15T00:00:00Z",
      "updatedAt": "2023-05-15T00:00:00Z"
    },
    // More templates...
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "page": 1,
    "limit": 10
  }
}
```

#### Generate Content

```
POST /ai/generate
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "templateId": "1",
  "parameters": {
    "topic": "Sustainable Fashion",
    "tone": "professional",
    "length": "medium"
  }
}
```

Response:
```json
{
  "id": "101",
  "templateId": "1",
  "content": "# Sustainable Fashion: A Growing Trend\n\nIn recent years, sustainable fashion has emerged as a significant trend in the industry...",
  "parameters": {
    "topic": "Sustainable Fashion",
    "tone": "professional",
    "length": "medium"
  },
  "status": "completed",
  "createdAt": "2023-05-16T00:00:00Z",
  "updatedAt": "2023-05-16T00:00:00Z"
}
```

#### Get Generated Content History

```
GET /ai/history
```

Headers:
```
Authorization: Bearer <token>
```

Query parameters:
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `type` (optional): Filter by content type (blog, social, ad, email)
- `search` (optional): Search term for content

Response:
```json
{
  "data": [
    {
      "id": "101",
      "templateId": "1",
      "content": "# Sustainable Fashion: A Growing Trend\n\nIn recent years, sustainable fashion has emerged as a significant trend in the industry...",
      "parameters": {
        "topic": "Sustainable Fashion",
        "tone": "professional",
        "length": "medium"
      },
      "status": "completed",
      "createdAt": "2023-05-16T00:00:00Z",
      "updatedAt": "2023-05-16T00:00:00Z"
    },
    // More content...
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "page": 1,
    "limit": 10
  }
}
```

### Analytics

#### Get Analytics Overview

```
GET /analytics/overview
```

Headers:
```
Authorization: Bearer <token>
```

Query parameters:
- `startDate` (required): Start date for analytics (YYYY-MM-DD)
- `endDate` (required): End date for analytics (YYYY-MM-DD)
- `compareStartDate` (optional): Start date for comparison period
- `compareEndDate` (optional): End date for comparison period

Response:
```json
{
  "period": {
    "startDate": "2023-05-01",
    "endDate": "2023-05-31"
  },
  "comparison": {
    "startDate": "2023-04-01",
    "endDate": "2023-04-30"
  },
  "metrics": {
    "impressions": {
      "value": 100000,
      "previousValue": 80000,
      "change": 25
    },
    "clicks": {
      "value": 5000,
      "previousValue": 4000,
      "change": 25
    },
    "conversions": {
      "value": 500,
      "previousValue": 400,
      "change": 25
    },
    "revenue": {
      "value": 10000,
      "previousValue": 8000,
      "change": 25
    }
  },
  "channels": {
    "adCampaigns": {
      "impressions": 50000,
      "clicks": 2500,
      "conversions": 250,
      "revenue": 5000
    },
    "socialMedia": {
      "impressions": 30000,
      "clicks": 1500,
      "conversions": 150,
      "revenue": 3000
    },
    "content": {
      "impressions": 20000,
      "clicks": 1000,
      "conversions": 100,
      "revenue": 2000
    }
  }
}
```

#### Get Channel Analytics

```
GET /analytics/channel/{channel}
```

Headers:
```
Authorization: Bearer <token>
```

Path parameters:
- `channel`: Channel to get analytics for (adCampaigns, socialMedia, content)

Query parameters:
- `startDate` (required): Start date for analytics (YYYY-MM-DD)
- `endDate` (required): End date for analytics (YYYY-MM-DD)
- `granularity` (optional): Data granularity (day, week, month)

Response:
```json
{
  "period": {
    "startDate": "2023-05-01",
    "endDate": "2023-05-31"
  },
  "granularity": "day",
  "metrics": {
    "impressions": [
      {
        "date": "2023-05-01",
        "value": 3000
      },
      {
        "date": "2023-05-02",
        "value": 3200
      }
      // More days...
    ],
    "clicks": [
      {
        "date": "2023-05-01",
        "value": 150
      },
      {
        "date": "2023-05-02",
        "value": 160
      }
      // More days...
    ],
    "conversions": [
      {
        "date": "2023-05-01",
        "value": 15
      },
      {
        "date": "2023-05-02",
        "value": 16
      }
      // More days...
    ],
    "revenue": [
      {
        "date": "2023-05-01",
        "value": 300
      },
      {
        "date": "2023-05-02",
        "value": 320
      }
      // More days...
    ]
  }
}
```

## Webhooks

Genius Online Navigator supports webhooks for real-time notifications of events. To use webhooks, you need to register a webhook URL in your account settings.

### Available Events

- `campaign.created`: Triggered when a new campaign is created
- `campaign.updated`: Triggered when a campaign is updated
- `campaign.deleted`: Triggered when a campaign is deleted
- `post.scheduled`: Triggered when a social media post is scheduled
- `post.published`: Triggered when a social media post is published
- `content.generated`: Triggered when AI content is generated

### Webhook Payload

```json
{
  "event": "campaign.created",
  "timestamp": "2023-05-16T00:00:00Z",
  "data": {
    "id": "1",
    "name": "Summer Sale Campaign",
    "status": "active"
  }
}
```

### Webhook Security

To ensure the security of your webhooks, we include a signature in the `X-Signature` header of each webhook request. You should verify this signature to ensure the webhook is coming from Genius Online Navigator.

The signature is generated using HMAC-SHA256 with your webhook secret:

```
X-Signature: sha256=<signature>
```

To verify the signature:

1. Get the webhook secret from your account settings
2. Get the request body as a string
3. Compute the HMAC-SHA256 of the request body using your webhook secret
4. Compare the computed signature with the signature in the `X-Signature` header

## API Versioning

The API is versioned using the URL path. The current version is `v1`. When we make backwards-incompatible changes, we will increment the version number.

## SDK and Client Libraries

We provide official client libraries for the following languages:

- JavaScript/TypeScript: [genius-navigator-js](https://github.com/genius-navigator/genius-navigator-js)
- Python: [genius-navigator-python](https://github.com/genius-navigator/genius-navigator-python)
- PHP: [genius-navigator-php](https://github.com/genius-navigator/genius-navigator-php)

## Support

If you have any questions or need help with the API, please contact our support team at api-support@geniusonlinenavigator.com or visit our [Developer Portal](https://developers.geniusonlinenavigator.com).

---

© 2025 Genius Online Navigator. All rights reserved.
