import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, delay: number) {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  const lastExecuted = useRef<number>(Date.now());
  const timer = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const shouldExecute = lastExecuted.current - Date.now() <= delay;

    if (shouldExecute) {
      timer.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay);
    } else {
      if (!timer.current) return;

      clearTimeout(timer.current);

      timer.current = setTimeout(() => {});
    }
  }, [value, delay]);

  return throttledValue;
}
