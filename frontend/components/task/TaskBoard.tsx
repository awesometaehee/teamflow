"use client";

import { startTransition, useEffect, useState } from "react";
import { FilterTabs } from "@/components/common/FilterTabs";
import { TaskDetailDrawer } from "@/components/task/TaskDetailDrawer";
import { QuickAddBar } from "@/components/task/QuickAddBar";
import { TaskList } from "@/components/task/TaskList";
import { createTask, getMyTasks } from "@/lib/api/tasks";
import { ApiError } from "@/lib/api/client";
import type { TaskDetail, TaskFilter, TaskSummary } from "@/types/task";

const emptyStateByFilter: Record<TaskFilter, string> = {
  today: "오늘 마감인 태스크가 없습니다. Quick Add로 첫 항목을 추가해 보세요.",
  upcoming: "예정된 태스크가 없습니다.",
  all: "아직 생성된 태스크가 없습니다.",
  done: "완료된 태스크가 없습니다.",
};

type TaskBoardProps = {
  title: string;
  description: string;
  showQuickAdd: boolean;
  initialFilter: TaskFilter;
};

export function TaskBoard({
  title,
  description,
  showQuickAdd,
  initialFilter,
}: TaskBoardProps) {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>(initialFilter);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextTasks = await getMyTasks(activeFilter);
        if (!cancelled) {
          setTasks(nextTasks);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.details[0] ?? error.message);
        } else {
          setErrorMessage("태스크를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  async function handleCreate(titleValue: string) {
    try {
      const createdTask = await createTask({ title: titleValue });

      startTransition(() => {
        if (activeFilter === "today" || activeFilter === "all") {
          setTasks((currentTasks) => [createdTask, ...currentTasks]);
        } else {
          void refreshTasks(activeFilter);
        }
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.details[0] ?? error.message);
      }

      throw new Error("태스크를 만들지 못했습니다.");
    }
  }

  function handleTaskUpdated(task: TaskDetail) {
    const summary: TaskSummary = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueAt: task.dueAt,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      commentCount: task.commentCount,
    };

    setSelectedTask(summary);
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === summary.id ? summary : currentTask,
      ),
    );

    void refreshTasks(activeFilter);
  }

  function handleTaskDeleted(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== taskId),
    );
    setSelectedTask(null);
  }

  async function refreshTasks(filter: TaskFilter) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextTasks = await getMyTasks(filter);
      setTasks(nextTasks);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("태스크를 불러오지 못했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.78)] p-8 shadow-[0_24px_80px_rgba(16,24,47,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[var(--color-line)] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
              Phase 2
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-ink-soft)]">
              {description}
            </p>
          </div>
          <FilterTabs activeFilter={activeFilter} onChange={setActiveFilter} />
        </div>

        <div className="mt-6">
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            errorMessage={errorMessage}
            emptyMessage={emptyStateByFilter[activeFilter]}
            onSelectTask={setSelectedTask}
          />
        </div>
      </div>

      {showQuickAdd ? <QuickAddBar onCreate={handleCreate} /> : null}

      <TaskDetailDrawer
        selectedTask={selectedTask}
        onClose={() => setSelectedTask(null)}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </section>
  );
}
