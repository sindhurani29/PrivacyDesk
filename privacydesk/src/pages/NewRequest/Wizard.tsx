import { useMemo, useState } from 'react';
import { Stepper } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import StepRequester, { type Requester } from './StepRequester';

type StepIndex = 0 | 1 | 2;

const steps: Array<{ label: string }> = [
	{ label: 'Requester' },
	{ label: 'Details' },
	{ label: 'Confirm' }
];

// Step components for Details and Confirm remain placeholders

function StepDetails() {
	return (
		<div>
			<h3>Details</h3>
			<p>Capture request details here.</p>
		</div>
	);
}

function StepConfirm() {
	return (
		<div>
			<h3>Confirm</h3>
			<p>Review and confirm the request.</p>
		</div>
	);
}

export default function Wizard() {
	const [active, setActive] = useState<StepIndex>(0);
	const [requester, setRequester] = useState<Requester>({ name: '', email: '', country: '' });

	const onStepChange = (e: any) => {
		const next = Math.max(0, Math.min(steps.length - 1, Number(e.value) || 0)) as StepIndex;
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
		<div>
			<Stepper items={steps} value={active} onChange={onStepChange} />

					<div>
						{active === 0 && (
							<StepRequester value={requester} onChange={setRequester} />
						)}
				{active === 1 && <StepDetails />}
				{active === 2 && <StepConfirm />}
			</div>

					<div>
						<Button onClick={handleBack} disabled={active === 0}>Back</Button>
						<Button
							onClick={handleNext}
							disabled={(active === 0 && !canProceedFromRequester) || active === steps.length - 1}
							themeColor="primary"
						>
							Next
						</Button>
					</div>
		</div>
	);
}

