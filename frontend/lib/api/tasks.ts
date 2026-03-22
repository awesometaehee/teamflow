import { apiBaseUrl } from "@/lib/api/config";
import { postJson, ApiError } from "@/lib/api/client";
import { readSession } from "@/lib/session";
import type { TaskCreateRequest, TaskFilter, TaskSummary } from "@/types/task";

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

export async function createTask(request: TaskCreateRequest) {
  const headers = createHeaders();

  return postJson<TaskSummary, TaskCreateRequest>(
    `${apiBaseUrl}/api/tasks`,
    request,
    headers,
  );
}

export async function getMyTasks(filter: TaskFilter) {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/my?filter=${filter}`, {
    method: "GET",
    headers,
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

  return (await response.json()) as TaskSummary[];
}
