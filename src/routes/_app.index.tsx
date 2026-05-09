import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Compass, Plus } from "lucide-react";
import { mockUser, mockPaths } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [{ title: "Dashboard — PathLearn" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const paths = mockPaths;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border p-8 md:p-10" style={{ background: "var(--gradient-primary)" }}>
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered learning
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl">
            Welcome back, {mockUser.name.split(" ")[0]}.
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

        {paths.length === 0 ? <EmptyPaths /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map((p) => {
              const done = p.milestones.filter((m) => m.completed).length;
              const pct = Math.round((done / p.milestones.length) * 100);
              return (
                <Link
                  key={p.id}
                  to="/path/$id"
                  params={{ id: p.id }}
                  className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${p.accent}`}>
                      <p.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{p.topic}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>{done}/{p.milestones.length} milestones</span>
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