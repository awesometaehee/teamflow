import { apiBaseUrl } from "@/lib/api/config";
import { postJson, ApiError } from "@/lib/api/client";
import { readSession } from "@/lib/session";
import type {
  SharedTaskGroups,
  TaskCreateRequest,
  TaskDetail,
  TaskFilter,
  TaskShareCreateRequest,
  TaskStatusUpdateRequest,
  TaskSummary,
  TaskUpdateRequest,
} from "@/types/task";

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

export async function getTask(taskId: number) {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
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

  return (await response.json()) as TaskDetail;
}

export async function updateTask(taskId: number, request: TaskUpdateRequest) {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
    method: "PUT",
    headers,
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

  return (await response.json()) as TaskDetail;
}

export async function updateTaskStatus(taskId: number, request: TaskStatusUpdateRequest) {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/status`, {
    method: "PATCH",
    headers,
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

  return (await response.json()) as TaskDetail;
}

export async function deleteTask(taskId: number) {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
    method: "DELETE",
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
}

export async function getSharedTasks() {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/shared`, {
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

  return (await response.json()) as SharedTaskGroups;
}

export async function addTaskShare(taskId: number, request: TaskShareCreateRequest) {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/shares`, {
    method: "POST",
    headers,
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

  return (await response.json()) as TaskDetail;
}

export async function removeTaskShare(taskId: number, userId: number) {
  const headers = createHeaders();
  const response = await fetch(`${apiBaseUrl}/api/tasks/${taskId}/shares/${userId}`, {
    method: "DELETE",
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

  return (await response.json()) as TaskDetail;
}
