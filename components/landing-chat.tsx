"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { useInitialMessage } from "@/contexts/initial-message-context";
import { SUGGESTIONS } from "@/lib/constants";

export function LandingChat() {
  const router = useRouter();
  const { setInitialMessage } = useInitialMessage();

  function handleSuggestionClick(suggestion: string) {
    setInitialMessage(suggestion);
    router.push("/chat");
  }

  useEffect(() => {
    router.prefetch("/chat");
  }, [router]);

  return (
    <div>
      <div className="mx-auto w-2xl max-w-[95vw]">
        <div className="flex h-svh flex-col justify-center gap-6">
          <h1 className="text-center text-4xl tracking-tight">
            Next.js Docs Chat
          </h1>

          <div className="relative">
            <PromptInputForm />
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
      </div>
    </div>
  );
}

function PromptInputForm() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { setInitialMessage } = useInitialMessage();

  function handleSubmit(
    message: PromptInputMessage,
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    if (!message.text?.trim()) return;

    setInitialMessage(message.text);
    router.push("/chat");
  }

  return (
    <PromptInput
      onSubmit={handleSubmit}
      className="background backdrop-blur-md supports-backdrop-filter:bg-background/80"
    >
      <PromptInputBody>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about Next.js..."
          className="thin-scrollbar min-h-11"
        />
      </PromptInputBody>
      <PromptInputFooter className="justify-end">
        <PromptInputSubmit disabled={input.trim().length === 0} />
      </PromptInputFooter>
    </PromptInput>
  );
}
