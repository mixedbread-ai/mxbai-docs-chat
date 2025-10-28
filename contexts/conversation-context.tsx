"use client";

import { createContext, use, useState } from "react";

export type ConversationContextType = {
  conversation: string;
  setConversation: React.Dispatch<React.SetStateAction<string>>;
};

export const ConversationContext =
  createContext<ConversationContextType | null>(null);

export function useConversation() {
  const context = use(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider",
    );
  }
  return context;
}

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversation, setConversation] = useState("");

  return (
    <ConversationContext.Provider value={{ conversation, setConversation }}>
      {children}
    </ConversationContext.Provider>
  );
}
