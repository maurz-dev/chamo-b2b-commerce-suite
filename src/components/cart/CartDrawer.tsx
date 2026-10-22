import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { brand } from "../../data/brand";
import { generateQuotePDF } from "../../utils/pdfGenerator";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export default function CartDrawer() {
  const { lines, isOpen, closeCart, removeFromCart, setQuantity, clearCart, subtotal, totalItems } =
    useCart();

  // Controla el frame de "entrada": se monta con translate-x-full y en el
  // siguiente tick pasa a translate-x-0, para que la transición CSS se vea.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappMessage =
    lines.length === 0
      ? undefined
      : `Hola, quisiera cotizar los siguientes productos:\n` +
        lines
          .map((l) => `- ${l.product.nombre} (SKU: ${l.product.sku}) x${l.cantidad}`)
          .join("\n") +
        `\n\nSubtotal estimado: ${currency.format(subtotal)}`;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito de cotización">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />

      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-hover transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-text">
              Carrito de cotización {totalItems > 0 && `(${totalItems})`}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="rounded-full p-1.5 text-text-muted transition hover:bg-bg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingCart className="h-12 w-12 text-text-muted" />
            <p className="text-sm text-text-muted">
              Aún no agregaste productos. Explora el catálogo y agrega lo que necesites cotizar.
            </p>
            <Link
              to="/catalogo"
              onClick={closeCart}
              className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <li key={line.product.id} className="flex gap-3 border-b border-border pb-4 last:border-0">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-bg">
                      {line.product.imagenes.length > 0 ? (
                        <img
                          src={line.product.imagenes[0]}
                          alt={line.product.nombre}
                          className="h-full w-full object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-[10px] text-text-muted">Sin imagen</span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/producto/${line.product.id}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-medium text-text hover:text-primary"
                        >
                          {line.product.nombre}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.product.id)}
                          aria-label={`Quitar ${line.product.nombre} del carrito`}
                          className="shrink-0 text-text-muted transition hover:text-primary"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="text-xs text-text-muted">
                        {currency.format(line.product.precio)} c/u
                      </span>

                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.product.id, line.cantidad - 1)}
                            aria-label="Disminuir cantidad"
                            className="p-1.5 text-text-muted transition hover:text-primary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-text">
                            {line.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(
                                line.product.id,
                                Math.min(line.product.stock, line.cantidad + 1)
                              )
                            }
                            disabled={line.cantidad >= line.product.stock}
                            aria-label="Aumentar cantidad"
                            className="p-1.5 text-text-muted transition hover:text-primary disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {currency.format(line.product.precio * line.cantidad)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer con subtotal y acciones */}
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-lg font-bold text-text">{currency.format(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Precio referencial. La cotización final se confirma por WhatsApp.
              </p>

              <Link
                to="/cotizacion"
                onClick={closeCart}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-soft transition hover:bg-primary-dark"
              >
                <span>Abrir Cotizador B2B Completo</span>
              </Link>

              <a
                href={brand.whatsapp.link(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-soft transition hover:brightness-105"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enviar cotización por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => generateQuotePDF(lines, subtotal)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-soft transition hover:bg-secondary/90"
              >
                Descargar Cotización (PDF)
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-full rounded-xl py-2 text-xs font-semibold text-text-muted transition hover:text-red-500"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
