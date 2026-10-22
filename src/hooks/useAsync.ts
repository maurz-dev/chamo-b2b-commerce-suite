import { useEffect, useState, useCallback, type DependencyList } from "react";
import type { AsyncState } from "../services/api";

/**
 * Ejecuta `fetcher` y expone su resultado como AsyncState.
 * `isEmpty` decide si un resultado "success" (ej. un arreglo vacío) debe
 * tratarse como estado "empty" en la UI, en vez de "success" con 0 items.
 */
export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
  isEmpty?: (data: T) => boolean
): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    status: "loading",
    data: null,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    fetcher()
      .then((data) => {
        if (cancelled) return;
        const empty = isEmpty ? isEmpty(data) : false;
        setState({ status: empty ? "empty" : "success", data, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Ocurrió un error inesperado.";
        setState({ status: "error", data: null, error: message });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  return { ...state, refetch: () => setReloadKey((k) => k + 1) };
}
