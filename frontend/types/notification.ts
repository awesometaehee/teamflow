export type NotificationType = "ASSIGNED" | "SHARED" | "COMMENTED";

export type AppNotification = {
  id: number;
  taskId: number;
  taskTitle: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
};
