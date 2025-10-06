"use client";

import { useState } from "react";

type ViewMode = "cards" | "table";

export function useViewMode(defaultMode: ViewMode = "cards") {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);
  const toggleView = () => setViewMode(prev => prev === "cards" ? "table" : "cards");
  return { viewMode, setViewMode, toggleView };
}
