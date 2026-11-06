"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";

export function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const res = await api(url);
    setState({ data: res.ok ? res.data : null, loading: false, error: res.error });
  }, [url]);
  useEffect(() => {
    load();
  }, [load]);
  return { ...state, reload: load };
}
