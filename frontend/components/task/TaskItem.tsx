import type { TaskSummary } from "@/types/task";

function formatDateLabel(value?: string | null) {
  if (!value) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

const statusLabel = {
  TODO: "TODO",
  IN_PROGRESS: "IN PROGRESS",
  DONE: "DONE",
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
        className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-4 text-left transition hover:border-[var(--color-accent)] hover:bg-white"
      >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[var(--color-ink-soft)]">
              {statusLabel[task.status]}
            </span>
            <h3 className="text-base font-semibold text-[var(--color-ink)]">{task.title}</h3>
          </div>
          {task.description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{task.description}</p>
          ) : null}
        </div>

        <div className="text-sm text-[var(--color-ink-soft)]">
          Due {formatDateLabel(task.dueAt)}
        </div>
      </div>
      </button>
    </li>
  );
}
