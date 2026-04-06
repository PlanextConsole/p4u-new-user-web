import { apiClient } from "./client";

const BASE = "/api/v1/payments";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PaymentIntent {
  id: number;
  orderId?: number;
  amount: number;
  currency: string;
  provider: string;
  providerOrderId?: string;
  status: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  API functions                                                      */
/* ------------------------------------------------------------------ */

export const paymentsApi = {
  health() {
    return apiClient.get<{ status: string }>(`${BASE}/public/health`);
  },

  createIntent(data: { orderId: string | number; amount: number; currency?: string }) {
    return apiClient.post<PaymentIntent>(`${BASE}/intents`, {
      orderId: String(data.orderId),
      amount: data.amount,
      currency: data.currency,
    });
  },

  getIntent(intentId: string | number) {
    return apiClient.get<PaymentIntent>(`${BASE}/intents/${intentId}`);
  },
};
