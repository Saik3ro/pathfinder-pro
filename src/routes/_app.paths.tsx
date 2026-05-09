import { createFileRoute, Link } from "@tanstack/react-router";
import { mockPaths } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/paths")({
  head: () => ({ meta: [{ title: "My Paths — PathLearn" }] }),
  component: PathsPage,
});

function PathsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Paths</h1>
          <p className="text-sm text-muted-foreground">All the journeys you're on.</p>
        </div>
        <Link to="/create" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> New path
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockPaths.map((p) => {
          const done = p.milestones.filter((m) => m.completed).length;
          const pct = Math.round((done / p.milestones.length) * 100);
          return (
            <Link key={p.id} to="/path/$id" params={{ id: p.id }} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${p.accent}`}>
                <p.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{done}/{p.milestones.length} milestones · {pct}%</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}