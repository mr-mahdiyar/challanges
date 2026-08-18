"use client";

import { useCallback, useMemo, useState } from "react";

export function useArray<T>(initialValue: Array<T> = []) {
  const [array, setArray] = useState<Array<T>>(initialValue);

  const push = useCallback((element: T) => {
    setArray((prevStack) => [...prevStack, element]);
  }, []);

  const pop = useCallback(() => {
    const lastElement = array.at(-1);

    setArray((prevStack) => prevStack.slice(0, array.length - 1));

    return lastElement;
  }, [array]);

  const shift = useCallback(() => {
    const firstElement = array.at(0);
    setArray((prevArray) => prevArray.slice(1));
    return firstElement;
  }, [array]);

  const unSift = useCallback(
    (newElement: T) => {
      setArray((prevArray) => [newElement, ...prevArray]);
      return array.length;
    },
    [array],
  );

  const members = useMemo(() => {
    return array;
  }, [array]);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  return { members, pop, push, clear, shift, unSift };
}
