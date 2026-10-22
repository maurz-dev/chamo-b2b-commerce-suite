import { Helmet } from "react-helmet-async";
import Carousel from "../components/home/Carousel";
import TrustFeatures from "../components/home/TrustFeatures";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStrip from "../components/home/BrandStrip";
import FAQSection from "../components/home/FAQSection";
import ReviewsSection from "../components/home/ReviewsSection";
import ContactSection from "../components/home/ContactSection";

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Chamo Import S.R.L. | Distribuidora Mayorista de Ferretería y Electricidad</title>
        <meta
          name="description"
          content="Chamo Import S.R.L. Especialistas en distribución mayorista de ferretería, iluminación y materiales eléctricos en Lima y todo el Perú. Precios corporativos directos."
        />
        <meta
          name="keywords"
          content="ferreteria por mayor lima, distribuidora de materiales electricos, iluminacion led truper 3m bauker, cotizador proforma b2b"
        />
      </Helmet>

      {/* Hero Banner Carousel */}
      <Carousel />

      {/* 4 Pilares de Confianza B2B */}
      <TrustFeatures />

      {/* Grilla de Categorías */}
      <CategoryGrid />

      {/* Líneas Destacadas y Novedades con Tabs */}
      <FeaturedProducts />

      {/* Franja de Marcas Oficiales */}
      <BrandStrip />

      {/* Reseñas de Clientes Verificados */}
      <ReviewsSection />

      {/* Preguntas Frecuentes */}
      <FAQSection />

      {/* Sección de Contacto y Ubicación */}
      <ContactSection />
    </div>
  );
}
