import { cn } from "@/lib/cn";

const MAP: Record<string, string> = {
  New: "tag-accent",
  "In review": "tag-info",
  Replied: "tag",
  Won: "tag-accent",
  Closed: "tag",
  Published: "tag-accent",
  Draft: "tag-warn",
  Open: "tag-accent",
  Onsite: "tag-info",
  Offer: "tag-accent",
  "Tech screen": "tag-info",
  "Portfolio review": "tag-warn",
  "Hiring manager": "tag-info",
  Rejected: "tag-danger",
};

export function StatusPill({ status }: { status: string }) {
  return <span className={cn("tag", MAP[status] ?? "tag")}>{status}</span>;
}
