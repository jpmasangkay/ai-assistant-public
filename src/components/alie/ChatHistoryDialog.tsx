import { useState } from "react";
import { Check, Clock, MessageSquare, Pencil, Plus, Trash2, X } from "lucide-react";
import { useAlie } from "@/lib/alie/store";
import { cn } from "@/lib/utils";

function formatHistoryDate(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ChatHistoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { chatHistory, activeSessionId, loadSession, deleteSession, renameSession, newChat } =
    useAlie();

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  if (!open) return null;

  const handleStartRename = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setEditingSessionId(id);
    setEditingTitle(title || "Untitled Conversation");
  };

  const handleSaveRename = (sessionId: string) => {
    if (editingTitle.trim()) {
      renameSession(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[85vh] w-full max-w-lg rounded-lg border border-border bg-card shadow-xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Chat History</h2>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
              {chatHistory.length} saved
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                newChat();
                onClose();
              }}
              className="flex items-center gap-1 rounded-md border border-border/80 bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors active:scale-95"
            >
              <Plus className="size-3.5" />
              <span>New Chat</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close history"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="min-h-0 flex-1 overflow-auto divide-y divide-border/50">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground p-6">
              <MessageSquare className="size-8 stroke-[1.5] text-muted-foreground/40 mb-2" />
              <p className="text-xs font-medium text-foreground">No chat history yet</p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground max-w-xs">
                As you chat with Alie, your conversations will be automatically saved here so you
                can revisit them anytime.
              </p>
            </div>
          ) : (
            chatHistory.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingSessionId === session.id;
              const userMsg = session.messages.find((m) => m.role === "user");
              const assistantMsg = session.messages.find((m) => m.role === "assistant");
              const preview =
                assistantMsg?.content.slice(0, 90) ||
                userMsg?.content.slice(0, 90) ||
                "Conversation";

              return (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-start justify-between gap-3 p-3.5 transition-colors hover:bg-muted/40 cursor-pointer",
                    isActive && "bg-muted/30 border-l-2 border-l-signal",
                  )}
                  onClick={() => {
                    if (!isEditing) {
                      loadSession(session.id);
                      onClose();
                    }
                  }}
                >
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div
                        className="flex items-center gap-1.5 py-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveRename(session.id);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              handleCancelRename();
                            }
                          }}
                          autoFocus
                          maxLength={60}
                          className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          placeholder="Conversation title"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(session.id)}
                          className="rounded-md p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-95 transition-colors"
                          title="Save name (Enter)"
                          aria-label="Save name"
                        >
                          <Check className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelRename}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
                          title="Cancel (Esc)"
                          aria-label="Cancel renaming"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-medium text-foreground line-clamp-1">
                            {session.title || "Untitled Conversation"}
                          </h3>
                          {isActive && (
                            <span className="rounded bg-signal/15 px-1.5 py-0.2 text-[0.62rem] font-medium text-signal">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[0.7rem] text-muted-foreground line-clamp-2 leading-relaxed">
                          {preview}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[0.65rem] text-muted-foreground/70">
                          <span>{formatHistoryDate(session.updatedAt || session.createdAt)}</span>
                          <span>·</span>
                          <span>
                            {session.messages.length} message
                            {session.messages.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions (Rename & Delete) */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleStartRename(e, session.id, session.title)}
                        className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                        title="Rename conversation"
                        aria-label={`Rename ${session.title}`}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
                        title="Delete conversation from history"
                        aria-label={`Delete ${session.title}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
