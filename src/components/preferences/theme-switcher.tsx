// components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flushSync } from "react-dom";

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const changeThemeWithAnimation = async (newTheme: string, buttonElement: HTMLButtonElement | null) => {
    if (!buttonElement || !document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } = buttonElement.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { 
      id: "light", 
      name: "Mode Clair", 
      icon: Sun,
      description: "Interface claire et lumineuse"
    },
    { 
      id: "dark", 
      name: "Mode Sombre", 
      icon: Moon,
      description: "Interface sombre pour les yeux"
    },
    { 
      id: "system", 
      name: "Système", 
      icon: Monitor,
      description: "Suit les préférences du système"
    },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <div key={themeOption.id} className="p-4 border rounded-lg animate-pulse">
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isActive = theme === themeOption.id;
        
        return (
          <Button
            key={themeOption.id}
            variant={isActive ? "default" : "outline"}
            ref={(el) => {
              buttonRefs.current[themeOption.id] = el;
            }}
            onClick={() => {
              changeThemeWithAnimation(themeOption.id, buttonRefs.current[themeOption.id]);
            }}
            className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 ${
              isActive 
                ? "ring-2 ring-primary ring-offset-2" 
                : "hover:bg-muted/50"
            }`}
          >
            <div className={`p-3 rounded-full transition-all duration-200 ${
              isActive 
                ? "bg-primary-foreground" 
                : "bg-muted"
            }`}>
              <Icon className={`h-6 w-6 transition-all duration-200 ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`} />
            </div>
            <div className="text-center">
              <div className={`font-semibold ${
                isActive ? "text-primary-foreground" : "text-foreground"
              }`}>
                {themeOption.name}
              </div>
              <div className={`text-xs mt-1 ${
                isActive 
                  ? "text-primary-foreground/80" 
                  : "text-muted-foreground"
              }`}>
                {themeOption.description}
              </div>
              {isActive && (
                <div className="text-xs font-medium mt-2 text-primary-foreground">
                  ACTIF
                </div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
