import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { brand } from "../../data/brand";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section
      id="contacto"
      className="relative w-full scroll-mt-20 py-20"
      aria-labelledby="contacto-heading"
    >
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop" 
          alt="Contacto Background" 
          className="h-full w-full object-cover opacity-30 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/80 to-bg"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-center">
          <h2
            id="contacto-heading"
            className="text-center text-3xl font-bold text-secondary dark:text-text"
          >
            Contáctanos
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-primary"></div>
        </div>
        
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-text-muted">
          Escríbenos y te respondemos a la brevedad, o comunícate directo por
          WhatsApp para cotizaciones rápidas.
        </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <ContactForm />

        <div className="flex flex-col gap-4">
          <div className="glass-panel flex items-start gap-4 rounded-xl p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Teléfono / WhatsApp</p>
              <p className="mt-1 text-sm text-text-muted">{brand.contact.phone}</p>
            </div>
          </div>

          <div className="glass-panel flex items-start gap-4 rounded-xl p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Correo</p>
              <p className="mt-1 text-sm text-text-muted">{brand.contact.email}</p>
            </div>
          </div>

          <div className="glass-panel flex items-start gap-4 rounded-xl p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Horario de atención</p>
              <p className="mt-1 text-sm text-text-muted">{brand.schedule.weekdays}</p>
              <p className="text-sm text-text-muted">{brand.schedule.saturday}</p>
              <p className="text-sm text-text-muted">{brand.schedule.sunday}</p>
            </div>
          </div>

          <div className="glass-panel flex items-start gap-4 rounded-xl p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Dirección</p>
              <p className="mt-1 text-sm text-text-muted">{brand.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
