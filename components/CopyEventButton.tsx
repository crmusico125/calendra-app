"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

interface CopyEventButtonProps
  extends Omit<React.ComponentProps<"button">, "onClick" | "children">, // Inherit all button props except onClick and children
    VariantProps<typeof buttonVariants> {
  // Allow variant and size props from button styling
  eventId: string;
  clerkUserId: string;
}

function getCopyLabel(state: CopyState) {
  switch (state) {
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
    case "idle":
    default:
      return "Copy Link";
  }
}

export function CopyEventButton({
  eventId,
  clerkUserId,
  className,
  variant,
  size,
  ...props
}: CopyEventButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    const eventLink = `${location.origin}/book/${clerkUserId}/${eventId}`;
    navigator.clipboard
      .writeText(eventLink)
      .then(() => {
        toast("Link copied successfully!", { duration: 3000 });
        setTimeout(() => setCopyState("idle"), 2000); // Reset to idle after 2 seconds
      })
      .catch(() => {
        setCopyState("error");
        setTimeout(() => setCopyState("idle"), 2000); // Reset to idle after 2 seconds
      });
  };
  return (
    <Button
      onClick={handleCopy}
      className={cn(
        buttonVariants({ variant, size }),
        "cursor-pointer",
        className
      )}
      variant={variant}
      size={size}
      {...props}
    >
      <CopyIcon className="size-4 mr-2" />
      {/* Icon that changes with copy state */}
      {getCopyLabel(copyState)} {/* Label that changes with copy state */}
    </Button>
  );
}
