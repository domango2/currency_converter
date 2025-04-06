import { useRef, useEffect } from "react";

export function useAbortController() {
  const controllerRef = useRef(new AbortController());
  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);
  return controllerRef.current;
}
