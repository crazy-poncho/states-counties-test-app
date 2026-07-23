import type { StateDetail, StateSummary } from "../types/api";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

/**
 * Turn an API `detail` link into a fetch URL.
 * Uses the path (and encoding) from the link; keeps same-origin relative
 * requests when `VITE_API_BASE_URL` is empty so Vite/Nginx proxies work.
 */
export function resolveDetailUrl(detailUrl: string): string {
  const parsed = new URL(detailUrl, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  const path = `${parsed.pathname}${parsed.search}`;

  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

export function fetchStates(): Promise<StateSummary[]> {
  return request<StateSummary[]>(`${API_BASE_URL}/states`);
}

/** Fetch state detail using the `detail` URL from a `/states` list item. */
export function fetchStateDetail(detailUrl: string): Promise<StateDetail> {
  return request<StateDetail>(resolveDetailUrl(detailUrl));
}
