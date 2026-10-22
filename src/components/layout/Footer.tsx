import { Link } from "react-router-dom";
import { ExternalLink, Mail, MapPin, Phone, CreditCard, Banknote } from "lucide-react";
import { brand } from "../../data/brand";

const ENLACES_UTILES = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/#categorias", label: "Categorías" },
  { to: "/#preguntas-frecuentes", label: "Preguntas frecuentes" },
  { to: "/#contacto", label: "Contacto" },
  { to: "/favoritos", label: "Mis favoritos" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + descripción */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={brand.logoPath} alt={brand.name} className="h-12 w-auto" />
            </Link>
            <p className="mt-4 text-sm text-white/70">
              Importadora y distribuidora de ferretería, iluminación, artículos
              eléctricos, adhesivos y campaña escolar, al por mayor.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={brand.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Facebook
              </a>
              <a
                href={brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Instagram
              </a>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">
              Enlaces útiles
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {ENLACES_UTILES.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/70 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto + horario */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">
              Contacto
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                {brand.contact.phone}
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                {brand.contact.email}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {brand.address}
              </li>
            </ul>
            <div className="mt-4 text-xs text-white/60">
              <p>{brand.schedule.weekdays}</p>
              <p>{brand.schedule.saturday}</p>
              <p>{brand.schedule.sunday}</p>
            </div>
          </div>

          {/* Métodos de pago */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">
              Métodos de pago
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Transferencia bancaria
              </span>
              <span className="flex items-center gap-2">
                <Banknote className="h-4 w-4" /> Efectivo en local
              </span>
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Depósito en cuenta
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/50">
            Sitio de práctica — MTA Software · Catálogo Web Frontend
          </p>
        </div>
      </div>
    </footer>
  );
}
