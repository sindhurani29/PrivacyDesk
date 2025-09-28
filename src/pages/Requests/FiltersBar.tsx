import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

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
  const hasActiveFilters = search || type !== 'all' || status !== 'all' || owner.length > 0;

  return (
    <div className="pd-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg style={{ width: '20px', height: '20px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: 0 }}>Filters</h3>
          {hasActiveFilters && (
            <span style={{
              backgroundColor: '#e7f0ff',
              color: 'var(--pd-primary)',
              fontSize: '12px',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              Active
            </span>
          )}
        </div>
        <Button
          fillMode="flat"
          onClick={onClear}
          style={{ 
            fontSize: '14px', 
            color: hasActiveFilters ? '#374151' : '#9ca3af'
          }}
          disabled={!hasActiveFilters}
        >
          Clear All
        </Button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 16 
      }}>
        <div style={{ flex: '1', minWidth: '240px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Search Email
          </label>
          <Input 
            value={search} 
            onChange={(e) => setSearch((e.value as string) ?? '')} 
            placeholder="Search by email..." 
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ flex: '1', minWidth: '240px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Request Type
          </label>
          <DropDownList 
            data={[
              { text: 'All Types', value: 'all' },
              { text: 'Access Request', value: 'access' },
              { text: 'Delete Request', value: 'delete' },
              { text: 'Export Request', value: 'export' },
              { text: 'Correction Request', value: 'correct' }
            ]} 
            textField="text"
            dataItemKey="value"
            value={[
              { text: 'All Types', value: 'all' },
              { text: 'Access Request', value: 'access' },
              { text: 'Delete Request', value: 'delete' },
              { text: 'Export Request', value: 'export' },
              { text: 'Correction Request', value: 'correct' }
            ].find(item => item.value === type)} 
            onChange={e => setType((e.value?.value as FilterType) ?? 'all')}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ flex: '1', minWidth: '240px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Status
          </label>
          <DropDownList 
            data={[
              { text: 'All Status', value: 'all' },
              { text: 'New', value: 'new' },
              { text: 'In Progress', value: 'in_progress' },
              { text: 'Waiting', value: 'waiting' },
              { text: 'Done', value: 'done' },
              { text: 'Rejected', value: 'rejected' }
            ]} 
            textField="text"
            dataItemKey="value"
            value={[
              { text: 'All Status', value: 'all' },
              { text: 'New', value: 'new' },
              { text: 'In Progress', value: 'in_progress' },
              { text: 'Waiting', value: 'waiting' },
              { text: 'Done', value: 'done' },
              { text: 'Rejected', value: 'rejected' }
            ].find(item => item.value === status)} 
            onChange={e => setStatus((e.value?.value as FilterStatus) ?? 'all')}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ flex: '1', minWidth: '240px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Owner
          </label>
          <MultiSelect 
            data={owners} 
            value={owner} 
            onChange={e => setOwner((e.value as string[]) ?? [])} 
            placeholder="Select owners..." 
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
