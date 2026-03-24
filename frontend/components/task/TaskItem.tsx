import type { TaskSummary } from "@/types/task";

function formatDateLabel(value?: string | null) {
  if (!value) {
    return "마감일 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

const statusLabel = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
} as const;

type TaskItemProps = {
  task: TaskSummary;
  onClick: (task: TaskSummary) => void;
};

export function TaskItem({ task, onClick }: TaskItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(task)}
        className="w-full rounded-[28px] border border-[var(--color-line)] bg-white px-5 py-5 text-left shadow-[0_18px_44px_rgba(15,23,47,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--color-line-strong)] hover:shadow-[0_24px_56px_rgba(0,107,255,0.12)]"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--color-accent-strong)]">
                {statusLabel[task.status]}
              </span>
              <h3 className="text-base font-semibold text-[var(--color-ink)]">{task.title}</h3>
              <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                댓글 {task.commentCount}개
              </span>
            </div>
            {task.description ? (
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{task.description}</p>
            ) : null}
          </div>

          <div className="text-sm text-[var(--color-ink-soft)]">
            <div className="rounded-full bg-[var(--color-surface)] px-3 py-1.5 font-medium">
              마감 {formatDateLabel(task.dueAt)}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
