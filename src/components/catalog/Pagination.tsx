import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="Paginación de resultados"
    >
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="rounded-lg border border-border p-2 text-text-muted transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
            page === currentPage
              ? "bg-primary text-white"
              : "text-text-muted hover:bg-bg"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        className="rounded-lg border border-border p-2 text-text-muted transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
