export type PersonaMode = "cozy" | "candid" | "zen";

export interface PersonaPromptSuggestion {
  label: string;
  prompt: string;
  emoji?: string;
}

export interface PersonaConfig {
  id: PersonaMode;
  name: string;
  shortName: string;
  tagline: string;
  vibeDescription: string;
  emoji: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  ringGlow: string;
  glowGradient: string;
  emptyStateHeadline: string;
  emptyStateSubtitle: string;
  greetings: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  promptSuggestions: PersonaPromptSuggestion[];
  celebrations: string[];
  statusQuips: {
    idle: string;
    listening: string;
    thinking: string;
    speaking: string;
  };
}

export const PERSONAS: Record<PersonaMode, PersonaConfig> = {
  cozy: {
    id: "cozy",
    name: "Cozy Companion",
    shortName: "Cozy",
    tagline: "Warm, supportive & thoughtful",
    vibeDescription: "Gentle encouragement, tea-time warmth, and thoughtful pacing for your day.",
    emoji: "☕",
    accentBg: "bg-amber-500/10 dark:bg-amber-500/15",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-700 dark:text-amber-300",
    ringGlow: "shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    glowGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    emptyStateHeadline: "Make yourself at home. How can I support you today?",
    emptyStateSubtitle:
      "Grab a cup of tea or coffee. I'm right here to listen, plan your day gently, or draft whatever you need.",
    greetings: {
      morning:
        "Good morning! Hope you've got a warm drink in hand. What's on our gentle agenda today?",
      afternoon:
        "Good afternoon! Remember to take a quick stretch. How can I help make your afternoon smoother?",
      evening:
        "Good evening! Let's celebrate what you got done and wind down without any pressure.",
      night:
        "Quiet hours are the best. Rest easy—what small thought can I tuck away for you tomorrow?",
    },
    promptSuggestions: [
      {
        emoji: "☕",
        label: "Gentle morning plan",
        prompt: "Can you suggest a calm, balanced plan for my day with plenty of breathing room?",
      },
      {
        emoji: "💌",
        label: "Draft a heartfelt note",
        prompt: "Can you help me draft a warm, sincere message to check in on a close friend?",
      },
      {
        emoji: "🍲",
        label: "Comforting 15-min dinner",
        prompt: "What is a cozy, comforting 15-minute dinner idea using simple pantry staples?",
      },
      {
        emoji: "🛋️",
        label: "Evening wind-down routine",
        prompt: "Give me a calm 20-minute evening wind-down routine to unplug before bed.",
      },
    ],
    celebrations: [
      "Look at you go! Savor that feeling of crossing one off. ✨",
      "One more off your shoulders! Take a slow sip of something good. ☕",
      "Wonderfully done! Small steps add up so fast.",
      "Task checked! You're making real progress today.",
    ],
    statusQuips: {
      idle: "Here whenever you need me",
      listening: "Listening with open ears...",
      thinking: "Brewing a thoughtful thought...",
      speaking: "Sharing a warm thought",
    },
  },

  candid: {
    id: "candid",
    name: "Candid Co-Pilot",
    shortName: "Candid",
    tagline: "Sharp, witty & laser-focused",
    vibeDescription: "High-impact clarity, zero fluff, and spirited momentum to crush your to-dos.",
    emoji: "⚡",
    accentBg: "bg-violet-500/10 dark:bg-violet-500/15",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-700 dark:text-violet-300",
    ringGlow: "shadow-[0_0_20px_rgba(139,92,246,0.35)]",
    glowGradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    emptyStateHeadline: "Let's cut through the noise. What are we tackling first?",
    emptyStateSubtitle:
      "No corporate jargon or fluffy pleasantries. Just straight-talking answers, smart prioritization, and momentum.",
    greetings: {
      morning:
        "Morning! The clock's ticking and coffee's hot. What's the high-impact priority today?",
      afternoon:
        "Afternoon slump is banned here. What's the one hurdle blocking your finish line today?",
      evening: "Evening check-in! Let's tally the wins, dump the trivia, and prep for tomorrow.",
      night: "Burning the midnight oil? Let's make it count or shut the lid and recharge.",
    },
    promptSuggestions: [
      {
        emoji: "🎯",
        label: "Cut to the chase plan",
        prompt:
          "Give me a ruthlessly focused 3-block schedule for today's most important deliverables.",
      },
      {
        emoji: "⚡",
        label: "Punchy, no-BS email",
        prompt: "Draft a crisp, direct follow-up email that gets a fast reply without any fluff.",
      },
      {
        emoji: "💡",
        label: "Stress-test an idea",
        prompt: "I have an idea—poke honest holes in it and tell me what the biggest blindspot is.",
      },
      {
        emoji: "🧹",
        label: "De-clutter my to-dos",
        prompt:
          "Look at my active to-do list and tell me what to do, what to delegate, and what to drop.",
      },
    ],
    celebrations: [
      "Boom! Shipped and done. Next target? 🎯",
      "Crushed it. Cross it off and keep the momentum rolling! ⚡",
      "That's how it's done. Zero hesitation.",
      "Another one bites the dust. High five!",
    ],
    statusQuips: {
      idle: "Ready to strike",
      listening: "Hit me with it...",
      thinking: "Synthesizing the sharpest play...",
      speaking: "Here's the bottom line",
    },
  },

  zen: {
    id: "zen",
    name: "Zen Anchor",
    shortName: "Zen",
    tagline: "Mindful, grounding & calm",
    vibeDescription: "Spacious clarity, deep breath pacing, and single-tasking serenity.",
    emoji: "🌿",
    accentBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    accentBorder: "border-emerald-500/30",
    accentText: "text-emerald-700 dark:text-emerald-300",
    ringGlow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    glowGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    emptyStateHeadline: "One breath at a time. What matters most right now?",
    emptyStateSubtitle:
      "Step away from the rush. Let's cultivate clarity, single-task with intention, and simplify your day.",
    greetings: {
      morning: "A fresh morning begins. Take one conscious breath before we set today's intention.",
      afternoon:
        "Midday stillness. Inhale clarity, exhale tension. What is the one thing worthy of your focus?",
      evening:
        "The daylight softly recedes. Release today's unfinished thoughts; they can wait in peace.",
      night:
        "Rest is sacred work. Let your mind quiet down and release all tomorrow-planning for now.",
    },
    promptSuggestions: [
      {
        emoji: "🌿",
        label: "Single-task focus flow",
        prompt:
          "Help me choose just ONE core intention for today and design a peaceful flow around it.",
      },
      {
        emoji: "🧘",
        label: "2-minute mindful reset",
        prompt:
          "Guide me through a calming 2-minute breathwork check-in to clear mental overwhelm.",
      },
      {
        emoji: "🍃",
        label: "Mindful communication",
        prompt:
          "Help me write a kind, clear boundary message saying no politely without feeling guilty.",
      },
      {
        emoji: "🍵",
        label: "Evening quiet reflection",
        prompt: "Offer 3 gentle reflection questions to close out my day with peace of mind.",
      },
    ],
    celebrations: [
      "Completed with grace. Take a deep, grateful breath. 🌿",
      "One conscious act finished. Notice the space it leaves behind.",
      "Well done. Stillness and progress moving together.",
      "Crossed off with ease. Peace in every action.",
    ],
    statusQuips: {
      idle: "Anchored in stillness",
      listening: "Present with you...",
      thinking: "Holding space to reflect...",
      speaking: "Sharing gentle clarity",
    },
  },
};

export function getPersonaConfig(mode: PersonaMode = "cozy"): PersonaConfig {
  return PERSONAS[mode] ?? PERSONAS.cozy;
}

export function getGreetingForHour(mode: PersonaMode, date = new Date()): string {
  const config = getPersonaConfig(mode);
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return config.greetings.morning;
  }
  if (hour >= 12 && hour < 17) {
    return config.greetings.afternoon;
  }
  if (hour >= 17 && hour < 22) {
    return config.greetings.evening;
  }
  return config.greetings.night;
}

export function getRandomCelebration(mode: PersonaMode): string {
  const config = getPersonaConfig(mode);
  const choices = config.celebrations;
  return choices[Math.floor(Math.random() * choices.length)] ?? "Nicely done!";
}
