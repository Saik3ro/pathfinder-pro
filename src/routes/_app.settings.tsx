import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Monitor, Moon, Sun, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — PathLearn" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || "");
  }, [profile?.full_name]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
          <Field label="Email" type="email" value={user?.email || ""} readOnly autoComplete="email" />
        </div>
        {error && (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {saved && !error && (
          <p className="mt-4 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Saved.
          </p>
        )}
        <button
          disabled={saving || !user}
          onClick={async () => {
            if (!user) return;
            setSaving(true);
            setError(null);
            setSaved(false);
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ full_name: fullName.trim() || null })
              .eq("id", user.id);
            if (updateError) {
              setError(updateError.message);
            } else {
              setSaved(true);
            }
            setSaving(false);
          }}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
          )}
          Save changes
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-base font-semibold">Theme</h2>
        <p className="text-sm text-muted-foreground">Choose how PathLearn looks to you.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {([
            { v: "light", label: "Light", icon: Sun },
            { v: "dark", label: "Dark", icon: Moon },
            { v: "system", label: "System", icon: Monitor },
          ] as const).map((opt) => (
            <button
              key={opt.v}
              onClick={() => setTheme(opt.v)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition",
                theme === opt.v ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              <opt.icon className="h-5 w-5" />
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-base font-semibold text-destructive">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">Permanently delete your account and all of your data.</p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground">
          <Trash2 className="h-4 w-4" /> Delete account
        </button>
      </section>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input {...rest} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
    </label>
  );
}