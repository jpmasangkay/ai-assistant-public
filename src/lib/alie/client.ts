import type {
  ClientEvent,
  ConnectionConfig,
  ConnectionState,
  ServerEvent,
  SystemStats,
  Task,
} from "./types";
import type { PersonaMode } from "./persona";

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

function scriptFor(
  prompt: string,
  currentTasks: Task[] = [],
  persona: PersonaMode = "cozy",
): Script {
  const p = prompt.toLowerCase();

  // 1. Email / Letter / Draft / Writing
  if (/(email|letter|draft|write to|message|reply|boundary|note)/.test(p)) {
    if (persona === "candid") {
      return {
        tool: {
          name: "writingAssistant",
          input: { task: "draft_message", persona: "candid", tone: "crisp & direct" },
          terminal: ["Alie: stripping fluff... drafting high-clarity reply"],
          output: "Punchy draft prepared",
        },
        reply:
          'Here\'s a crisp, direct draft—no filler, straight to the point:\n\n"Hi [Name],\n\nQuick follow-up on [Topic]. Let me know by Thursday if the proposed timing works, or drop your best alternative window.\n\nBest,\n[Your Name]"\n\nClear, respectful of their inbox time, and gets a fast decision. Want me to punch it up or trim further? ⚡',
      };
    }

    if (persona === "zen") {
      return {
        tool: {
          name: "writingAssistant",
          input: { task: "draft_message", persona: "zen", tone: "calm & mindful" },
          terminal: ["Alie: crafting spacious, mindful communication..."],
          output: "Harmonious draft prepared",
        },
        reply:
          'Here is a centered, respectful message with clear boundaries:\n\n"Dear [Name],\n\nI hope your week is flowing with ease. I wanted to follow up gently on our upcoming conversation. Take your time to review, and please let me know what timing feels most sustainable for your schedule.\n\nWith care,\n[Your Name]"\n\nSpacious, polite, and protects everyone\'s peace of mind. 🌿',
      };
    }

    // Cozy (default)
    return {
      tool: {
        name: "writingAssistant",
        input: { task: "draft_message", persona: "cozy", tone: "warm & thoughtful" },
        terminal: ["Alie: brewing a warm, friendly message draft..."],
        output: "Friendly draft prepared",
      },
      reply:
        "Here is a warm, thoughtful message draft you can adapt:\n\n\"Hi [Name],\n\nI hope you're having a wonderful week! I wanted to follow up quickly regarding our plans and make sure the timing still works smoothly for you. Please let me know if you'd like to adjust anything.\n\nWarm regards,\n[Your Name]\"\n\nLet me know if you'd like me to soften it or add any personal touch! ☕",
    };
  }

  // 2. Recipe / Dinner / Food / Meal
  if (/(recipe|dinner|lunch|cook|meal|food|eat|hungry|breakfast)/.test(p)) {
    if (persona === "candid") {
      return {
        reply:
          "Zero-fuss, 12-minute skillet: Crispy Lemon Garlic Protein Scramble & Charred Greens 🍳\n\nIngredients:\n• 3 eggs (or cubed firm tofu)\n• 1 tbsp olive oil or butter\n• 2 cloves minced garlic + red pepper flakes\n• 2 handfuls baby spinach\n• Squeeze of fresh lemon + toasted sourdough\n\nPlaybook:\n1. Skillet on medium-high. Olive oil + garlic + chili flakes for 30 seconds.\n2. Toss in greens until wilted (under 90 seconds).\n3. Crack eggs right in, scramble fast, finish with sea salt & lemon squeeze.\n4. Dump onto crusty toast. Done in 10 minutes flat, one pan to wash. ⚡",
      };
    }

    if (persona === "zen") {
      return {
        reply:
          "A nourishing, mindful grain bowl: Steamed Edamame & Sesame Brown Rice with Ginger Miso Greens 🍵\n\nIngredients:\n• 1 cup warm brown rice or quinoa\n• ½ cup steamed edamame or chickpeas\n• 1 crisp cucumber, sliced thin\n• Tender greens dressed with 1 tsp toasted sesame oil & lemon\n• Sprinkle of toasted sesame seeds\n\nMindful Ritual:\n1. Center the warm grains in your favorite ceramic bowl.\n2. Arrange the cool cucumber, vibrant greens, and edamame side by side.\n3. Lightly drizzle sesame oil and tamari.\n4. Take three slow breaths before eating, savoring the crispness and quiet nourishment. 🌿",
      };
    }

    // Cozy (default)
    return {
      reply:
        "Here's a cozy, comforting 15-minute favorite: Warm Garlic & Lemon Butter Herb Pasta with Fresh Greens 🍲\n\nIngredients:\n• Your favorite pasta (penne or fettuccine)\n• 3 cloves garlic (sliced thin)\n• Good butter & olive oil, fresh lemon juice\n• Fresh baby spinach or arugula\n• Grated parmesan cheese\n\nSteps:\n1. Boil pasta in generously salted water until tender.\n2. In a warm pan, gently melt butter with olive oil and let sliced garlic sizzle gently until golden and fragrant.\n3. Toss in pasta with 2 tbsp of pasta water and greens until softly wilted.\n4. Finish with a squeeze of fresh lemon and lots of parmesan. Enjoy warm! ☕",
    };
  }

  // 3. Plan / Schedule / Routine / Day
  if (/(plan|day|schedule|routine|morning|evening|organize my day)/.test(p)) {
    if (persona === "candid") {
      return {
        reply:
          "Here is a high-leverage 3-block focus framework that ships results without burnout: ⚡\n\n• Block 1: Deep Impact (9:00 - 11:30 AM) — Attack your single hardest task first while your brain is at 100%. Mute notifications.\n• Block 2: Quick Ops (1:00 - 2:30 PM) — Sprint through inbox, messages, and admin to-dos.\n• Block 3: Wrap & Ship (3:30 - 4:45 PM) — Review deliverables, log progress, clear desks.\n• Hard Stop (5:00 PM): Close laptop. Step away.\n\nWant me to lock down your #1 priority task right now?",
      };
    }

    if (persona === "zen") {
      return {
        reply:
          "A mindful daily rhythm anchored in spacious single-tasking: 🌿\n\n• Morning Stillness (8:30 - 9:00 AM): 5 minutes of conscious breath and gentle stretching before looking at any screen.\n• Single Intention (9:00 - 11:30 AM): Devote your energy to one core project with complete presence. No multitasking.\n• Midday Grounding (12:00 - 1:30 PM): Nourish your body, feel your feet on the earth, and take a slow walk.\n• Gentle Flow (2:00 - 4:30 PM): Attend to practical necessities with calm attention.\n• Evening Release: Acknowledge what was done today, and leave the rest in peace.\n\nWhat single intention feels most grounding for you right now?",
      };
    }

    // Cozy (default)
    return {
      reply:
        "Here is a calm, supportive rhythm for your day: ☕\n\n• Morning (9:00 - 11:30 AM): Focus softly on your top priority task while enjoying a warm drink.\n• Midday (12:00 - 1:30 PM): Enjoy a wholesome lunch and take a gentle stroll away from screens.\n• Afternoon (2:00 - 4:30 PM): Tackle errands, reply to messages, and check off easy to-dos.\n• Evening: Unwind completely, light a warm lamp, and relax!\n\nWould you like me to tuck any of these into your to-do checklist?",
    };
  }

  // 4. Tasks / Todo / Checklist
  if (/(task|todo|remind|list|grocery|groceries|checklist)/.test(p)) {
    const open = currentTasks.filter((t) => t.status === "open");
    if (currentTasks.length === 0) {
      if (persona === "candid") {
        return {
          reply:
            "Your board is squeaky clean—zero active tasks! Drop one in or speak it, and let's get after it. ⚡",
        };
      }
      if (persona === "zen") {
        return {
          reply:
            "Your list is completely clear right now. Enjoy the open space, or share an intention whenever you feel called. 🌿",
        };
      }
      return {
        reply:
          "Your to-do list is empty right now! Tell me what's on your mind, and I'll keep track of it for you. ☕",
      };
    }

    const taskLines = open.map((t) => `• ${t.title} (${t.priority})`).join("\n");

    if (persona === "candid") {
      const summary =
        open.length > 0
          ? `Here's what's on deck (${open.length} active item${open.length === 1 ? "" : "s"}):\n\n${taskLines}\n\nWhich one are we knocking down first? ⚡`
          : "All tasks checked off! Mission complete. 🎯 Ready to add more or enjoy the win?";

      return {
        tool: {
          name: "taskManager",
          input: { action: "list", persona: "candid", status: "open" },
          terminal: ["Alie: syncing active mission board..."],
          output: `${open.length} active items found`,
        },
        reply: summary,
      };
    }

    if (persona === "zen") {
      const summary =
        open.length > 0
          ? `Here are the commitments resting in your space (${open.length} active item${open.length === 1 ? "" : "s"}):\n\n${taskLines}\n\nRemember: only one step is taken at a time. What would you like to give your presence to? 🌿`
          : "All items have been brought to completion. Beautiful space has opened up. 🌿";

      return {
        tool: {
          name: "taskManager",
          input: { action: "list", persona: "zen", status: "open" },
          terminal: ["Alie: mindfully gathering open intentions..."],
          output: `${open.length} intentions found`,
        },
        reply: summary,
      };
    }

    // Cozy
    const summary =
      open.length > 0
        ? `You have ${open.length} active to-do${open.length === 1 ? "" : "s"} on your gentle list:\n\n${taskLines}\n\nTake them one at a time. You're doing great! Let me know if you want to add or adjust anything. ☕`
        : "All your tasks are marked as done! 🎉 Savor this moment of calm.";

    return {
      tool: {
        name: "taskManager",
        input: { action: "list", persona: "cozy", status: "open" },
        terminal: ["Alie: checking in on your daily to-dos..."],
        output: `${open.length} active to-dos found`,
      },
      reply: summary,
    };
  }

  // 5. Explain / Learn / Teach
  if (/(explain|how does|what is|why do|concept|simple terms|teach me)/.test(p)) {
    if (persona === "candid") {
      return {
        reply:
          "Bottom line up front: think of it like an airport luggage carousel. ⚡\n\nInstead of searching every single plane cargo hold, everything funnels through one structured conveyor. You wait in one spot and grab your bag the moment it arrives.\n\nComplexity drops to zero when you isolate the core bottleneck. What specific angle do you want broken down?",
      };
    }

    if (persona === "zen") {
      return {
        reply:
          "Picture a still mountain pond. 🌿\n\nWhen water is turbulent, you cannot see the riverbed below. But when the ripples settle, every stone and ripple of sand becomes effortless to see.\n\nAny complex idea works the same way: remove the unnecessary noise, return to the first principle, and the truth naturally clarifies itself.",
      };
    }

    // Cozy
    return {
      reply:
        "Here is a lovely way to picture it: ☕\n\nImagine organizing a cozy kitchen pantry. Instead of tossing everything into one giant cardboard box, you place dried herbs in small glass jars with handwritten labels. Whenever you cook, your hand finds the right spice without any stress.\n\nBreaking big concepts into simple, familiar metaphors makes them feel right at home in your mind!",
    };
  }

  // 6. Capabilities / Who are you
  if (
    /(what can you do|capabilities|how do you work|guide|who are you|help|vibe|persona)/.test(p)
  ) {
    if (persona === "candid") {
      return {
        reply:
          "I'm Alie in Candid mode ⚡ — your sharp, zero-fluff co-pilot.\n\nHere's what I do best:\n• Cut through cognitive clutter and establish ruthless daily priorities\n• Draft punchy emails and concise messages that get immediate answers\n• Track your to-dos and keep momentum moving\n• Brainstorm and stress-test ideas with honest feedback\n\nWhat are we tackling today?",
      };
    }

    if (persona === "zen") {
      return {
        reply:
          "I am Alie in Zen mode 🌿 — your mindful anchor for calm clarity.\n\nI am here to:\n• Cultivate calm, intentional daily rhythms with breathing room\n• Guide simple 2-minute breathwork and mindfulness resets\n• Help you single-task and release mental overwhelm\n• Draft peaceful, boundary-respecting messages\n\nHow may I support your peace of mind right now?",
      };
    }

    // Cozy
    return {
      reply:
        "I'm Alie in Cozy mode ☕ — your warm daily companion!\n\nI'm right here to:\n• Plan your days with gentle, balanced pacing\n• Draft friendly emails, letters, and thoughtful replies\n• Suggest cozy 15-minute recipes and creative ideas\n• Keep your daily to-dos organized without pressure\n• Chat with you anytime via voice or text\n\nHow can I make your day a little brighter?",
    };
  }

  // 7. Greetings
  if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon)\b/.test(p)) {
    if (persona === "candid") {
      return {
        reply: "Hey! Alie here. What's on your radar? Let's get things moving. ⚡",
      };
    }
    if (persona === "zen") {
      return {
        reply:
          "Greetings. I'm here with you. Take a comfortable breath—what shall we reflect on? 🌿",
      };
    }
    return {
      reply:
        "Hello! Warm welcome. I'm Alie, ready to help with anything on your mind today. How are you feeling? ☕",
    };
  }

  // 8. Thanks
  if (/(thanks|thank you|awesome|great|cool|nice)/.test(p)) {
    if (persona === "candid") {
      return {
        reply: "Anytime! Let's keep the streak going. ⚡",
      };
    }
    if (persona === "zen") {
      return {
        reply: "With gratitude. May your day continue in peaceful balance. 🌿",
      };
    }
    return {
      reply: "You're so very welcome! I'm always right here whenever you need me. ☕",
    };
  }

  // Fallback
  if (persona === "candid") {
    return {
      reply:
        "Got it. Let's make it actionable: I can prioritize your to-dos, draft a punchy note, or break down whatever's on your plate. Where do you want to start? ⚡",
    };
  }
  if (persona === "zen") {
    return {
      reply:
        "I am holding space for whatever is present for you. We can organize your intentions gently, reflect together, or simply take this one step at a time. 🌿",
    };
  }
  return {
    reply:
      "I'm right here with you! I can help you organize to-dos, draft messages, plan a cozy meal, or talk through whatever is on your mind. ☕",
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
  private persona: PersonaMode = "cozy";

  setPersona(mode: PersonaMode) {
    this.persona = mode;
  }

  getPersona(): PersonaMode {
    return this.persona;
  }

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
    const script = scriptFor(prompt, this.tasks, this.persona);

    this.emit({ type: "agent_thinking", messageId, persona: this.persona });
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
