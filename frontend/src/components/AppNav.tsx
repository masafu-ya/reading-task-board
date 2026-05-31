"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, isLoggedIn } from "@/lib/auth";
import { fetchMe, type User } from "@/lib/auth-api";

const links = [
  { href: "/", label: "タスク" },
  { href: "/books", label: "読書メモ" },
  { href: "/about", label: "について" },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn || pathname === "/login") {
      setUser(null);
      return;
    }
    void fetchMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, [loggedIn, pathname]);

  function handleLogout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="border-b border-zinc-200 bg-white px-6 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex gap-4 text-sm">
          {loggedIn &&
            links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      active
                        ? "font-semibold text-blue-600"
                        : "text-zinc-600 hover:text-blue-600"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          {!loggedIn && (
            <li>
              <Link href="/login" className="font-semibold text-blue-600">
                ログイン
              </Link>
            </li>
          )}
        </ul>
        {loggedIn && (
          <div className="flex items-center gap-3 text-sm">
            {user && (
              <span className="text-zinc-500">{user.email}</span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
