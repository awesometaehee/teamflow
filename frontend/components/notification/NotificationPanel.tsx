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
  ASSIGNED: "담당 지정",
  SHARED: "공유",
  COMMENTED: "댓글",
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
    <div className="absolute left-1/2 top-[calc(100%+14px)] z-50 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[30px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.98)] p-4 shadow-[0_30px_80px_rgba(15,23,47,0.18)] backdrop-blur sm:left-auto sm:right-0 sm:w-[24rem] sm:translate-x-0">
      <div className="flex flex-col gap-3 border-b border-[var(--color-line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            알림
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            담당자 변경, 공유, 댓글 같은 활동을 한곳에서 확인합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-white"
        >
          새로고침
        </button>
      </div>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
            알림을 불러오는 중입니다.
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-[24px] border border-[#ef9a9a] bg-[#fff1f2] px-4 py-4 text-sm text-[#9f1239]">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && notifications.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[var(--color-line)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
            아직 알림이 없습니다.
          </div>
        ) : null}

        {!isLoading && !errorMessage
          ? notifications.map((notification) => (
              <div
                key={notification.id}
                className={
                  notification.read
                    ? "rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4"
                    : "rounded-[24px] border border-[var(--color-line-strong)] bg-[var(--color-accent-soft)] px-4 py-4"
                }
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
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

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/my-tasks"
                    className="text-xs font-semibold text-[var(--color-accent)] transition hover:opacity-80"
                  >
                    작업 공간 열기
                  </Link>
                  {!notification.read ? (
                    <button
                      type="button"
                      onClick={() => void handleRead(notification)}
                      className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-line-strong)]"
                    >
                      읽음 처리
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-[var(--color-ink-soft)]">읽음</span>
                  )}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
