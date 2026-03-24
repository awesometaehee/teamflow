import { apiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/client";
import { readSession } from "@/lib/session";
import type { AppNotification } from "@/types/notification";

function createHeaders() {
  const session = readSession();

  if (!session) {
    throw new ApiError(401, "로그인이 필요합니다.");
  }

  return {
    "Content-Type": "application/json",
    "X-User-Id": String(session.user.id),
  };
}

export async function getNotifications() {
  const response = await fetch(`${apiBaseUrl}/api/notifications`, {
    method: "GET",
    headers: createHeaders(),
  });

  if (!response.ok) {
    let payload: { message?: string; details?: string[] } | null = null;

    try {
      payload = (await response.json()) as { message?: string; details?: string[] };
    } catch {
      payload = null;
    }

    throw new ApiError(
      response.status,
      payload?.message ?? "Request failed",
      payload?.details ?? [],
    );
  }

  return (await response.json()) as AppNotification[];
}

export async function markNotificationRead(notificationId: number) {
  const response = await fetch(`${apiBaseUrl}/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: createHeaders(),
  });

  if (!response.ok) {
    let payload: { message?: string; details?: string[] } | null = null;

    try {
      payload = (await response.json()) as { message?: string; details?: string[] };
    } catch {
      payload = null;
    }

    throw new ApiError(
      response.status,
      payload?.message ?? "Request failed",
      payload?.details ?? [],
    );
  }

  return (await response.json()) as AppNotification;
}
