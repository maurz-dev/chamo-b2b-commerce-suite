import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check, AlertCircle, ArrowRightLeft } from "lucide-react";
import { useCompare } from "../../context/CompareContext";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export default function CompareModal() {
  const { compareProducts, removeFromCompare, clearCompare, isCompareModalOpen, closeCompareModal } =
    useCompare();
  const { addToCart } = useCart();

  if (!isCompareModalOpen) return null;

  // Extraer todas las llaves de especificaciones de todos los productos seleccionados
  const allSpecKeys = Array.from(
    new Set(
      compareProducts.flatMap((p) => Object.keys(p.especificaciones || {}))
    )
  ).sort();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeCompareModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div>
                <h2 id="compare-modal-title" className="text-lg font-bold text-text">
                  Comparador Técnico de Productos
                </h2>
                <p className="text-xs text-text-muted">
                  Analiza características lado a lado para cotizar la mejor opción
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs font-semibold text-text-muted transition hover:text-primary"
              >
                Limpiar todo
              </button>
              <button
                type="button"
                onClick={closeCompareModal}
                className="rounded-full p-2 text-text-muted transition hover:bg-bg hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body / Comparison Matrix */}
          <div className="flex-1 overflow-auto p-6">
            {compareProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-text-muted" />
                <p className="mt-3 text-sm font-semibold text-text">
                  No hay productos en el comparador
                </p>
                <p className="text-xs text-text-muted">
                  Agrega productos desde el catálogo para visualizarlos aquí.
                </p>
              </div>
            ) : (
              <div className="min-w-[650px]">
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr>
                      <th className="w-48 p-4 text-left text-xs font-bold uppercase tracking-wider text-text-muted">
                        Característica
                      </th>
                      {compareProducts.map((product) => (
                        <th key={product.id} className="p-4 align-top text-left">
                          <div className="relative flex flex-col items-center rounded-xl border border-border bg-bg/50 p-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeFromCompare(product.id)}
                              aria-label={`Eliminar ${product.nombre} del comparador`}
                              className="absolute right-2 top-2 rounded-full p-1 text-text-muted hover:bg-surface hover:text-primary"
                            >
                              <X className="h-4 w-4" />
                            </button>

                            <div className="h-28 w-28 overflow-hidden rounded-lg bg-surface p-2">
                              <img
                                src={product.imagenes[0] || ""}
                                alt={product.nombre}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                              {product.marca}
                            </span>
                            <Link
                              to={`/producto/${product.id}`}
                              onClick={closeCompareModal}
                              className="mt-1 line-clamp-2 text-xs font-semibold text-text hover:text-primary hover:underline"
                            >
                              {product.nombre}
                            </Link>

                            <div className="mt-2 flex flex-col items-center">
                              <span className="text-base font-extrabold text-primary">
                                {currency.format(product.precio)}
                              </span>
                              <span className="text-[11px] text-text-muted">
                                Mayorista: {currency.format(product.precioMayorista)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                addToCart(product, 1);
                              }}
                              disabled={product.stock === 0}
                              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary-dark disabled:bg-border disabled:text-text-muted"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              <span>{product.stock === 0 ? "Agotado" : "Cotizar"}</span>
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {/* Fila SKU */}
                    <tr className="hover:bg-bg/40">
                      <td className="p-4 font-semibold text-text-muted">SKU</td>
                      {compareProducts.map((p) => (
                        <td key={p.id} className="p-4 font-mono font-medium text-text">
                          {p.sku}
                        </td>
                      ))}
                    </tr>

                    {/* Fila Stock */}
                    <tr className="hover:bg-bg/40">
                      <td className="p-4 font-semibold text-text-muted">Disponibilidad</td>
                      {compareProducts.map((p) => (
                        <td key={p.id} className="p-4">
                          {p.stock > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                              <Check className="h-3 w-3" /> {p.stock} unidades
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 font-bold text-red-600">
                              Sin Stock
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Fila Ahorro Mayorista */}
                    <tr className="hover:bg-bg/40">
                      <td className="p-4 font-semibold text-text-muted">Ahorro Mayorista</td>
                      {compareProducts.map((p) => {
                        const ahorro = p.precio - p.precioMayorista;
                        const ahorroPct = Math.round((ahorro / p.precio) * 100);
                        return (
                          <td key={p.id} className="p-4">
                            <span className="font-bold text-accent">
                              {currency.format(ahorro)} ({ahorroPct}%)
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Especificaciones Técnicas */}
                    {allSpecKeys.map((key) => (
                      <tr key={key} className="hover:bg-bg/40">
                        <td className="p-4 font-medium text-text-muted">{key}</td>
                        {compareProducts.map((p) => (
                          <td key={p.id} className="p-4 text-text">
                            {p.especificaciones?.[key] || (
                              <span className="text-text-muted/60">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
