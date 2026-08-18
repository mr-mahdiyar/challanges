"use client";

// It's better to convert all related states to a single state. It solves problems like race condition and stale closure.

import { useCallback, useState } from "react";

interface UseHistoryStateOptions {
  maxHistory?: number;
}

// export function useProblematicHistoryState<T>(initialPresent: T, options: UseHistoryStateOptions = {}) {
//   const past = useArray<T>();
//   const future = useArray<T>();
//   const history = useArray<T>([initialPresent]);

//   const present = useMemo(() => {
//     return history.members.at(-1);
//   }, [history]);

//   const set = useCallback(
//     (newState: T) => {
//       if (past.members.length === options.maxHistory) {
//         past.shift();
//       }
//       const lastState = history.members.at(-1);
//       past.push(lastState as T);
//       history.push(newState);
//       future.clear();
//     },
//     [future, past, options, history],
//   );

//   const undo = useCallback(() => {
//     const lastState = past.pop();
//     console.log("Past after pop: ", lastState);

//     if (future.members.length === options.maxHistory) {
//       future.shift();
//     }
//     future.push(history.members.at(-1) as T);
//     history.push(lastState as T);
//   }, [past, future, options, history]);

//   const redo = useCallback(() => {
//     const previousState = future.pop();
//     console.log(previousState);
//     history.push(previousState as T);
//     past.push(previousState as T);
//   }, [future, past, history]);

//   const canRedo = useMemo(() => {
//     return future.members.length > 0;
//   }, [future]);

//   const canUndo = useMemo(() => {
//     return past.members.length > 0;
//   }, [past]);

//   return {
//     state: present,
//     set,
//     undo,
//     redo,
//     canUndo,
//     canRedo,
//     history,
//   };
// }

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistoryState<T>(
  initialPresent: T,
  options: UseHistoryStateOptions = {}
) {
  const { maxHistory = 10 } = options;


  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  // ۱. ثبت استیت جدید
  const set = useCallback(
    (newState: T) => {
      setHistory((prevHistory) => {
        // اگر مقدار جدید با مقدار فعلی یکی است، ثبت نکن
        if (prevHistory.present === newState) return prevHistory;

        const newPast = [...prevHistory.past, prevHistory.present];

        // رعایت سقف maxHistory
        if (newPast.length > maxHistory) {
          newPast.shift(); // حذف قدیمی‌ترین استیت
        }

        return {
          past: newPast,
          present: newState,
          future: [], // پاک‌سازی future با ثبت استیت جدید
        };
      });
    },
    [maxHistory]
  );

  // ۲. عملیات Undo
  const undo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.past.length === 0) return prevHistory;

      const previousState = prevHistory.past[prevHistory.past.length - 1];
      const newPast = prevHistory.past.slice(0, prevHistory.past.length - 1);

      return {
        past: newPast,
        present: previousState,
        future: [prevHistory.present, ...prevHistory.future],
      };
    });
  }, []);

  // ۳. عملیات Redo
  const redo = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.future.length === 0) return prevHistory;

      const nextState = prevHistory.future[0];
      const newFuture = prevHistory.future.slice(1);

      return {
        past: [...prevHistory.past, prevHistory.present],
        present: nextState,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    state: history.present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    history: [...history.past, history.present, ...history.future],
  };
}