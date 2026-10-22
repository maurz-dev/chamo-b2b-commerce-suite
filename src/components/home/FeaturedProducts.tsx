import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Flame } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../product/ProductCard";
import QuickViewModal from "../product/QuickViewModal";
import type { Product } from "../../types";

export default function FeaturedProducts() {
  const { data: products, status } = useProducts();
  const [activeTab, setActiveTab] = useState<"destacados" | "nuevos" | "ofertas">("destacados");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (status === "loading" || !products) {
    return null;
  }

  // Filtrar según pestaña activa
  let displayedProducts: Product[] = [];
  if (activeTab === "destacados") {
    displayedProducts = products.filter((p) => p.destacado).slice(0, 8);
  } else if (activeTab === "nuevos") {
    displayedProducts = products.filter((p) => p.etiquetas.includes("nuevo")).slice(0, 8);
  } else {
    displayedProducts = products
      .filter((p) => p.precioAnterior !== null)
      .sort((a, b) => {
        const descA = a.precioAnterior ? (a.precioAnterior - a.precio) / a.precioAnterior : 0;
        const descB = b.precioAnterior ? (b.precioAnterior - b.precio) / b.precioAnterior : 0;
        return descB - descA;
      })
      .slice(0, 8);
  }

  return (
    <section className="py-16 bg-surface border-b border-border/50" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header de Sección con Tabs */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Selección Exclusiva Mayorista
            </p>
            <h2
              id="featured-heading"
              className="mt-1 text-2xl sm:text-3xl font-extrabold text-secondary dark:text-text"
            >
              Líneas Destacadas de la Semana
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-primary" />
          </div>

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-bg p-1.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("destacados")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "destacados"
                  ? "bg-primary text-white shadow-soft"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Star className="h-3.5 w-3.5" />
              <span>Más Destacados</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("nuevos")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "nuevos"
                  ? "bg-primary text-white shadow-soft"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nuevos Ingresos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ofertas")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "ofertas"
                  ? "bg-primary text-white shadow-soft"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-accent" />
              <span>Con Descuento</span>
            </button>
          </div>
        </div>

        {/* Grilla de Productos */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="grid"
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary dark:bg-primary px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-soft transition hover:opacity-90"
          >
            <span>Explorar los más de 40 productos en Catálogo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
