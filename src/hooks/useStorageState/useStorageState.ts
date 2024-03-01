import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export const useStorageState = (key: string, fallbackValue: string): [string, Dispatch<SetStateAction<string>>] => {
  const isMounted: { current: boolean } = useRef(false);
  const [value, setValue] = useState(localStorage.getItem(key) || fallbackValue);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};
