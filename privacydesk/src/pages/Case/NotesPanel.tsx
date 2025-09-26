import { useState, useRef } from 'react';
import type { TextAreaHandle } from '@progress/kendo-react-inputs';
import { TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { useStore } from '../../store';

export default function NotesPanel({ id }: { id: string }) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextAreaHandle | null>(null);
  const addNote = useStore((s) => s.addNote);
  const notes = useStore((s) => s.requests.find((r) => r.id === id)?.notesList ?? []);

  const handleAdd = () => {
    if (text.trim()) {
      addNote(id, text.trim());
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
    <section aria-labelledby={`notes-heading-${id}`}>
      <h4 id={`notes-heading-${id}`}>Notes</h4>
      <div>
        <TextArea
          value={text}
          onChange={(e) => setText((e.value as string) ?? '')}
          placeholder="Add a note"
          aria-label="Add a note"
          ref={inputRef}
        />
      </div>
      <div>
        <Button onClick={handleAdd} themeColor="primary" aria-label="Add note">Add Note</Button>
      </div>
      <ul aria-label="Notes list">
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </section>
  );
}
