import { Window } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { useId, useCallback } from 'react';

interface Requester {
	name?: string;
	email: string;
	country?: string;
}

interface CaseData {
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
}

export interface PreviewWindowProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	data: CaseData;
}

/**
 * Creates a deterministic JSON string with stable key ordering.
 * This ensures consistent output across different JavaScript engines and environments.
 */
function createDeterministicJson(value: unknown): string {
	const seen = new WeakSet<object>();
	
	const replacer = (_key: string, val: unknown): unknown => {
		if (val !== null && typeof val === 'object') {
			// Handle circular references
			if (seen.has(val)) {
				return '[Circular Reference]';
			}
			seen.add(val);
			
			// Sort object keys for deterministic output
			if (!Array.isArray(val)) {
				const sortedObj: Record<string, unknown> = {};
				Object.keys(val as Record<string, unknown>)
					.sort()
					.forEach(key => {
						sortedObj[key] = (val as Record<string, unknown>)[key];
					});
				return sortedObj;
			}
		}
		return val;
	};
	
	return JSON.stringify(value, replacer, 2);
}

/**
 * PreviewWindow component that displays a case summary in a Kendo UI Window
 * with print-friendly formatting and export capabilities.
 */
export default function PreviewWindow({ 
	open, 
	onClose, 
	title = 'Export Preview', 
	data 
}: PreviewWindowProps): JSX.Element {
	const dialogLabelId = useId();
	const dialogDescId = useId();
	const summaryTitleId = useId();
	
	const handleDownloadJson = useCallback((): void => {
		const deterministicJson = createDeterministicJson(data);
		const blob = new Blob([deterministicJson], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		
		const downloadLink = document.createElement('a');
		downloadLink.href = url;
		downloadLink.download = `case-${data.id}-export.json`;
		downloadLink.style.display = 'none';
		
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		
		URL.revokeObjectURL(url);
	}, [data]);
	
	const handlePrint = useCallback((): void => {
		window.print();
	}, []);
	
	const formatDate = useCallback((dateString: string): string => {
		try {
			return new Date(dateString).toLocaleString();
		} catch {
			return dateString;
		}
	}, []);
	
	if (!open) {
		return <></>;
	}
	
	return (
		<Window
			title={title}
			onClose={onClose}
			initialWidth={900}
			initialHeight={700}
			aria-labelledby={dialogLabelId}
			aria-describedby={dialogDescId}
			modal={true}
			resizable={true}
		>
			<div id={dialogDescId} style={{ display: 'none' }}>
				Case export preview with summary and JSON data
			</div>
			
			<article 
				aria-labelledby={summaryTitleId}
				style={{ 
					padding: '20px',
					fontFamily: 'Arial, sans-serif',
					lineHeight: '1.6',
					color: '#333'
				}}
			>
				{/* Hidden title for screen readers */}
				<h1 id={dialogLabelId} style={{ display: 'none' }}>
					{title}
				</h1>
				
				{/* Print-friendly header */}
				<header style={{ 
					borderBottom: '2px solid #007acc',
					paddingBottom: '16px',
					marginBottom: '24px'
				}}>
					<h2 id={summaryTitleId} style={{ 
						margin: '0 0 8px 0',
						color: '#007acc',
						fontSize: '24px'
					}}>
						Case Summary
					</h2>
					<p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
						Generated on {new Date().toLocaleString()}
					</p>
				</header>
				
				{/* Case Basic Information */}
				<section style={{ marginBottom: '24px' }}>
					<h3 style={{ 
						color: '#007acc',
						borderBottom: '1px solid #ddd',
						paddingBottom: '4px',
						margin: '0 0 12px 0'
					}}>
						Case Information
					</h3>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
						<div><strong>Case ID:</strong> {data.id}</div>
						<div><strong>Type:</strong> {data.type}</div>
						<div><strong>Status:</strong> {data.status}</div>
						<div><strong>Owner:</strong> {data.owner ?? 'Unassigned'}</div>
						<div><strong>Submitted:</strong> {formatDate(data.submittedAt)}</div>
						<div><strong>Due Date:</strong> {formatDate(data.dueAt)}</div>
					</div>
				</section>
				
				{/* Requester Information */}
				<section 
					aria-labelledby={`${summaryTitleId}-requester`}
					style={{ marginBottom: '24px' }}
				>
					<h3 
						id={`${summaryTitleId}-requester`}
						style={{ 
							color: '#007acc',
							borderBottom: '1px solid #ddd',
							paddingBottom: '4px',
							margin: '0 0 12px 0'
						}}
					>
						Requester Details
					</h3>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
						<div><strong>Name:</strong> {data.requester.name ?? 'Not provided'}</div>
						<div><strong>Email:</strong> {data.requester.email}</div>
						<div><strong>Country:</strong> {data.requester.country ?? 'Not specified'}</div>
					</div>
				</section>
				
				{/* Notes Section */}
				{data.notesList && data.notesList.length > 0 && (
					<section 
						aria-labelledby={`${summaryTitleId}-notes`}
						style={{ marginBottom: '24px' }}
					>
						<h3 
							id={`${summaryTitleId}-notes`}
							style={{ 
								color: '#007acc',
								borderBottom: '1px solid #ddd',
								paddingBottom: '4px',
								margin: '0 0 12px 0'
							}}
						>
							Notes ({data.notesList.length})
						</h3>
						<ol style={{ margin: 0, paddingLeft: '20px' }}>
							{data.notesList.map((note, index) => (
								<li key={index} style={{ marginBottom: '8px' }}>
									{note}
								</li>
							))}
						</ol>
					</section>
				)}
				
				{/* Evidence Section */}
				{data.evidence && data.evidence.length > 0 && (
					<section 
						aria-labelledby={`${summaryTitleId}-evidence`}
						style={{ marginBottom: '24px' }}
					>
						<h3 
							id={`${summaryTitleId}-evidence`}
							style={{ 
								color: '#007acc',
								borderBottom: '1px solid #ddd',
								paddingBottom: '4px',
								margin: '0 0 12px 0'
							}}
						>
							Evidence Files ({data.evidence.length})
						</h3>
						<ul style={{ margin: 0, paddingLeft: '20px' }}>
							{data.evidence.map((file, index) => (
								<li key={index} style={{ marginBottom: '4px' }}>
									{file}
								</li>
							))}
						</ul>
					</section>
				)}
				
				{/* History Section */}
				{data.history && data.history.length > 0 && (
					<section 
						aria-labelledby={`${summaryTitleId}-history`}
						style={{ marginBottom: '24px' }}
					>
						<h3 
							id={`${summaryTitleId}-history`}
							style={{ 
								color: '#007acc',
								borderBottom: '1px solid #ddd',
								paddingBottom: '4px',
								margin: '0 0 12px 0'
							}}
						>
							Case History ({data.history.length})
						</h3>
						<ol style={{ margin: 0, paddingLeft: '20px' }}>
							{data.history.map((entry, index) => (
								<li key={index} style={{ marginBottom: '8px' }}>
									{entry}
								</li>
							))}
						</ol>
					</section>
				)}
				
				{/* JSON Export Section */}
				<section style={{ marginBottom: '24px', pageBreakBefore: 'always' }}>
					<h3 style={{ 
						color: '#007acc',
						borderBottom: '1px solid #ddd',
						paddingBottom: '4px',
						margin: '0 0 12px 0'
					}}>
						Deterministic JSON Export
					</h3>
					<pre 
						aria-label="Deterministic JSON export of case data"
						style={{
							background: '#f8f9fa',
							border: '1px solid #e9ecef',
							borderRadius: '4px',
							padding: '16px',
							fontSize: '12px',
							lineHeight: '1.4',
							overflow: 'auto',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word'
						}}
					>
						{createDeterministicJson(data)}
					</pre>
				</section>
			</article>
			
			{/* Action Buttons */}
			<footer 
				className="k-actions k-actions-end" 
				style={{ 
					display: 'flex', 
					gap: '12px', 
					justifyContent: 'flex-end',
					padding: '16px 20px',
					borderTop: '1px solid #e9ecef',
					backgroundColor: '#f8f9fa'
				}}
			>
				<Button 
					onClick={handleDownloadJson}
					aria-label="Download case data as JSON file"
					title="Download case data as JSON file"
					icon="download"
				>
					Download JSON
				</Button>
				<Button 
					themeColor="primary"
					onClick={handlePrint}
					aria-label="Print this case summary"
					title="Print this case summary"
					icon="print"
				>
					Print
				</Button>
				<Button 
					onClick={onClose}
					aria-label="Close preview window"
					title="Close preview window"
				>
					Close
				</Button>
			</footer>
		</Window>
	);
}

