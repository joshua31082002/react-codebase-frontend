type AnyFunction = (...args: never[]) => void;

export interface DebouncedFunction<Callback extends AnyFunction> {
  (...args: Parameters<Callback>): void;
  cancel: () => void;
  flush: () => void;
}

export const debounce = <Callback extends AnyFunction>(
  callback: Callback,
  delay: number
): DebouncedFunction<Callback> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let latestArgs: Parameters<Callback> | undefined;

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = undefined;
    latestArgs = undefined;
  };

  const flush = () => {
    if (timeoutId === undefined || latestArgs === undefined) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = undefined;

    const args = latestArgs;
    latestArgs = undefined;
    callback(...args);
  };

  const debounced = ((...args: Parameters<Callback>) => {
    latestArgs = args;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(flush, delay);
  }) as DebouncedFunction<Callback>;

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
};

export const throttle = <Callback extends AnyFunction>(callback: Callback, interval: number) => {
  let lastInvocation = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let latestArgs: Parameters<Callback> | undefined;

  const invoke = () => {
    lastInvocation = Date.now();
    timeoutId = undefined;

    if (latestArgs !== undefined) {
      const args = latestArgs;
      latestArgs = undefined;
      callback(...args);
    }
  };

  const throttled = (...args: Parameters<Callback>) => {
    latestArgs = args;
    const remainingTime = interval - (Date.now() - lastInvocation);

    if (remainingTime <= 0) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      invoke();
      return;
    }

    if (timeoutId === undefined) {
      timeoutId = setTimeout(invoke, remainingTime);
    }
  };

  return throttled;
};
