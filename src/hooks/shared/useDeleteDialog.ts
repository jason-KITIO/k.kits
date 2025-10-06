"use client";

import { useState } from "react";

export function useDeleteDialog<T>() {
  const [dialog, setDialog] = useState<{ open: boolean; item: T | null }>({
    open: false,
    item: null,
  });

  const openDialog = (item: T) => setDialog({ open: true, item });
  const closeDialog = () => setDialog({ open: false, item: null });

  return { dialog, openDialog, closeDialog };
}
