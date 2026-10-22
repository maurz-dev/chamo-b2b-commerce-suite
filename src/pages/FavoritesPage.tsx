import { useEffect, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { productService } from "../services/productService";
import type { Product } from "../types";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/product/QuickViewModal";
import { HeartCrack, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function FavoritesPage() {
  const { favoriteIds, totalFavorites } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      const ids = Array.from(favoriteIds);
      if (ids.length > 0) {
        const favProducts = await productService.getByIds(ids);
        setProducts(favProducts);
      } else {
        setProducts([]);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [favoriteIds]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 min-h-[60vh]">
      <Helmet>
        <title>Mis Favoritos | Chamo Import S.R.L.</title>
        <meta
          name="description"
          content="Tus productos guardados en Chamo Import S.R.L. Agrega a tu cotización o compara especificaciones técnicas."
        />
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary dark:text-text">
            Mis Productos Favoritos
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-muted">
            Lista personalizada de productos guardados para cotizaciones recurrentes.
          </p>
        </div>

        {totalFavorites > 0 && (
          <Link
            to="/catalogo"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Seguir agregando productos</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {totalFavorites === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface rounded-3xl border border-dashed border-border mt-8 p-8">
          <HeartCrack className="w-16 h-16 text-text-muted mb-4 opacity-40" />
          <h2 className="text-xl font-bold text-text mb-2">Aún no tienes favoritos</h2>
          <p className="text-xs sm:text-sm text-text-muted mb-6 max-w-md">
            Explora nuestro catálogo y presiona el ícono de corazón en los productos de tu interés para tenerlos siempre a la mano.
          </p>
          <Link
            to="/catalogo"
            className="px-6 py-3 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-primary-dark transition shadow-soft flex items-center gap-2"
          >
            <span>Explorar catálogo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-xs sm:text-sm text-text-muted">
            Tienes <span className="font-bold text-text">{totalFavorites}</span> producto(s) en tu lista.
          </p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(Math.min(totalFavorites, 4))].map((_, i) => (
                <div key={i} className="h-80 bg-surface rounded-2xl border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="grid"
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
