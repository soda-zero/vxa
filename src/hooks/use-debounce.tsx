import { useCallback, useEffect, useRef } from "react";

type DebouncedFunction<T extends (...args: any[]) => void> = T;

function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): DebouncedFunction<T> {
  const debounceRef = useRef<number | undefined>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return debouncedCallback as DebouncedFunction<T>;
}

export default useDebounce;
