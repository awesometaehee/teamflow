"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NotificationPanel } from "@/components/notification/NotificationPanel";
import { ApiError } from "@/lib/api/client";
import { getNotifications } from "@/lib/api/notifications";
import { clearSession, readSession } from "@/lib/session";
import type { AppNotification } from "@/types/notification";
import type { AuthSession } from "@/types/user";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/login", label: "로그인" },
  { href: "/my-tasks", label: "내 태스크" },
  { href: "/shared", label: "공유 보드" },
];

type ClientTopNavProps = {
  apiBaseUrl: string;
};

export function ClientTopNav({ apiBaseUrl }: ClientTopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  useEffect(() => {
    setSession(readSession());
  }, [pathname]);

  useEffect(() => {
    if (!session) {
      setNotifications([]);
      setNotificationError("");
      return;
    }

    void refreshNotifications();

    const intervalId = window.setInterval(() => {
      void refreshNotifications();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [session?.user.id, pathname]);

  function handleLogout() {
    clearSession();
    setSession(null);
    setNotifications([]);
    router.replace("/login");
    router.refresh();
  }

  async function refreshNotifications() {
    if (!readSession()) {
      return;
    }

    setIsNotificationsLoading(true);
    setNotificationError("");

    try {
      const nextNotifications = await getNotifications();
      setNotifications(nextNotifications);
    } catch (error) {
      if (error instanceof ApiError) {
        setNotificationError(error.details[0] ?? error.message);
      } else {
        setNotificationError("알림을 불러오지 못했습니다.");
      }
    } finally {
      setIsNotificationsLoading(false);
    }
  }

  function handleNotificationRead(updated: AppNotification) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === updated.id ? updated : notification,
      ),
    );
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <header className="rounded-[34px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.92)] px-5 py-4 shadow-[0_28px_80px_var(--color-shadow)] backdrop-blur md:px-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-8">
          <div>
            <Link href="/" className="text-[2rem] font-semibold tracking-[-0.05em] text-[var(--color-ink)]">
              TeamFlow
            </Link>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              태스크, 공유, 댓글, 알림을 한눈에 정리하는 가벼운 협업 워크스페이스
            </p>
          </div>

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
        </div>

        <div className="flex flex-col items-start gap-3 xl:items-end">
          {session ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((current) => !current)}
                  className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-line-strong)] hover:bg-white"
                >
                  알림{unreadCount > 0 ? ` (${unreadCount})` : ""}
                </button>
                {isNotificationOpen ? (
                  <NotificationPanel
                    notifications={notifications}
                    errorMessage={notificationError}
                    isLoading={isNotificationsLoading}
                    onRefresh={() => void refreshNotifications()}
                    onNotificationRead={handleNotificationRead}
                  />
                ) : null}
              </div>
              <span className="rounded-full bg-[var(--color-accent-soft)] px-4 py-2 font-semibold text-[var(--color-accent-strong)]">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-surface)]"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <span className="text-sm text-[var(--color-ink-soft)]">
              로그인 후 보호 페이지에 접근할 수 있습니다.
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-[var(--color-line)] pt-4 text-sm text-[var(--color-ink-soft)] lg:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-[24px] bg-[var(--color-surface)] px-4 py-3">
          {session
            ? "로컬 세션 기반으로 보호 페이지에 접근 중입니다. 알림은 30초 간격으로 재조회됩니다."
            : "로그인 페이지에서 샘플 계정으로 세션을 만들 수 있습니다."}
        </div>
        <div className="rounded-[24px] bg-[var(--color-surface)] px-4 py-3 font-medium">
          API Base URL: {apiBaseUrl}
        </div>
      </div>
    </header>
  );
}
