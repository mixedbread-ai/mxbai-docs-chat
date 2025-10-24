"use client";

import type { ChatStatus, UIMessage } from "ai";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Shimmer } from "@/components/ai-elements/shimmer";

interface ConversationMessageProps {
  message: UIMessage;
  isLastMessage: boolean;
  chatStatus: ChatStatus;
}

export function ConversationMessage({
  message,
  isLastMessage,
  chatStatus,
}: ConversationMessageProps) {
  const isStreaming =
    chatStatus === "streaming" && isLastMessage && message.role === "assistant";
  const hasContent = message.parts.some(
    (part) => part.type === "text" && part.text,
  );

  return (
    <Message from={message.role} key={message.id}>
      <MessageContent variant="flat">
        {!hasContent && isStreaming ? (
          <Shimmer className="text-sm">Thinking...</Shimmer>
        ) : (
          message.parts.map(
            (part, i) =>
              part.type === "text" && (
                <Response
                  key={`${message.id}-${i}`}
                  parseIncompleteMarkdown={false}
                >
                  {part.text}
                </Response>
              ),
          )
        )}
      </MessageContent>
    </Message>
  );
}
