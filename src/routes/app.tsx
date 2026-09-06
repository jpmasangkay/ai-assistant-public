import { createFileRoute } from "@tanstack/react-router";

import { ConversationPanel } from "@/components/alie/ConversationPanel";
import { DailyOverviewPanel } from "@/components/alie/DailyOverviewPanel";
import { HeaderBar } from "@/components/alie/HeaderBar";
import { TaskList } from "@/components/alie/TaskList";
import { AlieProvider } from "@/lib/alie/store";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Alie Assistant — Workspace" },
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
  return (
    <main className="flex h-screen flex-col bg-background text-foreground">
      <HeaderBar />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:overflow-hidden">
        {/* Main Stage: Conversation & Voice Assistant */}
        <div className="min-h-0 border-b border-border/70 lg:border-b-0 lg:border-r">
          <ConversationPanel />
        </div>

        {/* Right Stage: Daily Companion (To-Dos & Daily Overview) */}
        <div className="grid min-h-0 grid-rows-[auto_1fr] divide-y divide-border/70 lg:grid-rows-[minmax(0,1.25fr)_minmax(0,1fr)]">
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
