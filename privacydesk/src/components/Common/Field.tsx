import type { ReactNode } from 'react';

export default function Field({ label, children, id }: { label: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <div>{children}</div>
    </div>
  );
}
