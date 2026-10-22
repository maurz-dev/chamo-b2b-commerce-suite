import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  RotateCcw,
  Tag,
} from "lucide-react";
import { useProducts, useCategories } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import { normalizeText } from "../utils/text";
import { ProductGridSkeleton } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/product/QuickViewModal";
import FiltersPanel from "../components/catalog/FiltersPanel";
import SortSelect from "../components/catalog/SortSelect";
import Pagination from "../components/catalog/Pagination";
import { Helmet } from "react-helmet-async";
import type { Product, ProductFilters, SortOption } from "../types";

const PAGE_SIZE = 12;

const EMPTY_FILTERS: ProductFilters = {
  categorias: [],
  marcas: [],
  precioMin: null,
  precioMax: null,
  soloDisponibles: false,
  busqueda: "",
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoriaId } = useParams();

  const { status, data: products, error, refetch } = useProducts();
  const { data: categories } = useCategories();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(searchInput, 300);

  const initialMarca = searchParams.get("marca");

  const [filters, setFilters] = useState<ProductFilters>({
    ...EMPTY_FILTERS,
    categorias: categoriaId ? [categoriaId] : [],
    marcas: initialMarca ? [initialMarca] : [],
  });
  const [sortOption, setSortOption] = useState<SortOption>("destacados");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sincronizar categorías por URL
  useEffect(() => {
    if (categoriaId) {
      setFilters((prev) => ({
        ...prev,
        categorias: [categoriaId],
      }));
    }
  }, [categoriaId]);

  // Sincronizar parámetro ?q= en la barra de búsqueda
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery !== null && urlQuery !== searchInput) {
      setSearchInput(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters, sortOption]);

  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set("q", debouncedSearch);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const marcasDisponibles = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p) => p.marca))).sort();
  }, [products]);

  const priceRange = useMemo(() => {
    if (!products || products.length === 0) return { min: 0, max: 0 };
    const precios = products.map((p) => p.precio);
    return { min: Math.floor(Math.min(...precios)), max: Math.ceil(Math.max(...precios)) };
  }, [products]);

  const filteredSorted = useMemo(() => {
    if (!products) return [];
    const query = normalizeText(debouncedSearch);

    let result = products.filter((p) => {
      if (filters.categorias.length > 0 && !filters.categorias.includes(p.categoria)) {
        return false;
      }
      if (filters.marcas.length > 0 && !filters.marcas.includes(p.marca)) {
        return false;
      }
      if (filters.precioMin !== null && p.precio < filters.precioMin) return false;
      if (filters.precioMax !== null && p.precio > filters.precioMax) return false;
      if (filters.soloDisponibles && p.stock === 0) return false;

      if (query) {
        const haystack = normalizeText(`${p.nombre} ${p.sku} ${p.marca} ${p.categoria}`);
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "nombre-asc":
          return a.nombre.localeCompare(b.nombre, "es");
        case "nombre-desc":
          return b.nombre.localeCompare(a.nombre, "es");
        case "descuento": {
          const descA = a.precioAnterior ? (a.precioAnterior - a.precio) / a.precioAnterior : 0;
          const descB = b.precioAnterior ? (b.precioAnterior - b.precio) / b.precioAnterior : 0;
          return descB - descA;
        }
        case "destacados":
        default:
          return Number(b.destacado) - Number(a.destacado);
      }
    });

    return result;
  }, [products, filters, debouncedSearch, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const paginated = filteredSorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const activeFiltersCount =
    filters.categorias.length +
    filters.marcas.length +
    (filters.precioMin !== null ? 1 : 0) +
    (filters.precioMax !== null ? 1 : 0) +
    (filters.soloDisponibles ? 1 : 0);

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
  };

  const toggleCategoria = (id: string) =>
    setFilters((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(id)
        ? prev.categorias.filter((c) => c !== id)
        : [...prev.categorias, id],
    }));

  const toggleMarca = (marca: string) =>
    setFilters((prev) => ({
      ...prev,
      marcas: prev.marcas.includes(marca)
        ? prev.marcas.filter((m) => m !== marca)
        : [...prev.marcas, marca],
    }));

  const filtersPanelProps = {
    categories: categories ?? [],
    marcas: marcasDisponibles,
    priceRange,
    filters,
    onToggleCategoria: toggleCategoria,
    onToggleMarca: toggleMarca,
    onChangePrecioMin: (v: number | null) => setFilters((p) => ({ ...p, precioMin: v })),
    onChangePrecioMax: (v: number | null) => setFilters((p) => ({ ...p, precioMax: v })),
    onToggleDisponibles: () =>
      setFilters((p) => ({ ...p, soloDisponibles: !p.soloDisponibles })),
    onClear: clearFilters,
    activeCount: activeFiltersCount,
  };

  const activeCategoryName = categoriaId
    ? categories?.find((c) => c.id === categoriaId)?.nombre
    : undefined;

  const pageTitle = activeCategoryName
    ? `${activeCategoryName} | Catálogo Chamo Import S.R.L.`
    : "Catálogo Mayorista | Chamo Import S.R.L.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Catálogo oficial mayorista de Chamo Import S.R.L. Ferretería, iluminación, herramientas y artículos eléctricos con precios para distribuidores."
        />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-text-muted">
        <Link to="/" className="hover:text-primary transition">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalogo" className={`hover:text-primary transition ${!categoriaId ? "font-bold text-text" : ""}`}>
          Catálogo
        </Link>
        {activeCategoryName && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="font-bold text-text">{activeCategoryName}</span>
          </>
        )}
      </nav>

      {/* Título de Sección y Buscador Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary dark:text-text">
            {activeCategoryName || "Catálogo de Productos"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-muted">
            Precios mayoristas, stock en tiempo real y cotización directa por WhatsApp.
          </p>
        </div>

        {/* Buscador de Catálogo */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 sm:w-72 shadow-xs">
          <Search className="h-4 w-4 text-text-muted" aria-hidden />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por SKU o marca..."
            aria-label="Buscar en el catálogo"
            className="w-full bg-transparent text-xs sm:text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="text-text-muted hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros Activos (Chips) */}
      {(activeFiltersCount > 0 || debouncedSearch) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-bg/60 p-3">
          <span className="text-xs font-bold text-text-muted flex items-center gap-1">
            <Tag className="h-3 w-3" /> Filtros aplicados:
          </span>

          {debouncedSearch && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-surface border border-border px-2.5 py-1 text-xs font-medium text-text shadow-xs">
              Búsqueda: "{debouncedSearch}"
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.categorias.map((catId) => {
            const catName = categories?.find((c) => c.id === catId)?.nombre || catId;
            return (
              <span
                key={catId}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-medium text-primary shadow-xs"
              >
                {catName}
                <button
                  type="button"
                  onClick={() => toggleCategoria(catId)}
                  className="hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}

          {filters.marcas.map((marca) => (
            <span
              key={marca}
              className="inline-flex items-center gap-1 rounded-lg bg-surface border border-border px-2.5 py-1 text-xs font-medium text-text shadow-xs"
            >
              Marca: {marca}
              <button
                type="button"
                onClick={() => toggleMarca(marca)}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {filters.soloDisponibles && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-xs">
              Solo con stock
              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, soloDisponibles: false }))}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-red-500 ml-auto transition"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Limpiar todos</span>
          </button>
        </div>
      )}

      {/* Contenido Principal con Sidebar y Grilla */}
      <div className="mt-6 flex gap-8">
        {/* Sidebar de Filtros Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <FiltersPanel {...filtersPanelProps} />
          </div>
        </aside>

        {/* Listado de Productos */}
        <div className="flex-1 min-w-0">
          {/* Toolbar: Contador, Selector de Vista (Grilla/Lista) y Ordenamiento */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-soft">
            <p className="text-xs sm:text-sm font-semibold text-text">
              {status === "success" ? (
                <>
                  Mostrando <strong className="text-primary">{filteredSorted.length}</strong> productos
                </>
              ) : (
                "Cargando catálogo..."
              )}
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botón Filtros Móvil */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-text lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Selector de Vista (Grid / List) */}
              <div className="hidden sm:flex items-center rounded-xl border border-border bg-bg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Vista en cuadrícula"
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === "grid"
                      ? "bg-surface text-primary shadow-xs"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="Vista en lista"
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === "list"
                      ? "bg-surface text-primary shadow-xs"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Selector de Orden */}
              <SortSelect value={sortOption} onChange={setSortOption} />
            </div>
          </div>

          {status === "loading" && <ProductGridSkeleton count={PAGE_SIZE} />}

          {status === "error" && (
            <ErrorState message={error ?? undefined} onRetry={refetch} />
          )}

          {status === "success" && filteredSorted.length === 0 && (
            <EmptyState
              title="No se encontraron productos"
              message="Prueba ajustando los filtros seleccionados o realiza una búsqueda con otro término."
              actionLabel="Limpiar todos los filtros"
              onAction={clearFilters}
            />
          )}

          {status === "success" && filteredSorted.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
                  {paginated.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      variant="grid"
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {paginated.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      variant="list"
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Drawer Móvil de Filtros */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-bold text-text">Filtros de Catálogo</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Cerrar filtros"
                className="rounded-full p-1.5 text-text-muted hover:bg-bg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FiltersPanel {...filtersPanelProps} />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-soft"
            >
              Ver {filteredSorted.length} resultado(s)
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
