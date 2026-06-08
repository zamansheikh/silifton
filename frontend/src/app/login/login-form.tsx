"use client";

import { useActionState, useEffect } from "react";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  // On success, do a HARD navigation so the freshly-set httpOnly cookie is
  // included in the next request. router.push() / soft navigation has been
  // unreliable in Next 16 dev mode for this exact post-Set-Cookie hop.
  useEffect(() => {
    if (state.ok && state.redirectTo) {
      window.location.assign(state.redirectTo);
    }
  }, [state]);

  const signingIn = pending || state.ok;

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" placeholder="you@example.com" />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" placeholder="••••••••" />
      </div>

      {state.error && (
        <div
          style={{
            padding: "10px 12px",
            border: "1px solid rgba(255,90,95,0.3)",
            background: "rgba(255,90,95,0.06)",
            color: "var(--danger)",
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={signingIn}
        className="btn btn-primary"
        style={{ justifyContent: "center", marginTop: 8, opacity: signingIn ? 0.7 : 1 }}
      >
        {state.ok ? "Redirecting…" : pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
