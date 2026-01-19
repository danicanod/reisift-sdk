# REISift authentication

## Discovery status
✅ **CONFIRMED** - Authentication flow reverse engineered from HAR capture

## Base URLs
| Service | URL |
|---------|-----|
| Main API | `https://apiv2.reisift.io` |
| Notifications | `https://notifications.reisift.io` |
| Web App | `https://app.reisift.io` |

## Authentication method
**JWT (JSON Web Tokens)** with RS512 signing algorithm

## Login flow

### Request
```http
POST https://apiv2.reisift.io/api/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "remember": true,
  "agree": true
}
```

### Response
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9..."
}
```

### JWT payload structure
```json
{
  "token_type": "access",
  "exp": 1768761056,
  "iat": 1768501856,
  "jti": "unique-token-id",
  "user_id": "uuid",
  "account": "account-uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "feature_flags": ["sift_map_pro", "dataflik_source"],
  "aud": "reisift",
  "iss": "reisift"
}
```

## Token refresh

### Request
```http
POST https://apiv2.reisift.io/api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9..."
}
```

### Response
```json
{
  "access": "new-access-token..."
}
```

## Request headers
All authenticated requests require:

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {access_token}` | Yes |
| `Content-Type` | `application/json` | Yes (for POST/PUT) |
| `x-reisift-ui-version` | `2022.02.01.7` | Recommended |

## Token expiration
- **Access token**: ~15-30 minutes (based on `exp` claim)
- **Refresh token**: ~3 days (72 hours)

## Notes
- The `remember` flag in login appears to extend refresh token lifetime
- The `agree` flag is for terms of service acceptance
- Feature flags in JWT control access to premium features
- Account UUID in JWT can be used for multi-tenant operations
