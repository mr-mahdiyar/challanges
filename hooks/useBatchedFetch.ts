import { emit, off, on } from "@/utils/event-emitter";
import { useCallback, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface ResponseState {
  data: User | null;
  error: string;
  isLoading: boolean;
}

interface BatchEventPayload {
  data: User[] | null;
  error: string;
  isLoading: boolean;
}

let queue: Array<string> = [];
let timer: NodeJS.Timeout | null = null;

async function getBatchedUsers() {
  const copiedQueue = [...queue];
  queue = [];
  timer = null;

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: copiedQueue }),
    });

    const jsonResponse = await response.json();
    emit("data-received", { isLoading: false, data: jsonResponse, error: "" });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Fetch failed";
    emit("data-received", { isLoading: false, data: null, error: errorMsg });
  }
}

export function useBatchedFetch(userId: string) {
  const [response, setResponse] = useState<ResponseState>({
    data: null,
    error: "",
    isLoading: true,
  });

  const setResponseByFoundUser = useCallback(
    (payload: BatchEventPayload) => {
      const foundUser = payload.data ? payload.data.find(({ id }) => id === userId) || null : null;

      setResponse({
        error: payload.error,
        isLoading: payload.isLoading,
        data: foundUser,
      });
    },
    [userId],
  );

  useEffect(() => {
    if (!queue.includes(userId)) {
      queue.push(userId);
    }

    on("data-received", setResponseByFoundUser as VoidFunction);

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      getBatchedUsers();
    }, 50);

    return () => {
      if (queue.length > 0) queue = queue.filter((id) => id !== userId);
      off("data-received", setResponseByFoundUser as VoidFunction);
    };
  }, [userId, setResponseByFoundUser]);

  return response;
}
