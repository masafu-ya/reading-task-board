"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "タスク" },
  { href: "/books", label: "読書メモ" },
  { href: "/about", label: "について" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white px-6 py-2">
      <ul className="flex gap-4 text-sm">
        {links.map((link) => {
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
      </ul>
    </nav>
  );
}
