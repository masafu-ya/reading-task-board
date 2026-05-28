export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RequestOptions = RequestInit & {
  errorMessage: string;
};

/** fetch の共通処理（エラーハンドリング付き） */
export async function apiRequest<T>(
  path: string,
  { errorMessage, ...init }: RequestOptions,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    throw new Error(`${errorMessage} (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export async function apiGet<T>(path: string, errorMessage: string): Promise<T> {
  return apiRequest<T>(path, { errorMessage });
}

export async function apiSend<T>(
  path: string,
  method: string,
  errorMessage: string,
  body?: unknown,
): Promise<T> {
  return apiRequest<T>(path, {
    method,
    errorMessage,
    headers: body != null ? { "Content-Type": "application/json" } : undefined,
    body: body != null ? JSON.stringify(body) : undefined,
  });
}
