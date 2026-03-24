"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { readSession } from "@/lib/session";
import type { AuthSession } from "@/types/user";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const currentSession = readSession();
    if (!currentSession) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setSession(currentSession);
    setReady(true);
  }, [pathname, router]);

  if (!ready || !session) {
    return (
      <section className="rounded-[32px] border border-[var(--color-line)] bg-white p-8 text-sm text-[var(--color-ink-soft)] shadow-[0_24px_70px_var(--color-shadow)]">
        로그인 상태를 확인하는 중입니다.
      </section>
    );
  }

  return <>{children}</>;
}
