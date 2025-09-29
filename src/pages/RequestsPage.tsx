import { useMemo, useState, useEffect } from 'react';
import RequestGrid from '../pages/Requests/RequestGrid';
import FiltersBar from '../pages/Requests/FiltersBar';
import { useRequestsStore } from '../store/requests';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate } from 'react-router-dom';

export default function RequestsPage() {
  const { requests, load } = useRequestsStore();
  const [type, setType] = useState<'access'|'delete'|'export'|'correct'|'all'>('all');
  const [status, setStatus] = useState<'new'|'in_progress'|'waiting'|'done'|'rejected'|'all'>('all');
  const [owner, setOwner] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });
  const navigate = useNavigate();
  

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      // Date filtering
      if (dateFrom && new Date(r.submittedAt) < dateFrom) return false;
      if (dateTo && new Date(r.submittedAt) > dateTo) return false;
      
      // Other filters
      return (type === 'all' || r.type === type) &&
             (status === 'all' || r.status === status) &&
             (owner.length === 0 || (r.owner && owner.includes(r.owner)));
    });
  }, [requests, type, status, owner, dateFrom, dateTo]);

  const clearFilters = () => { 
    setType('all'); 
    setStatus('all'); 
    setOwner([]);
    setDateFrom(null);
    setDateTo(null);
  };

  // Calculate display ranges for pagination info
  const getDisplayInfo = () => {
    if (filtered.length === 0) {
      return { start: 0, end: 0, total: 0 };
    }
    
    const start = (paginationInfo.currentPage - 1) * paginationInfo.pageSize + 1;
    const end = Math.min(paginationInfo.currentPage * paginationInfo.pageSize, filtered.length);
    
    return { start, end, total: filtered.length };
  };

  const displayInfo = getDisplayInfo();

  return (
    <div className="pd-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <div className="muted" style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Requests</div>
          <h1 className="h1" style={{ marginBottom: 4 }}>Requests</h1>
          <p className="muted">Manage data subject requests and privacy cases</p>
        </div>
        <Button themeColor="primary" onClick={() => navigate('/new')}>Create Request</Button>
      </div>

      <div className="mt-16">
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
        />
      </div>

      <div className="muted" style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {displayInfo.total === 0 
            ? 'No requests found'
            : `Showing ${displayInfo.start}-${displayInfo.end} of ${displayInfo.total} requests`
          }
        </span>
        <span>Page {paginationInfo.currentPage} of {Math.max(1, paginationInfo.totalPages)}</span>
      </div>

      <div className="mt-16 pd-card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '450px',
            padding: 32 
          }}>
            <p className="muted">No requests found matching your filters</p>
            <div style={{ marginTop: 12 }}>
              <Button fillMode="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          </div>
        ) : (
          <RequestGrid 
            data={filtered} 
            onPaginationChange={setPaginationInfo}
          />
        )}
      </div>
    </div>
  );
}
