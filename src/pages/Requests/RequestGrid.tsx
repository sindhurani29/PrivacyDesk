import { useState, useMemo, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Badge } from '@progress/kendo-react-indicators';
import type { DsrRequest } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/date';

export default function RequestGrid({ 
  data, 
  onPaginationChange 
}: { 
  data: DsrRequest[];
  onPaginationChange?: (info: { currentPage: number; totalPages: number; totalItems: number; pageSize: number }) => void;
}) {
  const [page, setPage] = useState({ skip: 0, take: 10 });
  const [sort, setSort] = useState<any[]>([{ field: 'submittedAt', dir: 'desc' }]);
  const AnyColumn: any = Column;
  const navigate = useNavigate();

  const handlePageChange = (e: any) => {
    setPage(e.page);
  };

  const handleSortChange = (e: any) => {
    setSort(e.sort);
  };

  // Sort data based on current sort settings
  const sortedData = useMemo(() => {
    if (!sort.length) return data;
    
    return [...data].sort((a, b) => {
      for (const sortField of sort) {
        const aValue = sortField.field.split('.').reduce((obj: any, key: string) => obj?.[key], a);
        const bValue = sortField.field.split('.').reduce((obj: any, key: string) => obj?.[key], b);
        
        if (aValue < bValue) return sortField.dir === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortField.dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sort]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    return sortedData.slice(page.skip, page.skip + page.take);
  }, [sortedData, page]);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / page.take);
  const currentPage = Math.floor(page.skip / page.take) + 1;

  // Reset pagination when data changes (e.g., when filters are applied)
  useEffect(() => {
    setPage(prevPage => ({ ...prevPage, skip: 0 }));
  }, [data.length]);

  // Notify parent about pagination changes
  useEffect(() => {
    onPaginationChange?.({
      currentPage,
      totalPages,
      totalItems,
      pageSize: page.take
    });
  }, [currentPage, totalPages, totalItems, page.take, onPaginationChange]);

  return (
    <div className="compact-grid-wrapper">
      <Grid
        className="pd-grid pd-grid-compact k-grid-compact"
        data={paginatedData}
        skip={page.skip}
        take={page.take}
        total={totalItems}
        pageable={{
          buttonCount: 5,
          info: true,
          type: 'numeric',
          pageSizes: [5, 10, 20, 50],
          previousNext: true
        }}
        sortable
        sort={sort}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        onRowClick={(e) => navigate(`/case/${e.dataItem.id}`)}
        style={{ fontSize: 12, lineHeight: 1.2, minHeight: '450px' }}
      >
        <AnyColumn field="id" title="ID" width="120px" cell={(p: any) => (
          <td style={{ padding: '4px 8px' }}>
            <Link className="link text-sm" to={`/case/${p.dataItem.id}`} onClick={(e) => e.stopPropagation()}>
              {p.dataItem.id}
            </Link>
          </td>
        )} />
        <AnyColumn field="type" title="Type" width="100px" cell={(p: any) => {
          const t = p.dataItem.type as DsrRequest['type'];
          const color = t === 'export' ? 'green' : t === 'access' ? 'blue' : t === 'delete' ? 'red' : 'yellow';
          return <td style={{ padding: '4px 8px' }}><span className={`pill ${color} text-xs`}>{t}</span></td>;
        }} />
        <AnyColumn field="requester.email" title="Requester Email" width="200px" 
          cell={(p: any) => <td style={{ padding: '4px 8px' }}><span className="text-sm">{p.dataItem.requester.email}</span></td>}
        />
        <AnyColumn
          field="submittedAt"
          title="Submitted"
          width="120px"
          headerCell={() => (
            <th>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#64748b', fontWeight: 600, fontSize: 12 }}>
                Submitted
                <span aria-hidden="true" style={{ color: '#111827' }}>{(sort.find(s => s.field === 'submittedAt')?.dir ?? 'desc') === 'desc' ? '↓' : '↑'}</span>
              </span>
            </th>
          )}
          cell={(p: any) => <td style={{ padding: '4px 8px' }}><span className="text-sm">{formatDate(p.dataItem.submittedAt)}</span></td>}
        />
        <AnyColumn field="dueAt" title="Due" width="140px" cell={(p: any) => {
          const now = new Date();
          const due = new Date(p.dataItem.dueAt);
          const days = Math.ceil((+due - +now) / (1000*60*60*24));
          const over = days < 0;
          const label = over ? `Overdue ${Math.abs(days)}d` : `Due in ${days}d`;
          return <td style={{ padding: '4px 8px' }}><span className={`pill ${over ? 'red' : days <= 3 ? 'yellow' : 'gray'} text-xs`}>{label}</span></td>;
        }} />
        <AnyColumn field="status" title="Status" width="120px" cell={(p: any) => {
          const status = p.dataItem.status as DsrRequest['status'];
          let themeColor: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' = 'secondary';
          
          switch (status) {
            case 'done':
              themeColor = 'success';
              break;
            case 'rejected':
              themeColor = 'error';
              break;
            case 'waiting':
              themeColor = 'warning';
              break;
            case 'in_progress':
              themeColor = 'info';
              break;
            case 'new':
            default:
              themeColor = 'secondary';
              break;
          }
          
          return (
            <td style={{ padding: '4px 8px' }}>
              <div className="flex items-center justify-center">
                <Badge themeColor={themeColor} size="small">
                  {status.replace('_', ' ')}
                </Badge>
              </div>
            </td>
          );
        }} />
        <AnyColumn field="owner" title="Owner" width="100px" 
          cell={(p: any) => <td style={{ padding: '4px 8px' }}><span className="text-sm">{p.dataItem.owner || '-'}</span></td>}
        />
        <AnyColumn title="Actions" width="80px" cell={(p: any) => (
          <td style={{ padding: '4px 8px', textAlign: 'center' }}>
            <Button
              fillMode="flat"
              themeColor="primary"
              title="Open"
              aria-label={`Open ${p.dataItem.id}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/case/${p.dataItem.id}`); }}
              style={{ padding: '2px 6px', minWidth: 'auto', fontSize: 12 }}
            >
              Open
            </Button>
          </td>
        )} />
      </Grid>

      {/* Empty state handled by parent component */}
    </div>
  );
}
