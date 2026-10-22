import type { Product } from "../types";
import rawProducts from "../data/products.json";
import { simulateNetworkDelay } from "./api";

const products = rawProducts as unknown as Product[];

/**
 * Capa de servicio de productos. Hoy lee de un JSON local; el día que haya
 * una API real, esta es la ÚNICA pieza que cambia (por ejemplo, un fetch a
 * un endpoint). Ningún componente importa products.json directamente.
 */
export const productService = {
  async getAll(): Promise<Product[]> {
    return simulateNetworkDelay(products);
  },

  async getById(id: string): Promise<Product | null> {
    const found = products.find((p) => p.id === id) ?? null;
    return simulateNetworkDelay(found);
  },

  async getByIds(ids: string[]): Promise<Product[]> {
    const found = products.filter((p) => ids.includes(p.id));
    return simulateNetworkDelay(found);
  },

  async getBySku(sku: string): Promise<Product | null> {
    const found = products.find((p) => p.sku === sku) ?? null;
    return simulateNetworkDelay(found);
  },

  async getDestacados(): Promise<Product[]> {
    return simulateNetworkDelay(products.filter((p) => p.destacado));
  },

  async getRelacionados(categoria: string, excludeId: string, limit = 4): Promise<Product[]> {
    const related = products
      .filter((p) => p.categoria === categoria && p.id !== excludeId)
      .slice(0, limit);
    return simulateNetworkDelay(related);
  },

  async getByCategoria(categoriaId: string): Promise<Product[]> {
    return simulateNetworkDelay(products.filter((p) => p.categoria === categoriaId));
  },

  /** Marcas únicas presentes en el catálogo, usadas para poblar el filtro. */
  async getMarcasDisponibles(): Promise<string[]> {
    const marcas = Array.from(new Set(products.map((p) => p.marca))).sort();
    return simulateNetworkDelay(marcas);
  },

  /** Rango de precios real del catálogo, usado como límites del slider de filtro. */
  async getRangoPrecios(): Promise<{ min: number; max: number }> {
    const precios = products.map((p) => p.precio);
    return simulateNetworkDelay({
      min: Math.floor(Math.min(...precios)),
      max: Math.ceil(Math.max(...precios)),
    });
  },
};
