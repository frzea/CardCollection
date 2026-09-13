import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

type Props<T> = {
  key: string;
  initialValue: T;
};

function useAsyncStorage<T>({ key, initialValue }: Props<T>): [T, (value: T) => Promise<void>, boolean] {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  const setValue = useCallback(
    async (value: T) => {
      try {
        setStoredValue(value);
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(e);
      }
    },
    [key],
  );

  return [storedValue, setValue, loading];
}

export default useAsyncStorage;
