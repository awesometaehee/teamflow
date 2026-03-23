"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { readSession } from "@/lib/session";
import { addTaskShare, deleteTask, getTask, removeTaskShare, updateTask, updateTaskStatus } from "@/lib/api/tasks";
import type { TaskDetail, TaskStatusUpdateRequest, TaskSummary, TaskUpdateRequest } from "@/types/task";

type TaskDetailDrawerProps = {
  selectedTask: TaskSummary | null;
  onClose: () => void;
  onTaskUpdated: (task: TaskDetail) => void;
  onTaskDeleted: (taskId: number) => void;
};

function toInputDateTime(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
}

export function TaskDetailDrawer({
  selectedTask,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}: TaskDetailDrawerProps) {
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [shareUserId, setShareUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const session = readSession();
  const currentUserId = session?.user.id ?? null;
  const canManageShares = detail && currentUserId === detail.creator.id;

  useEffect(() => {
    if (!selectedTask) {
      setDetail(null);
      setErrorMessage("");
      return;
    }

    const taskId = selectedTask.id;
    let cancelled = false;

    async function loadDetail() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextDetail = await getTask(taskId);
        if (cancelled) {
          return;
        }

        setDetail(nextDetail);
        setTitle(nextDetail.title);
        setDescription(nextDetail.description ?? "");
        setDueAt(toInputDateTime(nextDetail.dueAt));
        setAssigneeId(nextDetail.assignee ? String(nextDetail.assignee.id) : "");
        setShareUserId("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.details[0] ?? error.message);
        } else {
          setErrorMessage("태스크 상세를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedTask]);

  if (!selectedTask) {
    return null;
  }

  async function handleSave() {
    if (!detail) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const request: TaskUpdateRequest = {
      title,
      description,
      dueAt: dueAt ? new Date(dueAt).toISOString().slice(0, 19) : null,
      assigneeId: assigneeId ? Number(assigneeId) : null,
    };

    try {
      const updated = await updateTask(detail.id, request);
      setDetail(updated);
      onTaskUpdated(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("태스크를 저장하지 못했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(status: TaskStatusUpdateRequest["status"]) {
    if (!detail) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updated = await updateTaskStatus(detail.id, { status });
      setDetail(updated);
      onTaskUpdated(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("상태를 변경하지 못했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!detail) {
      return;
    }

    const confirmed = window.confirm("이 태스크를 삭제할까요?");
    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await deleteTask(detail.id);
      onTaskDeleted(detail.id);
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("태스크를 삭제하지 못했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddShare() {
    if (!detail || !shareUserId) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updated = await addTaskShare(detail.id, { userId: Number(shareUserId) });
      setDetail(updated);
      setShareUserId("");
      onTaskUpdated(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("공유 사용자를 추가하지 못했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveShare(userId: number) {
    if (!detail) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updated = await removeTaskShare(detail.id, userId);
      setDetail(updated);
      onTaskUpdated(updated);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("공유 사용자를 삭제하지 못했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(16,24,47,0.22)] backdrop-blur-[1px]">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-[var(--color-line)] bg-[rgba(248,246,239,0.98)] p-6 shadow-[-24px_0_80px_rgba(16,24,47,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
              Task Detail
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              {detail?.title ?? "Loading..."}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--color-line)] px-3 py-1 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:bg-white"
          >
            Close
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-6 text-sm text-[var(--color-ink-soft)]">
            태스크 상세를 불러오는 중입니다.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-[#ef9a9a] bg-[#fff1f2] px-4 py-3 text-sm text-[#9f1239]">
            {errorMessage}
          </div>
        ) : null}

        {detail && !isLoading ? (
          <div className="mt-6 space-y-5">
            <div className="grid gap-4 rounded-[28px] border border-[var(--color-line)] bg-white p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">Title</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">Due At</label>
                  <input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(event) => setDueAt(event.target.value)}
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">Assignee ID</label>
                  <input
                    value={assigneeId}
                    onChange={(event) => setAssigneeId(event.target.value)}
                    placeholder="예: 2"
                    className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-ink-soft)]">
                <div>Creator: {detail.creator.name}</div>
                <div>Assignee: {detail.assignee ? detail.assignee.name : "Unassigned"}</div>
                <div>
                  Shared Users:{" "}
                  {detail.sharedUsers.length > 0
                    ? detail.sharedUsers.map((user) => user.name).join(", ")
                    : "No shared users"}
                </div>
                <div>Status: {detail.status}</div>
                <div>Completed At: {detail.completedAt ?? "Not completed"}</div>
              </div>

              <div className="grid gap-4 rounded-[28px] border border-[var(--color-line)] bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink-soft)]">Shared Users</p>
                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                      담당자는 별도 역할로 유지하고, 공유 대상은 읽기 협업용으로 관리합니다.
                    </p>
                  </div>
                </div>

                {detail.sharedUsers.length > 0 ? (
                  <div className="space-y-2">
                    {detail.sharedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm"
                      >
                        <div>
                          <div className="font-semibold text-[var(--color-ink)]">{user.name}</div>
                          <div className="text-[var(--color-ink-soft)]">{user.email}</div>
                        </div>
                        {canManageShares ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveShare(user.id)}
                            disabled={isSaving}
                            className="rounded-full border border-[#ef9a9a] px-3 py-1 text-xs font-semibold text-[#9f1239] transition hover:bg-[#fff1f2] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--color-line)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
                    아직 공유된 사용자가 없습니다.
                  </div>
                )}

                {canManageShares ? (
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      value={shareUserId}
                      onChange={(event) => setShareUserId(event.target.value)}
                      placeholder="공유할 사용자 ID"
                      className="flex-1 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]"
                    />
                    <button
                      type="button"
                      onClick={handleAddShare}
                      disabled={isSaving || !shareUserId}
                      className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Add Share
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--color-line)] px-4 py-4 text-sm text-[var(--color-ink-soft)]">
                    공유 대상 편집은 작성자만 가능합니다.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="rounded-2xl border border-[#ef9a9a] bg-white px-4 py-3 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--color-line)] bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                Change Status
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void handleStatusChange(status)}
                    disabled={isSaving}
                    className={
                      detail.status === status
                        ? "rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white"
                        : "rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-surface)]"
                    }
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
