import type { SortOption } from "../../types";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "destacados", label: "Destacados primero" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "descuento", label: "Mayor descuento" },
  { value: "nombre-asc", label: "Nombre A–Z" },
  { value: "nombre-desc", label: "Nombre Z–A" },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-text-muted">
      <span className="hidden sm:inline">Ordenar por:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
