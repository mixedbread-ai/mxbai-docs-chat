"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState } from "react";
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
import { MxbaiLogoIcon } from "@/components/mxbai-logo-icon";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What are Cache Components?",
  "How do I fetch data in Server Components?",
  "How do I create Parallel Routes in App Router?",
];

export function Chat() {
  const [input, setInput] = useState("");
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: [],
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

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

  function handleSuggestionClick(suggestion: string) {
    sendMessage({ text: suggestion });
  }

  const promptInput = (
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
          disabled={input.length === 0 && status !== "streaming"}
          onClick={() => {
            if (status === "streaming") stop();
          }}
        />
      </PromptInputFooter>
    </PromptInput>
  );

  return (
    <ChatScrollArea messages={messages} isStreaming={status === "streaming"}>
      <div className="max-w-[95vw] w-2xl mx-auto">
        <div
          className={cn(
            "flex flex-col h-svh justify-center gap-6",
            messages.length > 0 && "hidden",
          )}
        >
          <div className="flex items-center justify-center gap-3">
            <MxbaiLogoIcon className="size-12" />
            <h1 className="text-4xl tracking-tight">Mxbai Chat</h1>
          </div>

          <div className="relative">
            <div className="-top-4 absolute inset-x-0 h-4 bg-linear-to-b from-transparent via-40% via-popover/30 to-popover/70" />
            {promptInput}
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
            <ConversationContent className="p-0 pt-6 pb-32">
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
            <ConversationScrollButton />
          </Conversation>

          <div className="fixed bottom-2 w-2xl max-w-[95vw]">
            <div className="-top-4 absolute inset-x-0 h-4 bg-linear-to-b from-transparent via-40% via-popover/30 to-popover/70" />
            {promptInput}
          </div>
        </div>
      </div>
    </ChatScrollArea>
  );
}
