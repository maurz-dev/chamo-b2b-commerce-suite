import { useState } from "react";
import { Link } from "react-router-dom";
import { distribuidoras, type BrandItem } from "../../data/brands";
import { ArrowUpRight } from "lucide-react";

function BrandLogo({ brand }: { brand: BrandItem }) {
  const [imgSrc, setImgSrc] = useState(brand.logo);

  return (
    <Link
      to={`/catalogo?q=${encodeURIComponent(brand.nombre)}`}
      className="group relative flex h-20 w-36 shrink-0 items-center justify-center rounded-2xl
                 border border-border/60 bg-surface px-4 py-3 shadow-xs
                 transition-all duration-300
                 hover:scale-105 hover:border-primary/50 hover:shadow-hover"
      title={`Ver catálogo de ${brand.nombre}`}
    >
      <img
        src={imgSrc}
        alt={`Logo de ${brand.nombre}`}
        className="max-h-10 max-w-full object-contain filter transition duration-300 group-hover:brightness-105"
        loading="lazy"
        onError={() =>
          setImgSrc(
            `https://placehold.co/200x80/f3f4f6/6b7280?text=${encodeURIComponent(
              brand.nombre
            )}`
          )
        }
      />
      <span className="absolute bottom-1 right-1 opacity-0 transition group-hover:opacity-100 text-primary">
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

export default function BrandStrip() {
  return (
    <section className="py-14 bg-bg/50 border-y border-border/50" aria-labelledby="marcas-heading">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Alianzas Estratégicas y Fabricantes
            </p>
            <h2
              id="marcas-heading"
              className="mt-1 text-2xl sm:text-3xl font-extrabold text-secondary dark:text-text"
            >
              Marcas Líderes Distribuidas
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-primary" />
          </div>

          <Link
            to="/catalogo"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Ver todas las marcas en catálogo</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Marquee Container */}
        <div className="mt-8 flex overflow-hidden w-full relative">
          <div className="flex min-w-full shrink-0 animate-scroll items-center gap-6 pr-6">
            {distribuidoras.map((brand) => (
              <BrandLogo key={`first-${brand.slug}`} brand={brand} />
            ))}
          </div>
          <div className="flex min-w-full shrink-0 animate-scroll items-center gap-6 pr-6">
            {distribuidoras.map((brand) => (
              <BrandLogo key={`second-${brand.slug}`} brand={brand} />
            ))}
          </div>

          {/* Gradient Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
        </div>
      </div>
    </section>
  );
}
