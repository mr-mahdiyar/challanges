import { useCallback, useEffect, useRef } from "react";

export function useClickOutSide<T extends HTMLElement>(callbackFn: VoidFunction) {
  const elementRef = useRef<T | null>(null);

  const handleClick = useCallback((event: MouseEvent) => {
    const element = elementRef.current;

    if (!element) return;

    if (!element.contains(event.target as Node)) callbackFn();
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, {
      capture: true
    });

    return () => {
      document.removeEventListener("click", handleClick, {
        capture: true
      });
    };
  }, []);

  return elementRef;
}
