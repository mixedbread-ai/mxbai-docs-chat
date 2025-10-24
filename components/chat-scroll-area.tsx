"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { scrollToBottom, useAutoScroll } from "@/lib/chat";
import { cn } from "@/lib/utils";

interface ChatScrollAreaProps extends React.ComponentProps<typeof ScrollArea> {
  messages: UIMessage[];
  isStreaming: boolean;
}

export function ChatScrollArea({
  children,
  className,
  messages,
  isStreaming,
  ...props
}: ChatScrollAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useAutoScroll();

  // Auto-scroll only when auto-scroll is enabled
  // (disabled when user manually scrolls, re-enabled when they scroll to bottom)
  // biome-ignore lint/correctness/useExhaustiveDependencies: -
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom({ behavior: "instant" });
    }
  }, [messages, isStreaming]);

  return (
    <ScrollArea
      ref={scrollAreaRef}
      data-chat-scroll-area
      className={cn("h-svh w-screen", className)}
      {...props}
    >
      {children}
    </ScrollArea>
  );
}
