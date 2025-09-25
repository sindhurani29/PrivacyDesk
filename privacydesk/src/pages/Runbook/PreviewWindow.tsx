import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';

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
			<Dialog title={title} onClose={onClose} minWidth={600}>
					<div>
						<h3>Case Summary</h3>
						<div>ID: {data.id}</div>
						<div>Type: {data.type}</div>
						<div>Status: {data.status}</div>
						<div>Owner: {data.owner ?? '—'}</div>
						<div>Submitted: {new Date(data.submittedAt).toLocaleString()}</div>
						<div>Due: {new Date(data.dueAt).toLocaleString()}</div>

						<h4>Requester</h4>
						<div>Name: {data.requester.name ?? '—'}</div>
						<div>Email: {data.requester.email}</div>
						<div>Country: {data.requester.country ?? '—'}</div>

						{data.notesList && data.notesList.length > 0 && (
							<>
								<h4>Notes</h4>
								<ul>
									{data.notesList.map((n, i) => (
										<li key={i}>{n}</li>
									))}
								</ul>
							</>
						)}

						{data.evidence && data.evidence.length > 0 && (
							<>
								<h4>Evidence</h4>
								<ul>
									{data.evidence.map((f, i) => (
										<li key={i}>{f}</li>
									))}
								</ul>
							</>
						)}

						{data.history && data.history.length > 0 && (
							<>
								<h4>History</h4>
								<ul>
									{data.history.map((h, i) => (
										<li key={i}>{h}</li>
									))}
								</ul>
							</>
						)}

						<h3>JSON</h3>
						<pre>{stableStringify(data)}</pre>
					</div>
					<DialogActionsBar>
						<Button onClick={handleDownload}>Download JSON</Button>
						<Button themeColor="primary" onClick={() => window.print()}>Print</Button>
						<Button onClick={onClose}>Close</Button>
					</DialogActionsBar>
				</Dialog>
			)}
		</>
	);
}

