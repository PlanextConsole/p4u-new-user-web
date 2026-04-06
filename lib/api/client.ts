/**
 * Centralised HTTP client that talks to the P4U API Gateway.
 *
 * Every service module (catalog, content, …) imports `apiClient` and
 * calls its convenience methods instead of using raw `fetch`.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://localhost:8080";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

interface ApiMeta {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
}

interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

interface ErrorEnvelope {
  success: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

/* ------------------------------------------------------------------ */
/*  Token helper                                                       */
/* ------------------------------------------------------------------ */

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("p4u_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ------------------------------------------------------------------ */
/*  Core request function                                              */
/* ------------------------------------------------------------------ */

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  };

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const err: ApiError = {
      status: 0,
      message:
        msg === "Failed to fetch"
          ? "Network error: could not reach the API. Confirm the gateway is running and NEXT_PUBLIC_API_GATEWAY_URL matches (e.g. http://localhost:8080)."
          : msg || "Network request failed",
      details: e,
    };
    throw err;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const envelopeError =
      body && typeof body === "object" && "error" in body
        ? (body as ErrorEnvelope).error
        : undefined;
    const err: ApiError = {
      status: res.status,
      message: envelopeError?.message ?? body.message ?? res.statusText,
      details: body,
    };
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const body = (await res.json()) as unknown;
  if (body && typeof body === "object" && "success" in body) {
    const envelope = body as SuccessEnvelope<unknown> | ErrorEnvelope;
    if ((envelope as ErrorEnvelope).success === false) {
      const err: ApiError = {
        status: res.status,
        message: (envelope as ErrorEnvelope).error?.message ?? "Request failed",
        details: body,
      };
      throw err;
    }
    const ok = envelope as SuccessEnvelope<unknown>;
    const data = ok.data;
    const meta = ok.meta;
    if (
      meta != null &&
      typeof meta === "object" &&
      typeof meta.total === "number" &&
      Array.isArray(data)
    ) {
      return {
        data,
        total: meta.total,
        limit: typeof meta.limit === "number" ? meta.limit : data.length,
        offset: typeof meta.offset === "number" ? meta.offset : 0,
      } as T;
    }
    return data as T;
  }
  return body as T;
}

/* ------------------------------------------------------------------ */
/*  Public helpers                                                     */
/* ------------------------------------------------------------------ */

export const apiClient = {
  get<T>(path: string, params?: Record<string, string | number | boolean>) {
    const query = params
      ? "?" + new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)]),
        ).toString()
      : "";
    return request<T>(path + query);
  },

  post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "POST",
      body: body != null ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PUT",
      body: body != null ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PATCH",
      body: body != null ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string) {
    return request<T>(path, { method: "DELETE" });
  },
};
