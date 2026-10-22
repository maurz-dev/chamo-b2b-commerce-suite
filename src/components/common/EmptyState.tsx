import { PackageSearch } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({
  title = "No encontramos resultados",
  message = "Prueba ajustando los filtros o la búsqueda.",
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      {icon ?? <PackageSearch className="h-10 w-10 text-text-muted" aria-hidden />}
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="max-w-sm text-sm text-text-muted">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
