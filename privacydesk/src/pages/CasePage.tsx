import { useParams } from 'react-router-dom';
import { useStore } from '../store';

export default function CasePage() {
  const { id } = useParams();
  const req = useStore((s) => s.requests.find((r) => r.id === id));
  if (!req) return <div>Case not found.</div>;
  return (
    <div>
      <h2>Case {req.id}</h2>
      <pre>{JSON.stringify(req, null, 2)}</pre>
    </div>
  );
}
