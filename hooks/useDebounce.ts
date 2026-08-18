import { useCallback, useEffect, useRef } from "react";

export function useDebounce<T extends VoidFunction>(callbackFn: T, delay: number) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => {
      callbackFn();
    }, delay);

    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, [callbackFn, delay]);
}

export function useDebouncedFunction<T extends (...args: any[]) => void>(
  callbackFn: T, 
  delay: number
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // نگهداری آخرین نسخه تابع کالبک در یک رفرنس برای جلوگیری از باگ Closureها
  const callbackRef = useRef(callbackFn);
  
  useEffect(() => {
    callbackRef.current = callbackFn;
  }, [callbackFn]);

  const debouncedFunction = useCallback((...args: Parameters<T>) => {
    // ۱. اگر از قبل تایمری فعال است، آن را لغو کن
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // ۲. تایمر جدید را بدون هیچ شرط بازدارنده‌ای ثبت کن
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);

  // پاک‌سازی حافظه در زمان unmount شدن کامپوننت
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debouncedFunction;
}