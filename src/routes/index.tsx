import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Heart,
  Mic,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Sun,
  ListTodo,
} from "lucide-react";
import { useState } from "react";

import alieMark from "@/assets/alie-mark.png";
import { AlieAvatar } from "@/components/alie/AlieAvatar";
import { ThemeToggle } from "@/components/alie/ThemeToggle";
import { PERSONAS, type PersonaMode } from "@/lib/alie/persona";
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
  text: string;
  done: boolean;
  tag: string | null;
  highlight?: boolean;
}

interface PersonaScenario {
  id: PersonaMode;
  label: string;
  badge: string;
  emoji: string;
  userMsg: string;
  alieMsg: React.ReactNode;
  inputPlaceholder: string;
  tasksRemaining: string;
  tasks: ScenarioTask[];
  tip: string;
}

const PERSONA_SCENARIOS: Record<PersonaMode, PersonaScenario> = {
  cozy: {
    id: "cozy",
    label: "Cozy Companion",
    badge: "Warm & Gentle",
    emoji: "☕",
    userMsg:
      "Good morning Alie! Feeling a bit scattered today. Can you help me plan my day with some breathing room?",
    alieMsg: (
      <>
        <p>
          Good morning! Grab a warm cup of coffee or tea—you don't have to rush through everything
          today. ☕
        </p>
        <p className="text-muted-foreground">
          I’ve shaped your day to stay calm: focus gently on your main project this morning, take
          care of your dentist visit at <strong>2:30 PM</strong>, and pick up groceries on the route
          home.
        </p>
      </>
    ),
    inputPlaceholder: '"Suggest a comforting 15-minute dinner..."',
    tasksRemaining: "2 of 3 gentle items",
    tasks: [
      { text: "Morning tea & gentle stretch", done: true, tag: null, highlight: false },
      { text: "Dentist checkup", done: false, tag: "2:30 PM", highlight: true },
      { text: "Pick up fresh groceries", done: false, tag: "Comfort errand", highlight: false },
    ],
    tip: "Take 10 minutes of quiet space after your appointment before running your errands.",
  },
  candid: {
    id: "candid",
    label: "Candid Co-Pilot",
    badge: "Sharp & Direct",
    emoji: "⚡",
    userMsg:
      "Hey Alie, got a flooded inbox and 3 big deliverables today. Give me the high-impact battle plan.",
    alieMsg: (
      <>
        <p>Here's the bottom line: kill the busywork and lock in two dedicated focus sprints. ⚡</p>
        <p className="text-muted-foreground">
          Block 1 (<strong>10:00 AM - 11:30 AM</strong>): Ship the client proposal while your energy
          is peak. Block 2 (<strong>2:00 PM</strong>): Knock down the 3 blocker emails and archive
          the noise. Hard stop at 5:00 PM.
        </p>
      </>
    ),
    inputPlaceholder: '"Draft a punchy, 3-sentence follow-up..."',
    tasksRemaining: "2 high-impact targets",
    tasks: [
      { text: "Ship Q3 client proposal", done: false, tag: "High Impact", highlight: true },
      { text: "Sprint through 3 inbox blockers", done: false, tag: "2:00 PM", highlight: false },
      { text: "Archive low-priority threads", done: true, tag: "Done", highlight: false },
    ],
    tip: "If an email takes under 2 minutes, kill it right away. Otherwise, defer or delegate.",
  },
  zen: {
    id: "zen",
    label: "Zen Anchor",
    badge: "Mindful & Grounded",
    emoji: "🌿",
    userMsg: "My mind is spinning from nonstop multitasking. How do I regain clarity right now?",
    alieMsg: (
      <>
        <p>
          Pause right here for three conscious breaths. Let your shoulders drop away from your ears.
          🌿
        </p>
        <p className="text-muted-foreground">
          Multitasking is simply scattered attention. Today, let's honor only{" "}
          <strong>one single core intention</strong>: give your complete presence to your writing
          project, and allow tomorrow to hold the rest.
        </p>
      </>
    ),
    inputPlaceholder: '"Guide me through a 2-minute breath reset..."',
    tasksRemaining: "1 centered intention",
    tasks: [
      {
        text: "3 conscious breaths before starting",
        done: true,
        tag: "Centered",
        highlight: false,
      },
      { text: "Single-task core writing project", done: false, tag: "Deep focus", highlight: true },
      { text: "Evening screen-free reflection", done: false, tag: "8:00 PM", highlight: false },
    ],
    tip: "Notice when your thoughts race ahead. Bring your awareness back to your hands and your breath.",
  },
};

function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePersona, setActivePersona] = useState<PersonaMode>("cozy");

  const currentScenario = PERSONA_SCENARIOS[activePersona];

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
              href="#personas"
              className="transition-colors hover:text-foreground font-semibold text-foreground/80"
            >
              Personalities
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
          <div className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
            <span className="flex size-1.5 rounded-full bg-signal" />
            <span>Designed for normal people · Simple, calm, and private</span>
          </div>

          {/* Hero Headline */}
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            An AI companion built for{" "}
            <span className="underline decoration-signal/40 underline-offset-8">real life</span>,
            not tech demos.
          </h1>

          {/* Hero Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Alie helps you talk through your thoughts, organize your daily to-dos, and keep your day
            on track — using natural voice or quick typing. No technical jargon, no overwhelming
            dashboards.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/app"
              className="flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-98 shadow-sm"
            >
              <span>Open Assistant</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/signup"
              className="rounded-md border border-border/80 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-98"
            >
              Create Free Account
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Check className="size-3 text-signal" /> No setup required
            </span>
            <span className="flex items-center gap-1">
              <Check className="size-3 text-signal" /> Works in any browser
            </span>
            <span className="flex items-center gap-1">
              <Check className="size-3 text-signal" /> Voice or typing
            </span>
          </div>
        </div>

        {/* Product UI Mockup / Interactive Demonstration */}
        <div className="mx-auto mt-12 max-w-5xl">
          {/* Interactive Persona Vibe Switcher Pills */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-foreground mr-1 hidden sm:inline">
              Choose Alie's Vibe:
            </span>
            {(["cozy", "candid", "zen"] as PersonaMode[]).map((mode) => {
              const sc = PERSONA_SCENARIOS[mode];
              const p = PERSONAS[mode];
              const active = activePersona === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setActivePersona(mode)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer select-none",
                    active
                      ? cn(
                          "shadow-xs ring-2 ring-foreground/20 font-semibold",
                          p.accentBg,
                          p.accentBorder,
                          p.accentText,
                          "border",
                        )
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span>{sc.emoji}</span>
                  <span>{sc.label}</span>
                  <span
                    className={cn(
                      "text-[10px] rounded-full px-1.5 py-0.2",
                      active
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {sc.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-lg transition-all">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <AlieAvatar
                  size="xs"
                  persona={activePersona}
                  status="speaking"
                  showEmojiBadge={true}
                />
                <span className="text-xs font-semibold text-foreground">Alie Companion</span>
                <span className="hidden text-[11px] text-muted-foreground sm:inline">
                  · {PERSONAS[activePersona].name} Mode
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready to talk</span>
              </div>
            </div>

            {/* Split Preview Grid */}
            <div className="grid grid-cols-1 divide-y divide-border/70 md:grid-cols-[1.5fr_1fr] md:divide-x md:divide-y-0">
              {/* Left Mock: Conversation */}
              <div className="flex flex-col justify-between p-5 sm:p-6 min-h-75">
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-md rounded-lg bg-foreground px-4 py-2.5 text-xs text-background shadow-xs leading-relaxed">
                      {currentScenario.userMsg}
                    </div>
                  </div>

                  {/* Alie response */}
                  <div className="flex justify-start gap-3">
                    <AlieAvatar
                      size="sm"
                      persona={activePersona}
                      status="speaking"
                      showEmojiBadge={false}
                    />
                    <div className="max-w-md space-y-2 rounded-lg border border-border/70 bg-background px-4 py-3 text-xs text-foreground shadow-xs leading-relaxed">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-foreground">Alie</span>
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.2 text-[10px] font-medium border",
                            PERSONAS[activePersona].accentBg,
                            PERSONAS[activePersona].accentBorder,
                            PERSONAS[activePersona].accentText,
                          )}
                        >
                          {PERSONAS[activePersona].emoji} {PERSONAS[activePersona].shortName}
                        </span>
                      </div>
                      {currentScenario.alieMsg}
                    </div>
                  </div>
                </div>

                {/* Input mock bar */}
                <Link
                  to="/app"
                  className="mt-6 flex items-center gap-2 rounded-md border border-border/70 bg-background px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-signal/50"
                  title="Click to open full assistant"
                >
                  <Mic className="size-4 text-signal" />
                  <span className="flex-1 truncate">{currentScenario.inputPlaceholder}</span>
                  <span className="rounded bg-foreground px-2.5 py-1 text-[11px] font-medium text-background">
                    Try it live
                  </span>
                </Link>
              </div>

              {/* Right Mock: To-Do & Day Plan */}
              <div className="bg-muted/20 p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Today's Plan</span>
                  <span className="rounded bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                    {currentScenario.tasksRemaining}
                  </span>
                </div>

                <div className="space-y-2">
                  {currentScenario.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-md border p-2.5 text-xs transition-colors ${
                        task.done
                          ? "border-border/70 bg-card/60 text-muted-foreground"
                          : "border-border/80 bg-card font-medium text-foreground shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {task.done ? (
                          <div className="flex size-4 items-center justify-center rounded border border-signal bg-signal text-background">
                            <Check className="size-3 stroke-3" />
                          </div>
                        ) : (
                          <div className="size-4 rounded border border-border" />
                        )}
                        <span className={task.done ? "line-through text-muted-foreground" : ""}>
                          {task.text}
                        </span>
                      </div>
                      {task.tag && (
                        <span
                          className={`text-[10px] font-semibold ${
                            task.highlight ? "text-signal" : "text-muted-foreground"
                          }`}
                        >
                          {task.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-md border border-border/60 bg-card/60 p-3 text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Alie's Tip:</span>{" "}
                  {currentScenario.tip}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Showcase Section: Three Personalities, Zero Generic AI Clichés */}
      <section
        id="personas"
        className="border-t border-border/70 bg-gradient-to-b from-muted/30 via-background to-card/30 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs font-semibold text-foreground shadow-2xs mb-3">
              <Sparkles className="size-3.5 text-signal" />
              <span>Adaptive Personality Engine</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Three distinct companions. Zero robotic corporate tone.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
              Most AIs sound like an eager customer support script. Alie adapts to how you want to
              feel: comforted over morning tea, laser-focused on deadlines, or grounded in mindful
              calm.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1: Cozy */}
            <div
              onClick={() => setActivePersona("cozy")}
              className={cn(
                "relative cursor-pointer rounded-xl border p-6 transition-all duration-300 backdrop-blur-md shadow-xs flex flex-col justify-between select-none",
                activePersona === "cozy"
                  ? "border-amber-500/50 bg-amber-500/10 dark:bg-amber-500/15 shadow-md scale-[1.02] ring-2 ring-amber-500/30"
                  : "border-border/80 bg-card/70 hover:border-amber-500/30 hover:bg-card",
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <AlieAvatar
                    size="md"
                    persona="cozy"
                    status={activePersona === "cozy" ? "speaking" : "idle"}
                  />
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                    ☕ Cozy Mode
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">
                  Warm & Supportive
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Feels like catching up with a kind friend over tea. Thoughtful check-ins, soothing
                  pacing, comforting 15-minute recipes, and encouraging task celebrations.
                </p>

                <div className="mt-4 rounded-lg border border-border/60 bg-background/80 p-3 text-[11px] text-muted-foreground italic">
                  "Take a slow breath and sip your warm drink. We'll handle today's errands one
                  gentle step at a time."
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs font-medium">
                <span className="text-[11px] text-amber-700 dark:text-amber-300">
                  {activePersona === "cozy" ? "✓ Active in preview" : "Click to preview vibe"}
                </span>
                <span className="size-2 rounded-full bg-amber-500" />
              </div>
            </div>

            {/* Card 2: Candid */}
            <div
              onClick={() => setActivePersona("candid")}
              className={cn(
                "relative cursor-pointer rounded-xl border p-6 transition-all duration-300 backdrop-blur-md shadow-xs flex flex-col justify-between select-none",
                activePersona === "candid"
                  ? "border-violet-500/50 bg-violet-500/10 dark:bg-violet-500/15 shadow-md scale-[1.02] ring-2 ring-violet-500/30"
                  : "border-border/80 bg-card/70 hover:border-violet-500/30 hover:bg-card",
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <AlieAvatar
                    size="md"
                    persona="candid"
                    status={activePersona === "candid" ? "speaking" : "idle"}
                  />
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-800 dark:text-violet-200">
                    ⚡ Candid Mode
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">
                  Sharp & Playful
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Zero corporate filler. Straight-talking advice, high-impact focus blocks, punchy
                  draft emails, and witty momentum to check off your biggest hurdles.
                </p>

                <div className="mt-4 rounded-lg border border-border/60 bg-background/80 p-3 text-[11px] text-muted-foreground italic">
                  "No fluff: knock down the hardest task before lunch, archive the noise, and shut
                  the laptop at 5."
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs font-medium">
                <span className="text-[11px] text-violet-700 dark:text-violet-300">
                  {activePersona === "candid" ? "✓ Active in preview" : "Click to preview vibe"}
                </span>
                <span className="size-2 rounded-full bg-violet-500" />
              </div>
            </div>

            {/* Card 3: Zen */}
            <div
              onClick={() => setActivePersona("zen")}
              className={cn(
                "relative cursor-pointer rounded-xl border p-6 transition-all duration-300 backdrop-blur-md shadow-xs flex flex-col justify-between select-none",
                activePersona === "zen"
                  ? "border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-md scale-[1.02] ring-2 ring-emerald-500/30"
                  : "border-border/80 bg-card/70 hover:border-emerald-500/30 hover:bg-card",
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <AlieAvatar
                    size="md"
                    persona="zen"
                    status={activePersona === "zen" ? "speaking" : "idle"}
                  />
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                    🌿 Zen Mode
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">
                  Mindful & Grounded
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Spacious clarity when life feels hurried. 2-minute breathwork check-ins,
                  single-tasking serenity, peaceful boundary notes, and evening release rituals.
                </p>

                <div className="mt-4 rounded-lg border border-border/60 bg-background/80 p-3 text-[11px] text-muted-foreground italic">
                  "Honor one intention with presence. The mind can only walk one step at a time."
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs font-medium">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  {activePersona === "zen" ? "✓ Active in preview" : "Click to preview vibe"}
                </span>
                <span className="size-2 rounded-full bg-emerald-500" />
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
            <Link to="/app" className="hover:text-foreground">
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
