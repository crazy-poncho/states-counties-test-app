function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export function getBaseUrl(): string {
  return trimTrailingSlash(process.env.BASE_URL ?? "http://localhost:3000");
}

export function stateDetailUrl(stateName: string): string {
  return `${getBaseUrl()}/state/${encodeURIComponent(stateName)}`;
}