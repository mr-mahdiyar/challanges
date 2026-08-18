"use state";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Toast {
  id: string;
  message: string;
  duration?: number;
}

type Toasts = { activeToasts: Array<Toast>; allToasts: Array<Toast> };

// problematic

export function useProblematicToastQueue(maximumActiveToasts: number = 3) {
  const [toasts, setToasts] = useState<Toasts>({ activeToasts: [], allToasts: [] });

  function addToast(newToast: Toast) {
    setToasts((prevToasts) => ({ ...prevToasts, allToasts: [...prevToasts.allToasts, newToast] }));
  }

  function removeToast(toastId: Toast["id"]) {
    const toastIndex = toasts.activeToasts.findIndex((toast) => toast.id === toastId);
    setToasts((prevToasts) => ({ ...prevToasts, activeToasts: prevToasts.activeToasts.splice(toastIndex, 1) }));
  }

  const transferToast = useCallback(() => {
    if (toasts.activeToasts.length < maximumActiveToasts) {
      const lastToast = toasts.allToasts.at(toasts.allToasts.length - 1);

      if (!lastToast) return;

      setToasts((prevToasts) => ({
        activeToasts: [...prevToasts.activeToasts, lastToast],
        allToasts: [...prevToasts.allToasts.splice(prevToasts.allToasts.length - 1, 1)],
      }));
    }
  }, [toasts, maximumActiveToasts]);

  useEffect(() => {
    toasts.activeToasts.map((toast) => {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    });
  }, [toasts]);

  useEffect(() => {
    transferToast();
  }, [toasts, transferToast]);

  return {
    toasts: toasts.activeToasts,
    addToast,
  };
}

export function useToastQueue(maximumActiveToasts: number = 3) {
  const [queue, setQueue] = useState<Array<Toast>>([]);

  // ۱. استفاده از Set به جای آرایه برای نگهداری ساده‌تر IDهایی که تایمر برایشان روشن شده
  const activeTimerIds = useRef<Set<string>>(new Set());

  const addToast = useCallback((toast: Toast) => {
    setQueue((prevToasts) => [...prevToasts, toast]);
  }, []);

  // ۲. اصلاح متد slice برای حذف فقط اولین آیتم صف
  const removeToast = useCallback(() => {
    setQueue((prevToasts) => prevToasts.slice(1));
  }, []);

  // ۳. استفاده از پارامتر ورودی به جای عدد 2
  const activeToasts = useMemo(() => {
    return queue.slice(0, maximumActiveToasts);
  }, [queue, maximumActiveToasts]);

  useEffect(() => {
    // روی توست‌های فعال پیمایش می‌کنیم
    activeToasts.forEach((toast) => {
      // اگر قبلاً برای این توست تایمر نساخته‌ایم
      if (!activeTimerIds.current.has(toast.id)) {
        activeTimerIds.current.add(toast.id); // علامت‌گذاری به عنوان تایمرِ فعال

        setTimeout(() => {
          removeToast();
          activeTimerIds.current.delete(toast.id); // پاک‌سازی ID بعد از انقضا
        }, toast.duration || 3000);
      }
    });
  }, [activeToasts, removeToast]);

  return {
    addToast,
    activeToasts,
  };
}
