"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { inputClassName } from "@/components/ui/inputStyles";
import PageHeader from "@/components/ui/PageHeader";
import { login, register } from "@/lib/auth-api";
import { isLoggedIn } from "@/lib/auth";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "register") {
        await register(trimmedEmail, password);
      } else {
        await login(trimmedEmail, password);
      }
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "認証に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <PageHeader
        title={mode === "login" ? "ログイン" : "新規登録"}
        subtitle="Day 11 — JWT 認証"
      />

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`rounded-lg px-4 py-2 text-sm ${
            mode === "login"
              ? "bg-blue-600 text-white"
              : "border border-zinc-300 text-zinc-600"
          }`}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError(null);
          }}
          className={`rounded-lg px-4 py-2 text-sm ${
            mode === "register"
              ? "bg-blue-600 text-white"
              : "border border-zinc-300 text-zinc-600"
          }`}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={submitting}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            disabled={submitting}
            className={inputClassName}
          />
          {mode === "register" && (
            <p className="mt-1 text-xs text-zinc-500">8文字以上</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting
            ? "処理中..."
            : mode === "login"
              ? "ログイン"
              : "登録してログイン"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link href="/about" className="text-blue-600 hover:underline">
          このアプリについて
        </Link>
      </p>
    </div>
  );
}
