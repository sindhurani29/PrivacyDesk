import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Button } from '@progress/kendo-react-buttons';
import type { DropDownListChangeEvent, MultiSelectChangeEvent } from '@progress/kendo-react-dropdowns';
import type { DatePickerChangeEvent } from '@progress/kendo-react-dateinputs';

type FilterType = 'access'|'delete'|'export'|'correct'|'all';
type FilterStatus = 'new'|'in_progress'|'waiting'|'done'|'rejected'|'all';

export default function FiltersBar({
  type, setType, status, setStatus, owner, setOwner, dateFrom, setDateFrom, dateTo, setDateTo
}: {
  type: FilterType; setType: (v: FilterType) => void;
  status: FilterStatus; setStatus: (v: FilterStatus) => void;
  owner: string[]; setOwner: (v: string[]) => void;
  dateFrom: Date | null; setDateFrom: (v: Date | null) => void;
  dateTo: Date | null; setDateTo: (v: Date | null) => void;
}) {
  const availableOwners = ['Alex', 'Priya', 'Jordan', 'Sam', 'Taylor'];
  
  const hasActiveFilters = type !== 'all' || status !== 'all' || owner.length > 0 || dateFrom || dateTo;

  // Debug log to check if component is rendering
  console.log('FiltersBar rendering with props:', { type, status, owner, dateFrom, dateTo });

  const handleClearAll = () => {
    setType('all');
    setStatus('all');
    setOwner([]);
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <div className="pd-card" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg style={{ width: '20px', height: '20px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', margin: 0 }}>Filters</h3>
          {hasActiveFilters && (
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontSize: '12px',
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: '16px'
            }}>
              Active
            </span>
          )}
        </div>
        <Button
          fillMode="flat"
          onClick={handleClearAll}
          style={{ 
            fontSize: '14px',
            color: hasActiveFilters ? '#374151' : '#9ca3af',
            fontWeight: '500'
          }}
          disabled={!hasActiveFilters}
        >
          Clear All
        </Button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        alignItems: 'end'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
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
            onChange={(e: DropDownListChangeEvent) => setType((e.value?.value as FilterType) ?? 'all')}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
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
            onChange={(e: DropDownListChangeEvent) => setStatus((e.value?.value as FilterStatus) ?? 'all')}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Owner
          </label>
          <MultiSelect 
            data={availableOwners} 
            value={owner} 
            onChange={(e: MultiSelectChangeEvent) => setOwner((e.value as string[]) ?? [])} 
            placeholder="Select owners..." 
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            From Date
          </label>
          <DatePicker
            value={dateFrom}
            onChange={(e: DatePickerChangeEvent) => setDateFrom((e.value as Date) ?? null)}
            style={{ width: '100%' }}
            placeholder="Select start date"
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            To Date
          </label>
          <DatePicker
            value={dateTo}
            onChange={(e: DatePickerChangeEvent) => setDateTo((e.value as Date) ?? null)}
            style={{ width: '100%' }}
            placeholder="Select end date"
          />
        </div>
      </div>
    </div>
  );
}
