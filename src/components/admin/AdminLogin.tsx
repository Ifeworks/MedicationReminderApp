import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useApp } from "../../context/AppContext";
import { Logo } from "../common/Logo";
import Icon from "../common/Icon";

export function AdminLogin() {
  const { login } = useAdminAuth();
  const { go } = useApp();

  const [identifier, setIdentifier] = useState("admin@pbdelicacies.com");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(identifier, password, remember);
    } catch (err: any) {
      setError(err?.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-3xl border border-border p-8 sm:p-10 shadow-xl animate-float-up">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" badgeText="Admin" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-4" style={{ color: "var(--brown)" }}>
            Management Portal
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Sign in to manage catalogue, orders & website content
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-3 animate-float-up"
            style={{
              background: "rgba(181, 71, 31, 0.08)",
              borderColor: "rgba(181, 71, 31, 0.25)",
              color: "var(--primary)",
            }}
          >
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email / Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Admin Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--muted-foreground)" }}>
                <Icon name="users" size={17} />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="admin@pbdelicacies.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2"
                style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--brown)" }}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--muted-foreground)" }}>
                <Icon name="shield" size={17} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2"
                style={{ ["--tw-ring-color" as string]: "var(--ring)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
              </button>
            </div>
          </div>

          {/* Remember me & Quick Hint */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: "var(--brown)" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="rounded text-primary focus:ring-ring"
              />
              <span>Remember me</span>
            </label>
            <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              Default: <code className="bg-muted px-1.5 py-0.5 rounded font-mono">admin</code>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-95 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <Icon name="login" size={17} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/80 text-center">
          <button
            onClick={() => go("home")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            <Icon name="arrowLeft" size={13} />
            <span>Return to Customer Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
