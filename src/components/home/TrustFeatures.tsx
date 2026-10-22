import { ShieldCheck, Truck, Percent, Headset } from "lucide-react";

const FEATURES = [
  {
    icon: Percent,
    title: "Precios Mayoristas Reales",
    description: "Tarifas especiales escalonadas por volumen de compra para ferreterías y contratistas.",
  },
  {
    icon: Truck,
    title: "Envíos en 24h a Todo el Perú",
    description: "Despacho inmediato en Lima Metropolitana y envíos por agencia de carga a nivel nacional.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía Oficial de Marca",
    description: "Productos 100% originales con respaldo de fábrica y certificación técnica.",
  },
  {
    icon: Headset,
    title: "Asesoría Corporativa B2B",
    description: "Atención personalizada vía WhatsApp para resolver dudas y cotizar pedidos complejos.",
  },
];

export default function TrustFeatures() {
  return (
    <section className="border-b border-border bg-bg/40 py-10" aria-label="Ventajas competitivas">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-surface p-4 shadow-xs transition duration-300 hover:border-primary/40 hover:shadow-hover"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">
                    {feat.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
