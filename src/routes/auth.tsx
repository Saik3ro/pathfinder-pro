import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — PathLearn" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [tab, setTab] = useState<"in" | "up">("in");
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, signInWithGitHub } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (tab === "up") {
        const res = await signUp(email.trim(), password, fullName.trim());
        if (res.error) throw res.error;
        await navigate({ to: "/" });
      } else {
        const { error: signInError } = await signIn(email.trim(), password);
        if (signInError) throw new Error(signInError);
        await navigate({ to: "/" });
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Something went wrong.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    
    try {
      const { error } = await signInWithGoogle();
      if (error) throw new Error(error);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Something went wrong with Google sign in.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setError(null);
    setSubmitting(true);
    
    try {
      const { error } = await signInWithGitHub();
      if (error) throw new Error(error);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Something went wrong with GitHub sign in.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

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

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            {tab === "up" && (
              <input
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            )}
            <input
              id="email"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              id="password"
              name="password"
              autoComplete={tab === "up" ? "new-password" : "current-password"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              )}
              {tab === "in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or continue with <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleGitHubSignIn}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted disabled:opacity-60"
            >
              <Github className="h-4 w-4" /> GitHub
            </button>
            <button 
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted disabled:opacity-60"
            >
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