"use client";

import { useEffect, useState } from "react";
import { createTaskComment, getTaskComments } from "@/lib/api/comments";
import { ApiError } from "@/lib/api/client";
import { readSession } from "@/lib/session";
import { addTaskShare, deleteTask, getTask, removeTaskShare, updateTask, updateTaskStatus } from "@/lib/api/tasks";
import type { TaskComment } from "@/types/comment";
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

const statusLabel = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
} as const;

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
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [areCommentsLoading, setAreCommentsLoading] = useState(false);
  const session = readSession();
  const currentUserId = session?.user.id ?? null;
  const canManageShares = detail && currentUserId === detail.creator.id;

  useEffect(() => {
    if (!selectedTask) {
      setDetail(null);
      setComments([]);
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
        setCommentContent("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.details[0] ?? error.message);
        } else {
          setErrorMessage("상세 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    async function loadComments() {
      setAreCommentsLoading(true);

      try {
        const nextComments = await getTaskComments(taskId);
        if (cancelled) {
          return;
        }

        setComments(nextComments);
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.details[0] ?? error.message);
        } else {
          setErrorMessage("댓글을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setAreCommentsLoading(false);
        }
      }
    }

    void loadDetail();
    void loadComments();

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

  async function handleCreateComment() {
    if (!detail || !commentContent.trim()) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const createdComment = await createTaskComment(detail.id, {
        content: commentContent,
      });
      const updatedDetail = {
        ...detail,
        commentCount: detail.commentCount + 1,
      };

      setComments((currentComments) => [...currentComments, createdComment]);
      setCommentContent("");
      setDetail(updatedDetail);
      onTaskUpdated(updatedDetail);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("댓글을 등록하지 못했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(15,23,47,0.22)] backdrop-blur-[2px]">
      <div className="h-full w-full max-w-[720px] overflow-y-auto border-l border-[var(--color-line)] bg-[rgba(247,250,255,0.98)] p-6 shadow-[-30px_0_90px_rgba(15,23,47,0.14)]">
        <div className="overflow-hidden rounded-[34px] border border-[var(--color-line)] bg-white shadow-[0_28px_80px_var(--color-shadow)]">
          <div className="border-b border-[var(--color-line)] bg-[linear-gradient(135deg,#ffffff_0%,#f1f7ff_55%,#e7f0ff_100%)] px-7 py-7">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  태스크 상세
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--color-ink)]">
                  {detail?.title ?? "불러오는 중"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
                  태스크를 열어두고 담당자, 공유 대상, 댓글, 상태를 한 자리에서 정리합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:border-[var(--color-line-strong)] hover:bg-[var(--color-surface)]"
              >
                닫기
              </button>
            </div>
          </div>

          <div className="px-7 py-7">
            {isLoading ? (
              <div className="rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-6 text-sm text-[var(--color-ink-soft)]">
                태스크 상세를 불러오는 중입니다.
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-4 rounded-[24px] border border-[#ef9a9a] bg-[#fff1f2] px-4 py-3 text-sm text-[#9f1239]">
                {errorMessage}
              </div>
            ) : null}

            {detail && !isLoading ? (
              <div className="space-y-5">
                <div className="grid gap-4 rounded-[30px] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,47,0.05)]">
                  <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">제목</label>
                      <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">담당자 ID</label>
                      <input
                        value={assigneeId}
                        onChange={(event) => setAssigneeId(event.target.value)}
                        placeholder="예: 2"
                        className="w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">설명</label>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={5}
                      className="w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--color-ink-soft)]">마감 일시</label>
                      <input
                        type="datetime-local"
                        value={dueAt}
                        onChange={(event) => setDueAt(event.target.value)}
                        className="w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
                      />
                    </div>
                    <div className="rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 text-sm text-[var(--color-ink-soft)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                        상태 요약
                      </p>
                      <div className="mt-3 space-y-2">
                        <div>작성자: {detail.creator.name}</div>
                        <div>담당자: {detail.assignee ? detail.assignee.name : "미지정"}</div>
                        <div>공유 대상: {detail.sharedUsers.length > 0 ? detail.sharedUsers.map((user) => user.name).join(", ") : "없음"}</div>
                        <div>상태: {statusLabel[detail.status]}</div>
                        <div>댓글 수: {detail.commentCount}</div>
                        <div>완료 시각: {detail.completedAt ?? "아직 완료되지 않음"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-[22px] bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(0,107,255,0.24)] transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSaving ? "저장 중..." : "변경 저장"}
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSaving}
                      className="rounded-[22px] border border-[#ef9a9a] bg-white px-5 py-3 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="rounded-[30px] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,47,0.05)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        상태 변경
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                        작업 흐름에 맞춰 현재 상태를 빠르게 전환합니다.
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                      현재 {statusLabel[detail.status]}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => void handleStatusChange(status)}
                        disabled={isSaving}
                        className={
                          detail.status === status
                            ? "rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(0,107,255,0.2)]"
                            : "rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:bg-white"
                        }
                      >
                        {statusLabel[status]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,47,0.05)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        공유 대상
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                        담당자는 실행 책임을 가지며, 공유 대상은 맥락을 보고 댓글로 협업합니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {detail.sharedUsers.length > 0 ? (
                      detail.sharedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm"
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
                              제거
                            </button>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-[var(--color-line)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
                        아직 공유된 사용자가 없습니다.
                      </div>
                    )}

                    {canManageShares ? (
                      <div className="flex flex-col gap-3 md:flex-row">
                        <input
                          value={shareUserId}
                          onChange={(event) => setShareUserId(event.target.value)}
                          placeholder="추가할 사용자 ID"
                          className="flex-1 rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddShare}
                          disabled={isSaving || !shareUserId}
                          className="rounded-[22px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-line-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          공유 추가
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-[var(--color-line)] px-4 py-4 text-sm text-[var(--color-ink-soft)]">
                        공유 대상 편집은 작성자만 가능합니다.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[30px] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,47,0.05)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        댓글
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                        작성자, 담당자, 공유 대상만 댓글을 남길 수 있습니다.
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                      총 {detail.commentCount}개
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <textarea
                      value={commentContent}
                      onChange={(event) => setCommentContent(event.target.value)}
                      rows={3}
                      placeholder="진행 상황이나 맥락을 남겨두세요."
                      className="w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-line-strong)] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCreateComment}
                      disabled={isSaving || !commentContent.trim()}
                      className="self-start rounded-[22px] bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(0,107,255,0.24)] transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      댓글 남기기
                    </button>
                  </div>

                  <div className="mt-5">
                    {areCommentsLoading ? (
                      <div className="rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
                        댓글을 불러오는 중입니다.
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="rounded-[24px] border border-dashed border-[var(--color-line)] px-4 py-5 text-sm text-[var(--color-ink-soft)]">
                        아직 댓글이 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold text-[var(--color-ink)]">
                                {comment.author.name}
                              </div>
                              <div className="text-xs text-[var(--color-ink-soft)]">
                                {new Intl.DateTimeFormat("ko-KR", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                }).format(new Date(comment.createdAt))}
                              </div>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
                              {comment.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
