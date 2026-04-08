import { apiClient, PaginatedResponse } from "./client";

const BASE = "/api/v1/catalog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  thumbnailUrl?: string | null;
  iconUrl?: string | null;
  bannerUrls?: string[] | null;
  /** Legacy */
  image?: string;
  isActive: boolean;
}

export interface Vendor {
  id: string;
  name?: string;
  businessName?: string;
  ownerName?: string;
  description?: string;
  aboutBusiness?: string;
  logo?: string;
  logoUrl?: string | null;
  thumbnailUrl?: string | null;
  bannerUrl?: string | null;
  banner?: string;
  rating?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  price: number | string;
  sellPrice?: string;
  finalPrice?: string;
  originalPrice?: number;
  thumbnailUrl?: string | null;
  bannerUrls?: string[] | null;
  image?: string;
  vendorId: string | null;
  categoryId?: string | null;
  serviceId?: string | null;
  isActive: boolean;
  metadata?: { imageUrl?: string; brand?: string; [key: string]: unknown };
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string | null;
  price: number | string;
  duration?: string;
  vendorId?: string | null;
  categoryId?: string | null;
  isActive: boolean;
  metadata?: { imageUrl?: string; price?: string; [key: string]: unknown };
}

export interface SearchResult {
  products: Product[];
  services: ServiceItem[];
  vendors: Vendor[];
}

/* ------------------------------------------------------------------ */
/*  API functions                                                      */
/* ------------------------------------------------------------------ */

export const catalogApi = {
  health() {
    return apiClient.get<{ status: string }>(`${BASE}/public/health`);
  },

  getCategories(params?: { limit?: number; offset?: number; includeInactive?: boolean }) {
    return apiClient.get<PaginatedResponse<Category>>(`${BASE}/categories`, params as Record<string, string | number | boolean>);
  },

  getCategoryChildren(categoryId: number) {
    return apiClient.get<Category[]>(`${BASE}/categories/${categoryId}/children`);
  },

  getVendors(params?: { limit?: number; offset?: number }) {
    return apiClient.get<PaginatedResponse<Vendor>>(`${BASE}/vendors`, params as Record<string, string | number | boolean>);
  },

  getVendor(vendorId: number | string) {
    return apiClient.get<Vendor>(`${BASE}/vendors/${vendorId}`);
  },

  getVendorProducts(vendorId: number | string, params?: { limit?: number; offset?: number }) {
    return apiClient.get<PaginatedResponse<Product>>(`${BASE}/vendors/${vendorId}/products`, params as Record<string, string | number | boolean>);
  },

  getProduct(productId: number | string) {
    return apiClient.get<Product>(`${BASE}/products/${productId}`);
  },

  getServices(params?: { limit?: number; offset?: number }) {
    return apiClient.get<PaginatedResponse<ServiceItem>>(`${BASE}/services`, params as Record<string, string | number | boolean>);
  },

  getService(serviceId: number) {
    return apiClient.get<ServiceItem>(`${BASE}/services/${serviceId}`);
  },

  search(q: string, params?: { limit?: number; offset?: number }) {
    return apiClient.get<SearchResult>(`${BASE}/search`, { q, ...params } as Record<string, string | number | boolean>);
  },
};
