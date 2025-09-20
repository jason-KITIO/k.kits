import { z } from "zod";

export const notificationCreateSchema = z.object({
  userId: z.string(),
  type: z.enum(["system", "alert", "info", "create"]),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  persistent: z.boolean().default(false),
  actionRequired: z.boolean().default(false),
  relatedEntity: z.string().optional(),
  relatedId: z.string().optional(),
});

export const notificationUpdateSchema = z.object({
  read: z.boolean(),
});

export const notificationBulkCreateSchema = z.object({
  userIds: z.array(z.string()),
  type: z.enum(["system", "alert", "info", "create"]),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  persistent: z.boolean().default(false),
  actionRequired: z.boolean().default(false),
  relatedEntity: z.string().optional(),
  relatedId: z.string().optional(),
});

export const notificationFilterSchema = z.object({
  type: z.enum(["system", "alert", "info", "create"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  read: z.boolean().optional(),
  persistent: z.boolean().optional(),
  actionRequired: z.boolean().optional(),
});

export type NotificationCreateInput = z.infer<typeof notificationCreateSchema>;
export type NotificationUpdateInput = z.infer<typeof notificationUpdateSchema>;
export type NotificationBulkCreateInput = z.infer<typeof notificationBulkCreateSchema>;
export type NotificationFilterInput = z.infer<typeof notificationFilterSchema>;