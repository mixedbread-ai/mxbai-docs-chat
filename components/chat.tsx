"use client";

import { useChat } from "@ai-sdk/react";
import { type ChatStatus, DefaultChatTransport, type UIMessage } from "ai";
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
import { ChatScrollArea } from "@/components/chat-scroll-area";
import { PromptResponse } from "@/components/prompt-response";
import { useConversation } from "@/contexts/conversation-context";
import { useInitialMessage } from "@/contexts/initial-message-context";

export function Chat() {
  const isInitRef = useRef(true);
  const { initialMessage } = useInitialMessage();
  const { setConversation } = useConversation();
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on mount
  useEffect(() => {
    if (initialMessage && isInitRef.current) {
      isInitRef.current = false;
      sendMessage({ text: initialMessage });
    }
  }, []);

  const promptResponses = messages.reduce((acc, message) => {
    if (message.role === "user") {
      acc.push([message]);
    } else {
      acc[acc.length - 1].push(message);
    }
    return acc;
  }, [] as UIMessage[][]);

  useEffect(() => {
    const conversationContent = messages
      .reduce((acc, message) => {
        message.parts.forEach((part) => {
          if (part.type === "text") {
            acc.push(part.text);
          }
        });
        return acc;
      }, [] as string[])
      .join("\n\n");

    setConversation(conversationContent);
  }, [messages, setConversation]);

  return (
    <ChatScrollArea messages={messages} isStreaming={status === "streaming"}>
      <div className="mx-auto w-2xl max-w-[95vw]">
        <div>
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
    message: PromptInputMessage,
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    if (status === "streaming" || !message.text?.trim()) return;

    sendMessage({ text: message.text });
    setInput("");
    (e.target as HTMLFormElement).reset();
    // Reset the height of the textarea
    if (chatInputRef.current) chatInputRef.current.style.height = "auto";
  }

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
