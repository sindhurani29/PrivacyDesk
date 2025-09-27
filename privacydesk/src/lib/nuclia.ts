import { useEffect, useRef } from 'react';

export function useNucliaLoader() {
  const loaded = useRef(false);
  useEffect(() => {
    const kb = (import.meta as any).env?.VITE_NUCLIA_KB as string | undefined;
    if (!kb || loaded.current) return;
    loaded.current = true;
    const script = document.createElement('script');
    script.src = 'https://cdn.nuclia.cloud/nuclia-video-widget.js';
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);
}

export function hasNucliaKB(): boolean {
  return Boolean((import.meta as any).env?.VITE_NUCLIA_KB);
}
