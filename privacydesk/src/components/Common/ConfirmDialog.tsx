import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';

export default function ConfirmDialog({ open, title, message, onCancel, onConfirm }: { open: boolean; title: string; message: string; onCancel: () => void; onConfirm: () => void; }) {
  if (!open) return null;
  return (
    <Dialog title={title} onClose={onCancel} aria-describedby="confirm-desc">
      <div id="confirm-desc">{message}</div>
      <DialogActionsBar>
        <Button onClick={onCancel}>Cancel</Button>
        <Button themeColor="primary" onClick={onConfirm}>Confirm</Button>
      </DialogActionsBar>
    </Dialog>
  );
}
