import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, MessageCircle, Copy, Check, Star, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { brand } from "../../data/brand";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [copiedSku, setCopiedSku] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  const handleCopySku = () => {
    navigator.clipboard.writeText(product.sku);
    setCopiedSku(true);
    toast.success(`SKU ${product.sku} copiado`);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, qty);
    onClose();
  };

  const waMsg = `Hola, quisiera cotizar ${qty} unidad(es) de "${product.nombre}" (SKU: ${product.sku}). Vengo de la web.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar vista rápida"
            className="absolute right-4 top-4 z-10 rounded-full bg-bg/80 p-2 text-text-muted transition hover:bg-bg hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Gallery Column */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-bg/50 p-4">
                <img
                  src={product.imagenes[selectedImg] || product.imagenes[0] || ""}
                  alt={product.nombre}
                  className="h-full w-full object-contain transition-transform duration-300"
                />

                {product.destacado && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-soft">
                    <Star className="h-3.5 w-3.5 fill-white" /> Destacado
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.imagenes.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.imagenes.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImg(idx)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 p-1 transition ${
                        selectedImg === idx ? "border-primary shadow-soft" : "border-border hover:border-text-muted"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantees pills */}
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-text-muted">
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-bg/40 p-2.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Garantía Oficial de Marca</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-bg/40 p-2.5">
                  <Truck className="h-4 w-4 text-emerald-500" />
                  <span>Envíos Lima y Provincias</span>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                  {product.marca}
                </span>

                <button
                  type="button"
                  onClick={handleCopySku}
                  className="flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-0.5 text-xs font-mono text-text-muted transition hover:border-primary hover:text-primary"
                  title="Copiar SKU"
                >
                  <span>SKU: {product.sku}</span>
                  {copiedSku ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>

              <h2 className="mt-3 text-xl font-bold text-text">
                {product.nombre}
              </h2>

              {/* Precios */}
              <div className="mt-4 rounded-2xl border border-border bg-bg/40 p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-text-muted">Precio Unitario:</span>
                    <div className="text-2xl font-black text-primary">
                      {currency.format(product.precio)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                      Precio Mayorista (x mayor)
                    </span>
                    <div className="text-xl font-extrabold text-secondary dark:text-blue-400">
                      {currency.format(product.precioMayorista)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                  <span className="text-text-muted">Stock actual:</span>
                  <span className={`font-bold ${isOutOfStock ? "text-red-500" : "text-emerald-500"}`}>
                    {isOutOfStock ? "Agotado temporalmente" : `${product.stock} unidades listas para despacho`}
                  </span>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm text-text-muted">
                {product.descripcion}
              </p>

              {/* Quantity selector & Add button */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-border bg-bg">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2 text-text font-bold hover:text-primary"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-text">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                      disabled={qty >= product.stock}
                      className="px-3.5 py-2 text-text font-bold hover:text-primary disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-bold text-sm text-white shadow-soft transition hover:bg-primary-dark disabled:bg-border disabled:text-text-muted"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{isOutOfStock ? "Sin Stock" : `Agregar a cotización (${currency.format(product.precio * qty)})`}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <a
                    href={brand.whatsapp.link(waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp/10 py-2.5 text-xs font-bold text-whatsapp transition hover:bg-whatsapp hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Consultar por WhatsApp</span>
                  </a>

                  <Link
                    to={`/producto/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-text transition hover:border-primary hover:text-primary"
                  >
                    Ver ficha completa
                  </Link>
                </div>
              </div>

              {/* Especificaciones destacadas */}
              {Object.keys(product.especificaciones || {}).length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Ficha Técnica Resumida
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.especificaciones)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="rounded-lg bg-bg/50 p-2">
                          <span className="block font-medium text-text-muted text-[11px]">{key}</span>
                          <span className="font-bold text-text">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
