import { PERSONAS, type PersonaMode } from "@/lib/alie/persona";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

interface PersonaSwitcherProps {
  className?: string;
}

const MODES: PersonaMode[] = ["cozy", "candid", "zen"];

export function PersonaSwitcher({ className }: PersonaSwitcherProps) {
  const { persona, setPersona } = useAlie();

  return (
    <div
      role="radiogroup"
      aria-label="Select Alie's personality"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/80 bg-card/80 p-1 shadow-2xs backdrop-blur-md",
        className,
      )}
    >
      {MODES.map((mode) => {
        const item = PERSONAS[mode];
        const active = persona === mode;

        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPersona(mode)}
            title={`${item.name} — ${item.tagline}`}
            className={cn(
              "group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 outline-none select-none",
              active
                ? cn(
                    "shadow-xs",
                    mode === "cozy" &&
                      "bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30",
                    mode === "candid" &&
                      "bg-violet-500/15 text-violet-800 dark:text-violet-200 border border-violet-500/30",
                    mode === "zen" &&
                      "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30",
                  )
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent",
            )}
          >
            <span className="text-xs transition-transform group-hover:scale-110">{item.emoji}</span>
            <span className="hidden text-[0.72rem] tracking-tight sm:inline">{item.shortName}</span>
            {active && (
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  mode === "cozy" && "bg-amber-500",
                  mode === "candid" && "bg-violet-500",
                  mode === "zen" && "bg-emerald-500",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
