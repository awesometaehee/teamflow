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

export type TaskUser = {
  id: number;
  name: string;
  email: string;
};

export type TaskDetail = {
  id: number;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  creator: TaskUser;
  assignee?: TaskUser | null;
  sharedUsers: TaskUser[];
};

export type TaskCreateRequest = {
  title: string;
  description?: string;
  dueAt?: string;
};

export type TaskUpdateRequest = {
  title: string;
  description?: string;
  dueAt?: string | null;
  assigneeId?: number | null;
};

export type TaskStatusUpdateRequest = {
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export type TaskShareCreateRequest = {
  userId: number;
};

export type SharedTaskGroups = {
  assignedTasks: TaskSummary[];
  sharedTasks: TaskSummary[];
};
