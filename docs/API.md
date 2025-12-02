# API Documentation

Backend API documentation for Toomas633's Dungeon.

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Response Format](#response-format)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Send Email](#send-email)
- [Error Codes](#error-codes)
- [Examples](#examples)

---

## Base URL

### Development
```
http://localhost:3000
```

### Production
```
https://yourdomain.com/api
```

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible but protected by rate limiting.

---

## Rate Limiting

Rate limiting is applied per IP address to prevent abuse.

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/send-email` | 10 requests | 15 minutes |
| Other endpoints | Unlimited | N/A |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1638360000
```

**Rate Limit Exceeded Response**:
```json
{
  "error": "Too many requests, please try again later."
}
```
HTTP Status: `429 Too Many Requests`

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Health Response

```json
{
  "status": "healthy",
  "timestamp": "2025-12-02T12:00:00.000Z",
  "email": {
    "status": "connected",
    "responseTime": "150ms"
  }
}
```

---

## Endpoints

### Health Check

Check the health status of the API and email service.

**Endpoint**: `GET /health`

**Description**: Returns the current health status of the application, including email service connectivity.

**Request**:
```http
GET /health HTTP/1.1
Host: localhost:3000
```

**Response**:

*Status Code*: `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2025-12-02T12:00:00.000Z",
  "email": {
    "status": "connected",
    "responseTime": "150ms"
  }
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Overall health status (`"healthy"` or `"unhealthy"`) |
| `timestamp` | string | ISO 8601 timestamp of the health check |
| `email.status` | string | Email service status (`"connected"` or `"disconnected"`) |
| `email.responseTime` | string | Time taken to verify email connection (e.g., `"150ms"`) |

**Error Response**:

*Status Code*: `500 Internal Server Error`

```json
{
  "status": "unhealthy",
  "timestamp": "2025-12-02T12:00:00.000Z",
  "email": {
    "status": "disconnected",
    "error": "Connection timeout"
  }
}
```

**Example**:

```bash
curl http://localhost:3000/health
```

---

### Send Email

Send a contact form email via the backend SMTP service.

**Endpoint**: `POST /send-email`

**Description**: Sends an email from the contact form to the configured recipient. Rate limited to prevent spam.

**Request**:

```http
POST /send-email HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Origin: http://localhost:5173

{
  "from": "user@example.com",
  "message": "Hello, I would like to inquire about...",
  "project": "General Inquiry"
}
```

**Request Headers**:

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `Origin` | Yes | Must be in ALLOWED_ORIGINS (CORS) |

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | string | Yes | Sender's email address |
| `message` | string | Yes | Email message content |
| `project` | string | Yes | Email subject/project name |

**Validation Rules**:

- `from`: Must be a valid email address
- `message`: Cannot be empty, max 5000 characters
- `project`: Cannot be empty, max 200 characters

**Success Response**:

*Status Code*: `200 OK`

```json
{
  "success": true,
  "info": {
    "accepted": ["recipient@domain.com"],
    "rejected": [],
    "response": "250 Message accepted",
    "messageId": "<abc123@domain.com>"
  }
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the email was sent successfully |
| `info` | object | Nodemailer response information |
| `info.accepted` | array | List of accepted recipient addresses |
| `info.rejected` | array | List of rejected recipient addresses |
| `info.response` | string | SMTP server response |
| `info.messageId` | string | Unique message identifier |

**Error Responses**:

**400 Bad Request** - Invalid input:
```json
{
  "success": false,
  "message": "Missing required fields: from, message, project"
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "error": "Too many requests, please try again later."
}
```

**500 Internal Server Error** - Email service error:
```json
{
  "success": false,
  "message": "Error sending email",
  "error": "SMTP connection failed: Authentication failed"
}
```

**Example**:

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "from": "john@example.com",
    "message": "I am interested in your project. Please contact me.",
    "project": "Project Inquiry"
  }'
```

**JavaScript Example**:

```javascript
const response = await fetch('http://localhost:3000/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'user@example.com',
    message: 'Hello, I would like to inquire about...',
    project: 'General Inquiry'
  })
})

const data = await response.json()

if (data.success) {
  console.log('Email sent successfully!')
} else {
  console.error('Email failed:', data.message)
}
```

**Vue/Axios Example**:

```typescript
import axios from 'axios'

interface EmailPayload {
  from: string
  message: string
  project: string
}

interface EmailResponse {
  success: boolean
  info?: any
  message?: string
  error?: string
}

async function sendEmail(payload: EmailPayload): Promise<EmailResponse> {
  try {
    const response = await axios.post<EmailResponse>(
      `${import.meta.env.VITE_API_URL}/send-email`,
      payload
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data
    }
    throw error
  }
}

// Usage
const result = await sendEmail({
  from: 'user@example.com',
  message: 'Your message here',
  project: 'Contact Form'
})

if (result.success) {
  console.log('Email sent!')
} else {
  console.error('Failed:', result.message)
}
```

---

## Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request body or missing required fields |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error (email service failure, etc.) |
| 503 | Service Unavailable | Service temporarily unavailable |

**Common Error Scenarios**:

### 400 Bad Request
- Missing required fields (`from`, `message`, or `project`)
- Invalid email address format
- Message or project exceeds maximum length

### 429 Too Many Requests
- More than 10 email requests in 15 minutes from same IP
- Solution: Wait for rate limit window to reset

### 500 Internal Server Error
- SMTP server connection failure
- SMTP authentication failure
- Email sending timeout
- Invalid SMTP configuration

---

## Examples

### Complete Request/Response Cycle

**Request**:
```http
POST /send-email HTTP/1.1
Host: api.toomas633.com
Content-Type: application/json
Origin: https://toomas633.com
User-Agent: Mozilla/5.0

{
  "from": "alice@example.com",
  "message": "Hi! I noticed your portfolio and would love to discuss a potential collaboration. Could we schedule a call?",
  "project": "Collaboration Opportunity"
}
```

**Successful Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: https://toomas633.com
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1701518400

{
  "success": true,
  "info": {
    "accepted": ["contact@toomas633.com"],
    "rejected": [],
    "response": "250 2.0.0 OK  1701517500 example123",
    "messageId": "<abc123def456@gmail.com>"
  }
}
```

### Testing with Different Tools

**curl**:
```bash
# Health check
curl http://localhost:3000/health

# Send email
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d @- <<EOF
{
  "from": "test@example.com",
  "message": "Test message",
  "project": "Testing"
}
EOF
```

**PowerShell**:
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3000/health"

# Send email
$body = @{
    from = "test@example.com"
    message = "Test message from PowerShell"
    project = "Testing"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/send-email" `
  -ContentType "application/json" `
  -Headers @{"Origin"="http://localhost:5173"} `
  -Body $body
```

**Postman**:
1. Create new POST request to `http://localhost:3000/send-email`
2. Set Headers:
   - `Content-Type`: `application/json`
   - `Origin`: `http://localhost:5173`
3. Set Body (raw JSON):
   ```json
   {
     "from": "test@example.com",
     "message": "Test message",
     "project": "Testing"
   }
   ```
4. Send request

---

## CORS Configuration

The API enforces CORS restrictions to prevent unauthorized access.

**Allowed Origins**: Configured via `ALLOWED_ORIGINS` environment variable

**Allowed Methods**: `GET`, `POST`, `OPTIONS`

**Allowed Headers**: `Content-Type`, `Authorization`

**Example CORS Headers**:
```http
Access-Control-Allow-Origin: https://toomas633.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

If you receive a CORS error, ensure your request's `Origin` header matches one of the allowed origins in the backend configuration.

---

## Security Considerations

1. **Rate Limiting**: Prevents spam and abuse
2. **CORS**: Restricts access to allowed origins only
3. **Input Validation**: All inputs are validated and sanitized
4. **SMTP Security**: Uses TLS encryption for email transmission
5. **No Data Storage**: Email data is not stored on the server
6. **Error Messages**: Generic error messages to prevent information leakage

---

## Changelog

### v2.0.2 (Current)
- Email service with Nodemailer 7.0.11
- Rate limiting with express-rate-limit 8.2.1
- CORS protection with cors 2.8.5
- Health check endpoint with email verification

---

## Support

For API issues or questions:
- **GitHub Issues**: [https://github.com/Toomas633/homepage/issues](https://github.com/Toomas633/homepage/issues)
- **Email**: info@toomas633.com
- **Documentation**: [README.md](../README.md)

---

**Last Updated**: December 2, 2025  
**API Version**: 2.0.2
