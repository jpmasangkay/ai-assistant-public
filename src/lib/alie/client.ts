import type {
  ClientEvent,
  ConnectionConfig,
  ConnectionState,
  ServerEvent,
  SystemStats,
  Task,
} from "./types";

type Listener = (event: ServerEvent) => void;
type StateListener = (state: ConnectionState, detail?: string) => void;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

/** Short silent WAV so playback/queue behaviour is exercised without a backend. */
function silentWav(seconds: number): string {
  const rate = 8000;
  const frames = Math.floor(rate * seconds);
  const buffer = new ArrayBuffer(44 + frames * 2);
  const view = new DataView(buffer);
  const str = (pos: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(pos + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  view.setUint32(4, 36 + frames * 2, true);
  str(8, "WAVE");
  str(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, frames * 2, true);
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i] ?? 0);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

const TASKS_STORAGE_KEY = "alie.tasks";

function loadStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Task[];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function saveStoredTasks(tasks: Task[]) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    /* ignore */
  }
}

interface Script {
  tool?: { name: string; input: Record<string, unknown>; terminal: string[]; output: string };
  reply: string;
}

function scriptFor(prompt: string, currentTasks: Task[] = []): Script {
  const p = prompt.toLowerCase();

  if (/(email|letter|draft|write to|message|reply)/.test(p)) {
    return {
      tool: {
        name: "writingAssistant",
        input: { task: "draft_message", tone: "warm and clear" },
        terminal: ["Alie: drafting a thoughtful, friendly message..."],
        output: "Friendly draft prepared",
      },
      reply:
        "Here is a thoughtful message draft you can copy or adapt:\n\n\"Hi there,\n\nI hope you're having a wonderful week! I wanted to follow up quickly regarding our plans and make sure the timing still works smoothly for you. Please let me know if you'd like to adjust anything.\n\nWarm regards,\n[Your Name]\"\n\nLet me know if you'd like it to sound more casual, concise, or enthusiastic!",
    };
  }

  if (/(recipe|dinner|lunch|cook|meal|food|eat|hungry|breakfast)/.test(p)) {
    return {
      reply:
        "Here's a fast, delicious 15-minute idea: Garlic & Lemon Herb Pasta with Fresh Greens!\n\nIngredients:\n• Your favorite pasta\n• 2-3 cloves garlic (thinly sliced)\n• Olive oil, lemon juice, and parmesan\n• A handful of fresh spinach or arugula\n\nSteps:\n1. Boil pasta in salted water until al dente.\n2. In a pan, gently warm olive oil and sliced garlic for 1 minute until fragrant.\n3. Toss in the pasta, a splash of cooking water, and greens until wilted.\n4. Finish with a squeeze of fresh lemon and parmesan. Enjoy!",
    };
  }

  if (/(plan|day|schedule|routine|morning|evening|organize my day)/.test(p)) {
    return {
      reply:
        "Here is a calm, balanced plan for your day:\n\n• Morning (9:00 - 11:30 AM): Focus on your top priority task while your mind is fresh.\n• Midday (12:00 - 1:30 PM): Enjoy a wholesome meal and take a short walk away from screens.\n• Afternoon (2:00 - 4:30 PM): Tackle errands, reply to messages, and tick off quick to-do items.\n• Evening: Unwind, cook something good, and relax!\n\nWould you like me to add any specific reminder to your to-do list?",
    };
  }

  if (/(task|todo|remind|list|grocery|groceries|checklist)/.test(p)) {
    const open = currentTasks.filter((t) => t.status === "open");
    if (currentTasks.length === 0) {
      return {
        reply:
          "Your to-do list is currently empty! You can type a task above or tell me what to remember, and I'll add it for you.",
      };
    }
    const summary =
      open.length > 0
        ? `You have ${open.length} active task${open.length === 1 ? "" : "s"} on your list:\n\n` +
          open.map((t) => `• ${t.title} (${t.priority})`).join("\n") +
          "\n\nLet me know if you'd like me to add a new task or remove one!"
        : "All your tasks are marked as done! 🎉 Let me know if you want to add new ones or clear the list.";

    return {
      tool: {
        name: "taskManager",
        input: { action: "list", status: "open" },
        terminal: ["Alie: checking your active to-do items..."],
        output: `${open.length} active to-dos found`,
      },
      reply: summary,
    };
  }

  if (/(explain|how does|what is|why do|concept|simple terms|teach me)/.test(p)) {
    return {
      reply:
        "Here is an easy way to picture it:\n\nImagine organizing a kitchen pantry. Instead of tossing everything into one random pile, you group items into clean, labeled bins. Whenever you need an ingredient, you find it instantly without stress.\n\nThat same principle applies to any complex concept: breaking big ideas into simple, intuitive pieces makes them effortless to understand!",
    };
  }

  if (/(what can you do|capabilities|how do you work|guide|who are you|help)/.test(p)) {
    return {
      reply:
        "I'm Alie, your daily AI companion! I'm here to:\n\n• Help plan your day, routines, and reminders\n• Draft friendly emails, letters, and replies\n• Suggest recipes, creative ideas, and book recommendations\n• Keep your daily to-do list organized\n• Chat with you anytime via voice or text\n\nHow can I help you today?",
    };
  }

  if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon)\b/.test(p)) {
    return {
      reply:
        "Hello! I'm Alie, ready to help. Would you like to check your to-do items, plan your day, or just chat about an idea?",
    };
  }

  if (/(thanks|thank you|awesome|great|cool|nice)/.test(p)) {
    return {
      reply: "You're very welcome! I'm always right here whenever you need anything.",
    };
  }

  return {
    reply:
      "I'm right here with you! I can help you organize to-dos, draft messages, plan meals, or answer questions — whichever is most helpful right now.",
  };
}

/**
 * Transport for the Alie backend.
 *
 * The event names below are exactly the ones the server emits, so replacing the
 * simulation with a real `new WebSocket(url)` is a change confined to this file.
 */
export class AlieClient {
  private listeners = new Set<Listener>();
  private stateListeners = new Set<StateListener>();
  private tasks: Task[] = loadStoredTasks();
  private statsTimer: ReturnType<typeof setInterval> | null = null;
  private state: ConnectionState = "disconnected";
  private startedAt = Date.now() - 1000 * 60 * 60 * 24 * 9;

  private saveTasks() {
    saveStoredTasks(this.tasks);
  }

  on(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onState(listener: StateListener) {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private emit(event: ServerEvent) {
    this.listeners.forEach((l) => l(event));
  }

  private setState(state: ConnectionState, detail?: string) {
    this.state = state;
    this.stateListeners.forEach((l) => l(state, detail));
  }

  get connected() {
    return this.state === "connected";
  }

  async connect(config: ConnectionConfig) {
    const isDemo =
      !config.serverUrl.trim() ||
      config.serverUrl === "demo" ||
      config.serverUrl === "interactive" ||
      config.token === "demo" ||
      (!config.token.trim() && config.serverUrl === "ws://192.168.1.20:8787");

    this.setState("connecting");
    await sleep(400);

    if (isDemo) {
      this.setState("connected");
      this.emit({
        type: "terminal_output",
        stream: "system",
        text: "connected → Interactive Mode (Ready)",
      });
      this.emit({ type: "tasks", tasks: this.tasks });
      this.pushStats();
      if (!this.statsTimer) {
        this.statsTimer = setInterval(() => this.pushStats(), 4000);
      }
      return;
    }

    if (!config.serverUrl.trim()) {
      this.setState("error", "Server address is empty.");
      return;
    }
    if (!config.token.trim()) {
      this.setState("error", "Missing API token — enter a token or switch to Interactive Demo.");
      return;
    }
    this.setState("connected");
    this.emit({
      type: "terminal_output",
      stream: "system",
      text: `connected → ${config.serverUrl}`,
    });
    this.emit({ type: "tasks", tasks: this.tasks });
    this.pushStats();
    if (!this.statsTimer) {
      this.statsTimer = setInterval(() => this.pushStats(), 4000);
    }
  }

  disconnect() {
    if (this.statsTimer) clearInterval(this.statsTimer);
    this.statsTimer = null;
    this.setState("disconnected");
    this.emit({ type: "terminal_output", stream: "system", text: "socket closed by client" });
  }

  private pushStats() {
    const stats: SystemStats = {
      cpu: 8 + Math.round(Math.random() * 22),
      ramUsedGb: Number((5.4 + Math.random() * 1.6).toFixed(1)),
      ramTotalGb: 16,
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      branch: "main",
      dirtyFiles: 2,
      workspace: "~/dev/alie-server",
    };
    this.emit({ type: "system_stats", stats });
  }

  send(event: ClientEvent) {
    if (!this.connected) {
      this.emit({
        type: "error",
        message: "Not connected. Open settings and connect to your Alie server.",
      });
      return;
    }
    switch (event.type) {
      case "send_message":
        void this.run(event.text);
        break;
      case "send_audio":
        void this.runAudio(event.audio);
        break;
      case "fetch_tasks":
        this.emit({ type: "tasks", tasks: this.tasks });
        break;
      case "create_task": {
        this.tasks = [
          {
            id: "t-" + uid(),
            title: event.title,
            description: "",
            status: "open",
            priority: event.priority,
            created_at: Date.now(),
          },
          ...this.tasks,
        ];
        this.saveTasks();
        this.emit({
          type: "terminal_output",
          stream: "stdout",
          text: `taskManager.create → "${event.title}"`,
        });
        this.emit({ type: "tasks", tasks: this.tasks });
        break;
      }
      case "toggle_task": {
        this.tasks = this.tasks.map((t) =>
          t.id === event.id ? { ...t, status: t.status === "done" ? "open" : "done" } : t,
        );
        this.saveTasks();
        this.emit({ type: "tasks", tasks: this.tasks });
        break;
      }
      case "delete_task": {
        this.tasks = this.tasks.filter((t) => t.id !== event.id);
        this.saveTasks();
        this.emit({
          type: "terminal_output",
          stream: "stdout",
          text: `taskManager.delete → "${event.id}"`,
        });
        this.emit({ type: "tasks", tasks: this.tasks });
        break;
      }
    }
  }

  private async runAudio(audio: Blob) {
    const messageId = "m-" + uid();
    if (audio.size < 2048) {
      this.emit({
        type: "error",
        message: "That recording was empty — hold the button a moment longer.",
      });
      return;
    }
    await sleep(600);
    const seconds = Math.max(1, Math.round(audio.size / 32000));
    const text = `[voice · ${seconds}s] Hi Alie, what's on my to-do list today?`;
    this.emit({ type: "transcript", messageId, text });
    await this.run(text, messageId);
  }

  private async run(prompt: string, transcriptId?: string) {
    const messageId = "a-" + uid();
    const script = scriptFor(prompt, this.tasks);

    this.emit({ type: "agent_thinking", messageId });
    await sleep(650);

    if (script.tool) {
      const toolId = "tc-" + uid();
      this.emit({
        type: "tool_call_start",
        messageId,
        toolId,
        name: script.tool.name,
        input: script.tool.input,
      });
      for (const line of script.tool.terminal) {
        await sleep(180);
        this.emit({
          type: "terminal_output",
          stream: line.startsWith("$") ? "git" : "stdout",
          text: line,
        });
      }
      await sleep(250);
      this.emit({ type: "tool_call_output", messageId, toolId, output: script.tool.output });
    }

    const words = script.reply.split(" ");
    for (let i = 0; i < words.length; i++) {
      await sleep(28);
      this.emit({ type: "stream_text_chunk", messageId, delta: (i === 0 ? "" : " ") + words[i] });
    }
    this.emit({ type: "stream_text_done", messageId });

    await sleep(200);
    const durationMs = Math.min(6000, 900 + words.length * 60);
    this.emit({
      type: "agent_voice_ready",
      messageId,
      audioUrl: silentWav(durationMs / 1000),
      durationMs,
    });
    void transcriptId;
  }
}
