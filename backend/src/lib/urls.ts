import type { Request } from "express";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Public origin for absolute API links in responses.
 * Prefers the incoming request (Host / X-Forwarded-*) so links match the
 * browser origin when the API is reached via Vite or Nginx. Falls back to
 * BASE_URL when no request host is available.
 */
export function getBaseUrl(req?: Request): string {
  if (req) {
    const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || req.get("host");
    if (host) {
      const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
      const proto = forwardedProto || req.protocol || "http";
      return trimTrailingSlash(`${proto}://${host}`);
    }
  }

  return trimTrailingSlash(process.env.BASE_URL ?? "http://localhost:3000");
}

export function stateDetailUrl(stateName: string, req?: Request): string {
  return `${getBaseUrl(req)}/state/${encodeURIComponent(stateName)}`;
}
