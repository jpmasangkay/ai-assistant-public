import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AlieClient } from "./client";
import { AudioQueue, startRecording, type RecorderHandle } from "./audio";
import type {
  AgentStatus,
  ChatMessage,
  ChatSession,
  ConnectionConfig,
  ConnectionState,
  SystemStats,
  Task,
  TaskPriority,
  TerminalLine,
} from "./types";

const STORAGE_KEY = "alie.connection";
const CHAT_HISTORY_STORAGE_KEY = "alie.chat_history";
const DEFAULT_CONFIG: ConnectionConfig = { serverUrl: "ws://192.168.1.20:8787", token: "" };

function loadStoredHistory(): ChatSession[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as ChatSession[];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function saveStoredHistory(history: ChatSession[]) {
  try {
    localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    /* ignore */
  }
}

interface AlieContextValue {
  config: ConnectionConfig;
  setConfig: (c: ConnectionConfig) => void;
  connection: ConnectionState;
  connectionDetail: string | null;
  connect: (override?: ConnectionConfig) => void;
  disconnect: () => void;
  messages: ChatMessage[];
  activeSessionId: string;
  chatHistory: ChatSession[];
  newChat: () => void;
  clearChat: () => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  agentStatus: AgentStatus;
  terminalLogs: TerminalLine[];
  clearTerminal: () => void;
  tasks: Task[];
  stats: SystemStats | null;
  sendText: (text: string) => void;
  createTask: (title: string, priority: TaskPriority) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  muted: boolean;
  toggleMuted: () => void;
  recording: boolean;
  micLevel: number;
  micError: string | null;
  startTalking: () => void;
  stopTalking: () => void;
  toggleTalking: () => void;
  viewMode: "simple" | "developer";
  setViewMode: (mode: "simple" | "developer") => void;
}

const AlieContext = createContext<AlieContextValue | null>(null);

export function AlieProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<AlieClient | null>(null);
  if (!clientRef.current) clientRef.current = new AlieClient();
  const client = clientRef.current;

  const [config, setConfigState] = useState<ConnectionConfig>(DEFAULT_CONFIG);
  const [connection, setConnection] = useState<ConnectionState>("disconnected");
  const [connectionDetail, setConnectionDetail] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(
    () => "s-" + Math.random().toString(36).slice(2, 10),
  );
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(() => loadStoredHistory());
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [terminalLogs, setTerminalLogs] = useState<TerminalLine[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [muted, setMuted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [viewMode, setViewModeState] = useState<"simple" | "developer">("simple");

  useEffect(() => {
    if (messages.length === 0) return;

    setChatHistory((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === activeSessionId);
      const existingSession = existingIndex >= 0 ? prev[existingIndex] : null;

      const firstUserMsg = messages.find((m) => m.role === "user")?.content || "";
      const defaultTitle = firstUserMsg.slice(0, 42).trim() || "Conversation";

      const title = existingSession?.customTitle ? existingSession.title : defaultTitle;

      const updatedSession: ChatSession = {
        id: activeSessionId,
        title,
        customTitle: existingSession?.customTitle,
        createdAt: existingSession ? existingSession.createdAt : Date.now(),
        updatedAt: Date.now(),
        messages,
      };

      let next: ChatSession[];
      if (existingIndex >= 0) {
        next = [...prev];
        next[existingIndex] = updatedSession;
      } else {
        next = [updatedSession, ...prev];
      }

      saveStoredHistory(next);
      return next;
    });
  }, [messages, activeSessionId]);

  const recorderRef = useRef<RecorderHandle | null>(null);
  const queueRef = useRef<AudioQueue | null>(null);
  if (!queueRef.current) {
    queueRef.current = new AudioQueue((playing) =>
      setAgentStatus((s) => (playing ? "speaking" : s === "speaking" ? "idle" : s)),
    );
  }

  useEffect(() => {
    let initialConfig = DEFAULT_CONFIG;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) initialConfig = { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as ConnectionConfig) };
      const savedMode = localStorage.getItem("alie.viewMode");
      if (savedMode === "simple" || savedMode === "developer") {
        setViewModeState(savedMode);
      }
    } catch {
      /* first run */
    }
    setConfigState(initialConfig);
    // Automatically connect so the assistant is immediately ready for conversation & voice
    void client.connect(initialConfig);
  }, [client]);

  const setViewMode = useCallback((mode: "simple" | "developer") => {
    setViewModeState(mode);
    try {
      localStorage.setItem("alie.viewMode", mode);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setConfig = useCallback((next: ConnectionConfig) => {
    setConfigState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const pushLog = useCallback((stream: TerminalLine["stream"], text: string) => {
    setTerminalLogs((lines) =>
      [
        ...lines,
        { id: Math.random().toString(36).slice(2), stream, text, timestamp: Date.now() },
      ].slice(-400),
    );
  }, []);

  useEffect(() => {
    const offState = client.onState((state, detail) => {
      setConnection(state);
      setConnectionDetail(detail ?? null);
      if (state !== "connected") setAgentStatus("idle");
    });

    const off = client.on((event) => {
      switch (event.type) {
        case "agent_thinking":
          setAgentStatus("thinking");
          setMessages((m) => [
            ...m,
            {
              id: event.messageId,
              role: "assistant",
              content: "",
              timestamp: Date.now(),
              streaming: true,
              tools: [],
            },
          ]);
          break;

        case "transcript":
          setMessages((m) => [
            ...m,
            {
              id: event.messageId,
              role: "user",
              content: event.text,
              timestamp: Date.now(),
              tools: [],
              transcribed: true,
            },
          ]);
          break;

        case "tool_call_start":
          setAgentStatus("executing_tool");
          setMessages((m) =>
            m.map((msg) =>
              msg.id === event.messageId
                ? {
                    ...msg,
                    tools: [
                      ...msg.tools,
                      {
                        id: event.toolId,
                        name: event.name,
                        state: "input-available" as const,
                        input: event.input,
                        startedAt: Date.now(),
                      },
                    ],
                  }
                : msg,
            ),
          );
          break;

        case "tool_call_output":
          setAgentStatus("thinking");
          setMessages((m) =>
            m.map((msg) =>
              msg.id === event.messageId
                ? {
                    ...msg,
                    tools: msg.tools.map((t) =>
                      t.id === event.toolId
                        ? {
                            ...t,
                            state: event.isError
                              ? ("output-error" as const)
                              : ("output-available" as const),
                            output: event.isError ? undefined : event.output,
                            errorText: event.isError ? event.output : undefined,
                            durationMs: Date.now() - t.startedAt,
                          }
                        : t,
                    ),
                  }
                : msg,
            ),
          );
          break;

        case "stream_text_chunk":
          setMessages((m) =>
            m.map((msg) =>
              msg.id === event.messageId ? { ...msg, content: msg.content + event.delta } : msg,
            ),
          );
          break;

        case "stream_text_done":
          setMessages((m) =>
            m.map((msg) => (msg.id === event.messageId ? { ...msg, streaming: false } : msg)),
          );
          setAgentStatus("idle");
          break;

        case "agent_voice_ready":
          setMessages((m) =>
            m.map((msg) =>
              msg.id === event.messageId ? { ...msg, audioUrl: event.audioUrl } : msg,
            ),
          );
          queueRef.current?.push(event.audioUrl);
          break;

        case "terminal_output":
          pushLog(event.stream, event.text);
          break;

        case "tasks":
          setTasks(event.tasks);
          break;

        case "system_stats":
          setStats(event.stats);
          break;

        case "error":
          pushLog("stderr", event.message);
          setAgentStatus("idle");
          break;
      }
    });

    return () => {
      off();
      offState();
    };
  }, [client, pushLog]);

  const connect = useCallback(
    (override?: ConnectionConfig) => void client.connect(override ?? config),
    [client, config],
  );
  const disconnect = useCallback(() => client.disconnect(), [client]);

  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setMessages((m) => [
        ...m,
        {
          id: "u-" + Math.random().toString(36).slice(2),
          role: "user",
          content: trimmed,
          timestamp: Date.now(),
          tools: [],
        },
      ]);
      client.send({ type: "send_message", text: trimmed });
    },
    [client],
  );

  const createTask = useCallback(
    (title: string, priority: TaskPriority) => {
      if (!title.trim()) return;
      client.send({ type: "create_task", title: title.trim(), priority });
    },
    [client],
  );

  const toggleTask = useCallback(
    (id: string) => client.send({ type: "toggle_task", id }),
    [client],
  );
  const deleteTask = useCallback(
    (id: string) => client.send({ type: "delete_task", id }),
    [client],
  );

  const newChat = useCallback(() => {
    setMessages([]);
    setActiveSessionId("s-" + Math.random().toString(36).slice(2, 10));
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setChatHistory((prev) => {
      const next = prev.filter((s) => s.id !== activeSessionId);
      saveStoredHistory(next);
      return next;
    });
  }, [activeSessionId]);

  const loadSession = useCallback((sessionId: string) => {
    const found = loadStoredHistory().find((s) => s.id === sessionId);
    if (found) {
      setActiveSessionId(found.id);
      setMessages(found.messages);
    }
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setChatHistory((prev) => {
      const next = prev.filter((s) => s.id !== sessionId);
      saveStoredHistory(next);
      return next;
    });
    setActiveSessionId((curr) => {
      if (curr === sessionId) {
        setMessages([]);
        return "s-" + Math.random().toString(36).slice(2, 10);
      }
      return curr;
    });
  }, []);

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setChatHistory((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === sessionId);
      let next: ChatSession[];
      if (existingIndex >= 0) {
        next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          title: trimmed,
          customTitle: true,
          updatedAt: Date.now(),
        };
      } else {
        const newSession: ChatSession = {
          id: sessionId,
          title: trimmed,
          customTitle: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [],
        };
        next = [newSession, ...prev];
      }
      saveStoredHistory(next);
      return next;
    });
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (queueRef.current) queueRef.current.muted = next;
      if (next) queueRef.current?.clear();
      return next;
    });
  }, []);

  const startTalking = useCallback(() => {
    if (recorderRef.current) return;
    setMicError(null);
    void startRecording()
      .then((handle) => {
        recorderRef.current = handle;
        setRecording(true);
        setAgentStatus("listening");
      })
      .catch(() => {
        setMicError(
          "Microphone access was blocked. Allow it in your browser settings to talk to Alie.",
        );
      });
  }, []);

  const stopTalking = useCallback(() => {
    const handle = recorderRef.current;
    if (!handle) return;
    recorderRef.current = null;
    setRecording(false);
    setMicLevel(0);
    void handle.stop().then((blob) => {
      setAgentStatus("thinking");
      client.send({ type: "send_audio", audio: blob, mimeType: "audio/wav" });
    });
  }, [client]);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setMicLevel(recorderRef.current?.level() ?? 0), 80);
    return () => clearInterval(id);
  }, [recording]);

  const toggleTalking = useCallback(() => {
    if (recording) {
      stopTalking();
    } else {
      startTalking();
    }
  }, [recording, startTalking, stopTalking]);

  const value = useMemo<AlieContextValue>(
    () => ({
      config,
      setConfig,
      connection,
      connectionDetail,
      connect,
      disconnect,
      messages,
      activeSessionId,
      chatHistory,
      newChat,
      clearChat,
      loadSession,
      deleteSession,
      renameSession,
      agentStatus,
      terminalLogs,
      clearTerminal: () => setTerminalLogs([]),
      tasks,
      stats,
      sendText,
      createTask,
      toggleTask,
      deleteTask,
      muted,
      toggleMuted,
      recording,
      micLevel,
      micError,
      startTalking,
      stopTalking,
      toggleTalking,
      viewMode,
      setViewMode,
    }),
    [
      config,
      setConfig,
      connection,
      connectionDetail,
      connect,
      disconnect,
      messages,
      activeSessionId,
      chatHistory,
      newChat,
      clearChat,
      loadSession,
      deleteSession,
      renameSession,
      agentStatus,
      terminalLogs,
      tasks,
      stats,
      sendText,
      createTask,
      toggleTask,
      deleteTask,
      muted,
      toggleMuted,
      recording,
      micLevel,
      micError,
      startTalking,
      stopTalking,
      toggleTalking,
      viewMode,
      setViewMode,
    ],
  );

  return <AlieContext.Provider value={value}>{children}</AlieContext.Provider>;
}

export function useAlie() {
  const ctx = useContext(AlieContext);
  if (!ctx) throw new Error("useAlie must be used inside <AlieProvider>");
  return ctx;
}
