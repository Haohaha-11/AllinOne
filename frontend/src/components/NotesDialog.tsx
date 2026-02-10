import React from 'react';

interface NotesDialogProps {
  item: any;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function NotesDialog({ item, notes, onNotesChange, onSave, onCancel }: NotesDialogProps) {
  return (
    <div className="dialog-overlay">
      <div className="dialog notes-dialog">
        <h2>📝 Notes for: {item.title}</h2>
        <p className="notes-hint">Write your notes in Markdown format</p>
        
        <div className="notes-editor">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="# My Notes&#10;&#10;Write your notes here in Markdown format...&#10;&#10;## Key Points&#10;- Point 1&#10;- Point 2"
            rows={15}
            autoFocus
          />
        </div>

        <div className="notes-info">
          <span className="char-count">{notes.length} characters</span>
          {item.notes_updated_at && (
            <span className="last-updated">
              Last updated: {new Date(item.notes_updated_at).toLocaleString()}
            </span>
          )}
        </div>

        <div className="dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onSave} className="btn-primary">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
