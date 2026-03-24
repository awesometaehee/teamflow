import type { TaskUser } from "@/types/task";

export type TaskComment = {
  id: number;
  content: string;
  createdAt: string;
  author: TaskUser;
};

export type TaskCommentCreateRequest = {
  content: string;
};
