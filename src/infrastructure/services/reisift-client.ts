import type { ReisiftClientInterface } from '../../external/api/client.interface.js';
import type {
  TokenPair,
  LoginRequest,
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
} from '../../external/api/types.js';
import { logger } from '../../shared/logger.js';

const DEFAULT_BASE_URL = 'https://apiv2.reisift.io';
const MAP_BASE_URL = 'https://map.reisift.io';
const UI_VERSION_HEADER = '2022.02.01.7';

export interface ReisiftClientConfig {
  /** Base URL for the API (default: https://apiv2.reisift.io) */
  baseUrl?: string;
  /** Email for email/password authentication */
  email?: string;
  /** Password for email/password authentication */
  password?: string;
  /** Long-lived API key (used as Bearer token, skips login flow) */
  apiKey?: string;
}

type AuthMode = 'none' | 'api_key' | 'jwt';

export class ReisiftClient implements ReisiftClientInterface {
  private readonly config: ReisiftClientConfig;
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private authMode: AuthMode = 'none';

  constructor(config?: ReisiftClientConfig) {
    this.config = config ?? {};
    this.baseUrl = this.config.baseUrl ?? process.env['REISIFT_BASE_URL'] ?? DEFAULT_BASE_URL;
    logger.debug('ReisiftClient initialized', { baseUrl: this.baseUrl });
  }

  async authenticate(): Promise<void> {
    // Check for API key first (takes priority)
    const apiKey = this.config.apiKey ?? process.env['REISIFT_API_KEY'];

    if (apiKey) {
      return this.authenticateWithApiKey(apiKey);
    }

    // Fall back to email/password login
    const email = this.config.email ?? process.env['REISIFT_EMAIL'];
    const password = this.config.password ?? process.env['REISIFT_PASSWORD'];

    if (!email || !password) {
      throw new Error(
        'Missing authentication credentials. Provide apiKey, or email/password via config or environment variables (REISIFT_API_KEY, or REISIFT_EMAIL + REISIFT_PASSWORD).'
      );
    }

    return this.authenticateWithEmailPassword(email, password);
  }

  private async authenticateWithApiKey(apiKey: string): Promise<void> {
    logger.info('Authenticating with API key...');

    // Set the token first so we can use the request method
    this.accessToken = apiKey;
    this.authMode = 'api_key';

    try {
      // Validate by calling the user endpoint
      await this.getCurrentUser();
      logger.info('API key authentication successful');
    } catch (error) {
      // Reset on failure
      this.accessToken = null;
      this.authMode = 'none';
      const errorText = error instanceof Error ? error.message : String(error);
      logger.error('API key authentication failed', error as Error);
      throw new Error(`API key authentication failed: ${errorText}`);
    }
  }

  private async authenticateWithEmailPassword(email: string, password: string): Promise<void> {
    const loginRequest: LoginRequest = {
      email,
      password,
      remember: true,
      agree: true,
    };

    try {
      logger.info('Authenticating with email/password...');

      const response = await fetch(`${this.baseUrl}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const tokens = (await response.json()) as TokenPair;
      this.accessToken = tokens.access;
      this.refreshToken = tokens.refresh;
      this.authMode = 'jwt';

      logger.info('Email/password authentication successful');
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error);
      logger.error('Authentication failed', error as Error);
      throw new Error(`Authentication failed: ${errorText}`);
    }
  }

  /**
   * Get the current authenticated user.
   * Also used internally to validate API key authentication.
   */
  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/api/internal/user/');
  }

  private async refreshAccessToken(): Promise<boolean> {
    // API key mode doesn't support refresh
    if (this.authMode === 'api_key') {
      logger.warn('API key mode does not support token refresh');
      return false;
    }

    if (!this.refreshToken) {
      logger.warn('No refresh token available');
      return false;
    }

    if (this.isRefreshing) {
      return false;
    }

    this.isRefreshing = true;

    try {
      logger.debug('Refreshing access token...');

      const response = await fetch(`${this.baseUrl}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (!response.ok) {
        logger.warn('Token refresh failed, re-authentication required');
        this.accessToken = null;
        this.refreshToken = null;
        this.authMode = 'none';
        return false;
      }

      const data = (await response.json()) as { access: string; refresh?: string };
      this.accessToken = data.access;
      
      if (data.refresh) {
        this.refreshToken = data.refresh;
      }

      logger.debug('Access token refreshed successfully');
      return true;
    } catch (error) {
      logger.error('Token refresh error', error as Error);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOnUnauthorized = true
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'x-reisift-ui-version': UI_VERSION_HEADER,
        ...options.headers,
      },
    });

    if (response.status === 401 && retryOnUnauthorized) {
      if (this.authMode === 'api_key') {
        throw new Error('API key is invalid or expired. Please check your API key.');
      }
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.request<T>(endpoint, options, false);
      }
      throw new Error('Session expired. Please re-authenticate.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    return response.text() as unknown as T;
  }

  get isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async getDashboard(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/api/internal/dashboard/');
  }

  async getDashboardGeneral(): Promise<DashboardGeneralResponse> {
    return this.request<DashboardGeneralResponse>('/api/internal/dashboard/general/');
  }

  async searchProperties(request: PropertySearchRequest = {}): Promise<PropertySearchResponse> {
    const { limit = 10, offset = 0, ordering = '-list_count', query } = request;

    return this.request<PropertySearchResponse>('/api/internal/property/', {
      method: 'POST',
      headers: {
        'x-http-method-override': 'GET',
      },
      body: JSON.stringify({
        limit,
        offset,
        ordering,
        query: query ?? { must: { property_type: 'clean' } },
      }),
    });
  }

  async getPropertyById(uuid: string): Promise<Property> {
    return this.request<Property>(`/api/internal/property/${uuid}/`);
  }

  async getPropertyImages(uuid: string): Promise<PropertyImagesResponse> {
    return this.request<PropertyImagesResponse>(
      `/api/internal/property/${uuid}/image/?offset=0&limit=999`
    );
  }

  async getPropertyOffers(uuid: string): Promise<PropertyOffersResponse> {
    return this.request<PropertyOffersResponse>(
      `/api/internal/property/${uuid}/offer/?offset=0&limit=999&ordering=-created`
    );
  }

  async searchAutocomplete(search: string): Promise<SearchAutocompleteResponse> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    const response = await fetch(`${MAP_BASE_URL}/properties/search-autocomplete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'x-reisift-ui-version': UI_VERSION_HEADER,
      },
      body: JSON.stringify({ search }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search autocomplete failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const json = await response.json() as { data: SearchAutocompleteResponse };
    return json.data;
  }

  async getAddressInfoFromMapId(mapId: string): Promise<AddressInfoFromMapIdResponse> {
    return this.request<AddressInfoFromMapIdResponse>('/api/internal/property/address-info-from-map-id/', {
      method: 'POST',
      body: JSON.stringify({ map_id: mapId }),
    });
  }

  async createProperty(request: CreatePropertyRequest): Promise<Property> {
    logger.debug('Creating property', { address: request.address });
    return this.request<Property>('/api/internal/property/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async ensurePropertyByMapId(mapId: string, options: EnsurePropertyOptions = {}): Promise<Property> {
    logger.debug('Ensuring property by map ID', { mapId });

    // Check if property already exists
    const info = await this.getAddressInfoFromMapId(mapId);

    if (info.saved_property_uuid) {
      logger.debug('Property already exists', { uuid: info.saved_property_uuid });
      return this.getPropertyById(info.saved_property_uuid);
    }

    // Property doesn't exist, create it
    if (!info.address) {
      throw new Error('Address info not returned from map ID lookup');
    }

    const { includeOwner = true, ...createOptions } = options;

    const createRequest: CreatePropertyRequest = {
      address: {
        street: info.address.street ?? '',
        city: info.address.city ?? '',
        state: info.address.state ?? '',
        postal_code: info.address.postal_code ?? '',
        country: info.address.country,
      },
      ...createOptions,
    };

    // Include owner info if available and requested
    if (includeOwner && info.owner) {
      createRequest.owner = {
        first_name: info.owner.first_name,
        last_name: info.owner.last_name,
        company: info.owner.company,
      };

      if (info.owner.address) {
        createRequest.owner.address = {
          street: info.owner.address.street ?? '',
          city: info.owner.address.city ?? '',
          state: info.owner.address.state ?? '',
          postal_code: info.owner.address.postal_code ?? '',
          country: info.owner.address.country,
        };
      }
    }

    logger.debug('Creating new property from map ID', { address: createRequest.address });
    return this.createProperty(createRequest);
  }
}
