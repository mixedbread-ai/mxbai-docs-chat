"use client";

import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTouch } from "@/hooks/use-touch";
import { cn } from "@/lib/utils";

type ResponsiveHoverCardContextType = {
  isTouch: boolean;
};

const ResponsiveHoverCardContext = React.createContext<
  ResponsiveHoverCardContextType | undefined
>(undefined);

function useResponsiveHoverCard() {
  const context = React.use(ResponsiveHoverCardContext);

  if (!context) {
    throw new Error(
      "Responsive hover card components must be used within a ResponsiveHoverCard",
    );
  }

  return context;
}

export type ResponsiveHoverCardProps = React.ComponentProps<typeof Popover> &
  React.ComponentProps<typeof HoverCard>;

export const ResponsiveHoverCard = ({ ...props }: ResponsiveHoverCardProps) => {
  const isTouch = useTouch();
  const Card = isTouch ? Popover : HoverCard;

  return (
    <ResponsiveHoverCardContext.Provider value={{ isTouch }}>
      <Card {...props} />
    </ResponsiveHoverCardContext.Provider>
  );
};
ResponsiveHoverCard.displayName = "ResponsiveHoverCard";

export type ResponsiveHoverCardTriggerProps = React.ComponentProps<
  typeof PopoverTrigger
> &
  React.ComponentProps<typeof HoverCardTrigger>;

export const ResponsiveHoverCardTrigger = ({
  ...props
}: ResponsiveHoverCardTriggerProps) => {
  const { isTouch } = useResponsiveHoverCard();
  const Trigger = isTouch ? PopoverTrigger : HoverCardTrigger;

  return <Trigger {...props} />;
};
ResponsiveHoverCardTrigger.displayName = "ResponsiveHoverCardTrigger";

export type ResponsiveHoverCardContentProps = React.ComponentProps<
  typeof PopoverContent
> &
  React.ComponentProps<typeof HoverCardContent>;

export const ResponsiveHoverCardContent = ({
  className,
  ...props
}: ResponsiveHoverCardContentProps) => {
  const { isTouch } = useResponsiveHoverCard();
  const Content = isTouch ? PopoverContent : HoverCardContent;

  return (
    <Content
      {...props}
      className={cn(
        "bg-background backdrop-blur-lg supports-backdrop-filter:bg-background/70",
        className,
      )}
    />
  );
};
ResponsiveHoverCardContent.displayName = "ResponsiveHoverCardContent";
