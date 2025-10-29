import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWebPromptDeeplink(promptText: string): string {
  const url = new URL("https://v0.dev");
  url.searchParams.set("q", promptText);
  return url.toString();
}
