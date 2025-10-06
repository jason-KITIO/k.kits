import { useState } from "react";

export function useWarehouseDialogs() {
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [storeTransferDialogOpen, setStoreTransferDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);

  return {
    adjustmentDialogOpen,
    setAdjustmentDialogOpen,
    orderDialogOpen,
    setOrderDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    transferDialogOpen,
    setTransferDialogOpen,
    storeTransferDialogOpen,
    setStoreTransferDialogOpen,
    restockDialogOpen,
    setRestockDialogOpen,
  };
}
