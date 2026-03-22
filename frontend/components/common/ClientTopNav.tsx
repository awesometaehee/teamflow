"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, readSession } from "@/lib/session";
import type { AuthSession } from "@/types/user";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/my-tasks", label: "My Tasks" },
  { href: "/shared", label: "Shared" },
];

type ClientTopNavProps = {
  apiBaseUrl: string;
};

export function ClientTopNav({ apiBaseUrl }: ClientTopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(readSession());
  }, [pathname]);

  function handleLogout() {
    clearSession();
    setSession(null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.7)] px-5 py-4 shadow-[0_18px_60px_rgba(16,24,47,0.08)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/" className="text-2xl font-semibold tracking-[-0.04em]">
            TeamFlow
          </Link>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Personal-first task flow with lightweight team sharing
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <nav className="flex flex-wrap items-center gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:border-[var(--color-line)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {session ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 font-medium text-[var(--color-ink)]">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--color-line)] px-3 py-1 font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-surface)]"
              >
                Logout
              </button>
            </div>
          ) : (
            <span className="text-sm text-[var(--color-ink-soft)]">
              로그인 후 보호 페이지에 접근할 수 있습니다.
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-line)] pt-4 text-sm text-[var(--color-ink-soft)] md:flex-row md:items-center md:justify-between">
        <span>
          {session
            ? "세션이 로컬에 저장되어 있으며 브라우저 새로고침 후에도 유지됩니다."
            : "로그인 페이지에서 샘플 계정으로 세션을 만들 수 있습니다."}
        </span>
        <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 font-medium">
          API Base URL: {apiBaseUrl}
        </span>
      </div>
    </header>
  );
}
