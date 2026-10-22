import {
  createContext,
  useContext,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types";
import toast from "react-hot-toast";

export interface CartLine {
  product: Product;
  cantidad: number;
}

interface CartState {
  lines: CartLine[];
}

type CartAction =
  | { type: "ADD"; product: Product; cantidad?: number }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QTY"; productId: string; cantidad: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const cantidad = action.cantidad ?? 1;
      const existing = state.lines.find(
        (l) => l.product.id === action.product.id
      );
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product.id === action.product.id
              ? { ...l, cantidad: l.cantidad + cantidad }
              : l
          ),
        };
      }
      return { lines: [...state.lines, { product: action.product, cantidad }] };
    }
    case "REMOVE":
      return { lines: state.lines.filter((l) => l.product.id !== action.productId) };
    case "SET_QTY":
      return {
        lines: state.lines.map((l) =>
          l.product.id === action.productId
            ? { ...l, cantidad: Math.max(1, action.cantidad) }
            : l
        ),
      };
    case "CLEAR":
      return { lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  addToCart: (product: Product, cantidad?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = state.lines.reduce((acc, l) => acc + l.cantidad, 0);
  const subtotal = state.lines.reduce(
    (acc, l) => acc + l.product.precio * l.cantidad,
    0
  );

  const value: CartContextValue = {
    lines: state.lines,
    addToCart: (product, cantidad) => {
      dispatch({ type: "ADD", product, cantidad });
      toast.success(`${product.nombre} agregado a la cotización`, {
        style: {
          borderRadius: '10px',
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        },
      });
    },
    removeFromCart: (productId) => dispatch({ type: "REMOVE", productId }),
    setQuantity: (productId, cantidad) =>
      dispatch({ type: "SET_QTY", productId, cantidad }),
    clearCart: () => dispatch({ type: "CLEAR" }),
    totalItems,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((prev) => !prev),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
