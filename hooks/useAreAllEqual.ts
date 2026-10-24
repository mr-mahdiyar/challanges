"use client";

import { useMemo } from "react";

export function useCheckEquality(...states: Array<unknown>) {
  return useMemo(() => {
    return states.every((currentState) => currentState === states.at(0));
  }, [states]);
}
