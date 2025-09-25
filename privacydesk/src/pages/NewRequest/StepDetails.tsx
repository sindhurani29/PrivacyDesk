import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextArea, Switch } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import type { RequestType } from '../../types';

export interface StepDetailsValue {
	type: RequestType;
	notes: string;
	idProofReceived: boolean;
}

export interface StepDetailsProps {
	value: StepDetailsValue;
	onChange: (next: StepDetailsValue) => void;
	onBack: () => void;
	onNext: () => void;
}

const TYPES: RequestType[] = ['access', 'delete', 'export', 'correct'];

export default function StepDetails({ value, onChange, onBack, onNext }: StepDetailsProps) {
	return (
		<div>
			<div>
				<DropDownList
					data={TYPES}
					value={value.type}
					onChange={(e) => onChange({ ...value, type: e.value as RequestType })}
				/>
			</div>

			<div>
				<TextArea
					value={value.notes}
					onChange={(e) => onChange({ ...value, notes: (e.value as string) ?? '' })}
					placeholder="Notes"
				/>
			</div>

			<div>
				<Switch
					checked={value.idProofReceived}
					onChange={(e) => onChange({ ...value, idProofReceived: Boolean(e.value) })}
				/>
				<span>ID proof received?</span>
			</div>

			<div>
				<Button onClick={onBack}>Back</Button>
				<Button onClick={onNext} themeColor="primary">Next</Button>
			</div>
		</div>
	);
}

