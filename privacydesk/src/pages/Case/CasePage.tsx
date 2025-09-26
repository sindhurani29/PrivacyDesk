import { useParams } from 'react-router-dom';
import { useState, useId, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { Badge } from '@progress/kendo-react-indicators';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import type { DropDownListHandle } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { TextArea, Input } from '@progress/kendo-react-inputs';
import SLAWidget from './SLAWidget';
import NotesPanel from './NotesPanel';

const OWNER_OPTIONS = ['Alex', 'Priya', 'Jordan', 'Sam', 'Taylor', 'Unassigned'];

export default function CasePage() {
  const { id } = useParams();
  const req = useStore((s) => s.requests.find((r) => r.id === id));
  const setOwner = useStore((s) => s.setOwner);
  const closeRequest = useStore((s) => s.closeRequest);
  const [selected, setSelected] = useState(0);
  const [showClose, setShowClose] = useState(false);
  const [decision, setDecision] = useState<'done' | 'rejected' | ''>('');
  const [rationale, setRationale] = useState('');
  const [citation, setCitation] = useState('');
  const dialogDescId = useId();
  const decisionRef = useRef<DropDownListHandle | null>(null);

  useEffect(() => {
    if (showClose) {
      // Focus the first interactive field when the dialog opens
      decisionRef.current?.focus();
    }
  }, [showClose]);

  if (!req) return <div>Case not found.</div>;

  const handleExport = () => {
    // Minimal export: download the JSON as a file
    const blob = new Blob([JSON.stringify(req, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${req.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      {/* Header */}
      <div className="k-toolbar k-toolbar-resizable" role="toolbar" aria-label="Case Header">
        <div className="k-toolbar-item">
          <Badge themeColor={statusColor(req.status)} aria-label={`Status: ${req.status}`} aria-live="polite">{req.status}</Badge>
        </div>
        <div className="k-toolbar-item">
          <DropDownList
            data={OWNER_OPTIONS}
            value={req.owner}
            onChange={(e) => setOwner(req.id, String(e.value))}
            aria-label="Owner"
          />
        </div>
        <div className="k-toolbar-item">
          <SLAWidget dueAt={req.dueAt} />
        </div>
        <div className="k-spacer" />
        <div className="k-toolbar-item">
          <Button onClick={handleExport} aria-label="Export case as JSON">Export</Button>
        </div>
        <div className="k-toolbar-item">
          <Button themeColor="primary" onClick={() => setShowClose(true)} aria-label="Open Close Request dialog">Close Request</Button>
        </div>
      </div>

      {/* Tabs */}
      <TabStrip selected={selected} onSelect={(e) => setSelected(e.selected)} aria-label="Case content">
        <TabStripTab title="Overview">
          <div>
            <h3>Overview</h3>
            <div>Requester: {req.requester.name ?? ''} ({req.requester.email})</div>
            <div>Type: {req.type}</div>
            <div>Submitted: {new Date(req.submittedAt).toLocaleString()}</div>
          </div>
        </TabStripTab>
        <TabStripTab title="Notes">
          <NotesPanel id={req.id} />
        </TabStripTab>
        <TabStripTab title="Evidence">
          <ul>
            {(req.evidence ?? []).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </TabStripTab>
        <TabStripTab title="History">
          <ul>
            {(req.history ?? []).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </TabStripTab>
      </TabStrip>

      {showClose && (
        <Dialog title="Close Request" onClose={() => setShowClose(false)} aria-describedby={dialogDescId}>
          <div id={dialogDescId}>
            <div>
              <span id="close-decision-label">Decision</span>
              <DropDownList
                aria-labelledby="close-decision-label"
                data={["done", "rejected"]}
                value={decision}
                onChange={(e) => setDecision((e.value as 'done' | 'rejected') ?? '')}
                ref={decisionRef}
              />
            </div>
            <div>
              <span id="close-rationale-label">Rationale</span>
              <TextArea
                aria-labelledby="close-rationale-label"
                value={rationale}
                onChange={(e) => setRationale((e.value as string) ?? '')}
              />
            </div>
            <div>
              <span id="close-citation-label">Citation URL</span>
              <Input
                aria-labelledby="close-citation-label"
                value={citation}
                onChange={(e) => setCitation((e.value as string) ?? '')}
              />
            </div>
          </div>
          <DialogActionsBar>
            <Button onClick={() => setShowClose(false)} aria-label="Cancel closing request">Cancel</Button>
            <Button
              themeColor="primary"
              disabled={!decision || !rationale.trim() || !citation.trim()}
              onClick={() => {
                if (!req) return;
                if (!decision) return;
                closeRequest(req.id, decision as 'done' | 'rejected', rationale.trim(), citation.trim());
                setShowClose(false);
              }}
              aria-label="Confirm close request"
            >
              Confirm
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </main>
  );
}

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | undefined {
  switch (status) {
    case 'done':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'rejected':
      return 'error';
    case 'waiting':
      return 'info';
    default:
      return undefined;
  }
}

