import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function PageHead({
  title,
  sub,
  action,
  actionLabel,
}: {
  title: string;
  sub?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {action && (
        <Button variant="primary" onClick={action}>
          <Icon name="plus" size={14} /> {actionLabel}
        </Button>
      )}
    </div>
  );
}
