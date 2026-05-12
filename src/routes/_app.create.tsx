import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { generateLearningPath } from "@/lib/gemini";

export const Route = createFileRoute("/_app/create")({
  head: () => ({ meta: [{ title: "Create Path — PathLearn" }] }),
  component: CreatePage,
});

type LearningPathResult = {
  title: string;
  description: string;
  milestones: Array<{
    title: string;
    description: string;
    key_concepts: string[];
    estimated_hours: number;
  }>;
};

function CreatePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LearningPathResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const trimmedTopic = topic.trim();

  const loadingSteps = useMemo(
    () => [
      "Analyzing your topic...",
      "Designing your curriculum...",
      "Structuring milestones...",
      "Almost ready...",
    ],
    [],
  );
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const t = window.setInterval(() => {
      setLoadingStep((s) => (s + 1) % loadingSteps.length);
    }, 2000);
    return () => window.clearInterval(t);
  }, [loading, loadingSteps.length]);

  const reset = () => {
    setLoading(false);
    setSaving(false);
    setResult(null);
    setError(null);
  };

  const onGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = trimmedTopic;
    if (!t || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = (await generateLearningPath(t)) as LearningPathResult;
      setResult(data);
    } catch (err) {
      const message =
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
          ? (err as any).message
          : "Failed to generate learning path.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <section
        className="rounded-3xl border border-border bg-card p-8 text-center md:p-14"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
          <Wand2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">What do you want to learn?</h1>
        <p className="mt-2 text-muted-foreground">Type any topic and we'll craft a structured path for you.</p>

        {error && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-left text-sm text-destructive">
            <p className="font-medium">Generation failed</p>
            <p className="mt-1 text-destructive/90">{error}</p>
            <div className="mt-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !result && !error && (
          <>
            <form onSubmit={onGenerate} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Introduction to Python, Digital Photography, World History..."
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={!trimmedTopic || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" /> Generate Path
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
          </>
        )}

        {loading && (
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">{loadingSteps[loadingStep]}</p>
            <div className="flex items-center gap-2">
              {loadingSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${i === loadingStep ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !result && !error ? null : null}
      </section>

      {result && (
        <section className="space-y-6">
          <header
            className="rounded-3xl border border-border bg-card p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{result.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">{result.description}</p>
          </header>

          <div className="space-y-3">
            {result.milestones.map((m, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground">
                    {idx + 1}
                  </div>
                  {idx < result.milestones.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                </div>

                <div
                  className="flex-1 rounded-2xl border border-border bg-card p-5"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold">{m.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {m.estimated_hours}h
                    </span>
                  </div>

                  {m.key_concepts?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.key_concepts.map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={async () => {
                if (!user) {
                  setError("You must be signed in to save a path.");
                  return;
                }
                if (!result) return;
                setSaving(true);
                setError(null);

                const { data, error: insertError } = await supabase
                  .from("learning_decks")
                  .insert({
                    user_id: user.id,
                    title: result.title,
                    description: result.description,
                    ai_response_json: result,
                    progress_percentage: 0,
                    is_public: false,
                  })
                  .select("id")
                  .maybeSingle();

                if (insertError || !data) {
                  setError(insertError?.message || "Failed to save path.");
                  setSaving(false);
                  return;
                }

                setSaving(false);
                navigate({ to: "/path/$id", params: { id: String(data.id) } });
              }}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Path
            </button>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setError(null);
                setSaving(false);
              }}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
            >
              Regenerate
            </button>
          </div>
        </section>
      )}
    </div>
  );
}