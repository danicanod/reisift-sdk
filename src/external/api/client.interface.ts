import type {
  DashboardResponse,
  DashboardGeneralResponse,
  PropertySearchRequest,
  PropertySearchResponse,
  Property,
  PropertyImagesResponse,
  PropertyOffersResponse,
  SearchAutocompleteResponse,
  AddressInfoFromMapIdResponse,
  UserResponse,
  CreatePropertyRequest,
  EnsurePropertyOptions,
} from './types.js';

export interface ReisiftClientInterface {
  /**
   * Authenticate with the REISift API.
   * 
   * Authentication modes (checked in order):
   * 1. API key: If `apiKey` config or `REISIFT_API_KEY` env var is set, uses it as Bearer token
   * 2. Email/password: Uses `email`/`password` config or `REISIFT_EMAIL`/`REISIFT_PASSWORD` env vars
   */
  authenticate(): Promise<void>;

  readonly isAuthenticated: boolean;

  /**
   * Get the current access and refresh tokens.
   * Useful for persisting session or passing to other services.
   */
  getTokens(): { accessToken: string | null; refreshToken: string | null };

  /**
   * Get the current access token.
   */
  getAccessToken(): string | null;

  /**
   * Get the current authenticated user.
   * Also used internally to validate API key authentication.
   */
  getCurrentUser(): Promise<UserResponse>;

  getDashboard(): Promise<DashboardResponse>;

  getDashboardGeneral(): Promise<DashboardGeneralResponse>;

  searchProperties(request?: PropertySearchRequest): Promise<PropertySearchResponse>;

  getPropertyById(uuid: string): Promise<Property>;

  getPropertyImages(uuid: string): Promise<PropertyImagesResponse>;

  getPropertyOffers(uuid: string): Promise<PropertyOffersResponse>;

  /**
   * Search for addresses using autocomplete
   * Uses map.reisift.io service
   */
  searchAutocomplete(search: string): Promise<SearchAutocompleteResponse>;

  /**
   * Get detailed address/property info from a map ID
   * Map IDs are returned from searchAutocomplete
   */
  getAddressInfoFromMapId(mapId: string): Promise<AddressInfoFromMapIdResponse>;

  /**
   * Create a new property in Reisift
   */
  createProperty(request: CreatePropertyRequest): Promise<Property>;

  /**
   * Ensure a property exists by map ID.
   * 
   * If a property with this map ID already exists (saved_property_uuid returned),
   * returns the existing property. Otherwise, creates a new property using
   * the normalized address from the map lookup.
   * 
   * @param mapId - The map ID from searchAutocomplete results
   * @param options - Optional configuration for property creation
   */
  ensurePropertyByMapId(mapId: string, options?: EnsurePropertyOptions): Promise<Property>;
}
