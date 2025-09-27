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
		<div>
			<div style={{ marginBottom: 16 }}>
				<div className="h2" style={{ margin: 0 }}>Requester Information</div>
				<p className="muted">Basic details about the data subject</p>
			</div>

			<div className="pd-card" style={{ padding: 16 }}>
				<div className="grid-1" style={{ gap: 12 }}>
					<Field id="req-name" label="Full Name *">
						<Input
							id="req-name"
							aria-label="Requester name"
							value={value.name}
							onChange={(e) => onChange({ ...value, name: (e.value as string) ?? '' })}
							placeholder=""
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
						/>
					</Field>
				</div>
			</div>
		</div>
	);
}

