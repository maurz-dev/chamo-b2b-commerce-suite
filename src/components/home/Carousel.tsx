import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "../../data/banners";

const AUTOPLAY_MS = 5000;

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [erroredSlides, setErroredSlides] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = banners.length;

  const goTo = useCallback((index: number) => {
    setCurrent(((index % total) + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next]);

  const markErrored = (id: string) =>
    setErroredSlides((prev) => new Set(prev).add(id));

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[480px]">
        {banners.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== current}
          >
            {erroredSlides.has(slide.id) ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-primary" />
            ) : (
              <img
                src={slide.imagen}
                alt=""
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                onError={() => markErrored(slide.id)}
              />
            )}

            {/* Overlay para legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 px-6 pb-12 sm:px-12 sm:pb-16">
              <h2 className="max-w-xl text-2xl font-bold text-white drop-shadow sm:text-4xl">
                {slide.titulo}
              </h2>
              <p className="max-w-md text-sm text-white/90 sm:text-base">
                {slide.subtitulo}
              </p>
              <Link
                to={slide.ctaLink}
                className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-hover transition hover:bg-primary-dark"
              >
                {slide.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controles manuales */}
      <button
        type="button"
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-secondary shadow-soft transition hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-secondary shadow-soft transition hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Puntos indicadores */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ir al slide ${index + 1}`}
            aria-current={index === current}
            className={`h-2.5 rounded-full transition-all ${
              index === current ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
