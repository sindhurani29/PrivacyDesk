export default function SLAWidget({ dueAt }: { dueAt: string }) {
  const due = new Date(dueAt);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const text = diffDays >= 0 ? `${diffDays} days left` : `${Math.abs(diffDays)} days overdue`;
  return <span>{text}</span>;
}
