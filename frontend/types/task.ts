export type TaskFilter = "today" | "upcoming" | "all" | "done";

export type TaskSummary = {
  id: number;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskCreateRequest = {
  title: string;
  description?: string;
  dueAt?: string;
};
