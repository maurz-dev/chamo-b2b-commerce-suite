import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Product } from "../types";
import toast from "react-hot-toast";

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "chamo_compare_products";
const MAX_COMPARE = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareProducts));
    } catch {
      // Ignorar errores de quota en localStorage
    }
  }, [compareProducts]);

  const addToCompare = (product: Product) => {
    if (compareProducts.some((p) => p.id === product.id)) {
      toast("Este producto ya está en el comparador", { icon: "ℹ️" });
      return;
    }

    if (compareProducts.length >= MAX_COMPARE) {
      toast.error(`Puedes comparar hasta ${MAX_COMPARE} productos a la vez.`);
      return;
    }

    setCompareProducts((prev) => [...prev, product]);
    toast.success(`"${product.nombre}" agregado al comparador`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const isInCompare = (productId: string) => {
    return compareProducts.some((p) => p.id === productId);
  };

  const openCompareModal = () => setIsCompareModalOpen(true);
  const closeCompareModal = () => setIsCompareModalOpen(false);

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare debe ser usado dentro de un CompareProvider");
  }
  return context;
}
