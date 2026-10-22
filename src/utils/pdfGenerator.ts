import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { brand } from "../data/brand";
import type { CartLine } from "../context/CartContext";
import type { QuoteCustomerInfo } from "../types";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export const generateQuotePDF = async (
  items: CartLine[],
  total: number,
  customerInfo?: QuoteCustomerInfo
) => {
  const doc = new jsPDF();
  let currentY = 15;

  // Generar número de proforma único
  const proformaNumber = `COT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const fechaHoy = new Date().toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const fechaVencimiento = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // --- Encabezado Corporativo ---
  try {
    const img = new Image();
    img.src = brand.logoPath;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const maxImgHeight = 16;
    const imgWidth = (img.width * maxImgHeight) / img.height;
    doc.addImage(img, "PNG", 14, currentY, imgWidth, maxImgHeight);
  } catch {
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.setFont("helvetica", "bold");
    doc.text(brand.name, 14, currentY + 8);
  }

  // Datos de la Empresa (Lado Derecho)
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  const alignRight = { align: "right" as const };

  doc.text(brand.name, 196, currentY + 2, alignRight);
  doc.text("RUC: 20601234567 | Importador y Distribuidor", 196, currentY + 7, alignRight);
  doc.text(brand.address, 196, currentY + 12, alignRight);
  doc.text(`Central: ${brand.contact.phone} | ${brand.contact.email}`, 196, currentY + 17, alignRight);

  currentY += 26;

  // Barra de Título del Documento
  doc.setFillColor(0, 51, 102);
  doc.rect(14, currentY, 182, 8, "F");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(`PROFORMA DE COTIZACIÓN COMERCIAL  ·  N° ${proformaNumber}`, 18, currentY + 5.5);
  doc.text(`EMISIÓN: ${fechaHoy}`, 192, currentY + 5.5, alignRight);

  currentY += 13;

  // --- Cuadro de Datos del Cliente ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, currentY, 182, 26, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE / EMPRESA", 18, currentY + 5);

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");

  const clienteNombre = customerInfo?.razonSocial || "CLIENTE GENERAL";
  const clienteDoc = customerInfo?.numeroDocumento
    ? `${customerInfo.tipoDocumento}: ${customerInfo.numeroDocumento}`
    : "Sin Documento Registrado";
  const contacto = customerInfo?.contacto || "No especificado";
  const telefono = customerInfo?.telefono || "No especificado";
  const ciudad = customerInfo?.ciudad || "Lima / Provincias";
  const formaPago = customerInfo?.formaPago || "Contado / Transferencia";

  doc.text(`Razón Social: ${clienteNombre}`, 18, currentY + 11);
  doc.text(`Doc. Identidad: ${clienteDoc}`, 18, currentY + 16);
  doc.text(`Ciudad / Destino: ${ciudad}`, 18, currentY + 21);

  doc.text(`Atención: ${contacto}`, 110, currentY + 11);
  doc.text(`Teléfono / WhatsApp: ${telefono}`, 110, currentY + 16);
  doc.text(`Condición de Pago: ${formaPago}`, 110, currentY + 21);

  currentY += 31;

  // --- Tabla de Ítems ---
  const tableData = items.map((item, idx) => [
    (idx + 1).toString(),
    item.product.sku,
    `${item.product.nombre}\nMarca: ${item.product.marca}`,
    item.cantidad.toString(),
    currency.format(item.product.precio),
    currency.format(item.product.precio * item.cantidad),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["#", "SKU", "Descripción del Producto", "Cant.", "P. Unitario", "Subtotal"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [0, 87, 184],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8.5,
      lineColor: [0, 87, 184],
    },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 24, fontStyle: "bold" },
      2: { cellWidth: 84 },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 24, halign: "right" },
      5: { cellWidth: 24, halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  // --- Cuadro de Totales ---
  // @ts-expect-error accessing finalY from autotable
  const finalY = doc.lastAutoTable?.finalY || currentY + 40;

  // Calcular desglose IGV
  const subtotalNeto = total / 1.18;
  const igvCalculado = total - subtotalNeto;

  const summaryX = 126;
  const summaryWidth = 70;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, finalY + 5, summaryWidth, 26, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.text("Op. Gravada (Neto):", summaryX + 4, finalY + 11);
  doc.text(currency.format(subtotalNeto), summaryX + summaryWidth - 4, finalY + 11, alignRight);

  doc.text("I.G.V. (18%):", summaryX + 4, finalY + 17);
  doc.text(currency.format(igvCalculado), summaryX + summaryWidth - 4, finalY + 17, alignRight);

  // Línea divisoria de total
  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 3, finalY + 20, summaryX + summaryWidth - 3, finalY + 20);

  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL GENERAL:", summaryX + 4, finalY + 26);
  doc.text(currency.format(total), summaryX + summaryWidth - 4, finalY + 26, alignRight);

  // --- Cuentas Bancarias (Lado Izquierdo) ---
  const bankBoxY = finalY + 5;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, bankBoxY, 106, 26, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("CUENTAS BANCARIAS OFICIALES (CHAMO IMPORT S.R.L.):", 18, bankBoxY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text("• BCP Soles: 191-23849102-0-45 | CCI: 002-191-002384910204-51", 18, bankBoxY + 12);
  doc.text("• BBVA Soles: 0011-0345-0200874123 | CCI: 011-345-000200874123-14", 18, bankBoxY + 17);
  doc.text("• Yape / Plin Empresas: 941 600 690", 18, bankBoxY + 22);

  // --- Términos Legales y Validez ---
  const footerY = Math.min(275, finalY + 38);
  doc.setLineWidth(0.3);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY, 196, footerY);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);

  const terminos = [
    `1. Cotización válida por 7 días calendario hasta el ${fechaVencimiento}. Precios en Moneda Nacional (Soles PEN) e incluyen I.G.V.`,
    "2. Despacho a obras, ferreterías y almacenes en Lima Metropolitana en 24/48 horas previa confirmación de pago.",
    "3. Envíos a todo el Perú mediante agencias de carga (Marvisur, Shalom, Flores) con pago en destino.",
    "4. Para confirmar su pedido, envíe el comprobante de transferencia al WhatsApp oficial: +51 941 600 690.",
  ];

  terminos.forEach((t, i) => {
    doc.text(t, 14, footerY + 5 + i * 4);
  });

  // Guardar archivo con nombre descriptivo
  const safeFilename = `Cotizacion-${proformaNumber}-${clienteNombre.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20)}.pdf`;
  doc.save(safeFilename);
};

/**
 * Exporta la cotización a formato CSV para compradores y jefes de adquisiciones.
 */
export const exportQuoteCSV = (items: CartLine[], customerInfo?: QuoteCustomerInfo) => {
  const headers = ["Item", "SKU", "Producto", "Marca", "Cantidad", "Precio_Unitario_PEN", "Subtotal_PEN"];
  const rows = items.map((l, index) => [
    index + 1,
    `"${l.product.sku}"`,
    `"${l.product.nombre.replace(/"/g, '""')}"`,
    `"${l.product.marca}"`,
    l.cantidad,
    l.product.precio.toFixed(2),
    (l.product.precio * l.cantidad).toFixed(2),
  ]);

  const total = items.reduce((sum, item) => sum + item.product.precio * item.cantidad, 0);

  let csvContent = "\uFEFF"; // UTF-8 BOM para que Excel en español no rompa caracteres
  csvContent += `COTIZACION COMERCIAL - CHAMO IMPORT S.R.L.\n`;
  csvContent += `Fecha: ${new Date().toLocaleDateString("es-PE")}\n`;
  if (customerInfo?.razonSocial) {
    csvContent += `Cliente: "${customerInfo.razonSocial}" - ${customerInfo.tipoDocumento}: ${customerInfo.numeroDocumento}\n`;
  }
  csvContent += `\n`;
  csvContent += headers.join(";") + "\n";
  rows.forEach((r) => {
    csvContent += r.join(";") + "\n";
  });
  csvContent += `\n;;;;Total Cotizado;${total.toFixed(2)}\n`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `cotizacion-chamo-import-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
