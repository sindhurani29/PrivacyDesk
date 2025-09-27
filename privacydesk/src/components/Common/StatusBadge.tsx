import { Badge } from '@progress/kendo-react-indicators';

export default function StatusBadge({ status }: { status: 'new'|'in_progress'|'waiting'|'done'|'rejected' }) {
  const themeColor = status === 'done' ? 'success' : status === 'rejected' ? 'error' : status === 'waiting' ? 'info' : 'warning';
  return <Badge themeColor={themeColor}>{status}</Badge>;
}
