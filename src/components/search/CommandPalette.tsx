import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Tag, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts, useCategories } from "../../hooks/useProducts";
import { normalizeText } from "../../utils/text";
import type { Product } from "../../types";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelectedIndex(0);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Global keydown listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtrado reactivo de productos
  const filteredProducts = (products || []).filter((p) => {
    if (!query.trim()) return false;
    const cleanQuery = normalizeText(query);
    return (
      normalizeText(p.nombre).includes(cleanQuery) ||
      normalizeText(p.sku).includes(cleanQuery) ||
      normalizeText(p.marca).includes(cleanQuery) ||
      normalizeText(p.categoria).includes(cleanQuery)
    );
  }).slice(0, 8);

  const handleSelectProduct = (product: Product) => {
    navigate(`/producto/${product.id}`);
    onClose();
  };

  const handleSelectCategory = (catId: string) => {
    navigate(`/catalogo/${catId}`);
    onClose();
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  // Keyboard navigation up / down / enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredProducts.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredProducts.length) % Math.max(1, filteredProducts.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredProducts[selectedIndex]) {
        handleSelectProduct(filteredProducts[selectedIndex]);
      } else if (query.trim()) {
        handleViewAllResults();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Palette Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
            <Search className="h-5 w-5 text-primary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar por nombre, SKU, marca (ej. Truper, Disco, S-001)..."
              className="flex-1 bg-transparent text-base text-text placeholder:text-text-muted focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-full p-1 text-text-muted hover:bg-bg hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-bg px-2 py-0.5 text-[11px] font-mono text-text-muted">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-3">
            {query.trim() === "" ? (
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  Explorar Categorías Rápidas
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(categories || []).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className="flex items-center gap-2 rounded-xl border border-border bg-bg/50 p-2.5 text-left text-xs font-semibold text-text transition hover:border-primary hover:bg-surface hover:text-primary"
                    >
                      <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{cat.nombre}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Marcas Más Buscadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["TRUPER", "3M", "BAUKER", "TEKNO", "TOPEX", "STECK", "ASAKI"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          navigate(`/catalogo?q=${encodeURIComponent(m)}`);
                          onClose();
                        }}
                        className="rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-text transition hover:border-primary hover:text-primary"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-text">No se encontraron productos</p>
                <p className="mt-1 text-xs text-text-muted">
                  Intenta buscar con otro término o consulta todo el catálogo.
                </p>
                <button
                  type="button"
                  onClick={handleViewAllResults}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary-dark"
                >
                  <span>Buscar "{query}" en Catálogo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                  Resultados encontrados ({filteredProducts.length})
                </p>
                <ul className="flex flex-col gap-1.5">
                  {filteredProducts.map((p, idx) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(p)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition ${
                          selectedIndex === idx
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "hover:bg-bg border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-surface p-1">
                            <img
                              src={p.imagenes[0] || ""}
                              alt={p.nombre}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                {p.marca}
                              </span>
                              <span className="font-mono text-[10px] text-text-muted">
                                · {p.sku}
                              </span>
                            </div>
                            <p className="truncate text-sm font-semibold text-text">
                              {p.nombre}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-primary">
                              {currency.format(p.precio)}
                            </span>
                            <span className="block text-[10px] text-text-muted">
                              Mayorista: {currency.format(p.precioMayorista)}
                            </span>
                          </div>
                          <CornerDownLeft className="h-4 w-4 text-text-muted opacity-60" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 border-t border-border pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleViewAllResults}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Ver todos los resultados para "{query}" en Catálogo</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between border-t border-border bg-bg/50 px-4 py-2.5 text-[11px] text-text-muted">
            <div className="flex items-center gap-3">
              <span><kbd className="rounded border border-border px-1">↑</kbd> <kbd className="rounded border border-border px-1">↓</kbd> Navegar</span>
              <span><kbd className="rounded border border-border px-1">↵</kbd> Seleccionar</span>
            </div>
            <span>Búsqueda instantánea en catálogo</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
