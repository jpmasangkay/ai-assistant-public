import { useState } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  HelpCircle,
  MessageSquare,
  Mic,
  MicOff,
  Pencil,
  Plus,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import { AlieAvatar } from "@/components/alie/AlieAvatar";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { getGreetingForHour, getPersonaConfig, type PersonaMode } from "@/lib/alie/persona";
import { useAlie } from "@/lib/alie/store";
import type { ChatMessage, ToolExecution } from "@/lib/alie/types";
import { cn } from "@/lib/utils";

function clock(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function SimpleToolCard({ tool }: { tool: ToolExecution }) {
  const [expanded, setExpanded] = useState(false);

  const getToolMeta = () => {
    switch (tool.name) {
      case "writingAssistant":
      case "codeRunner":
        return {
          title: "Prepared a message draft",
          icon: <MessageSquare className="size-3.5 text-signal" />,
        };
      case "taskManager":
        return {
          title: "Checked your to-do items",
          icon: <ClipboardList className="size-3.5 text-emerald-500" />,
        };
      default:
        return {
          title: "Completed action",
          icon: <FileText className="size-3.5 text-foreground" />,
        };
    }
  };

  const meta = getToolMeta();

  return (
    <div className="my-1.5 overflow-hidden rounded-md border border-border/70 bg-card/60 text-xs shadow-xs">
      <div
        className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded bg-muted">
            {meta.icon}
          </div>
          <span className="font-medium text-foreground">{meta.title}</span>
          {tool.state === "output-available" && (
            <span className="inline-flex items-center gap-1 text-[0.68rem] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="size-3" />
              Complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-[0.7rem]">{expanded ? "Hide" : "Details"}</span>
          {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </div>
      </div>

      {tool.output && !expanded && (
        <div className="border-t border-border/40 bg-muted/20 px-3.5 py-2 text-[0.75rem] text-muted-foreground">
          {tool.output}
        </div>
      )}

      {expanded && (
        <div className="border-t border-border/50 bg-muted/40 p-3 font-mono text-[0.72rem]">
          {tool.input && (
            <div className="mb-2">
              <p className="font-semibold text-muted-foreground uppercase text-[0.65rem] mb-1">
                Input:
              </p>
              <pre className="overflow-auto rounded bg-background p-2 text-xs border border-border/60">
                {JSON.stringify(tool.input, null, 2)}
              </pre>
            </div>
          )}
          {tool.output && (
            <div>
              <p className="font-semibold text-muted-foreground uppercase text-[0.65rem] mb-1">
                Output:
              </p>
              <pre className="overflow-auto rounded bg-background p-2 text-xs border border-border/60">
                {tool.output}
              </pre>
            </div>
          )}
          {tool.durationMs !== undefined && (
            <p className="mt-2 text-[0.68rem] text-muted-foreground">
              Completed in {(tool.durationMs / 1000).toFixed(2)}s
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Turn({
  message,
  viewMode,
  currentPersona,
}: {
  message: ChatMessage;
  viewMode: "simple" | "developer";
  currentPersona: PersonaMode;
}) {
  const isUser = message.role === "user";
  const personaMode = message.persona ?? currentPersona;
  const personaConfig = getPersonaConfig(personaMode);

  return (
    <Message from={message.role} className="max-w-full gap-2">
      {/* Turn Header */}
      <div
        className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          isUser && "justify-end",
        )}
      >
        {!isUser && (
          <AlieAvatar size="xs" persona={personaMode} status="idle" showEmojiBadge={false} />
        )}
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">
            {isUser ? (message.transcribed ? "You (voice)" : "You") : "Alie"}
          </span>
          {!isUser && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.2 text-[0.62rem] font-medium",
                personaConfig.accentBg,
                personaConfig.accentBorder,
                personaConfig.accentText,
              )}
            >
              <span>{personaConfig.emoji}</span>
              <span>{personaConfig.shortName}</span>
            </span>
          )}
        </div>
        <span className="text-[0.68rem] opacity-60">{clock(message.timestamp)}</span>
      </div>

      {/* Tool Calls */}
      {message.tools.map((tool) =>
        viewMode === "simple" ? (
          <SimpleToolCard key={tool.id} tool={tool} />
        ) : (
          <Tool
            key={tool.id}
            defaultOpen={false}
            className="mb-0 rounded-md border-border bg-muted/30"
          >
            <ToolHeader
              type={`tool-${tool.name}` as `tool-${string}`}
              state={tool.state}
              title={tool.name}
              className="px-3 py-2 font-mono"
            />
            <ToolContent>
              <ToolInput input={tool.input} />
              <ToolOutput output={tool.output} errorText={tool.errorText} />
              {tool.durationMs !== undefined && (
                <p className="font-mono text-[0.65rem] text-muted-foreground">
                  completed in {(tool.durationMs / 1000).toFixed(2)}s
                </p>
              )}
            </ToolContent>
          </Tool>
        ),
      )}

      {/* Message Content */}
      {message.content ? (
        <MessageContent
          className={cn(
            "rounded-md px-3.5 py-2.5 text-sm leading-relaxed shadow-xs",
            isUser
              ? "bg-primary text-primary-foreground ml-auto max-w-[85%]"
              : "border border-border/70 bg-card text-card-foreground mr-auto max-w-[95%]",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MessageResponse className="font-sans">{message.content}</MessageResponse>
          )}
        </MessageContent>
      ) : null}
    </Message>
  );
}

export function ConversationPanel() {
  const {
    messages,
    agentStatus,
    sendText,
    connection,
    viewMode,
    activeSessionId,
    chatHistory,
    renameSession,
    newChat,
    clearChat,
    recording,
    micLevel,
    micError,
    toggleTalking,
    stopTalking,
    muted,
    toggleMuted,
    persona,
    setPersona,
  } = useAlie();
  const [draft, setDraft] = useState("");
  const busy = agentStatus === "thinking" || agentStatus === "executing_tool";
  const offline = connection !== "connected";

  const personaConfig = getPersonaConfig(persona);
  const timeGreeting = getGreetingForHour(persona);

  const currentSession = chatHistory.find((s) => s.id === activeSessionId);
  const currentTitle = currentSession?.title || "Conversation";
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState("");

  const handleStartRename = () => {
    setRenameDraft(currentTitle);
    setIsRenaming(true);
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (renameDraft.trim()) {
      renameSession(activeSessionId, renameDraft.trim());
    }
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-background">
      {/* Top chat action bar when conversation has messages */}
      {messages.length > 0 && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-card/40 px-4 py-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {isRenaming ? (
              <form
                onSubmit={handleSaveRename}
                className="flex items-center gap-1.5 w-full max-w-xs"
              >
                <input
                  type="text"
                  value={renameDraft}
                  onChange={(e) => setRenameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") handleCancelRename();
                  }}
                  autoFocus
                  maxLength={60}
                  className="flex-1 rounded border border-border bg-background px-2.5 py-1 text-base sm:text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Chat name"
                />
                <button
                  type="submit"
                  className="rounded p-1.5 sm:p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-95 transition-colors"
                  title="Save title (Enter)"
                  aria-label="Save title"
                >
                  <Check className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelRename}
                  className="rounded p-1.5 sm:p-1 text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
                  title="Cancel (Esc)"
                  aria-label="Cancel rename"
                >
                  <X className="size-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0 group">
                <span
                  onClick={handleStartRename}
                  className="truncate text-xs font-medium text-foreground cursor-pointer hover:underline"
                  title="Click to rename this conversation"
                >
                  {currentTitle}
                </span>
                <button
                  type="button"
                  onClick={handleStartRename}
                  className="rounded p-1.5 sm:p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                  title="Rename this conversation"
                  aria-label="Rename conversation"
                >
                  <Pencil className="size-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearChat}
              className="rounded px-2 py-0.5 text-[0.68rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
              title="Clear messages in current conversation"
            >
              Clear chat
            </button>
            <button
              type="button"
              onClick={newChat}
              className="flex items-center gap-1 rounded bg-muted/80 px-2 py-0.5 text-[0.68rem] font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
              title="Start a new conversation"
            >
              <Plus className="size-3" />
              <span>New chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-4 p-4 sm:p-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center max-w-lg mx-auto px-2">
              {/* Living Alie Avatar */}
              <div className="mb-4">
                <AlieAvatar
                  size="xl"
                  persona={persona}
                  status={agentStatus}
                  showEmojiBadge={true}
                />
              </div>

              {/* Active Persona Badge Pill */}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs mb-3 transition-colors",
                  personaConfig.accentBg,
                  personaConfig.accentBorder,
                  personaConfig.accentText,
                )}
              >
                <span>{personaConfig.emoji}</span>
                <span className="font-semibold">{personaConfig.name}</span>
                <span className="opacity-60 hidden sm:inline">· {personaConfig.tagline}</span>
              </div>

              {/* Time-of-day Contextual Greeting */}
              <p className="text-xs font-medium text-muted-foreground mb-1 italic">
                "{timeGreeting}"
              </p>

              {/* Persona Headline & Subtitle */}
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground max-w-md">
                {personaConfig.emptyStateHeadline}
              </h3>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
                {personaConfig.emptyStateSubtitle}
              </p>

              {/* Quick Persona Vibe Selector */}
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="text-[0.68rem] text-muted-foreground mr-0.5">Switch vibe:</span>
                {(["cozy", "candid", "zen"] as PersonaMode[]).map((mode) => {
                  const p = getPersonaConfig(mode);
                  const active = persona === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPersona(mode)}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all active:scale-95",
                        active
                          ? cn(
                              "border shadow-2xs font-semibold",
                              p.accentBg,
                              p.accentBorder,
                              p.accentText,
                            )
                          : "border border-border/60 text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                      )}
                    >
                      <span>{p.emoji}</span>
                      <span className="text-[0.68rem]">{p.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Persona-Curated Prompt Starters */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {personaConfig.promptSuggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={offline}
                    onClick={() => sendText(s.prompt)}
                    className="flex items-center gap-2.5 rounded-lg border border-border/80 bg-card/80 p-2.5 text-left text-xs font-medium text-foreground transition-all hover:bg-muted/80 hover:border-border hover:shadow-2xs active:scale-98 disabled:opacity-50"
                  >
                    <span className="text-base shrink-0">{s.emoji}</span>
                    <span className="truncate leading-snug">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Turn key={m.id} message={m} viewMode={viewMode} currentPersona={persona} />
            ))
          )}

          {busy && (
            <div className="flex items-center gap-2 rounded-md border border-border/70 bg-card px-3 py-2 text-xs text-muted-foreground w-fit shadow-xs">
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "size-1.5 rounded-full animate-pulse [animation-delay:-0.3s]",
                    persona === "cozy" && "bg-amber-500",
                    persona === "candid" && "bg-violet-500",
                    persona === "zen" && "bg-emerald-500",
                  )}
                />
                <span
                  className={cn(
                    "size-1.5 rounded-full animate-pulse [animation-delay:-0.15s]",
                    persona === "cozy" && "bg-amber-500",
                    persona === "candid" && "bg-violet-500",
                    persona === "zen" && "bg-emerald-500",
                  )}
                />
                <span
                  className={cn(
                    "size-1.5 rounded-full animate-pulse",
                    persona === "cozy" && "bg-amber-500",
                    persona === "candid" && "bg-violet-500",
                    persona === "zen" && "bg-emerald-500",
                  )}
                />
              </span>
              <span className="text-[0.72rem] font-medium text-foreground ml-1">
                {personaConfig.statusQuips.thinking}
              </span>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton className="rounded-md shadow-md" />
      </Conversation>

      {/* Input Section */}
      <div className="shrink-0 border-t border-border/80 bg-card/30 p-3 sm:p-4">
        <PromptInput
          className="rounded-md border border-border/80 bg-card shadow-xs transition-all focus-within:border-signal/50 focus-within:ring-1 focus-within:ring-signal/20"
          onSubmit={(_, event) => {
            event.preventDefault();
            if (!draft.trim()) return;
            sendText(draft);
            setDraft("");
          }}
        >
          <PromptInputTextarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              offline
                ? "Connecting to Alie..."
                : recording
                  ? "Listening... speak freely"
                  : "Type a message or tap Voice to speak..."
            }
            disabled={offline}
            className="text-base sm:text-sm font-sans placeholder:text-muted-foreground/50"
          />

          {/* Live Voice Recording Waveform Bar (active while recording) */}
          {recording && (
            <div className="flex items-center gap-2 border-t border-border/40 bg-signal/5 px-3 py-1.5 text-xs text-signal">
              <span className="size-2 rounded-full bg-signal animate-pulse" />
              <span className="text-[0.68rem] font-medium text-signal">Listening...</span>
              <div className="h-1 flex-1 overflow-hidden rounded bg-muted">
                <div
                  className="h-full rounded bg-signal transition-[width] duration-75"
                  style={{ width: `${Math.min(100, Math.max(12, Math.round(micLevel * 160)))}%` }}
                />
              </div>
              <button
                type="button"
                onClick={stopTalking}
                className="rounded bg-signal px-2 py-0.5 text-[0.68rem] font-medium text-signal-foreground hover:opacity-90 active:scale-95"
              >
                Send voice
              </button>
            </div>
          )}

          {/* Mic Blocked Error Guidance */}
          {micError && (
            <div className="flex items-center gap-2 border-t border-destructive/20 bg-destructive/10 px-3 py-1.5 text-[0.68rem] text-destructive">
              <MicOff className="size-3.5 shrink-0" />
              <span>{micError}</span>
            </div>
          )}

          <PromptInputFooter className="flex items-center justify-between border-t border-border/40 px-3 py-2">
            {/* Left: In-chat Voice to Text & Mute Controls */}
            <div className="flex items-center gap-1.5">
              {/* Voice button */}
              <button
                type="button"
                disabled={offline}
                onClick={toggleTalking}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 sm:px-2.5 sm:py-1 text-xs font-medium transition-all active:scale-95",
                  recording
                    ? "bg-signal text-signal-foreground animate-pulse shadow-xs"
                    : "border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground",
                  offline && "cursor-not-allowed opacity-50",
                )}
                title={recording ? "Stop and send voice recording" : "Voice input (Speak to Alie)"}
                aria-label={recording ? "Stop and send voice recording" : "Voice input"}
              >
                {recording ? (
                  <>
                    <Square className="size-3 fill-current" />
                    <span className="text-[0.72rem]">Stop & Send</span>
                  </>
                ) : (
                  <>
                    <Mic className="size-3.5 text-signal" />
                    <span className="text-[0.72rem]">Voice</span>
                  </>
                )}
              </button>

              {/* Mute Voice Responses Button */}
              <button
                type="button"
                onClick={toggleMuted}
                aria-pressed={muted}
                className={cn(
                  "flex size-8 sm:size-7 items-center justify-center rounded-md border transition-colors active:scale-95",
                  muted
                    ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : "border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={muted ? "Unmute Alie's voice" : "Mute Alie's voice"}
                aria-label={muted ? "Unmute Alie's voice" : "Mute Alie's voice"}
              >
                {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
              </button>
            </div>

            {/* Right: Send Submit Button */}
            <PromptInputSubmit
              size="icon-sm"
              className="rounded-md shadow-xs transition-transform active:scale-95"
              {...(busy ? { status: "submitted" as const } : {})}
              disabled={offline || (!draft.trim() && !recording)}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </section>
  );
}
