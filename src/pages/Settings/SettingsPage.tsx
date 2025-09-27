import { useEffect, useState } from 'react';
import { NumericTextBox } from '@progress/kendo-react-inputs';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { useRequestsStore } from '../../store/requests';

export default function SettingsPage() {
  const { settings, requests, saveSettings, load } = useRequestsStore();
  const [slaDays, setSlaDays] = useState(settings.slaDays);
  const [owners, setOwners] = useState<string[]>(settings.owners);
  const [newOwner, setNewOwner] = useState('');
  const [templates, setTemplates] = useState<string>(settings.templates || 'Thank you for your request. We will process it within the required timeframe.');
  const [nucliaKB, setNucliaKB] = useState<string>(() => {
    // Try to get from localStorage first, then from import.meta.env
    return localStorage.getItem('VITE_NUCLIA_KB') || import.meta.env.VITE_NUCLIA_KB || '';
  });

  // Track changes for unsaved state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(settings);

  useEffect(() => { 
    load(); 
  }, [load]);

  useEffect(() => {
    setSlaDays(settings.slaDays);
    setOwners(settings.owners);
    setOriginalSettings(settings);
    if (settings.templates) {
      setTemplates(settings.templates);
    }
    setHasUnsavedChanges(false);
  }, [settings]);

  // Check for changes
  useEffect(() => {
    const currentState = {
      slaDays,
      owners,
      templates
    };
    const originalState = {
      slaDays: originalSettings.slaDays,
      owners: originalSettings.owners,
      templates: originalSettings.templates || 'Thank you for your request. We will process it within the required timeframe.'
    };
    
    const hasChanges = JSON.stringify(currentState) !== JSON.stringify(originalState);
    setHasUnsavedChanges(hasChanges);
  }, [slaDays, owners, templates, originalSettings]);

  const handleSlaChange = (type: keyof typeof slaDays, value: number | null) => {
    const numValue = value || 30;
    const newSlaDays = { ...slaDays, [type]: numValue };
    setSlaDays(newSlaDays);
  };

  const handleAddOwner = () => {
    if (newOwner.trim() && !owners.includes(newOwner.trim())) {
      const newOwners = [...owners, newOwner.trim()];
      setOwners(newOwners);
      setNewOwner('');
    }
  };

  const handleRemoveOwner = (ownerToRemove: string) => {
    const newOwners = owners.filter(owner => owner !== ownerToRemove);
    setOwners(newOwners);
  };

  const handleTemplatesChange = (value: string) => {
    setTemplates(value);
  };

  const handleNucliaKBChange = (value: string) => {
    setNucliaKB(value);
    // Save to localStorage since we can't modify .env at runtime
    if (value.trim()) {
      localStorage.setItem('VITE_NUCLIA_KB', value.trim());
    } else {
      localStorage.removeItem('VITE_NUCLIA_KB');
    }
  };

  const handleSaveChanges = async () => {
    await saveSettings({ 
      slaDays, 
      owners, 
      templates 
    });
    setHasUnsavedChanges(false);
  };

  const handleDiscardChanges = () => {
    setSlaDays(originalSettings.slaDays);
    setOwners(originalSettings.owners);
    setTemplates(originalSettings.templates || 'Thank you for your request. We will process it within the required timeframe.');
    setHasUnsavedChanges(false);
  };

  const activeOwners = [...new Set(requests.map(r => r.owner).filter(Boolean))].length;
  const totalRequests = requests.length;
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="pd-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div className="muted" style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Settings</div>
          <h1 className="h1" style={{ marginBottom: 4 }}>Settings</h1>
          <p className="muted">Configure SLA policies, team members, and system preferences</p>
        </div>
        {hasUnsavedChanges && (
          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
            <Button onClick={handleSaveChanges} themeColor="primary">
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {hasUnsavedChanges && (
        <div style={{ 
          padding: 12, 
          marginBottom: 24, 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ color: '#92400e', fontSize: 14 }}>⚠️ You have unsaved changes</span>
          <span style={{ color: '#6b7280', fontSize: 14 }}>Remember to save your changes before navigating away from this page.</span>
        </div>
      )}

      <div style={{ display: 'grid', gap: 24 }}>
        {/* SLA Configuration */}
        <div className="pd-card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>SLA Configuration</h2>
          <p className="muted" style={{ marginBottom: 20 }}>Set response time requirements for each request type. Changes affect new requests only.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Access Requests</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NumericTextBox
                  value={slaDays.access}
                  onChange={(e) => handleSlaChange('access', e.value)}
                  style={{ width: 80 }}
                  min={1}
                  max={365}
                />
                <span style={{ color: '#6b7280', fontSize: 14 }}>days</span>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Delete Requests</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NumericTextBox
                  value={slaDays.delete}
                  onChange={(e) => handleSlaChange('delete', e.value)}
                  style={{ width: 80 }}
                  min={1}
                  max={365}
                />
                <span style={{ color: '#6b7280', fontSize: 14 }}>days</span>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Export Requests</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NumericTextBox
                  value={slaDays.export}
                  onChange={(e) => handleSlaChange('export', e.value)}
                  style={{ width: 80 }}
                  min={1}
                  max={365}
                />
                <span style={{ color: '#6b7280', fontSize: 14 }}>days</span>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Correct Requests</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NumericTextBox
                  value={slaDays.correct}
                  onChange={(e) => handleSlaChange('correct', e.value)}
                  style={{ width: 80 }}
                  min={1}
                  max={365}
                />
                <span style={{ color: '#6b7280', fontSize: 14 }}>days</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>Current SLA Summary:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, fontSize: 13, color: '#6b7280' }}>
              <div>Access: <span style={{ fontWeight: 600, color: '#374151' }}>{slaDays.access}d</span></div>
              <div>Delete: <span style={{ fontWeight: 600, color: '#374151' }}>{slaDays.delete}d</span></div>
              <div>Export: <span style={{ fontWeight: 600, color: '#374151' }}>{slaDays.export}d</span></div>
              <div>Correct: <span style={{ fontWeight: 600, color: '#374151' }}>{slaDays.correct}d</span></div>
            </div>
          </div>
        </div>

        {/* Team Owners */}
        <div className="pd-card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>Team Owners</h2>
          <p className="muted" style={{ marginBottom: 20 }}>Manage team members who can be assigned to privacy requests</p>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Enter owner name..."
                value={newOwner}
                onChange={(e) => setNewOwner(e.value as string)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOwner()}
              />
            </div>
            <Button 
              onClick={handleAddOwner}
              disabled={!newOwner.trim() || owners.includes(newOwner.trim())}
              themeColor="primary"
            >
              Add
            </Button>
          </div>

          <div>
            <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>Current Owners ({owners.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {owners.map((owner) => (
                <div
                  key={owner}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: 14
                  }}
                >
                  <span>{owner}</span>
                  <button
                    onClick={() => handleRemoveOwner(owner)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      fontSize: 14,
                      padding: 2
                    }}
                    title={`Remove ${owner}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response Templates */}
        <div className="pd-card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>Response Templates</h2>
          <p className="muted" style={{ marginBottom: 20 }}>Standard response messages for common communication scenarios</p>
          
          <div>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Default Response Template</div>
            <TextArea
              value={templates}
              onChange={(e) => handleTemplatesChange(e.value as string)}
              rows={4}
              style={{ width: '100%', resize: 'vertical' }}
              placeholder="Enter your default response template..."
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
              This template will be used as a starting point for communications with data subjects.
            </div>
          </div>
        </div>

        {/* Nuclia Configuration */}
        <div className="pd-card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>Nuclia Integration</h2>
          <p className="muted" style={{ marginBottom: 20 }}>Configure Nuclia Knowledge Base connection for AI-powered policy assistance</p>
          
          <div>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>Nuclia Knowledge Base ID</div>
            <Input
              value={nucliaKB}
              onChange={(e) => handleNucliaKBChange(e.value as string)}
              style={{ width: '100%' }}
              placeholder="Enter your Nuclia KB ID (e.g., 12345678-abcd-1234-efgh-123456789abc)"
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
              This ID connects the application to your Nuclia Knowledge Base for policy assistance.
              You can find this ID in your Nuclia dashboard under Knowledge Base settings.
            </div>
            {nucliaKB && (
              <div style={{ 
                marginTop: 12, 
                padding: 10, 
                backgroundColor: '#f0fdf4', 
                border: '1px solid #bbf7d0', 
                borderRadius: 6,
                fontSize: 13,
                color: '#15803d'
              }}>
                ✓ Nuclia KB configured: {nucliaKB.substring(0, 8)}...{nucliaKB.substring(nucliaKB.length - 8)}
              </div>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="pd-card" style={{ padding: 24 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>System Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Total Requests</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#374151' }}>{totalRequests}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Active Owners</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#374151' }}>{activeOwners}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Last Updated</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>{lastUpdated}</div>
            </div>
          </div>
          
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Data Storage</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>Local Browser Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
}
