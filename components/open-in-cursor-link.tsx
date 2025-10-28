"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CursorLogoIcon } from "@/components/icons/cursor-logo-icon";
import { buttonVariants } from "@/components/ui/button";
import { useConversation } from "@/contexts/conversation-context";
import { cn, generateWebPromptDeeplink } from "@/lib/utils";

export function OpenInCursorLink() {
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
      <CursorLogoIcon className="size-4" />
      Open in Cursor
    </Link>
  );
}
