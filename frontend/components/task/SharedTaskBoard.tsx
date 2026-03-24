"use client";

import { useEffect, useState } from "react";
import { TaskDetailDrawer } from "@/components/task/TaskDetailDrawer";
import { TaskList } from "@/components/task/TaskList";
import { ApiError } from "@/lib/api/client";
import { getSharedTasks } from "@/lib/api/tasks";
import type { SharedTaskGroups, TaskDetail, TaskSummary } from "@/types/task";

const emptyGroups: SharedTaskGroups = {
  assignedTasks: [],
  sharedTasks: [],
};

export function SharedTaskBoard() {
  const [groups, setGroups] = useState<SharedTaskGroups>(emptyGroups);
  const [selectedTask, setSelectedTask] = useState<TaskSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void refreshGroups();
  }, []);

  async function refreshGroups() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextGroups = await getSharedTasks();
      setGroups(nextGroups);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.details[0] ?? error.message);
      } else {
        setErrorMessage("공유 태스크를 불러오지 못했습니다.");
      }
    } finally {
      setIsLoading(false);
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
    void refreshGroups();
  }

  function handleTaskDeleted(taskId: number) {
    setGroups((currentGroups) => ({
      assignedTasks: currentGroups.assignedTasks.filter((task) => task.id !== taskId),
      sharedTasks: currentGroups.sharedTasks.filter((task) => task.id !== taskId),
    }));
    setSelectedTask(null);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.78)] p-8 shadow-[0_24px_80px_rgba(16,24,47,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
          Phase 4
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
          나에게 할당된 일과 공유된 일을 한 화면에서 분리해 본다.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-ink-soft)]">
          `/shared`는 담당자로 지정된 태스크와 읽기 협업용으로 공유된 태스크를 구분해 보여준다. 각 항목은
          상세 패널에서 바로 상태를 바꾸거나 공유 대상을 편집할 수 있다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
            Assigned To Me
          </p>
          <div className="mt-5">
            <TaskList
              tasks={groups.assignedTasks}
              isLoading={isLoading}
              errorMessage={errorMessage}
              emptyMessage="나에게 직접 할당된 태스크가 없습니다."
              onSelectTask={setSelectedTask}
            />
          </div>
        </div>

        <div className="rounded-[32px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.72)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
            Shared With Me
          </p>
          <div className="mt-5">
            <TaskList
              tasks={groups.sharedTasks}
              isLoading={isLoading}
              errorMessage={errorMessage}
              emptyMessage="나에게 공유된 태스크가 없습니다."
              onSelectTask={setSelectedTask}
            />
          </div>
        </div>
      </div>

      <TaskDetailDrawer
        selectedTask={selectedTask}
        onClose={() => setSelectedTask(null)}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </section>
  );
}
