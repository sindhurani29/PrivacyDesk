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
		<div className="pd-card" style={{ padding: 32 }}>
			<div style={{ marginBottom: 24, textAlign: 'left' }}>
				<h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>
					Review & Confirm
				</h2>
				<p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
					Review all information before creating
				</p>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
				<section>
					<div style={{ fontWeight: 600, marginBottom: 12, fontSize: '16px', color: '#374151' }}>Requester Information</div>
					<div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
						<div style={{ marginBottom: 8 }}><strong>Name:</strong> <span style={{ color: '#6b7280' }}>{requester.name || '-'}</span></div>
						<div style={{ marginBottom: 8 }}><strong>Email:</strong> <span style={{ color: '#6b7280' }}>{requester.email || '-'}</span></div>
						<div><strong>Country:</strong> <span style={{ color: '#6b7280' }}>{requester.country || '-'}</span></div>
					</div>
				</section>

				<section>
					<div style={{ fontWeight: 600, marginBottom: 12, fontSize: '16px', color: '#374151' }}>Request Details</div>
					<div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
						<div style={{ marginBottom: 8 }}><strong>Type:</strong> <span style={{ color: '#6b7280' }}>{details.type}</span></div>
						<div style={{ marginBottom: 8 }}><strong>ID Proof Received:</strong> <span style={{ color: '#6b7280' }}>{details.idProofReceived ? 'Yes' : 'No'}</span></div>
						{details.notes && (
							<div><strong>Notes:</strong> <span style={{ color: '#6b7280' }}>{details.notes}</span></div>
						)}
					</div>
				</section>

				<section>
					<div style={{ background: '#e7f0ff', padding: 20, borderRadius: 8, border: '1px solid #bfdbfe' }}>
						<div style={{ fontWeight: 600, marginBottom: 12, color: '#2563eb' }}>What happens next?</div>
						<ul style={{ margin: 0, paddingLeft: 18, color: '#374151', lineHeight: 1.6 }}>
							<li>A new case will be created with a unique ID</li>
							<li>The request will be assigned to the next available team member</li>
							<li>Due date will be calculated based on request type and SLA settings</li>
							<li>You'll be redirected to the case workspace to manage progress</li>
						</ul>
					</div>
				</section>
			</div>
		</div>
	);
}
