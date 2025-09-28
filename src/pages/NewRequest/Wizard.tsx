import { useMemo, useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate } from 'react-router-dom';
import StepRequester, { type Requester } from './StepRequester';
import StepDetails, { type StepDetailsValue } from './StepDetails';
import StepConfirm from './StepConfirm';
import { useRequestsStore } from '../../store/requests';
import { useToast } from '../../components/Common/Toaster';

type StepIndex = 0 | 1 | 2;

const steps: Array<{ label: string; description: string }> = [
	{ label: 'Requester Information', description: 'Basic details about the data subject' },
	{ label: 'Request Details', description: 'Type and specifics of the request' },
	{ label: 'Review & Confirm', description: 'Review all information before creating' }
];

// Step component for Confirm remains a placeholder

// StepConfirm is imported as a component

export default function Wizard() {
	const [active, setActive] = useState<StepIndex>(0);
	const [requester, setRequester] = useState<Requester>({ name: '', email: '', country: '' });
		const [details, setDetails] = useState<StepDetailsValue>({ type: 'access', notes: '', idProofReceived: false });
	const navigate = useNavigate();
	const { settings, addRequest } = useRequestsStore();
	const showToast = useToast();

	const handleBack = () => setActive((prev) => Math.max(0, (prev - 1) as StepIndex) as StepIndex);
	const handleNext = () => setActive((prev) => Math.min(steps.length - 1, (prev + 1) as StepIndex) as StepIndex);

		const canProceedFromRequester = useMemo(() => {
			const hasName = requester.name.trim().length > 0;
			const email = requester.email.trim();
			const emailLooksValid = /.+@.+\..+/.test(email);
			return hasName && emailLooksValid;
		}, [requester]);

	return (
		<div className="pd-page">
			<div style={{ maxWidth: 1000, margin: '0 auto' }}>
				<div style={{ marginBottom: 32, textAlign: 'center' }}>
					<h1 className="h1" style={{ marginBottom: 8, fontSize: '32px', fontWeight: 700 }}>New Request</h1>
					<p className="muted" style={{ fontSize: '16px' }}>Create a new data subject request</p>
				</div>

				<div className="pd-card" style={{ padding: 32, marginBottom: 24 }}>
					{/* Custom Stepper */}
					<div style={{ 
						display: 'flex', 
						alignItems: 'flex-start', 
						justifyContent: 'space-evenly',
						gap: 40,
						marginBottom: 32
					}}>
						{steps.map((step, index) => (
							<div key={index} style={{ 
								display: 'flex', 
								flexDirection: 'column', 
								alignItems: 'center',
								maxWidth: '200px',
								textAlign: 'center'
							}}>
								<div style={{
									width: '40px',
									height: '40px',
									borderRadius: '50%',
									backgroundColor: index === active ? '#2563eb' : index < active ? '#2563eb' : '#e5e7eb',
									color: index <= active ? 'white' : '#9ca3af',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '16px',
									fontWeight: 600,
									marginBottom: 12
								}}>
									{index + 1}
								</div>
								<div style={{
									fontSize: '14px',
									fontWeight: 600,
									color: index === active ? '#1f2937' : '#6b7280',
									marginBottom: 4
								}}>
									{step.label}
								</div>
								<div style={{
									fontSize: '12px',
									color: '#9ca3af',
									lineHeight: 1.4
								}}>
									{step.description}
								</div>
							</div>
						))}
					</div>

					<div>
						{active === 0 && (
							<StepRequester value={requester} onChange={setRequester} />
						)}
						{active === 1 && (
							<StepDetails value={details} onChange={setDetails} />
						)}
						{active === 2 && (
							<StepConfirm value={{ requester, details }} />
						)}
					</div>
				</div>

			{active !== 2 && (
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
						<div>
							<Button onClick={handleBack} disabled={active === 0}>
								{/* Left arrow */}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }} aria-hidden>
									<path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Back
							</Button>
						</div>
						<div style={{ display: 'flex', gap: 8 }}>
							<Button fillMode="outline" onClick={() => navigate('/requests')}>Cancel</Button>
							<Button
								themeColor="primary"
								onClick={handleNext}
								disabled={(active === 0 && !canProceedFromRequester) || active === steps.length - 1}
							>
								Next
								{/* Right arrow */}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 6 }} aria-hidden>
									<path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Button>
						</div>
					</div>
				)}

							{active === 2 && (
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
									<div>
										<Button onClick={handleBack}>
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }} aria-hidden>
												<path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											Back
										</Button>
									</div>
									<div style={{ display: 'flex', gap: 8 }}>
										<Button fillMode="outline" onClick={() => navigate('/requests')}>Cancel</Button>
										<Button
											themeColor="primary"
											onClick={async () => {
												// Validate requester
												const ok = requester.name.trim() && /.+@.+\..+/.test(requester.email.trim());
												if (!ok) return;
												// Compute due date based on settings SLA
												const days = settings.slaDays[details.type] ?? 30;
												const due = new Date();
												due.setDate(due.getDate() + days);
												
												try {
													// Create the request with notes if provided
													const requestData: any = {
														type: details.type,
														requester: { name: requester.name, email: requester.email, country: requester.country },
														dueAt: due.toISOString(),
														owner: 'Alex',
														status: 'new',
													};
													
													const created = await addRequest(requestData);
													
													// Add the initial note if provided
													if (details.notes.trim()) {
														// We need to add the note after the request is created
														// Use the addNote function from the store
														const { addNote } = useRequestsStore.getState();
														await addNote(created.id, details.notes.trim(), 'System');
													}
													
													showToast({ text: `Request ${created.id} created successfully`, type: 'success' });
													navigate(`/case/${created.id}`);
												} catch (error) {
													showToast({ text: 'Failed to create request. Please try again.', type: 'error' });
												}
											}}
										>
											Create Request
										</Button>
									</div>
								</div>
							)}
			</div>
		</div>
	);
}

