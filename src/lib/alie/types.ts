import type { PersonaMode } from "./persona";

export type AgentStatus = "idle" | "listening" | "thinking" | "executing_tool" | "speaking";

export type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

export type ToolState = "input-available" | "output-available" | "output-error";

export interface ToolExecution {
  id: string;
  name: string;
  state: ToolState;
  input: Record<string, unknown>;
  output?: string | undefined;
  errorText?: string | undefined;
  startedAt: number;
  durationMs?: number | undefined;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  streaming?: boolean | undefined;
  tools: ToolExecution[];
  audioUrl?: string | undefined;
  transcribed?: boolean | undefined;
  persona?: PersonaMode | undefined;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  customTitle?: boolean | undefined;
}

export type TaskStatus = "open" | "done";
export type TaskPriority = "low" | "normal" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: number;
}

export interface TerminalLine {
  id: string;
  stream: "stdout" | "stderr" | "git" | "system";
  text: string;
  timestamp: number;
}

export interface SystemStats {
  cpu: number;
  ramUsedGb: number;
  ramTotalGb: number;
  uptimeSeconds: number;
  branch: string;
  dirtyFiles: number;
  workspace: string;
}

export interface ConnectionConfig {
  serverUrl: string;
  token: string;
}

/** Server -> client socket events, matching the Alie backend protocol. */
export type ServerEvent =
  | { type: "agent_thinking"; messageId: string; persona?: PersonaMode }
  | {
      type: "tool_call_start";
      messageId: string;
      toolId: string;
      name: string;
      input: Record<string, unknown>;
    }
  | {
      type: "tool_call_output";
      messageId: string;
      toolId: string;
      output: string;
      isError?: boolean;
    }
  | { type: "stream_text_chunk"; messageId: string; delta: string }
  | { type: "stream_text_done"; messageId: string }
  | { type: "agent_voice_ready"; messageId: string; audioUrl: string; durationMs: number }
  | { type: "terminal_output"; stream: TerminalLine["stream"]; text: string }
  | { type: "tasks"; tasks: Task[] }
  | { type: "system_stats"; stats: SystemStats }
  | { type: "transcript"; messageId: string; text: string }
  | { type: "error"; message: string };

/** Client -> server socket events. */
export type ClientEvent =
  | { type: "send_message"; text: string }
  | { type: "send_audio"; audio: Blob; mimeType: string }
  | { type: "fetch_tasks" }
  | { type: "create_task"; title: string; priority: TaskPriority }
  | { type: "toggle_task"; id: string }
  | { type: "delete_task"; id: string };
