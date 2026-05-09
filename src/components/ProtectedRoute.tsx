import type { PropsWithChildren } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

