import alieMark from "@/assets/alie-mark.png";
import type { PersonaMode } from "@/lib/alie/persona";
import type { AgentStatus } from "@/lib/alie/types";
import { cn } from "@/lib/utils";

interface AlieAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  persona?: PersonaMode;
  status?: AgentStatus;
  showEmojiBadge?: boolean;
  className?: string;
}

export function AlieAvatar({ size = "md", status = "idle", className }: AlieAvatarProps) {
  const sizeClasses = {
    xs: "size-5 rounded-md",
    sm: "size-7 rounded-lg",
    md: "size-9 rounded-xl",
    lg: "size-12 rounded-xl",
    xl: "size-16 rounded-2xl",
  }[size];

  const imgSize = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 28,
    xl: 38,
  }[size];

  const isSpeaking = status === "speaking";
  const isListening = status === "listening";
  const isThinking = status === "thinking" || status === "executing_tool";

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      {/* Main Avatar Container */}
      <div
        className={cn(
          sizeClasses,
          "relative flex items-center justify-center border border-border/80 bg-muted/40 shadow-2xs select-none transition-all duration-200",
          isSpeaking && "border-foreground/30 bg-muted/60",
          isThinking && "border-foreground/20",
        )}
      >
        <img
          src={alieMark}
          alt="Alie"
          width={imgSize}
          height={imgSize}
          className={cn(
            "object-contain transition-opacity duration-200 dark:invert",
            isThinking && "animate-pulse opacity-70",
            isListening && "opacity-90",
          )}
        />
      </div>

      {/* Understated status dot for live active voice states */}
      {(isSpeaking || isListening) && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-background bg-signal",
            isSpeaking && "animate-pulse",
          )}
        />
      )}
    </div>
  );
}
