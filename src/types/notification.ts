export interface NotificationType {
  id: string;
  userId: string;
  organizationId: string;
  type: "system" | "alert" | "info" | "create";
  title: string;
  message: string;
  read: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  persistent: boolean;
  actionRequired: boolean;
  relatedEntity?: string;
  relatedId?: string;
  createdAt: Date;
}

export type NotificationPriority = NotificationType["priority"];
export type NotificationTypeEnum = NotificationType["type"];