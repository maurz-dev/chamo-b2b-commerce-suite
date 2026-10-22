/**
 * Simula la latencia de una API real. Todo acceso a datos pasa por acá,
 * para que el día que se conecte un backend de verdad, solo se reemplace
 * la implementación interna de los "services" — nunca los componentes.
 */
export function simulateNetworkDelay<T>(data: T, minMs = 500, maxMs = 800): Promise<T> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Estado genérico para cualquier operación asíncrona de la UI.
 * "empty" se distingue de "success" para poder mostrar un EmptyState
 * distinto (por ejemplo: 0 resultados tras filtrar) sin confundirlo
 * con un error real de red.
 */
export type AsyncStatus = "idle" | "loading" | "success" | "empty" | "error";

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}
