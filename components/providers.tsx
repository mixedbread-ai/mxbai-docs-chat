import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConversationProvider } from "@/contexts/conversation-context";
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
        <InitialMessageProvider>
          <ConversationProvider>{children}</ConversationProvider>
        </InitialMessageProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
