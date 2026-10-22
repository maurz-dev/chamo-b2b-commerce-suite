import { useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATIC_REVIEWS = [
  {
    id: 1,
    name: "Carlos Mendoza",
    role: "Ferretería El Maestro",
    text: "Excelente servicio y entrega rápida. Los productos siempre llegan en buen estado y cumplen con lo prometido en el catálogo.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ana Ruiz",
    role: "Cliente Mayorista",
    text: "Tienen muy buenos precios para compras por mayor y el catálogo es muy fácil de usar para armar mis pedidos.",
    rating: 5,
  },
  {
    id: 3,
    name: "Jorge Salas",
    role: "Constructora del Sur",
    text: "Recomendados al 100%. Las herramientas y materiales eléctricos son de buena calidad. Atención por WhatsApp muy eficiente.",
    rating: 4,
  },
  {
    id: 4,
    name: "Luis Ramírez",
    role: "Cliente Minorista",
    text: "Encontré todo lo que necesitaba para la remodelación de mi casa. Los adhesivos y pinturas son de las mejores marcas.",
    rating: 5,
  },
];

export default function ReviewsSection() {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingSubmit = () => {
    if (selectedRating > 0) {
      setSubmitted(true);
      // Aquí se enviaría a una base de datos en el futuro
    }
  };

  return (
    <section className="py-16 bg-surface border-y border-border" aria-labelledby="reviews-heading">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 id="reviews-heading" className="text-3xl font-bold text-center mb-12 text-text">
          Lo que dicen nuestros clientes
        </h2>

        {/* Reseñas Estáticas Animadas (Marquee) */}
        <div className="mt-10 flex overflow-hidden w-full relative mb-16">
          {/* Primer bloque de reseñas */}
          <div className="flex min-w-full shrink-0 animate-scroll items-center gap-6 pr-6">
            {STATIC_REVIEWS.map((review) => (
              <div
                key={`first-${review.id}`}
                className="w-80 shrink-0 bg-bg p-6 rounded-2xl shadow-soft border border-border flex flex-col gap-4"
              >
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-accent" : "text-border"}`}
                    />
                  ))}
                </div>
                <p className="text-text-muted italic flex-1 text-sm">"{review.text}"</p>
                <div>
                  <p className="font-bold text-text text-sm">{review.name}</p>
                  <p className="text-xs text-text-muted">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Segundo bloque de reseñas (duplicado para efecto infinito) */}
          <div className="flex min-w-full shrink-0 animate-scroll items-center gap-6 pr-6">
            {STATIC_REVIEWS.map((review) => (
              <div
                key={`second-${review.id}`}
                className="w-80 shrink-0 bg-bg p-6 rounded-2xl shadow-soft border border-border flex flex-col gap-4"
              >
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-accent" : "text-border"}`}
                    />
                  ))}
                </div>
                <p className="text-text-muted italic flex-1 text-sm">"{review.text}"</p>
                <div>
                  <p className="font-bold text-text text-sm">{review.name}</p>
                  <p className="text-xs text-text-muted">{review.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gradientes laterales para suavizar la entrada y salida */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent"></div>
        </div>

        {/* Sección Interactiva para Dejar Reseña */}
        <div className="max-w-xl mx-auto bg-bg p-8 rounded-2xl shadow-soft border border-border text-center">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="rating-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <h3 className="text-xl font-bold text-text">¿Cómo calificarías nuestro catálogo?</h3>
                <p className="text-sm text-text-muted">Tu opinión nos ayuda a mejorar.</p>
                
                <div className="flex gap-2 my-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => setSelectedRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredStar ?? selectedRating)
                            ? "fill-accent text-accent"
                            : "text-border"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                
                <button
                  onClick={handleRatingSubmit}
                  disabled={selectedRating === 0}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar calificación
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <Star className="w-16 h-16 fill-accent text-accent mb-2" />
                </motion.div>
                <h3 className="text-2xl font-bold text-text">¡Gracias por tu valoración!</h3>
                <p className="text-text-muted">Hemos registrado tus {selectedRating} estrellas.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
