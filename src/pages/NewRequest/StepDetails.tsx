import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextArea, Switch } from '@progress/kendo-react-inputs';
import type { RequestType } from '../../types';

export interface StepDetailsValue {
	type: RequestType;
	notes: string;
	idProofReceived: boolean;
}

export interface StepDetailsProps {
	value: StepDetailsValue;
	onChange: (next: StepDetailsValue) => void;
}

const REQUEST_TYPES = [
	{ value: 'access', text: 'Access Request - View personal data' },
	{ value: 'delete', text: 'Delete Request - Remove personal data' },
	{ value: 'export', text: 'Export Request - Download personal data' },
	{ value: 'correct', text: 'Correction Request - Update personal data' }
];

export default function StepDetails({ value, onChange }: StepDetailsProps) {
	return (
		<div className="pd-card" style={{ padding: 32 }}>
			<div style={{ marginBottom: 24, textAlign: 'left' }}>
				<h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>
					Request Details
				</h2>
				<p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
					Type and specifics of the request
				</p>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
				<div>
					<label style={{ 
						display: 'block', 
						fontSize: '14px', 
						fontWeight: 600, 
						color: '#374151',
						marginBottom: '6px'
					}}>
						Request Type *
					</label>
					<DropDownList 
						aria-label="Request type" 
						data={REQUEST_TYPES} 
						textField="text"
						dataItemKey="value"
						value={REQUEST_TYPES.find(rt => rt.value === value.type)} 
						onChange={(e) => onChange({ ...value, type: e.value.value as RequestType })} 
						style={{ width: '100%' }}
					/>
				</div>
				<div>
					<label style={{ 
						display: 'block', 
						fontSize: '14px', 
						fontWeight: 600, 
						color: '#374151',
						marginBottom: '6px'
					}}>
						Additional Notes
					</label>
					<TextArea 
						aria-label="Additional notes" 
						value={value.notes} 
						onChange={(e) => onChange({ ...value, notes: (e.value as string) ?? '' })} 
						placeholder="Any additional details about this request..." 
						rows={4}
						style={{ width: '100%' }}
					/>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<Switch 
						aria-labelledby="id-proof-label" 
						checked={value.idProofReceived} 
						onChange={(e) => onChange({ ...value, idProofReceived: Boolean(e.value) })} 
					/>
					<span id="id-proof-label" style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
						ID proof received?
					</span>
				</div>
			</div>
		</div>
	);
}
