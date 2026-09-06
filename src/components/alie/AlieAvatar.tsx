import alieMark from "@/assets/alie-mark.png";
import { getPersonaConfig, type PersonaMode } from "@/lib/alie/persona";
import type { AgentStatus } from "@/lib/alie/types";
import { cn } from "@/lib/utils";

interface AlieAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  persona?: PersonaMode;
  status?: AgentStatus;
  showEmojiBadge?: boolean;
  className?: string;
}

export function AlieAvatar({
  size = "md",
  persona = "cozy",
  status = "idle",
  showEmojiBadge = true,
  className,
}: AlieAvatarProps) {
  const config = getPersonaConfig(persona);

  const sizeClasses = {
    xs: "size-5",
    sm: "size-7",
    md: "size-10",
    lg: "size-14",
    xl: "size-20",
  }[size];

  const imgSize = {
    xs: 12,
    sm: 16,
    md: 22,
    lg: 32,
    xl: 44,
  }[size];

  const badgeSizeClasses = {
    xs: "-bottom-1 -right-1 text-[8px] size-3",
    sm: "-bottom-1 -right-1 text-[10px] size-4",
    md: "-bottom-1.5 -right-1.5 text-xs size-5",
    lg: "-bottom-2 -right-2 text-sm size-6",
    xl: "-bottom-2.5 -right-2.5 text-base size-7",
  }[size];

  const isSpeaking = status === "speaking";
  const isListening = status === "listening";
  const isThinking = status === "thinking" || status === "executing_tool";

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      {/* Outer ambient glow & breathing rings */}
      <div
        className={cn(
          "absolute -inset-1 rounded-full transition-all duration-500",
          persona === "cozy" && "bg-amber-500/20 dark:bg-amber-400/20",
          persona === "candid" && "bg-violet-500/20 dark:bg-violet-400/20",
          persona === "zen" && "bg-emerald-500/20 dark:bg-emerald-400/20",
          isListening && "animate-ping opacity-60 duration-1000",
          isThinking && "animate-pulse opacity-80",
          isSpeaking && "scale-110 opacity-70",
          !isListening && !isThinking && !isSpeaking && "opacity-40",
        )}
      />

      {/* Orbit ring for thinking state */}
      {isThinking && (
        <div
          className={cn(
            "absolute -inset-1.5 rounded-full border-2 border-dashed animate-spin transition-all duration-700",
            persona === "cozy" && "border-amber-500/60",
            persona === "candid" && "border-violet-500/60",
            persona === "zen" && "border-emerald-500/60",
          )}
        />
      )}

      {/* Main Avatar Body Container */}
      <div
        className={cn(
          sizeClasses,
          "relative flex items-center justify-center rounded-2xl border transition-all duration-300 backdrop-blur-md shadow-xs select-none",
          persona === "cozy" &&
            "border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-card to-card text-amber-700 dark:text-amber-300",
          persona === "candid" &&
            "border-violet-500/30 bg-gradient-to-br from-violet-500/15 via-card to-card text-violet-700 dark:text-violet-300",
          persona === "zen" &&
            "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-card to-card text-emerald-700 dark:text-emerald-300",
          isSpeaking && "scale-105 shadow-md",
        )}
      >
        {/* Alie Mark Logo */}
        <img
          src={alieMark}
          alt={`Alie (${config.name})`}
          width={imgSize}
          height={imgSize}
          className={cn(
            "object-contain transition-all duration-300 dark:invert",
            isSpeaking && "scale-110",
            isThinking && "animate-pulse",
          )}
        />

        {/* Dynamic audio waves overlay for speaking */}
        {isSpeaking && (
          <div className="absolute inset-x-1 bottom-1 flex items-end justify-center gap-0.5 h-2">
            <span
              className={cn(
                "w-0.5 h-1.5 rounded-full animate-pulse",
                persona === "cozy" && "bg-amber-500",
                persona === "candid" && "bg-violet-500",
                persona === "zen" && "bg-emerald-500",
              )}
            />
            <span
              className={cn(
                "w-0.5 h-2.5 rounded-full animate-pulse [animation-delay:150ms]",
                persona === "cozy" && "bg-amber-500",
                persona === "candid" && "bg-violet-500",
                persona === "zen" && "bg-emerald-500",
              )}
            />
            <span
              className={cn(
                "w-0.5 h-1.5 rounded-full animate-pulse [animation-delay:300ms]",
                persona === "cozy" && "bg-amber-500",
                persona === "candid" && "bg-violet-500",
                persona === "zen" && "bg-emerald-500",
              )}
            />
          </div>
        )}
      </div>

      {/* Floating Persona Emoji Badge */}
      {showEmojiBadge && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full border border-border/80 bg-background/90 backdrop-blur-sm shadow-xs transition-transform duration-300 hover:scale-110",
            badgeSizeClasses,
          )}
          title={`Active Persona: ${config.name} (${config.tagline})`}
          aria-label={`Active Persona: ${config.name}`}
        >
          <span>{config.emoji}</span>
        </span>
      )}
    </div>
  );
}
