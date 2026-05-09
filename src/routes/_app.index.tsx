import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Compass, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Database } from "@/lib/supabaseClient";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [{ title: "Dashboard — PathLearn" }],
  }),
  component: Dashboard,
});

type LearningDeck = Database["public"]["Tables"]["learning_decks"]["Row"];

function Dashboard() {
  const { user, profile } = useAuth();
  const [decks, setDecks] = useState<LearningDeck[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = useMemo(() => {
    const n = profile?.full_name?.trim();
    if (n) return n.split(/\s+/)[0];
    return (user?.email || "there").split("@")[0];
  }, [profile?.full_name, user?.email]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("learning_decks")
        .select("id, title, description, progress_percentage, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setDecks([]);
        setLoading(false);
        return;
      }
      setDecks(data ?? []);
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border p-8 md:p-10" style={{ background: "var(--gradient-primary)" }}>
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered learning
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-primary-foreground/80 md:text-lg">Ready to learn today?</p>
          <Link
            to="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-medium text-foreground shadow-lg transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Create New Learning Path
          </Link>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Continue learning</h2>
            <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
          </div>
          <Link to="/paths" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="h-4 w-1/2 overflow-hidden rounded bg-muted">
                  <div className="h-full w-full shimmer" />
                </div>
                <div className="mt-3 h-3 w-4/5 overflow-hidden rounded bg-muted">
                  <div className="h-full w-full shimmer" />
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/3 shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : decks.length === 0 ? (
          <EmptyPaths />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((d) => {
              const pct = Math.max(0, Math.min(100, Math.round(d.progress_percentage ?? 0)));
              return (
                <Link
                  key={d.id}
                  to="/path/$id"
                  params={{ id: String(d.id) }}
                  className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <h3 className="text-base font-semibold">{d.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {d.description || "No description yet."}
                  </p>
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                    Continue <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyPaths() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl" style={{ background: "var(--gradient-primary)" }}>
        <Compass className="h-9 w-9 text-primary-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">Start your first learning journey</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Tell PathLearn what you want to learn and we'll build a structured path tailored just for you.
      </p>
      <Link to="/create" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
        <Sparkles className="h-4 w-4" /> Create your first path
      </Link>
    </div>
  );
}