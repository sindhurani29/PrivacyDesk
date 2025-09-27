import { useMemo, useState } from 'react';
import { Stepper } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { useNavigate } from 'react-router-dom';
import StepRequester, { type Requester } from './StepRequester';
import StepDetails, { type StepDetailsValue } from './StepDetails';
import StepConfirm from './StepConfirm';
import { useRequestsStore } from '../../store/requests';

type StepIndex = 0 | 1 | 2;

const steps: Array<{ label: string }> = [
	{ label: 'Requester Information' },
	{ label: 'Request Details' },
	{ label: 'Review & Confirm' }
];

// Step component for Confirm remains a placeholder

// StepConfirm is imported as a component

export default function Wizard() {
	const [active, setActive] = useState<StepIndex>(0);
	const [requester, setRequester] = useState<Requester>({ name: '', email: '', country: '' });
		const [details, setDetails] = useState<StepDetailsValue>({ type: 'access', notes: '', idProofReceived: false });
	const navigate = useNavigate();
		const { settings, addRequest } = useRequestsStore();

		const onStepChange = (e: any) => {
			const next = Math.max(0, Math.min(steps.length - 1, Number(e.value) || 0)) as StepIndex;
			// Prevent skipping ahead if requester is not valid yet
			if (next >= 1 && !canProceedFromRequester) {
				return; // stay on current step until valid
			}
			setActive(next);
		};

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
			<div style={{ maxWidth: 920, margin: '0 auto' }}>
				<div style={{ marginBottom: 16 }}>
					<h1 className="h1" style={{ marginBottom: 4 }}>New Request</h1>
					<p className="muted">Create a new data subject request</p>
				</div>

				<div className="pd-card" style={{ padding: 16 }}>
					<Stepper items={steps} value={active} onChange={onStepChange} />

					<div className="mt-4">
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
												
												navigate(`/case/${created.id}`);
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

