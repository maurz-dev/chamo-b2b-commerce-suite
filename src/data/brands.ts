/**
 * Marcas distribuidas por Chamo Import, para la franja "DISTRIBUIDORAS"
 * del home (RF-04).
 *
 * IMPORTANTE: los logos oficiales de estas marcas (Palux, Truper, Knauff,
 * C&A, Pegafan, 3M, WD-40, Shurtape, Cantol) son propiedad de terceros y
 * deben descargarse manualmente desde cada sitio oficial. Colócalos en
 * /public/brands/<slug>.png respetando estos nombres de archivo — el
 * componente BrandStrip ya los referencia con esa ruta.
 *
 * Mientras no subas los logos reales, BrandStrip muestra el nombre de la
 * marca en texto como fallback (ver lógica de <img onError>).
 */

export interface BrandItem {
  nombre: string;
  slug: string;
  logo: string;
}

export const distribuidoras: BrandItem[] = [
  { nombre: "TRUPER", slug: "truper", logo: "/brands/truper.png" },
  { nombre: "3M", slug: "3m", logo: "/brands/3m.png" },
  { nombre: "BAUKER", slug: "bauker", logo: "/brands/bauker.png" },
  { nombre: "TEKNO", slug: "tekno", logo: "/brands/tekno.png" },
  { nombre: "TOPEX", slug: "topex", logo: "/brands/topex.png" },
  { nombre: "STECK", slug: "steck", logo: "/brands/steck.png" },
  { nombre: "VINIFAN", slug: "vinifan", logo: "/brands/vinifan.png" },
  { nombre: "ASAKI", slug: "asaki", logo: "/brands/asaki.png" },
  { nombre: "CUBULL", slug: "cubull", logo: "/brands/cubull.png" },
];
