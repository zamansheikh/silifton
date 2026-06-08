"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type Filter = { value: string; options: string[] };

export function AdminToolbar({
  count,
  label,
  search,
  onSearch,
  filters,
  onAction,
  actionLabel,
}: {
  count: number;
  label: string;
  search?: string;
  onSearch?: (v: string) => void;
  filters?: Filter[];
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="admin-toolbar">
      <div className="admin-toolbar__left">
        <span className="admin-toolbar__count">
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>{count}</span> {label}
        </span>
        <span className="admin-toolbar__divider" aria-hidden />
        <div className="admin-search admin-toolbar__search">
          <Icon name="search" size={13} />
          <input
            value={search ?? ""}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}…`}
          />
        </div>
        {filters?.map((f, i) => (
          <select
            key={i}
            className="select admin-toolbar__filter"
            defaultValue={f.value}
          >
            {f.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div className="admin-toolbar__right">
        <Button variant="ghost" size="sm"><Icon name="filter" size={13} /> Filters</Button>
        <Button variant="ghost" size="sm"><Icon name="download" size={13} /> Export</Button>
        {onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            <Icon name="plus" size={13} /> {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
