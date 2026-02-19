/**
 * @dsanchez.co/reisift-sdk
 * 
 * A TypeScript SDK for the REISift API.
 * 
 * @example
 * ```typescript
 * import { ReisiftClient } from '@dsanchez.co/reisift-sdk';
 * 
 * const client = new ReisiftClient();
 * await client.authenticate();
 * 
 * // Use the client to interact with the REISift API
 * ```
 */

// Main client
export { ReisiftClient } from './infrastructure/services/reisift-client.js';
export type { ReisiftClientConfig } from './infrastructure/services/reisift-client.js';

// Client interface
export type { ReisiftClientInterface } from './external/api/client.interface.js';

// External types (API shapes)
export type {
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
  AddressInfoByMapIdResponse,
  MapIdAddress,
  MapIdOwner,
  CreatePropertyAddress,
  CreatePropertyOwner,
  CreatePropertyRequest,
  EnsurePropertyByMapIdOptions,
  ApiError,
  Pagination,
  PaginatedResponse,
} from './external/api/types.js';

// Logger (for debugging)
export { logger } from './shared/logger.js';
export type { Logger, LogContext } from './shared/logger.js';
