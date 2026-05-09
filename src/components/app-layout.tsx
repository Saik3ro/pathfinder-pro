import { useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookMarked,
  Sparkles,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/paths", label: "My Paths", icon: BookMarked },
  { to: "/create", label: "Create New", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { resolved, setTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const fullName = profile?.full_name?.trim() || "";
  const email = user?.email || "";
  const displayName = fullName || email || "Account";
  const showEmailSubtitle = Boolean(fullName) ? email : "";
  const initials = (fullName || email || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          PathLearn
        </Link>
        <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight" onClick={() => setOpen(false)}>
            <div className="grid h-9 w-9 place-items-center rounded-xl shadow-sm" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg">PathLearn</span>
          </Link>
          <button onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-muted md:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
            className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {resolved === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <div className="flex items-center gap-3 rounded-lg p-2">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              {showEmailSubtitle ? (
                <p className="truncate text-xs text-muted-foreground">{showEmailSubtitle}</p>
              ) : null}
            </div>
          </div>

          <button
            onClick={async () => {
              const { error } = await signOut();
              if (!error) {
                navigate({ to: "/auth", replace: true });
              }
            }}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 md:pl-64">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-20 md:px-8 md:pt-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}