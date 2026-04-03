import { useEffect, useState } from "react";

export function useFetch<T = unknown>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const [result, setResult] = useState<T | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_WUNDERWORLDS_API_ORIGIN}/${url}`)
      .then((r) => r.json())
      .then((json: T) => setResult(json))
      .catch((error: unknown) => setError(error));
  }, [url]);

  return {
    loading,
    error,
    result,
  };
}
