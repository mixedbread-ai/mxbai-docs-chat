"use client";

import { createContext, use, useState } from "react";

export type InitialMessageContextType = {
  initialMessage: string;
  setInitialMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const InitialMessageContext =
  createContext<InitialMessageContextType | null>(null);

export function useInitialMessage() {
  const context = use(InitialMessageContext);
  if (!context) {
    throw new Error(
      "useInitialMessage must be used within a InitialMessageProvider",
    );
  }
  return context;
}

export function InitialMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialMessage, setInitialMessage] = useState("");

  return (
    <InitialMessageContext.Provider
      value={{ initialMessage, setInitialMessage }}
    >
      {children}
    </InitialMessageContext.Provider>
  );
}
