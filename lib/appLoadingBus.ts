/**
 * Lets any module signal "a client navigation is starting" so the global
 * loading bar can show before router.push / router.replace (no <a> click).
 */

const listeners = new Set<() => void>();

export function subscribeNavigationIntent(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notifyNavigationIntent(): void {
  listeners.forEach((fn) => fn());
}
