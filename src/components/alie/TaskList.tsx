import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

import { Panel } from "@/components/alie/Panel";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

export function TaskList() {
  const { tasks, createTask, toggleTask, deleteTask, connection } = useAlie();
  const [title, setTitle] = useState("");
  const offline = connection !== "connected";
  const openCount = tasks.filter((t) => t.status === "open").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask(title.trim(), "normal");
    setTitle("");
  };

  return (
    <Panel
      title="Daily To-Dos"
      meta={
        <div className="flex items-center gap-2 text-xs">
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => {
                tasks.filter((t) => t.status === "done").forEach((t) => deleteTask(t.id));
              }}
              className="text-[0.7rem] text-muted-foreground hover:text-foreground transition-colors"
              title="Clear completed tasks"
            >
              Clear completed
            </button>
          )}
          <span className="text-[0.7rem] text-muted-foreground font-sans">
            {tasks.length === 0
              ? "0 tasks"
              : openCount === 0
                ? "All clear"
                : `${openCount} remaining`}
          </span>
        </div>
      }
      className="min-h-56"
    >
      {/* Add Task Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-b border-border/70 bg-card/40 px-3 py-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          disabled={offline}
          className="min-w-0 flex-1 rounded-md border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={offline || !title.trim()}
          className="flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40 active:scale-95 shadow-2xs"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>

      {/* Task List Items */}
      <ul className="divide-y divide-border/40">
        {tasks.length === 0 && (
          <li className="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
            <p className="font-serif text-sm font-medium text-foreground">No tasks for today</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground leading-relaxed">
              Add a task above or ask Alie to help organize your day.
            </p>
          </li>
        )}

        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-muted/30"
          >
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              className="flex min-w-0 flex-1 items-center gap-2.5 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              {/* Checkbox */}
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border transition-all",
                  task.status === "done"
                    ? "border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500 text-white"
                    : "border-border/80 group-hover:border-foreground/60",
                )}
                aria-hidden
              >
                {task.status === "done" && <Check className="size-3 stroke-3" />}
              </span>

              {/* Task Title */}
              <span
                className={cn(
                  "truncate text-xs text-foreground transition-all leading-snug",
                  task.status === "done" && "text-muted-foreground line-through opacity-60",
                )}
              >
                {task.title}
              </span>
            </button>

            {/* Delete Task Button */}
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="shrink-0 flex size-6 items-center justify-center rounded text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-all"
              title="Delete task"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
