import type { Category, ProductFilters } from "../../types";

interface FiltersPanelProps {
  categories: Category[];
  marcas: string[];
  priceRange: { min: number; max: number };
  filters: ProductFilters;
  onToggleCategoria: (id: string) => void;
  onToggleMarca: (marca: string) => void;
  onChangePrecioMin: (value: number | null) => void;
  onChangePrecioMax: (value: number | null) => void;
  onToggleDisponibles: () => void;
  onClear: () => void;
  activeCount: number;
}

export default function FiltersPanel({
  categories,
  marcas,
  priceRange,
  filters,
  onToggleCategoria,
  onToggleMarca,
  onChangePrecioMin,
  onChangePrecioMax,
  onToggleDisponibles,
  onClear,
  activeCount,
}: FiltersPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">
          Filtros
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      {/* Categoría (múltiple) */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Categoría</legend>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={filters.categorias.includes(cat.id)}
                onChange={() => onToggleCategoria(cat.id)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              {cat.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Marca (múltiple) */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">Marca</legend>
        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
          {marcas.map((marca) => (
            <label key={marca} className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={filters.marcas.includes(marca)}
                onChange={() => onToggleMarca(marca)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              {marca}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Rango de precio */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-text">
          Precio (S/ {priceRange.min} – S/ {priceRange.max})
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={priceRange.min}
            max={priceRange.max}
            placeholder="Mín."
            value={filters.precioMin ?? ""}
            onChange={(e) =>
              onChangePrecioMin(e.target.value === "" ? null : Number(e.target.value))
            }
            className="w-full rounded-lg border border-border bg-bg px-2 py-1.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={priceRange.min}
            max={priceRange.max}
            placeholder="Máx."
            value={filters.precioMax ?? ""}
            onChange={(e) =>
              onChangePrecioMax(e.target.value === "" ? null : Number(e.target.value))
            }
            className="w-full rounded-lg border border-border bg-bg px-2 py-1.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </fieldset>

      {/* Disponibilidad */}
      <label className="flex items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={filters.soloDisponibles}
          onChange={onToggleDisponibles}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        Solo productos disponibles
      </label>
    </div>
  );
}
