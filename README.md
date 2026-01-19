# @reisift/sdk

A TypeScript SDK for the Reisift API.

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
// (methods will be added as the API is reverse engineered)
```

## Environment Variables

The SDK supports the following environment variables:

```bash
# Authentication
REISIFT_API_KEY=your_api_key
REISIFT_USERNAME=your_username
REISIFT_PASSWORD=your_password

# Optional
REISIFT_BASE_URL=https://api.reisift.io
LOG_LEVEL=info  # debug, info, warn, error
```

## Configuration

You can also pass configuration directly:

```typescript
const client = new ReisiftClient({
  apiKey: 'your_api_key',
  // or
  username: 'your_username',
  password: 'your_password',
  baseUrl: 'https://api.reisift.io',
});
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

## API Reference

### ReisiftClient

The main client for interacting with the Reisift API.

#### Methods

- `authenticate()` - Authenticate with the API

*More methods will be documented as the API is reverse engineered.*

## Types

The SDK exports TypeScript types for all API operations:

```typescript
import type {
  ReisiftClientInterface,
  Pagination,
  PaginatedResponse,
  ApiResponse,
  ApiError,
} from '@reisift/sdk';
```

## License

ISC
