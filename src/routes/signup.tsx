import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import alieMark from "@/assets/alie-mark.png";
import { ThemeToggle } from "@/components/alie/ThemeToggle";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Alie" },
      {
        name: "description",
        content: "Sign up for Alie, your thoughtful daily AI companion.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Non-functional mock registration for now, smoothly transitions to /app
    navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-border/70 px-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          title="Back to home"
        >
          <div className="flex size-7 items-center justify-center rounded-md border border-signal/20 bg-signal/10 dark:border-border dark:bg-muted/80">
            <img
              src={alieMark}
              alt="Alie"
              width={28}
              height={28}
              className="size-4 object-contain dark:invert"
            />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-foreground">
            Alie
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="rounded-md border border-border/80 bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
          >
            Sign in
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs sm:p-8">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Get started with Alie
              </h1>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                A calm, friendly companion for your daily routine.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-medium text-foreground">
                  What should Alie call you?
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-signal focus:ring-1 focus:ring-signal"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-foreground">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-signal focus:ring-1 focus:ring-signal"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-signal focus:ring-1 focus:ring-signal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="agree"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-border text-signal accent-signal focus:ring-signal"
                />
                <label htmlFor="agree" className="text-xs text-muted-foreground leading-snug">
                  I agree to the{" "}
                  <span className="text-foreground underline underline-offset-2">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-foreground underline underline-offset-2">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 active:scale-[0.99]"
              >
                <span>Create account</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/70" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-card px-2 text-muted-foreground">or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate({ to: "/app" })}
                className="flex items-center justify-center gap-2 rounded-md border border-border/80 bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.94 6.72-4.94z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => navigate({ to: "/app" })}
                className="flex items-center justify-center gap-2 rounded-md border border-border/80 bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.34-.55.63-1.03 1.66-.9 2.69 1 .08 2.03-.49 2.59-1.18z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            <div className="mt-6 border-t border-border/70 pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to home
            </Link>
          </div>

          <p className="mt-5 text-center text-[11px] text-muted-foreground">
            No credit card needed · Free personal plan to start
          </p>
        </div>
      </main>
    </div>
  );
}
