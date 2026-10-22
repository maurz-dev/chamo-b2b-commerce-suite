import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="text-text-muted">
        No encontramos la página que buscas.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
