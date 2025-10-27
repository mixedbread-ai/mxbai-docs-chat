import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InitialMessageProvider } from "@/contexts/initial-message-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <InitialMessageProvider>{children}</InitialMessageProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
