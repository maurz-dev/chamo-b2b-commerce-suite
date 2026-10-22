import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
}

export default function ErrorState({
  message = "Ocurrió un problema al cargar la información.",
  onRetry,
  actionLabel = "Reintentar",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-6 py-16 text-center"
    >
      <AlertTriangle className="h-10 w-10 text-primary" aria-hidden />
      <h3 className="text-lg font-semibold text-text">Algo salió mal</h3>
      <p className="max-w-sm text-sm text-text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
