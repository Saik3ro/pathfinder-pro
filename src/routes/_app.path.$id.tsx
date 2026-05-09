import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Database } from "@/lib/supabaseClient";

export const Route = createFileRoute("/_app/path/$id")({
  head: () => ({
    meta: [{ title: "Learning Path — PathLearn" }],
  }),
  component: PathDetail,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <p>Path not found.</p>
      <Link to="/paths" className="mt-3 inline-block text-primary hover:underline">Back to paths</Link>
    </div>
  ),
});

type LearningDeck = Database["public"]["Tables"]["learning_decks"]["Row"];
type MilestoneProgress = Database["public"]["Tables"]["milestone_progress"]["Row"];

function PathDetail() {
  const { user } = useAuth();
  const { id } = Route.useParams();
  const deckId = Number(id);

  const [deck, setDeck] = useState<LearningDeck | null>(null);
  const [progressRows, setProgressRows] = useState<MilestoneProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) return;
      if (!Number.isFinite(deckId)) {
        setMissing(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setMissing(false);

      const { data: d, error: deckError } = await supabase
        .from("learning_decks")
        .select("*")
        .eq("id", deckId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;
      if (deckError || !d) {
        setDeck(null);
        setProgressRows([]);
        setMissing(true);
        setLoading(false);
        return;
      }
      setDeck(d);

      const { data: p, error: progressError } = await supabase
        .from("milestone_progress")
        .select("*")
        .eq("learning_deck_id", deckId)
        .eq("user_id", user.id);

      if (cancelled) return;
      if (progressError) {
        setProgressRows([]);
      } else {
        setProgressRows(p ?? []);
      }

      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [deckId, user]);

  const milestones = useMemo(() => {
    const raw = deck?.ai_response_json;
    const arr = raw && typeof raw === "object" && Array.isArray((raw as any).milestones) ? (raw as any).milestones : [];
    return (arr as any[]).map((m, idx) => ({
      index: idx,
      title: typeof m?.title === "string" ? m.title : `Milestone ${idx + 1}`,
      description: typeof m?.description === "string" ? m.description : "",
      key_concepts: Array.isArray(m?.key_concepts) ? (m.key_concepts as unknown[]).filter((x) => typeof x === "string") : [],
      estimated_hours: typeof m?.estimated_hours === "number" ? m.estimated_hours : null,
    }));
  }, [deck?.ai_response_json]);

  const completedByIndex = useMemo(() => {
    const map = new Map<number, boolean>();
    for (const r of progressRows) {
      map.set(r.milestone_index, Boolean(r.is_completed));
    }
    return map;
  }, [progressRows]);

  const done = useMemo(() => milestones.filter((m) => completedByIndex.get(m.index)).length, [completedByIndex, milestones]);
  const pct = milestones.length ? Math.round((done / milestones.length) * 100) : Math.round(deck?.progress_percentage ?? 0);

  return (
    <div className="space-y-10">
      <Link to="/paths" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All paths
      </Link>

      {missing ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p>Path not found.</p>
          <Link to="/paths" className="mt-3 inline-block text-primary hover:underline">
            Back to paths
          </Link>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="h-5 w-1/2 overflow-hidden rounded bg-muted">
            <div className="h-full w-full shimmer" />
          </div>
          <div className="mt-3 h-4 w-2/3 overflow-hidden rounded bg-muted">
            <div className="h-full w-full shimmer" />
          </div>
        </div>
      ) : (
        <header className="rounded-3xl border border-border bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
              <span className="text-lg font-semibold text-primary-foreground">
                {(deck?.title || "P").slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{deck?.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{deck?.description || "No description yet."}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">Overall progress</span>
              <span className="text-muted-foreground">
                {milestones.length ? `${done}/${milestones.length} · ` : ""}
                {pct}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: "var(--gradient-primary)" }}
              />
            </div>
          </div>
        </header>
      )}

      {!missing ? (
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight">Milestones</h2>
        {milestones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No milestones yet.
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => {
              const isOpen = expanded === m.index;
              const isDone = Boolean(completedByIndex.get(m.index));
            return (
              <div key={m.index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition",
                    isDone ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                  )}>
                    {isDone ? <Check className="h-4 w-4" /> : m.index + 1}
                  </div>
                  {m.index < milestones.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-card transition" style={{ boxShadow: "var(--shadow-card)" }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : m.index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <div>
                      <h3 className="text-base font-semibold">{m.title}</h3>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="space-y-4 border-t border-border p-5">
                      {m.key_concepts.length > 0 ? (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Key concepts</p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                            {m.key_concepts.map((k) => (
                              <li key={k}>{k}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {typeof m.estimated_hours === "number" ? (
                        <p className="text-sm text-muted-foreground">Estimated time: {m.estimated_hours} hours</p>
                      ) : null}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            onChange={async (e) => {
                              if (!user) return;
                              const isCompleted = e.target.checked;
                              const existing = progressRows.find((r) => r.milestone_index === m.index);
                              if (existing) {
                                const { error } = await supabase
                                  .from("milestone_progress")
                                  .update({
                                    is_completed: isCompleted,
                                    completed_at: isCompleted ? new Date().toISOString() : null,
                                  })
                                  .eq("id", existing.id);
                                if (!error) {
                                  setProgressRows((prev) =>
                                    prev.map((r) =>
                                      r.id === existing.id
                                        ? {
                                            ...r,
                                            is_completed: isCompleted,
                                            completed_at: isCompleted ? new Date().toISOString() : null,
                                          }
                                        : r,
                                    ),
                                  );
                                }
                              } else {
                                const { data, error } = await supabase
                                  .from("milestone_progress")
                                  .insert({
                                    user_id: user.id,
                                    learning_deck_id: deckId,
                                    milestone_index: m.index,
                                    is_completed: isCompleted,
                                    completed_at: isCompleted ? new Date().toISOString() : null,
                                  })
                                  .select("*")
                                  .maybeSingle();
                                if (!error && data) {
                                  setProgressRows((prev) => [...prev, data]);
                                }
                              }
                            }}
                            className="h-4 w-4 rounded border-border accent-[color:var(--primary)]"
                          />
                          Mark as complete
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}
      </section>
      ) : null}

    </div>
  );
}