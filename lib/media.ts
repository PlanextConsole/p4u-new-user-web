/**
 * Admin uploads return absolute URLs (often `http://localhost:8082/uploads/...`).
 * The user app calls the API gateway (`NEXT_PUBLIC_API_GATEWAY_URL`); static files
 * should be loaded via the same origin the browser uses, or a dedicated media host.
 */

const GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://localhost:8080";

function gatewayOrigin(): string {
  try {
    return new URL(GATEWAY).origin;
  } catch {
    return "http://localhost:8080";
  }
}

/** Optional: dedicated origin for `/uploads` if different from the gateway (no trailing slash). */
function assetOrigin(): string {
  const m = process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.trim();
  if (m) return m.replace(/\/$/, "");
  return gatewayOrigin();
}

/**
 * Turn stored upload URLs into a URL the browser can load.
 * - Path-only `/uploads/...` → prefixed with gateway origin (gateway must proxy `/uploads`).
 * - `localhost` upload hosts → rewritten to gateway origin + pathname (keeps `/uploads/...`).
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (url == null || typeof url !== "string") return null;
  const u = url.trim();
  if (!u) return null;
  if (u.startsWith("//")) return `https:${u}`;
  if (u.startsWith("/uploads")) {
    return `${assetOrigin()}${u}`;
  }
  if (/^https?:\/\//i.test(u)) {
    try {
      const parsed = new URL(u);
      // Only rewrite stored admin URLs that point at /uploads (avoid rewriting unrelated localhost links)
      if (parsed.pathname.startsWith("/uploads")) {
        return `${assetOrigin()}${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return u;
    }
  }
  return u;
}

export function pickProductImage(p: {
  thumbnailUrl?: string | null;
  bannerUrls?: string[] | null;
  image?: string | null;
  metadata?: { imageUrl?: string } | null;
}): string | null {
  const raw =
    p.thumbnailUrl ||
    (Array.isArray(p.bannerUrls) && p.bannerUrls.length ? p.bannerUrls[0] : null) ||
    p.metadata?.imageUrl ||
    p.image ||
    null;
  return resolveMediaUrl(raw);
}

/** Ordered gallery: thumbnail first, then banner images (deduped). */
export function buildProductGalleryImages(p: {
  thumbnailUrl?: string | null;
  bannerUrls?: string[] | null;
  image?: string | null;
  imageUrl?: string | null;
  metadata?: { imageUrl?: string } | null;
  images?: string[] | null;
}): string[] {
  if (p.images?.length) {
    return [...new Set(p.images.map((x) => resolveMediaUrl(x)).filter(Boolean) as string[])];
  }
  const out: string[] = [];
  const push = (x: string | null) => {
    if (x && !out.includes(x)) out.push(x);
  };
  push(resolveMediaUrl(p.thumbnailUrl));
  for (const b of p.bannerUrls || []) {
    push(resolveMediaUrl(b));
  }
  if (!out.length) {
    push(resolveMediaUrl(p.metadata?.imageUrl ?? null));
    push(resolveMediaUrl(p.imageUrl ?? null));
    push(resolveMediaUrl(p.image ?? null));
  }
  return out;
}

export function pickVendorImage(v: {
  thumbnailUrl?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  logo?: string | null;
  banner?: string | null;
}): string | null {
  const raw = v.thumbnailUrl || v.logoUrl || v.bannerUrl || v.logo || v.banner || null;
  return resolveMediaUrl(raw);
}

export function pickCategoryImage(c: {
  thumbnailUrl?: string | null;
  iconUrl?: string | null;
  bannerUrls?: string[] | null;
  image?: string | null;
}): string | null {
  const raw =
    c.thumbnailUrl ||
    c.iconUrl ||
    (Array.isArray(c.bannerUrls) && c.bannerUrls.length ? c.bannerUrls[0] : null) ||
    c.image ||
    null;
  return resolveMediaUrl(raw);
}

export function pickServiceImage(s: {
  iconUrl?: string | null;
  metadata?: { imageUrl?: string } | null;
}): string | null {
  const raw = s.iconUrl || s.metadata?.imageUrl || null;
  return resolveMediaUrl(raw);
}
