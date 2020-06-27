import { useLayoutEffect } from 'react';

function useBodyScrollLock(active?: boolean) {
  useLayoutEffect(() => {
    if (!active) {
      return;
    }
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = originalStyle;
    };
  }, [active]);
}

export default useBodyScrollLock;
