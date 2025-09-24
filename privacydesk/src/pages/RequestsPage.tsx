import { RequestGrid } from '../components';
import { seedRequests } from '../data/seed';
import type { Request } from '../types';

export default function RequestsPage() {
  return (
    <div>
      <h2>Requests</h2>
      <RequestGrid
        data={seedRequests.filter(
          (req): req is Request & { owner: string } => typeof req.owner === 'string'
        )}
      />
    </div>
  );
}
