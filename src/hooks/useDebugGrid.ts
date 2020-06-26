import { useEffect } from 'react';

const KEY_CODE = 'KeyD';

function useDebugGrid() {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.code === KEY_CODE) {
        const htmlEl = document.documentElement;
        if (htmlEl.classList.contains('debug-grid')) {
          htmlEl.classList.remove('debug-grid');
        } else {
          htmlEl.classList.add('debug-grid');
        }
      }
    }

    window.addEventListener('keypress', listener);

    return function () {
      window.removeEventListener('keypress', listener);
    };
  }, []);
}

export default useDebugGrid;
