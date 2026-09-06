import { Activity, CheckCircle2, Clock, Cpu, HardDrive, Laptop } from "lucide-react";

import { Panel } from "@/components/alie/Panel";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h online`;
  if (hours > 0) return `${hours}h ${mins}m online`;
  return `${mins}m online`;
}

export function SystemPanel() {
  const { stats, viewMode } = useAlie();

  const memPercent = stats ? Math.round((stats.ramUsedGb / stats.ramTotalGb) * 100) : 0;

  return (
    <Panel
      title="System Health"
      meta={
        stats ? (
          <span className="flex items-center gap-1 text-[0.7rem] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Healthy
          </span>
        ) : (
          <span className="text-muted-foreground text-[0.7rem]">—</span>
        )
      }
    >
      {stats ? (
        <div className="space-y-3 p-4">
          {/* Health summary badge */}
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            <span className="font-medium">All systems running smoothly</span>
          </div>

          {/* Memory Bar */}
          <div className="rounded-xl border border-border/60 bg-card p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <HardDrive className="size-3.5" />
                Memory (RAM)
              </span>
              <span className="font-medium text-foreground">
                {stats.ramUsedGb.toFixed(1)} GB of {stats.ramTotalGb} GB ({memPercent}%)
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  memPercent > 85
                    ? "bg-destructive"
                    : memPercent > 65
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                )}
                style={{ width: `${memPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-border/60 bg-card p-2.5 shadow-xs">
              <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                <Cpu className="size-3" />
                Computer Load
              </span>
              <p className="mt-1 font-semibold text-foreground">{stats.cpu.toFixed(0)}% (Normal)</p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-2.5 shadow-xs">
              <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                <Clock className="size-3" />
                Uptime
              </span>
              <p className="mt-1 font-semibold text-foreground">
                {formatUptime(stats.uptimeSeconds)}
              </p>
            </div>
          </div>

          {/* Project / Work In Progress status */}
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Active changes:</span>
            <span className="font-medium text-foreground">
              {stats.dirtyFiles === 0
                ? "No unsaved files"
                : `${stats.dirtyFiles} files in progress`}
            </span>
          </div>

          {/* Developer Details when in dev mode */}
          {viewMode === "developer" && (
            <div className="mt-2 rounded-lg border border-border/40 bg-muted/40 p-2 font-mono text-[0.68rem] text-muted-foreground">
              <div>
                Branch: <span className="text-foreground">{stats.branch}</span>
              </div>
              <div className="truncate">
                Workspace: <span className="text-foreground">{stats.workspace}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="p-4 text-xs text-muted-foreground">Waiting for system status from Alie...</p>
      )}
    </Panel>
  );
}
