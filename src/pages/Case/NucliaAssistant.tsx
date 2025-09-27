import { hasNucliaKB, useNucliaLoader } from '../../lib/nuclia';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'nuclia-search-bar': any;
      'nuclia-search-results': any;
    }
  }
}

export default function NucliaAssistant() {
  useNucliaLoader();
  const kb = (import.meta as any).env?.VITE_NUCLIA_KB as string | undefined;
  if (!hasNucliaKB()) {
    return <div role="note" aria-label="Nuclia placeholder">Connect Nuclia: set VITE_NUCLIA_KB in .env</div>;
  }
  return (
    <div aria-label="Nuclia assistant">
      {/* Safe public widget embed */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <nuclia-search-bar knowledgebox={kb}></nuclia-search-bar>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <nuclia-search-results></nuclia-search-results>
    </div>
  );
}
