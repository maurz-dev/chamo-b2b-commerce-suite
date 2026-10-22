import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "chamo-favorites";

function getInitialFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(getInitialFavorites);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(favoriteIds))
    );
  }, [favoriteIds]);

  const toggleFavorite = (productId: string) => {
    let wasAdded = false;
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
        wasAdded = true;
      }
      return next;
    });

    if (wasAdded) {
      toast.success("Añadido a favoritos", {
        icon: '❤️',
        style: {
          borderRadius: '10px',
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        },
      });
    }
  };

  const isFavorite = (productId: string) => favoriteIds.has(productId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        isFavorite,
        totalFavorites: favoriteIds.size,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return ctx;
}
