import { useEffect, useRef } from "react";
import { Terminal, Trash2 } from "lucide-react";

import { Panel } from "@/components/alie/Panel";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

const STREAM_CLASS: Record<string, string> = {
  stdout: "text-foreground",
  stderr: "text-destructive",
  git: "text-signal",
  system: "text-muted-foreground",
};

export function TerminalConsole() {
  const { terminalLogs, clearTerminal } = useAlie();
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [terminalLogs]);

  return (
    <Panel
      title="Developer Terminal"
      meta={
        <span className="text-[0.7rem] text-muted-foreground">
          {terminalLogs.length} {terminalLogs.length === 1 ? "line" : "lines"}
        </span>
      }
      action={
        <button
          type="button"
          onClick={clearTerminal}
          className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[0.65rem] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Clear terminal logs"
        >
          <Trash2 className="size-3" />
          <span>Clear</span>
        </button>
      }
      className="min-h-[12rem]"
    >
      <pre
        ref={ref}
        className="h-full overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[0.72rem] leading-relaxed bg-background/60"
      >
        {terminalLogs.length === 0 ? (
          <span className="text-muted-foreground/60 italic">
            // No terminal commands executed yet
          </span>
        ) : (
          terminalLogs.map((line) => (
            <div key={line.id} className={cn(STREAM_CLASS[line.stream])}>
              <span className="text-muted-foreground/60">
                {new Date(line.timestamp).toLocaleTimeString([], { hour12: false })}{" "}
              </span>
              {line.text}
            </div>
          ))
        )}
      </pre>
    </Panel>
  );
}
