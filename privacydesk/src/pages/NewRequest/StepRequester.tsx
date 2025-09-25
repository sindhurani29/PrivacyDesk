import { Input } from '@progress/kendo-react-inputs';

export interface Requester {
	name: string;
	email: string;
	country?: string;
}

export interface StepRequesterProps {
	value: Requester;
	onChange: (next: Requester) => void;
}

export default function StepRequester({ value, onChange }: StepRequesterProps) {
	return (
		<div>
			<div>
				<Input
					value={value.name}
					onChange={(e) => onChange({ ...value, name: (e.value as string) ?? '' })}
					placeholder="Name"
				/>
			</div>
			<div>
				<Input
					value={value.email}
					onChange={(e) => onChange({ ...value, email: (e.value as string) ?? '' })}
					placeholder="Email"
					type="email"
				/>
			</div>
			<div>
				<Input
					value={value.country ?? ''}
					onChange={(e) => onChange({ ...value, country: (e.value as string) ?? '' })}
					placeholder="Country (optional)"
				/>
			</div>
		</div>
	);
}

