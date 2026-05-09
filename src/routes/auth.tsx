import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — PathLearn" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [tab, setTab] = useState<"in" | "up">("in");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <div className="grid h-10 w-10 place-items-center rounded-xl shadow-md" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl tracking-tight">PathLearn</span>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-muted p-1">
            {([{ k: "in", l: "Sign in" }, { k: "up", l: "Sign up" }] as const).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  tab === t.k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                {t.l}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-semibold tracking-tight">
            {tab === "in" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === "in" ? "Sign in to continue your learning." : "Start building your first learning path."}
          </p>

          <form className="mt-6 space-y-3" onSubmit={(e) => e.preventDefault()}>
            {tab === "up" && (
              <input placeholder="Full name" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            )}
            <input type="email" placeholder="Email" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            <input type="password" placeholder="Password" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            <Link to="/" className="block">
              <button type="button" className="mt-2 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                {tab === "in" ? "Sign in" : "Create account"}
              </button>
            </Link>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or continue with <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted">
              <Github className="h-4 w-4" /> GitHub
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted">
              <Mail className="h-4 w-4" /> Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}