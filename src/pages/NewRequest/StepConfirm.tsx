import type { RequestType } from '../../types';

export interface StepConfirmValue {
	requester: { name: string; email: string; country?: string };
	details: { type: RequestType; notes: string; idProofReceived: boolean };
}

export interface StepConfirmProps {
	value: StepConfirmValue;
}

export default function StepConfirm({ value }: StepConfirmProps) {
	const { requester, details } = value;
	return (
		<div className="pd-card" style={{ padding: 16 }}>
			<div style={{ marginBottom: 16 }}>
				<div className="h2" style={{ margin: 0 }}>Review & Confirm</div>
				<p className="muted">Review all information before creating</p>
			</div>

			<section style={{ marginBottom: 16 }}>
				<div style={{ fontWeight: 700, marginBottom: 8 }}>Requester Information</div>
				<div style={{ background: '#f8fafc', padding: 16, borderRadius: 10 }}>
					<div style={{ marginBottom: 8 }}><strong>Name:</strong> {requester.name || '-'}</div>
					<div style={{ marginBottom: 8 }}><strong>Email:</strong> {requester.email || '-'}</div>
					<div><strong>Country:</strong> {requester.country || '-'}</div>
				</div>
			</section>

			<section style={{ marginBottom: 16 }}>
				<div style={{ fontWeight: 700, marginBottom: 8 }}>Request Details</div>
				<div style={{ background: '#f8fafc', padding: 16, borderRadius: 10 }}>
					<div style={{ marginBottom: 8 }}><strong>Type:</strong> {details.type}</div>
					<div><strong>ID Proof Received:</strong> {details.idProofReceived ? 'Yes' : 'No'}</div>
				</div>
			</section>

			<section>
				<div style={{ background: '#e7f0ff', padding: 16, borderRadius: 10 }}>
					<div style={{ fontWeight: 700, marginBottom: 8 }}>What happens next?</div>
					<ul style={{ margin: 0, paddingLeft: 18, color: '#374151' }}>
						<li>A new case will be created with a unique ID</li>
						<li>The request will be assigned to the next available team member</li>
						<li>Due date will be calculated based on request type and SLA settings</li>
						<li>You'll be redirected to the case workspace to manage progress</li>
					</ul>
				</div>
			</section>
		</div>
	);
}

