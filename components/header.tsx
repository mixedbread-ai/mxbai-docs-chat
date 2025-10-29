import Link from "next/link";
import { GitHubLogoIcon } from "@/components/icons/github-logo-icon";
import { MxbaiLogoIcon } from "@/components/icons/mxbai-logo-icon";
import { OpenInV0Link } from "@/components/open-in-v0-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 bg-background backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 w-[95vw] max-w-[1536px] items-center justify-between">
        <Link href="/" className="px-0.5">
          <MxbaiLogoIcon className="size-7" />
          <span className="sr-only">Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <OpenInV0Link />

          <Link
            href="https://github.com/mixedbread-ai/mxbai-docs-chat"
            target="_blank"
            rel="noopener"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "size-8 text-muted-foreground",
            )}
          >
            <GitHubLogoIcon className="size-4" />
            <span className="sr-only">GitHub Repo</span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
