import { useEffect, useRef } from 'react';

/**
 * Custom hook to track component visibility/focus state
 * Replacement for react-navigation's useIsFocused
 * @returns boolean ref indicating if component is currently visible/focused
 */
export const useIsFocused = () => {
  const isVisible = useRef(true);

  useEffect(() => {
    isVisible.current = true;
    return () => {
      isVisible.current = false;
    };
  }, []);

  return isVisible.current;
};