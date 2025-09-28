import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { useRequestsStore } from '../../store/requests';

interface EvidenceFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'img' | 'xlsx' | 'other';
  size?: string;
  description?: string;
}

// Mock available files that could be attached as evidence
const AVAILABLE_FILES: EvidenceFile[] = [
  { id: 'file-001', name: 'user_database_export.csv', type: 'other', size: '2.3 MB', description: 'Database export for user records' },
  { id: 'file-002', name: 'gdpr_compliance_report.pdf', type: 'pdf', size: '856 KB', description: 'GDPR compliance documentation' },
  { id: 'file-003', name: 'user_activity_logs.txt', type: 'txt', size: '1.2 MB', description: 'User activity and access logs' },
  { id: 'file-004', name: 'data_processing_agreement.pdf', type: 'pdf', size: '324 KB', description: 'Legal agreement for data processing' },
  { id: 'file-005', name: 'identity_verification.jpg', type: 'img', size: '245 KB', description: 'Identity verification document' },
  { id: 'file-006', name: 'consent_records.xlsx', type: 'xlsx', size: '445 KB', description: 'User consent tracking spreadsheet' },
  { id: 'file-007', name: 'privacy_policy.pdf', type: 'pdf', size: '189 KB', description: 'Current privacy policy document' },
  { id: 'file-008', name: 'data_retention_policy.doc', type: 'doc', size: '156 KB', description: 'Data retention guidelines' },
  { id: 'file-009', name: 'audit_trail.txt', type: 'txt', size: '890 KB', description: 'System audit trail logs' },
  { id: 'file-010', name: 'legal_basis_documentation.pdf', type: 'pdf', size: '672 KB', description: 'Legal basis for data processing' }
];

function getFileIcon(type: EvidenceFile['type']): string {
  switch (type) {
    case 'pdf': return '📄';
    case 'doc': return '📝';
    case 'txt': return '📋';
    case 'img': return '🖼️';
    case 'xlsx': return '📊';
    default: return '📁';
  }
}

function FileItem({ 
  file, 
  isSelected, 
  onClick 
}: { 
  file: EvidenceFile; 
  isSelected: boolean; 
  onClick: () => void; 
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
        borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = '#f8fafc';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <span style={{ fontSize: '16px' }}>{getFileIcon(file.type)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, color: '#374151', marginBottom: '2px' }}>{file.name}</div>
        {file.description && (
          <div style={{ color: '#6b7280', fontSize: '12px', lineHeight: 1.3 }}>{file.description}</div>
        )}
        {file.size && (
          <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '2px' }}>{file.size}</div>
        )}
      </div>
    </div>
  );
}

export default function EvidencePanel() {
  const { id } = useParams<{ id: string }>();
  const { requests, updateRequest } = useRequestsStore();
  const request = requests.find(r => r.id === id);
  
  const [availableFiles, setAvailableFiles] = useState<EvidenceFile[]>(AVAILABLE_FILES);
  const [attachedFiles, setAttachedFiles] = useState<EvidenceFile[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAttached, setSelectedAttached] = useState<string[]>([]);

  // Initialize attached files from request data
  useEffect(() => {
    if (request?.attachments) {
      const attachedEvidence: EvidenceFile[] = request.attachments.map(att => ({
        id: att.id,
        name: att.name,
        type: 'other' as const,
        description: 'Uploaded evidence file'
      }));
      setAttachedFiles(attachedEvidence);
      
      // Remove already attached files from available files
      const attachedIds = new Set(attachedEvidence.map(f => f.name));
      setAvailableFiles(prev => prev.filter(f => !attachedIds.has(f.name)));
    }
  }, [request?.attachments]);

  // Persist changes to the store
  const persistToStore = useCallback(async (newAttachedFiles: EvidenceFile[]) => {
    if (!request) return;
    
    const attachments = newAttachedFiles.map(file => ({
      id: file.id,
      name: file.name,
      url: undefined // Mock files don't have URLs
    }));

    const updatedRequest = {
      ...request,
      attachments
    };

    await updateRequest(updatedRequest);
  }, [request, updateRequest]);

  const handleMoveRight = async () => {
    if (selectedAvailable.length === 0) return;

    const filesToMove = availableFiles.filter(file => selectedAvailable.includes(file.id));
    const newAttachedFiles = [...attachedFiles, ...filesToMove];
    const newAvailableFiles = availableFiles.filter(file => !selectedAvailable.includes(file.id));

    setAttachedFiles(newAttachedFiles);
    setAvailableFiles(newAvailableFiles);
    setSelectedAvailable([]);
    
    await persistToStore(newAttachedFiles);
  };

  const handleMoveLeft = async () => {
    if (selectedAttached.length === 0) return;

    const filesToMove = attachedFiles.filter(file => selectedAttached.includes(file.id));
    const newAvailableFiles = [...availableFiles, ...filesToMove];
    const newAttachedFiles = attachedFiles.filter(file => !selectedAttached.includes(file.id));

    setAvailableFiles(newAvailableFiles);
    setAttachedFiles(newAttachedFiles);
    setSelectedAttached([]);
    
    await persistToStore(newAttachedFiles);
  };

  const handleMoveAllRight = async () => {
    const newAttachedFiles = [...attachedFiles, ...availableFiles];
    setAttachedFiles(newAttachedFiles);
    setAvailableFiles([]);
    setSelectedAvailable([]);
    
    await persistToStore(newAttachedFiles);
  };

  const handleMoveAllLeft = async () => {
    const newAvailableFiles = [...availableFiles, ...attachedFiles];
    setAvailableFiles(newAvailableFiles);
    setAttachedFiles([]);
    setSelectedAttached([]);
    
    await persistToStore([]);
  };

  const toggleAvailableSelection = (fileId: string) => {
    setSelectedAvailable(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleAttachedSelection = (fileId: string) => {
    setSelectedAttached(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '16px', height: '500px' }}>
      {/* Available Files */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
          Available Files ({availableFiles.length})
        </h4>
        <div 
          style={{ 
            flex: 1, 
            border: '1px solid #d1d5db', 
            borderRadius: '8px', 
            overflow: 'auto',
            backgroundColor: '#ffffff'
          }}
        >
          {availableFiles.map(file => (
            <FileItem
              key={file.id}
              file={file}
              isSelected={selectedAvailable.includes(file.id)}
              onClick={() => toggleAvailableSelection(file.id)}
            />
          ))}
          {availableFiles.length === 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: '#6b7280', 
              fontSize: '14px',
              fontStyle: 'italic' 
            }}>
              No available files
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        gap: '8px',
        padding: '0 8px'
      }}>
        <Button
          onClick={handleMoveRight}
          disabled={selectedAvailable.length === 0}
          title="Move selected files to evidence"
          aria-label="Move selected available files to attached evidence"
          style={{ padding: '8px 12px', minWidth: '40px' }}
        >
          →
        </Button>
        <Button
          onClick={handleMoveLeft}
          disabled={selectedAttached.length === 0}
          title="Remove selected files from evidence"
          aria-label="Remove selected files from attached evidence"
          style={{ padding: '8px 12px', minWidth: '40px' }}
        >
          ←
        </Button>
        <Button
          onClick={handleMoveAllRight}
          disabled={availableFiles.length === 0}
          title="Move all available files to evidence"
          aria-label="Move all available files to attached evidence"
          style={{ padding: '8px 12px', minWidth: '40px' }}
        >
          ⇉
        </Button>
        <Button
          onClick={handleMoveAllLeft}
          disabled={attachedFiles.length === 0}
          title="Remove all files from evidence"
          aria-label="Remove all files from attached evidence"
          style={{ padding: '8px 12px', minWidth: '40px' }}
        >
          ⇇
        </Button>
      </div>

      {/* Attached Evidence */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
          Attached Evidence ({attachedFiles.length})
        </h4>
        <div 
          style={{ 
            flex: 1, 
            border: '1px solid #d1d5db', 
            borderRadius: '8px', 
            overflow: 'auto',
            backgroundColor: '#ffffff'
          }}
        >
          {attachedFiles.map(file => (
            <FileItem
              key={file.id}
              file={file}
              isSelected={selectedAttached.includes(file.id)}
              onClick={() => toggleAttachedSelection(file.id)}
            />
          ))}
          {attachedFiles.length === 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: '#6b7280', 
              fontSize: '14px',
              fontStyle: 'italic' 
            }}>
              No evidence attached
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
