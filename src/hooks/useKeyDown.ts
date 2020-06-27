import { useEffect } from 'react';

function useKeyDown(key: string, onKeyDown?: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === key) {
        if (onKeyDown) {
          onKeyDown(e);
        }
      }
    }

    window.addEventListener('keydown', listener);

    return function () {
      window.removeEventListener('keydown', listener);
    };
  }, [onKeyDown, key]);
}

export default useKeyDown;
