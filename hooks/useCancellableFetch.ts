"use client";

import { useEffect, useState } from "react";

export function useCancellableFetch<T>(url: string) {
  const [response, setResponse] = useState<{ data: T | null; isLoading: boolean; error: unknown | null }>({
    data: null,
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    const abortController = new AbortController();
    
    setResponse({ data: null, error: null, isLoading: true });

    (async () => {
      try {
        const res = await fetch(url, {
          signal: abortController.signal,
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const result = (await res.json()) as T;
        setResponse({ data: result, error: null, isLoading: false });
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted successfully.');
          return; 
        }
        setResponse({ data: null, error: err, isLoading: false });
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return response;
}