import { useState, useMemo, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import type { DsrRequest } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/date';

function StatusPill({ status }: { status: DsrRequest['status'] }) {
  const cls = status === 'done' ? 'green' : status === 'rejected' ? 'red' : status === 'waiting' ? 'yellow' : status === 'in_progress' ? 'blue' : 'gray';
  const label = status.replace('_', ' ');
  return <span className={`pill ${cls}`}>{label}</span>;
}

export default function RequestGrid({ 
  data, 
  onPaginationChange 
}: { 
  data: DsrRequest[];
  onPaginationChange?: (info: { currentPage: number; totalPages: number; totalItems: number; pageSize: number }) => void;
}) {
  const [page, setPage] = useState({ skip: 0, take: 10 });
  const [sort, setSort] = useState<any[]>([{ field: 'submittedAt', dir: 'desc' }]);
  const [preview, setPreview] = useState<DsrRequest | null>(null);
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

  // Inline Eye icon to avoid reliance on Kendo font icons which may be blocked/missing
  const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );

  return (
    <>
      <Grid
        className="pd-grid"
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
        style={{ fontSize: 13, lineHeight: 1.3 }}
      >
        <AnyColumn field="id" title="ID" cell={(p: any) => (
          <td>
            <Link className="link" to={`/case/${p.dataItem.id}`} onClick={(e) => e.stopPropagation()}>
              {p.dataItem.id}
            </Link>
          </td>
        )} />
        <AnyColumn field="type" title="Type" cell={(p: any) => {
          const t = p.dataItem.type as DsrRequest['type'];
          const color = t === 'export' ? 'green' : t === 'access' ? 'blue' : t === 'delete' ? 'red' : 'yellow';
          return <td><span className={`pill ${color}`}>{t}</span></td>;
        }} />
        <Column field="requester.email" title="Requester Email" />
        <AnyColumn
          field="submittedAt"
          title="Submitted"
          headerCell={() => (
            <th>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontWeight: 600 }}>
                Submitted
        <span aria-hidden="true" style={{ color: '#111827' }}>{(sort.find(s => s.field === 'submittedAt')?.dir ?? 'desc') === 'desc' ? '↓' : '↑'}</span>
              </span>
            </th>
          )}
      cell={(p: any) => <td>{formatDate(p.dataItem.submittedAt)}</td>}
        />
        <AnyColumn field="dueAt" title="Due" cell={(p: any) => {
          const now = new Date();
          const due = new Date(p.dataItem.dueAt);
          const days = Math.ceil((+due - +now) / (1000*60*60*24));
          const over = days < 0;
          const label = over ? `Overdue ${Math.abs(days)}d` : `Due in ${days}d`;
          return <td><span className={`pill ${over ? 'red' : days <= 3 ? 'yellow' : 'gray'}`}>{label}</span></td>;
        }} />
  <AnyColumn field="status" title="Status" cell={(p: any) => <td><StatusPill status={p.dataItem.status} /></td>} />
        <Column field="owner" title="Owner" />
    <AnyColumn title="Actions" cell={(p: any) => (
          <td>
            <Button
              fillMode="outline"
              themeColor="base"
              title="Preview"
              aria-label={`Preview ${p.dataItem.id}`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreview(p.dataItem); }}
              style={{ padding: '4px 8px' }}
            >
      <EyeIcon />
            </Button>
          </td>
        )} />
      </Grid>

  {data.length === 0 && null}

      {preview && (
  <Dialog title={`Request ${preview.id}`} onClose={() => setPreview(null)}>
          <pre>{JSON.stringify(preview, null, 2)}</pre>
          <DialogActionsBar>
            <Button onClick={() => setPreview(null)}>Close</Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
}
