import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import Field from '../../components/Common/Field';

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
		<div className="pd-card" style={{ padding: 32 }}>
			<div style={{ marginBottom: 24, textAlign: 'left' }}>
				<h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>
					Requester Information
				</h2>
				<p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
					Basic details about the data subject
				</p>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
				<Field id="req-name" label="Full Name *">
					<Input
						id="req-name"
						aria-label="Requester name"
						value={value.name}
						onChange={(e) => onChange({ ...value, name: (e.value as string) ?? '' })}
						placeholder=""
						style={{ width: '100%' }}
					/>
				</Field>

				<Field id="req-email" label="Email Address *">
					<Input
						id="req-email"
						aria-label="Requester email"
						value={value.email}
						onChange={(e) => onChange({ ...value, email: (e.value as string) ?? '' })}
						placeholder=""
						type="email"
						style={{ width: '100%' }}
					/>
				</Field>

				<Field id="req-country" label="Country *">
					<DropDownList
						id="req-country"
						data={[
							'United States',
							'Canada',
							'United Kingdom',
							'Germany',
							'France',
							'India',
							'Australia',
						]}
						defaultItem="Select country"
						value={value.country ?? ''}
						onChange={(e) => onChange({ ...value, country: (e.value as string) ?? '' })}
						style={{ width: '100%' }}
					/>
				</Field>
			</div>
		</div>
	);
}