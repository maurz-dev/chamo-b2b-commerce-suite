import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";

interface FormData {
  nombre: string;
  correo: string;
  telefono: string;
  mensaje: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY_FORM: FormData = { nombre: "", correo: "", telefono: "", mensaje: "" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\s-]{6,15}$/;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.nombre.trim()) errors.nombre = "Ingresa tu nombre.";
  else if (data.nombre.trim().length < 3) errors.nombre = "El nombre es muy corto.";

  if (!data.correo.trim()) errors.correo = "Ingresa tu correo.";
  else if (!EMAIL_REGEX.test(data.correo.trim())) errors.correo = "Correo inválido.";

  if (!data.telefono.trim()) errors.telefono = "Ingresa tu teléfono.";
  else if (!PHONE_REGEX.test(data.telefono.trim())) errors.telefono = "Teléfono inválido.";

  if (!data.mensaje.trim()) errors.mensaje = "Cuéntanos qué necesitas.";
  else if (data.mensaje.trim().length < 10) errors.mensaje = "Danos un poco más de detalle.";

  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Limpia el error de ese campo apenas el usuario vuelve a escribir.
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    // Confirmación simulada: no hay backend real (fuera de alcance del documento).
    setTimeout(() => {
      setStatus("success");
      setForm(EMPTY_FORM);
    }, 700);
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-whatsapp/30 bg-whatsapp/5 px-6 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-whatsapp" />
        <h3 className="text-lg font-semibold text-text">¡Mensaje enviado!</h3>
        <p className="max-w-sm text-sm text-text-muted">
          Gracias por escribirnos. Nuestro equipo se pondrá en contacto contigo a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-text">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange("nombre")}
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? "nombre-error" : undefined}
          className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.nombre ? "border-primary" : "border-border"
          }`}
        />
        {errors.nombre && (
          <p id="nombre-error" className="mt-1 text-xs text-primary">{errors.nombre}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="correo" className="mb-1 block text-sm font-medium text-text">
            Correo
          </label>
          <input
            id="correo"
            type="email"
            value={form.correo}
            onChange={handleChange("correo")}
            aria-invalid={!!errors.correo}
            aria-describedby={errors.correo ? "correo-error" : undefined}
            className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary ${
              errors.correo ? "border-primary" : "border-border"
            }`}
          />
          {errors.correo && (
            <p id="correo-error" className="mt-1 text-xs text-primary">{errors.correo}</p>
          )}
        </div>

        <div>
          <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-text">
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange("telefono")}
            aria-invalid={!!errors.telefono}
            aria-describedby={errors.telefono ? "telefono-error" : undefined}
            className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary ${
              errors.telefono ? "border-primary" : "border-border"
            }`}
          />
          {errors.telefono && (
            <p id="telefono-error" className="mt-1 text-xs text-primary">{errors.telefono}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-text">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          rows={4}
          value={form.mensaje}
          onChange={handleChange("mensaje")}
          aria-invalid={!!errors.mensaje}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
          className={`w-full resize-none rounded-lg border bg-surface px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.mensaje ? "border-primary" : "border-border"
          }`}
        />
        {errors.mensaje && (
          <p id="mensaje-error" className="mt-1 text-xs text-primary">{errors.mensaje}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark disabled:opacity-70"
      >
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
