import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useProducts";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import { SkeletonBlock } from "../common/Skeleton";

function CategoryImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-xs text-text-muted">
        {alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export default function CategoryGrid() {
  const { status, data: categories, error, refetch } = useCategories();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12" id="categorias" aria-labelledby="categorias-heading">
      <div className="flex flex-col items-center justify-center">
        <h2
          id="categorias-heading"
          className="text-center text-3xl font-bold text-secondary dark:text-text"
        >
          Explora por categoría
        </h2>
        <div className="mt-3 h-1 w-20 rounded-full bg-primary"></div>
      </div>

      <div className="mt-8">
        {status === "loading" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="aspect-square w-full" />
            ))}
          </div>
        )}

        {status === "error" && <ErrorState message={error ?? undefined} onRetry={refetch} />}

        {status === "empty" && (
          <EmptyState
            title="No hay categorías disponibles"
            message="Vuelve a intentarlo en unos momentos."
            actionLabel="Reintentar"
            onAction={refetch}
          />
        )}

        {status === "success" && categories && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo/${cat.id}`}
                className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl border border-border shadow-soft transition-all duration-300 hover:shadow-hover hover:ring-2 hover:ring-primary/50"
              >
                <CategoryImage src={cat.imagen} alt={cat.nombre} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                <div className="relative z-10 p-4">
                  <span className="block text-center text-sm font-bold text-white md:text-base">
                    {cat.nombre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
