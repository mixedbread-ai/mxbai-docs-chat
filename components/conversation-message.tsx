"use client";

import type { ChatStatus, TextUIPart, UIMessage } from "ai";
import {
  CheckIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";
import { Action, Actions } from "./ai-elements/actions";

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
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isStreaming =
    chatStatus === "streaming" && isLastMessage && message.role === "assistant";
  const textParts = message.parts.filter(
    (part): part is TextUIPart => part.type === "text" && !!part.text,
  );
  const content = textParts.map((part) => part.text).join("\n\n");

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, 2000);
  }

  function handleLike() {
    setLiked((prev) => !prev);
    if (disliked) setDisliked(false);
  }

  function handleDislike() {
    setDisliked((prev) => !prev);
    if (liked) setLiked(false);
  }

  return (
    <Message from={message.role} key={message.id}>
      <MessageContent
        variant="flat"
        className="group-[.is-assistant]:max-w-[calc(95vw-var(--spacing)*12)]"
      >
        {!content.length && isStreaming ? (
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
        {message.role === "assistant" && !isStreaming && (
          <Actions className="mt-3">
            <Action
              label="Copy"
              tooltip="Copy"
              className="size-8"
              onClick={handleCopy}
            >
              <CheckIcon
                className={cn(
                  "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-4 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  copied
                    ? "scale-100 opacity-100 blur-none"
                    : "scale-50 opacity-0 blur-xs",
                )}
              />
              <CopyIcon
                className={cn(
                  "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-4 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  copied
                    ? "scale-50 opacity-0 blur-xs"
                    : "scale-100 opacity-100 blur-none",
                )}
              />
            </Action>

            <Action
              label="Good response"
              tooltip="Good response"
              className="size-8 hover:text-muted-foreground"
              onClick={handleLike}
            >
              <ThumbsUpIcon
                className={cn(
                  "size-4",
                  liked ? "fill-muted-foreground" : "fill-none",
                )}
              />
            </Action>

            <Action
              label="Bad response"
              tooltip="Bad response"
              className="size-8 hover:text-muted-foreground"
              onClick={handleDislike}
            >
              <ThumbsDownIcon
                className={cn(
                  "size-4",
                  disliked ? "fill-muted-foreground" : "fill-none",
                )}
              />
            </Action>
          </Actions>
        )}
      </MessageContent>
    </Message>
  );
}
