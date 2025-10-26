"use client";

import { useTheme } from "next-themes";
import { Half2Icon } from "@/components/icons/half2-icon";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground"
      onClick={toggleTheme}
    >
      <Half2Icon className="size-4.25" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
