type Hello = { event: "load"; listener: (data: string) => void } | { event: "download"; listener: (data: File) => void };
type Events = Record<Hello["event"], Array<Hello["listener"]>>;
const events: Events = Object.create(null);

export function on(event: Hello["event"], listener: Hello["listener"]) {
  if (!events[event]) events[event] = [];

  events[event].push(listener);
}

export function emit(event: Hello["event"], args: Parameters<Hello["listener"]>) {
  if (!events[event]) return;

  const originalEvents = [...events[event]];

  originalEvents.forEach((listener) => {
    if (typeof listener !== "function") {
      throw new TypeError("listener must be a function");
    }
    listener(args);
  });
}

export function off(event: Hello["event"], listener: Hello["listener"]) {
  if (!events[event]) return;

  events[event] = events[event].filter((currentListener) => listener !== currentListener);

  if (events[event].length === 0) {
    delete events[event];
  }
}

export function once(event: Hello["event"], listener: Hello["listener"]) {
  const alternativeListener = (args: Parameters<Hello["listener"]>) => {
    off(event, alternativeListener);
    listener(args);
  };
  on(event, alternativeListener);
}

export function removeAllListeners(event: Hello["event"]) {
  delete events[event];
}