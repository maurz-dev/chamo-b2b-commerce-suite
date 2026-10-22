import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Ban,
  Eye,
  ArrowRightLeft,
  Check,
  Copy,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useCompare } from "../../context/CompareContext";
import { motion } from "framer-motion";
import LazyImage from "../ui/LazyImage";
import toast from "react-hot-toast";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  variant = "grid",
  onQuickView,
}: ProductCardProps) {
  const [imgErrored, setImgErrored] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const isOutOfStock = product.stock === 0;
  const hasImage = product.imagenes.length > 0 && !imgErrored;
  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);

  const discountPercent = product.precioAnterior
    ? Math.round((1 - product.precio / product.precioAnterior) * 100)
    : null;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleCopySku = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(product.sku);
    setCopiedSku(true);
    toast.success(`SKU: ${product.sku} copiado`);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  // VISTA LISTA / TABULAR (PARA COMPRAS B2B Y COTIZACIONES)
  if (variant === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-hover">
        {/* Imagen */}
        <Link
          to={`/producto/${product.id}`}
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-bg p-2"
        >
          {hasImage ? (
            <LazyImage
              src={product.imagenes[0]}
              alt={product.nombre}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              imgClassName="object-contain"
              onError={() => setImgErrored(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-text-muted">
              Sin imagen
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold text-white">
              Agotado
            </div>
          )}
        </Link>

        {/* Info central */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              {product.marca}
            </span>
            <button
              type="button"
              onClick={handleCopySku}
              className="flex items-center gap-1 rounded bg-bg px-1.5 py-0.5 text-[11px] font-mono text-text-muted hover:text-primary transition"
            >
              <span>SKU: {product.sku}</span>
              {copiedSku ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
            {product.destacado && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                Destacado
              </span>
            )}
          </div>

          <Link
            to={`/producto/${product.id}`}
            className="text-base font-bold text-text hover:text-primary transition line-clamp-1"
          >
            {product.nombre}
          </Link>

          <p className="line-clamp-2 text-xs text-text-muted">
            {product.descripcion}
          </p>

          <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-xs">
            <span className={isOutOfStock ? "text-red-500 font-semibold" : "text-emerald-500 font-semibold flex items-center gap-1"}>
              {!isOutOfStock && <CheckCircle2 className="h-3.5 w-3.5" />}
              {isOutOfStock ? "Sin Stock" : `Stock disponible: ${product.stock}`}
            </span>
          </div>
        </div>

        {/* Precios y Acciones */}
        <div className="flex flex-col items-center sm:items-end gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-5 w-full sm:w-auto">
          <div className="text-center sm:text-right">
            <span className="text-xl font-black text-primary">
              {currency.format(product.precio)}
            </span>
            <span className="block text-[11px] text-text-muted">
              Mayorista: <strong className="text-secondary dark:text-blue-400">{currency.format(product.precioMayorista)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onQuickView && (
              <button
                type="button"
                onClick={handleQuickView}
                aria-label="Vista rápida"
                title="Vista rápida"
                className="rounded-xl border border-border p-2 text-text-muted hover:border-primary hover:text-primary transition"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleCompare}
              aria-label={inCompare ? "Quitar de comparar" : "Agregar a comparar"}
              title="Comparar producto"
              className={`rounded-xl border p-2 transition ${
                inCompare
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label="Favorito"
              className={`rounded-xl border p-2 transition ${
                favorite
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              <Heart className={`h-4 w-4 ${favorite ? "fill-primary" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary-dark disabled:bg-border disabled:text-text-muted"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cotizar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VISTA GRILLA POR DEFECTO
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border
                 bg-surface shadow-soft transition-all duration-300
                 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-hover"
    >
      {/* Contenedor de Imagen */}
      <div className="relative aspect-square w-full overflow-hidden bg-bg/50">
        <Link to={`/producto/${product.id}`} className="block h-full w-full">
          {hasImage ? (
            <LazyImage
              src={product.imagenes[0]}
              alt={product.nombre}
              className={`h-full w-full p-4 transition-transform duration-500 group-hover:scale-105 ${
                isOutOfStock ? "opacity-40 grayscale" : ""
              }`}
              imgClassName="object-contain"
              onError={() => setImgErrored(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-text-muted">
              Sin imagen disponible
            </div>
          )}
        </Link>

        {/* Badges superior izquierda */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 pointer-events-none">
          {product.destacado && (
            <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-soft">
              <Star className="h-3 w-3 fill-white" /> Destacado
            </span>
          )}
          {product.etiquetas.includes("nuevo") && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white shadow-soft">
              Nuevo
            </span>
          )}
          {discountPercent !== null && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-soft">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Barra de Acciones rápidas (Esquina superior derecha) */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
          {/* Favorito */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={handleToggleFavorite}
            aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            className="flex h-8 w-8 items-center justify-center rounded-full
                       bg-surface/90 text-text shadow-soft backdrop-blur-sm transition-colors hover:bg-surface hover:text-primary"
          >
            <Heart
              className={`h-4 w-4 ${favorite ? "fill-primary text-primary" : "text-text-muted"}`}
            />
          </motion.button>

          {/* Comparar */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={handleToggleCompare}
            aria-label="Comparar producto"
            title={inCompare ? "En el comparador" : "Agregar a comparador"}
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-soft backdrop-blur-sm transition-colors ${
              inCompare
                ? "bg-primary text-white"
                : "bg-surface/90 text-text-muted hover:bg-surface hover:text-primary"
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        {/* Botón flotante "Vista Rápida" en hover desktop */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleQuickView}
              className="flex items-center gap-1.5 rounded-xl bg-surface/95 px-3.5 py-2 text-xs font-bold text-text shadow-hover backdrop-blur-sm transition hover:bg-primary hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Vista Rápida</span>
            </button>
          </div>
        )}

        {/* Overlay de agotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-bold text-red-600 shadow-soft">
              <Ban className="h-3.5 w-3.5" /> Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-1 text-[11px] text-text-muted">
          <span className="font-bold uppercase tracking-wider text-primary">
            {product.marca}
          </span>
          <button
            type="button"
            onClick={handleCopySku}
            className="flex items-center gap-1 font-mono hover:text-primary transition"
            title="Copiar SKU"
          >
            <span>{product.sku}</span>
            {copiedSku ? <Check className="h-2.5 w-2.5 text-emerald-500" /> : <Copy className="h-2.5 w-2.5 opacity-60" />}
          </button>
        </div>

        <Link
          to={`/producto/${product.id}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-text hover:text-primary transition"
        >
          {product.nombre}
        </Link>

        {/* Precios: Unitario y Mayorista */}
        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-primary">
              {currency.format(product.precio)}
            </span>
            {product.precioAnterior && (
              <span className="text-xs text-text-muted line-through">
                {currency.format(product.precioAnterior)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-text-muted">
            Mayorista: <strong className="text-secondary dark:text-blue-400">{currency.format(product.precioMayorista)}</strong>
          </span>
        </div>

        {/* Stock status indicator */}
        <div className="mt-1 flex items-center justify-between text-xs">
          <span
            className={`flex items-center gap-1 font-medium ${
              isOutOfStock ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-emerald-500"}`} />
            {isOutOfStock ? "Sin stock" : `Stock: ${product.stock} un.`}
          </span>
        </div>

        {/* Botón Agregar a cotización */}
        <motion.button
          whileTap={isOutOfStock ? {} : { scale: 0.96 }}
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary
                     px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-soft transition-colors
                     hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border
                     disabled:text-text-muted"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{isOutOfStock ? "No disponible" : "Agregar a cotización"}</span>
        </motion.button>
      </div>
    </div>
  );
}
