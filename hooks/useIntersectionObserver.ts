"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type UseIntersectionObserverOptions = IntersectionObserverInit & {
  freezeOnceVisible?: boolean;
};

type OutPut = {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
};

export function useIntersectionObserver(options?: UseIntersectionObserverOptions) {
  const [intersectionState, setIntersectionState] = useState<{
    isIntersecting: OutPut["isIntersecting"];
    node: Parameters<OutPut["ref"]>["0"];
    entry: OutPut["entry"];
  }>({
    isIntersecting: false,
    node: null,
    entry: null,
  });

  const threshold = JSON.stringify(options?.threshold);

  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) => {
      setIntersectionState((prevState) => ({ ...prevState, entry, isIntersecting: entry.isIntersecting }));
    }, options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.freezeOnceVisible, options?.root, options?.rootMargin, threshold]);

  useEffect(() => {
    if (intersectionState.node) {
      observer.observe(intersectionState.node);
    }

    return () => {
      observer.disconnect();
    };
  }, [intersectionState.node, observer]);

  useEffect(() => {
    if (options?.freezeOnceVisible && intersectionState.isIntersecting) observer.disconnect();
  }, [intersectionState.isIntersecting, options?.freezeOnceVisible, observer]);

  const ref: OutPut["ref"] = useCallback((node: Parameters<OutPut["ref"]>["0"]) => {
    setIntersectionState((prevState) => ({ ...prevState, node }));

    return () => {
      setIntersectionState(() => ({ node: null, isIntersecting: false, entry: null }));
    };
  }, []);

  return { ref, isIntersecting: intersectionState.isIntersecting, entry: intersectionState.entry };
}
