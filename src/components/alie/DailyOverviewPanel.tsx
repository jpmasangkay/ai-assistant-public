import { useEffect, useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";

import { Panel } from "@/components/alie/Panel";

export function DailyOverviewPanel() {
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

  return (
    <Panel
      title="Notes"
      meta={
        note.trim() ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyNote}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground active:scale-95"
              title="Copy notes to clipboard"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
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
              className="rounded p-1 text-muted-foreground/60 transition-colors hover:text-destructive active:scale-95"
              title="Clear notes"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        ) : null
      }
      className="min-h-48 flex-1"
      bodyClassName="flex flex-col"
    >
      <textarea
        value={note}
        onChange={(e) => handleNoteChange(e.target.value)}
        placeholder="Jot down loose thoughts, reminders, or scratch notes here..."
        className="w-full flex-1 resize-none bg-transparent p-4 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 outline-none font-sans"
      />
    </Panel>
  );
}
