import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  title,
  meta,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col bg-background", className)}>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-card/40 px-4 py-2.5">
        <h2 className="text-xs font-semibold text-foreground tracking-tight">{title}</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {meta}
          {action}
        </div>
      </header>
      <div className={cn("min-h-0 flex-1 overflow-auto", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="text-xs font-medium text-foreground">{children}</span>;
}
