import type {
  DashboardResponse,
  DashboardGeneralResponse,
  PropertySearchRequest,
  PropertySearchResponse,
  Property,
  PropertyImagesResponse,
  PropertyOffersResponse,
} from './types.js';

export interface ReisiftClientInterface {
  authenticate(): Promise<void>;

  readonly isAuthenticated: boolean;

  getDashboard(): Promise<DashboardResponse>;

  getDashboardGeneral(): Promise<DashboardGeneralResponse>;

  searchProperties(request?: PropertySearchRequest): Promise<PropertySearchResponse>;

  getPropertyById(uuid: string): Promise<Property>;

  getPropertyImages(uuid: string): Promise<PropertyImagesResponse>;

  getPropertyOffers(uuid: string): Promise<PropertyOffersResponse>;
}
