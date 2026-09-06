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
import { ThemeToggle } from "@/components/alie/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alie — Your Everyday AI Companion" },
      {
        name: "description",
        content:
          "Meet Alie: a thoughtful, quiet personal AI companion for everyday voice and text conversations, daily planning, and to-do organization.",
      },
      { property: "og:title", content: "Alie — Your Everyday AI Companion" },
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

interface Scenario {
  id: string;
  label: string;
  badge: string;
  userMsg: string;
  alieMsg: React.ReactNode;
  inputPlaceholder: string;
  tasksRemaining: string;
  tasks: ScenarioTask[];
  tip: string;
}

function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const scenarios: Scenario[] = [
    {
      id: "morning",
      label: "Morning Planning",
      badge: "Voice or Text",
      userMsg:
        "Good morning! Can you help me sort out my day? I have a dentist appointment and need to buy groceries.",
      alieMsg: (
        <>
          <p>Good morning! I’ve scheduled your day to keep things calm.</p>
          <p className="text-muted-foreground">
            Your dentist visit is at <strong>2:30 PM</strong>, so I’d suggest grabbing groceries
            around <strong>4:00 PM</strong> on your way home. Would you like me to set a reminder 30
            minutes before?
          </p>
        </>
      ),
      inputPlaceholder: '"Remind me to grab the receipt..."',
      tasksRemaining: "2 of 3 remaining",
      tasks: [
        { text: "Morning stretch & coffee", done: true, tag: null, highlight: false },
        { text: "Dentist checkup", done: false, tag: "2:30 PM", highlight: true },
        { text: "Pick up groceries", done: false, tag: "High priority", highlight: false },
      ],
      tip: "Take a 10-minute breath after your appointment before running to the store.",
    },
    {
      id: "voice",
      label: "Hands-Free Voice",
      badge: "Spoken Audio",
      userMsg: "Hey Alie, add sourdough bread, olive oil, and coffee beans to my errand list.",
      alieMsg: (
        <>
          <p>Added all three to your errands list!</p>
          <p className="text-muted-foreground">
            Since you're passing by the local market after work, you can pick them up in a single
            stop. I've grouped them under your groceries checklist.
          </p>
        </>
      ),
      inputPlaceholder: '"Also add paper towels to that list..."',
      tasksRemaining: "3 new items added",
      tasks: [
        { text: "Buy sourdough bread", done: false, tag: "Grocery", highlight: true },
        { text: "Pick up olive oil", done: false, tag: "Grocery", highlight: false },
        { text: "Get whole coffee beans", done: false, tag: "Grocery", highlight: false },
      ],
      tip: "You can use your voice anytime hands-free while cooking or driving.",
    },
    {
      id: "evening",
      label: "Evening Wind-Down",
      badge: "Calm Reflection",
      userMsg: "Let's review what we finished today and prep tomorrow with zero stress.",
      alieMsg: (
        <>
          <p>You completed 4 important tasks today!</p>
          <p className="text-muted-foreground">
            The dentist visit and groceries are done. Tomorrow only has 1 morning meeting, so your
            afternoon is completely open. Rest easy tonight.
          </p>
        </>
      ),
      inputPlaceholder: '"What time is my first call tomorrow?"',
      tasksRemaining: "All done for today!",
      tasks: [
        { text: "Dentist appointment", done: true, tag: "Completed", highlight: false },
        { text: "Grocery shopping", done: true, tag: "Completed", highlight: false },
        { text: "Clean kitchen counters", done: true, tag: "Completed", highlight: false },
      ],
      tip: "A clear desk and 10 minutes of screen-free winding down helps you wake up refreshed.",
    },
  ];

  const currentScenario: Scenario = scenarios[activeScenario] ?? scenarios[0]!;

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

          <div className="mt-4 flex items-center justify-center gap-5 text-[11px] text-muted-foreground">
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
          {/* Interactive Scenario Switcher Pills */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">
              Try a scenario:
            </span>
            {scenarios.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveScenario(idx)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeScenario === idx
                    ? "bg-foreground text-background shadow-xs ring-2 ring-signal/30"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{sc.label}</span>
                <span
                  className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                    activeScenario === idx
                      ? "bg-background/20 text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {sc.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-lg transition-all">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-md border border-signal/20 bg-signal/10 dark:border-border">
                  <img
                    src={alieMark}
                    alt="Alie"
                    width={20}
                    height={20}
                    className="size-3.5 object-contain dark:invert"
                  />
                </div>
                <span className="text-xs font-semibold text-foreground">Alie Daily Assistant</span>
                <span className="hidden text-[11px] text-muted-foreground sm:inline">
                  · Live Interactive Preview
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
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-signal/20 bg-signal/10 text-xs font-semibold text-signal dark:border-border dark:bg-muted dark:text-foreground">
                      A
                    </div>
                    <div className="max-w-md space-y-2 rounded-lg border border-border/70 bg-background px-4 py-3 text-xs text-foreground shadow-xs leading-relaxed">
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
