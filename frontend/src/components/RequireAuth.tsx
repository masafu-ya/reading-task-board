"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/lib/auth";
import LoadingMessage from "@/components/ui/LoadingMessage";

type RequireAuthProps = {
  children: React.ReactNode;
};

/** 未ログインなら /login へリダイレクト */
export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-lg px-6 py-10">
        <LoadingMessage message="ログイン確認中..." />
      </div>
    );
  }

  return <>{children}</>;
}
