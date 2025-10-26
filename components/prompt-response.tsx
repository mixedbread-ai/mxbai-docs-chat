import type { ChatStatus, UIMessage } from "ai";
import { ConversationMessage } from "@/components/conversation-message";
import { cn } from "@/lib/utils";

interface PromptResponseProps {
  promptResponse: UIMessage[];
  isLastMessage: boolean;
  isLastPromptResponse: boolean;
  chatStatus: ChatStatus;
}

export function PromptResponse({
  promptResponse,
  isLastMessage,
  isLastPromptResponse,
  chatStatus,
}: PromptResponseProps) {
  const [prompt, response] = promptResponse;

  return (
    <div
      className={cn(
        isLastPromptResponse
          ? "min-h-[calc(100svh-var(--spacing)*14-var(--spacing)*36)]"
          : "min-h-0",
      )}
    >
      <ConversationMessage
        message={prompt}
        isLastMessage={isLastMessage}
        chatStatus={chatStatus}
      />
      {response && (
        <ConversationMessage
          message={response}
          isLastMessage={isLastMessage}
          chatStatus={chatStatus}
        />
      )}
    </div>
  );
}
