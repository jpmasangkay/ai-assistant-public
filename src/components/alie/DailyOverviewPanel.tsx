import { useEffect, useState } from "react";
import { Calendar, Check, CheckCircle2, Copy, FileText, Trash2 } from "lucide-react";

import { Panel } from "@/components/alie/Panel";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

export function DailyOverviewPanel() {
  const { tasks } = useAlie();
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alie.notepad");
      if (saved) setNote(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const handleNoteChange = (text: string) => {
    setNote(text);
    try {
      localStorage.setItem("alie.notepad", text);
    } catch {
      /* ignore */
    }
  };

  const handleCopyNote = () => {
    if (!note) return;
    navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClearNote = () => {
    if (!note) return;
    setNote("");
    try {
      localStorage.removeItem("alie.notepad");
    } catch {
      /* ignore */
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;

  return (
    <Panel
      title="Morning Pages & Thoughts"
      meta={
        <span className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground font-medium">
          <Calendar className="size-3 text-amber-600 dark:text-amber-400" />
          {dateFormatted}
        </span>
      }
      className="min-h-56"
    >
      <div className="flex flex-col gap-3 p-3.5">
        {/* Task Completion Status Card (if tasks exist) */}
        {totalTasks > 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-card p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <CheckCircle2 className="size-3.5 text-amber-600 dark:text-amber-400" />
                Gentle Day Progress
              </span>
              <span className="text-[0.7rem] font-medium text-muted-foreground">
                {completedTasks} of {totalTasks} finished ({percentComplete}%)
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        )}

        {/* Scratchpad Editor */}
        <div className="flex flex-col rounded-2xl border border-amber-500/25 bg-card shadow-xs">
          {/* Scratchpad Toolbar */}
          <div className="flex items-center justify-between border-b border-border/60 px-3.5 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <FileText className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-foreground font-serif">Personal Journal</span>
              <span className="text-[0.68rem] opacity-70">
                {wordCount > 0 ? `(${wordCount} words)` : ""}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {note && (
                <>
                  <button
                    type="button"
                    onClick={handleCopyNote}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 sm:px-1.5 sm:py-0.5 text-xs sm:text-[0.68rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                    title="Copy note"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3 text-emerald-500" />
                        <span className="text-emerald-500 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearNote}
                    className="rounded-lg p-1.5 sm:p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
                    title="Clear notepad"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Jot down loose thoughts, recipes, reminders, or reflections here... saved automatically to your device as you write. ☕"
            rows={5}
            className="w-full resize-none bg-transparent p-3.5 text-base sm:text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 outline-none font-sans"
          />
        </div>
      </div>
    </Panel>
  );
}
