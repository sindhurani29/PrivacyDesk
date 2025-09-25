import { useMemo, useState } from 'react';
import { RequestGrid, FiltersBar } from '../components/Requests';
import { seedRequests } from '../data/seed';
import type { Request } from '../types';
import { useStore } from '../store';

export default function RequestsPage() {
  const owners = useMemo(
    () =>
      Array.from(
        new Set(
          seedRequests
            .map((r) => r.owner)
            .filter((o): o is string => typeof o === 'string')
        )
      ),
    []
  );

  const [type, setType] = useState<'access' | 'delete' | 'export' | 'correct' | 'all'>('all');
  const [status, setStatus] = useState<'new' | 'in_progress' | 'waiting' | 'done' | 'rejected' | 'all'>('all');
  const [owner, setOwner] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const storeRequests = useStore((s) => s.requests);

  return (
    <div>
      <h2>Requests</h2>
      <FiltersBar
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
        owner={owner}
        setOwner={setOwner}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        owners={owners}
      />
  <RequestGrid data={storeRequests.filter((req): req is Request & { owner: string } => typeof req.owner === 'string')} />
    </div>
  );
}
