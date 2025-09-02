import { z } from "zod";

export const notificationCreateSchema = z.object({
  userId: z.string(),
  type: z.enum(["STOCK_LOW", "SALE_COMPLETED", "ORDER_RECEIVED", "SYSTEM_UPDATE"]),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const notificationUpdateSchema = z.object({
  read: z.boolean(),
});

export type NotificationCreateInput = z.infer<typeof notificationCreateSchema>;
export type NotificationUpdateInput = z.infer<typeof notificationUpdateSchema>;