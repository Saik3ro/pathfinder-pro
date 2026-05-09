import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";

export const Route = createFileRoute("/_app/create")({
  head: () => ({ meta: [{ title: "Create Path — PathLearn" }] }),
  component: CreatePage,
});

function CreatePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 3500);
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border bg-card p-8 text-center md:p-14" style={{ boxShadow: "var(--shadow-soft)" }}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
          <Wand2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">What do you want to learn?</h1>
        <p className="mt-2 text-muted-foreground">Type any topic and we'll craft a structured path for you.</p>

        <form onSubmit={onGenerate} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Learn TypeScript in 30 days"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" /> {loading ? "Generating…" : "Generate Path"}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Rust basics", "Watercolor painting", "Mandarin A1", "Quantum mechanics"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTopic(s)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">Building your path…</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonMilestone key={i} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SkeletonMilestone({ index }: { index: number }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground">
          {index + 1}
        </div>
        <div className="mt-2 w-px flex-1 bg-border" />
      </div>
      <div className="flex-1 rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="h-4 w-1/3 overflow-hidden rounded bg-muted">
          <div className="h-full w-full shimmer" />
        </div>
        <div className="mt-3 h-3 w-2/3 overflow-hidden rounded bg-muted">
          <div className="h-full w-full shimmer" />
        </div>
        <div className="mt-2 h-3 w-1/2 overflow-hidden rounded bg-muted">
          <div className="h-full w-full shimmer" />
        </div>
      </div>
    </div>
  );
}