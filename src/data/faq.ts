export interface FAQItem {
  pregunta: string;
  respuesta: string;
}

export const faqs: FAQItem[] = [
  {
    pregunta: "¿Cuál es el pedido mínimo para comprar al por mayor?",
    respuesta:
      "El pedido mínimo varía según la categoría del producto. Para la mayoría de artículos manejamos un mínimo por caja o por paquete cerrado. Escríbenos por WhatsApp con los productos que te interesan y te confirmamos el mínimo exacto y el precio mayorista.",
  },
  {
    pregunta: "¿Hacen envíos a provincia?",
    respuesta:
      "Sí, coordinamos envíos a nivel nacional a través de agencias de transporte de tu confianza. El costo del envío corre por cuenta del cliente y se coordina al momento de confirmar el pedido.",
  },
  {
    pregunta: "¿Emiten factura o boleta?",
    respuesta:
      "Emitimos tanto factura como boleta electrónica. Solo necesitamos tus datos de facturación (RUC o DNI) al momento de confirmar la compra.",
  },
  {
    pregunta: "¿Los productos tienen garantía?",
    respuesta:
      "Sí, todos nuestros productos cuentan con la garantía del fabricante. En caso de algún defecto de fábrica, coordinamos el cambio directamente contigo dentro de los plazos establecidos por cada marca.",
  },
  {
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta:
      "Aceptamos transferencia bancaria, depósito y pago en efectivo en nuestro local. Para compras mayoristas también coordinamos formas de pago según el volumen del pedido.",
  },
  {
    pregunta: "¿Puedo cotizar antes de comprar?",
    respuesta:
      "Claro. Puedes agregar los productos que te interesan al carrito de cotización y enviarnos el detalle por WhatsApp, o escribirnos directamente indicando qué necesitas.",
  },
];
