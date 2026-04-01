"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = await login(email, password);
      setSession({
        accessToken: payload.tokens.access,
        refreshToken: payload.tokens.refresh,
        user: payload.user,
      });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-brand">
          <span>Azizam Control</span>
          <h1>Operator access</h1>
          <p>Sign in with a real Django staff account. This app talks directly to the admin API layer.</p>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error ? <p className="form-error full-span">{error}</p> : null}
          <button className="primary-button full-width" type="submit" disabled={submitting}>
            <LockKeyhole size={16} />
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
