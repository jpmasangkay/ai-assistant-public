import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  FileText,
  Heart,
  ListTodo,
  MessageSquare,
  Mic,
  ShieldCheck,
  Sparkles,
  Sun,
  Volume2,
} from "lucide-react";
import { useState } from "react";

import alieMark from "@/assets/alie-mark.png";
import { AlieAvatar } from "@/components/alie/AlieAvatar";
import { ThemeToggle } from "@/components/alie/ThemeToggle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alie" },
      {
        name: "description",
        content:
          "Meet Alie: a thoughtful, quiet personal AI companion for everyday voice and text conversations, daily planning, and to-do organization.",
      },
      { property: "og:title", content: "Alie" },
      {
        property: "og:description",
        content:
          "Thoughtful conversation, calm daily to-dos, and gentle planning for everyday life.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

interface ScenarioTask {
  id: string;
  text: string;
  done: boolean;
  tag: string | null;
  highlight?: boolean;
}

interface FunctionScenario {
  id: "planning" | "voice" | "tasks" | "notes";
  label: string;
  shortLabel: string;
  tagline: string;
  icon: typeof Calendar;
  userMsg: string;
  isVoiceUser?: boolean;
  alieMsg: React.ReactNode;
  inputPlaceholder: string;
  statusLabel: string;
  rightTitle: string;
  rightBadge: string;
  tasks?: ScenarioTask[];
  noteContent?: string;
  tip: string;
}

const FUNCTION_SCENARIOS: FunctionScenario[] = [
  {
    id: "planning",
    label: "Daily Planning",
    shortLabel: "Planning",
    tagline: "Morning Check-In",
    icon: Calendar,
    userMsg:
      "Good morning Alie! Feeling a bit scattered today. Can you help me plan my day with some breathing room?",
    alieMsg: (
      <>
        <p>Good morning! You don't have to rush through everything today.</p>
        <p className="text-muted-foreground mt-1">
          I've shaped your day with plenty of breathing room: focus on your main draft this morning,
          keep your dentist visit at <strong>2:30 PM</strong>, and pick up groceries on the route
          home.
        </p>
      </>
    ),
    inputPlaceholder: '"Suggest a comforting 15-minute dinner..."',
    statusLabel: "Ready to talk",
    rightTitle: "Daily Schedule",
    rightBadge: "2 of 3 gentle items",
    tasks: [
      { id: "p1", text: "Morning stretch & coffee", done: true, tag: null },
      { id: "p2", text: "Dentist checkup", done: false, tag: "2:30 PM", highlight: true },
      { id: "p3", text: "Pick up fresh groceries", done: false, tag: "Comfort errand" },
    ],
    tip: "Take 10 minutes of quiet space after your appointment before running your errands.",
  },
  {
    id: "voice",
    label: "Hands-Free Voice",
    shortLabel: "Voice",
    tagline: "Live Audio & Chores",
    icon: Mic,
    isVoiceUser: true,
    userMsg:
      "Alie, my hands are covered in dough. How long do I bake sourdough in a Dutch oven at 450 degrees?",
    alieMsg: (
      <>
        <p>Bake it with the Dutch oven lid on for 20 minutes at 450°F.</p>
        <p className="text-muted-foreground mt-1">
          Then take the lid off for another 20 minutes until the crust is deep golden brown and
          crackly. I've set a quick reminder for you!
        </p>
      </>
    ),
    inputPlaceholder: '"Voice connected · Speak naturally anytime..."',
    statusLabel: "Voice active",
    rightTitle: "Voice Timer & Action",
    rightBadge: "Mic active",
    tasks: [
      { id: "v1", text: "Remove Dutch oven lid", done: false, tag: "in 20 mins", highlight: true },
      { id: "v2", text: "Cool loaf on wire rack", done: false, tag: "After bake" },
    ],
    tip: "Tap Voice or speak out loud hands-free anytime while cooking dinner or folding laundry.",
  },
  {
    id: "tasks",
    label: "To-Do Checklist",
    shortLabel: "To-Dos",
    tagline: "Zero-Stress Checklist",
    icon: ListTodo,
    userMsg:
      "I have 6 different tasks pulling for my attention and feel overwhelmed. Can we pick just the 2 that matter?",
    alieMsg: (
      <>
        <p>Let's strip away the pressure. You only need to finish two things today.</p>
        <p className="text-muted-foreground mt-1">
          Send the client invoice before noon, and take your 20-minute afternoon walk. Everything
          else can wait until tomorrow.
        </p>
      </>
    ),
    inputPlaceholder: '"Add a task: Review weekly design updates..."',
    statusLabel: "Ready to talk",
    rightTitle: "Daily To-Dos",
    rightBadge: "1 of 3 finished",
    tasks: [
      { id: "t1", text: "Send client invoice", done: true, tag: "Priority" },
      {
        id: "t2",
        text: "20-minute afternoon walk",
        done: false,
        tag: "Main focus",
        highlight: true,
      },
      { id: "t3", text: "Read 10 pages of book", done: false, tag: "When ready" },
    ],
    tip: "Check off items one by one. Fewer open loops means a lighter, quieter mind.",
  },
  {
    id: "notes",
    label: "Notes & Scratchpad",
    shortLabel: "Notes",
    tagline: "Distraction-Free Scratchpad",
    icon: FileText,
    userMsg:
      "Can you save a quick reflection to my journal? 'Calm isn't the absence of chaos, but quiet peace within it.'",
    alieMsg: (
      <>
        <p>Saved right to your scratchpad.</p>
        <p className="text-muted-foreground mt-1">
          It's stored safely on your device in your personal notes, ready whenever you want to
          revisit it or continue writing.
        </p>
      </>
    ),
    inputPlaceholder: '"Jot down loose thoughts, reminders, or reflections..."',
    statusLabel: "Auto-saved",
    rightTitle: "Personal Notes",
    rightBadge: "Saved to device",
    noteContent:
      "Calm isn't the absence of chaos, but quiet peace within it.\n\n— Morning reflection over coffee",
    tip: "Your scratchpad auto-saves in your browser so you never lose loose thoughts or ideas.",
  },
];

const SCENARIO_MAP: Record<"planning" | "voice" | "tasks" | "notes", FunctionScenario> = {
  planning: FUNCTION_SCENARIOS[0]!,
  voice: FUNCTION_SCENARIOS[1]!,
  tasks: FUNCTION_SCENARIOS[2]!,
  notes: FUNCTION_SCENARIOS[3]!,
};

const enterApp = () => {
  try {
    sessionStorage.setItem("alie.app_entered", "true");
  } catch {
    /* ignore */
  }
};

function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"planning" | "voice" | "tasks" | "notes">("planning");
  const currentScenario = SCENARIO_MAP[activeTab];

  const [demoTasks, setDemoTasks] = useState<Record<string, boolean>>({
    p1: true,
    t1: true,
  });

  const [demoCopied, setDemoCopied] = useState(false);

  const toggleDemoTask = (id: string) => {
    setDemoTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDemoCopy = () => {
    if (currentScenario.noteContent) {
      navigator.clipboard.writeText(currentScenario.noteContent);
      setDemoCopied(true);
      setTimeout(() => setDemoCopied(false), 1500);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-signal/20">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
            <div className="flex size-8 items-center justify-center rounded-md border border-signal/20 bg-signal/10 dark:border-border dark:bg-muted/80">
              <img
                src={alieMark}
                alt="Alie"
                width={32}
                height={32}
                className="size-5 object-contain dark:invert"
              />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              Alie
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden items-center gap-7 text-xs font-medium text-muted-foreground sm:flex">
            <a
              href="#experience"
              className="transition-colors hover:text-foreground font-semibold text-foreground/80"
            >
              Why Cozy
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#for-everyone" className="transition-colors hover:text-foreground">
              Everyday Life
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/login"
              className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Sign in
            </Link>

            <Link
              to="/app"
              onClick={enterApp}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 active:scale-95 shadow-xs"
            >
              <span>Try Alie</span>
              <ArrowRight className="size-3.5" />
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Subtle Announcement Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/50 px-3.5 py-1 text-xs font-medium text-foreground shadow-2xs">
            <span className="font-serif">A Quiet Personal Companion</span>
            <span className="text-muted-foreground hidden sm:inline">
              · Calm, thoughtful, and private
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            An AI companion built for{" "}
            <span className="underline decoration-foreground/30 underline-offset-8">real life</span>
            , not tech demos.
          </h1>

          {/* Hero Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Alie helps you talk through thoughts, organize daily to-dos, and capture scratch notes
            with zero pressure. No corporate jargon, no overwhelming dashboards.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/app"
              onClick={enterApp}
              className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 active:scale-98 shadow-2xs"
            >
              <span>Open Assistant</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/signup"
              className="rounded-xl border border-border/80 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-98"
            >
              Create Free Account
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Check className="size-3 text-signal" /> No complex setup
            </span>
            <span className="flex items-center gap-1">
              <Check className="size-3 text-signal" /> Works in any browser
            </span>
            <span className="flex items-center gap-1">
              <Check className="size-3 text-signal" /> Voice or quick typing
            </span>
          </div>
        </div>

        {/* Function Tabs Switcher Bar */}
        <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl border border-border/80 bg-card shadow-2xs w-fit max-w-full">
          {FUNCTION_SCENARIOS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all select-none cursor-pointer",
                  isActive
                    ? "bg-foreground text-background shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
                title={`Switch to ${tab.label}`}
              >
                <Icon className={cn("size-3.5", isActive ? "text-background" : "text-signal")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product UI Mockup / Interactive Demonstration */}
        <div className="mx-auto mt-6 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg transition-all">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <AlieAvatar size="xs" status={activeTab === "voice" ? "speaking" : "idle"} />
                <span className="font-serif text-sm font-bold text-foreground">Alie</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">·</span>
                <span className="text-xs font-medium text-foreground hidden sm:inline">
                  {currentScenario.label}
                </span>
              </div>

              {/* In-header mini tab buttons for quick switching */}
              <div className="hidden sm:flex items-center gap-1 rounded-lg bg-background/80 p-0.5 border border-border/60">
                {FUNCTION_SCENARIOS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                      activeTab === tab.id
                        ? "bg-foreground text-background shadow-2xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.shortLabel}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex size-2 rounded-full",
                    activeTab === "voice" ? "bg-signal animate-pulse" : "bg-signal",
                  )}
                />
                <span>{currentScenario.statusLabel}</span>
              </div>
            </div>

            {/* Split Preview Grid */}
            <div className="grid grid-cols-1 divide-y divide-border/70 md:grid-cols-[1.5fr_1fr] md:divide-x md:divide-y-0">
              {/* Left Mock: Conversation */}
              <div className="flex flex-col justify-between p-5 sm:p-6 min-h-75">
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-md rounded-xl bg-foreground px-4 py-2.5 text-xs text-background shadow-2xs leading-relaxed font-normal">
                      {currentScenario.isVoiceUser && (
                        <div className="flex items-center gap-1 text-[10px] text-background/70 mb-0.5 font-medium">
                          <Mic className="size-3" />
                          <span>Voice input</span>
                        </div>
                      )}
                      {currentScenario.userMsg}
                    </div>
                  </div>

                  {/* Alie response */}
                  <div className="flex justify-start gap-3">
                    <AlieAvatar size="sm" status={activeTab === "voice" ? "speaking" : "idle"} />
                    <div className="max-w-md space-y-2 rounded-xl border border-border/80 bg-card px-4 py-3 text-xs text-foreground shadow-2xs leading-relaxed">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-bold text-xs text-foreground">Alie</span>
                      </div>
                      {currentScenario.alieMsg}
                    </div>
                  </div>
                </div>

                {/* Input mock bar */}
                <Link
                  to="/app"
                  onClick={enterApp}
                  className="mt-6 flex items-center gap-2 rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-muted-foreground transition-all hover:border-foreground/40"
                  title="Click to open full assistant"
                >
                  <Mic className="size-4 text-signal" />
                  <span className="flex-1 truncate">{currentScenario.inputPlaceholder}</span>
                  <span className="rounded-md bg-foreground px-3 py-1 text-[11px] font-medium text-background shadow-2xs">
                    Try live
                  </span>
                </Link>
              </div>

              {/* Right Mock: To-Dos or Scratchpad based on active function */}
              {currentScenario.noteContent ? (
                <div className="bg-muted/10 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-serif text-xs font-bold text-foreground">
                        <FileText className="size-3.5 text-signal" />
                        <span>{currentScenario.rightTitle}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDemoCopy}
                        className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-muted-foreground border border-border/80 bg-card hover:text-foreground transition-colors shadow-2xs cursor-pointer"
                        title="Copy note"
                      >
                        {demoCopied ? (
                          <>
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Copied
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded-lg border border-border/80 bg-card p-3.5 text-xs leading-relaxed text-foreground shadow-2xs whitespace-pre-line font-sans">
                      {currentScenario.noteContent}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-border/70 bg-card/60 p-3 text-[11px] text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Tip:</span>{" "}
                    {currentScenario.tip}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/10 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-serif text-xs font-bold text-foreground">
                        {currentScenario.rightTitle}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-sans">
                        {currentScenario.rightBadge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {currentScenario.tasks?.map((task) => {
                        const isDone =
                          demoTasks[task.id] !== undefined ? demoTasks[task.id] : task.done;
                        return (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => toggleDemoTask(task.id)}
                            className={cn(
                              "w-full flex items-center justify-between rounded-lg border p-2.5 text-xs text-left transition-colors cursor-pointer select-none",
                              isDone
                                ? "border-border/60 bg-card/50 text-muted-foreground"
                                : "border-border/80 bg-card font-medium text-foreground shadow-2xs hover:border-foreground/30",
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={cn(
                                  "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                                  isDone
                                    ? "border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500 text-white"
                                    : "border-border",
                                )}
                              >
                                {isDone && <Check className="size-3 stroke-3" />}
                              </div>
                              <span
                                className={cn(
                                  "truncate",
                                  isDone && "line-through text-muted-foreground opacity-60",
                                )}
                              >
                                {task.text}
                              </span>
                            </div>
                            {task.tag && (
                              <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                                {task.tag}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-border/70 bg-card/60 p-3 text-[11px] text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Tip:</span>{" "}
                    {currentScenario.tip}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Showcase Section */}
      <section
        id="experience"
        className="border-t border-border/70 bg-muted/20 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Crafted with quiet intention. Zero robotic clutter.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
              Most AI apps look like busy developer terminals with cluttered grids and glowing
              gimmicks. Alie is designed to feel like a calm sheet of paper—clean, patient, and
              quiet.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="relative rounded-xl border border-border/80 bg-card p-6 shadow-2xs flex flex-col justify-between transition-all hover:border-foreground/30">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Warm Paper & Calm Contrast
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  No stark clinical glare or glowing sci-fi halos. Alie uses warm paper tones,
                  graphite typography, and clean lines that protect your eyes from fatigue.
                </p>

                <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3 text-[11px] text-muted-foreground leading-relaxed">
                  "Take a slow breath. We will handle today's thoughts one simple step at a time."
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                <span>Distraction-free clarity</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="relative rounded-xl border border-border/80 bg-card p-6 shadow-2xs flex flex-col justify-between transition-all hover:border-foreground/30">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Frictionless Checklist
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Forget high-stress dashboards, frantic kanban columns, and guilt-inducing alarms.
                  Type a quick task, check it off when done, and keep your head clear.
                </p>

                <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3 text-[11px] text-muted-foreground leading-relaxed">
                  "You completed what mattered most today. The rest can wait until tomorrow."
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                <span>Zero-guilt organization</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="relative rounded-xl border border-border/80 bg-card p-6 shadow-2xs flex flex-col justify-between transition-all hover:border-foreground/30">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Quiet Voice & Privacy
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Talk hands-free while cooking dinner or folding laundry. Your personal notes and
                  conversations remain private, with no intrusive tracking.
                </p>

                <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3 text-[11px] text-muted-foreground leading-relaxed">
                  "Your thoughts and reminders stay strictly yours. Private by default."
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                <span>Private by design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="border-t border-border/70 bg-card/40 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Thoughtfully designed for how people actually live
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you need to stay organized without feeling like you're working a second
              job.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs transition-colors hover:border-signal/40">
              <div className="flex size-10 items-center justify-center rounded-md border border-signal/20 bg-signal/10 text-signal dark:border-border dark:bg-muted">
                <Mic className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                Hands-Free Voice
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Speak naturally while cooking, walking, or tidying up. Alie listens attentively and
                answers conversationally.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs transition-colors hover:border-signal/40">
              <div className="flex size-10 items-center justify-center rounded-md border border-signal/20 bg-signal/10 text-signal dark:border-border dark:bg-muted">
                <ListTodo className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                Calm To-Do Lists
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                No complex project management terminology. Just clean, honest tasks you can check
                off one by one.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs transition-colors hover:border-signal/40">
              <div className="flex size-10 items-center justify-center rounded-md border border-signal/20 bg-signal/10 text-signal dark:border-border dark:bg-muted">
                <MessageSquare className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                Conversational Memory
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Rename chats, view past discussions, and pick up right where you left off whenever
                you return.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs transition-colors hover:border-signal/40">
              <div className="flex size-10 items-center justify-center rounded-md border border-signal/20 bg-signal/10 text-signal dark:border-border dark:bg-muted">
                <Sun className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                Daily Reflections
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Start your morning with a gentle overview and wind down your evening with a sense of
                completion.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs transition-colors hover:border-signal/40">
              <div className="flex size-10 items-center justify-center rounded-md border border-signal/20 bg-signal/10 text-signal dark:border-border dark:bg-muted">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                Privacy By Default
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Your personal notes and reminders stay yours. No invasive data selling or annoying
                ad popups.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs transition-colors hover:border-signal/40">
              <div className="flex size-10 items-center justify-center rounded-md border border-signal/20 bg-signal/10 text-signal dark:border-border dark:bg-muted">
                <Heart className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                Human & Approachable
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Built with restrained visuals, clean lines, and a warm tone that feels like a
                supportive friend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Simplicity in three easy steps
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't need a manual or a tutorial to start using Alie.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-card p-6">
              <div className="font-display text-2xl font-bold text-signal">01</div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">Open & Speak or Type</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Click into the assistant and say whatever is on your mind or type a quick thought.
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-card p-6">
              <div className="font-display text-2xl font-bold text-signal">02</div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">Organize Naturally</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Alie helps turn loose thoughts into a neat, actionable list of to-dos and
                priorities.
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-card p-6">
              <div className="font-display text-2xl font-bold text-signal">03</div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">Feel At Peace</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Check off items at your own pace and revisit your chat history whenever you need a
                refresher.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Everyday Scenarios */}
      <section
        id="for-everyone"
        className="border-t border-border/70 bg-muted/20 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            A helper for real daily situations
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Whether you are running a household, balancing work, or studying.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-card p-5">
              <span className="text-xs font-semibold text-signal uppercase tracking-wider">
                Morning Kickoff
              </span>
              <h4 className="mt-1 font-medium text-sm text-foreground">
                "What's on my plate today?"
              </h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Review your priorities over coffee before opening email or getting distracted by
                social media.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-5">
              <span className="text-xs font-semibold text-signal uppercase tracking-wider">
                Midday Multitasking
              </span>
              <h4 className="mt-1 font-medium text-sm text-foreground">
                "Add olive oil and eggs to the list"
              </h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Use your voice while you're in the kitchen or walking without having to tap on small
                screens.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-5">
              <span className="text-xs font-semibold text-signal uppercase tracking-wider">
                Nighttime Wind-down
              </span>
              <h4 className="mt-1 font-medium text-sm text-foreground">
                "Let's review what we finished"
              </h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Acknowledge what went well today, clear tomorrow’s head, and sleep with peace of
                mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="border-t border-border/70 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Common Questions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Straightforward answers with no confusing jargon.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {[
              {
                q: "Is Alie free to use?",
                a: "Yes! You can explore Alie's voice assistant, chat, and daily to-do planning immediately without any credit card.",
              },
              {
                q: "Can I use Alie with voice and text?",
                a: "Absolutely. You can tap the microphone to talk naturally or type quietly into the chat box anytime you prefer.",
              },
              {
                q: "Do I need to install any apps?",
                a: "No installation is needed. Alie runs smoothly right inside your modern web browser on your computer, tablet, or phone.",
              },
              {
                q: "Can I rename and organize my past chats?",
                a: "Yes. You can click on any chat title to rename it, or open the History dialog to review and organize your past conversations.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border/70 bg-card transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-foreground"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-border/60 px-4 pb-4 pt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="border-t border-border/70 bg-card/60 py-16 px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Bring calm to your daily routine today.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Try Alie right now or create a free account to keep your conversations saved.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/app"
              onClick={enterApp}
              className="flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 active:scale-95 shadow-sm"
            >
              <span>Try Alie Now</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/signup"
              className="rounded-md border border-border/80 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md border border-signal/20 bg-signal/10 dark:border-border">
              <img
                src={alieMark}
                alt="Alie"
                width={24}
                height={24}
                className="size-3.5 object-contain dark:invert"
              />
            </div>
            <span className="text-xs font-semibold text-foreground">Alie Companion</span>
            <span className="text-[11px] text-muted-foreground">· For real life, every day.</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/app" onClick={enterApp} className="hover:text-foreground">
              Assistant
            </Link>
            <Link to="/login" className="hover:text-foreground">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-foreground">
              Sign Up
            </Link>
            <span className="text-border">|</span>
            <span>© {new Date().getFullYear()} Alie. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
