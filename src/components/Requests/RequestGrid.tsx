import { useState } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import type { DsrRequest } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import { useRequestsStore } from '../../store/requests';
import ConfirmDialog from '../Common/ConfirmDialog';
import { useToast } from '../Common/Toaster';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'numeric', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function StatusPill({ status }: { status: DsrRequest['status'] }) {
  const cls = status === 'done' ? 'green' : status === 'rejected' ? 'red' : status === 'waiting' ? 'yellow' : status === 'in_progress' ? 'blue' : 'gray';
  const label = status.replace('_', ' ');
  return <span className={`pill ${cls}`}>{label}</span>;
}

export default function RequestGrid({ data }: { data: DsrRequest[] }) {
  const [page, setPage] = useState({ skip: 0, take: 10 });
  const [sort, setSort] = useState<any[]>([{ field: 'submittedAt', dir: 'desc' }]);
  const [preview, setPreview] = useState<DsrRequest | null>(null);
  const [markDoneConfirm, setMarkDoneConfirm] = useState<DsrRequest | null>(null);
  const { closeRequest } = useRequestsStore();
  const showToast = useToast();
  const AnyColumn: any = Column;
  const navigate = useNavigate();

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

  const handleMarkDone = async (request: DsrRequest) => {
    try {
      await closeRequest(request.id, 'done', 'Marked as completed from grid view', '');
      showToast({ text: `Request ${request.id} marked as completed`, type: 'success' });
      setMarkDoneConfirm(null);
    } catch (error) {
      showToast({ text: 'Failed to mark request as done. Please try again.', type: 'error' });
    }
  };

  return (
    <>
      <Grid
        className="pd-grid"
        data={data}
        skip={page.skip}
        take={page.take}
        pageable
        sortable
        sort={sort}
        onPageChange={(e) => setPage(e.page)}
        onSortChange={(e) => setSort(e.sort)}
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
            <div style={{ display: 'flex', gap: 4 }}>
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
              {p.dataItem.status !== 'done' && p.dataItem.status !== 'rejected' && (
                <Button
                  fillMode="outline"
                  themeColor="primary"
                  title="Mark Done"
                  aria-label={`Mark ${p.dataItem.id} as done`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMarkDoneConfirm(p.dataItem); }}
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Mark Done
                </Button>
              )}
            </div>
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

      <ConfirmDialog
        open={!!markDoneConfirm}
        text={`Are you sure you want to mark request ${markDoneConfirm?.id} as completed? This action cannot be undone.`}
        onOk={() => markDoneConfirm && handleMarkDone(markDoneConfirm)}
        onCancel={() => setMarkDoneConfirm(null)}
      />
    </>
  );
}
