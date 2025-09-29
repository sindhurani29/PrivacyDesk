import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Badge } from '@progress/kendo-react-indicators';

interface SLAWidgetProps {
  submittedAt: string;
  dueAt: string;
}

export default function SLAWidget({ submittedAt, dueAt }: SLAWidgetProps) {
  const submitted = new Date(submittedAt);
  const due = new Date(dueAt);
  const now = new Date();
  
  // Calculate total SLA duration and elapsed time
  const totalSLATime = due.getTime() - submitted.getTime();
  const elapsedTime = now.getTime() - submitted.getTime();
  
  // Calculate progress percentage (0-100)
  const progressPercentage = Math.min(Math.max((elapsedTime / totalSLATime) * 100, 0), 100);
  
  // Calculate days left
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine badge status and text
  const getBadgeProps = (): { text: string; themeColor: 'success' | 'warning' | 'error' } => {
    if (daysLeft < 0) {
      return {
        text: `Overdue ${Math.abs(daysLeft)}d`,
        themeColor: 'error'
      };
    } else if (daysLeft <= 3) {
      return {
        text: `Due in ≤3d`,
        themeColor: 'warning'
      };
    } else {
      return {
        text: `Due in ${daysLeft}d`,
        themeColor: 'success'
      };
    }
  };

  const badgeProps = getBadgeProps();

  // Determine progress bar color based on status
  const getProgressBarColor = (): string => {
    if (daysLeft < 0) return '#ef4444'; // red for overdue
    if (daysLeft <= 3) return '#f59e0b'; // amber for due soon
    return '#22c55e'; // green for on track
  };

  return (
    <section 
      aria-label="SLA status" 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        minWidth: '200px',
        maxWidth: '220px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontSize: '14px' 
        }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>SLA Progress</span>
          <span style={{ color: '#6b7280' }}>{Math.round(progressPercentage)}%</span>
        </div>
        <ProgressBar
          value={progressPercentage}
          style={{
            height: '8px',
            backgroundColor: '#e5e7eb'
          }}
          progressStyle={{
            backgroundColor: getProgressBarColor()
          }}
          aria-label={`SLA progress: ${Math.round(progressPercentage)}% elapsed`}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Badge
          themeColor={badgeProps.themeColor}
          size="medium"
          aria-live="polite"
          style={{
            fontWeight: 600,
            fontSize: '12px',
            position: 'relative',
            zIndex: 1
          }}
        >
          {badgeProps.text}
        </Badge>
      </div>
    </section>
  );
}
