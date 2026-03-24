import { apiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/client";
import { readSession } from "@/lib/session";
import type { TaskComment, TaskCommentCreateRequest } from "@/types/comment";

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

export async function getTaskComments(taskId: number) {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/comments`, {
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

  return (await response.json()) as TaskComment[];
}

export async function createTaskComment(taskId: number, request: TaskCommentCreateRequest) {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/comments`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify(request),
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

  return (await response.json()) as TaskComment;
}
