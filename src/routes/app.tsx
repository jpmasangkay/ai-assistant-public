import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListTodo, MessageSquare } from "lucide-react";

import { ConversationPanel } from "@/components/alie/ConversationPanel";
import { DailyOverviewPanel } from "@/components/alie/DailyOverviewPanel";
import { HeaderBar } from "@/components/alie/HeaderBar";
import { TaskList } from "@/components/alie/TaskList";
import { AlieProvider, useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Alie" },
      {
        name: "description",
        content:
          "Alie AI personal companion workspace with chat, voice, tasks, and daily planning.",
      },
    ],
  }),
  component: AppPage,
});

function MainLayout() {
  const [mobileTab, setMobileTab] = useState<"chat" | "tasks">("chat");
  const { tasks } = useAlie();
  const openTasksCount = tasks.filter((t) => t.status === "open").length;

  return (
    <main className="flex h-dvh flex-col bg-background text-foreground overflow-hidden">
      <HeaderBar />

      {/* Mobile Tab Switcher Bar (visible only on < lg screens) */}
      <div className="shrink-0 border-b border-border/70 bg-card/60 px-3 py-1.5 lg:hidden">
        <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-muted/60 p-1">
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all active:scale-98",
              mobileTab === "chat"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MessageSquare className="size-3.5 text-signal" />
            <span>Chat & Voice</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("tasks")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all active:scale-98",
              mobileTab === "tasks"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ListTodo className="size-3.5 text-emerald-500" />
            <span>To-Dos & Notes</span>
            {openTasksCount > 0 && (
              <span className="rounded-full bg-signal/15 px-1.5 py-0.2 text-[10px] font-semibold text-signal">
                {openTasksCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Workspace Area: Side-by-side on desktop (lg), Tabbed on mobile (< lg) */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        {/* Main Stage: Conversation & Voice Assistant */}
        <div
          className={cn(
            "min-h-0 h-full border-b border-border/70 lg:border-b-0 lg:border-r",
            mobileTab === "chat" ? "flex flex-col" : "hidden lg:flex lg:flex-col",
          )}
        >
          <ConversationPanel />
        </div>

        {/* Right Stage: Daily Companion (To-Dos & Daily Overview) */}
        <div
          className={cn(
            "min-h-0 h-full overflow-y-auto lg:overflow-hidden grid grid-rows-[auto_1fr] divide-y divide-border/70 lg:grid-rows-[minmax(0,1.25fr)_minmax(0,1fr)]",
            mobileTab === "tasks" ? "grid" : "hidden lg:grid",
          )}
        >
          <TaskList />
          <DailyOverviewPanel />
        </div>
      </div>
    </main>
  );
}

function AppPage() {
  return (
    <AlieProvider>
      <MainLayout />
    </AlieProvider>
  );
}
