import { useState, useRef, useEffect, useCallback } from "react";
import { ImageOff, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "../ui/LazyImage";

interface ProductGalleryProps {
  imagenes: string[];
  alt: string;
}

export default function ProductGallery({ imagenes, alt }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [erroredIndexes, setErroredIndexes] = useState<Set<number>>(new Set());
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const markErrored = (index: number) =>
    setErroredIndexes((prev) => new Set(prev).add(index));

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelected((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  }, [imagenes.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelected((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  }, [imagenes.length]);

  const scrollThumbnails = (direction: "up" | "down") => {
    if (!thumbnailsRef.current) return;
    const scrollAmount = 120;
    thumbnailsRef.current.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      left: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) setIsLightboxOpen(false);
      if (e.key === "ArrowLeft" && isLightboxOpen) handlePrev();
      if (e.key === "ArrowRight" && isLightboxOpen) handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  if (imagenes.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-surface">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <ImageOff className="h-10 w-10" />
          <span className="text-sm">Sin imagen disponible</span>
        </div>
      </div>
    );
  }

  const mainErrored = erroredIndexes.has(selected);

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start w-full">
        {/* Tira vertical de miniaturas a la izquierda */}
        {imagenes.length > 1 && (
          <div className="flex sm:flex-col items-center w-full sm:w-20 shrink-0 gap-1.5">
            {imagenes.length > 4 && (
              <button
                type="button"
                onClick={() => scrollThumbnails("up")}
                aria-label="Ver fotos anteriores"
                className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text hover:border-primary transition shadow-xs"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            )}

            <div
              ref={thumbnailsRef}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] w-full py-1 px-0.5 sm:px-1 [&::-webkit-scrollbar]:hidden"
            >
              {imagenes.map((img, index) => {
                const isSelected = index === selected;
                const hasError = erroredIndexes.has(index);

                return (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelected(index)}
                    onMouseEnter={() => setSelected(index)}
                    aria-label={`Ver imagen ${index + 1} de ${alt}`}
                    aria-current={isSelected}
                    className={`group relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-surface transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary shadow-sm ring-2 ring-primary/20 scale-[1.02]"
                        : "border-border hover:border-text-muted/60 opacity-75 hover:opacity-100"
                    }`}
                  >
                    {hasError ? (
                      <div className="flex h-full w-full items-center justify-center bg-bg">
                        <ImageOff className="h-4 w-4 text-text-muted" />
                      </div>
                    ) : (
                      <img
                        src={img}
                        alt={`${alt} miniatura ${index + 1}`}
                        className="h-full w-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                        onError={() => markErrored(index)}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {imagenes.length > 4 && (
              <button
                type="button"
                onClick={() => scrollThumbnails("down")}
                aria-label="Ver fotos siguientes"
                className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text hover:border-primary transition shadow-xs"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Imagen Principal Grande con flechas de navegación */}
        <div 
          className="group relative flex-1 aspect-square w-full flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface shadow-xs cursor-zoom-in"
          onClick={() => !mainErrored && setIsLightboxOpen(true)}
        >
          {imagenes.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface/90 text-text shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-surface hover:border-primary active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {mainErrored ? (
            <div className="flex flex-col items-center gap-2 text-text-muted">
              <ImageOff className="h-12 w-12 stroke-[1.5]" />
              <span className="text-sm">Imagen no disponible</span>
            </div>
          ) : (
            <>
              <LazyImage
                key={`main-${imagenes[selected]}`}
                src={imagenes[selected]}
                alt={alt}
                className="absolute inset-0 h-full w-full p-6 transition-transform duration-500 group-hover:scale-105"
                imgClassName="object-contain"
                onError={() => markErrored(selected)}
              />
              <div className="absolute top-4 right-4 rounded-full bg-surface/80 p-2 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-border/50 text-text shadow-sm pointer-events-none">
                <ZoomIn className="h-5 w-5" />
              </div>
            </>
          )}

          {imagenes.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface/90 text-text shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-surface hover:border-primary active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {imagenes.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-surface/80 border border-border px-2.5 py-0.5 text-xs font-medium text-text-muted backdrop-blur-xs">
              {selected + 1} / {imagenes.length}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            {imagenes.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[110] flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-[90vh] max-w-[90vw] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imagenes[selected]}
                alt={alt}
                className="max-h-[85vh] max-w-full rounded-lg object-contain drop-shadow-2xl"
              />
            </motion.div>

            {imagenes.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[110] flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}

            {imagenes.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                {selected + 1} de {imagenes.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
