/**
 * Slides del carrusel principal (RF-02). Las imágenes son placeholders —
 * reemplázalas subiendo tus archivos a /public/banners/ con estos mismos
 * nombres, o edita las rutas de abajo.
 */
export interface BannerSlide {
  id: string;
  imagen: string;
  titulo: string;
  subtitulo: string;
  ctaLabel: string;
  ctaLink: string;
}

export const banners: BannerSlide[] = [
  {
    id: "banner-1",
    imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2000&auto=format&fit=crop",
    titulo: "Todo en ferretería para tu proyecto",
    subtitulo: "Herramientas y materiales de las mejores marcas, al por mayor.",
    ctaLabel: "Ver catálogo",
    ctaLink: "/catalogo",
  },
  {
    id: "banner-2",
    imagen: "https://images.unsplash.com/photo-1563461660947-507ef49e9c47?q=80&w=2000&auto=format&fit=crop",
    titulo: "Iluminación LED para hogar e industria",
    subtitulo: "Ahorra energía sin sacrificar calidad ni durabilidad.",
    ctaLabel: "Ver iluminación",
    ctaLink: "/catalogo/iluminacion",
  },
  {
    id: "banner-3",
    imagen: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=2000&auto=format&fit=crop",
    titulo: "Campaña escolar 2026",
    subtitulo: "Todo lo que necesitas para el regreso a clases, a precio mayorista.",
    ctaLabel: "Ver campaña escolar",
    ctaLink: "/catalogo/escolar",
  },
  {
    id: "banner-4",
    imagen: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2000&auto=format&fit=crop",
    titulo: "Artículos eléctricos certificados",
    subtitulo: "Cables, tomacorrientes y protección para instalaciones seguras.",
    ctaLabel: "Ver eléctricos",
    ctaLink: "/catalogo/electricos",
  },
];
