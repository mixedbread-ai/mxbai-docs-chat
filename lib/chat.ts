import { useEffect, useState } from "react";

export function getChatScrollArea() {
  const chatScrollArea = document.querySelector("[data-chat-scroll-area]");
  const chatScrollAreaViewport = chatScrollArea?.querySelector(
    "[data-radix-scroll-area-viewport]",
  );
  return chatScrollAreaViewport;
}

export function scrollToBottom({
  behavior = "smooth",
}: {
  behavior?: ScrollBehavior;
} = {}) {
  const scrollArea = getChatScrollArea();
  if (scrollArea) {
    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      behavior,
    });
  }
}

export function useAtBottom(offset = 0) {
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollArea = getChatScrollArea();

    if (!scrollArea) return;

    const handleScroll = () => {
      const scrollTop = scrollArea.scrollTop;
      const scrollHeight = scrollArea.scrollHeight;
      const clientHeight = scrollArea.clientHeight;

      // Check if we're at the bottom (with optional offset for threshold)
      const atBottom = scrollTop + clientHeight >= scrollHeight - offset;

      setIsAtBottom(atBottom);
    };

    handleScroll();

    scrollArea.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollArea.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  return isAtBottom;
}

// Hook that tracks if auto-scroll should be enabled
// Auto-scroll is disabled when user manually scrolls and re-enabled when they scroll to bottom
export function useAutoScroll() {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollArea = getChatScrollArea();

    if (!scrollArea) return;

    const handleScroll = () => {
      const scrollTop = scrollArea.scrollTop;
      const scrollHeight = scrollArea.scrollHeight;
      const clientHeight = scrollArea.clientHeight;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (atBottom) {
        // Re-enable auto-scroll when user scrolls to bottom
        setShouldAutoScroll(true);
      } else {
        // Disable auto-scroll when user scrolls away from bottom
        setShouldAutoScroll(false);
      }
    };

    scrollArea.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollArea.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return shouldAutoScroll;
}
