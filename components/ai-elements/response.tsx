"use client";

import {
  type ComponentProps,
  createContext,
  isValidElement,
  memo,
  use,
  useMemo,
} from "react";
import type { Options } from "react-markdown";
import { Streamdown } from "streamdown";
import {
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationSource,
} from "@/components/ai-elements/inline-citation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";

type ResponseProps = ComponentProps<typeof Streamdown>;

const LANGUAGE_REGEX = /language-([^\s]+)/;

interface Reference {
  title: string;
  url: string;
}

const ReferencesContext = createContext<Map<string, Reference>>(new Map());

function useReferences() {
  return use(ReferencesContext);
}

function parseReferences(markdown: string): Map<string, Reference> {
  const references = new Map<string, Reference>();

  // Match the References section and extract individual references
  // Format: [1] [Title](URL)
  const referencesMatch = markdown.match(
    /##\s*References\s*([\s\S]*?)(?=\n##|\n$|$)/i,
  );

  if (referencesMatch) {
    const referencesText = referencesMatch[1];
    // Match pattern: [number] [title](url)
    const referenceRegex = /\[(\d+)\]\s*\[([^\]]+)\]\(([^)]+)\)/g;

    const matches = Array.from(referencesText.matchAll(referenceRegex));
    for (const match of matches) {
      const [, number, title, url] = match;
      references.set(number, { title, url });
    }
  }

  return references;
}

const createComponents = (): Options["components"] => ({
  sup: ({ node, children, className, ...props }) => {
    const references = useReferences();

    // Extract citation numbers from children (e.g., "[1]" or "[1,2]")
    const citationText = String(children);
    const citationNumbers = citationText.match(/\d+/g) || [];

    const citationRefs = citationNumbers
      .map((num) => references.get(num))
      .filter((ref) => !!ref);

    return (
      <HoverCard openDelay={300} closeDelay={300}>
        <HoverCardTrigger asChild>
          <sup
            className={cn("cursor-help text-logo text-xs", className)}
            {...props}
          >
            {children}
          </sup>
        </HoverCardTrigger>

        <HoverCardContent className="w-72 p-0">
          <InlineCitationCarousel opts={{ duration: 10 }}>
            <InlineCitationCarouselHeader>
              <InlineCitationCarouselPrev />
              <InlineCitationCarouselNext />
              <InlineCitationCarouselIndex />
            </InlineCitationCarouselHeader>
            <InlineCitationCarouselContent>
              {citationRefs.map((ref) => (
                <InlineCitationCarouselItem key={ref.url}>
                  <InlineCitationSource title={ref.title} url={ref.url} />
                </InlineCitationCarouselItem>
              ))}
            </InlineCitationCarouselContent>
          </InlineCitationCarousel>
        </HoverCardContent>
      </HoverCard>
    );
  },
  ol: ({ node, children, className, ...props }) => (
    <ol className={cn("ml-4 list-outside list-decimal", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={cn("py-1 leading-6", className)} {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul className={cn("ml-4 list-outside list-disc", className)} {...props}>
      {children}
    </ul>
  ),
  hr: ({ node, className, ...props }) => (
    <hr className={cn("my-6 border-border", className)} {...props} />
  ),
  strong: ({ node, children, className, ...props }) => (
    <span className={cn("font-semibold leading-6", className)} {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, className, ...props }) => (
    <a
      className={cn("font-medium text-foreground underline", className)}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  ),
  p: ({ node, children, className, ...props }) => (
    <p className={cn("mb-2 leading-6", className)} {...props}>
      {children}
    </p>
  ),
  h1: ({ node, children, className, ...props }) => (
    <h1
      className={cn("mt-6 mb-2 font-semibold text-3xl", className)}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ node, children, className, ...props }) => (
    <h2
      className={cn("mt-6 mb-2 font-semibold text-2xl", className)}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ node, children, className, ...props }) => (
    <h3 className={cn("mt-6 mb-2 font-semibold text-xl", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, className, ...props }) => (
    <h4 className={cn("mt-6 mb-2 font-semibold text-lg", className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, className, ...props }) => (
    <h5
      className={cn("mt-6 mb-2 font-semibold text-base", className)}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ node, children, className, ...props }) => (
    <h6 className={cn("mt-6 mb-2 font-semibold text-sm", className)} {...props}>
      {children}
    </h6>
  ),
  table: ({ node, children, className, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table
        className={cn("w-full border-collapse border border-border", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ node, children, className, ...props }) => (
    <thead className={cn("bg-muted/50", className)} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ node, children, className, ...props }) => (
    <tbody className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  ),
  tr: ({ node, children, className, ...props }) => (
    <tr className={cn("border-border border-b", className)} {...props}>
      {children}
    </tr>
  ),
  th: ({ node, children, className, ...props }) => (
    <th
      className={cn("px-4 py-2 text-left font-semibold text-sm", className)}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ node, children, className, ...props }) => (
    <td className={cn("px-4 py-2 text-sm", className)} {...props}>
      {children}
    </td>
  ),
  blockquote: ({ node, children, className, ...props }) => (
    <blockquote
      className={cn(
        "my-4 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic leading-6",
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ node, className, children, ...props }) => {
    const inline = node?.position?.start.line === node?.position?.end.line;
    if (inline) {
      return (
        <code
          className={cn(
            "rounded border border-foreground/10 bg-muted px-0.75 py-[0.5px] font-mono text-sm",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    const match = className?.match(LANGUAGE_REGEX);
    const language = match?.[1] ?? "";

    // Extract code content from children safely
    let code = "";
    if (
      isValidElement(children) &&
      children.props &&
      typeof (children.props as { children?: unknown }).children === "string"
    ) {
      code = (children.props as { children: string }).children;
    } else if (typeof children === "string") {
      code = children;
    }

    return (
      <CodeBlock
        className={cn("my-4 h-auto", className)}
        code={code}
        language={language}
      >
        <CodeBlockCopyButton />
      </CodeBlock>
    );
  },
});

const components = createComponents();

export const Response = memo(
  ({ className, children, ...props }: ResponseProps) => {
    const references = useMemo(
      () =>
        typeof children === "string"
          ? parseReferences(children)
          : new Map<string, Reference>(),
      [children],
    );

    return (
      <ReferencesContext.Provider value={references}>
        <Streamdown
          className={cn(
            "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            className,
          )}
          components={components}
          {...props}
        >
          {children}
        </Streamdown>
      </ReferencesContext.Provider>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

Response.displayName = "Response";
