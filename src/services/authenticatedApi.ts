import { config } from "../config";

export type ApiRequest = {
  url: string;
  requestInit: RequestInit;
}

export function buildApiUrl(path: string): string {
  return `${config.apiHost}${path}`;
}

export function buildAuthRequest(
  token: string,
  path: string,
  requestInit: RequestInit = {}
): ApiRequest {
  const headers = new Headers(requestInit.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  return {
    url: buildApiUrl(path),
    requestInit: {
      ...requestInit,
      headers,
    },
  };
}

export function buildPublicRequest(
  path: string,
  requestInit: RequestInit = {}
): ApiRequest {
  return {
    url: buildApiUrl(path),
    requestInit,
  };
}

export async function executeApiRequest<T = unknown>(
  request: ApiRequest,
  fetchImpl: typeof fetch = fetch
): Promise<T> {
  const response = await fetchImpl(request.url, request.requestInit);
  if (!response.ok) {
    if (response.status === 403) {
      throw await response.json();
    }
    throw new Error(response.statusText);
  }
  return (await response.json()) as T;
}
