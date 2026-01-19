# @reisift/sdk

A TypeScript SDK for the REISift API.

## Installation

```bash
npm install @reisift/sdk
```

## Quick Start

```typescript
import { ReisiftClient } from '@reisift/sdk';

// Create the client
const client = new ReisiftClient();

// Authenticate (requires environment variables or config)
await client.authenticate();

// Use the client to interact with the API
const user = await client.getCurrentUser();
console.log('Authenticated as:', user.email);

const properties = await client.searchProperties({ limit: 10 });
console.log('Found', properties.count, 'properties');
```

## Authentication

The SDK supports two authentication methods:

### 1. API Key (recommended for scripts/automation)

Use a long-lived API key as a Bearer token. The SDK validates it by calling the user endpoint.

```typescript
const client = new ReisiftClient({
  apiKey: 'your_api_key',
});
await client.authenticate();
```

Or via environment variable:

```bash
REISIFT_API_KEY=your_api_key
```

### 2. Email/Password (JWT login)

Uses the standard login flow with automatic token refresh.

```typescript
const client = new ReisiftClient({
  email: 'you@example.com',
  password: 'your_password',
});
await client.authenticate();
```

Or via environment variables:

```bash
REISIFT_EMAIL=you@example.com
REISIFT_PASSWORD=your_password
```

### Auth Precedence

When calling `authenticate()`, the SDK checks credentials in this order:

1. **API key**: `config.apiKey` or `REISIFT_API_KEY` env var
2. **Email/password**: `config.email`/`config.password` or `REISIFT_EMAIL`/`REISIFT_PASSWORD` env vars

If an API key is provided, email/password is ignored.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REISIFT_API_KEY` | Long-lived API key (takes priority) |
| `REISIFT_EMAIL` | Email for login authentication |
| `REISIFT_PASSWORD` | Password for login authentication |
| `REISIFT_BASE_URL` | API base URL (default: `https://apiv2.reisift.io`) |
| `LOG_LEVEL` | Logging level: `debug`, `info`, `warn`, `error` (default: `info`) |

## Configuration

Full configuration options:

```typescript
const client = new ReisiftClient({
  // API key auth (takes priority if set)
  apiKey: 'your_api_key',

  // Email/password auth (used if no API key)
  email: 'you@example.com',
  password: 'your_password',

  // Optional: override base URL
  baseUrl: 'https://apiv2.reisift.io',
});
```

## API Reference

### ReisiftClient

The main client for interacting with the REISift API.

#### Methods

| Method | Description |
|--------|-------------|
| `authenticate()` | Authenticate with the API (API key or email/password) |
| `getCurrentUser()` | Get the current authenticated user |
| `getDashboard()` | Get dashboard data |
| `getDashboardGeneral()` | Get general dashboard statistics |
| `searchProperties(request?)` | Search for properties |
| `getPropertyById(uuid)` | Get a property by UUID |
| `getPropertyImages(uuid)` | Get images for a property |
| `getPropertyOffers(uuid)` | Get offers for a property |
| `searchAutocomplete(search)` | Search for addresses (uses map.reisift.io) |
| `getAddressInfoFromMapId(mapId)` | Get address info from a map ID |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isAuthenticated` | `boolean` | Whether the client is authenticated |

## Types

The SDK exports TypeScript types for all API operations:

```typescript
import type {
  ReisiftClientInterface,
  ReisiftClientConfig,
  UserResponse,
  Property,
  PropertyAddress,
  PropertyOwner,
  PropertySearchRequest,
  PropertySearchResponse,
  PropertyImage,
  PropertyImagesResponse,
  PropertyOffer,
  PropertyOffersResponse,
  DashboardResponse,
  DashboardGeneralResponse,
  SearchAutocompleteResult,
  SearchAutocompleteResponse,
  AddressInfoFromMapIdResponse,
  ApiError,
  Pagination,
  PaginatedResponse,
} from '@reisift/sdk';
```

## Development

### Building

```bash
npm install
npm run build
```

### Type Checking

```bash
npm run build:check
```

### Smoke Test

Run the smoke test to verify the SDK works with your credentials:

```bash
# With API key
REISIFT_API_KEY=your_api_key npm run smoke-test

# Or with email/password
REISIFT_EMAIL=you@example.com REISIFT_PASSWORD=xxx npm run smoke-test
```

## License

ISC
