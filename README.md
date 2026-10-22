# Catálogo Web Corporativo B2B — Chamo Import S.R.L.

<p align="center">
  <img src="public/brand/logo.png" alt="Chamo Import Logo" width="280"/>
</p>

<p align="center">
  <strong>Plataforma frontend de catálogo mayorista y módulo de cotización corporativa B2B.</strong><br>
  Solución moderna desarrollada para <strong>Chamo Import S.R.L.</strong> (importadora y distribuidora de ferretería, iluminación, artículos eléctricos, adhesivos y campaña escolar).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.x-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Framer_Motion-13.x-f43f5e?style=for-the-badge&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/jsPDF-Proforma-green?style=for-the-badge" alt="jsPDF" />
</p>

---

## 🌟 Características Destacadas (Nivel Enterprise)

Inspirado en los estándares de las mejores plataformas de e-commerce y catálogos de tecnología:

### 1. 🔍 Command Palette Global (`Ctrl + K` / `⌘ + K`)
* Buscador instantáneo estilo Raycast / Linear accesible globalmente mediante atajo de teclado.
* Autocompletado en tiempo real por **Nombre**, **SKU**, **Marca** y **Categoría**.
* Acceso directo a categorías populares y marcas distribuidas sin recargar la página.

### 2. 📑 Módulo de Cotización B2B y Generador de Proformas (`/cotizacion`)
* **Gestión de Ítems en Tiempo Real:** Ajuste dinámico de cantidades, cálculo de subtotales, alerta de ahorro por precio mayorista y validación de stock.
* **Formulario de Identidad Corporativa:** Captura de datos fiscales (RUC / DNI), Razón Social, Contacto, Teléfono, Ciudad de destino, Tipo de comprobante (Factura / Boleta) y Condiciones de pago.
* **Desglose Contable:** Cálculo automático de Subtotal Neto, I.G.V. (18%) y Total General en Soles (PEN).
* **Generación de Proforma Oficial en PDF:** Membrete institucional con logotipo oficial, N° de Cotización `COT-2025-XXXX`, fecha de emisión y vencimiento (7 días), tabla con `jspdf-autotable`, cuentas bancarias oficiales (BCP, BBVA, Yape/Plin) y cláusulas comerciales.
* **Exportación a Excel / ERP (.CSV):** Descarga instantánea de la lista de cotización en formato tabular compatible con Excel (con UTF-8 BOM para caracteres en español).
* **Despacho Directo por WhatsApp:** Formato corporativo estructurado con resumen de cliente y lista de productos para atención rápida por un asesor comercial.

### 3. ⚖️ Comparador Técnico de Productos Lado a Lado
* Comparación de hasta 4 productos simultáneamente.
* Barra flotante inferior reactiva con miniaturas y acceso rápido.
* Matriz comparativa modal con análisis de precio minorista vs. mayorista, stock y especificaciones técnicas completas (potencia, longitud, material, etc.).

### 4. 👁️ Modal de Vista Rápida (Quick View)
* Previsualización instantánea de producto desde cualquier tarjeta del catálogo o home sin perder la posición de scroll.
* Galería de miniaturas, selector de cantidades, simulador de precio y botón de agregar a proforma.

### 5. 🎛️ Catálogo Multifacético con Vistas Flexibles
* **Selector de Vistas:** Alternancia entre **Grilla (Grid View)** y **Lista Tabular (List View)** optimizada para compras B2B al por mayor.
* **Filtros Combinables:** Por categorías, marcas oficiales con conteo, rango de precios dinámico y disponibilidad inmediata de stock.
* **Chips de Filtros Activos:** Visualización interactiva de filtros aplicados con remoción individual o botón de "Limpiar todos".
* **Ordenamiento Avanzado:** Destacados, Menor Precio, Mayor Precio, Mayor Descuento, Nombre A–Z y Nombre Z–A.

### 6. 📱 Ficha de Producto de Alto Impacto
* Galería interactiva con miniaturas, navegación por teclado y Lightbox a pantalla completa.
* **Simulador de Ahorro Mayorista:** Calcula en tiempo real la diferencia de costo y el ahorro acumulado según las unidades ingresadas.
* Copia rápida de SKU al portapapeles con feedback mediante Toast.
* Botón de compartir nativo (Web Share API) y copy-link.
* Acordeón técnico detallado y carrusel de productos relacionados.

### 7. 🎨 Identidad Visual y Modo Oscuro Pulido
* Implementación estricta de la guía de marca oficial de Chamo Import S.R.L. a través de variables CSS (`src/styles/tokens.css`).
* Modo oscuro completo con toggle persistente en `localStorage` y variantes nativas de Tailwind CSS v4.
* Barra superior corporativa de avisos (Announcement Bar) con teléfonos de contacto, cobertura de despachos y garantías.
* Franja interactiva de marcas distribuidoras (Truper, 3M, Bauker, Tekno, Topex, Steck, Vinifan, Asaki, Cubull) con redirección al catálogo filtrado.

---

## 🛠️ Stack Tecnológico

| Capa | Herramientas | Justificación |
|---|---|---|
| **Core** | React 19 · TypeScript · Vite 8 | Máximo rendimiento, tipado estricto y compilación ultrarrápida |
| **Enrutamiento** | React Router v7 | Navegación SPA con sincronización de parámetros de búsqueda (`?q=`, `?marca=`) |
| **Estilos** | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS Custom Properties | Arquitectura de tokens sin CSS suelto ni valores hexadecimales hardcodeados |
| **Animaciones** | Framer Motion | Microinteracciones en modales, drawer lateral, toggles y hover states |
| **Documentos** | jsPDF + jspdf-autotable | Generación de cotizaciones y proformas comerciales vectoriales en el cliente |
| **Estado Global** | React Context API + Custom Hooks | Arquitectura limpia y modular sin dependencias pesadas de terceros |
| **Notificaciones** | react-hot-toast | Feedback visual no intrusivo y accesible |
| **Iconografía** | lucide-react | Set de iconos SVG modernos y consistentes |

---

## 📁 Estructura del Proyecto

```text
catalogo-web-chamo/
├── public/
│   ├── brand/             # Logotipo oficial de Chamo Import S.R.L.
│   ├── brands/            # Logotipos oficiales de marcas distribuidas
│   ├── banners/           # Fotografías y banners de promociones
│   └── products/          # Catálogo fotográfico de productos y categorías
├── src/
│   ├── components/
│   │   ├── cart/          # CartDrawer lateral
│   │   ├── catalog/       # FiltersPanel, SortSelect, Pagination
│   │   ├── compare/       # CompareFloatingBar, CompareModal (Matriz comparativa)
│   │   ├── home/          # Carousel, TrustFeatures, CategoryGrid, FeaturedProducts, BrandStrip, FAQ, Reviews
│   │   ├── layout/        # Header, AnnouncementBar, Footer, WhatsAppButton
│   │   ├── product/       # ProductCard (Grid/List), ProductGallery, QuickViewModal, RelatedProducts, ProductAccordion
│   │   ├── search/        # CommandPalette (Buscador global Ctrl+K)
│   │   ├── common/        # Skeleton, EmptyState, ErrorState
│   │   └── ui/            # LazyImage con estado de carga progresivo
│   ├── context/           # CartContext, FavoritesContext, ThemeContext, CompareContext
│   ├── data/              # products.json (40 ítems con specs), categories.json, brand.ts, brands.ts, banners.ts, faq.ts
│   ├── hooks/             # useAsync, useProducts, useDebounce
│   ├── pages/             # Home, Catalog, ProductDetail, CartPage (Cotizador B2B), FavoritesPage, NotFound
│   ├── services/          # productService, categoryService, api.ts (Capa de servicio con delay simulado)
│   ├── styles/            # tokens.css (Paleta corporativa, tipografía, radios y sombras)
│   ├── types/             # Interfaces TypeScript (Product, Category, Filters, QuoteCustomerInfo, SortOption)
│   └── utils/             # pdfGenerator.ts (Exportación PDF/CSV), text.ts (Normalización de búsqueda sin tildes)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
* Node.js v18 o superior
* npm v9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/maurz-dev/catalogo-web--Chavez-.git
cd catalogo-web--Chavez-

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo local
npm run dev
# -> http://localhost:5173

# 4. Verificar tipado estricto
npx tsc -b

# 5. Compilar bundle de producción
npm run build

# 6. Previsualizar compilación de producción
npm run preview
```

---

## 💼 Decisiones de Arquitectura y Negocio

1. **Capa de Servicios Aislada:** Ningún componente React consume directamente archivos JSON ni endpoints externos. Todo el acceso a datos ocurre mediante `src/services/productService.ts` y `categoryService.ts`. Conectar un backend real (REST o GraphQL) requiere modificar únicamente estos archivos de servicio.
2. **Cotizador B2B Real:** A diferencia de un carrito minorista convencional que requiere pasarela de pagos con tarjeta de crédito, este sistema está optimizado para el modelo de negocio mayorista ferretero peruano: emisión de proformas formales válidas por 7 días, cálculo de I.G.V., y formalización de pedidos mediante asesoría comercial en WhatsApp y transferencia bancaria.
3. **Accesibilidad y Rendimiento:** Marcado semántico HTML5, soporte completo de navegación por teclado, focus-visible con tokens de marca, imágenes con lazy loading y fallback ante fallos de carga.
