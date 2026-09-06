import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Loader2, Plus, Radio, Volume2 } from "lucide-react";

import { AlieAvatar } from "@/components/alie/AlieAvatar";
import { ChatHistoryDialog } from "@/components/alie/ChatHistoryDialog";
import { PersonaSwitcher } from "@/components/alie/PersonaSwitcher";
import { ThemeToggle } from "@/components/alie/ThemeToggle";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

export function HeaderBar() {
  const { connection, agentStatus, newChat, persona } = useAlie();
  const [openHistory, setOpenHistory] = useState(false);

  const getStatusDisplay = () => {
    if (agentStatus === "speaking") {
      return {
        label: "Speaking",
        dotClass: "bg-signal animate-pulse ring-2 ring-signal/30",
        badgeClass: "bg-signal/10 text-signal border-signal/30",
        icon: <Volume2 className="size-3.5" />,
      };
    }
    if (agentStatus === "listening") {
      return {
        label: "Listening",
        dotClass: "bg-signal animate-pulse ring-2 ring-signal/30",
        badgeClass: "bg-signal/15 text-signal border-signal/40",
        icon: <Radio className="size-3.5" />,
      };
    }
    if (agentStatus === "thinking" || agentStatus === "executing_tool") {
      return {
        label: "Working...",
        dotClass: "bg-amber-500 animate-pulse ring-2 ring-amber-500/20",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        icon: <Loader2 className="size-3.5 animate-spin" />,
      };
    }
    if (connection === "connected") {
      return {
        label: "Online",
        dotClass: "bg-emerald-500 ring-2 ring-emerald-500/20",
        badgeClass:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        icon: null,
      };
    }
    if (connection === "connecting") {
      return {
        label: "Connecting...",
        dotClass: "bg-amber-500 animate-pulse",
        badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        icon: null,
      };
    }
    return {
      label: "Offline",
      dotClass: "bg-muted-foreground",
      badgeClass: "bg-muted/50 text-muted-foreground border-border",
      icon: null,
    };
  };

  const status = getStatusDisplay();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
          {/* Brand identity with living avatar */}
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            title="Back to home"
          >
            <AlieAvatar size="sm" persona={persona} status={agentStatus} showEmojiBadge={true} />
            <div>
              <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                Alie
              </span>
            </div>
          </Link>

          {/* Center: Persona Switcher & Status Indicator */}
          <div className="order-3 flex items-center justify-center gap-2 sm:order-2">
            <PersonaSwitcher />
            <div
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.7rem] font-medium transition-colors",
                status.badgeClass,
              )}
            >
              {status.icon}
              <span className={cn("size-1.5 rounded-full", status.dotClass)} />
              <span>{status.label}</span>
            </div>
          </div>

          {/* Right: Controls + Theme Toggle */}
          <div className="order-2 flex items-center gap-2 sm:order-3">
            {/* New Chat Button */}
            <button
              type="button"
              onClick={newChat}
              className="flex items-center gap-1 rounded-md border border-border/80 bg-card px-2.5 py-1.5 sm:py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95 shadow-xs"
              title="Start a new chat"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            {/* Chat History Button */}
            <button
              type="button"
              onClick={() => setOpenHistory(true)}
              className="flex items-center gap-1.5 rounded-md border border-border/80 bg-card px-2.5 py-1.5 sm:py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 shadow-xs"
              title="View past chats"
            >
              <Clock className="size-3.5" />
              <span className="hidden sm:inline">History</span>
            </button>

            {/* Theme Toggle Button (Light/Dark Mode) - Far Right */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <ChatHistoryDialog open={openHistory} onClose={() => setOpenHistory(false)} />
    </>
  );
}
