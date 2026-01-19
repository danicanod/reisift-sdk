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
