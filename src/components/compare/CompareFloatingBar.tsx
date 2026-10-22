import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, X, Trash2, ExternalLink } from "lucide-react";
import { useCompare } from "../../context/CompareContext";

export default function CompareFloatingBar() {
  const { compareProducts, removeFromCompare, clearCompare, openCompareModal } = useCompare();

  if (compareProducts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        aria-label="Barra de comparación de productos"
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-[95%] max-w-2xl rounded-2xl border border-primary/30 bg-surface/95 p-3 sm:p-4 shadow-hover backdrop-blur-md"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">
                Comparador ({compareProducts.length}/4)
              </p>
              <p className="text-xs text-text-muted">
                Compara especificaciones técnicas y precios
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            {/* Miniaturas de productos */}
            <div className="flex items-center gap-1.5">
              {compareProducts.map((p) => (
                <div
                  key={p.id}
                  className="group relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-bg p-1 shadow-xs"
                  title={p.nombre}
                >
                  <img
                    src={p.imagenes[0] || ""}
                    alt={p.nombre}
                    className="h-full w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCompare(p.id);
                    }}
                    aria-label={`Eliminar ${p.nombre} del comparador`}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCompare}
                className="rounded-lg p-2 text-text-muted transition hover:bg-bg hover:text-primary"
                title="Limpiar comparador"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={openCompareModal}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary-dark"
              >
                <span>Comparar ahora</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
