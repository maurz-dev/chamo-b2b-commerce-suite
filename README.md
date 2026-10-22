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

## Modulos y Funcionalidades del Sistema

### 1. Command Palette Global (Ctrl + K / Cmd + K)
* Buscador interactivo modal accesible globalmente mediante atajo de teclado.
* Filtrado en tiempo real por Nombre, SKU, Marca y Categoría.
* Acceso directo a categorías comerciales y marcas oficiales sin recargar la página.

### 2. Modulo de Cotizacion B2B y Generador de Proformas (/cotizacion)
* **Gestion de Items:** Ajuste dinámico de cantidades, cálculo de subtotales, alerta de descuento por volumen mayorista y validación de stock disponible.
* **Formulario Fiscal y de Despacho:** Registro de RUC o DNI, Razón Social, Persona de Contacto, Teléfono, Ciudad de destino, Tipo de Comprobante (Factura o Boleta) y Condiciones de Pago.
* **Desglose Contable:** Cálculo automático de Subtotal Neto (Operación Gravada), I.G.V. (18%) y Total General en Soles (PEN).
* **Generacion de Proforma Oficial en PDF:** Membrete formal con logotipo oficial, N° correlativo de proforma único (COT-2025-XXXX), validez de 7 días, tabla vectorizada con jspdf-autotable, cuentas bancarias corrientes (BCP, BBVA) y términos de despacho.
* **Exportacion a Excel / ERP (.CSV):** Descarga inmediata compatible con hojas de cálculo con codificación UTF-8 BOM.
* **Canalizacion Directa a WhatsApp:** Plantilla corporativa con datos de la empresa y lista estructurada de productos para cotización inmediata por un asesor comercial.

### 3. Comparador Tecnico de Productos Lado a Lado
* Comparación simultánea de hasta 4 productos.
* Barra flotante reactiva con miniaturas de acceso rápido.
* Matriz comparativa modal con contraste de precios (unitario vs. mayorista), disponibilidad de stock y especificaciones técnicas completas (potencia, material, longitud, usos recomendados).

### 4. Modal de Vista Rapida (Quick View)
* Inspección de producto desde cualquier tarjeta del catálogo sin interrumpir la navegación.
* Galería de imágenes, selector de cantidades, simulador de precios y botón de agregar a proforma.

### 5. Catalogo Multifacetico con Vistas Flexibles
* **Selector de Vistas:** Alternancia entre Vista en Cuadrícula (Grid View) y Vista en Lista Tabular (List View) orientada a adquisiciones al por mayor.
* **Filtros Combinables:** Por categorías, marcas distribuidas con conteo de productos, rango de precios dinámico y disponibilidad inmediata de stock.
* **Chips de Filtros Activos:** Indicadores visuales de filtros aplicados con remoción individual o botón de "Limpiar todos".
* **Criterios de Ordenamiento:** Destacados, Menor Precio, Mayor Precio, Mayor Descuento, Nombre A-Z y Nombre Z-A.

### 6. Ficha Tecnica de Producto
* Galería interactiva con miniaturas, navegación por teclado y visualización ampliada.
* **Simulador de Ahorro Mayorista:** Cálculo en tiempo real del costo estándar minorista versus costo mayorista y ahorro proyectado según el volumen solicitado.
* Copia rápida de SKU al portapapeles con alerta Toast.
* Función para compartir ficha técnica mediante Web Share API o copiado de enlace directo.
* Acordeón técnico y recomendaciones de productos relacionados.

### 7. Identidad Corporativa y Modo Oscuro
* Implementación estricta de la guía de marca oficial de Chamo Import S.R.L. mediante variables CSS (src/styles/tokens.css).
* Modo oscuro completo con persistencia en localStorage y variantes nativas de Tailwind CSS v4.
* Barra de avisos corporativa con teléfonos de atención, cobertura de despachos y garantías oficiales.
* Franja interactiva de marcas distribuidoras (Truper, 3M, Bauker, Tekno, Topex, Steck, Vinifan, Asaki, Cubull) con enlace directo al catálogo filtrado.

---

## Stack Tecnologico

| Capa | Herramientas | Justificacion |
|---|---|---|
| **Core** | React 19, TypeScript, Vite 8 | Máximo rendimiento, tipado estricto y compilación ultrarrápida |
| **Enrutamiento** | React Router v7 | Navegación SPA con sincronización bidireccional de parámetros en URL |
| **Estilos** | Tailwind CSS v4 (@tailwindcss/vite) + CSS Custom Properties | Arquitectura de tokens sin CSS disperso ni valores hexadecimales no estandarizados |
| **Animaciones** | Framer Motion | Microinteracciones en modales, drawer lateral, acordeones y transiciones de vista |
| **Documentos** | jsPDF + jspdf-autotable | Generación en el cliente de proformas comerciales vectorizadas en PDF |
| **Estado Global** | React Context API + Custom Hooks | Arquitectura desacoplada y mantenible sin dependencias externas pesadas |
| **Notificaciones** | react-hot-toast | Notificaciones accesibles para acciones de compra y portapapeles |
| **Iconografia** | lucide-react | Conjunto de iconos vectoriales SVG consistentes |

---

## Estructura del Directorio

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
│   ├── data/              # products.json (40 productos con specs), categories.json, brand.ts, brands.ts, banners.ts, faq.ts
│   ├── hooks/             # useAsync, useProducts, useDebounce
│   ├── pages/             # Home, Catalog, ProductDetail, CartPage (Cotizador B2B), FavoritesPage, NotFound
│   ├── services/          # productService, categoryService, api.ts (Capa de servicio desacoplada con delay simulado)
│   ├── styles/            # tokens.css (Paleta corporativa, tipografía, radios y sombras)
│   ├── types/             # Interfaces TypeScript (Product, Category, Filters, QuoteCustomerInfo, SortOption)
│   └── utils/             # pdfGenerator.ts (Exportación PDF/CSV), text.ts (Normalización de búsqueda sin diacríticos)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Instalacion y Ejecucion Local

### Requisitos Previos
* Node.js v18 o superior
* npm v9 o superior

### Comandos

```bash
# 1. Clonar el repositorio
git clone https://github.com/maurz-dev/catalogo-web--Chavez-.git
cd catalogo-web--Chavez-

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo local
npm run dev

# 4. Validar tipado TypeScript
npx tsc -b

# 5. Compilar bundle de produccion
npm run build

# 6. Previsualizar la compilacion
npm run preview
```

---

## Criterios de Arquitectura y Diseno

1. **Capa de Servicios Desacoplada:** Los componentes de la interfaz no consumen directamente archivos estáticos ni endpoints de red. El acceso a datos está centralizado en `src/services/productService.ts` y `src/services/categoryService.ts`. La migración a una API REST o GraphQL en producción requiere modificar exclusivamente dicha capa.
2. **Modelo de Negocio Mayorista:** A diferencia de una tienda minorista con pasarela de pago para consumidor final, la plataforma está diseñada para la operativa comercial B2B: cotizaciones formales por volumen, desglose de I.G.V. para facturación corporativa, emisión de proformas en PDF con cuentas bancarias y canalización de pedidos vía ejecutivos comerciales.
3. **Accesibilidad y Rendimiento:** Estructura semántica HTML5, navegación completa por teclado, estados de foco definidos según tokens de diseño e imágenes optimizadas con lazy loading.
