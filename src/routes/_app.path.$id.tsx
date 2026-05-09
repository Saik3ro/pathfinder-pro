import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, Layers, Sparkles } from "lucide-react";
import { mockPaths } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/path/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${mockPaths.find((p) => p.id === params.id)?.title ?? "Path"} — PathLearn` }],
  }),
  component: PathDetail,
  notFoundComponent: () => (
    <div className="rounded-2xl border border-border bg-card p-10 text-center">
      <p>Path not found.</p>
      <Link to="/paths" className="mt-3 inline-block text-primary hover:underline">Back to paths</Link>
    </div>
  ),
  loader: ({ params }) => {
    const path = mockPaths.find((p) => p.id === params.id);
    if (!path) throw notFound();
    return path;
  },
});

function PathDetail() {
  const path = Route.useLoaderData();
  const [expanded, setExpanded] = useState<string | null>(path.milestones.find((m) => !m.completed)?.id ?? null);
  const [completed, setCompleted] = useState<Record<string, boolean>>(
    Object.fromEntries(path.milestones.map((m) => [m.id, m.completed])),
  );
  const done = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((done / path.milestones.length) * 100);

  return (
    <div className="space-y-10">
      <Link to="/paths" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All paths
      </Link>

      <header className="rounded-3xl border border-border bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-start gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${path.accent}`}>
            <path.icon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{path.topic}</span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{path.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{path.description}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">Overall progress</span>
            <span className="text-muted-foreground">{done}/{path.milestones.length} · {pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
          </div>
        </div>
      </header>

      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight">Milestones</h2>
        <div className="space-y-3">
          {path.milestones.map((m, i) => {
            const isOpen = expanded === m.id;
            const isDone = completed[m.id];
            return (
              <div key={m.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition",
                    isDone ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                  )}>
                    {isDone ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < path.milestones.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-card transition" style={{ boxShadow: "var(--shadow-card)" }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : m.id)}
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
                      <p className="text-sm leading-relaxed text-foreground/80">{m.content}</p>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            onChange={(e) => setCompleted({ ...completed, [m.id]: e.target.checked })}
                            className="h-4 w-4 rounded border-border accent-[color:var(--primary)]"
                          />
                          Mark as complete
                        </label>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                          <Sparkles className="h-4 w-4" /> Generate Flashcards
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Flashcard decks</h2>
        {path.flashcardDecks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No flashcards yet. Generate one from any milestone above.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {path.flashcardDecks.map((d) => (
              <div key={d.id} className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/40">
                  <Layers className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{d.title}</h3>
                <p className="text-xs text-muted-foreground">{d.cards} cards</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}