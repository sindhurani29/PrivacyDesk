import { useState, useRef } from 'react';
import type { TextAreaHandle } from '@progress/kendo-react-inputs';
import { TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { useRequestsStore } from '../../store/requests';

export default function NotesPanel({ id }: { id: string }) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextAreaHandle | null>(null);
  const { requests, addNote } = useRequestsStore();
  const request = requests.find(r => r.id === id);
  const notes = request?.notes ?? [];

  const handleAdd = async () => {
    if (text.trim()) {
      await addNote(id, text.trim());
      setText('');
      // Return focus to the textarea for quick successive note entry
      if (inputRef.current?.focus) {
        inputRef.current.focus();
      } else {
        // Fallback to DOM element focus if available
        // @ts-expect-error element may exist on the handle
        inputRef.current?.element?.focus?.();
      }
    }
  };

  return (
    <section aria-labelledby={`notes-heading-${id}`} style={{ padding: '16px 0' }}>
      <h4 id={`notes-heading-${id}`} style={{ marginBottom: 16, fontSize: 18, fontWeight: 600, color: '#374151' }}>Notes</h4>
      
      <div style={{ marginBottom: 16 }}>
        <TextArea
          value={text}
          onChange={(e) => setText((e.value as string) ?? '')}
          placeholder="Add a note about this request..."
          aria-label="Add a note"
          ref={inputRef}
          style={{ width: '100%', minHeight: 80 }}
          rows={3}
        />
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <Button 
          onClick={handleAdd} 
          themeColor="primary" 
          aria-label="Add note"
          disabled={!text.trim()}
        >
          Add Note
        </Button>
      </div>
      
      {notes.length > 0 ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <h5 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: 0 }}>
            Previous Notes ({notes.length})
          </h5>
          {notes.map((note, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                backgroundColor: '#f8fafc',
                borderRadius: 8,
                fontSize: 14,
                borderLeft: '3px solid #3b82f6'
              }}
            >
              <div style={{ fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                {note.who} • {new Date(note.at).toLocaleString()}
              </div>
              <div style={{ color: '#6b7280', lineHeight: 1.5 }}>
                {note.text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0, fontStyle: 'italic' }}>
          No notes have been added yet.
        </p>
      )}
    </section>
  );
}
