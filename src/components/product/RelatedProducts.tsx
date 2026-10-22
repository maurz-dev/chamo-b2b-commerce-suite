import { useRef } from "react";
import type { Product } from "../../types";
import ProductCard from "./ProductCard";
import { SkeletonBlock } from "../common/Skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
  loading: boolean;
}

export default function RelatedProducts({ products, loading }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320; // roughly one card width
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="mt-20 relative" aria-labelledby="relacionados-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="relacionados-heading" className="text-2xl font-bold text-secondary dark:text-text">
          Otros clientes también llevaron...
        </h2>
        
        {/* Controles de navegación */}
        {!loading && products.length > 2 && (
          <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-border bg-surface text-text-muted hover:text-primary transition-colors hover:border-primary shadow-sm"
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-border bg-surface text-text-muted hover:text-primary transition-colors hover:border-primary shadow-sm"
              aria-label="Desplazar a la derecha"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Contenedor desplazable */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[280px] w-[80vw] sm:w-[280px] shrink-0 snap-start">
                <SkeletonBlock className="aspect-[3/4] w-full" />
              </div>
            ))
          ) : (
            products.map((p) => (
              <div key={p.id} className="min-w-[280px] w-[80vw] sm:w-[280px] shrink-0 snap-start">
                <ProductCard product={p} />
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Utilidad para ocultar scrollbar webkit (también se puede en index.css) */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
