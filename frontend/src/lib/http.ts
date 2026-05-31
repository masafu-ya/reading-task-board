import { clearToken, getToken } from "@/lib/auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type RequestOptions = RequestInit & {
  errorMessage: string;
  auth?: boolean;
};

function buildHeaders(init: RequestInit, includeAuth: boolean): Headers {
  const headers = new Headers(init.headers);
  if (bodyIsJson(init.body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

function bodyIsJson(body: BodyInit | null | undefined): boolean {
  return body != null && typeof body === "string";
}

/** fetch の共通処理（JWT 付与・401 処理付き） */
export async function apiRequest<T>(
  path: string,
  { errorMessage, auth = true, ...init }: RequestOptions,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: buildHeaders(init, auth),
  });

  if (res.status === 401 && auth) {
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("ログインが必要です");
  }

  if (!res.ok) {
    let detail = "";
    try {
      const json = (await res.json()) as { detail?: string | unknown };
      if (typeof json.detail === "string") {
        detail = `: ${json.detail}`;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(`${errorMessage}${detail} (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export async function apiGet<T>(
  path: string,
  errorMessage: string,
  options?: { auth?: boolean },
): Promise<T> {
  return apiRequest<T>(path, { errorMessage, auth: options?.auth });
}

export async function apiSend<T>(
  path: string,
  method: string,
  errorMessage: string,
  body?: unknown,
  options?: { auth?: boolean },
): Promise<T> {
  return apiRequest<T>(path, {
    method,
    errorMessage,
    auth: options?.auth,
    body: body != null ? JSON.stringify(body) : undefined,
  });
}
