import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Badge } from '@progress/kendo-react-indicators';

export default function SLAWidget({ dueAt, maxDays = 30 }: { dueAt: string; maxDays?: number }) {
  const due = new Date(dueAt);
  const now = new Date();
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const status: 'success' | 'warning' | 'error' =
    daysLeft > 3 ? 'success' : daysLeft >= 0 ? 'warning' : 'error';
  const label = daysLeft >= 0 ? `Due in ${daysLeft}d` : `Overdue ${Math.abs(daysLeft)}d`;

  const value = Math.max(0, Math.min(maxDays, daysLeft));

  return (
    <div>
      <Badge themeColor={status}>{label}</Badge>
      <ProgressBar min={0} max={maxDays} value={value} />
    </div>
  );
}
