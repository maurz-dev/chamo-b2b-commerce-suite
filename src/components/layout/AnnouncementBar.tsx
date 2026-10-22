import { ShieldCheck, Truck, PhoneCall, Sparkles } from "lucide-react";
import { brand } from "../../data/brand";

export default function AnnouncementBar() {
  return (
    <div className="border-b border-secondary/20 bg-secondary text-white text-[11px] sm:text-xs">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4">
        {/* Lado izquierdo: Confianza y Envíos */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 font-medium">
            <Truck className="h-3.5 w-3.5 text-accent" />
            <span className="hidden sm:inline">Distribución y Envíos a todo el Perú (Lima y Provincias)</span>
            <span className="sm:hidden">Envíos a todo el Perú</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 shrink-0 text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Precios Mayoristas Oficiales con IGV</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-accent font-semibold">
            <Sparkles className="h-3 w-3" />
            <span>Atención B2B Corporativa</span>
          </div>
        </div>

        {/* Lado derecho: Contacto rápido */}
        <div className="flex items-center gap-4 shrink-0 font-medium">
          <a
            href={`tel:${brand.contact.phone.replace(/\s+/g, "")}`}
            className="hidden sm:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
          >
            <PhoneCall className="h-3 w-3 text-emerald-400" />
            <span>{brand.contact.phone}</span>
          </a>

          <a
            href={brand.whatsapp.link()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-300 hover:text-white font-semibold transition-colors"
          >
            <span>WhatsApp Ventas</span>
          </a>
        </div>
      </div>
    </div>
  );
}
