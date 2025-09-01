// components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "auto">(
    "light"
  );

  const themes = [
    { id: "light", name: "Light Mode" },
    { id: "dark", name: "Dark Mode (Preview)" },
    // { id: "auto", name: "Auto (Sync with OS)" },
  ];

  return (
    <div className="flex space-x-4 justify-center">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => {
            setActiveTheme(theme.id as "light" | "dark" | "auto");
            setTheme(theme.id as "light" | "dark" | "auto");
          }}
          className={`
            border-2 rounded-lg p-4 flex-1 text-center 
            transition-all duration-200
            ${
              activeTheme === theme.id
                ? "border-primary ring-2 ring-primary"
                : "border-gray-300"
            }
          `}
        >
          <span className="block font-semibold text-gray-800">
            {theme.name}
          </span>
          <div className="w-full mb-2 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
            <Image
              src={`/themes/${theme.id}.svg`}
              alt={`${theme.name} Preview`}
              width={1000000}
              height={1000000}
              className="h-full object-contain"
            />
          </div>
          {activeTheme === theme.id && (
            <span className="block text-primary text-sm mt-1">ACTIVE</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
