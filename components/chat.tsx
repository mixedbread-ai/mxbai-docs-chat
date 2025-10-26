"use client";

import { useChat } from "@ai-sdk/react";
import { type ChatStatus, DefaultChatTransport, type UIMessage } from "ai";
import Link from "next/link";
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
import { PromptResponse } from "@/components/prompt-response";
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

  const promptResponses = messages.reduce((acc, message) => {
    if (message.role === "user") {
      acc.push([message]);
    } else {
      acc[acc.length - 1].push(message);
    }
    return acc;
  }, [] as UIMessage[][]);

  return (
    <ChatScrollArea messages={messages} isStreaming={status === "streaming"}>
      <div className="mx-auto w-2xl max-w-[95vw]">
        <div
          className={cn(
            "flex h-svh flex-col justify-center gap-6",
            messages.length > 0 && "hidden",
          )}
        >
          <h1 className="text-center text-4xl tracking-tight">
            Next.js Docs Chat
          </h1>

          <div className="relative">
            <PromptInputForm
              sendMessage={sendMessage}
              status={status}
              stop={stop}
            />
          </div>

          <Suggestions className="w-full flex-wrap justify-center">
            {SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
                className="rounded-md px-3 text-muted-foreground"
              />
            ))}
          </Suggestions>

          <div className="-translate-x-1/2 fixed bottom-10 left-1/2 flex items-center justify-center gap-6">
            <Link
              href="https://github.com/mixedbread-ai/mxbai-docs-chat?tab=readme-ov-file#mixedbread-docs-chat"
              target="_blank"
              rel="noopener"
              className="text-muted-foreground underline decoration-1 underline-offset-4 transition-[color] hover:text-foreground"
            >
              Guide
            </Link>

            <Link
              href="https://mixedbread.com"
              target="_blank"
              rel="noopener"
              className="text-muted-foreground underline decoration-1 underline-offset-4 transition-[color] hover:text-foreground"
            >
              Mixedbread
            </Link>
          </div>
        </div>

        <div className={cn(messages.length === 0 && "hidden")}>
          <Conversation>
            <ConversationContent className="p-0 pt-14 pb-36">
              {promptResponses.map((promptResponse, index) => {
                return (
                  <PromptResponse
                    key={promptResponse[0].id}
                    promptResponse={promptResponse}
                    chatStatus={status}
                    isLastMessage={
                      messages[messages.length - 1].id ===
                      promptResponse[promptResponse.length - 1].id
                    }
                    isLastPromptResponse={index === promptResponses.length - 1}
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
    if (status === "streaming" || !input.trim()) return;

    sendMessage({ text: input });
    setInput("");
    (e.target as HTMLFormElement).reset();
    // Reset the height of the textarea
    if (chatInputRef.current) chatInputRef.current.style.height = "auto";
  }

  // Auto-focus the textarea on mount and whenever the user presses any key
  useEffect(() => {
    if (!chatInputRef.current) return;

    function focusInput(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (
        [
          "Enter",
          "Escape",
          "Tab",
          "Shift",
          "Control",
          "Meta",
          "Alt",
          "CapsLock",
        ].includes(e.key) ||
        e.key.startsWith("Arrow") ||
        e.key.startsWith("F") // Function keys (F1-F12)
      ) {
        return;
      }

      chatInputRef.current?.focus();
    }

    chatInputRef.current?.focus();

    window.addEventListener("keydown", focusInput);

    return () => window.removeEventListener("keydown", focusInput);
  }, []);

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
          placeholder="Ask a question about Next.js..."
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
