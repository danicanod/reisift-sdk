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
| ✅ | `POST` | `/api/internal/property/` | Create new property | `createProperty()` |
| ✅ | `GET` | `/api/internal/property/{uuid}/` | Get single property | `getPropertyByUuid()` |
| ✅ | `GET` | `/api/internal/property/{uuid}/image/` | Get property images | `getPropertyImages()` |
| ✅ | `GET` | `/api/internal/property/{uuid}/offer/` | Get property offers | `getPropertyOffers()` |
| ✅ | `POST` | `/api/internal/property/address-info-from-map-id/` | Get property info by map ID | `getAddressInfoByMapId()` |
| ✅ | - | - | Ensure property exists by map ID | `ensurePropertyByMapId()` |
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

### Create property request structure
```json
{
  "address": {
    "street": "191 MAIN ST UNIT 3",
    "city": "NEW CANAAN",
    "state": "CT",
    "postal_code": "06840-5641"
  },
  "assigned_to": "uuid-of-user",
  "status": "Working On It",
  "lists": ["Mortgage Auctions"],
  "tags": ["Courthouse", "Mortgage Auctions 01/2026"],
  "notes": "Optional notes",
  "owner": {
    "first_name": "John",
    "last_name": "Doe",
    "company": null,
    "address": { ... }
  }
}
```

### ensurePropertyByMapId workflow

The `ensurePropertyByMapId(mapId, options?)` helper implements:

1. Call `getAddressInfoByMapId(mapId)` to check if property exists
2. If `saved_property_uuid` is returned, fetch and return the existing property
3. Otherwise, create a new property using the normalized address (and optionally owner) from the lookup

```typescript
// Example usage
const results = await client.searchAutocomplete("328 Main St, New Canaan, CT");
const mapId = results[0].id;

// Get existing or create new property
const property = await client.ensurePropertyByMapId(mapId, {
  assigned_to: "user-uuid",
  status: "New Lead",
  lists: ["My List"],
  tags: ["Tag1"],
});
```

## User & account

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| ✅ | `GET` | `/api/internal/user/` | Get current user info | `getCurrentUser()` |
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

## Map / Geocoding

> Base URL: `https://map.reisift.io`

| Status | Method | Endpoint | Description | SDK method |
|--------|--------|----------|-------------|------------|
| ✅ | `POST` | `/properties/search-autocomplete/` | Address autocomplete search | `searchAutocomplete()` |

### Search autocomplete request
```json
{
  "search": "70 Arvida Road, Wolcott, CT"
}
```

Returns an array of matching addresses with map IDs that can be used with `getAddressInfoByMapId()`.

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

- [x] `POST /api/internal/property/` - Create property (`createProperty()`)
- [ ] `PATCH /api/internal/property/{uuid}/` - Update property
- [ ] `DELETE /api/internal/property/{uuid}/` - Delete property
- [ ] `POST /api/internal/list/` - Create list
- [ ] `POST /api/internal/owner/` - Create owner
- [ ] `POST /api/internal/task/` - Create task
- [ ] Import/Export endpoints
- [ ] Bulk operations
