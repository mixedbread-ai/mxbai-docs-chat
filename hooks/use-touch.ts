"use client";

import { useEffect, useState } from "react";

/**
 * Custom React hook that detects if the user is on a touch device
 * @returns {boolean} - Returns true if user is on a touch device, false otherwise
 */
export function useTouch(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    const mediaQuery = window.matchMedia("(pointer: coarse)");

    function updateIsTouch(event: MediaQueryListEvent): void {
      setIsTouch(event.matches);
    }

    mediaQuery.addEventListener("change", updateIsTouch);

    return () => {
      mediaQuery.removeEventListener("change", updateIsTouch);
    };
  }, []);

  return isTouch;
}
