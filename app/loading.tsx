/**
 * Next.js App Router: shown while the route segment loads (server/streaming).
 * Matches global overlay styling in globals.css for one consistent look site-wide.
 */
export default function Loading() {
  return (
    <div
      className="p4u-route-loading-root"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="p4u-global-loading-spinner" />
    </div>
  );
}
