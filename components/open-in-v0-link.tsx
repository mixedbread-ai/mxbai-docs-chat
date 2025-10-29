"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { V0LogoIcon } from "@/components/icons/v0-logo-icon";
import { buttonVariants } from "@/components/ui/button";
import { useConversation } from "@/contexts/conversation-context";
import { cn, generateWebPromptDeeplink } from "@/lib/utils";

export function OpenInV0Link() {
  const pathname = usePathname();
  const { conversation } = useConversation();
  if (!conversation || pathname === "/") return null;

  return (
    <Link
      href={generateWebPromptDeeplink(conversation)}
      target="_blank"
      rel="noopener"
      className={cn(buttonVariants({ size: "sm" }))}
    >
      <V0LogoIcon className="size-4.5" />
      Open in v0
    </Link>
  );
}
