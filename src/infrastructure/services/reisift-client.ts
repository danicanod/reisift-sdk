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
} from '../../external/api/types.js';
import { logger } from '../../shared/logger.js';

const DEFAULT_BASE_URL = 'https://apiv2.reisift.io';
const UI_VERSION_HEADER = '2022.02.01.7';

export interface ReisiftClientConfig {
  baseUrl?: string;
  email?: string;
  password?: string;
}

export class ReisiftClient implements ReisiftClientInterface {
  private readonly config: ReisiftClientConfig;
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;

  constructor(config?: ReisiftClientConfig) {
    this.config = config ?? {};
    this.baseUrl = this.config.baseUrl ?? process.env['REISIFT_BASE_URL'] ?? DEFAULT_BASE_URL;
    logger.debug('ReisiftClient initialized', { baseUrl: this.baseUrl });
  }

  async authenticate(): Promise<void> {
    const email = this.config.email ?? process.env['REISIFT_EMAIL'];
    const password = this.config.password ?? process.env['REISIFT_PASSWORD'];

    if (!email || !password) {
      throw new Error(
        'Missing authentication credentials. Provide email/password via config or REISIFT_EMAIL/REISIFT_PASSWORD environment variables.'
      );
    }

    const loginRequest: LoginRequest = {
      email,
      password,
      remember: true,
      agree: true,
    };

    try {
      logger.info('Authenticating with REISift API...');

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

      logger.info('Authentication successful');
    } catch (error) {
      const errorText = error instanceof Error ? error.message : String(error);
      logger.error('Authentication failed', error as Error);
      throw new Error(`Authentication failed: ${errorText}`);
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
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
}
