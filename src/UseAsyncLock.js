import { useCallback, useState } from "react";

export function useAsyncLock() {
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(async (fn) => {
    if (isLocked) return;     

    setIsLocked(true);        
    try {
      await fn();             
    } finally {
      setIsLocked(false);      
    }
  }, [isLocked]);

  return [lock, isLocked];    
}
