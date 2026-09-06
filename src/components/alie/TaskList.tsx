import { useState } from "react";
import { Check, CheckCircle2, ListTodo, Plus, Trash2 } from "lucide-react";

import { Panel } from "@/components/alie/Panel";
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
  label: "Normal",
  badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
};

const PRIORITY_MAP: Record<TaskPriority, PriorityOption> = {
  normal: DEFAULT_PRIORITY,
  high: {
    value: "high",
    label: "Urgent",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  low: {
    value: "low",
    label: "Low",
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
  const { tasks, createTask, toggleTask, deleteTask, connection } = useAlie();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("normal");
  const offline = connection !== "connected";
  const openCount = tasks.filter((t) => t.status === "open").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <Panel
      title="To-Do List"
      meta={
        <div className="flex items-center gap-1.5">
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => {
                tasks.filter((t) => t.status === "done").forEach((t) => deleteTask(t.id));
              }}
              className="rounded px-1.5 py-0.5 text-[0.68rem] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Clear completed tasks"
            >
              Clear completed
            </button>
          )}
          <span className="rounded bg-muted/80 px-2 py-0.5 text-[0.7rem] font-medium text-foreground">
            {tasks.length === 0
              ? "0 to-dos"
              : openCount === 0
                ? "All done! 🎉"
                : `${openCount} to do`}
          </span>
        </div>
      }
      className="min-h-56"
    >
      {/* Add Task Input Form */}
      <form
        className="flex items-center gap-2 border-b border-border/70 bg-card/40 p-2.5 sm:p-3"
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
          placeholder="Add a task (e.g., Call doctor, Review notes)..."
          disabled={offline}
          className="min-w-0 flex-1 rounded-md border border-border/80 bg-background px-2.5 py-2 sm:py-1.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-signal/50 focus:ring-1 focus:ring-signal/20 disabled:opacity-50"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="rounded-md border border-border/80 bg-background px-2.5 py-2 sm:py-1.5 text-base sm:text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted/40 focus:border-signal"
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
          className="flex items-center gap-1 rounded-md bg-foreground px-3.5 py-2 sm:px-3 sm:py-1.5 text-xs font-medium text-background shadow-xs transition-opacity hover:opacity-90 disabled:opacity-40 active:scale-95"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>

      {/* Task List Items */}
      <ul className="divide-y divide-border/50">
        {tasks.length === 0 && (
          <li className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <ListTodo className="size-8 stroke-[1.5] text-muted-foreground/40 mb-1.5" />
            <p className="text-xs font-medium text-foreground">Your to-do list is empty</p>
            <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
              Type a task above or ask Alie to remember something for you!
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
                onClick={() => toggleTask(task.id)}
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
