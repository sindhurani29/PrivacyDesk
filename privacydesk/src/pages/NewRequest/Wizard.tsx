import { useState } from 'react';
import { Stepper } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';

type StepIndex = 0 | 1 | 2;

const steps: Array<{ label: string }> = [
	{ label: 'Requester' },
	{ label: 'Details' },
	{ label: 'Confirm' }
];

function StepRequester() {
	return (
		<div>
			<h3>Requester</h3>
			<p>Collect requester information here.</p>
		</div>
	);
}

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

	const onStepChange = (e: any) => {
		const next = Math.max(0, Math.min(steps.length - 1, Number(e.value) || 0)) as StepIndex;
		setActive(next);
	};

	const handleBack = () => setActive((prev) => Math.max(0, (prev - 1) as StepIndex) as StepIndex);
	const handleNext = () => setActive((prev) => Math.min(steps.length - 1, (prev + 1) as StepIndex) as StepIndex);

	return (
		<div>
			<Stepper items={steps} value={active} onChange={onStepChange} />

			<div>
				{active === 0 && <StepRequester />}
				{active === 1 && <StepDetails />}
				{active === 2 && <StepConfirm />}
			</div>

			<div>
				<Button onClick={handleBack} disabled={active === 0}>Back</Button>
				<Button onClick={handleNext} disabled={active === steps.length - 1} themeColor="primary">
					Next
				</Button>
			</div>
		</div>
	);
}

