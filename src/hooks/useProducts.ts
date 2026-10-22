import { useAsync } from "./useAsync";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

export function useProducts() {
  return useAsync(
    () => productService.getAll(),
    [],
    (data) => data.length === 0
  );
}

export function useProductsByCategoria(categoriaId: string | undefined) {
  return useAsync(
    () => (categoriaId ? productService.getByCategoria(categoriaId) : productService.getAll()),
    [categoriaId],
    (data) => data.length === 0
  );
}

export function useDestacados() {
  return useAsync(
    () => productService.getDestacados(),
    [],
    (data) => data.length === 0
  );
}

export function useProduct(id: string | undefined) {
  return useAsync(
    () => (id ? productService.getById(id) : Promise.resolve(null)),
    [id],
    (data) => data === null
  );
}

export function useRelacionados(categoria: string | undefined, excludeId: string | undefined) {
  return useAsync(
    () =>
      categoria && excludeId
        ? productService.getRelacionados(categoria, excludeId)
        : Promise.resolve([]),
    [categoria, excludeId]
  );
}

export function useCategories() {
  return useAsync(
    () => categoryService.getAll(),
    [],
    (data) => data.length === 0
  );
}
