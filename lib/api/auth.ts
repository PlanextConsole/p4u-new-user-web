import { apiClient } from "./client";

const BASE = "/api/auth";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn?: number;
  roles?: string[];
  permissions?: string[];
  vendorId?: string | null;
  customerId?: string | null;
}

export interface SignupResponse {
  message: string;
  userId?: string;
}

export const authApi = {
  login(username: string, password: string) {
    return apiClient.post<LoginResponse>(`${BASE}/public/login`, { username, password });
  },

  signup(data: { username: string; password: string; email?: string; firstName?: string; lastName?: string; userType?: string }) {
    return apiClient.post<SignupResponse>(`${BASE}/public/signup`, data);
  },

  refreshToken(refreshToken: string) {
    return apiClient.post<LoginResponse>(`${BASE}/public/refresh?refreshToken=${encodeURIComponent(refreshToken)}`);
  },

  logout(refreshToken: string) {
    return apiClient.post<{ message: string }>(`${BASE}/logout`, { refreshToken });
  },
};
