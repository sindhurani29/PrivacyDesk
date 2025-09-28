import { useEffect, useMemo, useState } from 'react';
import { useRequestsStore } from '../../store/requests';
import RequestGrid from './RequestGrid.tsx';
import FiltersBar from './FiltersBar.tsx';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate } from 'react-router-dom';
import type { DsrRequest } from '../../types';

// Temporary seed data for immediate display (extended set for pagination testing)
const tempSeedData: DsrRequest[] = [
  {
    id: 'REQ-1001',
    type: 'access',
    requester: { name: 'Mina Kim', email: 'mina@example.com' },
    submittedAt: '2025-09-10T14:20:00Z',
    dueAt: '2025-10-10T00:00:00Z',
    status: 'in_progress',
    owner: 'Alex',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-10T14:20:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1002',
    type: 'delete',
    requester: { name: 'Lee Wong', email: 'lee@example.com' },
    submittedAt: '2025-09-08T09:12:00Z',
    dueAt: '2025-10-23T00:00:00Z',
    status: 'new',
    owner: 'Priya',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-08T09:12:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1003',
    type: 'export',
    requester: { name: 'Ravi Rao', email: 'ravi@example.com' },
    submittedAt: '2025-09-12T18:40:00Z',
    dueAt: '2025-10-12T00:00:00Z',
    status: 'waiting',
    owner: 'Jordan',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-12T18:40:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1004',
    type: 'correct',
    requester: { name: 'Ana Silva', email: 'ana@example.com' },
    submittedAt: '2025-09-05T11:00:00Z',
    dueAt: '2025-10-05T00:00:00Z',
    status: 'done',
    owner: 'Sam',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-05T11:00:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1005',
    type: 'delete',
    requester: { name: 'Chris Lee', email: 'chris@example.com' },
    submittedAt: '2025-09-02T08:05:00Z',
    dueAt: '2025-10-17T00:00:00Z',
    status: 'rejected',
    owner: 'Taylor',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-02T08:05:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1006',
    type: 'access',
    requester: { name: 'Emma Wilson', email: 'emma.wilson@example.com' },
    submittedAt: '2025-09-15T10:30:00Z',
    dueAt: '2025-10-15T00:00:00Z',
    status: 'new',
    owner: 'Alex',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-15T10:30:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1007',
    type: 'export',
    requester: { name: 'James Brown', email: 'james.brown@example.com' },
    submittedAt: '2025-09-18T16:15:00Z',
    dueAt: '2025-10-18T00:00:00Z',
    status: 'in_progress',
    owner: 'Jordan',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-18T16:15:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1008',
    type: 'correct',
    requester: { name: 'Sofia Martinez', email: 'sofia.martinez@example.com' },
    submittedAt: '2025-09-20T14:45:00Z',
    dueAt: '2025-10-20T00:00:00Z',
    status: 'waiting',
    owner: 'Sam',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-20T14:45:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1009',
    type: 'delete',
    requester: { name: 'Michael Chen', email: 'michael.chen@example.com' },
    submittedAt: '2025-09-22T09:20:00Z',
    dueAt: '2025-10-22T00:00:00Z',
    status: 'new',
    owner: 'Priya',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-22T09:20:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1010',
    type: 'access',
    requester: { name: 'Lisa Garcia', email: 'lisa.garcia@example.com' },
    submittedAt: '2025-09-25T12:00:00Z',
    dueAt: '2025-10-25T00:00:00Z',
    status: 'done',
    owner: 'Taylor',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-25T12:00:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1011',
    type: 'export',
    requester: { name: 'David Miller', email: 'david.miller@example.com' },
    submittedAt: '2025-09-26T08:30:00Z',
    dueAt: '2025-10-26T00:00:00Z',
    status: 'rejected',
    owner: 'Jordan',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-26T08:30:00Z', who: 'system', action: 'created' }]
  },
  {
    id: 'REQ-1012',
    type: 'correct',
    requester: { name: 'Maria Rodriguez', email: 'maria.rodriguez@example.com' },
    submittedAt: '2025-09-27T15:10:00Z',
    dueAt: '2025-10-27T00:00:00Z',
    status: 'in_progress',
    owner: 'Sam',
    notes: [],
    attachments: [],
    history: [{ at: '2025-09-27T15:10:00Z', who: 'system', action: 'created' }]
  }
];

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
  
  // Use store data if available, otherwise fallback to temp seed data
  const allRequests = requests.length > 0 ? requests : tempSeedData;
  
  useEffect(() => { 
    load(); 
  }, [load]);

  const filtered = useMemo(() => {
    return allRequests.filter(r => {
      // Date filtering
      if (dateFrom && new Date(r.submittedAt) < dateFrom) return false;
      if (dateTo && new Date(r.submittedAt) > dateTo) return false;
      
      // Other filters
      return (type === 'all' || r.type === type) &&
             (status === 'all' || r.status === status) &&
             (owner.length === 0 || (r.owner && owner.includes(r.owner)));
    });
  }, [allRequests, type, status, owner, dateFrom, dateTo]);

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
          <div className="text-center" style={{ padding: 48, borderRadius: '12px' }}>
            <div style={{ marginBottom: 16 }}>
              <svg 
                style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto' }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              {allRequests.length === 0 ? 'No requests yet' : 'No requests found'}
            </h3>
            <p className="muted" style={{ marginBottom: 20 }}>
              {allRequests.length === 0 
                ? 'Get started by creating your first privacy request.'
                : 'Try adjusting your filters or clearing them to see more results.'
              }
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {allRequests.length === 0 ? (
                <Button themeColor="primary" onClick={() => navigate('/new')}>
                  Create Request
                </Button>
              ) : (
                <Button fillMode="outline" onClick={clearFilters}>Clear Filters</Button>
              )}
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
