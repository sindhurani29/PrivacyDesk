import { Window } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { useId } from 'react';

type Requester = {
	name?: string;
	email: string;
	country?: string;
};

type CaseData = {
	id: string;
	type: string;
	status: string;
	owner?: string;
	requester: Requester;
	submittedAt: string;
	dueAt: string;
	notesList?: string[];
	evidence?: string[];
	history?: string[];
};

export interface PreviewWindowProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	data: CaseData;
}

// Deterministic JSON: stable key order
function stableStringify(value: unknown): string {
	const seen = new WeakSet();
	const replacer = (_key: string, val: any) => {
		if (val && typeof val === 'object') {
			if (seen.has(val)) return undefined;
			seen.add(val);
			if (!Array.isArray(val)) {
				return Object.keys(val)
					.sort()
					.reduce((acc: any, k) => {
						acc[k] = val[k];
						return acc;
					}, {});
			}
		}
		return val;
	};
	return JSON.stringify(value, replacer, 2);
}

export default function PreviewWindow({ open, onClose, title = 'Export Preview', data }: PreviewWindowProps) {
	const dialogLabelId = useId();
	const dialogDescId = useId();
	const summaryTitleId = useId();
	const handleDownload = () => {
		const json = stableStringify(data);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${data.id}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<>
					{open && (
						<Window title={title} onClose={onClose} initialWidth={800} initialHeight={600} aria-labelledby={dialogLabelId} aria-describedby={dialogDescId}>
					<article aria-labelledby={summaryTitleId}>
						{/* Dialog accessible name */}
						<h2 id={dialogLabelId} style={{ display: 'none' }}>{title}</h2>
						{/* Dialog description points to the content wrapper */}
						<div id={dialogDescId} />

						<h3 id={summaryTitleId}>Case Summary</h3>
						<div>ID: {data.id}</div>
						<div>Type: {data.type}</div>
						<div>Status: {data.status}</div>
						<div>Owner: {data.owner ?? '—'}</div>
						<div>Submitted: {new Date(data.submittedAt).toLocaleString()}</div>
						<div>Due: {new Date(data.dueAt).toLocaleString()}</div>

						<section aria-labelledby={`${summaryTitleId}-requester`}>
							<h4 id={`${summaryTitleId}-requester`}>Requester</h4>
						<div>Name: {data.requester.name ?? '—'}</div>
						<div>Email: {data.requester.email}</div>
						<div>Country: {data.requester.country ?? '—'}</div>
						</section>

						{data.notesList && data.notesList.length > 0 && (
							<section aria-labelledby={`${summaryTitleId}-notes`}>
								<h4 id={`${summaryTitleId}-notes`}>Notes</h4>
								<ul>
									{data.notesList.map((n, i) => (
										<li key={i}>{n}</li>
									))}
								</ul>
							</section>
						)}

						{data.evidence && data.evidence.length > 0 && (
							<section aria-labelledby={`${summaryTitleId}-evidence`}>
								<h4 id={`${summaryTitleId}-evidence`}>Evidence</h4>
								<ul>
									{data.evidence.map((f, i) => (
										<li key={i}>{f}</li>
									))}
								</ul>
							</section>
						)}

						{data.history && data.history.length > 0 && (
							<section aria-labelledby={`${summaryTitleId}-history`}>
								<h4 id={`${summaryTitleId}-history`}>History</h4>
								<ul>
									{data.history.map((h, i) => (
										<li key={i}>{h}</li>
									))}
								</ul>
							</section>
						)}

						<h3>JSON</h3>
						<pre aria-label="Deterministic JSON export">{stableStringify(data)}</pre>
					</article>
								<div className="k-actions k-actions-end" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
						<Button onClick={handleDownload} aria-label="Download case as JSON" autoFocus>
							Download JSON
						</Button>
						<Button themeColor="primary" onClick={() => window.print()} aria-label="Print export preview">
							Print
						</Button>
						<Button onClick={onClose} aria-label="Close export preview">
							Close
						</Button>
								</div>
							</Window>
			)}
		</>
	);
}

