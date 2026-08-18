export function push<T>(stack: Array<T>, element: T) {
  stack.push(element);
}

export function pop<T>(stack: Array<T>) {
  return stack.pop();
}

function getStack<T>(stack: Array<T>) {
  return stack;
}

export function createStack<T>() {
  const stack = new Array<T>();

  return { members: getStack(stack), push: (element: T) => push(stack, element), pop: () => pop(stack) };
}
