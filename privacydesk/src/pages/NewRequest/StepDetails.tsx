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

const TYPES: RequestType[] = ['access', 'delete', 'export', 'correct'];

export default function StepDetails({ value, onChange }: StepDetailsProps) {
	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<div className="h2" style={{ margin: 0 }}>Request Details</div>
				<p className="muted">Type and specifics of the request</p>
			</div>
			<div className="pd-card" style={{ padding: 16 }}>
				<div className="grid-1" style={{ gap: 12 }}>
					<div>
						<DropDownList aria-label="Request type" data={TYPES} value={value.type} onChange={(e) => onChange({ ...value, type: e.value as RequestType })} />
					</div>
					<div>
						<TextArea aria-label="Additional notes" value={value.notes} onChange={(e) => onChange({ ...value, notes: (e.value as string) ?? '' })} placeholder="Any additional details about this request..." />
					</div>
					<div className="flex items-center gap-2">
						<Switch aria-labelledby="id-proof-label" checked={value.idProofReceived} onChange={(e) => onChange({ ...value, idProofReceived: Boolean(e.value) })} />
						<span id="id-proof-label">ID proof received?</span>
					</div>
				</div>
			</div>
		</div>
	);
}

