"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";

interface UseFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  enabled?: boolean;
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> {
  const { method = "GET", headers, body, enabled = true } = options;

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        setState((s) => ({ ...s, loading: true }));

        const res = await fetch(`${API_BASE_URL}${url}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok) {
          throw new Error(data.message || data.error || "Request failed");
        }

        setState({ data, loading: false, error: null });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "An error occurred",
        });
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, method, enabled]); // ✅ stable deps

  return state;
}
