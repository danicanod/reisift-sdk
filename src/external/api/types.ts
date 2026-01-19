export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
  agree?: boolean;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}

export interface Pagination {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardResponse {
  [key: string]: unknown;
}

export interface DashboardGeneralResponse {
  [key: string]: unknown;
}

export interface PropertySearchQuery {
  must?: Record<string, unknown>;
  must_not?: Record<string, unknown>;
  should?: Record<string, unknown>;
}

export interface PropertySearchRequest {
  limit?: number;
  offset?: number;
  ordering?: string;
  query?: PropertySearchQuery;
}

export interface PropertyAddress {
  full_address?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
}

export interface PropertyOwner {
  uuid: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phones?: Array<{
    uuid: string;
    phone: string;
    type?: string;
  }>;
  emails?: Array<{
    uuid: string;
    email: string;
  }>;
}

export interface Property {
  uuid: string;
  address?: PropertyAddress;
  owners?: PropertyOwner[];
  property_type?: string;
  list_count?: number;
  status?: string;
  created?: string;
  modified?: string;
  [key: string]: unknown;
}

export interface PropertySearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Property[];
}

export interface PropertyImage {
  uuid: string;
  url: string;
  thumbnail_url?: string;
  created?: string;
}

export interface PropertyImagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyImage[];
}

export interface PropertyOffer {
  uuid: string;
  amount?: number;
  status?: string;
  created?: string;
  [key: string]: unknown;
}

export interface PropertyOffersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyOffer[];
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// User response (used for validating API key)
export interface UserResponse {
  uuid: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  account?: string;
  [key: string]: unknown;
}

// Search Autocomplete (map.reisift.io)
export interface SearchAutocompleteRequest {
  search: string;
}

export interface SearchAutocompleteResult {
  id?: string;
  map_id?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  title?: string;
  searchType?: string;
  [key: string]: unknown;
}

export type SearchAutocompleteResponse = SearchAutocompleteResult[];

// Address Info from Map ID
export interface AddressInfoFromMapIdRequest {
  map_id: string;
}

/** Address structure returned from map ID lookup and used in property creation */
export interface MapIdAddress {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  vacant?: boolean;
  invalid_address?: boolean | null;
  utc?: unknown;
  active?: unknown;
}

/** Owner info returned from map ID lookup */
export interface MapIdOwner {
  first_name?: string;
  last_name?: string;
  company?: string | null;
  address?: MapIdAddress;
}

export interface AddressInfoFromMapIdResponse {
  /** Normalized address from the map lookup */
  address?: MapIdAddress;
  /** Owner information if available */
  owner?: MapIdOwner;
  /** UUID of an existing property if already saved in Reisift */
  saved_property_uuid?: string;
  [key: string]: unknown;
}

// ============================================================================
// Create Property
// ============================================================================

/** Address for creating a property (minimal required fields) */
export interface CreatePropertyAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

/** Owner info for creating a property */
export interface CreatePropertyOwner {
  first_name?: string;
  last_name?: string;
  company?: string | null;
  address?: CreatePropertyAddress;
  emails?: string[];
  emails_info?: Record<string, unknown>;
  primary_email?: string | null;
  phones?: string[];
  primary_phone?: string | null;
}

/** Request payload for creating a new property */
export interface CreatePropertyRequest {
  /** Property address (required) */
  address: CreatePropertyAddress;
  /** UUID of user to assign the property to */
  assigned_to?: string;
  /** Property status (e.g., "Working On It", "New Lead", etc.) */
  status?: string;
  /** Lists to add the property to */
  lists?: string[];
  /** Tags to apply to the property */
  tags?: string[];
  /** Notes about the property */
  notes?: string;
  /** Owner information */
  owner?: CreatePropertyOwner;
}

/** Options for ensurePropertyByMapId helper */
export interface EnsurePropertyOptions {
  /** UUID of user to assign the property to (if creating) */
  assigned_to?: string;
  /** Property status (if creating) */
  status?: string;
  /** Lists to add the property to (if creating) */
  lists?: string[];
  /** Tags to apply (if creating) */
  tags?: string[];
  /** Notes (if creating) */
  notes?: string;
  /** Whether to include owner info from map lookup when creating (default: true) */
  includeOwner?: boolean;
}
