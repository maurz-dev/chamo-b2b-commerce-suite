/** Bloque skeleton genérico con animación de pulso. */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-border/60 dark:bg-border/30 ${className}`}
      aria-hidden
    />
  );
}

/** Skeleton de una tarjeta de producto, usado mientras carga la grilla. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <SkeletonBlock className="h-40 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
      <SkeletonBlock className="h-5 w-1/3" />
      <SkeletonBlock className="h-9 w-full" />
    </div>
  );
}

/** Grilla de skeletons, para reemplazar la grilla de productos mientras carga. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      role="status"
      aria-label="Cargando productos"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton de la vista detallada de un producto. */
export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 animate-pulse">
      <div className="flex flex-col gap-4">
        <SkeletonBlock className="aspect-square w-full rounded-2xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-16 w-16 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-10 w-3/4" />
        <SkeletonBlock className="h-24 w-full rounded-2xl" />
        <SkeletonBlock className="h-32 w-full rounded-2xl" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
