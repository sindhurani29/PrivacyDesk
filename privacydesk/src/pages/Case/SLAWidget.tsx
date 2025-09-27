export default function SLAWidget({ dueAt }: { dueAt: string }) {
  const due = new Date(dueAt);
  const now = new Date();
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const status: 'success' | 'warning' | 'error' =
    daysLeft > 3 ? 'success' : daysLeft >= 0 ? 'warning' : 'error';
  const label = daysLeft >= 0 ? `Due in ${daysLeft}d` : `Overdue ${Math.abs(daysLeft)}d`;

  // Define colors for different statuses
  const getStatusColor = () => {
    switch (status) {
      case 'success': return { bg: '#22c55e', color: 'white' };
      case 'warning': return { bg: '#f59e0b', color: 'white' };
      case 'error': return { bg: '#ef4444', color: 'white' };
      default: return { bg: '#6b7280', color: 'white' };
    }
  };

  const statusColor = getStatusColor();

  return (
    <section aria-label="SLA status" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 120 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 8px',
          backgroundColor: statusColor.bg,
          color: statusColor.color,
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '6px',
          border: 'none',
          minWidth: 'fit-content',
          whiteSpace: 'nowrap'
        }}
        aria-live="polite"
      >
        {label}
      </div>
    </section>
  );
}
