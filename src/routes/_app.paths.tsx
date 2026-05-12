import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Database } from "@/lib/supabaseClient";

export const Route = createFileRoute("/_app/paths")({
  head: () => ({ meta: [{ title: "My Paths — PathLearn" }] }),
  component: PathsPage,
});

type LearningDeck = Database["public"]["Tables"]["learning_decks"]["Row"];

function PathsPage() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<LearningDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Paths</h1>
          <p className="text-sm text-muted-foreground">All journeys you're on.</p>
        </div>
        <Link to="/create" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> New path
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "completed" 
              ? "bg-green-100 text-green-800" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "incomplete" 
              ? "bg-orange-100 text-orange-800" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          In Progress
        </button>
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
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <h3 className="text-lg font-semibold">No paths yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Create a learning path to see it here.
          </p>
          <Link
            to="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Create your first path
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks
          .filter((d) => {
            if (filter === "completed") return d.progress_percentage === 100;
            if (filter === "incomplete") return d.progress_percentage < 100;
            return true;
          })
          .map((d) => {
            const pct = Math.max(0, Math.min(100, Math.round(d.progress_percentage ?? 0)));
            const isCompleted = pct === 100;
            return (
              <Link
                key={d.id}
                to="/path/$id"
                params={{ id: String(d.id) }}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">{d.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {d.description || "No description yet."}
                    </p>
                  </div>
                  {isCompleted && (
                    <div className="rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs font-medium">
                      Completed
                    </div>
                  )}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-500' : ''}`}
                    style={{ width: `${pct}%`, background: isCompleted ? 'rgb(34 197 94)' : 'var(--gradient-primary)' }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{pct}% complete</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}