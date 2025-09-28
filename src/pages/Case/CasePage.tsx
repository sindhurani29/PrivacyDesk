import { useParams } from 'react-router-dom';
import { useState, useId, useEffect, useRef } from 'react';
import { useRequestsStore } from '../../store/requests';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import type { DropDownListHandle } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { TextArea, Input } from '@progress/kendo-react-inputs';
import SLAWidget from './SLAWidget';
import { formatDateTime } from '../../lib/date';
import NotesPanel from './NotesPanel';
import EvidencePanel from './EvidencePanel';
import NucliaAssistant from './NucliaAssistant';
import PreviewWindow from '../Runbook/PreviewWindow';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { useToast } from '../../components/Common/Toaster';

const OWNER_OPTIONS = ['Alex', 'Priya', 'Jordan', 'Sam', 'Taylor', 'Unassigned'];

export default function CasePage() {
  const { id } = useParams();
  const { requests, setOwner, closeRequest, load } = useRequestsStore();
  const req = requests.find((r) => r.id === id);
  const showToast = useToast();
  const [selected, setSelected] = useState(0);
  const [showClose, setShowClose] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [decision, setDecision] = useState<'done' | 'rejected' | ''>('');
  const [rationale, setRationale] = useState('');
  const [citation, setCitation] = useState('');
  const [policyHelperExpanded, setPolicyHelperExpanded] = useState(true);
  const dialogDescId = useId();
  const decisionRef = useRef<DropDownListHandle | null>(null);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    if (showClose) {
      // Focus the first interactive field when the dialog opens
      decisionRef.current?.focus();
    }
  }, [showClose]);

  if (!req) return <div>Case not found.</div>;

  // Ensure data is loaded when landing directly on a case route
  useEffect(() => { load(); }, [load]);

  // Calculate SLA progress
  const calculateSLAProgress = () => {
    const submitted = new Date(req.submittedAt);
    const due = new Date(req.dueAt);
    const now = new Date();
    const totalTime = due.getTime() - submitted.getTime();
    const elapsedTime = now.getTime() - submitted.getTime();
    const percentage = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
    return Math.round(percentage);
  };

  const handleCloseRequest = async () => {
    if (!req || !decision || !rationale.trim() || !citation.trim()) return;
    
    try {
      await closeRequest(req.id, decision as 'done' | 'rejected', rationale.trim(), citation.trim());
      const statusText = decision === 'done' ? 'completed' : 'rejected';
      showToast({ text: `Request ${req.id} ${statusText} successfully`, type: 'success' });
      setShowClose(false);
      setShowCloseConfirm(false);
      setShowRejectConfirm(false);
      // Reset form
      setDecision('');
      setRationale('');
      setCitation('');
    } catch (error) {
      showToast({ text: 'Failed to update request. Please try again.', type: 'error' });
    }
  };

  const handleCloseButtonClick = () => {
    if (!decision || !rationale.trim() || !citation.trim()) {
      return;
    }

    if (decision === 'done') {
      setShowCloseConfirm(true);
    } else if (decision === 'rejected') {
      setShowRejectConfirm(true);
    }
  };

  return (
    <main className="pd-page">
      <div aria-label="Breadcrumb" style={{ marginBottom: 16, fontSize: 14, color: '#6b7280' }}>
        <a href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>Dashboard</a> / 
        <a href="/requests" style={{ color: '#3b82f6', textDecoration: 'none', margin: '0 4px' }}>Requests</a> / 
        <span style={{ color: '#374151' }}>Case {req.id}</span>
      </div>

      {/* Header */}
      <div className="k-toolbar k-toolbar-resizable pd-card" role="toolbar" aria-label="Case Header" style={{ padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <h1 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          color: '#374151', 
          margin: 0, 
          flex: '0 1 auto',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '300px'
        }}>{req.id}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
          <span className={`pill ${req.type === 'export' ? 'green' : req.type === 'access' ? 'blue' : req.type === 'delete' ? 'red' : 'yellow'}`}>
            {req.type}
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#ffffff',
              backgroundColor: getStatusColor(req.status),
              textTransform: 'capitalize',
              minWidth: '60px',
              height: '24px'
            }}
            aria-label={`Status: ${req.status}`}
            aria-live="polite"
          >
            {req.status === 'in_progress' ? 'In Progress' : req.status}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
          <span style={{ fontSize: 14, color: '#6b7280' }}>Owner:</span>
          <DropDownList
            data={OWNER_OPTIONS}
            value={req.owner}
            onChange={(e) => setOwner(req.id, String(e.value))}
            aria-label="Owner"
            style={{ minWidth: 120 }}
          />
        </div>

        <div style={{ flex: '0 0 auto' }}>
          <SLAWidget submittedAt={req.submittedAt} dueAt={req.dueAt} />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flex: '0 0 auto' }}>
          <Button onClick={() => setShowExport(true)} aria-label="Export case">Export</Button>
          <Button themeColor="primary" onClick={() => setShowClose(true)} aria-label="Open Close Request dialog">
            Close Request
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <TabStrip selected={selected} onSelect={(e) => setSelected(e.selected)} aria-label="Case content tabs" className="pd-card" style={{ padding: 0 }}>
            <TabStripTab title="Overview" aria-label="Overview tab">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 24 }}>
                {/* Requester Information */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Requester Information</h3>
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Name</div>
                      <div style={{ fontSize: 14, color: '#6b7280' }}>{req.requester.name || 'Not provided'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Email</div>
                      <div style={{ fontSize: 14, color: '#6b7280' }}>{req.requester.email}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Country</div>
                      <div style={{ fontSize: 14, color: '#6b7280' }}>{req.requester.country || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                {/* SLA Progress */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>SLA Progress</h3>
                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Time Elapsed</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{calculateSLAProgress()}%</span>
                      </div>
                      <div style={{ width: '100%', height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${calculateSLAProgress()}%`, 
                            height: '100%', 
                            backgroundColor: '#3b82f6',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                        Submitted: {formatDateTime(req.submittedAt)}
                      </div>
                      <div style={{ fontSize: 14, color: '#6b7280' }}>
                        Due: {formatDateTime(req.dueAt)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Export Section in Overview */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, gridColumn: 'span 2' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Export Case Data</h3>
                  <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
                    Export all case information including notes, evidence, and history for external review or archival.
                  </p>
                  <Button 
                    onClick={() => setShowExport(true)}
                    themeColor="primary"
                    style={{ padding: '8px 16px' }}
                    aria-label="Open export preview"
                  >
                    Open Export Preview
                  </Button>
                </div>
              </div>
            </TabStripTab>
            
            <TabStripTab title="Notes" aria-label={`Notes tab (${req.notes?.length || 0} notes)`}>
              <div style={{ padding: 24 }}>
                <NotesPanel id={req.id} />
              </div>
            </TabStripTab>
            
            <TabStripTab title="Evidence" aria-label={`Evidence tab (${req.attachments?.length || 0} files)`}>
              <div style={{ padding: 24 }}>
                <EvidencePanel />
              </div>
            </TabStripTab>
            
            <TabStripTab title="History" aria-label={`History tab (${req.history?.length || 0} events)`}>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>Request History</h3>
                {(req.history ?? []).length > 0 ? (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {(req.history ?? []).map((h, i) => (
                      <div key={i} style={{ 
                        padding: 12, 
                        backgroundColor: '#f8fafc', 
                        borderRadius: 8, 
                        fontSize: 14,
                        borderLeft: '3px solid #3b82f6'
                      }}>
                        <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                          {h.action}{h.details ? `: ${h.details}` : ''}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: 13 }}>
                          {formatDateTime(h.at)} • {h.who || 'System'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: 14, fontStyle: 'italic' }}>No history available</p>
                )}
              </div>
            </TabStripTab>
          </TabStrip>
        </div>

        {/* Policy Helper Sidebar */}
        {policyHelperExpanded ? (
          <div 
            className="pd-card" 
            style={{ 
              width: '400px',
              transition: 'all 0.3s ease',
              height: 'fit-content'
            }}
          >
            <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#374151' }}>Policy Helper</h4>
              <button
                onClick={() => setPolicyHelperExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: '#6b7280',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Collapse Policy Helper"
                title="Collapse"
              >
                →
              </button>
            </div>
            <div style={{ padding: 16 }}>
              <NucliaAssistant />
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'fixed',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              transition: 'all 0.3s ease'
            }}
          >
            <button
              onClick={() => setPolicyHelperExpanded(true)}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px 0 0 8px',
                cursor: 'pointer',
                padding: '12px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#374151',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s ease',
                height: '60px',
                width: '40px'
              }}
              aria-label="Expand Policy Helper"
              title="Expand Policy Helper"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              ←
            </button>
          </div>
        )}
      </div>

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
              onClick={handleCloseButtonClick}
              aria-label="Confirm close request"
            >
              Confirm
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}

      <PreviewWindow
        open={showExport}
        onClose={() => setShowExport(false)}
        data={{
          id: req.id,
          type: req.type,
          status: req.status,
          owner: req.owner,
          requester: req.requester,
          submittedAt: req.submittedAt,
          dueAt: req.dueAt,
          notesList: req.notes?.map(n => `${formatDateTime(n.at)} • ${n.who}: ${n.text}`) ?? [],
          evidence: req.attachments?.map(a => a.name) ?? [],
          history: req.history?.map(h => `${formatDateTime(h.at)} • ${h.action}${h.details ? `: ${h.details}` : ''}`) ?? [],
        }}
        title={`Export ${req.id}`}
      />

      <ConfirmDialog
        open={showCloseConfirm}
        text={`Are you sure you want to mark request ${req?.id} as completed? This action cannot be undone.`}
        onOk={handleCloseRequest}
        onCancel={() => setShowCloseConfirm(false)}
      />

      <ConfirmDialog
        open={showRejectConfirm}
        text={`Are you sure you want to reject request ${req?.id}? This action cannot be undone.`}
        onOk={handleCloseRequest}
        onCancel={() => setShowRejectConfirm(false)}
      />
    </main>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'done':
      return '#22c55e'; // Green
    case 'in_progress':
      return '#f59e0b'; // Orange/Amber
    case 'rejected':
      return '#ef4444'; // Red
    case 'waiting':
      return '#3b82f6'; // Blue
    case 'new':
      return '#8b5cf6'; // Purple
    default:
      return '#6b7280'; // Gray
  }
}
