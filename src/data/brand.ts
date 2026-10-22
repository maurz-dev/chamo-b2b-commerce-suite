/**
 * Datos centrales de la marca Chamo Import S.R.L.
 * Ningún componente debe escribir estos valores "a mano": todo se importa
 * desde aquí. Si cambia el número de contacto, el horario o la dirección,
 * se edita una sola línea.
 */

const WHATSAPP_NUMBER = "51941600690"; // formato internacional sin '+' ni espacios

export const brand = {
  name: "Chamo Import S.R.L.",
  shortName: "Chamo Import",
  logoPath: "/brand/logo.png",
  whatsapp: {
    number: WHATSAPP_NUMBER,
    displayNumber: "+51 941 600 690",
    defaultMessage:
      "Hola, quisiera cotizar productos de Chamo Import. Vengo de la página web.",
    /** Genera el link de wa.me con el mensaje pre-cargado y codificado. */
    link: (customMessage?: string) => {
      const message = encodeURIComponent(
        customMessage ?? brand.whatsapp.defaultMessage
      );
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    },
  },
  contact: {
    email: "ventas@chamoimport.com", // placeholder — reemplazar si tienes uno real
    phone: "+51 941 600 690",
  },
  // Placeholders — se completan en la siguiente ronda de preguntas.
  address: "Av. Ejemplo 123, Lima, Perú",
  schedule: {
    weekdays: "Lunes a Viernes: 9:00 am – 6:00 pm",
    saturday: "Sábado: 9:00 am – 1:00 pm",
    sunday: "Domingo: Cerrado",
  },
  socials: {
    facebook: "https://facebook.com/chamoimport",
    instagram: "https://instagram.com/chamoimport",
  },
} as const;
