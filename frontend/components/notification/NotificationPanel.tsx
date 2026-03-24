"use client";

import Link from "next/link";
import { ApiError } from "@/lib/api/client";
import { markNotificationRead } from "@/lib/api/notifications";
import type { AppNotification } from "@/types/notification";

type NotificationPanelProps = {
  notifications: AppNotification[];
  errorMessage: string;
  isLoading: boolean;
  onRefresh: () => void;
  onNotificationRead: (notification: AppNotification) => void;
};

const typeLabel = {
  ASSIGNED: "Assigned",
  SHARED: "Shared",
  COMMENTED: "Commented",
} as const;

export function NotificationPanel({
  notifications,
  errorMessage,
  isLoading,
  onRefresh,
  onNotificationRead,
}: NotificationPanelProps) {
  async function handleRead(notification: AppNotification) {
    try {
      const updated = await markNotificationRead(notification.id);
      onNotificationRead(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        window.alert(error.details[0] ?? error.message);
        return;
      }

      window.alert("알림을 읽음 처리하지 못했습니다.");
    }
  }

  return (
    <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-full max-w-md rounded-[28px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.96)] p-4 shadow-[0_24px_80px_rgba(16,24,47,0.18)] backdrop-blur">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] pb-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            Notifications
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            30초마다 다시 확인합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-surface)]"
        >
          Refresh
        </button>
      </div>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
            알림을 불러오는 중입니다.
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-2xl border border-[#ef9a9a] bg-[#fff1f2] px-4 py-4 text-sm text-[#9f1239]">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-line)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
            아직 알림이 없습니다.
          </div>
        ) : null}

        {!isLoading && !errorMessage
          ? notifications.map((notification) => (
              <div
                key={notification.id}
                className={
                  notification.read
                    ? "rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4"
                    : "rounded-2xl border border-[var(--color-accent)] bg-[rgba(194,65,12,0.06)] px-4 py-4"
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-ink-soft)]">
                    {typeLabel[notification.type]}
                  </span>
                  <span className="text-xs text-[var(--color-ink-soft)]">
                    {new Intl.DateTimeFormat("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(notification.createdAt))}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[var(--color-ink)]">{notification.message}</p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <Link
                    href={`/my-tasks`}
                    className="text-xs font-semibold text-[var(--color-accent)] transition hover:opacity-80"
                  >
                    Open Task
                  </Link>
                  {!notification.read ? (
                    <button
                      type="button"
                      onClick={() => void handleRead(notification)}
                      className="rounded-full border border-[var(--color-line)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-soft)] transition hover:bg-white"
                    >
                      Mark Read
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-[var(--color-ink-soft)]">Read</span>
                  )}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
