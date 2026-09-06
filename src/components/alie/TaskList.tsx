import { useState } from "react";
import { Check, CheckCircle2, ListTodo, Plus, Sparkles, Trash2, X } from "lucide-react";

import { Panel } from "@/components/alie/Panel";
import { getRandomCelebration } from "@/lib/alie/persona";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/alie/types";

interface PriorityOption {
  value: TaskPriority;
  label: string;
  badgeClass: string;
}

const DEFAULT_PRIORITY: PriorityOption = {
  value: "normal",
  label: "Gentle step",
  badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
};

const PRIORITY_MAP: Record<TaskPriority, PriorityOption> = {
  normal: DEFAULT_PRIORITY,
  high: {
    value: "high",
    label: "Main focus",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  low: {
    value: "low",
    label: "When ready",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
};

const PRIORITY_OPTIONS: PriorityOption[] = [
  PRIORITY_MAP.normal,
  PRIORITY_MAP.high,
  PRIORITY_MAP.low,
];

function formatTimeAgo(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TaskList() {
  const { tasks, createTask, toggleTask, deleteTask, connection, persona } = useAlie();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("normal");
  const [celebration, setCelebration] = useState<{ id: string; text: string } | null>(null);
  const offline = connection !== "connected";
  const openCount = tasks.filter((t) => t.status === "open").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const handleToggle = (taskId: string, currentStatus: "open" | "done") => {
    toggleTask(taskId);
    if (currentStatus === "open") {
      const quip = getRandomCelebration(persona);
      setCelebration({ id: taskId, text: quip });
      setTimeout(() => {
        setCelebration((prev) => (prev?.id === taskId ? null : prev));
      }, 5000);
    } else {
      setCelebration(null);
    }
  };

  return (
    <Panel
      title="Gentle Daily Flow"
      meta={
        <div className="flex items-center gap-1.5">
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => {
                tasks.filter((t) => t.status === "done").forEach((t) => deleteTask(t.id));
              }}
              className="rounded-lg px-2 py-0.5 text-[0.68rem] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Clear completed tasks"
            >
              Clear completed
            </button>
          )}
          <span className="rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-[0.7rem] font-medium text-amber-800 dark:text-amber-200">
            {tasks.length === 0
              ? "0 intentions"
              : openCount === 0
                ? "All clear! Enjoy tea ☕"
                : `${openCount} gentle steps`}
          </span>
        </div>
      }
      className="min-h-56"
    >
      {/* Add Task Input Form */}
      <form
        className="flex items-center gap-2 border-b border-border/70 bg-card/50 p-2.5 sm:p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          createTask(title, priority);
          setTitle("");
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a gentle intention (e.g., Water the plants, Call mom)..."
          disabled={offline}
          className="min-w-0 flex-1 rounded-xl border border-border/80 bg-background px-3 py-2 sm:py-1.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 disabled:opacity-50"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="rounded-xl border border-border/80 bg-background px-2.5 py-2 sm:py-1.5 text-base sm:text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/40 focus:border-amber-500/50"
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={offline || !title.trim()}
          className="flex items-center gap-1 rounded-xl bg-amber-600 dark:bg-amber-500 px-3.5 py-2 sm:px-3 sm:py-1.5 text-xs font-medium text-white shadow-xs transition-opacity hover:opacity-90 disabled:opacity-40 active:scale-95"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>

      {/* Persona Celebration Quip Banner on Task Completion */}
      {celebration && (
        <div className="flex items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-100 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="size-3.5 shrink-0 text-amber-500 animate-spin [animation-duration:3s]" />
            <span className="font-medium text-[0.72rem] truncate">{celebration.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setCelebration(null)}
            className="shrink-0 p-0.5 opacity-60 hover:opacity-100 transition-opacity"
            title="Dismiss"
            aria-label="Dismiss celebration"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {/* Task List Items */}
      <ul className="divide-y divide-border/50">
        {tasks.length === 0 && (
          <li className="flex flex-col items-center justify-center py-10 px-4 text-center text-muted-foreground">
            <span className="text-3xl mb-2">☕</span>
            <p className="font-serif text-sm font-semibold text-foreground">
              Your day is calm & clear
            </p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground leading-relaxed">
              Nothing pressing on your plate. Enjoy the quiet moment or jot down a gentle intention
              above.
            </p>
          </li>
        )}

        {tasks.map((task) => {
          const priorityInfo = PRIORITY_MAP[task.priority] ?? DEFAULT_PRIORITY;

          return (
            <li
              key={task.id}
              className="group flex items-center justify-between gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-muted/30"
            >
              <button
                type="button"
                onClick={() => handleToggle(task.id, task.status)}
                className="flex min-w-0 flex-1 items-start gap-2.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-signal/30 rounded py-0.5"
              >
                {/* Checkbox Icon */}
                <span
                  className={cn(
                    "mt-0.5 flex size-5 sm:size-4 shrink-0 items-center justify-center rounded border transition-all",
                    task.status === "done"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-border/80 group-hover:border-foreground/60",
                  )}
                  aria-hidden
                >
                  {task.status === "done" && <Check className="size-3 stroke-3" />}
                </span>

                {/* Task Details */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-xs font-medium text-foreground transition-all leading-snug",
                      task.status === "done" && "text-muted-foreground line-through opacity-70",
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0 text-[0.62rem] font-medium",
                        priorityInfo.badgeClass,
                      )}
                    >
                      {priorityInfo.label}
                    </span>
                    <span className="text-[0.68rem] text-muted-foreground">
                      {formatTimeAgo(task.created_at)}
                    </span>
                  </div>
                </div>
              </button>

              {/* Delete Task Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
                className="shrink-0 flex size-8 sm:size-7 items-center justify-center rounded p-1 text-muted-foreground/70 opacity-90 transition-all hover:bg-destructive/10 hover:text-destructive hover:opacity-100 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
                title="Delete task"
                aria-label={`Delete task: ${task.title}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
