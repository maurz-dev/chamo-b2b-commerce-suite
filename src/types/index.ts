export interface Category {
  id: string;
  nombre: string;
  imagen: string;
}

export interface Product {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string; // debe coincidir con un Category.id
  marca: string;
  precio: number;
  precioMayorista: number;
  precioAnterior: number | null;
  stock: number;
  imagenes: string[];
  destacado: boolean;
  etiquetas: string[];
  especificaciones: Record<string, string>;
}

/** Filtros combinables aplicados en el lado del cliente (RF-07). */
export interface ProductFilters {
  categorias: string[];
  marcas: string[];
  precioMin: number | null;
  precioMax: number | null;
  soloDisponibles: boolean;
  busqueda: string;
}

export type SortOption =
  | "precio-asc"
  | "precio-desc"
  | "nombre-asc"
  | "nombre-desc"
  | "destacados"
  | "descuento";

export interface QuoteCustomerInfo {
  tipoDocumento: "RUC" | "DNI";
  numeroDocumento: string;
  razonSocial: string;
  contacto: string;
  telefono: string;
  email: string;
  ciudad: string;
  direccion: string;
  tipoComprobante: "Factura" | "Boleta";
  formaPago: "Contado" | "Transferencia Bancaria" | "Crédito 15 días";
  notas?: string;
}

