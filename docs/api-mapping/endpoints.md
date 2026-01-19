# REISift API endpoints

> Base URL: `https://apiv2.reisift.io`
> 
> Last updated: 2026-01-19

## Legend

| Status | Meaning |
|--------|---------|
| ✅ | Implemented in SDK |
| 📋 | Discovered (not yet implemented) |

## Source files

- Raw extraction: [extracted-endpoints.md](./extracted-endpoints.md)
- Structured data: [endpoints.json](./endpoints.json)
- SDK interface: [src/external/api/client.interface.ts](../../src/external/api/client.interface.ts)
- SDK implementation: [src/infrastructure/services/reisift-client.ts](../../src/infrastructure/services/reisift-client.ts)

---

## Authentication

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| ✅ | `POST` | `/api/token/` | Login with email/password | `authenticate()` |
| ✅ | `POST` | `/api/token/refresh/` | Refresh access token | (internal) |

## Dashboard

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| ✅ | `GET` | `/api/internal/dashboard/` | Dashboard overview | `getDashboard()` |
| ✅ | `GET` | `/api/internal/dashboard/general/` | General dashboard stats | `getDashboardGeneral()` |
| 📋 | `GET` | `/api/internal/dashboard-report/{uuid}/` | Dashboard report by ID | - |

## Properties

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| ✅ | `POST` | `/api/internal/property/` | Search/list properties | `searchProperties()` |
| ✅ | `GET` | `/api/internal/property/{uuid}/` | Get single property | `getPropertyById()` |
| ✅ | `GET` | `/api/internal/property/{uuid}/image/` | Get property images | `getPropertyImages()` |
| ✅ | `GET` | `/api/internal/property/{uuid}/offer/` | Get property offers | `getPropertyOffers()` |
| 📋 | `POST` | `/api/internal/property/{uuid}/next/` | Get next property | - |
| 📋 | `POST` | `/api/internal/property/{uuid}/prev/` | Get previous property | - |
| 📋 | `GET` | `/api/internal/property/{uuid}/deal/` | Get property deal | - |
| 📋 | `GET` | `/api/internal/properties/status/` | Get status options | - |
| 📋 | `GET` | `/api/internal/custom-fields/` | Get custom fields | - |

### Property search query structure
```json
{
  "limit": 10,
  "offset": 0,
  "ordering": "-list_count",
  "query": {
    "must": {
      "property_type": "clean"
    }
  }
}
```

Note: Uses `x-http-method-override: GET` header with POST request.

## User & account

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/user/` | Get current user info | - |
| 📋 | `GET` | `/api/internal/account/user/` | List account users | - |

## Owners

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/owner/{uuid}/sms/` | Get owner SMS messages | - |
| 📋 | `GET` | `/api/internal/owner/{uuid}/sms/phone/` | Get owner SMS phone info | - |

## Lists

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/list/` | Get all lists | - |

## Campaigns

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/drip-campaigns/` | Get drip campaigns | - |
| 📋 | `GET` | `/api/internal/drip-campaign-history/by-property/` | Campaign history | - |
| 📋 | `GET` | `/campaigns/` | Get campaigns by property | - |

## Tasks

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/task/` | Get tasks | - |

## Integrations

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/integration/` | Get integrations | - |
| 📋 | `GET` | `/api/internal/email-integration/` | Get email integrations | - |
| 📋 | `GET` | `/api/internal/phone/type/` | Get phone types | - |

## Siftline (activity feed)

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/siftline/property/{uuid}/card/` | Activity cards | - |

## Filter presets

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/api/internal/filter-preset/` | Saved filter presets | - |

## Notifications

> Base URL: `https://notifications.reisift.io`

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| 📋 | `GET` | `/notification/unread_count/` | Unread notification count | - |

---

## Common query parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `offset` | Pagination offset | `0` |
| `limit` | Page size | `10`, `999`, `5000` |
| `ordering` | Sort field (prefix `-` for desc) | `-created`, `title` |

## Endpoints to explore

- [ ] `POST /api/internal/property/` - Create property
- [ ] `PATCH /api/internal/property/{uuid}/` - Update property
- [ ] `DELETE /api/internal/property/{uuid}/` - Delete property
- [ ] `POST /api/internal/list/` - Create list
- [ ] `POST /api/internal/owner/` - Create owner
- [ ] `POST /api/internal/task/` - Create task
- [ ] Import/Export endpoints
- [ ] Bulk operations
