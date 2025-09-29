import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { useEffect, useRef } from 'react';
import type { ButtonHandle } from '@progress/kendo-react-buttons';

export interface ConfirmDialogProps {
  open: boolean;
  text: string;
  onOk: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, text, onOk, onCancel }: ConfirmDialogProps) {
  const cancelButtonRef = useRef<ButtonHandle>(null);

  useEffect(() => {
    if (open && cancelButtonRef.current?.element) {
      // Focus the cancel button when dialog opens for better UX
      cancelButtonRef.current.element.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <Dialog 
      title="Confirm Action" 
      onClose={onCancel}
      aria-describedby="confirm-dialog-text"
      aria-modal="true"
      // Focus trap is handled by Kendo Dialog by default
    >
      <div id="confirm-dialog-text" style={{ marginBottom: 16 }}>
        {text}
      </div>
      <DialogActionsBar>
        <Button 
          ref={cancelButtonRef}
          onClick={onCancel}
          aria-label="Cancel action"
        >
          Cancel
        </Button>
        <Button 
          themeColor="primary" 
          onClick={onOk}
          aria-label="Confirm action"
        >
          OK
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
}
