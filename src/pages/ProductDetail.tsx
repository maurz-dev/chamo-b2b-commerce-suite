import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowRightLeft,
  Share2,
  Copy,
  Check,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { productService } from "../../src/services/productService";
import { categoryService } from "../../src/services/categoryService";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCompare } from "../context/CompareContext";
import { brand } from "../data/brand";
import { ProductDetailSkeleton } from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import ProductGallery from "../components/product/ProductGallery";
import RelatedProducts from "../components/product/RelatedProducts";
import ProductAccordion from "../components/product/ProductAccordion";
import type { Product } from "../types";
import toast from "react-hot-toast";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [categoriaNombre, setCategoriaNombre] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [copiedSku, setCopiedSku] = useState(false);

  const [relacionados, setRelacionados] = useState<Product[]>([]);
  const [relStatus, setRelStatus] = useState<"loading" | "success">("loading");

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    productService
      .getById(id)
      .then(async (data) => {
        if (!isMounted) return;
        if (!data) {
          setError("El producto solicitado no existe.");
          setStatus("error");
          return;
        }
        setProduct(data);
        setStatus("success");

        // Cargar nombre de categoría
        categoryService.getById(data.categoria).then((cat) => {
          if (cat) setCategoriaNombre(cat.nombre);
        });

        // Cargar productos relacionados
        setRelStatus("loading");
        productService.getAll().then((all) => {
          const others = all
            .filter((p) => p.id !== data.id && p.categoria === data.categoria)
            .slice(0, 8);
          setRelacionados(others);
          setRelStatus("success");
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Error al cargar");
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (status === "error" || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <ErrorState
          message={error ?? "Producto no encontrado"}
          actionLabel="Volver al catálogo"
          onRetry={() => (window.location.href = "/catalogo")}
        />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);

  const discountPercent = product.precioAnterior
    ? Math.round((1 - product.precio / product.precioAnterior) * 100)
    : null;

  // Calculadora de ahorro por mayor
  const precioUnitarioTotal = product.precio * qty;
  const precioMayoristaTotal = product.precioMayorista * qty;
  const ahorroTotal = precioUnitarioTotal - precioMayoristaTotal;

  const handleCopySku = () => {
    navigator.clipboard.writeText(product.sku);
    setCopiedSku(true);
    toast.success(`SKU: ${product.sku} copiado`);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.nombre} | ${brand.name}`,
          text: `Revisa este producto en ${brand.name}: ${product.nombre}`,
          url,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Enlace del producto copiado al portapapeles");
    }
  };

  const handleToggleCompare = () => {
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, qty);
  };

  const whatsappMessage = `Hola, quisiera cotizar ${qty} unidad(es) de "${product.nombre}" (SKU: ${product.sku}). Vengo de la página web.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <Helmet>
        <title>{product.nombre} | Chamo Import S.R.L.</title>
        <meta
          name="description"
          content={`Compra ${product.nombre} marca ${product.marca} al mejor precio. ${product.descripcion.slice(0, 150)}. Envíos a todo el Perú.`}
        />
        <meta
          name="keywords"
          content={`${product.nombre}, ${product.marca}, ${product.categoria}, ferreteria, materiales electricos`}
        />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
        <Link to="/" className="hover:text-primary transition">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalogo" className="hover:text-primary transition">Catálogo</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/catalogo/${product.categoria}`} className="hover:text-primary transition">
          {categoriaNombre || product.categoria}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-xs text-text font-semibold">{product.nombre}</span>
      </nav>

      {/* Grilla Superior: Galería y Datos del Producto */}
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery imagenes={product.imagenes} alt={product.nombre} />

        <div className="flex flex-col gap-4">
          {/* Header con Marca, SKU y Acciones Rápidas */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                  {product.marca}
                </span>

                <button
                  type="button"
                  onClick={handleCopySku}
                  className="flex items-center gap-1 rounded bg-bg px-2 py-0.5 text-xs font-mono text-text-muted hover:text-primary transition"
                  title="Copiar SKU"
                >
                  <span>SKU: {product.sku}</span>
                  {copiedSku ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>

              <h1 className="mt-2 text-2xl font-extrabold text-text sm:text-3xl">
                {product.nombre}
              </h1>
            </div>

            {/* Botones de Cabecera: Comparar, Compartir, Favorito */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleToggleCompare}
                aria-label={inCompare ? "Quitar de comparar" : "Agregar a comparar"}
                title="Comparar producto"
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  inCompare
                    ? "border-primary bg-primary text-white"
                    : "border-border text-text-muted hover:border-primary hover:text-primary"
                }`}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Compartir producto"
                title="Compartir enlace"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-muted hover:border-primary hover:text-primary transition"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  favorite
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-text-muted hover:border-primary hover:text-primary"
                }`}
              >
                <Heart className={`h-4 w-4 ${favorite ? "fill-primary" : ""}`} />
              </button>
            </div>
          </div>

          {/* Badges de Estado */}
          {(product.destacado || product.etiquetas.length > 0 || discountPercent !== null) && (
            <div className="flex flex-wrap gap-2">
              {product.destacado && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-soft">
                  ★ Producto Destacado
                </span>
              )}
              {product.etiquetas.includes("nuevo") && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white shadow-soft">
                  Nuevo Ingreso
                </span>
              )}
              {discountPercent !== null && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-soft">
                  -{discountPercent}% Descuento
                </span>
              )}
            </div>
          )}

          {/* Caja Principal de Precios y Stock */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-text-muted">Precio Unitario:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-primary">
                    {currency.format(product.precio)}
                  </span>
                  {product.precioAnterior && (
                    <span className="text-sm text-text-muted line-through">
                      {currency.format(product.precioAnterior)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                  Precio Mayorista (Caja / Volumen)
                </span>
                <div className="text-2xl font-black text-secondary dark:text-blue-400">
                  {currency.format(product.precioMayorista)}
                </div>
              </div>
            </div>

            {/* Disponibilidad en Almacén */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="text-text-muted">Disponibilidad en almacén:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  isOutOfStock ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-emerald-500"}`} />
                {isOutOfStock ? "Agotado temporalmente" : `${product.stock} unidades listas para despacho`}
              </span>
            </div>
          </div>

          {/* Calculadora Interactiva de Ahorro por Volumen */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-primary mb-2">
              <Calculator className="h-4 w-4" />
              <span>Simulador de Compra por Volumen ({qty} unidades)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-text">
              <div>
                <span className="text-text-muted block text-[11px]">Costo Minorista Estándar:</span>
                <strong className="text-sm">{currency.format(precioUnitarioTotal)}</strong>
              </div>
              <div className="text-right">
                <span className="text-text-muted block text-[11px]">Costo Mayorista Estimado:</span>
                <strong className="text-sm text-secondary dark:text-blue-400">
                  {currency.format(precioMayoristaTotal)}
                </strong>
              </div>
            </div>

            {ahorroTotal > 0 && (
              <div className="mt-2.5 flex items-center justify-between border-t border-primary/10 pt-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Ahorro proyectado para tu negocio:
                </span>
                <span>{currency.format(ahorroTotal)}</span>
              </div>
            )}
          </div>

          {/* Selector de Cantidad y Acciones de Compra / WhatsApp */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center rounded-xl border border-border bg-bg">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={isOutOfStock}
                aria-label="Disminuir cantidad"
                className="p-3 text-text-muted transition hover:text-primary disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-bold text-text">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock || q, q + 1))}
                disabled={isOutOfStock || qty >= product.stock}
                aria-label="Aumentar cantidad"
                className="p-3 text-text-muted transition hover:text-primary disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isOutOfStock ? "No disponible" : `Agregar a cotización (${currency.format(product.precio * qty)})`}</span>
            </button>

            <a
              href={brand.whatsapp.link(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Cotizar WhatsApp</span>
            </a>
          </div>

          {/* Sellos de Confianza y Garantía */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-text-muted">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-3 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Garantía oficial de fábrica</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-3 shadow-xs">
              <RotateCcw className="h-4 w-4 text-primary shrink-0" />
              <span>Cambio inmediato por falla</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-3 shadow-xs">
              <Truck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Despachos a todo el Perú</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acordeón de Especificaciones y Ficha Técnica */}
      <ProductAccordion product={product} />

      {/* Productos Relacionados */}
      <RelatedProducts products={relacionados ?? []} loading={relStatus === "loading"} />
    </div>
  );
}
