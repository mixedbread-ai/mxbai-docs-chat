"use client";

import { useChat } from "@ai-sdk/react";
import { type ChatStatus, DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { ChatScrollArea } from "@/components/chat-scroll-area";
import { ConversationMessage } from "@/components/conversation-message";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What are Cache Components?",
  "How do I fetch data in Server Components?",
  "How do I create Parallel Routes in App Router?",
];

export function Chat() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: [],
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  function handleSuggestionClick(suggestion: string) {
    sendMessage({ text: suggestion });
  }

  return (
    <ChatScrollArea messages={messages} isStreaming={status === "streaming"}>
      <div className="max-w-[95vw] w-2xl mx-auto">
        <div
          className={cn(
            "flex flex-col h-svh justify-center gap-6",
            messages.length > 0 && "hidden",
          )}
        >
          <h1 className="text-4xl text-center tracking-tight">
            Next.js Docs Chat
          </h1>

          <div className="relative">
            <PromptInputForm
              sendMessage={sendMessage}
              status={status}
              stop={stop}
            />
          </div>

          <Suggestions className="flex-wrap w-full justify-center">
            {SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
                className="rounded-md px-3 text-muted-foreground"
              />
            ))}
          </Suggestions>
        </div>

        <div className={cn(messages.length === 0 && "hidden")}>
          <Conversation>
            <ConversationContent className="p-0 pt-12 pb-32">
              {messages.map((message, index) => {
                return (
                  <ConversationMessage
                    key={message.id}
                    message={message}
                    chatStatus={status}
                    isLastMessage={index === messages.length - 1}
                  />
                );
              })}
            </ConversationContent>
            <ConversationScrollButton className="fixed bottom-36" />
          </Conversation>

          <div className="fixed bottom-2 w-2xl max-w-[95vw]">
            <div className="-top-4 absolute inset-x-0 h-4 bg-linear-to-b from-transparent via-40% via-background/30 to-background/70" />
            <PromptInputForm
              sendMessage={sendMessage}
              status={status}
              stop={stop}
            />
          </div>
        </div>
      </div>
    </ChatScrollArea>
  );
}

interface PromptInputFormProps {
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ChatStatus;
  stop: () => void;
}

function PromptInputForm({ sendMessage, status, stop }: PromptInputFormProps) {
  const [input, setInput] = useState("");
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(
    _message: PromptInputMessage,
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
      (e.target as HTMLFormElement).reset();
      // Reset the height of the textarea
      if (chatInputRef.current) chatInputRef.current.style.height = "auto";
    }
  }

  useEffect(() => {
    const formElement = chatInputRef.current?.closest("form");

    function focusInput() {
      chatInputRef.current?.focus();
    }

    formElement?.addEventListener("click", focusInput);

    return () => formElement?.removeEventListener("click", focusInput);
  }, []);

  return (
    <PromptInput
      onSubmit={handleSubmit}
      className="background backdrop-blur-md supports-backdrop-filter:bg-background/80"
    >
      <PromptInputBody>
        <PromptInputTextarea
          ref={chatInputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="thin-scrollbar min-h-11"
        />
      </PromptInputBody>
      <PromptInputFooter className="justify-end">
        <PromptInputSubmit
          type={status === "streaming" ? "button" : "submit"}
          status={status}
          disabled={input.trim().length === 0 && status !== "streaming"}
          onClick={() => {
            if (status === "streaming") stop();
          }}
        />
      </PromptInputFooter>
    </PromptInput>
  );
}
