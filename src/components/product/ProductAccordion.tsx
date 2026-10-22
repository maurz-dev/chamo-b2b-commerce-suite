import { useState } from "react";
import { ChevronDown, FileText, SlidersHorizontal, ShieldCheck, RotateCcw, Truck, FileCheck } from "lucide-react";
import type { Product } from "../../types";

interface ProductAccordionProps {
  product: Product;
}

export default function ProductAccordion({ product }: ProductAccordionProps) {
  // Inicializamos las secciones
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    descripcion: true,
    especificaciones: false,
    garantia: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasSpecs =
    product.especificaciones && Object.keys(product.especificaciones).length > 0;

  return (
    <div className="mt-8 rounded-xl border border-border bg-surface divide-y divide-border shadow-xs overflow-hidden">
      {/* 1. DESCRIPCIÓN */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("descripcion")}
          aria-expanded={openSections.descripcion}
          className="flex w-full items-center justify-between px-4 py-3.5 sm:px-5 text-left text-sm sm:text-base font-semibold text-text hover:bg-bg/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-primary" />
            <span>Descripción del producto</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
              openSections.descripcion ? "rotate-180 text-primary" : ""
            }`}
          />
        </button>

        {openSections.descripcion && (
          <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
            <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-text-muted">
              {product.descripcion || "No hay descripción detallada disponible para este producto."}
            </p>
          </div>
        )}
      </div>

      {/* 2. ESPECIFICACIONES TÉCNICAS */}
      {hasSpecs && (
        <div>
          <button
            type="button"
            onClick={() => toggleSection("especificaciones")}
            aria-expanded={openSections.especificaciones}
            className="flex w-full items-center justify-between px-4 py-3.5 sm:px-5 text-left text-sm sm:text-base font-semibold text-text hover:bg-bg/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Especificaciones técnicas</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                openSections.especificaciones ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {openSections.especificaciones && (
            <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
              <div className="overflow-hidden rounded-lg border border-border/80 text-xs sm:text-sm">
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(product.especificaciones ?? {}).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={`border-b border-border/60 last:border-0 ${
                          idx % 2 === 0 ? "bg-bg/30" : "bg-surface"
                        }`}
                      >
                        <td className="w-1/3 py-2 px-3 sm:py-2.5 sm:px-4 font-medium text-text-muted">
                          {key}
                        </td>
                        <td className="py-2 px-3 sm:py-2.5 sm:px-4 text-text font-medium">
                          {typeof value === "object" && value !== null
                            ? JSON.stringify(value)
                            : String(value ?? "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SATISFACCIÓN Y GARANTÍA */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("garantia")}
          aria-expanded={openSections.garantia}
          className="flex w-full items-center justify-between px-4 py-3.5 sm:px-5 text-left text-sm sm:text-base font-semibold text-text hover:bg-bg/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Satisfacción garantizada y garantías</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
              openSections.garantia ? "rotate-180 text-primary" : ""
            }`}
          />
        </button>

        {openSections.garantia && (
          <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 text-xs sm:text-sm text-text-muted flex flex-col gap-3">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-bg/40 p-3">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text text-xs sm:text-sm">Garantía oficial de marca</p>
                  <p className="mt-0.5 text-xs text-text-muted">Productos 100% originales con respaldo de fábrica.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-bg/40 p-3">
                <RotateCcw className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text text-xs sm:text-sm">Cambios y devoluciones</p>
                  <p className="mt-0.5 text-xs text-text-muted">Hasta 7 a 15 días para cambios por fallas técnicas.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-bg/40 p-3">
                <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text text-xs sm:text-sm">Envíos seguros</p>
                  <p className="mt-0.5 text-xs text-text-muted">Despacho en Lima y envíos a todo el Perú por agencia.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-bg/40 p-3">
                <FileCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text text-xs sm:text-sm">Comprobante electrónico</p>
                  <p className="mt-0.5 text-xs text-text-muted">Emitimos Boleta y Factura electrónica.</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-bg/60 p-3 text-xs text-text-muted">
              <span className="font-semibold text-text">Requisitos para cambios: </span>
              Presentar el producto en empaque original sin signos de mal uso y comprobante de pago.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
