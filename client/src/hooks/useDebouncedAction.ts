import { useState, useCallback } from "react";

export const useDebouncedAction = (
  debounceTime: number = 2000
): [number[], (id: number, action: () => void) => void] => {
  const [disabledIds, setDisabledIds] = useState<number[]>([]);

  const triggerAction = useCallback(
    (id: number, action: () => void) => {
      if (disabledIds.includes(id)) return;

      setDisabledIds((prev) => [...prev, id]);
      action();

      setTimeout(() => {
        setDisabledIds((prev) => prev.filter((item) => item !== id));
      }, debounceTime);
    },
    [disabledIds, debounceTime]
  );

  return [disabledIds, triggerAction];
};
