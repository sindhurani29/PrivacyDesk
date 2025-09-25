import { Button } from '@progress/kendo-react-buttons';
import { useNavigate } from 'react-router-dom';
import type { RequestType } from '../../types';
import { useStore } from '../../store';

export interface StepConfirmValue {
	requester: { name: string; email: string; country?: string };
	details: { type: RequestType; notes: string; idProofReceived: boolean };
}

export interface StepConfirmProps {
	value: StepConfirmValue;
}

export default function StepConfirm({ value }: StepConfirmProps) {
	const navigate = useNavigate();
	const addRequest = useStore((s) => s.addRequest);
	const slaDays = useStore((s) => s.settings.slaDays);
	const requesterValid = value.requester.name.trim() && /.+@.+\..+/.test(value.requester.email.trim());

	const handleCreate = () => {
		const { requester, details } = value;
		const days = slaDays[details.type] ?? 30;
		const due = new Date();
		due.setDate(due.getDate() + days);

		const created = addRequest({
			type: details.type,
			requester: { email: requester.email, name: requester.name, country: requester.country },
			dueAt: due.toISOString(),
			owner: 'Unassigned',
			notes: details.notes,
			idProofReceived: details.idProofReceived,
		} as any);

		navigate(`/case/${created.id}`);
	};

	return (
		<div>
			<pre>{JSON.stringify(value, null, 2)}</pre>
			<Button themeColor="primary" onClick={handleCreate} disabled={!requesterValid}>Create</Button>
		</div>
	);
}

