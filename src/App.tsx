import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CompareProvider } from "./context/CompareContext";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/layout/WhatsAppButton";
import CartDrawer from "./components/cart/CartDrawer";
import CompareFloatingBar from "./components/compare/CompareFloatingBar";
import CompareModal from "./components/compare/CompareModal";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <FavoritesProvider>
          <CompareProvider>
            <div className="flex min-h-screen flex-col bg-bg text-text">
              <Toaster
                position="top-center"
                containerStyle={{ top: 80 }}
                toastOptions={{
                  className: "dark:bg-surface dark:text-text border border-border shadow-soft",
                }}
              />
              <Header />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogo" element={<Catalog />} />
                  <Route path="/catalogo/:categoriaId" element={<Catalog />} />
                  <Route path="/producto/:id" element={<ProductDetail />} />
                  <Route path="/cotizacion" element={<CartPage />} />
                  <Route path="/favoritos" element={<FavoritesPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
              <WhatsAppButton />
              <CartDrawer />
              <CompareFloatingBar />
              <CompareModal />
            </div>
          </CompareProvider>
        </FavoritesProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
