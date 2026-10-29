/**
 * Is a project's site down? Only a clear failure counts: no answer at all, gone (404, 410) or a server error.
 * Answers that only refuse a script (401, 403, 405, 429) mean the site is there.
 * `status` is the HTTP status, or null when the request failed (DNS, TLS, timeout).
 */
export function isDown(status: number | null): boolean {
  return status === null || status === 404 || status === 410 || status >= 500;
}
