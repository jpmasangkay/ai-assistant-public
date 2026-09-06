# 🌿 Alie

### Your Everyday Personal AI Companion

**Thoughtful conversation. Calm daily planning. Quiet organization.**

Alie is a full-stack, personal AI companion web application designed for real life — combining conversational intelligence, hands-free voice interaction, clean to-do task management, and an integrated daily scratchpad, all presented in a quiet, editorial design system.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start%20%26%20Router-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Nitro](https://img.shields.io/badge/Nitro-Server_Engine-F43F5E?style=for-the-badge&logo=nitro&logoColor=white)](https://nitro.unjs.io)

---

## ✨ Features

### 🎙️ Hands-Free Voice Assistant

- **Voice & Speech Recognition** — speak naturally with Alie hands-free while cooking, walking, or multitasking
- **Live Waveform Visualizer** — real-time microphone level meter gives responsive visual feedback
- **Speech Audio Playback & Mute Control** — toggle spoken responses on or off with a single click
- **Audio Error Guidance** — graceful feedback when microphone permissions are blocked

### 💬 Thoughtful AI Chat & Tool Execution

- **Natural Everyday Conversations** — conversational guidance without technical jargon or complex dashboards
- **Integrated Tool Calling** — inspectable tool executions for message drafting, task management, and information lookup
- **Starter Prompt Chips** — quick 1-tap prompts for daily planning, dinner ideas, email drafting, and explanations
- **Conversation Management** — inline chat renaming, message clearing, and fresh conversation creation

### 📋 Calm To-Do Task Management

- **Clean Daily Checklist** — add tasks with urgency levels (Urgent, Normal, Low)
- **1-Tap Completion** — check off finished items with live progress percentage indicators
- **Quick Cleanup** — clear completed tasks in one click to keep your workspace clutter-free
- **Local Persistence** — all tasks automatically save to browser storage

### 📝 Daily Notes & Scratchpad

- **Always-Accessible Notepad** — jot down thoughts, grocery lists, links, or phone numbers
- **Live Word & Date Tracking** — displays the active date and real-time word count
- **Copy to Clipboard** — 1-click note copy with visual confirmation
- **Automatic Auto-Save** — continuously synced to local storage with zero data loss

### 🗂️ Chat History & Session Switching

- **Persistent Session Storage** — previous conversations are automatically saved and cataloged
- **History Modal Dialog** — browse, resume, rename, or delete past conversations
- **Relative Timestamps** — quickly see recent conversations with intuitive time-ago indicators

### 📱 Mobile-First Responsive Design

- **Native Mobile Experience** — dynamic `h-dvh` viewport prevents browser address bars from obscuring inputs
- **Segmented Mobile Tab Switcher** — cleanly switch between **Chat & Voice** and **To-Dos & Notes** on mobile screens
- **Touch-Optimized Targets** — minimum 36–44px tap targets for buttons, checkboxes, and delete actions
- **iOS Safari Zoom Prevention** — inputs sized at 16px on mobile to eliminate disruptive auto-zoom

### 🎨 Quiet Luxury Design & Dark Mode

- **Paper & Ink Color System** — custom OKLCH color palette optimized for calm, high-legibility readability
- **Zero-Flicker Dark Mode** — theme preferences persist locally and respect system color schemes without flash of unstyled content (FOUC)
- **Fluid Typography** — styled with Archivo for editorial headings and JetBrains Mono for technical details

---

## 🛠️ Tech Stack

### Frontend & Application Layer

| Technology | Purpose |
|-----------|---------|
| **React 19** | Modern component architecture with concurrent rendering and hooks |
| **TypeScript 5** | Strict end-to-end type safety across the entire application |
| **TanStack Start & Router** | Type-safe SSR framework with file-based routing and nested layout trees |
| **TanStack React Query** | Asynchronous state management and client-side data synchronization |
| **Tailwind CSS v4** | Next-generation utility-first styling with inline design system tokens (`@theme`) |
| **Radix UI** | Accessible, unstyled primitives for dialogs, popovers, and accordions |
| **Lucide React** | Consistent, minimalist iconography |
| **Motion** | Fluid UI transitions and interactive micro-animations |
| **Streamdown & Shiki** | Syntax-highlighted code blocks and markdown rendering |

### Server & Tooling

| Technology | Purpose |
|-----------|---------|
| **Vite 8** | High-performance build tool and hot module replacement (HMR) |
| **Nitro** | Universal server engine for local dev, static builds, and edge deployments |
| **ESLint 9 + Prettier** | Code quality enforcement, automated formatting, and style consistency |
| **Web Speech API** | Browser-native speech recognition and audio recording capture |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18.0.0 or higher
- [npm](https://www.npmjs.com) or [Bun](https://bun.sh)

### Installation

```bash
# Clone the repository
git clone https://github.com/jpmasangkay/ai-assistant-public.git
cd ai-assistant-public

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) (or the port indicated in your terminal) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Vite development server with hot module replacement |
| `npm run build` | Compiles and builds production assets using Vite and Nitro |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint across all TypeScript and React files |
| `npm run format` | Automatically formats the codebase with Prettier |

---

## 📁 Project Structure

```
ai-assistant-public/
├── public/                              # Static public assets
│   ├── favicon.svg                      # Custom Alie vector SVG favicon
│   ├── favicon.ico                      # Multi-resolution ICO fallback
│   ├── apple-touch-icon.png             # iOS home screen touch icon
│   └── robots.txt                       # Search engine crawler directives
│
├── src/
│   ├── assets/                          # Brand assets
│   │   ├── alie-mark.svg                # Vector Alie monogram mark
│   │   └── alie-mark.png                # High-res monogram fallback
│   │
│   ├── components/
│   │   ├── ai-elements/                 # Reusable AI conversation primitives
│   │   │   ├── conversation.tsx         # Stick-to-bottom scroll container
│   │   │   ├── message.tsx              # User and assistant message bubbles
│   │   │   ├── prompt-input.tsx         # Textarea input with send button & shortcuts
│   │   │   ├── tool.tsx                 # Expandable tool execution cards
│   │   │   └── code-block.tsx           # Syntax-highlighted code blocks
│   │   │
│   │   ├── alie/                        # Alie application domain components
│   │   │   ├── HeaderBar.tsx            # Top bar with status pill, new chat, and history
│   │   │   ├── ConversationPanel.tsx    # Primary conversation stage & voice controls
│   │   │   ├── TaskList.tsx             # Daily to-do list with priorities and filtering
│   │   │   ├── DailyOverviewPanel.tsx   # Progress bar, calendar date, and scratchpad
│   │   │   ├── ChatHistoryDialog.tsx    # Modal dialog to browse and resume saved chats
│   │   │   ├── ThemeToggle.tsx          # Light/Dark mode switcher
│   │   │   └── Panel.tsx                # Card container with title and action headers
│   │   │
│   │   └── ui/                          # Radix UI and shadcn design system primitives
│   │
│   ├── lib/
│   │   ├── alie/                        # State management and client stores
│   │   │   ├── store.tsx                # Context provider for chats, tasks, and speech
│   │   │   ├── audio.ts                 # Microphone capture and waveform processing
│   │   │   ├── client.ts                # AI Assistant WebSocket / API streaming client
│   │   │   └── types.ts                 # Data models (ChatMessage, Task, Session)
│   │   └── utils.ts                     # Utility helpers (cn class merging)
│   │
│   ├── routes/                          # TanStack Router file-based pages
│   │   ├── __root.tsx                   # Root shell with global meta, fonts, and scripts
│   │   ├── index.tsx                    # Landing page with interactive scenarios & FAQ
│   │   ├── app.tsx                      # Main AI Assistant workspace layout
│   │   ├── login.tsx                    # User sign-in page
│   │   └── signup.tsx                   # User registration page
│   │
│   ├── router.tsx                       # TanStack Router instance creation
│   ├── server.ts                        # Nitro server entry point
│   ├── start.ts                         # TanStack Start handler
│   └── styles.css                       # Tailwind v4 theme, design tokens, and utilities
│
├── package.json                         # Project dependencies and npm scripts
├── tsconfig.json                        # TypeScript compiler options
└── vite.config.ts                       # Vite and TanStack Start plugins configuration
```

---

## 🧠 How It Works

1. **State & Offline-First Persistence** — The application state (`AlieProvider`) manages active chat messages, task lists, scratchpad notes, and conversation history using local browser storage with automatic fallback.

2. **Hands-Free Speech Pipeline** — When the microphone is toggled, browser-native audio streams calculate decibel levels in real time to render animated waveform bars. Speech transcripts feed directly into Alie's conversation stream.

3. **Tool Execution Engine** — When Alie performs actions (such as organizing to-dos or drafting messages), tool execution blocks render inline with input/output payloads and expandable execution diagnostics.

4. **Responsive Dual-Mode Architecture**:
   - **On Desktop (`≥ 1024px`)**: Renders a split-screen workspace with the conversational agent on the left (62%) and the daily companion (Tasks & Notes) pinned on the right (38%).
   - **On Mobile (`< 1024px`)**: Dynamically shifts into a segmented tab interface (`[ Chat & Voice ]` vs `[ To-Dos & Notes ]`) with dynamic `100dvh` height, keeping the prompt input permanently anchored above the mobile virtual keyboard.

5. **Editorial Design Tokens** — Color palettes are built on OKLCH mathematical color spaces (`--paper`, `--ink`, `--signal`, `--rule`), providing contrast that meets WCAG AAA standards in both light and dark themes.

---

## 👏 Acknowledgements

- UI primitives by [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide React](https://lucide.dev/)
- Routing & Data by [TanStack](https://tanstack.com/)
- CSS Framework by [Tailwind CSS](https://tailwindcss.com/)
- Typography by [Archivo](https://fonts.google.com/specimen/Archivo) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
