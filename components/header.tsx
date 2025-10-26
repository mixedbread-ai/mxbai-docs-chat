import Link from "next/link";
import { GitHubLogoIcon } from "@/components/icons/github-logo-icon";
import { MxbaiLogoIcon } from "@/components/icons/mxbai-logo-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 bg-background backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <Link href="/">
          <MxbaiLogoIcon className="size-7" />
          <span className="sr-only">Home</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="https://github.com/mixedbread-ai/mxbai-docs-chat"
            target="_blank"
            rel="noopener"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-muted-foreground",
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
