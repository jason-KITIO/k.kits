"use client";

import { useState } from "react";

export function usePasswordToggle() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  return { show, toggle };
}
