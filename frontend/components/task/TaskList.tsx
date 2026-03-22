import { TaskItem } from "@/components/task/TaskItem";
import type { TaskSummary } from "@/types/task";

type TaskListProps = {
  tasks: TaskSummary[];
  isLoading: boolean;
  errorMessage: string;
  emptyMessage: string;
};

export function TaskList({
  tasks,
  isLoading,
  errorMessage,
  emptyMessage,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] bg-[rgba(255,255,255,0.65)] px-5 py-8 text-sm text-[var(--color-ink-soft)]">
        태스크를 불러오는 중입니다.
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-[#ef9a9a] bg-[#fff1f2] px-5 py-8 text-sm text-[#9f1239]">
        {errorMessage}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-[rgba(255,255,255,0.5)] px-5 py-10 text-sm text-[var(--color-ink-soft)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
