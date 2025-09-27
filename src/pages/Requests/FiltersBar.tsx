import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';

type FilterType = 'access'|'delete'|'export'|'correct'|'all';
type FilterStatus = 'new'|'in_progress'|'waiting'|'done'|'rejected'|'all';

export default function FiltersBar({
  search, setSearch, type, setType, status, setStatus, owner, setOwner, owners, onClear
}: {
  search: string; setSearch: (v: string) => void;
  type: FilterType; setType: (v: FilterType) => void;
  status: FilterStatus; setStatus: (v: FilterStatus) => void;
  owner: string[]; setOwner: (v: string[]) => void;
  owners: string[]; onClear: () => void;
}) {
  return (
    <div className="pd-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }} className="mb-2">
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="k-icon k-i-filter" aria-hidden="true"></span>
          Filters
        </h2>
        <button className="pd-ghost-btn" onClick={onClear}>Clear Filters</button>
      </div>
      <div role="group" aria-label="Request filters" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
        <div>
          <div className="muted" style={{ marginBottom: 6 }}>Search Email</div>
          <Input value={search} onChange={(e) => setSearch((e.value as string) ?? '')} placeholder="Search by email..." aria-label="Search by email" style={{ width: '100%' }} />
        </div>
        <div>
          <div className="muted" style={{ marginBottom: 6 }}>Type</div>
          <DropDownList data={['all','access','delete','export','correct']} value={type} onChange={e => setType((e.value as FilterType) ?? 'all')} aria-label="Filter by type" style={{ width: '100%' }} />
        </div>
        <div>
          <div className="muted" style={{ marginBottom: 6 }}>Status</div>
          <DropDownList data={['all','new','in_progress','waiting','done','rejected']} value={status} onChange={e => setStatus((e.value as FilterStatus) ?? 'all')} aria-label="Filter by status" style={{ width: '100%' }} />
        </div>
        <div>
          <div className="muted" style={{ marginBottom: 6 }}>Owner</div>
          <MultiSelect data={owners} value={owner} onChange={e => setOwner((e.value as string[]) ?? [])} placeholder="All Owners" aria-label="Filter by owner" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
