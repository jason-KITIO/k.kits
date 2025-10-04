import { z } from "zod";

export const warehouseToStoreTransferSchema = z.object({
  toStoreId: z.string().min(1, "Boutique destination requise"),
  items: z.array(z.object({
    productId: z.string().min(1, "ID produit requis"),
    quantity: z.number().positive("La quantité doit être positive"),
  })).min(1, "Au moins un produit doit être sélectionné"),
  reason: z.string().optional(),
});

export type WarehouseToStoreTransferData = z.infer<typeof warehouseToStoreTransferSchema>;