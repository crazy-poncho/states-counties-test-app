import type { StateDetail, StateSummary } from "../types/api";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function fetchStates(): Promise<StateSummary[]> {
  return request<StateSummary[]>("/states");
}

export function fetchStateDetail(name: string): Promise<StateDetail> {
  return request<StateDetail>(`/state/${encodeURIComponent(name)}`);
}
