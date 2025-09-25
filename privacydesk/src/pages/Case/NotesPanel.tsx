import { useState } from 'react';
import { TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { useStore } from '../../store';

export default function NotesPanel({ id }: { id: string }) {
  const [text, setText] = useState('');
  const addNote = useStore((s) => s.addNote);
  const notes = useStore((s) => s.requests.find((r) => r.id === id)?.notesList ?? []);

  const handleAdd = () => {
    if (text.trim()) {
      addNote(id, text.trim());
      setText('');
    }
  };

  return (
    <div>
      <div>
        <TextArea value={text} onChange={(e) => setText((e.value as string) ?? '')} placeholder="Add a note" />
      </div>
      <div>
        <Button onClick={handleAdd} themeColor="primary">Add Note</Button>
      </div>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
