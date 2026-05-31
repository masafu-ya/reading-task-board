import { apiGet, apiSend } from "@/lib/http";
import { saveToken } from "@/lib/auth";

export type User = {
  id: number;
  email: string;
  created_at?: string;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
};

export async function register(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const data = await apiSend<TokenResponse>(
    "/auth/register",
    "POST",
    "ユーザー登録に失敗しました",
    { email, password },
    { auth: false },
  );
  saveToken(data.access_token);
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const data = await apiSend<TokenResponse>(
    "/auth/login",
    "POST",
    "ログインに失敗しました",
    { email, password },
    { auth: false },
  );
  saveToken(data.access_token);
  return data;
}

export async function fetchMe(): Promise<User> {
  const data = await apiGet<User>("/auth/me", "ユーザー情報の取得に失敗しました");
  return data;
}
