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
      <div className="overflow-hidden rounded-[36px] border border-[var(--color-line)] bg-white shadow-[0_32px_90px_var(--color-shadow)]">
        <div className="bg-[linear-gradient(135deg,#ffffff_0%,#f1f7ff_55%,#e7f0ff_100%)] px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            공유 워크스페이스
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
            맡은 일과 공유된 일을 맥락 손실 없이 나눠서 봅니다.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-ink-soft)]">
            하나의 큰 헤드라인, 차분한 요약 카드, 두 개의 명확한 컬럼으로 구성해 빠르게 훑어볼 수 있게 했습니다.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-[var(--color-line)] bg-white p-7 shadow-[0_24px_70px_var(--color-shadow)]">
          <div className="flex items-end justify-between gap-4 border-b border-[var(--color-line)] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                나에게 할당됨
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                지금 내가 다음 액션을 책임지는 태스크입니다.
              </h2>
            </div>
            <div className="rounded-[22px] bg-[var(--color-surface)] px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                Count
              </p>
              <p className="mt-1 text-2xl font-semibold">{groups.assignedTasks.length}</p>
            </div>
          </div>
          <div className="mt-6">
            <TaskList
              tasks={groups.assignedTasks}
              isLoading={isLoading}
              errorMessage={errorMessage}
              emptyMessage="나에게 직접 할당된 태스크가 없습니다."
              onSelectTask={setSelectedTask}
            />
          </div>
        </div>

        <div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-surface)] p-7 shadow-[0_24px_70px_var(--color-shadow)]">
          <div className="flex items-end justify-between gap-4 border-b border-[var(--color-line)] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                나에게 공유됨
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                작성자와 함께 맥락을 보고 댓글로 협업할 수 있는 태스크입니다.
              </h2>
            </div>
            <div className="rounded-[22px] bg-white px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                Count
              </p>
              <p className="mt-1 text-2xl font-semibold">{groups.sharedTasks.length}</p>
            </div>
          </div>
          <div className="mt-6">
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
