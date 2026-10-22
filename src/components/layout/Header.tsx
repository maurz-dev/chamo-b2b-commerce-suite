import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  MessageCircle,
  ArrowRightLeft,
  FileSpreadsheet,
} from "lucide-react";
import { brand } from "../../data/brand";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useTheme } from "../../context/ThemeContext";
import { useCompare } from "../../context/CompareContext";
import AnnouncementBar from "./AnnouncementBar";
import CommandPalette from "../search/CommandPalette";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/cotizacion", label: "Cotizador B2B" },
  { to: "/#categorias", label: "Categorías" },
  { to: "/#preguntas-frecuentes", label: "Preguntas" },
  { to: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { totalItems, openCart } = useCart();
  const { totalFavorites } = useFavorites();
  const { isDark, toggleTheme } = useTheme();
  const { compareProducts, openCompareModal } = useCompare();

  // Atajo global de teclado (Ctrl+K o Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    navigate(query ? `/catalogo?q=${encodeURIComponent(query)}` : "/catalogo");
    setMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && !path.startsWith("/#") && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          {/* Logo enlazado al inicio */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 group"
            aria-label={`${brand.name} — ir al inicio`}
          >
            <img
              src={brand.logoPath}
              alt={brand.name}
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Navegación desktop */}
          <nav
            className="hidden items-center gap-5 lg:flex"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "font-bold text-primary"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Buscador interactivo / Command Palette Trigger */}
          <div className="hidden md:flex flex-1 max-w-xs items-center">
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-bg/70 px-3 py-2 text-xs text-text-muted shadow-xs transition hover:border-primary/50 hover:bg-surface focus:outline-none"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="h-4 w-4 text-primary" />
                <span className="truncate">Buscar productos o SKU...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono font-semibold text-text-muted shadow-xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Acciones: Comparador, Favoritos, Carrito, Modo oscuro, Cotizar */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Buscador botón para móvil */}
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              aria-label="Abrir buscador"
              className="rounded-full p-2 text-text-muted transition hover:bg-bg hover:text-primary md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Comparador de productos */}
            {compareProducts.length > 0 && (
              <button
                type="button"
                onClick={openCompareModal}
                aria-label={`Comparador (${compareProducts.length})`}
                className="relative rounded-full p-2 text-text-muted transition hover:bg-bg hover:text-primary"
                title="Abrir comparador de productos"
              >
                <ArrowRightLeft className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white animate-pulse">
                  {compareProducts.length}
                </span>
              </button>
            )}

            {/* Favoritos */}
            <Link
              to="/favoritos"
              aria-label={`Favoritos (${totalFavorites})`}
              className="relative rounded-full p-2 text-text-muted transition hover:bg-bg hover:text-primary"
            >
              <Heart className="h-5 w-5" />
              {totalFavorites > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Carrito de cotización */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Abrir carrito de cotización (${totalItems} producto(s))`}
              className="relative rounded-full p-2 text-text-muted transition hover:bg-bg hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Toggle Tema (Dark / Light) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full p-2 text-text-muted transition hover:bg-bg hover:text-primary"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="absolute flex items-center justify-center"
                >
                  {isDark ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-secondary" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Cotizador B2B botón directo */}
            <Link
              to="/cotizacion"
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white shadow-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Cotización B2B</span>
            </Link>

            {/* Botón WhatsApp */}
            <a
              href={brand.whatsapp.link()}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 hidden sm:flex items-center gap-1.5 rounded-xl bg-whatsapp px-3.5 py-2 text-xs font-bold text-white shadow-soft transition hover:brightness-105 active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>

            {/* Botón Hamburguesa móvil */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="ml-1 rounded-full p-2 text-text transition hover:bg-bg lg:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuOpen && (
          <div className="border-t border-border bg-surface px-4 py-4 lg:hidden animate-fadeIn">
            <form
              onSubmit={handleSearchSubmit}
              className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2"
              role="search"
            >
              <Search className="h-4 w-4 text-text-muted" aria-hidden />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar productos o SKU..."
                aria-label="Buscar productos"
                className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
            </form>

            <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-text hover:bg-bg"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/cotizacion"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/10 py-2.5 text-sm font-bold text-primary shadow-xs"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Ir a Proforma y Cotización
              </Link>

              <a
                href={brand.whatsapp.link()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp py-2.5 text-sm font-bold text-white shadow-soft"
              >
                <MessageCircle className="h-4 w-4" />
                Cotizar directamente por WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  );
}
