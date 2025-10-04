import { z } from "zod";

export const stockTransferSchema = z.object({
  fromWarehouseId: z.string().min(1, "Entrepôt source requis"),
  toWarehouseId: z.string().min(1, "Entrepôt destination requis"),
  items: z.array(z.object({
    productId: z.string().min(1, "ID produit requis"),
    quantity: z.number().positive("La quantité doit être positive"),
  })).min(1, "Au moins un produit doit être sélectionné"),
  reason: z.string().optional(),
}).refine(
  (data) => data.fromWarehouseId !== data.toWarehouseId,
  {
    message: "L'entrepôt source et destination doivent être différents",
    path: ["toWarehouseId"],
  }
);

export type StockTransferData = z.infer<typeof stockTransferSchema>;