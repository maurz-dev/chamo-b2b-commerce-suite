import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  FileDown,
  FileSpreadsheet,
  MessageCircle,
  Building2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Printer,
  Sparkles,
  Info,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { brand } from "../data/brand";
import { generateQuotePDF, exportQuoteCSV } from "../utils/pdfGenerator";
import type { QuoteCustomerInfo } from "../types";
import toast from "react-hot-toast";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export default function CartPage() {
  const { lines, subtotal, totalItems, removeFromCart, setQuantity, clearCart } =
    useCart();

  const [customerInfo, setCustomerInfo] = useState<QuoteCustomerInfo>({
    tipoDocumento: "RUC",
    numeroDocumento: "",
    razonSocial: "",
    contacto: "",
    telefono: "",
    email: "",
    ciudad: "Lima Metropolitana",
    direccion: "",
    tipoComprobante: "Factura",
    formaPago: "Transferencia Bancaria",
    notas: "",
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Calcular ahorro mayorista total
  const ahorroMayorista = lines.reduce((acc, line) => {
    const diff = line.product.precio - line.product.precioMayorista;
    return acc + (diff > 0 ? diff * line.cantidad : 0);
  }, 0);

  const subtotalNeto = subtotal / 1.18;
  const igvEstimado = subtotal - subtotalNeto;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = async () => {
    if (lines.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      await generateQuotePDF(lines, subtotal, customerInfo);
      toast.success("Proforma oficial descargada exitosamente en PDF");
    } catch (err) {
      toast.error("Error al generar el documento PDF");
      console.error(err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportCSV = () => {
    if (lines.length === 0) return;
    exportQuoteCSV(lines, customerInfo);
    toast.success("Cotización exportada a formato CSV (Excel)");
  };

  const handleSendWhatsApp = () => {
    if (lines.length === 0) return;

    let msg = `*COTIZACIÓN COMERCIAL - CHAMO IMPORT S.R.L.*\n\n`;
    msg += `🏢 *Cliente:* ${customerInfo.razonSocial || "Particular"}\n`;
    if (customerInfo.numeroDocumento) {
      msg += `📄 *${customerInfo.tipoDocumento}:* ${customerInfo.numeroDocumento}\n`;
    }
    if (customerInfo.contacto) {
      msg += `👤 *Contacto:* ${customerInfo.contacto}\n`;
    }
    msg += `📍 *Destino:* ${customerInfo.ciudad}\n`;
    msg += `💳 *Comprobante:* ${customerInfo.tipoComprobante}\n\n`;
    msg += `📦 *DETALLE DE PRODUCTOS:*\n`;

    lines.forEach((l, index) => {
      msg += `${index + 1}. ${l.product.nombre} (SKU: ${l.product.sku})\n`;
      msg += `   • Cantidad: ${l.cantidad} un. x ${currency.format(l.product.precio)} = ${currency.format(l.product.precio * l.cantidad)}\n`;
    });

    msg += `\n💰 *TOTAL ESTIMADO: ${currency.format(subtotal)}* (Inc. IGV)\n`;
    if (customerInfo.notas) {
      msg += `\n📝 *Notas:* ${customerInfo.notas}\n`;
    }
    msg += `\n_Solicito confirmación de stock, tiempo de entrega y cuenta de abono._`;

    window.open(brand.whatsapp.link(msg), "_blank");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Helmet>
        <title>Cotizador Mayorista B2B | Chamo Import S.R.L.</title>
        <meta
          name="description"
          content="Genera proformas formales en PDF, consulta descuentos corporativos por volumen y envía tu cotización directa para ferretería y electricidad."
        />
      </Helmet>

      {/* Header de la Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Building2 className="h-4 w-4" />
            <span>Módulo de Cotizaciones Corporativas B2B</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-secondary dark:text-text">
            Proforma y Cotización
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-muted">
            Gestiona los productos seleccionados, ingresa los datos de tu empresa y obtén tu proforma oficial en PDF.
          </p>
        </div>

        {lines.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-text-muted transition hover:border-red-500/40 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Vaciar lista</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-text-muted transition hover:border-primary hover:text-primary"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir</span>
            </button>
          </div>
        )}
      </div>

      {lines.length === 0 ? (
        /* Empty State */
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingCart className="h-10 w-10" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-text">
            No tienes productos en tu lista de cotización
          </h2>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-text-muted">
            Explora nuestro catálogo mayorista de ferretería, iluminación y materiales eléctricos para agregar productos a tu proforma.
          </p>
          <Link
            to="/catalogo"
            className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-primary-dark"
          >
            <span>Explorar Catálogo Mayorista</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Contenido Principal con Productos y Formulario */
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Columna Izquierda: Tabla de Productos */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
              <div className="border-b border-border bg-bg/50 px-5 py-3.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Ítems a Cotizar ({totalItems})
                </span>
                <span className="text-xs text-text-muted">
                  Precios incluyen I.G.V.
                </span>
              </div>

              <ul className="divide-y divide-border">
                {lines.map((line) => {
                  const lineTotal = line.product.precio * line.cantidad;
                  const discountPerUnit = line.product.precio - line.product.precioMayorista;

                  return (
                    <li key={line.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                      {/* Imagen */}
                      <Link
                        to={`/producto/${line.product.id}`}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-bg p-2 self-center sm:self-start"
                      >
                        <img
                          src={line.product.imagenes[0] || ""}
                          alt={line.product.nombre}
                          className="h-full w-full object-contain"
                        />
                      </Link>

                      {/* Detalles */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {line.product.marca} · SKU: {line.product.sku}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(line.product.id)}
                              aria-label={`Quitar ${line.product.nombre}`}
                              className="text-text-muted hover:text-red-500 transition p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <Link
                            to={`/producto/${line.product.id}`}
                            className="mt-0.5 line-clamp-1 text-sm font-bold text-text hover:text-primary transition"
                          >
                            {line.product.nombre}
                          </Link>

                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xs text-text-muted">
                              P. Unit: <strong>{currency.format(line.product.precio)}</strong>
                            </span>
                            {discountPerUnit > 0 && (
                              <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                                Mayorista: {currency.format(line.product.precioMayorista)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cantidad y Subtotal */}
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center rounded-xl border border-border bg-bg">
                            <button
                              type="button"
                              onClick={() => setQuantity(line.product.id, line.cantidad - 1)}
                              className="p-1.5 text-text-muted hover:text-primary transition"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center text-xs font-bold text-text">
                              {line.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(line.product.id, Math.min(line.product.stock, line.cantidad + 1))}
                              disabled={line.cantidad >= line.product.stock}
                              className="p-1.5 text-text-muted hover:text-primary transition disabled:opacity-40"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black text-primary">
                              {currency.format(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Aviso de Beneficio Mayorista */}
            {ahorroMayorista > 0 && (
              <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4 text-xs text-text">
                <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-text">
                    ¡Precios especiales para distribuidores y ferreterías!
                  </p>
                  <p className="text-text-muted mt-0.5">
                    Al solicitar esta cotización por WhatsApp, nuestro asesor comercial aplicará el descuento por volumen mayorista estimado en hasta{" "}
                    <strong className="text-accent">{currency.format(ahorroMayorista)}</strong> según las cantidades finales.
                  </p>
                </div>
              </div>
            )}

            {/* Cuentas Bancarias y Garantías */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 mb-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Información de Pago y Despacho
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border bg-bg/40 p-3">
                  <p className="font-bold text-text">Cuentas Corrientes BCP / BBVA</p>
                  <p className="text-text-muted mt-0.5">Razón Social: Chamo Import S.R.L.</p>
                  <p className="text-text-muted">RUC: 20601234567</p>
                </div>
                <div className="rounded-xl border border-border bg-bg/40 p-3">
                  <p className="font-bold text-text flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-emerald-500" />
                    Envíos a todo el Perú
                  </p>
                  <p className="text-text-muted mt-0.5">Despacho en Lima en 24h.</p>
                  <p className="text-text-muted">Provincias: Envíos por agencias de carga.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario Corporativo y Resumen Financiero */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Formulario de Datos del Cliente */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 mb-4">
                <Building2 className="h-4 w-4 text-primary" />
                Datos para la Proforma / Facturación
              </h3>

              <div className="flex flex-col gap-3.5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Documento
                    </label>
                    <select
                      name="tipoDocumento"
                      value={customerInfo.tipoDocumento}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-border bg-bg px-2.5 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    >
                      <option value="RUC">RUC</option>
                      <option value="DNI">DNI</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      N° Documento
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={customerInfo.numeroDocumento}
                      onChange={handleInputChange}
                      placeholder={customerInfo.tipoDocumento === "RUC" ? "20601234567" : "72345678"}
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Razón Social / Nombre Comercial
                  </label>
                  <input
                    type="text"
                    name="razonSocial"
                    value={customerInfo.razonSocial}
                    onChange={handleInputChange}
                    placeholder="Ej. Ferretería El Progreso S.A.C."
                    className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      name="contacto"
                      value={customerInfo.contacto}
                      onChange={handleInputChange}
                      placeholder="Nombre y Apellido"
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={customerInfo.telefono}
                      onChange={handleInputChange}
                      placeholder="987 654 321"
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Ciudad / Destino
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={customerInfo.ciudad}
                      onChange={handleInputChange}
                      placeholder="Lima, Trujillo, Arequipa..."
                      className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Comprobante
                    </label>
                    <select
                      name="tipoComprobante"
                      value={customerInfo.tipoComprobante}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-border bg-bg px-2.5 py-2 text-xs text-text focus:outline-none focus:border-primary"
                    >
                      <option value="Factura">Factura con RUC</option>
                      <option value="Boleta">Boleta de Venta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-muted mb-1">
                    Notas o Requerimientos de Despacho
                  </label>
                  <textarea
                    name="notas"
                    rows={2}
                    value={customerInfo.notas}
                    onChange={handleInputChange}
                    placeholder="Ej. Entregar en agencia Shalom La Victoria..."
                    className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Resumen Financiero y Acciones */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
                Resumen de Cotización
              </h3>

              <div className="flex flex-col gap-2.5 text-xs text-text-muted">
                <div className="flex justify-between">
                  <span>Subtotal Bruto ({totalItems} un.)</span>
                  <span className="font-semibold text-text">{currency.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Op. Gravada (Neto sin IGV)</span>
                  <span>{currency.format(subtotalNeto)}</span>
                </div>
                <div className="flex justify-between">
                  <span>I.G.V. (18%)</span>
                  <span>{currency.format(igvEstimado)}</span>
                </div>

                <div className="border-t border-border pt-3 mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-text">Total a Cotizar</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary">
                      {currency.format(subtotal)}
                    </span>
                    <span className="block text-[10px] text-text-muted">Precios en Soles (PEN)</span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-soft transition hover:brightness-105 active:scale-98"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enviar Cotización a Asesor (WhatsApp)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-soft transition hover:bg-secondary/90 disabled:opacity-50"
                >
                  <FileDown className="h-4 w-4" />
                  <span>{isGeneratingPdf ? "Generando Proforma..." : "Descargar Proforma Oficial (PDF)"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg py-2.5 px-4 text-xs font-semibold text-text transition hover:border-primary hover:text-primary"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <span>Exportar Lista para Excel / ERP (.CSV)</span>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-text-muted">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>La cotización es de carácter comercial y tiene 7 días de validez.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
