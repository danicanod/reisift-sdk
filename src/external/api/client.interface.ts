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
}
