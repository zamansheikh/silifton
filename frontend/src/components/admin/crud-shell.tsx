"use client";

/**
 * Reusable bits every admin CRUD page needs:
 *   - <FormPanel>    : edit/create wrapper above the list
 *   - <ErrorBanner>  : dismissible error strip
 *   - <EmptyRow>     : "no items" / loading state row
 */

import { Icon } from "@/components/ui/icon";

export function FormPanel({
  title,
  id,
  children,
}: {
  title: string;
  id?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="panel" style={{ padding: 24, marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{title}</h3>
        {id && (
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--fg-faint)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {id}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: "10px 14px",
        color: "var(--danger)",
        border: "1px solid rgba(255,90,95,0.3)",
        background: "rgba(255,90,95,0.06)",
        borderRadius: 8,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="icon-btn"
          style={{ width: 24, height: 24, color: "var(--danger)" }}
          aria-label="Dismiss"
        >
          <Icon name="plus" size={14} className="" />
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  loading,
  empty,
  search,
}: {
  loading: boolean;
  empty: boolean;
  search?: string;
}) {
  if (loading) {
    return <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>Loading…</div>;
  }
  if (empty) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "var(--fg-mute)" }}>
        {search ? "No matches." : "Nothing here yet."}
      </div>
    );
  }
  return null;
}
